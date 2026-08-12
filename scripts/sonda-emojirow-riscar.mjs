import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 5209;
const BASE = `http://localhost:${PORT}/sonda/emojirow-riscar.html`;
const CHROME = process.env.SONDA_CHROME || chromium.executablePath();
const ARTIFACTS = path.resolve(".artifacts/sonda-emojirow-riscar");
const WIDTHS = [320, 390, 900];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function startVite() {
  const proc = spawn("npx", ["vite", "--port", String(PORT), "--strictPort"], {
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });
  const output = [];
  proc.stderr.on("data", data => output.push(String(data)));
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("vite da sonda F15 não subiu em 40s")), 40_000);
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
      reject(new Error(`vite da sonda F15 saiu com ${code}\n${output.join("").slice(-500)}`));
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
    const probe = document.querySelector("[data-emojirow-riscar-probe]");
    const stageEl = document.querySelector("[data-emojirow-riscar-stage]");
    const stage = stageEl?.getBoundingClientRect();
    const tutorialStepRaw = probe?.getAttribute("data-tutorial-step") ?? "";
    return {
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      level: Number(probe?.getAttribute("data-level")),
      representation: probe?.getAttribute("data-representation") ?? "",
      total: Number(probe?.getAttribute("data-total")),
      remover: Number(probe?.getAttribute("data-remover")),
      restante: Number(probe?.getAttribute("data-restante")),
      tutorial: Number(probe?.getAttribute("data-tutorial") ?? 0),
      tutorialStep: tutorialStepRaw === "" ? null : Number(tutorialStepRaw),
      tutorialFala: probe?.getAttribute("data-tutorial-fala") ?? "",
      tutorialShow: JSON.parse(probe?.getAttribute("data-tutorial-show") ?? "null"),
      rt: probe?.getAttribute("data-rt") ?? "",
      genericOptions: probe?.getAttribute("data-generic-options") === "true",
      receipts: JSON.parse(probe?.getAttribute("data-receipts") ?? "[]"),
      literacy: Boolean(document.querySelector('[data-mode-literacy="riscar"]')),
      tutorialDemo: Boolean(document.querySelector('[data-mode-tutorial="riscar"]')),
      stage: stage ? { left: stage.left, right: stage.right, width: stage.width } : null,
      marked: document.querySelectorAll('[data-marked="true"]').length,
      itemCount: document.querySelectorAll('[data-marked]').length,
      ghostMarks: document.querySelectorAll('[data-mark-style="ghost"]').length,
      markButtons: document.querySelectorAll('[role="button"][aria-label^="Riscar item"]').length,
      equation: Boolean(document.querySelector('[data-equacao-riscar]')),
      keyboard: Boolean(document.querySelector('[aria-label="Teclado de resposta"]')),
      answerButtons: document.querySelectorAll('[aria-label^="Responder "]').length,
      ghostHand: Boolean(document.querySelector('[data-mao-fantasma]')),
      warning: document.querySelector('[aria-live="polite"]')?.textContent?.trim() ?? "",
      xMeansOut: [...document.querySelectorAll("p")].some(el => el.textContent?.trim() === "X = saiu"),
    };
  });
}

function assertBase(data, width, level) {
  const expected = level <= 2 ? "x" : level === 3 ? "fantasma" : level === 4 ? "pre-riscado" : "simbolo";
  assert(data.level === level, `F15 nível divergente: esperado ${level}, veio ${data.level}`);
  assert(data.representation === expected, `F15 L${level} representação errada: ${data.representation}`);
  assert(data.total === data.remover + data.restante, `F15 L${level}: total != removido + restante`);
  assert(data.remover >= 1 && data.restante >= 1, `F15 L${level}: operação sem duas partes positivas`);
  assert(data.remover !== data.restante, `F15 L${level}: diagnóstico RESPONDE_O_REMOVIDO ficou ambíguo`);
  assert(data.total <= (level <= 2 ? 5 : 10), `F15 L${level}: excedeu limite da ficha`);
  assert(data.scrollWidth <= data.innerWidth + 1, `F15 L${level} vazou em ${width}px: scrollWidth=${data.scrollWidth}`);
  assert(!data.genericOptions, `F15 L${level}: barra genérica tentaria duplicar o teclado autoral`);
  if (data.stage) assert(data.stage.left >= -1 && data.stage.right <= width + 1, `F15 L${level}: palco saiu do viewport em ${width}px`);
  if (level === 5) assert(Number(data.rt) === 4, `F15 L5 não propagou RT FD3 de 4s: ${data.rt}`);
  else assert(data.rt === "", `F15 L${level} antecipou RT antes do L5`);
}

