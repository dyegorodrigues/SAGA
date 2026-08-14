import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
import { createServer } from "vite";

const root = process.cwd();
const port = Number(process.env.SONDA_F45_PORT || 5215);
const base = `http://127.0.0.1:${port}/sonda/partes-iguais.html`;
const artifactDir = path.join(root, ".artifacts", "sonda-sensei-dojo");
const modos = ["reconhecer", "sobrepor", "nomear", "produzir", "simbolo"];
const suportes = ["circulo", "circulo", "barra", "barra", "barra"];
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
      await page.locator("[data-partes-iguais-probe]").waitFor();
      await page.locator("[data-f45-stage]").waitFor();

      const before = await page.evaluate(() => {
        const probe = document.querySelector("[data-partes-iguais-probe]");
        const stage = document.querySelector("[data-f45-stage]");
        const get = name => probe?.getAttribute(name) ?? "";
        const box = stage?.getBoundingClientRect();
        return {
          level: Number(get("data-level")), mode: get("data-mode"), support: get("data-support"),
          denominator: Number(get("data-denominator")), answer: get("data-answer"), generic: get("data-generic-options") === "true",
          steps: Number(get("data-resolution-steps")), final: get("data-resolution-final"), evidence: get("data-evidence"),
          touch: get("data-touch-alternative") === "true", targets: JSON.parse(get("data-targets") || "[]"),
          scroll: document.documentElement.scrollWidth, width: innerWidth, box: box ? [box.left, box.right] : null,
          fallback: document.body.textContent?.includes("Em construção") || document.body.textContent?.includes("Ficha não implementada"),
          hasCircle: Boolean(document.querySelector("[data-f45-circle]")),
          hasBar: Boolean(document.querySelector("[data-singapore-fraction-bar]")),
        };
      });

      assert(before.level === level, `F45 L${level}/${width}: nível`);
      assert(before.mode === modos[level - 1], `F45 L${level}/${width}: modo ${before.mode}`);
      assert(before.support === suportes[level - 1], `F45 L${level}/${width}: suporte ${before.support}`);
      assert([2, 3, 4].includes(before.denominator), `F45 L${level}/${width}: denominador`);
      assert(before.answer && before.final === before.answer, `F45 L${level}/${width}: resolução final`);
      assert(before.steps === 2, `F45 L${level}/${width}: resolução R0-A`);
      assert(before.evidence === "partes-iguais-corte-nivel-4", `F45 L${level}/${width}: evidência`);
      assert(!before.generic && !before.fallback, `F45 L${level}/${width}: palco autoral sem fallback/opções genéricas`);
      assert((level <= 2) === before.hasCircle, `F45 L${level}/${width}: linguagem ShapeCanvas`);
      assert((level >= 3) === before.hasBar, `F45 L${level}/${width}: linguagem SingaporeBars`);
      assert((level === 4) === before.touch, `F45 L${level}/${width}: alternativa motora`);
      assert(before.scroll <= before.width + 1, `F45 L${level}/${width}: overflow ${before.scroll}>${before.width}`);
      if (before.box) assert(before.box[0] >= -1 && before.box[1] <= width + 1, `F45 L${level}/${width}: palco fora da viewport`);

      if (level === 4) {
        const ranges = page.locator("[data-f45-range]");
        assert(await ranges.count() === before.denominator - 1, `F45 L4/${width}: quantidade de controles`);
        assert(await page.locator("[data-f45-nudge]").count() >= 2, `F45 L4/${width}: toque alternativo ausente`);
        for (let i = 0; i < before.targets.length; i += 1) {
          const alvo = Math.round(before.targets[i] * 12);
          await ranges.nth(i).evaluate((el, value) => {
            el.value = String(value);
            el.dispatchEvent(new Event("input", { bubbles: true }));
            el.dispatchEvent(new Event("change", { bubbles: true }));
          }, alvo);
        }
        await page.locator("[data-f45-submit]").click();
      } else {
        await page.locator(`[data-f45-option="${before.answer}"]`).click();
      }

      await page.waitForFunction(() => JSON.parse(document.querySelector("[data-partes-iguais-probe]")?.getAttribute("data-receipts") || "[]").length > 0);
      const receipts = JSON.parse(await page.locator("[data-partes-iguais-probe]").getAttribute("data-receipts") || "[]");
      const receipt = receipts.at(-1);
      assert(receipt?.correct === true, `F45 L${level}/${width}: resposta correta não reconhecida`);
      if (level === 4) assert(receipt?.meta?.evidencias?.includes("partes-iguais-corte-nivel-4"), `F45 L4/${width}: evidência não emitida`);

      const fatalConsole = consoleErrors.filter(text => !/Failed to load resource/i.test(text));
      assert(pageErrors.length === 0, `F45 L${level}/${width}: pageerror ${pageErrors.join(" | ")}`);
      assert(httpFailures.length === 0, `F45 L${level}/${width}: HTTP ${httpFailures.join(" | ")}`);
      assert(fatalConsole.length === 0, `F45 L${level}/${width}: console ${fatalConsole.join(" | ")}`);

      const screenshot = `f45-${width}-l${level}.png`;
      await page.screenshot({ path: path.join(artifactDir, screenshot), fullPage: true });
      results.push({ width, level, mode: before.mode, support: before.support, denominator: before.denominator, screenshot });
      await page.close();
    }
  }

  fs.writeFileSync(path.join(artifactDir, "partes-iguais-summary.json"), `${JSON.stringify({ ok: true, checkedAt: new Date().toISOString(), results }, null, 2)}\n`);
  console.log("[SONDA F45] OK — 15 cenários em Chrome real, 320/390/900 × níveis 1–5.");
} catch (error) {
  fs.writeFileSync(path.join(artifactDir, "partes-iguais-summary.json"), `${JSON.stringify({ ok: false, checkedAt: new Date().toISOString(), error: error instanceof Error ? error.stack || error.message : String(error) }, null, 2)}\n`);
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  await vite.close();
}
