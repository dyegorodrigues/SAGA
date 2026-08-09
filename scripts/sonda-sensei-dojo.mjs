import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const port = Number(process.env.SONDA_SENSEI_PORT || 4182);
const baseUrl = `http://127.0.0.1:${port}`;
const artifactDir = path.join(root, ".artifacts", "sonda-sensei-dojo");
const stateKey = "matemagica-state-v1";
const viewports = [
  { name: "phone", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
];

const progress = {
  lvl: 3,
  maxLvl: 3,
  dom: false,
  streak: 0,
  bad: 0,
  stars: 0,
  ok: 3,
  tot: 3,
  bank: [],
  mast: 0,
};

const fixtureState = {
  schemaVersion: 13,
  kids: [{
    id: "sonda-kid",
    name: "Sonda",
    avatar: "🦊",
    grade: "ano1",
    theme: "classico",
    petName: "Kiro",
    inventory: [],
    petFood: 0,
  }],
  progress: {
    "sonda-kid": {
      "N3.01": progress,
    },
  },
  dojoTracks: { "sonda-kid": {} },
  coins: { "sonda-kid": 0 },
  album: { "sonda-kid": [] },
  log: { "sonda-kid": [] },
  sound: false,
  schemaVersion: 13,
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
  if (!found) {
    throw new Error(`Chrome/Chromium não encontrado. Candidatos: ${candidates.join(", ")}`);
  }
  return found;
}

async function waitForServer(server, timeoutMs = 30_000) {
  const started = Date.now();
  let stderr = "";
  server.stderr?.on("data", chunk => { stderr += chunk.toString(); });
  while (Date.now() - started < timeoutMs) {
    if (server.exitCode !== null) {
      throw new Error(`Vite encerrou antes da sonda.\n${stderr}`);
    }
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
    window.localStorage.setItem("mk-visitor-mode", "true");
    window.localStorage.setItem(key, value);
  }, { key: stateKey, value: JSON.stringify(fixtureState) });
  await page.reload({ waitUntil: "networkidle" });
}

async function assertNoHorizontalOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    viewport: window.innerWidth,
    htmlWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
  }));
  const maxWidth = Math.max(metrics.htmlWidth, metrics.bodyWidth);
  if (maxWidth > metrics.viewport + 1) {
    throw new Error(`${label}: overflow horizontal ${maxWidth}px > viewport ${metrics.viewport}px`);
  }
  return metrics;
}

async function runViewport(browser, viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", msg => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", error => pageErrors.push(error.message));

  await seedState(page);

  const kidButton = page.getByRole("button").filter({ hasText: "Sonda" }).first();
  await kidButton.waitFor({ state: "visible", timeout: 15_000 });
  await kidButton.click();

  await page.getByText("Missões do Dojô", { exact: true }).waitFor({ state: "visible", timeout: 15_000 });
  await page.getByText("Prescrição do Sensei", { exact: false }).waitFor({ state: "visible" });
  await page.getByText(/Templo da Soma · faixa 1/).waitFor({ state: "visible" });
  const homeMetrics = await assertNoHorizontalOverflow(page, `${viewport.name}/home`);
  const homeScreenshot = path.join(artifactDir, `${viewport.name}-sensei-home.png`);
  await page.screenshot({ path: homeScreenshot, fullPage: true });

  const prescribedButton = page.getByRole("button", { name: /Fazer round prescrito/i });
  await prescribedButton.waitFor({ state: "visible" });
  await prescribedButton.click();

  await page.getByText("Templo da Soma", { exact: false }).first().waitFor({ state: "visible", timeout: 15_000 });
  const gameMetrics = await assertNoHorizontalOverflow(page, `${viewport.name}/game`);
  const gameScreenshot = path.join(artifactDir, `${viewport.name}-dojo-prescrito.png`);
  await page.screenshot({ path: gameScreenshot, fullPage: true });

  if (pageErrors.length > 0) {
    throw new Error(`${viewport.name}: page errors: ${pageErrors.join(" | ")}`);
  }
  const fatalConsoleErrors = consoleErrors.filter(message => !/favicon|manifest|net::ERR/i.test(message));
  if (fatalConsoleErrors.length > 0) {
    throw new Error(`${viewport.name}: console errors: ${fatalConsoleErrors.join(" | ")}`);
  }

  await context.close();
  return {
    viewport,
    homeMetrics,
    gameMetrics,
    screenshots: [path.basename(homeScreenshot), path.basename(gameScreenshot)],
  };
}

fs.rmSync(artifactDir, { recursive: true, force: true });
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
  browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const results = [];
  for (const viewport of viewports) {
    results.push(await runViewport(browser, viewport));
  }

  const summary = {
    ok: true,
    executablePath,
    baseUrl,
    checkedAt: new Date().toISOString(),
    results,
  };
  fs.writeFileSync(path.join(artifactDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  console.log("[SONDA SENSEI↔DOJO] OK — navegador real, card prescrito, navegação e overflow validados.");
  for (const result of results) {
    console.log(`- ${result.viewport.name}: ${result.screenshots.join(", ")}`);
  }
} catch (error) {
  const summary = {
    ok: false,
    checkedAt: new Date().toISOString(),
    error: error instanceof Error ? error.stack || error.message : String(error),
  };
  fs.writeFileSync(path.join(artifactDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  console.error(summary.error);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill("SIGTERM");
}
