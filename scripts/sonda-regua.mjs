import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 5204;
const BASE = `http://localhost:${PORT}/sonda/regua.html`;
const CHROME = process.env.SONDA_CHROME || chromium.executablePath();
const ARTIFACTS = path.resolve(".artifacts/sonda-regua");
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
    const timeout = setTimeout(() => reject(new Error("vite da sonda F61 não subiu em 40s")), 40_000);
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
      reject(new Error(`vite da sonda F61 saiu com ${code}\n${output.join("").slice(-500)}`));
    });
  });
  return proc;
}

function stopGroup(proc) {
  if (!proc?.pid) return;
  try { process.kill(-proc.pid, "SIGTERM"); } catch {}
}

async function prepareLevel(page, level, r = 0.5) {
  await page.goto(`${BASE}?level=${level}&r=${r}`, { waitUntil: "networkidle" });
  await page.locator("[data-regua-probe]").waitFor();
  if (level === 5) {
    assert(await page.locator("[data-regua-estimate-phase]").count() === 1, "F61 L5 liberou régua antes da estimativa");
    await page.locator("[data-regua-estimate-phase] button").first().click();
    await page.locator("[data-regua-draggable]").waitFor();
  }
}

async function probeLayout(page, width, level) {
  await prepareLevel(page, level, level === 4 ? 0.35 : 0.5);
  const data = await page.evaluate(() => {
    const rect = selector => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
    };
    const compare = [...document.querySelectorAll("[data-regua-compare-item]")].map(el => {
      const outer = el.getBoundingClientRect();
      const object = el.querySelector("[data-regua-compare-object]")?.getBoundingClientRect();
      const ruler = el.querySelector("[data-regua]")?.getBoundingClientRect();
      return {
        id: el.getAttribute("data-regua-compare-item"),
        kind: el.getAttribute("data-regua-compare-kind"),
        length: Number(el.getAttribute("data-regua-compare-length")),
        outer: { left: outer.left, right: outer.right, width: outer.width },
        object: object ? { left: object.left, right: object.right, width: object.width } : null,
        ruler: ruler ? { left: ruler.left, right: ruler.right, width: ruler.width } : null,
      };
    });
    const rulers = [...document.querySelectorAll("[data-regua]")].map(el => {
      const ruler = el.getBoundingClientRect();
      const labels = [...el.querySelectorAll("[data-regua-label]")].map(label => {
        const r = label.getBoundingClientRect();
        return {
          value: label.getAttribute("data-regua-label"),
          edge: label.getAttribute("data-regua-label-edge"),
          left: r.left,
          right: r.right,
        };
      });
      return { left: ruler.left, right: ruler.right, labels };
    });
    const visualObjects = [...document.querySelectorAll("[data-regua-measure-object]")].map(el => ({
      kind: el.getAttribute("data-regua-object-kind"),
      text: el.textContent ?? "",
    }));
    return {
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      mode: document.querySelector("[data-regua-probe]")?.getAttribute("data-mode"),
      stage: rect("[data-regua-stage]"),
      plane: rect("[data-regua-plane]"),
      ruler: rect("[data-regua-draggable] [data-regua]"),
      object: rect("[data-regua-object]"),
      compare,
      rulers,
      visualObjects,
      clips: document.querySelectorAll("[data-regua-clipes] > *").length,
      answerButtons: document.querySelectorAll("[data-regua-answer-buttons] button").length,
      tapAlignButtons: document.querySelectorAll("[data-regua-tap-align]").length,
    };
  });

  assert(data.scrollWidth <= data.innerWidth + 1, `F61 L${level} vazou em ${width}px: scrollWidth=${data.scrollWidth}`);
  assert(data.stage && data.stage.width >= Math.min(180, width - 80), `F61 L${level} palco colapsou em ${width}px`);
  assert(data.stage.left >= -1 && data.stage.right <= width + 1, `F61 L${level} palco fora do viewport em ${width}px`);
  assert(data.visualObjects.every(obj => obj.kind && obj.text.trim() === ""), `F61 L${level} voltou a usar texto/emoji como objeto medido`);
  for (const ruler of data.rulers) {
    for (const label of ruler.labels) {
      assert(label.left >= ruler.left - 1 && label.right <= ruler.right + 1,
        `F61 L${level} rótulo ${label.value} saiu da régua em ${width}px`);
    }
  }

  if (level === 1) {
    assert(data.mode === "informal" && data.clips >= 3, "F61 L1 não preservou medida informal com unidades repetidas");
  }
  if ([2, 3, 5].includes(level)) {
    assert(data.plane && data.ruler && data.object, `F61 L${level} não expôs objeto+régua reais`);
    assert(data.ruler.width >= 150, `F61 L${level} régua colapsou em ${width}px`);
    assert(data.object.width >= 60, `F61 L${level} objeto colapsou em ${width}px`);
    assert(data.ruler.left >= -2 && data.ruler.right <= width + 2, `F61 L${level} régua cortada em ${width}px`);
  }
  if (level === 2) {
    assert(Math.abs(data.ruler.left - data.object.left) <= 1.5, `F61 L2 não nasceu alinhada no zero em ${width}px`);
    assert(data.answerButtons >= 3, `F61 L2 perdeu alternativas de leitura em ${width}px`);
    assert(data.tapAlignButtons === 0, `F61 L2 exibiu alinhamento desnecessário em ${width}px`);
  }
  if (level === 3 || level === 5) {
    assert(Math.abs(data.ruler.left - data.object.left) >= 5, `F61 L${level} deveria nascer desalinhada em ${width}px`);
    assert(data.answerButtons === 0, `F61 L${level} liberou leitura antes do alinhamento em ${width}px`);
    assert(data.tapAlignButtons === 1, `F61 L${level} perdeu alternativa motora de alinhamento em ${width}px`);
  }
  if (level === 4) {
    assert(data.compare.length === 2, "F61 L4 precisa de dois objetos medíveis");
    assert(new Set(data.compare.map(item => item.kind)).size === 2, "F61 L4 repetiu o mesmo tipo de objeto na comparação");
    assert(data.compare[0].length !== data.compare[1].length, "F61 L4 gerou dois comprimentos iguais");
    for (const item of data.compare) {
      assert(item.object && item.ruler, `F61 L4 item ${item.id} sem objeto+régua`);
      assert(Math.abs(item.object.left - item.ruler.left) <= 1.5, `F61 L4 item ${item.id} não começa no zero`);
      const unit = item.ruler.width / 12;
      const expected = Math.max(66 * (unit / 22), item.length * unit);
      assert(Math.abs(item.object.width - expected) <= 3, `F61 L4 item ${item.id} não representa o comprimento na geometria`);
    }
  }
  return data;
}

