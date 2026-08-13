import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const port = Number(process.env.SONDA_F58_PORT || 5213);
const base = `http://127.0.0.1:${port}/sonda/detetive-formas.html`;
const artifactDir = path.join(root, ".artifacts", "sonda-sensei-dojo");
const modos = ["atributos-lados", "atributos-cantos", "atributos-contorno", "simetria-eixo", "simetria-completar"];

const assert = (ok, msg) => { if (!ok) throw new Error(msg); };

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
    if (server.exitCode !== null) throw new Error(`Vite encerrou antes da sonda F58.\n${stderr}`);
    try {
      const response = await fetch(base);
      if (response.ok) return;
    } catch {
      // servidor ainda subindo
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`Vite F58 não respondeu em ${timeoutMs}ms.\n${stderr}`);
}

function ignorableHttp(url) {
  try {
    const parsed = new URL(url);
    return parsed.pathname === "/favicon.ico"
      || (parsed.hostname === "fonts.gstatic.com" && /\.(?:woff2?|ttf|otf)$/i.test(parsed.pathname));
  } catch {
    return false;
  }
}

async function answerCorrectly(page, level) {
  if (level <= 3) {
    const correct = page.locator('[data-f58-option][data-f58-correct="true"]');
    for (let i = 0; i < await correct.count(); i += 1) await correct.nth(i).click();
    await page.locator("[data-f58-submit]").click();
    return;
  }
  if (level === 4) {
    const angle = await page.locator("[data-f58-correct-angle]").getAttribute("data-f58-correct-angle");
    await page.getByRole("slider", { name: "Ângulo do eixo de simetria" }).fill(String(angle));
    await page.locator("[data-f58-fold]").click();
    return;
  }
  await page.locator('[data-f58-point][data-f58-correct="true"]').click();
}

fs.mkdirSync(artifactDir, { recursive: true });
const viteCli = path.join(root, "node_modules", "vite", "bin", "vite.js");
const server = spawn(process.execPath, [viteCli, "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
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

  for (const width of [320, 390, 900]) {
    for (let level = 1; level <= 5; level += 1) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const pageErrors = [];
      const consoleErrors = [];
      const httpFailures = [];
      page.on("pageerror", error => pageErrors.push(String(error)));
      page.on("console", msg => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
      page.on("response", response => {
        if (response.status() >= 400 && !ignorableHttp(response.url())) httpFailures.push(`${response.status()} ${response.url()}`);
      });

      await page.goto(`${base}?level=${level}`, { waitUntil: "networkidle" });
      await page.locator("[data-detetive-formas-probe]").waitFor();
      await page.locator("[data-f58-stage]").waitFor();

      const before = await page.evaluate(() => {
        const probe = document.querySelector("[data-detetive-formas-probe]");
        const stage = document.querySelector("[data-f58-stage]");
        const get = (name) => probe?.getAttribute(name) ?? "";
        const box = stage?.getBoundingClientRect();
        return {
          level: Number(get("data-level")), mode: get("data-mode"), answer: get("data-answer"),
          generic: get("data-generic-options") === "true", steps: Number(get("data-resolution-steps")),
          final: get("data-resolution-final"), evidence: get("data-evidence"),
          scroll: document.documentElement.scrollWidth, width: innerWidth,
          box: box ? [box.left, box.right] : null,
          fallback: document.body.textContent?.includes("Em construção") || document.body.textContent?.includes("Ficha não implementada"),
        };
      });

      assert(before.level === level, `F58 L${level}/${width}: nível`);
      assert(before.mode === modos[level - 1], `F58 L${level}/${width}: modo ${before.mode}`);
      assert(before.answer && before.final === before.answer, `F58 L${level}/${width}: resolução final`);
      assert(before.steps === 2, `F58 L${level}/${width}: resolução R0-A`);
      assert(before.evidence === "detetive-formas-simetria-nivel-4", `F58 L${level}/${width}: evidência de domínio`);
      assert(!before.generic && !before.fallback, `F58 L${level}/${width}: palco autoral sem fallback/opções genéricas`);
      assert(before.scroll <= before.width + 1, `F58 L${level}/${width}: overflow horizontal`);
      if (before.box) assert(before.box[0] >= -1 && before.box[1] <= width + 1, `F58 L${level}/${width}: palco fora da viewport`);

      await answerCorrectly(page, level);
      await page.waitForFunction(() => {
        const raw = document.querySelector("[data-detetive-formas-probe]")?.getAttribute("data-receipts") || "[]";
        return JSON.parse(raw).length > 0;
      });
      const receipts = JSON.parse(await page.locator("[data-detetive-formas-probe]").getAttribute("data-receipts") || "[]");
      const receipt = receipts.at(-1);
      assert(receipt?.correct === true, `F58 L${level}/${width}: resposta correta não reconhecida`);
      if (level === 4) {
        assert(receipt?.meta?.evidencias?.includes("detetive-formas-simetria-nivel-4"), `F58 L4/${width}: evidência não emitida`);
      }

      const fatalConsole = consoleErrors.filter(text => !/Failed to load resource/i.test(text));
      assert(pageErrors.length === 0, `F58 L${level}/${width}: pageerror ${pageErrors.join(" | ")}`);
      assert(httpFailures.length === 0, `F58 L${level}/${width}: HTTP ${httpFailures.join(" | ")}`);
      assert(fatalConsole.length === 0, `F58 L${level}/${width}: console ${fatalConsole.join(" | ")}`);

      const screenshot = `f58-${width}-l${level}.png`;
      await page.screenshot({ path: path.join(artifactDir, screenshot), fullPage: true });
      results.push({ width, level, mode: before.mode, answer: before.answer, screenshot });
      await page.close();
    }
  }

  fs.writeFileSync(path.join(artifactDir, "detetive-formas-summary.json"), `${JSON.stringify({ ok: true, checkedAt: new Date().toISOString(), results }, null, 2)}\n`);
  console.log("[SONDA F58] OK — 15 cenários em Chrome real, 320/390/900 × níveis 1–5.");
} catch (error) {
  fs.writeFileSync(path.join(artifactDir, "detetive-formas-summary.json"), `${JSON.stringify({ ok: false, checkedAt: new Date().toISOString(), error: error instanceof Error ? error.stack || error.message : String(error) }, null, 2)}\n`);
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill("SIGTERM");
}
