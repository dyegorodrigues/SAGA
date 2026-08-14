import fs from "node:fs";
import { chromium } from "playwright-core";
import { createServer } from "vite";

const root = process.cwd();
const port = 5220;
const base = `http://127.0.0.1:${port}/sonda/perimetro.html`;
const modes = ["contar-malha", "somar-lados", "figura-irregular", "perimetro-vs-area", "lado-faltante"];
const assert = (ok, message) => { if (!ok) throw new Error(message); };
const executable = [process.env.SONDA_CHROME, "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", chromium.executablePath()].filter(Boolean).find(path => fs.existsSync(path));
if (!executable) throw new Error("Chrome ausente");
const isExternalFontFailure = response => response.request().resourceType() === "font" && response.url().startsWith("https://fonts.gstatic.com/");

const vite = await createServer({ root, server: { host: "127.0.0.1", port, strictPort: true }, logLevel: "error" });
let browser;
try {
  await vite.listen();
  browser = await chromium.launch({ executablePath: executable, headless: true, args: ["--no-sandbox"] });
  for (const width of [320, 390, 900]) {
    for (let level = 1; level <= 5; level += 1) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const pageErrors = [];
      const failedResponses = [];
      page.on("pageerror", error => pageErrors.push(String(error)));
      page.on("response", response => {
        if (response.status() >= 400 && !isExternalFontFailure(response)) failedResponses.push(`${response.status()} ${response.url()}`);
      });
      await page.goto(`${base}?level=${level}`, { waitUntil: "networkidle" });
      const probe = page.locator("[data-f63-probe]");
      await probe.waitFor();
      const snapshot = await page.evaluate(() => {
        const probe = document.querySelector("[data-f63-probe]");
        const get = name => probe?.getAttribute(name) || "";
        return {
          level: Number(get("data-level")),
          mode: get("data-mode"),
          answer: Number(get("data-answer")),
          perimeter: Number(get("data-perimeter")),
          area: Number(get("data-area")),
          generic: get("data-generic"),
          steps: Number(get("data-steps")),
          final: Number(get("data-final")),
          evidence: get("data-evidence"),
          stage: document.querySelectorAll("[data-f63-stage]").length,
          grid: document.querySelectorAll("[data-f63-grid]").length,
          outline: document.querySelectorAll("[data-f63-outline]").length,
          scroll: document.documentElement.scrollWidth,
          width: innerWidth,
        };
      });
      assert(snapshot.level === level, `F63 nível ${level} divergente`);
      assert(snapshot.mode === modes[level - 1], `F63 L${level} modo ${snapshot.mode}`);
      assert(snapshot.generic === "false" && snapshot.steps === 3 && snapshot.final === snapshot.answer, `F63 L${level} contrato R0-A`);
      assert(snapshot.stage === 1 && snapshot.grid === 1 && snapshot.outline === 1, `F63 L${level} composição ArrayGrid+ShapeCanvas perdida`);
      assert(snapshot.perimeter > 0 && snapshot.area > 0, `F63 L${level} grandezas inválidas`);
      assert(level === 4 ? snapshot.evidence === "perimetro-vs-area-nivel-4" : snapshot.evidence === "", `F63 L${level} evidência declarada`);
      assert(snapshot.scroll <= snapshot.width + 1, `F63 L${level} overflow em ${width}px`);
      assert(pageErrors.length === 0, `F63 L${level} pageerror: ${pageErrors.join(" | ")}`);
      assert(failedResponses.length === 0, `F63 L${level} HTTP >=400: ${failedResponses.join(" | ")}`);
      await page.locator(`[data-f63-option="${snapshot.answer}"]`).click();
      await page.waitForFunction(() => JSON.parse(document.querySelector("[data-f63-probe]")?.getAttribute("data-receipts") || "[]").length > 0);
      const receipts = JSON.parse(await probe.getAttribute("data-receipts") || "[]");
      assert(receipts.at(-1)?.correct === true, `F63 L${level} acerto não chegou ao runtime`);
      if (level === 4) assert(receipts.at(-1)?.meta?.evidencias?.includes("perimetro-vs-area-nivel-4"), "F63 L4 não emitiu evidência");
      else assert(!(receipts.at(-1)?.meta?.evidencias ?? []).includes("perimetro-vs-area-nivel-4"), `F63 L${level} emitiu evidência indevida`);
      await page.close();
    }
  }
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  await vite.close();
}
if (!process.exitCode) console.log("[SONDA F63] OK — 15 cenários em Chrome real, 320/390/900 × níveis 1–5.");