async function captureProbe(page, file) {
  await page.locator("[data-regua-probe]").screenshot({ path: path.join(ARTIFACTS, file) });
}

async function exerciseTap(page) {
  await prepareLevel(page, 3);
  const probe = page.locator("[data-regua-probe]");
  const correct = await probe.getAttribute("data-correct");
  const value = await probe.getAttribute("data-value");
  assert(correct && value, "F61 L3 não expôs recibo canônico/valor visual");
  assert(await page.locator("[data-regua-answer-buttons]").count() === 0, "F61 L3 liberou leitura antes do alinhamento por toque");
  await page.locator("[data-regua-tap-align]").click();
  assert(await page.locator("[data-regua-stage]").getAttribute("data-regua-aligned") === "true", "F61 tap alternativo não alinhou o zero");
  assert(await page.locator("[data-regua-answer-buttons] button").count() >= 3, "F61 não liberou leitura depois do alinhamento por toque");
  await page.getByRole("button", { name: `${value} cm` }).click();
  await page.waitForFunction(expected => document.querySelector("[data-regua-probe]")?.getAttribute("data-answer") === expected, correct);
  assert((await probe.getAttribute("data-evidencias"))?.includes("alinhou-zero"), "F61 tap não colheu evidência ALINHOU_ZERO");
  return { correct, value, spoken: await probe.getAttribute("data-spoken") };
}

