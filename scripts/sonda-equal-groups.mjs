import { chromium } from "playwright-core";

const BASE = process.env.SONDA_F97_URL || "http://127.0.0.1:5212/sonda/equal-groups.html";
const CHROME = process.env.SONDA_CHROME || chromium.executablePath();
const assert = (ok, msg) => { if (!ok) throw new Error(msg); };

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(String(error)));
  page.on("console", msg => { if (msg.type() === "error" && !msg.text().includes("favicon")) errors.push(msg.text()); });

  for (const width of [320, 390, 900]) {
    for (let level = 1; level <= 5; level += 1) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${BASE}?level=${level}&seed=9701`, { waitUntil: "networkidle" });
      await page.locator("[data-equal-groups-probe]").waitFor();
      const s = await page.evaluate(() => {
        const p = document.querySelector("[data-equal-groups-probe]");
        const g = n => p?.getAttribute(n) ?? "";
        const box = document.querySelector("[data-equal-groups-stage]")?.getBoundingClientRect();
        return {
          groups: +g("data-groups"), per: +g("data-per-group"), total: +g("data-total"),
          rep: g("data-representation"), sum: g("data-sum"), mul: g("data-multiplication"),
          showSum: g("data-show-sum") === "true", showMul: g("data-show-multiplication") === "true",
          generic: g("data-generic-options") === "true", steps: +g("data-resolution-steps"), final: +g("data-resolution-final"),
          evidence: g("data-evidence"), groupsDom: document.querySelectorAll("[data-equal-group]").length,
          sumDom: !!document.querySelector("[data-equal-groups-sum]"), mulDom: !!document.querySelector("[data-equal-groups-multiplication]"),
          scroll: document.documentElement.scrollWidth, width: innerWidth, box: box ? [box.left, box.right] : null,
        };
      });
      const lim = [[0,0],[3,3],[5,3],[5,5],[10,5],[10,10]][level];
      assert(s.groups >= 2 && s.groups <= lim[0] && s.per >= 2 && s.per <= lim[1], `F97 L${level}: escada`);
      assert(s.total === s.groups * s.per, `F97 L${level}: produto`);
      assert(s.rep === (level <= 2 ? "soma-repetida" : level === 3 ? "ponte" : "multiplicacao"), `F97 L${level}: representação`);
      assert(s.sum === Array.from({ length: s.groups }, () => String(s.per)).join(" + "), `F97 L${level}: soma`);
      assert(s.mul === `${s.groups} × ${s.per}`, `F97 L${level}: multiplicação`);
      assert(s.showSum === (level <= 3) && s.sumDom === (level <= 3), `F97 L${level}: soma visível`);
      assert(s.showMul === (level >= 3) && s.mulDom === (level >= 3), `F97 L${level}: multiplicação visível`);
      assert(s.groupsDom === s.groups && !s.generic, `F97 L${level}: palco`);
      assert(s.steps === 2 && s.final === s.total, `F97 L${level}: resolução`);
      assert(s.evidence === (level >= 3 ? "grupos-iguais-notacao-multiplicativa" : ""), `F97 L${level}: evidência`);
      assert(s.scroll <= s.width + 1, `F97 L${level}: overflow`);
      if (s.box) assert(s.box[0] >= -1 && s.box[1] <= width + 1, `F97 L${level}: viewport`);
    }
  }
  assert(errors.length === 0, errors.join(" | "));
  console.log("Sonda F97 OK — 15 cenários em Chrome real.");
} finally {
  await browser.close();
}
