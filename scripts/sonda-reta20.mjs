import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 5203;
const BASE = `http://localhost:${PORT}/sonda/reta20.html`;
const CHROME = process.env.SONDA_CHROME || chromium.executablePath();
const ARTIFACTS = path.resolve(".artifacts/sonda-reta20");
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
    const timeout = setTimeout(() => reject(new Error("vite da sonda F19 não subiu em 40s")), 40_000);
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
      reject(new Error(`vite da sonda F19 saiu com ${code}\n${output.join("").slice(-500)}`));
    });
  });
  return proc;
}

function stopGroup(proc) {
  if (!proc?.pid) return;
  try { process.kill(-proc.pid, "SIGTERM"); } catch {}
}

async function probeLayout(page, width, level) {
  await page.goto(`${BASE}?level=${level}&r=0.4`, { waitUntil: "networkidle" });
  await page.locator("[data-reta20-stage]").waitFor();
  const data = await page.evaluate(() => {
    const ticks = [...document.querySelectorAll("[data-reta-tick]")].map(el => {
      const rect = el.getBoundingClientRect();
      return {
        value: el.getAttribute("data-reta-tick"),
        left: rect.left,
        right: rect.right,
        center: rect.left + rect.width / 2,
      };
    });
    const labels = [...document.querySelectorAll("[data-reta-label]")]
      .filter(el => getComputedStyle(el).visibility !== "hidden")
      .map(el => {
        const rect = el.getBoundingClientRect();
        return {
          value: el.getAttribute("data-reta-label"),
          left: rect.left,
          right: rect.right,
          width: rect.width,
        };
      });
    const stage = document.querySelector("[data-reta20-stage]")?.getBoundingClientRect();
    const surface = document.querySelector("[data-reta-surface]")?.getBoundingClientRect();
    return {
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      ticks,
      labels,
      stage: stage ? { left: stage.left, right: stage.right, width: stage.width } : null,
      surface: surface ? { left: surface.left, right: surface.right, width: surface.width } : null,
      arcs: document.querySelectorAll("[data-reta-arco-assistido]").length,
      jump: Number(document.querySelector("[data-reta20-probe]")?.getAttribute("data-salto") ?? 0),
    };
  });

  assert(data.scrollWidth <= data.innerWidth + 1, `F19 L${level} vazou em ${width}px: scrollWidth=${data.scrollWidth}`);
  assert(data.stage && data.stage.width >= Math.min(240, width - 40), `F19 L${level} palco colapsou em ${width}px`);
  assert(data.stage.left >= -1 && data.stage.right <= width + 1, `F19 L${level} palco fora do viewport ${width}px`);
  assert(data.surface && data.surface.width >= Math.min(170, width - 120), `F19 L${level} superfície colapsou em ${width}px`);
  for (const tick of data.ticks) {
    assert(tick.left >= -1 && tick.right <= width + 1, `F19 L${level} tick ${tick.value} cortado em ${width}px`);
  }
  const ordered = [...data.ticks].sort((a, b) => Number(a.value) - Number(b.value));
  if (ordered.length > 1) {
    const spread = ordered.at(-1).center - ordered[0].center;
    assert(spread >= data.surface.width * 0.95, `F19 L${level} marcas colapsaram: spread=${spread}, surface=${data.surface.width}`);
    for (let i = 1; i < ordered.length; i += 1) {
      assert(ordered[i].center > ordered[i - 1].center, `F19 L${level} marcas não estão estritamente ordenadas`);
    }
  }
  const visibleLabels = [...data.labels].sort((a, b) => Number(a.value) - Number(b.value));
  for (let i = 1; i < visibleLabels.length; i += 1) {
    const previous = visibleLabels[i - 1];
    const current = visibleLabels[i];
    assert(
      previous.right <= current.left + 0.5,
      `F19 L${level} rótulos ${previous.value}/${current.value} se sobrepõem em ${width}px (${previous.right} > ${current.left})`,
    );
  }
  if (level === 2) assert(data.arcs === Math.abs(data.jump), `F19 L2 deveria ter ${Math.abs(data.jump)} arcos, tem ${data.arcs}`);
  if (level >= 3) assert(data.arcs === 0, `F19 L${level} manteve andaime de arcos`);

  return data;
}

