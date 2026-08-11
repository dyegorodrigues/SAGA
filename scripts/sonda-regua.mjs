import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 5204;
const BASE = `http://localhost:${PORT}/sonda/regua.html`;
const CHROME = process.env.SONDA_CHROME || chromium.executablePath();
const ARTIFACTS = path.resolve(".artifacts/sonda-regua");
const WIDTHS = [320, 390, 900];
const EPS = 1.75;
const OBJECT_SAMPLES = [
  { raw: 0.05, kind: "lapis" },
  { raw: 0.25, kind: "pincel" },
  { raw: 0.45, kind: "giz" },
  { raw: 0.65, kind: "marcador" },
  { raw: 0.85, kind: "fita" },
];

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

async function waitForStableGeometry(page, context) {
  const deadline = Date.now() + 2_500;
  let previous = null;
  let stableSamples = 0;

  while (Date.now() < deadline) {
    const signature = await page.evaluate(() => {
      const round = value => Math.round(value * 10) / 10;
      const tracked = [...document.querySelectorAll(
        "[data-regua-probe], [data-regua-stage], [data-regua-draggable], [data-regua], [data-regua-object]",
      )].map(el => {
        const r = el.getBoundingClientRect();
        return [
          el.getAttribute("data-regua-stage") ?? "",
          el.getAttribute("data-regua") ?? "",
          round(r.left),
          round(r.right),
          round(r.top),
          round(r.bottom),
          round(r.width),
          round(r.height),
        ];
      });

      return JSON.stringify({
        innerWidth: window.innerWidth,
        docScrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body?.scrollWidth ?? 0,
        tracked,
      });
    });

    if (signature === previous) stableSamples += 1;
    else stableSamples = 0;

    if (stableSamples >= 2) return;
    previous = signature;
    await page.waitForTimeout(50);
  }

  throw new Error(`${context}: geometria não estabilizou em 2,5s`);
}

async function prepareLevel(page, level, r = 0.5) {
  await page.goto(`${BASE}?level=${level}&r=${r}`, { waitUntil: "networkidle" });
  await page.locator("[data-regua-probe]").waitFor();
  if (level === 5) {
    assert(await page.locator("[data-regua-estimate-phase]").count() === 1, "F61 L5 liberou régua antes da estimativa");
    await page.locator("[data-regua-estimate-phase] button").first().click();
    await page.locator("[data-regua-draggable]").waitFor();
  }
  await waitForStableGeometry(page, `F61 L${level}`);
}

async function alignedGeometry(page) {
  return page.evaluate(() => {
    const probe = document.querySelector("[data-regua-probe]");
    const value = Number(probe?.getAttribute("data-value"));
    const object = document.querySelector("[data-regua-object]");
    const start = object?.querySelector("[data-regua-visible-start]")?.getBoundingClientRect();
    const end = object?.querySelector("[data-regua-visible-end]")?.getBoundingClientRect();
    const zero = document.querySelector('[data-regua-draggable] [data-regua-tick="0"]')?.getBoundingClientRect();
    const final = document.querySelector(`[data-regua-draggable] [data-regua-tick="${value}"]`)?.getBoundingClientRect();
    return {
      value,
      start: start ? { left: start.left, right: start.right } : null,
      end: end ? { left: end.left, right: end.right } : null,
      zeroX: zero?.left ?? null,
      finalX: final?.left ?? null,
    };
  });
}