async function firstUnmarked(page) {
  return page.evaluate(() => {
    const el = [...document.querySelectorAll('[role="button"][aria-label^="Riscar item"]')][0];
    if (!(el instanceof HTMLElement)) return null;
    const label = el.getAttribute("aria-label") ?? "";
    const match = /Riscar item (\d+)/.exec(label);
    const rect = el.getBoundingClientRect();
    return match ? { index: Number(match[1]), left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null;
  });
}

async function strikeUntilTarget(page, initial) {
  let current = initial;
  let slotProof = null;
  while (current.marked < current.remover) {
    const before = await firstUnmarked(page);
    assert(before, "F15 ficou sem item disponível antes de completar a retirada");
    await page.getByRole("button", { name: `Riscar item ${before.index}` }).click();
    await page.waitForFunction(index => Boolean(document.querySelector(`[aria-label="Item ${index} já riscado"]`)), before.index);
    const afterRect = await page.locator(`[aria-label="Item ${before.index} já riscado"]`).boundingBox();
    assert(afterRect, `F15 não preservou o item ${before.index} marcado`);
    if (!slotProof) {
      slotProof = {
        index: before.index,
        dx: Math.abs(afterRect.x - before.left),
        dy: Math.abs(afterRect.y - before.top),
        dw: Math.abs(afterRect.width - before.width),
        dh: Math.abs(afterRect.height - before.height),
      };
      assert(slotProof.dx <= 1 && slotProof.dy <= 1 && slotProof.dw <= 1 && slotProof.dh <= 1,
        `F15 moveu o objeto riscado de slot: ${JSON.stringify(slotProof)}`);
    }
    current = await snapshot(page);
  }
  return { current, slotProof };
}

async function probe(page, width, level) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${BASE}?level=${level}&seed=1502`, { waitUntil: "networkidle" });
  await page.locator("[data-emojirow-riscar-probe]").waitFor();
  let before = await snapshot(page);
  assertBase(before, width, level);

  if (level === 1) {
    assert(before.marked === 1, `F15 L1 deveria começar com um risco guiado, veio ${before.marked}`);
    assert(before.ghostHand, "F15 L1 perdeu a mão fantasma do primeiro risco");
    assert(!before.equation && !before.keyboard, "F15 L1 cobrou resposta antes de completar a retirada");
  }
  if (level === 2 || level === 3) {
    assert(before.marked === 0, `F15 L${level} antecipou retirada`);
    assert(!before.equation && !before.keyboard, `F15 L${level} cobrou resposta antes da ação`);
  }
  if (level === 4) {
    assert(before.marked === before.remover, `F15 L4 não veio pré-riscado`);
    assert(before.markButtons === 0, "F15 L4 ainda permitiu gesto de retirada");
    assert(before.equation && before.keyboard && before.answerButtons === 11, "F15 L4 não abriu leitura/equação imediatamente");
  }
  if (level === 5) {
    assert(before.itemCount === 0 && before.marked === 0, "F15 L5 vazou objetos no símbolo puro");
    assert(before.equation && before.keyboard && before.answerButtons === 11, "F15 L5 perdeu equação/teclado simbólico");
  }

  const beforeShot = path.join(ARTIFACTS, `f15-${width}px-l${level}-before.png`);
  await page.screenshot({ path: beforeShot, fullPage: true });

  let slotProof = null;
  if (level <= 3) {
    const struck = await strikeUntilTarget(page, before);
    slotProof = struck.slotProof;
    const immediately = await snapshot(page);
    assert(!immediately.equation && !immediately.keyboard, `F15 L${level} não respeitou a pausa após o último risco`);
    await page.waitForTimeout(700);
    before = await snapshot(page);
    assert(before.equation && before.keyboard && before.answerButtons === 11, `F15 L${level} não liberou equação após 600ms`);

    const extra = await firstUnmarked(page);
    if (extra) {
      const markedBefore = before.marked;
      await page.getByRole("button", { name: `Riscar item ${extra.index}` }).click();
      const afterExtra = await snapshot(page);
      assert(afterExtra.marked === markedBefore, `F15 L${level} aceitou risco excedente`);
      assert(afterExtra.warning === `Só ${before.remover}!`, `F15 L${level} perdeu feedback de limite: ${afterExtra.warning}`);
    }
  }

  if (level === 3) {
    assert((await snapshot(page)).ghostMarks === before.remover, "F15 L3 não materializou os removidos como contorno fantasma");
  }

  if (level === 4) {
    await page.getByRole("button", { name: `Responder ${before.remover}` }).click();
    await page.waitForFunction(() => JSON.parse(document.querySelector("[data-emojirow-riscar-probe]")?.getAttribute("data-receipts") ?? "[]").length >= 1);
    const wrong = await snapshot(page);
    assert(wrong.receipts.at(-1)?.correct === false, "F15 L4 não registrou RESPONDE_O_REMOVIDO como erro");
    assert(wrong.receipts.at(-1)?.meta?.misconception === "RESPONDE_O_REMOVIDO", "F15 L4 perdeu diagnóstico do removido");
  }

  await page.getByRole("button", { name: `Responder ${before.restante}` }).click();
  const expectedReceipts = level === 4 ? 2 : 1;
  await page.waitForFunction(expected => JSON.parse(document.querySelector("[data-emojirow-riscar-probe]")?.getAttribute("data-receipts") ?? "[]").length >= expected, expectedReceipts);
  const after = await snapshot(page);
  const receipt = after.receipts.at(-1);
  assert(receipt?.correct === true, `F15 L${level} não fechou resposta correta em ${width}px`);
  if (level === 4) {
    const evidencias = receipt?.meta?.evidencias ?? [];
    assert(evidencias.includes("mastery-disqualifier:RESPONDE_O_REMOVIDO"), "F15 L4 perdeu sinal de correção que não compra domínio");
  }

  const afterShot = path.join(ARTIFACTS, `f15-${width}px-l${level}-after.png`);
  await page.screenshot({ path: afterShot, fullPage: true });
  return {
    width,
    level,
    before: { ...before, receipts: undefined },
    slotProof,
    receipts: after.receipts,
    screenshots: [path.relative(process.cwd(), beforeShot), path.relative(process.cwd(), afterShot)],
  };
}

async function probeModeLiteracy(page, width) {
  const steps = [];
  await page.setViewportSize({ width, height: 900 });
  for (let step = 0; step < 4; step += 1) {
    await page.goto(`${BASE}?level=1&seed=1502&tutorialStep=${step}`, { waitUntil: "networkidle" });
    await page.locator("[data-emojirow-riscar-probe]").waitFor();
    const data = await snapshot(page);
    assertBase(data, width, 1);
    assert(data.tutorial === 4, `F15 onboarding deveria ter 4 passos, veio ${data.tutorial}`);
    assert(data.tutorialStep === step, `F15 onboarding não ativou passo ${step}`);
    assert(data.tutorialFala.trim().length > 0, `F15 onboarding passo ${step} sem fala`);
    assert(data.tutorialShow && typeof data.tutorialShow === "object", `F15 onboarding passo ${step} sem show`);
    assert(!data.keyboard && data.answerButtons === 0 && data.markButtons === 0, `F15 onboarding passo ${step} cobrou conteúdo antes de ensinar o modo`);

    if (step === 0) {
      assert(data.tutorialShow.alfabetizarModo === "riscar", "F15 onboarding inicial não declarou alfabetização do modo");
      assert(data.literacy && data.xMeansOut, "F15 onboarding inicial não materializou X = saiu");
      assert(data.marked >= 1, "F15 onboarding inicial não mostrou objeto riscado no mesmo todo");
    } else if (step === 1) {
      assert(data.tutorialShow.destacarTodos === true, "F15 onboarding passo 1 não mostra o todo inteiro");
      assert(data.tutorialDemo && data.marked === 0, "F15 onboarding passo 1 já retirou objeto");
    } else if (step === 2) {
      assert(data.tutorialShow.riscar === 0, "F15 onboarding passo 2 não demonstra o primeiro risco");
      assert(data.tutorialDemo && data.marked === 1, "F15 onboarding passo 2 não manteve o primeiro riscado no lugar");
    } else {
      assert(data.tutorialShow.pulsarRestantes === true, "F15 onboarding passo 3 não entrega a vez à criança");
      assert(data.tutorialDemo, "F15 onboarding passo 3 não materializou a continuação");
    }

    const shot = path.join(ARTIFACTS, `f15-${width}px-onboarding-${step + 1}.png`);
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
const results = [];
const onboarding = [];
try {
  vite = await startVite();
  browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  page.on("console", message => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", error => pageErrors.push(String(error)));

  for (const width of WIDTHS) {
    for (let level = 1; level <= 5; level += 1) results.push(await probe(page, width, level));
    onboarding.push(await probeModeLiteracy(page, width));
  }

  assert(pageErrors.length === 0, `F15 gerou pageerror: ${pageErrors.join(" | ")}`);
  const actionableConsole = consoleErrors.filter(text => !text.includes("favicon"));
  assert(actionableConsole.length === 0, `F15 gerou console.error: ${actionableConsole.join(" | ")}`);
  fs.writeFileSync(path.join(ARTIFACTS, "report.json"), JSON.stringify({ ok: true, results, onboarding }, null, 2));
  console.log(`Sonda F15 OK — ${results.length} cenários + ${onboarding.length * 4} passos de alfabetização em Chrome real.`);
} catch (error) {
  fs.writeFileSync(path.join(ARTIFACTS, "report.json"), JSON.stringify({ ok: false, error: String(error), results, onboarding, consoleErrors, pageErrors }, null, 2));
  throw error;
} finally {
  if (browser) await browser.close();
  stopGroup(vite);
}
