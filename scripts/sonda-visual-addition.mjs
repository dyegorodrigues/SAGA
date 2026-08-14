import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 5208;
const BASE = `http://localhost:${PORT}/sonda/visual-addition.html`;
const CHROME = process.env.SONDA_CHROME || chromium.executablePath();
const ARTIFACTS = path.resolve(".artifacts/sonda-visual-addition");
const WIDTHS = [320, 390, 900];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function isExternalFontFailure(response) {
  return response.request().resourceType() === "font" && response.url().startsWith("https://fonts.gstatic.com/");
}

async function startVite() {
  const proc = spawn("npx", ["vite", "--port", String(PORT), "--strictPort"], {
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });
  const output = [];
  proc.stderr.on("data", data => output.push(String(data)));
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("vite da sonda F13 não subiu em 40s")), 40_000);
    proc.stdout.on("data", data => {
      const text = String(data);
      output.push(text);
      if (text.includes("ready in")) {
        clearTimeout(timeout);
        resolve();
      }
    });
    proc.on("exit", code => {
      clearTimeout(timeout);
      reject(new Error(`vite da sonda F13 saiu com ${code}\n${output.join("").slice(-500)}`));
    });
  });
  return proc;
}

function stopGroup(proc) {
  if (!proc?.pid) return;
  try { process.kill(-proc.pid, "SIGTERM"); } catch {}
}

async function snapshot(page) {
  return page.evaluate(() => {
    const probe = document.querySelector("[data-visual-addition-probe]");
    const stageEl = document.querySelector("[data-testid='visual-addition-f13']");
    const stage = stageEl?.getBoundingClientRect();
    const groupA = document.querySelector("[data-visual-addition-group='A'] > div");
    const groupB = document.querySelector("[data-visual-addition-group='B'] > div");
    const tutorialStepRaw = probe?.getAttribute("data-tutorial-step") ?? "";
    return {
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      level: Number(probe?.getAttribute("data-level")),
      representation: probe?.getAttribute("data-representation") ?? "",
      a: Number(probe?.getAttribute("data-a")),
      b: Number(probe?.getAttribute("data-b")),
      total: Number(probe?.getAttribute("data-total")),
      tutorial: Number(probe?.getAttribute("data-tutorial") ?? 0),
      tutorialStep: tutorialStepRaw === "" ? null : Number(tutorialStepRaw),
      tutorialFala: probe?.getAttribute("data-tutorial-fala") ?? "",
      tutorialShow: JSON.parse(probe?.getAttribute("data-tutorial-show") ?? "null"),
      rt: probe?.getAttribute("data-rt") ?? "",
      receipts: JSON.parse(probe?.getAttribute("data-receipts") ?? "[]"),
      merged: Boolean(document.querySelector("[data-visual-addition-merged]")),
      symbolic: Boolean(document.querySelector("[data-simbolo-puro]")),
      surface: Boolean(document.querySelector("[data-visual-addition]")),
      answerButtons: document.querySelectorAll("[data-resposta]").length,
      joinButton: Boolean(document.querySelector("[data-juntar-ajuda]")),
      objectGlyphs: document.querySelectorAll("[data-visual-addition-group] span[aria-hidden]").length,
      stage: stage ? { left: stage.left, right: stage.right, width: stage.width } : null,
      borderA: groupA ? getComputedStyle(groupA).borderColor : "",
      borderB: groupB ? getComputedStyle(groupB).borderColor : "",
    };
  });
}

