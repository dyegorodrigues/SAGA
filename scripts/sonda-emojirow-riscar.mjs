import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 5209;
const BASE = `http://localhost:${PORT}/sonda/emojirow-riscar.html`;
const CHROME = process.env.SONDA_CHROME || chromium.executablePath();
const ARTIFACTS = path.resolve(".artifacts/sonda-emojirow-riscar");
const WIDTHS = [320, 390, 900];

function assert(ok, message) {
  if (!ok) throw new Error(message);
}

async function startVite() {
  const proc = spawn("npx", ["vite", "--port", String(PORT), "--strictPort"], {
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });
  const log = [];
  proc.stderr.on("data", chunk => log.push(String(chunk)));
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("vite F15 não subiu em 40s")), 40_000);
    proc.stdout.on("data", chunk => {
      const text = String(chunk);
      log.push(text);
      if (text.includes("ready in")) {
        clearTimeout(timeout);
        resolve();
      }
    });
    proc.on("exit", code => {
      clearTimeout(timeout);
      reject(new Error(`vite F15 saiu com ${code}: ${log.join("").slice(-400)}`));
    });
  });
  return proc;
}

function stopGroup(proc) {
  if (!proc?.pid) return;
  try { process.kill(-proc.pid, "SIGTERM"); } catch {}
}

async function state(page) {
  return page.evaluate(() => {
    const probe = document.querySelector("[data-emojirow-riscar-probe]");
    const stage = document.querySelector("[data-emojirow-riscar-stage]")?.getBoundingClientRect();
    const tutorialStep = probe?.getAttribute("data-tutorial-step") ?? "";
    return {
      innerWidth: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      level: Number(probe?.getAttribute("data-level")),
      representation: probe?.getAttribute("data-representation") ?? "",
      total: Number(probe?.getAttribute("data-total")),
      remover: Number(probe?.getAttribute("data-remover")),
      restante: Number(probe?.getAttribute("data-restante")),
      tutorial: Number(probe?.getAttribute("data-tutorial") ?? 0),
      tutorialStep: tutorialStep === "" ? null : Number(tutorialStep),
      tutorialShow: JSON.parse(probe?.getAttribute("data-tutorial-show") ?? "null"),
      rt: probe?.getAttribute("data-rt") ?? "",
      genericOptions: probe?.getAttribute("data-generic-options") === "true",
      receipts: JSON.parse(probe?.getAttribute("data-receipts") ?? "[]"),
      literacy: Boolean(document.querySelector('[data-mode-literacy="riscar"]')),
      tutorialDemo: Boolean(document.querySelector('[data-mode-tutorial="riscar"]')),
      xMeansOut: [...document.querySelectorAll("p")].some(el => el.textContent?.trim() === "X = saiu"),
      marked: document.querySelectorAll('[data-marked="true"]').length,
      itemCount: document.querySelectorAll('[data-marked]').length,
      ghostMarks: document.querySelectorAll('[data-mark-style="ghost"]').length,
      markButtons: document.querySelectorAll('[role="button"][aria-label^="Riscar item"]').length,
      keyboard: Boolean(document.querySelector('[aria-label="Teclado de resposta"]')),
      equation: Boolean(document.querySelector('[data-equacao-riscar]')),
      answerButtons: document.querySelectorAll('[aria-label^="Responder "]').length,
      ghostHand: Boolean(document.querySelector('[data-mao-fantasma]')),
      warning: document.querySelector('[aria-live="polite"]')?.textContent?.trim() ?? "",
      stage: stage ? { left: stage.left, right: stage.right } : null,
    };
  });
}

function checkBase(data, width, level) {
  const expected = level <= 2 ? "x" : level === 3 ? "fantasma" : level === 4 ? "pre-riscado" : "simbolo";
  assert(data.level === level, `F15: nível esperado ${level}, veio ${data.level}`);
  assert(data.representation === expected, `F15 L${level}: representação ${data.representation}`);
  assert(data.total === data.remover + data.restante, `F15 L${level}: total não fecha`);
  assert(data.remover >= 1 && data.restante >= 1, `F15 L${level}: parte vazia`);
  assert(data.remover !== data.restante, `F15 L${level}: RESPONDE_O_REMOVIDO ambíguo`);
  assert(data.total <= (level <= 2 ? 5 : 10), `F15 L${level}: excedeu limite`);
  assert(data.scrollWidth <= data.innerWidth + 1, `F15 L${level}: overflow em ${width}px`);
  assert(!data.genericOptions, `F15 L${level}: barra genérica duplicaria resposta`);
  if (data.stage) assert(data.stage.left >= -1 && data.stage.right <= width + 1, `F15 L${level}: palco fora de ${width}px`);
  if (level === 5) assert(Number(data.rt) === 4, `F15 L5: RT deveria ser 4s, veio ${data.rt}`);
  else assert(data.rt === "", `F15 L${level}: RT antecipado`);
}

