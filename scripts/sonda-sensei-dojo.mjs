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
const stateKey = "mk-state-v1";
const viewports = [
  { name: "phone", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
];
const MOTION_SETTLE_MS = 500;

const progress = (overrides = {}) => ({
  lvl: 3, maxLvl: 3, dom: false, streak: 0, bad: 0,
  stars: 0, ok: 3, tot: 3, bank: [], mast: 0,
  ...overrides,
});

const baseKid = {
  id: "sonda-kid", name: "Sonda", avatar: "🦊", grade: "ano1", age: 6,
  theme: "classico", petName: "Kiro", inventory: [], petFood: 0, petEnergy: 80,
};

const stateEnvelope = (kidProgress, dojoTracks = {}) => ({
  schemaVersion: 1,
  kids: [baseKid],
  progress: { "sonda-kid": kidProgress },
  dojoTracks: { "sonda-kid": dojoTracks },
  coins: { "sonda-kid": 0 },
  album: { "sonda-kid": [] },
  log: { "sonda-kid": [] },
  sound: false,
  revision: 1,
  updatedAt: "2026-08-09T12:00:00.000Z",
});

const dojoFixtureState = stateEnvelope({ "N3.01": progress() });

// N1.03 é raiz do DAG: duas ocorrências iguais produzem misconception no próprio
// alvo, sem pré-requisito conceitual anterior. JD1 já está desbloqueado e tem
// fraqueza observada (recuou 3→2 + 10/16), exatamente o contrato que autoriza
// o Sensei a descer causalmente para o Jardim.
const jardimFixtureState = stateEnvelope(
  {
    "N1.03": progress({
      misconceptions: [
        { tag: "off-by-one", ts: 1_000_000 },
        { tag: "off-by-one", ts: 1_000_500 },
      ],
    }),
  },
  {
    JD1: {
      unlocked: true,
      mastered: false,
      family: "JD",
      currentStep: 2,
      highestStep: 3,
      goodRounds: 0,
      weakRounds: 0,
      rounds: 2,
      attempts: 16,
      correct: 10,
    },
  },
);

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

async function seedState(page, fixtureState) {
  await page.goto(`${baseUrl}/?e2e=1`, { waitUntil: "domcontentloaded" });
  await page.evaluate(({ key, value }) => {
    window.localStorage.clear();
    window.localStorage.setItem("mk-visitor-mode", "true");
    window.localStorage.setItem(key, value);
  }, { key: stateKey, value: JSON.stringify(fixtureState) });
  await page.reload({ waitUntil: "networkidle" });
}

async function enterKid(page) {
  const kidButton = page.getByRole("button").filter({ hasText: "Sonda" }).first();
  await kidButton.waitFor({ state: "visible", timeout: 15_000 });
  await kidButton.click();
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

const isIgnorableHttpFailure = ({ url }) => {
  try { return new URL(url).pathname === "/favicon.ico"; }
  catch { return false; }
};

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
    if (response.status() < 400) return;
    httpFailures.push({ status: response.status(), url: response.url() });
  });
  return { consoleErrors, pageErrors, httpFailures };
}

function assertHealthyBrowser(label, diagnostics) {
  const fatalHttpFailures = diagnostics.httpFailures.filter(item => !isIgnorableHttpFailure(item));
  if (diagnostics.pageErrors.length) {
    throw new Error(`${label}: page errors: ${diagnostics.pageErrors.join(" | ")}`);
  }
  if (fatalHttpFailures.length) {
    throw new Error(`${label}: HTTP failures: ${fatalHttpFailures.map(item => `${item.status} ${item.url}`).join(" | ")}`);
  }
  // O Chrome emite "Failed to load resource" sem URL no console para o mesmo
  // 404 já classificado acima. Erros JS reais continuam fatais.
  const fatalConsoleErrors = diagnostics.consoleErrors.filter(item => !/Failed to load resource/i.test(item.text));
  if (fatalConsoleErrors.length) {
    throw new Error(`${label}: console errors: ${fatalConsoleErrors.map(item => `${item.text}${item.url ? ` @ ${item.url}` : ""}`).join(" | ")}`);
  }
}

async function assertAbsent(page, locator, label) {
  if (await locator.count()) throw new Error(`${label}: elemento indevido ainda presente.`);
}