function assertContract(data, width, level, { allowMerged = false } = {}) {
  const expected = level <= 3 ? "objetos" : level === 4 ? "numerais" : "simbolo";
  assert(data.level === level, `F13 nível divergente: esperado ${level}, veio ${data.level}`);
  assert(data.representation === expected, `F13 L${level} representação errada: ${data.representation}`);
  assert(data.a >= 1 && data.b >= 1, `F13 L${level} parcela não positiva`);
  assert(data.total === data.a + data.b, `F13 L${level} total não é a+b`);
  assert(data.total <= (level <= 2 ? 5 : 10), `F13 L${level} excedeu limite da ficha`);
  assert(data.scrollWidth <= data.innerWidth + 1, `F13 L${level} vazou em ${width}px: scrollWidth=${data.scrollWidth}`);
  assert(data.stage && data.stage.left >= -1 && data.stage.right <= width + 1, `F13 L${level} palco fora do viewport em ${width}px`);
  assert(data.answerButtons === 11, `F13 L${level} teclado deveria ter 11 respostas`);

  if (level <= 3) {
    assert(data.surface || (allowMerged && data.merged), `F13 L${level} perdeu VisualAddition`);
    assert(!data.symbolic, `F13 L${level} antecipou símbolo puro`);
    assert(data.objectGlyphs > 0, `F13 L${level} perdeu objetos`);
  }
  if (level === 2) assert(data.joinButton || (allowMerged && data.merged), "F13 L2 perdeu botão opcional de juntar");
  if (level !== 2) assert(!data.joinButton, `F13 L${level} exibiu botão de juntar fora do L2`);
  if (level === 4) {
    assert(data.surface, "F13 L4 perdeu os contêineres");
    assert(data.objectGlyphs === 0, "F13 L4 vazou objetos depois da retirada concreta");
  }
  if (level === 5) {
    assert(data.symbolic && !data.surface, "F13 L5 não ficou em símbolo puro");
    assert(Number(data.rt) === 5, `F13 L5 não propagou RT silencioso de 5s: ${data.rt}`);
  } else {
    assert(data.rt === "", `F13 L${level} ganhou RT antes do L5`);
  }
  if (level === 1) assert(data.tutorial === 3, `F13 L1 onboarding deveria ter 3 passos, veio ${data.tutorial}`);
}

