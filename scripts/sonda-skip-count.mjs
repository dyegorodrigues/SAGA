import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 5211;
const BASE = `http://localhost:${PORT}/sonda/skip-count.html`;
const CHROME = process.env.SONDA_CHROME || chromium.executablePath();
const ARTIFACTS = path.resolve(".artifacts/sonda-skip-count");
const WIDTHS = [320, 390, 900];

function assert(ok, message) { if (!ok) throw new Error(message); }

async function startVite() {
  const proc = spawn("npx", ["vite", "--port", String(PORT), "--strictPort"], {
    stdio: ["ignore", "pipe", "pipe"], detached: true,
  });
  const log = [];
  proc.stderr.on("data", chunk => log.push(String(chunk)));
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("vite F30 não subiu em 40s")), 40_000);
    proc.stdout.on("data", chunk => {
      const text = String(chunk); log.push(text);
      if (text.includes("ready in")) { clearTimeout(timeout); resolve(); }
    });
    proc.on("exit", code => { clearTimeout(timeout); reject(new Error(`vite F30 saiu com ${code}: ${log.join("").slice(-400)}`)); });
  });
  return proc;
}

function stopGroup(proc) { if (proc?.pid) { try { process.kill(-proc.pid, "SIGTERM"); } catch {} } }

async function state(page) {
  return page.evaluate(() => {
    const probe = document.querySelector("[data-skip-count-probe]");
    const stageEl = document.querySelector("[data-skip-count-stage]");
    const stage = stageEl?.getBoundingClientRect();
    const tutorialStepRaw = probe?.getAttribute("data-tutorial-step") ?? "";
    return {
      innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      level: Number(probe?.getAttribute("data-level")),
      support: probe?.getAttribute("data-support") ?? "",
      step: Number(probe?.getAttribute("data-step")),
      start: Number(probe?.getAttribute("data-start")),
      answer: Number(probe?.getAttribute("data-answer")),
      limit: Number(probe?.getAttribute("data-limit")),
      sequence: JSON.parse(probe?.getAttribute("data-sequence") ?? "[]"),
      options: JSON.parse(probe?.getAttribute("data-options") ?? "[]"),
      tutorial: Number(probe?.getAttribute("data-tutorial") ?? 0),
      tutorialStep: tutorialStepRaw === "" ? null : Number(tutorialStepRaw),
      tutorialShow: JSON.parse(probe?.getAttribute("data-tutorial-show") ?? "null"),
      rt: probe?.getAttribute("data-rt") ?? "",
      resolutionSteps: Number(probe?.getAttribute("data-resolution-steps") ?? 0),
      genericOptions: probe?.getAttribute("data-generic-options") === "true",
      receipts: JSON.parse(probe?.getAttribute("data-receipts") ?? "[]"),
      line: Boolean(document.querySelector("[data-skip-count-line]")),
      hundred: Boolean(document.querySelector("[data-skip-count-hundred-chart]")),
      arcs: document.querySelectorAll("[data-salto-arco]").length,
      written: Boolean(document.querySelector("[data-sequencia-escrita]")),
      ownOptions: Boolean(document.querySelector("[data-skip-count-options]")),
      stage: stage ? { left: stage.left, right: stage.right } : null,
    };
  });
}

function checkBase(data, width, level) {
  const expectedSupport = level === 1 ? "reta-arcos" : level === 2 ? "reta" : level === 3 ? "reta-quadrado100" : level === 4 ? "sequencia" : "mental";
  const expectedStep = level === 1 ? 2 : level === 2 ? 10 : level === 3 ? 5 : null;
  assert(data.level === level, `F30 nível esperado ${level}, veio ${data.level}`);
  assert(data.support === expectedSupport, `F30 L${level} apoio ${data.support}`);
  if (expectedStep != null) assert(data.step === expectedStep, `F30 L${level} salto ${data.step}`);
  else assert(data.step >= 2 && data.step <= 10, `F30 L${level} salto fora da generalização 2..10: ${data.step}`);
  assert(data.start === (level === 5 ? data.start : 0), `F30 L${level} início inesperado`);
  if (level === 5) assert(data.start > 0, "F30 L5 não deslocou o início");
  assert(data.sequence.length >= 3, `F30 L${level} sequência curta`);
  for (let i = 1; i < data.sequence.length; i += 1) assert(data.sequence[i] - data.sequence[i - 1] === data.step, `F30 L${level} perdeu o salto uniforme`);
  assert(data.answer === data.sequence.at(-1) + data.step, `F30 L${level} resposta não deriva do item`);
  assert(data.answer <= data.limit, `F30 L${level} excedeu limite`);
  assert(data.resolutionSteps === 2, `F30 L${level} resolução deveria ter 2 passos`);
  assert(!data.genericOptions, `F30 L${level} grid genérico duplicaria resposta do palco`);
  assert(data.line === (level <= 3), `F30 L${level} retirada da reta divergente`);
  assert(data.hundred === (level === 3), `F30 L${level} Quadrado100 divergente`);
  assert((data.arcs > 0) === (level === 1), `F30 L${level} arcos divergentes`);
  assert(data.written, `F30 L${level} perdeu sequência escrita`);
  assert(data.ownOptions === (level >= 4), `F30 L${level} superfície de resposta divergente`);
  if (level === 5) assert(Number(data.rt) === 8, `F30 L5 RT observacional deveria ser 8s`);
  else assert(data.rt === "", `F30 L${level} RT antecipado`);
  assert(data.scrollWidth <= data.innerWidth + 1, `F30 L${level} overflow em ${width}px`);
  if (data.stage) assert(data.stage.left >= -1 && data.stage.right <= width + 1, `F30 L${level} palco fora do viewport`);
}