async function exerciseTap(page) {
  await page.goto(`${BASE}?level=2&r=0.4`, { waitUntil: "networkidle" });
  const probe = page.locator("[data-reta20-probe]");
  const target = Number(await probe.getAttribute("data-alvo"));
  const jump = Math.abs(Number(await probe.getAttribute("data-salto")));
  const targetBox = await page.locator(`[data-reta-tick="${target}"]`).boundingBox();
  assert(targetBox, "F19 não expôs geometria do alvo para tap");

  // Tap físico: os botões semânticos não recebem pointer; o plano da reta resolve
  // a coordenada para o tick mais próximo e preserva o filtro motor.
  await page.mouse.click(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2);
  await page.waitForFunction(
    expected => document.querySelector("[data-reta20-probe]")?.getAttribute("data-answer") === String(expected),
    target,
    { timeout: jump * 380 + 2_000 },
  );
  assert(await probe.getAttribute("data-gesture") === "toque", "F19 tap não chegou como gesto=toque");
  assert(await page.locator("[data-reta20-stage]").getAttribute("data-reta-animando") === "false", "F19 publicou tap antes de terminar a animação");
  return { target, jump, spoken: await probe.getAttribute("data-spoken") };
}

async function exerciseDrag(page) {
  await page.goto(`${BASE}?level=2&r=0.4`, { waitUntil: "networkidle" });
  const probe = page.locator("[data-reta20-probe]");
  const origin = Number(await probe.getAttribute("data-origem"));
  const target = Number(await probe.getAttribute("data-alvo"));
  const originBox = await page.locator(`[data-reta-tick="${origin}"]`).boundingBox();
  const targetBox = await page.locator(`[data-reta-tick="${target}"]`).boundingBox();
  assert(originBox && targetBox, "F19 não expôs geometria real para o drag");

  await page.mouse.move(originBox.x + originBox.width / 2, originBox.y + originBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 12 });
  await page.mouse.up();

  await page.waitForFunction(
    expected => document.querySelector("[data-reta20-probe]")?.getAttribute("data-answer") === String(expected),
    target,
    { timeout: 2_000 },
  );
  assert(await probe.getAttribute("data-gesture") === "arrasto", "F19 drag não chegou como gesto=arrasto");
  return { origin, target, spoken: await probe.getAttribute("data-spoken") };
}

fs.rmSync(ARTIFACTS, { recursive: true, force: true });
fs.mkdirSync(ARTIFACTS, { recursive: true });

const vite = await startVite();
let browser;
try {
  browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
  const receipt = { chrome: CHROME, widths: {}, interactions: {} };

  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    receipt.widths[width] = [];
    for (let level = 1; level <= 5; level += 1) {
      receipt.widths[width].push(await probeLayout(page, width, level));
    }
    if (width === 320 || width === 900) {
      await page.goto(`${BASE}?level=2&r=0.4`, { waitUntil: "networkidle" });
      await page.screenshot({ path: path.join(ARTIFACTS, `f19-l2-${width}px.png`), fullPage: true });
      await page.goto(`${BASE}?level=4&r=0.7`, { waitUntil: "networkidle" });
      await page.screenshot({ path: path.join(ARTIFACTS, `f19-l4-${width}px.png`), fullPage: true });
    }
    await page.close();
  }

  const interactionPage = await browser.newPage({ viewport: { width: 390, height: 900 } });
  receipt.interactions.tap = await exerciseTap(interactionPage);
  receipt.interactions.drag = await exerciseDrag(interactionPage);
  await interactionPage.close();

  fs.writeFileSync(path.join(ARTIFACTS, "receipt.json"), JSON.stringify(receipt, null, 2));
  console.log("SAGA — SONDA F19: OK");
  console.log(`- larguras: ${WIDTHS.join(", ")} px; níveis: 1–5`);
  console.log("- tap e drag reais: OK");
  console.log(`- evidências: ${ARTIFACTS}`);
} finally {
  await browser?.close().catch(() => {});
  stopGroup(vite);
}