async function firstUnmarked(page) {
  return page.evaluate(() => {
    const el = [...document.querySelectorAll('[role="button"][aria-label^="Riscar item"]')][0];
    if (!(el instanceof HTMLElement)) return null;
    const match = /^Riscar item (\d+)$/.exec(el.getAttribute("aria-label") ?? "");
    if (!match) return null;
    const rect = el.getBoundingClientRect();
    return { index: Number(match[1]), x: rect.x, y: rect.y, w: rect.width, h: rect.height };
  });
}

async function strikeToTarget(page, data) {
  let current = data;
  let slotProof = null;
  while (current.marked < current.remover) {
    const before = await firstUnmarked(page);
    assert(before, "F15: faltou item antes de completar retirada");
    await page.getByRole("button", { name: `Riscar item ${before.index}`, exact: true }).click();
    await page.waitForFunction(index => Boolean(document.querySelector(`[aria-label="Item ${index} já riscado"]`)), before.index);
    const box = await page.locator(`[aria-label="Item ${before.index} já riscado"]`).boundingBox();
    assert(box, `F15: item ${before.index} sumiu após risco`);
    if (!slotProof) {
      slotProof = { dx: Math.abs(box.x - before.x), dy: Math.abs(box.y - before.y), dw: Math.abs(box.width - before.w), dh: Math.abs(box.height - before.h) };
      assert(Object.values(slotProof).every(delta => delta <= 1), `F15: item deslocou do slot ${JSON.stringify(slotProof)}`);
    }
    current = await state(page);
  }
  return slotProof;
}

