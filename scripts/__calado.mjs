import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { T, primeiroAcesso, abrir } from "./navegar.mjs";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 820, height: 900 } });
await page.addInitScript(() => {
  window.__f = [];
  const A = window.Audio;
  window.Audio = function (s) { window.__f.push({ via: "arq", t: Date.now(), o: String(s).split("/").pop() }); return new A(s); };
  window.Audio.prototype = A.prototype;
  const ss = window.speechSynthesis;
  if (ss?.speak) { const o = ss.speak.bind(ss); ss.speak = u => { window.__f.push({ via: "apar", t: Date.now(), o: String(u.text).slice(0, 50) }); return o(u); }; }
});
await primeiroAcesso(page);
mkdirSync("/tmp/provas", { recursive: true });
for (const alvo of (process.env.ALVOS ?? "Contagem com cardinalidade").split("|")) {
  if (!(await abrir(page, alvo, 1))) { console.log(`sem cartão ${alvo}`); continue; }
  await page.evaluate(() => { window.__f = []; window.__t0 = Date.now(); });
  await page.waitForTimeout(14000);
  const falas = await page.evaluate(() => window.__f.map(x => `+${x.t - window.__t0}ms ${x.via} ${x.o}`));
  const botoes = await page.getByRole("button").all();
  const nomes = [];
  for (const b of botoes) if (await b.isVisible().catch(() => false))
    nomes.push(`${await b.getAttribute("aria-label") ?? (await b.innerText().catch(() => "")).slice(0, 24)}${await b.isDisabled().catch(() => false) ? " [morto]" : ""}`);
  const foto = `/tmp/provas/calado_${alvo.replace(/[^\w]+/g, "_")}.png`;
  await page.screenshot({ path: foto });
  console.log(`\n=== ${alvo} ===`);
  console.log("falas:", falas.length ? falas.join(" | ") : "NENHUMA");
  console.log("texto:", (await T(page)).slice(0, 300));
  console.log("botões:", nomes.join(" · "));
  console.log("foto:", foto);
}
await browser.close();