async function probe(page, width, level) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${BASE}?level=${level}&seed=1301`, { waitUntil: "networkidle" });
  await page.locator("[data-visual-addition-probe]").waitFor();
  const before = await snapshot(page);
  assertContract(before, width, level);

  const beforeShot = path.join(ARTIFACTS, `f13-${width}px-l${level}-before.png`);
  await page.screenshot({ path: beforeShot, fullPage: true });

  if (level === 2) {
    await page.locator("[data-juntar-ajuda]").click();
    assert((await snapshot(page)).merged, `F13 L2 ajuda não fundiu grupos em ${width}px`);
  }

  await page.locator(`[data-resposta="${before.total}"]`).click();
  await page.waitForFunction(() => JSON.parse(document.querySelector("[data-visual-addition-probe]")?.getAttribute("data-receipts") ?? "[]").length >= 1);
  const after = await snapshot(page);
  const receipt = after.receipts.at(-1);
  assert(receipt?.correct === true, `F13 L${level} não fechou resposta correta em ${width}px`);
  assert(receipt?.meta?.visualAddition?.correta === true, `F13 L${level} perdeu processo no AnswerMeta`);
  if (level === 2) assert(receipt.meta?.visualAddition?.usouAjuda === true, `F13 L2 não registrou ajuda em ${width}px`);
  if (level === 4) {
    assert(receipt.meta?.evidencias?.includes("adicao-sem-objetos"), `F13 L4 não emitiu evidência sem objetos em ${width}px`);
  } else {
    assert(!(receipt.meta?.evidencias ?? []).includes("adicao-sem-objetos"), `F13 L${level} emitiu evidência L4 indevida`);
  }

  const afterShot = path.join(ARTIFACTS, `f13-${width}px-l${level}-after.png`);
  await page.screenshot({ path: afterShot, fullPage: true });
  return {
    width,
    level,
    before: { ...before, receipts: undefined },
    receipts: after.receipts,
    screenshots: [path.relative(process.cwd(), beforeShot), path.relative(process.cwd(), afterShot)],
  };
}

async function probeOnboarding(page, width) {
  const steps = [];
  await page.setViewportSize({ width, height: 900 });
  for (let step = 0; step < 3; step += 1) {
    await page.goto(`${BASE}?level=1&seed=1301&tutorialStep=${step}`, { waitUntil: "networkidle" });
    await page.locator("[data-visual-addition-probe]").waitFor();
    const data = await snapshot(page);
    assertContract(data, width, 1, { allowMerged: step === 2 });
    assert(data.tutorialStep === step, `F13 onboarding não ativou passo ${step}`);
    assert(data.tutorialFala.trim().length > 0, `F13 onboarding passo ${step} sem fala`);
    assert(data.tutorialShow && typeof data.tutorialShow === "object", `F13 onboarding passo ${step} sem show`);
    if (step === 0) {
      assert(data.tutorialShow.destacarGrupo === "A", "F13 onboarding passo 0 não destaca A");
      assert(data.borderA !== data.borderB, "F13 onboarding passo 0 não mudou o grupo A visualmente");
    } else if (step === 1) {
      assert(data.tutorialShow.destacarGrupo === "B", "F13 onboarding passo 1 não destaca B");
      assert(data.borderA !== data.borderB, "F13 onboarding passo 1 não mudou o grupo B visualmente");
    } else {
      assert(data.tutorialShow.fundirGrupos === true, "F13 onboarding passo 2 não manda fundir grupos");
      assert(data.merged, "F13 onboarding passo 2 não materializou a fusão");
    }
    const shot = path.join(ARTIFACTS, `f13-${width}px-onboarding-${step + 1}.png`);
    await page.screenshot({ path: shot, fullPage: true });
    steps.push({ step, fala: data.tutorialFala, show: data.tutorialShow, screenshot: path.relative(process.cwd(), shot) });
  }
  return { width, steps };
}

fs.rmSync(ARTIFACTS, { recursive: true, force: true });
fs.mkdirSync(ARTIFACTS, { recursive: true });

let vite;
let browser;
const consoleErrors = [];
const pageErrors = [];
const failedResponses = [];
const results = [];
const onboarding = [];
try {
  vite = await startVite();
  browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  page.on("console", message => {
    if (message.type() !== "error") return;
    const location = message.location();
    consoleErrors.push(location?.url ? `${message.text()} @ ${location.url}` : message.text());
  });
  page.on("pageerror", error => pageErrors.push(String(error)));
  page.on("response", response => {
    if (response.status() < 400 || isExternalFontFailure(response)) return;
    failedResponses.push(`${response.status()} ${response.url()}`);
  });

  for (const width of WIDTHS) {
    for (let level = 1; level <= 5; level += 1) results.push(await probe(page, width, level));
    onboarding.push(await probeOnboarding(page, width));
  }

  assert(pageErrors.length === 0, `F13 gerou pageerror: ${pageErrors.join(" | ")}`);
  assert(failedResponses.length === 0, `F13 recebeu HTTP >=400: ${failedResponses.join(" | ")}`);
  const actionableConsole = consoleErrors.filter(text => !text.includes("favicon") && !text.includes("Failed to load resource"));
  assert(actionableConsole.length === 0, `F13 gerou console.error: ${actionableConsole.join(" | ")}`);
  fs.writeFileSync(path.join(ARTIFACTS, "report.json"), JSON.stringify({ ok: true, results, onboarding }, null, 2));
  console.log(`Sonda F13 OK — ${results.length} cenários + ${onboarding.length * 3} passos de onboarding em Chrome real.`);
} catch (error) {
  fs.writeFileSync(path.join(ARTIFACTS, "report.json"), JSON.stringify({ ok: false, error: String(error), results, onboarding, consoleErrors, pageErrors, failedResponses }, null, 2));
  throw error;
} finally {
  if (browser) await browser.close();
  stopGroup(vite);
}