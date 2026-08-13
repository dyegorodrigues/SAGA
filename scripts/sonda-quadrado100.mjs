import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 5207;
const BASE = `http://localhost:${PORT}/sonda/quadrado100.html`;
const CHROME = process.env.SONDA_CHROME || chromium.executablePath();
const ARTIFACTS = path.resolve(".artifacts/sonda-quadrado100");
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
    const timeout = setTimeout(() => reject(new Error("vite da sonda F36 não subiu em 40s")), 40_000);
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
      reject(new Error(`vite da sonda F36 saiu com ${code}\n${output.join("").slice(-500)}`));
    });
  });
  return proc;
}

function stopGroup(proc) {
  if (!proc?.pid) return;
  try { process.kill(-proc.pid, "SIGTERM"); } catch {}
}

function passos(start, pathValues) {
  const all = [start, ...pathValues];
  return all.slice(1).map((value, index) => value - all[index]);
}

async function snapshot(page) {
  return page.evaluate(() => {
    const probe = document.querySelector("[data-quadrado100-probe]");
    const stage = document.querySelector("[data-testid='quadrado100-f36']")?.getBoundingClientRect();
    const grid = document.querySelector("[role='grid']")?.getBoundingClientRect();
    const cells = [...document.querySelectorAll("[data-quadrado100-cell]")].map(el => {
      const r = el.getBoundingClientRect();
      return {
        n: Number(el.getAttribute("data-quadrado100-cell")),
        hidden: el.getAttribute("data-hidden") === "true",
        text: el.textContent ?? "",
        aria: el.getAttribute("aria-label") ?? "",
        background: getComputedStyle(el).backgroundColor,
        width: r.width,
        height: r.height,
      };
    });
    const tutorialStepRaw = probe?.getAttribute("data-tutorial-step") ?? "";
    return {
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      level: Number(probe?.getAttribute("data-level")),
      mode: probe?.getAttribute("data-mode") ?? "",
      start: Number(probe?.getAttribute("data-start")),
      step: Number(probe?.getAttribute("data-step")),
      path: JSON.parse(probe?.getAttribute("data-path") ?? "[]"),
      hidden: JSON.parse(probe?.getAttribute("data-hidden") ?? "[]"),
      tutorial: Number(probe?.getAttribute("data-tutorial") ?? 0),
      tutorialStep: tutorialStepRaw === "" ? null : Number(tutorialStepRaw),
      tutorialFala: probe?.getAttribute("data-tutorial-fala") ?? "",
      tutorialShow: JSON.parse(probe?.getAttribute("data-tutorial-show") ?? "null"),
      tutorialLines: document.querySelectorAll("svg polyline").length,
      rt: probe?.getAttribute("data-rt") ?? "",
      receipts: JSON.parse(probe?.getAttribute("data-receipts") ?? "[]"),
      stage: stage ? { left: stage.left, right: stage.right, width: stage.width } : null,
      grid: grid ? { left: grid.left, right: grid.right, width: grid.width } : null,
      cells,
    };
  });
}

