/** Joga um exercício de verdade, respondendo, e conta se ele AVANÇA. */
import { chromium } from "playwright-core";
const BASE = "http://localhost:3000";
const ALVO = process.env.ALVO;
const RODADAS = Number(process.env.RODADAS ?? 4);
const T = async p => (await p.locator("body").innerText().catch(() => "")).replace(/\s+/g, " ");
const esperar = async (p, c, ms = 25000) => { const l = Date.now() + ms; while (Date.now() < l) { const t = await T(p); if (c(t)) return t; await p.waitForTimeout(200); } return null; };
const clicar = async (p, re, esp) => { const a = p.getByRole("button", { name: re }).first(); if (!(await a.count())) return false; await a.click({ timeout: 15000 }).catch(() => {}); if (esp) return Boolean(await esperar(p, t => esp.test(t))); await p.waitForTimeout(600); return true; };

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
page.on("pageerror", e => console.log("ERRO JS:", String(e).slice(0, 160)));
await page.goto(`${BASE}/?destravado=123`, { waitUntil: "domcontentloaded", timeout: 60000 });
await esperar(page, t => /Começar sem Conta/i.test(t), 30000);
await clicar(page, /Começar sem Conta/i, /Monte seus Perfis/i);
await clicar(page, /Criar Primeiro Perfil|Criar Perfil|Novo Perfil/i, /Configurar Perfil/i);
await page.locator('input[type="text"]').first().fill("Teo");
await clicar(page, /1º Ano EF/i);
await clicar(page, /Começar Aventura/i, /Quem vai brincar|JOGAR/i);
await clicar(page, /JOGAR/i, /Sensei|Aventura|Missão|Sondagem/i);
await page.waitForTimeout(700);
for (let i = 0; i < 3; i += 1) { const a = page.locator("button", { hasText: /^Jornada$/i }); if (await a.count()) { await a.first().click().catch(()=>{}); await page.waitForTimeout(1200); } if (await page.getByRole("button", { name: /: disponível$/ }).count()) break; }
const cartao = page.getByRole("button", { name: `${ALVO}: disponível` }).first();
if (!(await cartao.count())) {
  const todos = await page.getByRole("button", { name: /: dispon[ií]vel$/ }).all();
  const nomes = await Promise.all(todos.map(a => a.getAttribute("aria-label")));
  console.log("disponíveis:\n  " + nomes.join("\n  "));
  await browser.close(); process.exit(1);
}
await cartao.click();
await page.waitForTimeout(1000);
const bn = page.getByRole("button", { name: new RegExp(`^${process.env.NIVEL ?? 1} N[ií]vel`) }).first();
if (await bn.count()) await bn.click();

const vivos = async () => {
  const b = await page.locator("button:not([disabled])").all();
  const out = [];
  for (const x of b) {
    const n = ((await x.getAttribute("aria-label")) || (await x.textContent()) || "").replace(/\s+/g, " ").trim();
    if (n && !/^(Fechar|Sair|Avançar|Continuar|×|Ver Resultado|Voltar)$/i.test(n)) out.push(n);
  }
  return out;
};

for (let r = 1; r <= RODADAS; r += 1) {
  await page.waitForTimeout(13000);         // deixa a aulinha e o roteiro correrem
  const antes = (await T(page)).slice(0, 110);
  const botoes = await vivos();
  console.log(`\n--- rodada ${r} ---\ntela:   ${antes}\nbotões: ${botoes.slice(0, 10).join(" | ")}`);

  // responde: tenta o fluxo armar→confirmar; senão clica na primeira alternativa
  const alt = page.locator('[aria-label="Alternativas"] button:not([disabled])').first();
  if (await alt.count()) {
    await alt.click().catch(() => {});
    await page.waitForTimeout(700);
    const conf = page.locator('[aria-label^="Confirmar:"]').first();
    if (await conf.count()) {
      const t0 = Date.now();
      let erro = null;
      await conf.click({ timeout: 4000 }).catch(e => { erro = String(e).split("\n")[0]; });
      console.log(`respondeu: armar + confirmar (${Date.now() - t0}ms)${erro ? " ERRO: " + erro : ""}`);
      if (erro) { await conf.click({ force: true }).catch(() => {}); console.log("   → tentei com force:true"); }
    }
    else console.log("respondeu: UM toque (sem barra de confirmar)");
  } else { console.log("respondeu: nada para tocar"); }

  await page.waitForTimeout(2500);
  const depois = (await T(page)).slice(0, 110);
  console.log(`depois: ${depois}`);
  if (depois === antes) console.log("⚠️ A TELA NÃO MUDOU — travou");
  const avancar = page.getByRole("button", { name: /^(Avançar|Continuar|Próxima)/i }).first();
  if (await avancar.count()) { await avancar.click().catch(() => {}); console.log("(cliquei Avançar)"); }
}
await page.screenshot({ path: "/tmp/claude-0/-home-user/e1279bcf-db2e-595a-a180-976cb6ec877d/scratchpad/fim.png" });
await browser.close();
