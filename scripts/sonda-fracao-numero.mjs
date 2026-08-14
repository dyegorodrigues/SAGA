import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
import { createServer } from "vite";

const root = process.cwd();
const port = Number(process.env.SONDA_F72_PORT || 5216);
const base = `http://127.0.0.1:${port}/sonda/fracao-numero.html`;
const artifactDir = path.join(root, ".artifacts", "sonda-sensei-dojo");
const modos = ["barra", "colecao", "reta", "reta-parcial", "impropria"];
const suportes = ["singapore", "colecao", "reta", "reta", "reta"];
const assert = (ok, msg) => { if (!ok) throw new Error(msg); };

function chromeExecutable() {
  const candidates = [process.env.SONDA_CHROME, "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser", chromium.executablePath()].filter(Boolean);
  const found = candidates.find(candidate => fs.existsSync(candidate));
  if (!found) throw new Error(`Chrome/Chromium não encontrado. Candidatos: ${candidates.join(", ")}`);
  return found;
}
function ignorableHttp(url) {
  try {
    const parsed = new URL(url);
    return parsed.pathname === "/favicon.ico" || (parsed.hostname === "fonts.gstatic.com" && /\.(?:woff2?|ttf|otf)$/i.test(parsed.pathname));
  } catch { return false; }
}

fs.mkdirSync(artifactDir, { recursive: true });
const vite = await createServer({ root, server: { host: "127.0.0.1", port, strictPort: true }, logLevel: "error" });
let browser;
try {
  await vite.listen();
  browser = await chromium.launch({ executablePath: chromeExecutable(), headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const results = [];
  for (const width of [320, 390, 900]) {
    for (let level = 1; level <= 5; level += 1) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const pageErrors = [];
      const consoleErrors = [];
      const httpFailures = [];
      page.on("pageerror", error => pageErrors.push(String(error)));
      page.on("console", msg => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
      page.on("response", response => { if (response.status() >= 400 && !ignorableHttp(response.url())) httpFailures.push(`${response.status()} ${response.url()}`); });

      await page.goto(`${base}?level=${level}`, { waitUntil: "networkidle" });
      await page.locator("[data-fracao-numero-probe]").waitFor();
      await page.locator("[data-f72-stage]").waitFor();
      const before = await page.evaluate(() => {
        const probe = document.querySelector("[data-fracao-numero-probe]");
        const stage = document.querySelector("[data-f72-stage]");
        const get = name => probe?.getAttribute(name) ?? "";
        const box = stage?.getBoundingClientRect();
        return {
          level: Number(get("data-level")), mode: get("data-mode"), support: get("data-support"),
          numerator: Number(get("data-numerator")), denominator: Number(get("data-denominator")), answer: get("data-answer"),
          lineEnd: Number(get("data-line-end")), fullMarks: get("data-full-marks") === "true", generic: get("data-generic-options") === "true",
          steps: Number(get("data-resolution-steps")), final: get("data-resolution-final"), evidence: get("data-evidence"),
          hasBar: Boolean(document.querySelector("[data-singapore-fraction-bar]")), hasCollection: Boolean(document.querySelector("[data-f72-collection]")), hasLine: Boolean(document.querySelector("[data-f72-line]")),
          scroll: document.documentElement.scrollWidth, width: innerWidth, box: box ? [box.left, box.right] : null,
          fallback: document.body.textContent?.includes("Em construção") || document.body.textContent?.includes("Ficha não implementada"),
        };
      });
      assert(before.level === level, `F72 L${level}/${width}: nível`);
      assert(before.mode === modos[level - 1], `F72 L${level}/${width}: modo`);
      assert(before.support === suportes[level - 1], `F72 L${level}/${width}: suporte`);
      assert(before.steps === 2 && before.final === before.answer, `F72 L${level}/${width}: R0-A`);
      assert(before.evidence === "fracao-numero-reta-nivel-3mais", `F72 L${level}/${width}: evidência`);
      assert(!before.generic && !before.fallback, `F72 L${level}/${width}: palco autoral`);
      assert(before.hasBar === (level !== 2), `F72 L${level}/${width}: SingaporeBars`);
      assert(before.hasCollection === (level === 2), `F72 L${level}/${width}: coleção`);
      assert(before.hasLine === (level >= 3), `F72 L${level}/${width}: reta`);
      if (level === 3) assert(before.fullMarks, `F72 L3/${width}: marcas completas`);
      if (level === 4) assert(!before.fullMarks, `F72 L4/${width}: marcas parciais`);
      if (level === 5) assert(before.numerator > before.denominator && before.lineEnd === before.denominator * 2, `F72 L5/${width}: imprópria até 2`);
      assert(before.scroll <= before.width + 1, `F72 L${level}/${width}: overflow`);
      if (before.box) assert(before.box[0] >= -1 && before.box[1] <= width + 1, `F72 L${level}/${width}: viewport`);

      if (level <= 2) {
        await page.locator(`[data-f72-option="${before.answer}"]`).click();
      } else {
        await page.locator(`[data-reta-tick="${before.numerator}"]`).dispatchEvent("click");
      }
      await page.waitForFunction(() => JSON.parse(document.querySelector("[data-fracao-numero-probe]")?.getAttribute("data-receipts") || "[]").length > 0);
      const receipts = JSON.parse(await page.locator("[data-fracao-numero-probe]").getAttribute("data-receipts") || "[]");
      const receipt = receipts.at(-1);
      assert(receipt?.correct === true, `F72 L${level}/${width}: acerto não reconhecido`);
      if (level >= 3) assert(receipt?.meta?.evidencias?.includes("fracao-numero-reta-nivel-3mais"), `F72 L${level}/${width}: evidência de reta`);

      const fatalConsole = consoleErrors.filter(text => !/Failed to load resource/i.test(text));
      assert(pageErrors.length === 0, `F72 L${level}/${width}: pageerror ${pageErrors.join(" | ")}`);
      assert(httpFailures.length === 0, `F72 L${level}/${width}: HTTP ${httpFailures.join(" | ")}`);
      assert(fatalConsole.length === 0, `F72 L${level}/${width}: console ${fatalConsole.join(" | ")}`);
      const screenshot = `f72-${width}-l${level}.png`;
      await page.screenshot({ path: path.join(artifactDir, screenshot), fullPage: true });
      results.push({ width, level, mode: before.mode, screenshot });
      await page.close();
    }
  }
  fs.writeFileSync(path.join(artifactDir, "fracao-numero-summary.json"), `${JSON.stringify({ ok: true, checkedAt: new Date().toISOString(), results }, null, 2)}\n`);
  console.log("[SONDA F72] OK — 15 cenários em Chrome real, 320/390/900 × níveis 1–5.");
} catch (error) {
  fs.writeFileSync(path.join(artifactDir, "fracao-numero-summary.json"), `${JSON.stringify({ ok: false, checkedAt: new Date().toISOString(), error: error instanceof Error ? error.stack || error.message : String(error) }, null, 2)}\n`);
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  await vite.close();
}
