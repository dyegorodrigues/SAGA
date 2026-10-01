import { chromium } from "playwright-core";
import { T, primeiroAcesso, abrir } from "./navegar.mjs";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 820, height: 900 } });
const botoes = async () => {
  const r = [];
  for (const b of await page.getByRole("button").all())
    if (await b.isVisible().catch(() => false))
      r.push((await b.getAttribute("aria-label")) ?? (await b.innerText().catch(() => "")).replace(/\s+/g, " ").slice(0, 30));
  return r;
};
await primeiroAcesso(page);
for (const alvo of (process.env.ALVOS ?? "Formas planas básicas").split("|")) {
  await abrir(page, alvo, 1);
  await page.waitForTimeout(7000);
  console.log(`\n=== ${alvo} ===`);
  console.log("ANTES  texto:", (await T(page)).slice(0, 160));
  console.log("ANTES  botões:", (await botoes()).join(" · "));
  const alvoBotao = (await page.getByRole("button").all()).find(async () => true);
  const opcao = page.getByRole("button", { name: process.env.OPCAO ?? /^o (círculo|quadrado|triângulo)$/ }).first();
  if (!(await opcao.count())) { console.log("alternativa não encontrada"); continue; }
  const rotulo = await opcao.getAttribute("aria-label");
  await opcao.click({ timeout: 5000 }).catch(e => console.log("clique falhou:", String(e).slice(0, 60)));
  await page.waitForTimeout(1200);
  console.log(`tocou em: ${rotulo}`);
  console.log("DEPOIS texto:", (await T(page)).slice(0, 160));
  console.log("DEPOIS botões:", (await botoes()).join(" · "));
}
await browser.close();
