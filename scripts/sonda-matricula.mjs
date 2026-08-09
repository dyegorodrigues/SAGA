import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const port = Number(process.env.SONDA_MATRICULA_PORT || 4183);
const baseUrl = `http://127.0.0.1:${port}`;
const artifactDir = path.join(root, ".artifacts", "sonda-sensei-dojo");
const stateKey = "mk-state-v1";
const viewports = [
  { name: "phone", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
];
const MOTION_SETTLE_MS = 500;

const baseKid = {
  id: "sonda-kid", name: "Sonda", avatar: "🦊", grade: "ano1", age: 6,
  theme: "classico", petName: "Kiro", inventory: [], petFood: 0, petEnergy: 80,
};

const matriculaFixtureState = {
  schemaVersion: 1,
  kids: [baseKid],
  progress: { "sonda-kid": {} },
  dojoTracks: { "sonda-kid": {} },
  coins: { "sonda-kid": 0 },
  album: { "sonda-kid": [] },
  log: { "sonda-kid": [] },
  sound: false,
  revision: 1,
  updatedAt: "2026-08-09T12:00:00.000Z",
};

function chromeExecutable() {
  const candidates = [
    process.env.SONDA_CHROME,
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    chromium.executablePath(),
  ].filter(Boolean);
  const found = candidates.find(candidate => fs.existsSync(candidate));
  if (!found) throw new Error(`Chrome/Chromium não encontrado. Candidatos: ${candidates.join(", ")}`);
  return found;
}

async function waitForServer(server, timeoutMs = 30_000) {
  const started = Date.now();
  let stderr = "";
  server.stderr?.on("data", chunk => { stderr += chunk.toString(); });
  while (Date.now() - started < timeoutMs) {
    if (server.exitCode !== null) throw new Error(`Vite encerrou antes da sonda.\n${stderr}`);
    try {
      const response = await fetch(`${baseUrl}/?e2e=1`);
      if (response.ok) return;
    } catch {
      // servidor ainda subindo
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`Vite não respondeu em ${timeoutMs}ms.\n${stderr}`);
}

async function seedState(page) {
  await page.goto(`${baseUrl}/?e2e=1`, { waitUntil: "domcontentloaded" });
  await page.evaluate(({ key, value }) => {
    window.localStorage.clear();
    window.localStorage.setItem("mk-visitor-mode", "true");
    window.localStorage.setItem(key, value);
  }, { key: stateKey, value: JSON.stringify(matriculaFixtureState) });
  await page.reload({ waitUntil: "networkidle" });
}

async function enterKid(page) {
  const kidButton = page.getByRole("button").filter({ hasText: "Sonda" }).first();
  await kidButton.waitFor({ state: "visible", timeout: 15_000 });
  await kidButton.click();
}

function instrumentPage(page) {
  const consoleErrors = [];
  const pageErrors = [];
  const httpFailures = [];
  page.on("console", msg => {
    if (msg.type() !== "error") return;
    const location = msg.location();
    consoleErrors.push({ text: msg.text(), url: location.url || "", line: location.lineNumber ?? null });
  });
  page.on("pageerror", error => pageErrors.push(error.message));
  page.on("response", response => {
    if (response.status() >= 400) httpFailures.push({ status: response.status(), url: response.url() });
  });
  return { consoleErrors, pageErrors, httpFailures };
}

function assertHealthyBrowser(label, diagnostics) {
  const fatalHttp = diagnostics.httpFailures.filter(item => {
    try { return new URL(item.url).pathname !== "/favicon.ico"; }
    catch { return true; }
  });
  const fatalConsole = diagnostics.consoleErrors.filter(item => !/Failed to load resource/i.test(item.text));
  if (diagnostics.pageErrors.length) throw new Error(`${label}: page errors: ${diagnostics.pageErrors.join(" | ")}`);
  if (fatalHttp.length) throw new Error(`${label}: HTTP failures: ${fatalHttp.map(item => `${item.status} ${item.url}`).join(" | ")}`);
  if (fatalConsole.length) throw new Error(`${label}: console errors: ${fatalConsole.map(item => item.text).join(" | ")}`);
}

async function assertNoHorizontalOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    viewport: window.innerWidth,
    htmlWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
  }));
  const maxWidth = Math.max(metrics.htmlWidth, metrics.bodyWidth);
  if (maxWidth > metrics.viewport + 1) throw new Error(`${label}: overflow horizontal ${maxWidth}px > ${metrics.viewport}px`);
  return metrics;
}

