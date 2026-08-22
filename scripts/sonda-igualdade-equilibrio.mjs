import fs from "node:fs";
import { chromium } from "playwright-core";
import { createServer } from "vite";

const root = process.cwd();
const port = 5221;
const base = `http://127.0.0.1:${port}/sonda/igualdade-equilibrio.html`;
const modes = ["igualdade-simples", "soma-um-lado", "incognita-meio", "somas-dois-lados", "saco-fechado"];
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
      const probe = page.locator("[data-f46-probe]");
      await probe.waitFor();
      const snapshot = await page.evaluate(() => {
        const probe = document.querySelector("[data-f46-probe]");
        const get = name => probe?.getAttribute(name) || "";
        return {
          level: Number(get("data-level")),
          mode: get("data-mode"),
          caso: get("data-case"),
          answer: Number(get("data-answer")),
          generic: get("data-generic"),
          steps: Number(get("data-steps")),
          final: Number(get("data-final")),
          tutorial: Number(get("data-tutorial")),
          prefix: get("data-evidence-prefix"),
          min: Number(get("data-evidence-min")),
          stage: document.querySelectorAll("[data-f46-stage]").length,
          buttons: document.querySelectorAll("[data-f46-option]").length,
          scroll: document.documentElement.scrollWidth,
          width: innerWidth,
        };
      });
      assert(snapshot.level === level, `F46 nível ${level} divergente`);
      assert(snapshot.mode === modes[level - 1], `F46 L${level} modo ${snapshot.mode}`);
      assert(snapshot.generic === "false" && snapshot.steps === 3 && snapshot.final === snapshot.answer, `F46 L${level} contrato R0-A`);
      assert(snapshot.stage === 1 && snapshot.buttons >= 3, `F46 L${level} palco/opções ausentes`);
      assert(level === 1 ? snapshot.tutorial === 4 : snapshot.tutorial === 0, `F46 L${level} onboarding ${snapshot.tutorial}`);
      if (level === 4) {
        assert(snapshot.prefix === "igualdade-equilibrio-l4-" && snapshot.min === 2, "F46 L4 perdeu diversidade de domínio");
      } else {
        assert(snapshot.prefix === "" && snapshot.min === 0, `F46 L${level} diversidade antecipada`);
      }
      assert(snapshot.scroll <= snapshot.width + 1, `F46 L${level} overflow em ${width}px`);
      assert(pageErrors.length === 0, `F46 L${level} pageerror: ${pageErrors.join(" | ")}`);
      assert(failedResponses.length === 0, `F46 L${level} HTTP >=400: ${failedResponses.join(" | ")}`);
      await page.locator(`[data-f46-option="${snapshot.answer}"]`).click();
      await page.waitForFunction(() => JSON.parse(document.querySelector("[data-f46-probe]")?.getAttribute("data-receipts") || "[]").length > 0);
      const receipts = JSON.parse(await probe.getAttribute("data-receipts") || "[]");
      assert(receipts.at(-1)?.correct === true, `F46 L${level} acerto não chegou ao runtime`);
      if (level === 4) assert((receipts.at(-1)?.meta?.evidencias ?? []).some(value => value === `igualdade-equilibrio-l4-${snapshot.caso}`), "F46 L4 não emitiu evidência do caso");
      else assert(!(receipts.at(-1)?.meta?.evidencias ?? []).some(value => String(value).startsWith("igualdade-equilibrio-l4-")), `F46 L${level} emitiu evidência indevida`);
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
if (!process.exitCode) console.log("[SONDA F46] OK — 15 cenários em Chrome real, 320/390/900 × níveis 1–5.");
