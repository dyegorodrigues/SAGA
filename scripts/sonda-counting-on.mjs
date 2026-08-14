import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 5210;
const BASE = `http://localhost:${PORT}/sonda/counting-on.html`;
const CHROME = process.env.SONDA_CHROME || chromium.executablePath();
const ARTIFACTS = path.resolve(".artifacts/sonda-counting-on");
const WIDTHS = [320, 390, 900];

function assert(ok, message) { if (!ok) throw new Error(message); }
function isExternalFontFailure(response) {
  return response.request().resourceType() === "font" && response.url().startsWith("https://fonts.gstatic.com/");
}

async function startVite() {
  const proc = spawn("npx", ["vite", "--port", String(PORT), "--strictPort"], {
    stdio: ["ignore", "pipe", "pipe"], detached: true,
  });
  const log = [];
  proc.stderr.on("data", chunk => log.push(String(chunk)));
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("vite F14 não subiu em 40s")), 40_000);
    proc.stdout.on("data", chunk => {
      const text = String(chunk); log.push(text);
      if (text.includes("ready in")) { clearTimeout(timeout); resolve(); }
    });
    proc.on("exit", code => { clearTimeout(timeout); reject(new Error(`vite F14 saiu com ${code}: ${log.join("").slice(-400)}`)); });
  });
  return proc;
}

function stopGroup(proc) { if (proc?.pid) { try { process.kill(-proc.pid, "SIGTERM"); } catch {} } }

async function state(page) {
  return page.evaluate(() => {
    const probe = document.querySelector("[data-counting-on-probe]");
    const stageEl = document.querySelector("[data-counting-on-stage]");
    const stage = stageEl?.getBoundingClientRect();
    const tutorialStepRaw = probe?.getAttribute("data-tutorial-step") ?? "";
    return {
      innerWidth: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      level: Number(probe?.getAttribute("data-level")),
      representation: probe?.getAttribute("data-representation") ?? "",
      maior: Number(probe?.getAttribute("data-maior")),
      menor: Number(probe?.getAttribute("data-menor")),
      total: Number(probe?.getAttribute("data-total")),
      tutorial: Number(probe?.getAttribute("data-tutorial") ?? 0),
      tutorialStep: tutorialStepRaw === "" ? null : Number(tutorialStepRaw),
      tutorialShow: JSON.parse(probe?.getAttribute("data-tutorial-show") ?? "null"),
      rt: probe?.getAttribute("data-rt") ?? "",
      resolutionSteps: Number(probe?.getAttribute("data-resolution-steps") ?? 0),
      genericOptions: probe?.getAttribute("data-generic-options") === "true",
      receipts: JSON.parse(probe?.getAttribute("data-receipts") ?? "[]"),
      phase: stageEl?.getAttribute("data-fase") ?? "",
      marker: stageEl?.getAttribute("data-marcador") ?? "",
      counted: Number(stageEl?.getAttribute("data-cubos-contados") ?? 0),
      cubes: document.querySelectorAll("[data-linking-cube]").length,
      syncedSmall: document.querySelectorAll('[data-group-index="1"][data-synced="true"]').length,
      line: Boolean(document.querySelector("[data-counting-on-line]")),
      startChoice: Boolean(document.querySelector("[data-start-choice]")),
      answer: Boolean(document.querySelector("[data-counting-on-answer]")),
      ghostHand: Boolean(document.querySelector("[data-mao-fantasma]")),
      stage: stage ? { left: stage.left, right: stage.right } : null,
    };
  });
}

function checkBase(data, width, level) {
  const expected = level <= 2 ? "cubos-reta" : level === 3 ? "reta" : "simbolo";
  assert(data.level === level, `F14 nível esperado ${level}, veio ${data.level}`);
  assert(data.representation === expected, `F14 L${level} representação ${data.representation}`);
  assert(data.total === data.maior + data.menor, `F14 L${level} soma não fecha`);
  assert(data.maior > data.menor && data.menor >= 1, `F14 L${level} não distingue parcela maior`);
  assert(data.total <= (level <= 2 ? 10 : 20), `F14 L${level} excedeu limite`);
  if (level >= 3) assert(data.menor <= 3, `F14 L${level} parcela menor >3`);
  assert(data.resolutionSteps >= data.menor + 1, `F14 L${level} resolução curta`);
  assert(!data.genericOptions, `F14 L${level} opções genéricas duplicariam o palco`);
  assert(data.scrollWidth <= data.innerWidth + 1, `F14 L${level} overflow em ${width}px`);
  if (data.stage) assert(data.stage.left >= -1 && data.stage.right <= width + 1, `F14 L${level} palco fora do viewport`);
  if (level === 5) assert(Number(data.rt) === 6, `F14 L5 RT deveria ser 6s`);
  else assert(data.rt === "", `F14 L${level} RT antecipado`);
}

async function clickText(page, text) {
  await page.getByText(String(text), { exact: true }).last().click();
}