async function choose(page, data, value) {
  if (data.level <= 3) {
    await page.locator(`[data-reta-tick="${value}"]`).evaluate(el => el.click());
  } else {
    await page.getByRole("button", { name: String(value), exact: true }).click();
  }
}

async function exercise(page, width, level) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${BASE}?level=${level}&seed=3003`, { waitUntil: "networkidle" });
  await page.locator("[data-skip-count-probe]").waitFor();
  let data = await state(page);
  checkBase(data, width, level);

  const before = path.join(ARTIFACTS, `f30-${width}px-l${level}-before.png`);
  await page.screenshot({ path: before, fullPage: true });

  const wrong = data.options.find(option => option.valor !== data.answer);
  assert(wrong, `F30 L${level} sem hipótese errada para diagnóstico`);
  await choose(page, data, wrong.valor);
  await page.waitForFunction(() => JSON.parse(document.querySelector("[data-skip-count-probe]")?.getAttribute("data-receipts") ?? "[]").length >= 1);
  data = await state(page);
  assert(data.receipts.at(-1)?.correct === false, `F30 L${level} erro não foi registrado`);
  assert(Boolean(data.receipts.at(-1)?.meta?.misconception), `F30 L${level} erro perdeu misconception`);

  await choose(page, data, data.answer);
  await page.waitForFunction(() => JSON.parse(document.querySelector("[data-skip-count-probe]")?.getAttribute("data-receipts") ?? "[]").length >= 2);
  const after = await state(page);
  assert(after.receipts.at(-1)?.correct === true, `F30 L${level} acerto final perdido`);
  assert((after.receipts.at(-1)?.meta?.evidencias ?? []).includes(`contagem-saltos-passo-${data.step}`), `F30 L${level} não registrou evidência do salto ${data.step}`);
  if (level >= 4) assert((after.receipts.at(-1)?.meta?.evidencias ?? []).includes("contagem-saltos-sem-manipulavel"), `F30 L${level} perdeu evidência sem manipulável`);
  if (level === 5) assert((after.receipts.at(-1)?.meta?.evidencias ?? []).includes("contagem-saltos-inicio-deslocado"), "F30 L5 perdeu evidência de início deslocado");

  const afterShot = path.join(ARTIFACTS, `f30-${width}px-l${level}-after.png`);
  await page.screenshot({ path: afterShot, fullPage: true });
  return { width, level, step: data.step, receipts: after.receipts, screenshots: [path.relative(process.cwd(), before), path.relative(process.cwd(), afterShot)] };
}

async function onboarding(page, width) {
  await page.setViewportSize({ width, height: 900 });
  const steps = [];
  for (let step = 0; step < 4; step += 1) {
    await page.goto(`${BASE}?level=1&seed=3003&tutorialStep=${step}`, { waitUntil: "networkidle" });
    await page.locator("[data-skip-count-probe]").waitFor();
    const data = await state(page);
    checkBase(data, width, 1);
    assert(data.tutorial === 4 && data.tutorialStep === step, `F30 onboarding passo ${step} divergente`);
    assert(data.line && !data.hundred && data.receipts.length === 0, `F30 onboarding passo ${step} alterou o item`);
    const disabledTicks = await page.locator("[data-reta-tick]:disabled").count();
    assert(disabledTicks > 0, `F30 onboarding passo ${step} deixou interação ativa durante aula`);
    const shot = path.join(ARTIFACTS, `f30-${width}px-onboarding-${step + 1}.png`);
    await page.screenshot({ path: shot, fullPage: true });
    steps.push({ step, show: data.tutorialShow, screenshot: path.relative(process.cwd(), shot) });
  }
  return { width, steps };
}

fs.rmSync(ARTIFACTS, { recursive: true, force: true });
fs.mkdirSync(ARTIFACTS, { recursive: true });
let vite; let browser;
const results = []; const onboardingResults = []; const consoleErrors = []; const pageErrors = []; const failedResponses = [];
try {
  vite = await startVite();
  browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  page.on("console", msg => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
  page.on("pageerror", error => pageErrors.push(String(error)));
  page.on("response", response => { if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`); });
  for (const width of WIDTHS) {
    for (let level = 1; level <= 5; level += 1) results.push(await exercise(page, width, level));
    onboardingResults.push(await onboarding(page, width));
  }
  assert(pageErrors.length === 0, `F30 pageerror: ${pageErrors.join(" | ")}`);
  assert(failedResponses.length === 0, `F30 HTTP >=400: ${failedResponses.join(" | ")}`);
  assert(consoleErrors.filter(text => !text.includes("favicon")).length === 0, `F30 console.error: ${consoleErrors.join(" | ")}`);
  fs.writeFileSync(path.join(ARTIFACTS, "report.json"), JSON.stringify({ ok: true, results, onboarding: onboardingResults }, null, 2));
  console.log(`Sonda F30 OK — ${results.length} cenários + ${onboardingResults.length * 4} passos em Chrome real.`);
} catch (error) {
  fs.writeFileSync(path.join(ARTIFACTS, "report.json"), JSON.stringify({ ok: false, error: String(error), results, onboarding: onboardingResults, consoleErrors, pageErrors, failedResponses }, null, 2));
  throw error;
} finally {
  if (browser) await browser.close();
  stopGroup(vite);
}