async function exerciseDrag(page) {
  await prepareLevel(page, 3);
  const probe = page.locator("[data-regua-probe]");
  const correct = await probe.getAttribute("data-correct");
  const value = await probe.getAttribute("data-value");
  assert(correct && value, "F61 L3 não expôs recibo canônico/valor visual");
  assert(await page.locator("[data-regua-answer-buttons]").count() === 0, "F61 L3 liberou leitura antes do alinhamento por drag");
  const ruler = await page.locator("[data-regua-draggable] [data-regua]").boundingBox();
  const object = await page.locator("[data-regua-object]").boundingBox();
  assert(ruler && object, "F61 não expôs geometria real para drag");
  const dx = object.x - ruler.x;
  const startX = ruler.x + Math.min(20, ruler.width / 4);
  const y = ruler.y + 12;
  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.mouse.move(startX + dx, y, { steps: 10 });
  await page.mouse.up();
  await page.waitForFunction(() => document.querySelector("[data-regua-stage]")?.getAttribute("data-regua-aligned") === "true");
  assert(await page.locator("[data-regua-answer-buttons] button").count() >= 3, "F61 não liberou leitura depois do alinhamento por drag");
  await page.getByRole("button", { name: `${value} cm` }).click();
  await page.waitForFunction(expected => document.querySelector("[data-regua-probe]")?.getAttribute("data-answer") === expected, correct);
  assert((await probe.getAttribute("data-evidencias"))?.includes("alinhou-zero"), "F61 drag não colheu evidência ALINHOU_ZERO");
  return { correct, value, dx, spoken: await probe.getAttribute("data-spoken") };
}

async function exerciseEstimate(page) {
  await page.goto(`${BASE}?level=5&r=0.5`, { waitUntil: "networkidle" });
  const probe = page.locator("[data-regua-probe]");
  assert(await page.locator("[data-regua-estimate-phase]").count() === 1, "F61 L5 não começou pela estimativa");
  assert(await page.locator("[data-regua-draggable]").count() === 0, "F61 L5 expôs régua antes da estimativa");
  await page.locator("[data-regua-estimate-phase] button").first().click();
  assert(await page.locator("[data-regua-answer-buttons]").count() === 0, "F61 L5 liberou leitura antes de alinhar após estimar");
  await page.locator("[data-regua-tap-align]").click();
  assert(await page.locator("[data-regua-answer-buttons] button").count() >= 3, "F61 L5 não liberou leitura após estimar e alinhar");
  const value = await probe.getAttribute("data-value");
  await page.getByRole("button", { name: `${value} cm` }).click();
  assert(await page.locator("[data-regua-unit-buttons]").count() === 1, "F61 L5 não pediu unidade após a medida");
  await page.getByRole("button", { name: `${value} cm` }).last().click();
  const correct = await probe.getAttribute("data-correct");
  await page.waitForFunction(expected => document.querySelector("[data-regua-probe]")?.getAttribute("data-answer") === expected, correct);
  return { correct, spoken: await probe.getAttribute("data-spoken") };
}

fs.rmSync(ARTIFACTS, { recursive: true, force: true });
fs.mkdirSync(ARTIFACTS, { recursive: true });

const vite = await startVite();
let browser;
try {
  browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
  const receipt = { chrome: CHROME, widths: {}, interactions: {} };
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    receipt.widths[width] = [];
    for (let level = 1; level <= 5; level += 1) {
      receipt.widths[width].push(await probeLayout(page, width, level));
      if (width === 390 || ([3, 4].includes(level) && (width === 320 || width === 900))) {
        await captureProbe(page, `f61-l${level}-${width}px.png`);
      }
    }
    await page.close();
  }

  const interactionPage = await browser.newPage({ viewport: { width: 390, height: 1000 } });
  receipt.interactions.tap = await exerciseTap(interactionPage);
  receipt.interactions.drag = await exerciseDrag(interactionPage);
  receipt.interactions.estimate = await exerciseEstimate(interactionPage);
  await interactionPage.close();

  fs.writeFileSync(path.join(ARTIFACTS, "receipt.json"), JSON.stringify(receipt, null, 2));
  console.log("SAGA — SONDA F61: OK");
  console.log(`- larguras: ${WIDTHS.join(", ")} px; níveis: 1–5`);
  console.log("- objetos proporcionais distintos no L4; rótulos contidos dentro da régua: OK");
  console.log("- leitura só após alinhamento; tap alternativo, drag real e estimar→medir: OK");
  console.log(`- evidências: ${ARTIFACTS}`);
} finally {
  await browser?.close().catch(() => {});
  stopGroup(vite);
}