async function assertAlignedGeometry(page, context) {
  const g = await alignedGeometry(page);
  assert(g.start && g.end && g.zeroX !== null && g.finalX !== null, `${context}: faltou geometria visível/ticks`);
  assert(Math.abs(g.start.left - g.zeroX) <= EPS, `${context}: ponta inicial visível não coincide com o zero (${g.start.left} vs ${g.zeroX})`);
  assert(Math.abs(g.end.right - g.finalX) <= EPS, `${context}: ponta final visível não coincide com ${g.value} cm (${g.end.right} vs ${g.finalX})`);
  return g;
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
      const objectEl = el.querySelector("[data-regua-compare-object]");
      const object = objectEl?.getBoundingClientRect();
      const start = objectEl?.querySelector("[data-regua-visible-start]")?.getBoundingClientRect();
      const end = objectEl?.querySelector("[data-regua-visible-end]")?.getBoundingClientRect();
      const rulerEl = el.querySelector("[data-regua]");
      const ruler = rulerEl?.getBoundingClientRect();
      const length = Number(el.getAttribute("data-regua-compare-length"));
      const zero = rulerEl?.querySelector('[data-regua-tick="0"]')?.getBoundingClientRect();
      const final = rulerEl?.querySelector(`[data-regua-tick="${length}"]`)?.getBoundingClientRect();
      return {
        id: el.getAttribute("data-regua-compare-item"),
        kind: el.getAttribute("data-regua-compare-kind"),
        length,
        object: object ? { left: object.left, right: object.right, width: object.width } : null,
        visibleStart: start ? { left: start.left, right: start.right } : null,
        visibleEnd: end ? { left: end.left, right: end.right } : null,
        zeroX: zero?.left ?? null,
        finalX: final?.left ?? null,
        ruler: ruler ? {
          left: ruler.left,
          right: ruler.right,
          width: ruler.width,
          max: Number(rulerEl?.getAttribute("data-regua-max")),
          unitPx: Number(rulerEl?.getAttribute("data-regua-unit-px")),
          endPad: Number(rulerEl?.getAttribute("data-regua-end-pad") ?? 0),
          step: rulerEl?.getAttribute("data-regua-step"),
        } : null,
      };
    });
    const rulers = [...document.querySelectorAll("[data-regua]")].map(el => {
      const ruler = el.getBoundingClientRect();
      const labels = [...el.querySelectorAll("[data-regua-label]")].map(label => {
        const r = label.getBoundingClientRect();
        return { value: label.getAttribute("data-regua-label"), left: r.left, right: r.right };
      });
      const ticks = [...el.querySelectorAll("[data-regua-tick]")].map(tick => tick.getAttribute("data-regua-tick"));
      return { left: ruler.left, right: ruler.right, step: el.getAttribute("data-regua-step"), labels, ticks };
    });
    const visualObjects = [...document.querySelectorAll("[data-regua-measure-object]")].map(el => ({
      kind: el.getAttribute("data-regua-object-kind"),
      text: el.textContent ?? "",
      hasStart: Boolean(el.querySelector("[data-regua-visible-start]")),
      hasEnd: Boolean(el.querySelector("[data-regua-visible-end]")),
    }));
    const informalObject = rect("[data-regua-informal-object]");
    const informalUnits = rect("[data-regua-informal-units]");
    const informalBalls = [...document.querySelectorAll("[data-regua-informal-unit]")].map(el => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, width: r.width };
    });
    return {
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      mode: document.querySelector("[data-regua-probe]")?.getAttribute("data-mode"),
      value: Number(document.querySelector("[data-regua-probe]")?.getAttribute("data-value")),
      stage: rect("[data-regua-stage]"),
      plane: rect("[data-regua-plane]"),
      ruler: rect("[data-regua-draggable] [data-regua]"),
      object: rect("[data-regua-object]"),
      compare,
      rulers,
      visualObjects,
      informalObject,
      informalUnits,
      informalBalls,
      answerButtons: document.querySelectorAll("[data-regua-answer-buttons] button").length,
      tapAlignButtons: document.querySelectorAll("[data-regua-tap-align]").length,
    };
  });

  assert(data.scrollWidth <= data.innerWidth + 1, `F61 L${level} vazou em ${width}px: scrollWidth=${data.scrollWidth}`);
  assert(data.stage && data.stage.width >= Math.min(180, width - 80), `F61 L${level} palco colapsou em ${width}px`);
  assert(data.stage.left >= -1 && data.stage.right <= width + 1, `F61 L${level} palco fora do viewport em ${width}px`);
  assert(data.visualObjects.every(obj => obj.kind && obj.text.trim() === "" && obj.hasStart && obj.hasEnd), `F61 L${level} objeto sem silhueta/extremos auditáveis`);
  for (const ruler of data.rulers) {
    assert(ruler.step === "1", `F61 L${level} reintroduziu subdivisão decimal`);
    assert(ruler.ticks.every(v => /^\d+$/.test(String(v))), `F61 L${level} contém tick não inteiro: ${ruler.ticks.join(",")}`);
    for (const label of ruler.labels) {
      assert(/^\d+$/.test(String(label.value)), `F61 L${level} exibiu rótulo decimal ${label.value}`);
      assert(label.left >= ruler.left - 1 && label.right <= ruler.right + 1,
        `F61 L${level} rótulo ${label.value} saiu da régua em ${width}px`);
    }
  }

  if (level === 1) {
    assert(data.mode === "informal" && data.informalBalls.length >= 3, "F61 L1 não preservou medida informal com unidades repetidas");
    assert(data.informalObject && data.informalUnits, "F61 L1 sem objeto/faixa de unidades");
    assert(Math.abs(data.informalObject.left - data.informalUnits.left) <= EPS, `F61 L1 unidades não começam na ponta do objeto em ${width}px`);
    assert(Math.abs(data.informalObject.right - data.informalUnits.right) <= EPS, `F61 L1 unidades não terminam na ponta do objeto em ${width}px`);
    for (let i = 0; i < data.informalBalls.length; i += 1) {
      const ball = data.informalBalls[i];
      assert(ball.width > 20, `F61 L1 unidade ${i} colapsou em ${width}px`);
      if (i > 0) {
        const prev = data.informalBalls[i - 1];
        assert(Math.abs(prev.right - ball.left) <= 0.75, `F61 L1 gap/overlap entre unidades ${i - 1}/${i} em ${width}px`);
      }
    }
  }
  if ([2, 3, 5].includes(level)) {
    assert(data.plane && data.ruler && data.object, `F61 L${level} não expôs objeto+régua reais`);
    assert(data.ruler.width >= 150, `F61 L${level} régua colapsou em ${width}px`);
    assert(data.object.width >= 60, `F61 L${level} objeto colapsou em ${width}px`);
    assert(data.ruler.left >= -2 && data.ruler.right <= width + 2, `F61 L${level} régua cortada em ${width}px`);
  }
  if (level === 2) {
    assert(Math.abs(data.ruler.left - data.object.left) <= EPS, `F61 L2 não nasceu alinhada no zero em ${width}px`);
    assert(data.answerButtons >= 3, `F61 L2 perdeu alternativas de leitura em ${width}px`);
    assert(data.tapAlignButtons === 0, `F61 L2 exibiu alinhamento desnecessário em ${width}px`);
    await assertAlignedGeometry(page, `F61 L2 ${width}px`);
  }
  if (level === 3 || level === 5) {
    assert(Math.abs(data.ruler.left - data.object.left) >= 5, `F61 L${level} deveria nascer desalinhada em ${width}px`);
    assert(data.answerButtons === 0, `F61 L${level} liberou leitura antes do alinhamento em ${width}px`);
    assert(data.tapAlignButtons === 1, `F61 L${level} perdeu alternativa motora de alinhamento em ${width}px`);
  }
  if (level === 4) {
    assert(data.compare.length === 2, "F61 L4 precisa de dois objetos medíveis");
    assert(new Set(data.compare.map(item => item.kind)).size === 2, "F61 L4 repetiu o mesmo tipo de objeto na comparação");
    assert(!data.compare.some(item => ["carrinho", "borracha"].includes(item.kind)), "F61 L4 reintroduziu objeto de proporção rígida");
    assert(data.compare[0].length !== data.compare[1].length, "F61 L4 gerou dois comprimentos iguais");
    for (const item of data.compare) {
      assert(item.object && item.ruler && item.visibleStart && item.visibleEnd, `F61 L4 item ${item.id} sem geometria completa`);
      assert(item.ruler.step === "1", `F61 L4 item ${item.id} com subdivisão decimal`);
      assert(Math.abs(item.visibleStart.left - item.zeroX) <= EPS, `F61 L4 item ${item.id}: início VISÍVEL não coincide com zero`);
      assert(Math.abs(item.visibleEnd.right - item.finalX) <= EPS, `F61 L4 item ${item.id}: fim VISÍVEL não coincide com ${item.length} cm`);
    }
  }
  return data;
}