function assertContract(data, width, level) {
  const expectedModes = ["linha", "vertical", "cinco", "vizinho", "lacunas"];
  assert(data.level === level, `F36 nível divergente: esperado ${level}, veio ${data.level}`);
  assert(data.mode === expectedModes[level - 1], `F36 L${level} modo errado: ${data.mode}`);
  assert(data.scrollWidth <= data.innerWidth + 1, `F36 L${level} vazou em ${width}px: scrollWidth=${data.scrollWidth}`);
  assert(data.stage && data.stage.left >= -1 && data.stage.right <= width + 1, `F36 L${level} palco fora do viewport em ${width}px`);
  assert(data.grid && data.grid.left >= -1 && data.grid.right <= width + 1, `F36 L${level} grade fora do viewport em ${width}px`);
  assert(data.cells.length === 100, `F36 L${level} não renderizou 100 casas`);
  assert(data.cells.every(cell => cell.width >= 20 && cell.height >= 20), `F36 L${level} criou casa menor que 20px em ${width}px`);
  assert(data.path.length > 0, `F36 L${level} caminho vazio`);
  assert(data.path.every(n => n >= 1 && n <= 100), `F36 L${level} saiu de 1…100`);

  const hiddenSet = new Set(data.hidden);
  for (const cell of data.cells.filter(cell => cell.hidden)) {
    assert(hiddenSet.has(cell.n), `F36 L${level} ocultou casa fora do contrato: ${cell.n}`);
    assert(cell.text.trim() === "•", `F36 L${level} vazou ${cell.n} no texto visível`);
    // Linha/coluna são informação espacial legítima e podem coincidir por acaso
    // com o numeral escondido (ex.: casa 7 na linha 1, coluna 7). O vazamento
    // real é nomear a casa como "Número N" enquanto ela está oculta.
    assert(!cell.aria.includes(`Número ${cell.n}`), `F36 L${level} vazou ${cell.n} como resposta no nome acessível`);
    assert(cell.aria.startsWith("Casa vazia"), `F36 L${level} perdeu o nome acessível de casa vazia`);
  }

  if (level === 1) {
    assert(JSON.stringify(passos(data.start, data.path)) === JSON.stringify([1, 1, 1]), `F36 L1 perdeu +1 horizontal`);
    assert(data.tutorial > 0, "F36 L1 estreou Quadrado100 sem tutorial runtime");
  }
  if (level === 2) {
    assert(JSON.stringify(passos(data.start, data.path)) === JSON.stringify([10, 10, 10]), `F36 L2 perdeu +10 vertical`);
    assert(data.path.every(n => (n - 1) % 10 === (data.start - 1) % 10), "F36 L2 trocou de coluna");
  }
  if (level === 3) {
    assert(JSON.stringify(passos(data.start, data.path)) === JSON.stringify([5, 5, 5]), `F36 L3 perdeu passo +5`);
  }
  if (level === 4) {
    assert(data.path.length === 1 && data.path[0] - data.start === data.step, "F36 L4 vizinho não corresponde ao passo pedido");
    if (Math.abs(data.step) === 1) {
      assert(Math.floor((data.path[0] - 1) / 10) === Math.floor((data.start - 1) / 10), "F36 L4 fez wrap horizontal entre linhas");
    }
  }
  if (level === 5) {
    assert(data.hidden.length === 5 && new Set(data.hidden).size === 5, "F36 L5 não expôs cinco lacunas únicas");
    assert(JSON.stringify([...data.path].sort((a, b) => a - b)) === JSON.stringify([...data.hidden].sort((a, b) => a - b)), "F36 L5 cobra casas diferentes das lacunas");
    assert(Number(data.rt) === 10, `F36 L5 não propagou RT silencioso de 10s: ${data.rt}`);
  } else {
    assert(data.rt === "", `F36 L${level} ganhou RT antes do L5`);
  }
}