async function runDojoFlow(browser, viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const diagnostics = instrumentPage(page);
  await seedState(page, dojoFixtureState);
  await enterKid(page);

  await page.getByText("Missões do Dojô", { exact: true }).waitFor({ state: "visible", timeout: 15_000 });
  await page.getByText("Prescrição do Sensei", { exact: false }).waitFor({ state: "visible" });
  await page.getByText(/Academia da Adição · faixa 1/).waitFor({ state: "visible" });
  await page.getByRole("button", { name: /Começar Aula do Dia|Começar Reforço Guiado/i }).waitFor({ state: "visible" });

  // Este fixture tem UMA competência praticada, não duas dominadas. O Sensei não
  // pode exibir Misto nem a recomendação paralela antiga baseada em estrelas.
  await assertAbsent(page, page.getByText("Mistura Total (Dojô Geral)", { exact: true }), `${viewport.name}/sensei-misto`);
  await assertAbsent(page, page.getByText(/Treino Livre Sugerido/i), `${viewport.name}/sensei-rec-paralelo`);

  await page.waitForTimeout(MOTION_SETTLE_MS);
  const homeMetrics = await assertNoHorizontalOverflow(page, `${viewport.name}/dojo-home`);
  const homeScreenshot = path.join(artifactDir, `${viewport.name}-sensei-home.png`);
  await page.screenshot({ path: homeScreenshot, fullPage: true });

  // QA visual do novo gate do Mestre: no Dojo ele permanece descobrível, mas
  // bloqueado e sem CTA enquanto o repertório conquistado for insuficiente.
  await page.getByText("Dojo", { exact: true }).click();
  await page.getByRole("button", { name: /Dojo Sensei/i }).click();
  await page.getByLabel("Treino Mestre bloqueado").waitFor({ state: "visible", timeout: 15_000 });
  await assertAbsent(page, page.getByRole("button", { name: /Treino Mestre/i }), `${viewport.name}/mestre-cta-bloqueado`);
  await page.waitForTimeout(MOTION_SETTLE_MS);
  const masterMetrics = await assertNoHorizontalOverflow(page, `${viewport.name}/mestre-bloqueado`);
  const masterScreenshot = path.join(artifactDir, `${viewport.name}-mestre-bloqueado.png`);
  await page.screenshot({ path: masterScreenshot, fullPage: true });

  // Volta ao Tutor e prova que a rota prescrita de automaticidade continua viva.
  await page.getByText("Tutor", { exact: true }).click();
  const prescribedButton = page.getByRole("button", { name: /Fazer round prescrito/i });
  await prescribedButton.waitFor({ state: "visible", timeout: 15_000 });
  await prescribedButton.click();
  await page.getByText(/\d+\s*\+\s*\d+\s*=\s*\?/).first().waitFor({ state: "visible", timeout: 15_000 });
  await page.waitForTimeout(MOTION_SETTLE_MS);
  const gameMetrics = await assertNoHorizontalOverflow(page, `${viewport.name}/dojo-game`);
  const gameScreenshot = path.join(artifactDir, `${viewport.name}-dojo-prescrito.png`);
  await page.screenshot({ path: gameScreenshot, fullPage: true });

  assertHealthyBrowser(`${viewport.name}/dojo`, diagnostics);
  await context.close();
  return {
    flow: "dojo-prescribed+mestre-gate",
    viewport,
    homeMetrics,
    masterMetrics,
    gameMetrics,
    httpFailures: diagnostics.httpFailures,
    screenshots: [path.basename(homeScreenshot), path.basename(masterScreenshot), path.basename(gameScreenshot)],
  };
}

async function runJardimFlow(browser, viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const diagnostics = instrumentPage(page);
  await seedState(page, jardimFixtureState);
  await enterKid(page);

  await page.getByText(/Aula do Dia · Base Perceptual/).waitFor({ state: "visible", timeout: 15_000 });
  await page.getByText(/Transformar em reflexo: Jardim · Olhômetro Relâmpago/).waitFor({ state: "visible" });
  await page.getByText(/Base já compreendida:/).waitFor({ state: "visible" });
  await page.getByRole("button", { name: /Começar Jardim Guiado/i }).waitFor({ state: "visible" });
  await page.waitForTimeout(MOTION_SETTLE_MS);
  const homeMetrics = await assertNoHorizontalOverflow(page, `${viewport.name}/jardim-home`);
  const homeScreenshot = path.join(artifactDir, `${viewport.name}-jardim-causal-home.png`);
  await page.screenshot({ path: homeScreenshot, fullPage: true });

  await page.getByRole("button", { name: /Começar Jardim Guiado/i }).click();
  // JD1 usa a primitiva `fileira`. A fase de relance expõe um grupo acessível
  // chamado "a área do relance" sem contar os objetos — prova que entramos na
  // experiência perceptual certa sem depender de um prompt que a UI não promete.
  await page.getByRole("group", { name: "a área do relance" }).waitFor({ state: "visible", timeout: 15_000 });
  const gameMetrics = await assertNoHorizontalOverflow(page, `${viewport.name}/jardim-game`);
  const gameScreenshot = path.join(artifactDir, `${viewport.name}-jardim-causal-round.png`);
  await page.screenshot({ path: gameScreenshot, fullPage: true });

  assertHealthyBrowser(`${viewport.name}/jardim`, diagnostics);
  await context.close();
  return {
    flow: "jardim-causal",
    viewport,
    homeMetrics,
    gameMetrics,
    httpFailures: diagnostics.httpFailures,
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
  browser = await chromium.launch({ executablePath, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const results = [];
  for (const viewport of viewports) {
    results.push(await runDojoFlow(browser, viewport));
    results.push(await runJardimFlow(browser, viewport));
  }

  const summary = { ok: true, executablePath, baseUrl, checkedAt: new Date().toISOString(), results };
  fs.writeFileSync(path.join(artifactDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  console.log("[SONDA SENSEI] OK — Dojo prescrito + gate do Mestre + Jardim causal validados em navegador real.");
  for (const result of results) console.log(`- ${result.viewport.name}/${result.flow}: ${result.screenshots.join(", ")}`);
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