async function exercise(page, width, level) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${BASE}?level=${level}&seed=1403`, { waitUntil: "networkidle" });
  await page.locator("[data-counting-on-probe]").waitFor();
  let data = await state(page);
  checkBase(data, width, level);
  assert(data.startChoice, `F14 L${level} não mede ponto de partida`);
  assert(data.ghostHand === (level === 1), `F14 L${level} mão fantasma divergente`);
  assert(data.cubes > 0 === (level <= 2), `F14 L${level} retirada de cubos divergente`);
  assert(data.line === (level <= 3), `F14 L${level} retirada da reta divergente`);

  const before = path.join(ARTIFACTS, `f14-${width}px-l${level}-before.png`);
  await page.screenshot({ path: before, fullPage: true });

  // Prova diagnóstico estratégico: começar na parcela menor é tentativa real,
  // mas o palco continua na mesma questão.
  await page.getByRole("button", { name: `Do ${data.menor}`, exact: true }).click();
  await page.waitForFunction(() => JSON.parse(document.querySelector("[data-counting-on-probe]")?.getAttribute("data-receipts") ?? "[]").length >= 1);
  let afterWrongStart = await state(page);
  assert(afterWrongStart.receipts.at(-1)?.correct === false, `F14 L${level} partida menor não virou erro`);
  assert(afterWrongStart.receipts.at(-1)?.meta?.misconception === "NAO_ESCOLHE_MAIOR", `F14 L${level} diagnóstico de partida perdido`);
  assert(afterWrongStart.phase === "partida", `F14 L${level} erro de estratégia encerrou palco`);

  await page.getByRole("button", { name: `Do ${data.maior}`, exact: true }).click();
  data = await state(page);
  assert(Number(data.marker) === data.maior, `F14 L${level} não ancorou no maior`);

  if (level <= 3) {
    for (let i = 1; i <= data.menor; i += 1) {
      const expected = data.maior + i;
      await clickText(page, expected);
      data = await state(page);
      assert(Number(data.marker) === expected, `F14 L${level} salto ${i} não moveu marcador`);
      if (level <= 2) assert(data.syncedSmall === i, `F14 L${level} cubo↔casa perdeu sincronia no salto ${i}`);
    }
  }

  data = await state(page);
  assert(data.answer, `F14 L${level} não abriu resposta`);
  if (level === 4) {
    await clickText(page, data.total - 1);
    await page.waitForFunction(() => JSON.parse(document.querySelector("[data-counting-on-probe]")?.getAttribute("data-receipts") ?? "[]").length >= 2);
    const afterWrongAnswer = await state(page);
    assert(afterWrongAnswer.line, "F14 L4 não trouxe a reta após erro");
  }

  await clickText(page, data.total);
  const minReceipts = level === 4 ? 3 : 2;
  await page.waitForFunction(n => JSON.parse(document.querySelector("[data-counting-on-probe]")?.getAttribute("data-receipts") ?? "[]").length >= n, minReceipts);
  const after = await state(page);
  assert(after.receipts.at(-1)?.correct === true, `F14 L${level} acerto final perdido`);
  assert((after.receipts.at(-1)?.meta?.evidencias ?? []).includes("mastery-disqualifier:NAO_ESCOLHE_MAIOR"), `F14 L${level} correção estratégica compraria domínio`);

  const afterShot = path.join(ARTIFACTS, `f14-${width}px-l${level}-after.png`);
  await page.screenshot({ path: afterShot, fullPage: true });
  return { width, level, receipts: after.receipts, screenshots: [path.relative(process.cwd(), before), path.relative(process.cwd(), afterShot)] };
}

async function onboarding(page, width) {
  await page.setViewportSize({ width, height: 900 });
  const steps = [];
  for (let step = 0; step < 5; step += 1) {
    await page.goto(`${BASE}?level=1&seed=1403&tutorialStep=${step}`, { waitUntil: "networkidle" });
    await page.locator("[data-counting-on-probe]").waitFor();
    const data = await state(page);
    checkBase(data, width, 1);
    assert(data.tutorial === 5 && data.tutorialStep === step, `F14 onboarding passo ${step} divergente`);
    assert(data.phase === "demonstracao" && !data.startChoice && !data.answer, `F14 onboarding passo ${step} cobrou durante aula`);
    if (step >= 2 && step <= 3) assert(Number(data.marker) > data.maior, `F14 onboarding passo ${step} não materializou salto`);
    const shot = path.join(ARTIFACTS, `f14-${width}px-onboarding-${step + 1}.png`);
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
  page.on("response", response => { if (response.status() >= 400 && !isExternalFontFailure(response)) failedResponses.push(`${response.status()} ${response.url()}`); });
  for (const width of WIDTHS) {
    for (let level = 1; level <= 5; level += 1) results.push(await exercise(page, width, level));
    onboardingResults.push(await onboarding(page, width));
  }
  assert(pageErrors.length === 0, `F14 pageerror: ${pageErrors.join(" | ")}`);
  assert(failedResponses.length === 0, `F14 HTTP >=400: ${failedResponses.join(" | ")}`);
  const actionableConsoleErrors = consoleErrors.filter(text => !text.includes("favicon") && !text.includes("Failed to load resource"));
  assert(actionableConsoleErrors.length === 0, `F14 console.error: ${actionableConsoleErrors.join(" | ")}`);
  fs.writeFileSync(path.join(ARTIFACTS, "report.json"), JSON.stringify({ ok: true, results, onboarding: onboardingResults }, null, 2));
  console.log(`Sonda F14 OK — ${results.length} cenários + ${onboardingResults.length * 5} passos em Chrome real.`);
} catch (error) {
  fs.writeFileSync(path.join(ARTIFACTS, "report.json"), JSON.stringify({ ok: false, error: String(error), results, onboarding: onboardingResults, consoleErrors, pageErrors, failedResponses }, null, 2));
  throw error;
} finally {
  if (browser) await browser.close();
  stopGroup(vite);
}