async function captureProbe(page, file) {
  await page.locator("[data-regua-probe]").screenshot({ path: path.join(ARTIFACTS, file) });
}

async function probeObjectGallery(page) {
  const seen = [];
  for (const sample of OBJECT_SAMPLES) {
    await page.goto(`${BASE}?level=2&r=0.5&obj=${sample.raw}`, { waitUntil: "networkidle" });
    await page.locator("[data-regua-probe]").waitFor();
    const kind = await page.locator("[data-regua-probe]").getAttribute("data-object-kind");
    assert(kind === sample.kind, `galeria F61 esperava ${sample.kind} e recebeu ${kind}`);
    await assertAlignedGeometry(page, `galeria ${sample.kind}`);
    await captureProbe(page, `f61-object-${sample.kind}-390px.png`);
    seen.push(kind);
  }
  assert(new Set(seen).size === OBJECT_SAMPLES.length, `galeria F61 não cobriu cinco famílias: ${seen.join(",")}`);
  return seen;
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
  await assertAlignedGeometry(page, "F61 L3 tap");
  await captureProbe(page, "f61-l3-tap-alinhado-390px.png");
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
  await assertAlignedGeometry(page, "F61 L3 drag");
  await captureProbe(page, "f61-l3-drag-alinhado-390px.png");
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
  await page.locator("[data-regua-tap-align]").waitFor();
  await waitForStableGeometry(page, "F61 L5 estimativa→medição");
  assert(await page.locator("[data-regua-answer-buttons]").count() === 0, "F61 L5 liberou leitura antes de alinhar após estimar");
  await page.locator("[data-regua-tap-align]").click();
  await assertAlignedGeometry(page, "F61 L5 estimar→alinhar");
  await captureProbe(page, "f61-l5-estimar-alinhado-390px.png");
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
  const receipt = { chrome: CHROME, widths: {}, objectGallery: [], interactions: {} };
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    receipt.widths[width] = [];
    for (let level = 1; level <= 5; level += 1) {
      receipt.widths[width].push(await probeLayout(page, width, level));
      await captureProbe(page, `f61-l${level}-${width}px.png`);
    }
    await page.close();
  }

  const galleryPage = await browser.newPage({ viewport: { width: 390, height: 1000 } });
  receipt.objectGallery = await probeObjectGallery(galleryPage);
  await galleryPage.close();

  const interactionPage = await browser.newPage({ viewport: { width: 390, height: 1000 } });
  receipt.interactions.tap = await exerciseTap(interactionPage);
  receipt.interactions.drag = await exerciseDrag(interactionPage);
  receipt.interactions.estimate = await exerciseEstimate(interactionPage);
  await interactionPage.close();

  fs.writeFileSync(path.join(ARTIFACTS, "receipt.json"), JSON.stringify(receipt, null, 2));
  console.log("SAGA — SONDA F61: OK");
  console.log(`- larguras: ${WIDTHS.join(", ")} px; níveis: 1–5; screenshots: 15 + interações + 5 objetos`);
  console.log("- L1: bolas desenhadas, tangentes, mesma largura total do objeto: OK");
  console.log("- régua: apenas centímetros inteiros; rótulos contidos: OK");
  console.log("- silhueta visível: ponta inicial=tick 0 e ponta final=tick da resposta: OK");
  console.log(`- galeria visual: ${receipt.objectGallery.join(", ")}`);
  console.log("- L4: objetos distintos de proporção longitudinal plausível: OK");
  console.log("- tap alternativo, drag real e estimar→medir: OK");
  console.log(`- evidências: ${ARTIFACTS}`);
} finally {
  await browser?.close().catch(() => {});
  stopGroup(vite);
}