async function exercise(page, width, level) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${BASE}?level=${level}&seed=1502`, { waitUntil: "networkidle" });
  await page.locator("[data-emojirow-riscar-probe]").waitFor();
  let data = await state(page);
  checkBase(data, width, level);

  if (level === 1) {
    assert(data.marked === 1 && data.ghostHand, "F15 L1: mão fantasma/primeiro risco ausente");
    assert(!data.equation && !data.keyboard, "F15 L1: cobrança precoce");
  } else if (level <= 3) {
    assert(data.marked === 0 && !data.equation && !data.keyboard, `F15 L${level}: retirada/cobrança precoce`);
  } else if (level === 4) {
    assert(data.marked === data.remover && data.markButtons === 0, "F15 L4: pré-riscado incorreto");
    assert(data.equation && data.keyboard && data.answerButtons === 11, "F15 L4: equação/teclado ausente");
  } else {
    assert(data.itemCount === 0 && data.marked === 0, "F15 L5: objetos vazaram no símbolo puro");
    assert(data.equation && data.keyboard && data.answerButtons === 11, "F15 L5: equação/teclado ausente");
  }

  const beforeShot = path.join(ARTIFACTS, `f15-${width}px-l${level}-before.png`);
  await page.screenshot({ path: beforeShot, fullPage: true });

  let slotProof = null;
  if (level <= 3) {
    slotProof = await strikeToTarget(page, data);
    data = await state(page);
    assert(!data.equation && !data.keyboard, `F15 L${level}: não respeitou pausa de 600ms`);
    await page.waitForTimeout(700);
    data = await state(page);
    assert(data.equation && data.keyboard && data.answerButtons === 11, `F15 L${level}: equação não abriu após retirada`);

    const extra = await firstUnmarked(page);
    if (extra) {
      const markedBefore = data.marked;
      await page.getByRole("button", { name: `Riscar item ${extra.index}`, exact: true }).click();
      const afterExtra = await state(page);
      assert(afterExtra.marked === markedBefore, `F15 L${level}: risco excedente alterou estado`);
      assert(afterExtra.warning === `Só ${data.remover}!`, `F15 L${level}: feedback de limite divergente`);
    }
  }

  if (level === 3) assert((await state(page)).ghostMarks === data.remover, "F15 L3: fantasma não representa removidos");

  if (level === 4) {
    await page.getByRole("button", { name: `Responder ${data.remover}`, exact: true }).click();
    await page.waitForFunction(() => JSON.parse(document.querySelector("[data-emojirow-riscar-probe]")?.getAttribute("data-receipts") ?? "[]").length >= 1);
    const wrong = await state(page);
    assert(wrong.receipts.at(-1)?.correct === false, "F15 L4: removido não foi erro");
    assert(wrong.receipts.at(-1)?.meta?.misconception === "RESPONDE_O_REMOVIDO", "F15 L4: diagnóstico removido perdido");
  }

  await page.getByRole("button", { name: `Responder ${data.restante}`, exact: true }).click();
  const expected = level === 4 ? 2 : 1;
  await page.waitForFunction(n => JSON.parse(document.querySelector("[data-emojirow-riscar-probe]")?.getAttribute("data-receipts") ?? "[]").length >= n, expected);
  const after = await state(page);
  assert(after.receipts.at(-1)?.correct === true, `F15 L${level}: acerto terminal não registrado`);
  if (level === 4) {
    assert((after.receipts.at(-1)?.meta?.evidencias ?? []).includes("mastery-disqualifier:RESPONDE_O_REMOVIDO"), "F15 L4: correção compraria domínio");
  }

  const afterShot = path.join(ARTIFACTS, `f15-${width}px-l${level}-after.png`);
  await page.screenshot({ path: afterShot, fullPage: true });
  return { width, level, slotProof, receipts: after.receipts, screenshots: [path.relative(process.cwd(), beforeShot), path.relative(process.cwd(), afterShot)] };
}

async function onboarding(page, width) {
  await page.setViewportSize({ width, height: 900 });
  const steps = [];
  for (let step = 0; step < 4; step += 1) {
    await page.goto(`${BASE}?level=1&seed=1502&tutorialStep=${step}`, { waitUntil: "networkidle" });
    await page.locator("[data-emojirow-riscar-probe]").waitFor();
    const data = await state(page);
    checkBase(data, width, 1);
    assert(data.tutorial === 4 && data.tutorialStep === step, `F15 onboarding passo ${step}: sequência divergente`);
    assert(data.markButtons === 0 && data.answerButtons === 0 && !data.keyboard, `F15 onboarding passo ${step}: cobrou antes de ensinar`);
    if (step === 0) {
      assert(data.tutorialShow?.alfabetizarModo === "riscar", "F15 onboarding: alfabetização de modo ausente");
      assert(data.literacy && data.xMeansOut && data.marked >= 1, "F15 onboarding: X=saiu não materializado");
    } else if (step === 1) {
      assert(data.tutorialShow?.destacarTodos === true && data.tutorialDemo && data.marked === 0, "F15 onboarding: todo íntegro ausente");
    } else if (step === 2) {
      assert(data.tutorialShow?.riscar === 0 && data.tutorialDemo && data.marked === 1, "F15 onboarding: demonstração de risco ausente");
    } else {
      assert(data.tutorialShow?.pulsarRestantes === true && data.tutorialDemo, "F15 onboarding: entrega da vez ausente");
    }
    const shot = path.join(ARTIFACTS, `f15-${width}px-onboarding-${step + 1}.png`);
    await page.screenshot({ path: shot, fullPage: true });
    steps.push({ step, show: data.tutorialShow, screenshot: path.relative(process.cwd(), shot) });
  }
  return { width, steps };
}

fs.rmSync(ARTIFACTS, { recursive: true, force: true });
fs.mkdirSync(ARTIFACTS, { recursive: true });
let vite;
let browser;
const results = [];
const onboardingResults = [];
const consoleErrors = [];
const pageErrors = [];
try {
  vite = await startVite();
  browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  page.on("console", msg => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
  page.on("pageerror", error => pageErrors.push(String(error)));
  for (const width of WIDTHS) {
    for (let level = 1; level <= 5; level += 1) results.push(await exercise(page, width, level));
    onboardingResults.push(await onboarding(page, width));
  }
  assert(pageErrors.length === 0, `F15 pageerror: ${pageErrors.join(" | ")}`);
  assert(consoleErrors.filter(text => !text.includes("favicon")).length === 0, `F15 console.error: ${consoleErrors.join(" | ")}`);
  fs.writeFileSync(path.join(ARTIFACTS, "report.json"), JSON.stringify({ ok: true, results, onboarding: onboardingResults }, null, 2));
  console.log(`Sonda F15 OK — ${results.length} cenários + ${onboardingResults.length * 4} passos em Chrome real.`);
} catch (error) {
  fs.writeFileSync(path.join(ARTIFACTS, "report.json"), JSON.stringify({ ok: false, error: String(error), results, onboarding: onboardingResults, consoleErrors, pageErrors }, null, 2));
  throw error;
} finally {
  if (browser) await browser.close();
  stopGroup(vite);
}