async function runMatriculaFlow(browser, viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const diagnostics = instrumentPage(page);
  await seedState(page);
  await enterKid(page);

  await page.getByText("Sessão de Boas-Vindas", { exact: true }).waitFor({ state: "visible", timeout: 15_000 });
  const start = page.getByRole("button", { name: /Sessão de Boas-Vindas.*Começar Sondagem/i });
  await start.waitFor({ state: "visible", timeout: 15_000 });
  await page.waitForTimeout(MOTION_SETTLE_MS);
  const homeMetrics = await assertNoHorizontalOverflow(page, `${viewport.name}/matricula-home`);
  const homeScreenshot = path.join(artifactDir, `${viewport.name}-matricula-home.png`);
  await page.screenshot({ path: homeScreenshot, fullPage: true });

  await start.click();

  // O contrato unitário prova que a primeira âncora é N1.04 nível 2. No navegador
  // real provamos que essa rota chega ao palco TouchCount correspondente, nunca
  // ao placeholder: o nível 2 usa o enunciado "Conte os/as ..." e um grupo de alvos.
  const prompt = page.getByText(/^Conte (os|as) .+/i).first();
  await prompt.waitFor({ state: "visible", timeout: 15_000 });
  const targetGroup = page.locator('[role="group"][aria-label]').filter({ has: page.locator("button") }).first();
  await targetGroup.waitFor({ state: "visible", timeout: 15_000 });
  if (await page.getByText(/Em construção!/i).count()) throw new Error(`${viewport.name}/matricula: caiu em fallback.`);

  await page.waitForTimeout(MOTION_SETTLE_MS);
  const gameMetrics = await assertNoHorizontalOverflow(page, `${viewport.name}/matricula-game`);
  const gameScreenshot = path.join(artifactDir, `${viewport.name}-matricula-primeira-sonda.png`);
  await page.screenshot({ path: gameScreenshot, fullPage: true });

  assertHealthyBrowser(`${viewport.name}/matricula`, diagnostics);
  await context.close();
  return {
    flow: "matricula-primeira-visita",
    viewport,
    expectedAnchor: "N1.04",
    expectedLevel: 2,
    expectedFallback: false,
    homeMetrics,
    gameMetrics,
    screenshots: [path.basename(homeScreenshot), path.basename(gameScreenshot)],
  };
}

fs.mkdirSync(artifactDir, { recursive: true });
const viteCli = path.join(root, "node_modules", "vite", "bin", "vite.js");
const server = spawn(process.execPath, [viteCli, "--host", "127.0.0.1", "--port", String(port)], {
  cwd: root,
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, NODE_ENV: "test" },
});

let browser;
try {
  await waitForServer(server);
  const executablePath = chromeExecutable();
  browser = await chromium.launch({ executablePath, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const results = [];
  for (const viewport of viewports) results.push(await runMatriculaFlow(browser, viewport));
  fs.writeFileSync(path.join(artifactDir, "matricula-summary.json"), `${JSON.stringify({ ok: true, executablePath, checkedAt: new Date().toISOString(), results }, null, 2)}\n`);
  console.log("[SONDA MATRÍCULA] OK — primeira visita e primeira sonda real validadas em telefone + tablet.");
} catch (error) {
  fs.writeFileSync(path.join(artifactDir, "matricula-summary.json"), `${JSON.stringify({ ok: false, checkedAt: new Date().toISOString(), error: error instanceof Error ? error.stack || error.message : String(error) }, null, 2)}\n`);
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill("SIGTERM");
}
