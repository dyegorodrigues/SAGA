import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 5206;
const BASE = `http://localhost:${PORT}/sonda/comparacao.html`;
const CHROME = process.env.SONDA_CHROME || chromium.executablePath();
const ARTIFACTS = path.resolve(".artifacts/sonda-comparacao");
const WIDTHS = [320, 390, 900];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parcelas(texto) {
  const valores = String(texto).split(" + ").map(Number);
  assert(valores.length === 2 && valores.every(Number.isFinite), `F29 expressão inválida: ${texto}`);
  return valores;
}

async function startVite() {
  const proc = spawn("npx", ["vite", "--port", String(PORT), "--strictPort"], {
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });
  const output = [];
  proc.stderr.on("data", data => output.push(String(data)));
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("vite da sonda F29 não subiu em 40s")), 40_000);
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
      reject(new Error(`vite da sonda F29 saiu com ${code}\n${output.join("").slice(-500)}`));
    });
  });
  return proc;
}

function stopGroup(proc) {
  if (!proc?.pid) return;
  try { process.kill(-proc.pid, "SIGTERM"); } catch {}
}

function expectedTypes(level) {
  if (level === 1) return ["grupo", "grupo"];
  if (level === 2) return ["grupo", "numeral"].sort();
  if (level <= 4) return ["numeral", "numeral"];
  return ["expressao", "expressao"];
}

async function probe(page, width, level) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${BASE}?level=${level}`, { waitUntil: "networkidle" });
  await page.locator("[data-comparacao-probe]").waitFor();

  const data = await page.evaluate(() => {
    const stage = document.querySelector("[data-comparacao-simbolica]")?.getBoundingClientRect();
    const symbols = [...document.querySelectorAll("[data-simbolo]")].map(el => {
      const r = el.getBoundingClientRect();
      return {
        value: el.getAttribute("data-simbolo"),
        width: r.width,
        height: r.height,
      };
    });
    const probe = document.querySelector("[data-comparacao-probe]");
    return {
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      stage: stage ? { left: stage.left, right: stage.right, width: stage.width } : null,
      types: [...document.querySelectorAll("[data-lado-tipo]")].map(el => el.getAttribute("data-lado-tipo")),
      lados: JSON.parse(probe?.getAttribute("data-lados") ?? "[]"),
      alligator: document.querySelector("[data-andaime-jacare]")?.getAttribute("data-andaime-jacare") ?? null,
      symbols,
      correct: probe?.getAttribute("data-correct") ?? "",
    };
  });

  assert(data.scrollWidth <= data.innerWidth + 1, `F29 L${level} vazou em ${width}px: scrollWidth=${data.scrollWidth}`);
  assert(data.stage && data.stage.left >= -1 && data.stage.right <= width + 1, `F29 L${level} palco fora do viewport em ${width}px`);
  const actualTypes = level === 2 ? [...data.types].sort() : data.types;
  assert(JSON.stringify(actualTypes) === JSON.stringify(expectedTypes(level)), `F29 L${level} representações erradas: ${data.types.join(" × ")}`);
  assert(data.symbols.length === 3, `F29 L${level} não expôs >, < e = exatamente uma vez`);
  assert(data.symbols.every(button => button.width >= 72 && button.height >= 72), `F29 L${level} alvo de toque menor que 72px`);
  assert(level <= 3 ? Boolean(data.alligator) : !data.alligator, `F29 L${level} andaime do jacaré em nível incorreto`);

  if (level === 2) {
    assert(data.lados.length === 2 && data.lados.every(lado => lado.valor <= 10), `F29 L2 ultrapassou teto 10 em ${width}px`);
  }

  if (level === 5) {
    assert(data.lados.length === 2, `F29 L5 não expôs dois lados em ${width}px`);
    const esquerda = parcelas(data.lados[0].texto);
    const direita = parcelas(data.lados[1].texto);
    assert(
      esquerda[0] === direita[0] || esquerda[1] === direita[1],
      `F29 L5 perdeu a parcela compartilhada em ${width}px: ${data.lados[0].texto} × ${data.lados[1].texto}`,
    );
    assert(esquerda[0] + esquerda[1] === data.lados[0].valor, `F29 L5 texto esquerdo não preserva valor em ${width}px`);
    assert(direita[0] + direita[1] === data.lados[1].valor, `F29 L5 texto direito não preserva valor em ${width}px`);
  }

  await page.locator(`[data-simbolo="${data.correct}"]`).click();
  await page.waitForFunction(correct => document.querySelector("[data-comparacao-probe]")?.getAttribute("data-answer") === correct, data.correct);

  const receipt = await page.evaluate(() => {
    const probe = document.querySelector("[data-comparacao-probe]");
    return {
      answer: probe?.getAttribute("data-answer") ?? "",
      misconception: probe?.getAttribute("data-misconception") ?? "",
      evidencias: probe?.getAttribute("data-evidencias") ?? "",
    };
  });
  assert(receipt.answer === data.correct, `F29 L${level} não registrou a resposta correta`);
  assert(receipt.misconception === "", `F29 L${level} diagnosticou erro numa resposta correta: ${receipt.misconception}`);
  if (level >= 3) {
    assert(receipt.evidencias.includes("comparacao-simbolica-sem-objetos"), `F29 L${level} não emitiu evidência L3+`);
  } else {
    assert(receipt.evidencias === "", `F29 L${level} emitiu evidência antes da retirada dos objetos`);
  }

  const shot = path.join(ARTIFACTS, `f29-${width}px-l${level}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  return { width, level, ...data, receipt, screenshot: path.relative(process.cwd(), shot) };
}

fs.rmSync(ARTIFACTS, { recursive: true, force: true });
fs.mkdirSync(ARTIFACTS, { recursive: true });

let vite;
let browser;
const consoleErrors = [];
const pageErrors = [];
const results = [];
try {
  vite = await startVite();
  browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  page.on("console", message => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", error => pageErrors.push(String(error)));

  for (const width of WIDTHS) {
    for (let level = 1; level <= 5; level += 1) {
      results.push(await probe(page, width, level));
    }
  }

  assert(pageErrors.length === 0, `F29 gerou pageerror: ${pageErrors.join(" | ")}`);
  const actionableConsole = consoleErrors.filter(text => !text.includes("favicon"));
  assert(actionableConsole.length === 0, `F29 gerou console.error: ${actionableConsole.join(" | ")}`);
  fs.writeFileSync(path.join(ARTIFACTS, "report.json"), JSON.stringify({ ok: true, results }, null, 2));
  console.log(`Sonda F29 OK — ${results.length} cenários em Chrome real.`);
} catch (error) {
  fs.writeFileSync(path.join(ARTIFACTS, "report.json"), JSON.stringify({ ok: false, error: String(error), results, consoleErrors, pageErrors }, null, 2));
  throw error;
} finally {
  if (browser) await browser.close();
  stopGroup(vite);
}