async function probe(page, width, level) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${BASE}?level=${level}&seed=3607`, { waitUntil: "networkidle" });
  await page.locator("[data-quadrado100-probe]").waitFor();
  const before = await snapshot(page);
  assertContract(before, width, level);

  const beforeShot = path.join(ARTIFACTS, `f36-${width}px-l${level}-before.png`);
  await page.screenshot({ path: beforeShot, fullPage: true });

  if (level === 2) {
    const column = (before.start - 1) % 10;
    const wrong = column < 9 ? before.start + 1 : before.start - 1;
    await page.locator(`[data-quadrado100-cell="${wrong}"]`).click();
    await page.waitForFunction(() => JSON.parse(document.querySelector("[data-quadrado100-probe]")?.getAttribute("data-receipts") ?? "[]").length === 1);
    const wrongReceipt = (await snapshot(page)).receipts[0];
    assert(wrongReceipt.correct === false, `F36 L2 marcou erro lateral como acerto em ${width}px`);
    assert(wrongReceipt.meta?.misconception === "confunde-direcao-quadrado100", `F36 L2 perdeu CONFUNDE_DIRECAO em ${width}px`);
    assert(wrongReceipt.meta?.quadrado100?.revisoes === 1, `F36 L2 não registrou revisão no AnswerMeta em ${width}px`);
  }

  for (const n of before.path) {
    await page.locator(`[data-quadrado100-cell="${n}"]`).click();
  }

  const expectedReceipts = level === 2 ? 2 : 1;
  await page.waitForFunction(expected => JSON.parse(document.querySelector("[data-quadrado100-probe]")?.getAttribute("data-receipts") ?? "[]").length >= expected, expectedReceipts);
  const after = await snapshot(page);
  const finalReceipt = after.receipts.at(-1);
  assert(finalReceipt?.correct === true, `F36 L${level} não fechou resposta correta em ${width}px`);
  assert(finalReceipt?.meta?.quadrado100?.completo === true, `F36 L${level} não emitiu processo completo no AnswerMeta`);
  assert(finalReceipt?.meta?.quadrado100?.caminho?.length === before.path.length, `F36 L${level} perdeu o caminho no AnswerMeta`);
  if (level === 2) {
    assert(finalReceipt.meta?.evidencias?.includes("percurso-vertical-quadrado100"), `F36 L2 não emitiu evidência vertical em ${width}px`);
  } else {
    assert(!(finalReceipt.meta?.evidencias ?? []).includes("percurso-vertical-quadrado100"), `F36 L${level} emitiu evidência vertical indevida`);
  }

  const afterShot = path.join(ARTIFACTS, `f36-${width}px-l${level}-after.png`);
  await page.screenshot({ path: afterShot, fullPage: true });
  return {
    width,
    level,
    before: { ...before, cells: undefined, receipts: undefined },
    receipts: after.receipts,
    screenshots: [path.relative(process.cwd(), beforeShot), path.relative(process.cwd(), afterShot)],
  };
}

async function probeOnboarding(page, width) {
  const steps = [];
  await page.setViewportSize({ width, height: 900 });
  for (let step = 0; step < 3; step += 1) {
    await page.goto(`${BASE}?level=1&seed=3607&tutorialStep=${step}`, { waitUntil: "networkidle" });
    await page.locator("[data-quadrado100-probe]").waitFor();
    const data = await snapshot(page);
    assertContract(data, width, 1);
    assert(data.tutorial === 3, `F36 onboarding deveria ter 3 passos, veio ${data.tutorial}`);
    assert(data.tutorialStep === step, `F36 onboarding não ativou passo ${step}`);
    assert(data.tutorialFala.trim().length > 0, `F36 onboarding passo ${step} sem fala`);
    assert(data.tutorialShow && typeof data.tutorialShow === "object", `F36 onboarding passo ${step} sem show`);

    const byNumber = new Map(data.cells.map(cell => [cell.n, cell]));
    const normal = byNumber.get(33)?.background;
    if (step === 0) {
      assert(data.tutorialShow.destacarCasa === 34, "F36 onboarding passo 0 não destaca a casa 34");
      assert(byNumber.get(34)?.background !== normal, "F36 onboarding passo 0 não alterou visualmente a casa 34");
    } else {
      const pair = data.tutorialShow.ligarCasas;
      assert(Array.isArray(pair) && pair.length === 2, `F36 onboarding passo ${step} não trouxe par de casas`);
      assert(pair.every(n => byNumber.get(n)?.background !== normal), `F36 onboarding passo ${step} não destacou as duas casas`);
      assert(data.tutorialLines >= 1, `F36 onboarding passo ${step} não desenhou a ligação visual`);
    }

    const shot = path.join(ARTIFACTS, `f36-${width}px-onboarding-${step + 1}.png`);
    await page.screenshot({ path: shot, fullPage: true });
    steps.push({
      step,
      fala: data.tutorialFala,
      show: data.tutorialShow,
      screenshot: path.relative(process.cwd(), shot),
    });
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
    if (response.status() < 400) return;
    failedResponses.push(`${response.status()} ${response.url()}`);
  });

  for (const width of WIDTHS) {
    for (let level = 1; level <= 5; level += 1) {
      results.push(await probe(page, width, level));
    }
    onboarding.push(await probeOnboarding(page, width));
  }

  assert(pageErrors.length === 0, `F36 gerou pageerror: ${pageErrors.join(" | ")}`);
  assert(failedResponses.length === 0, `F36 recebeu HTTP >=400: ${failedResponses.join(" | ")}`);
  const actionableConsole = consoleErrors.filter(text => !text.includes("favicon"));
  assert(actionableConsole.length === 0, `F36 gerou console.error: ${actionableConsole.join(" | ")}`);
  fs.writeFileSync(path.join(ARTIFACTS, "report.json"), JSON.stringify({ ok: true, results, onboarding }, null, 2));
  console.log(`Sonda F36 OK — ${results.length} cenários + ${onboarding.length * 3} passos de onboarding em Chrome real.`);
} catch (error) {
  fs.writeFileSync(path.join(ARTIFACTS, "report.json"), JSON.stringify({ ok: false, error: String(error), results, onboarding, consoleErrors, pageErrors, failedResponses }, null, 2));
  throw error;
} finally {
  if (browser) await browser.close();
  stopGroup(vite);
}
