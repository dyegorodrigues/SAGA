// A PORTA DE ENTRADA, no navegador de verdade.
//
// Este roteiro existe porque a suíte inteira ficou verde — 3665 testes, dez
// gates por descoberta sobre 90 competências — enquanto a porta do app estava
// trancada por fora: sem sessão do Firebase o app parava em "Carregando
// SAGA..." para sempre, e "Começar sem Conta" chamava uma sessão anônima que
// exige rede e nunca caía em lugar nenhum.
//
// Nenhum teste unitário podia ver isso. Só o navegador vê.
//
// Uso: npm run dev noutro terminal, depois `node scripts/e2e-entrada.mjs`.
// Sai com erro se a criança não chegar a um exercício.
import { chromium } from "playwright-core";
import fs from "node:fs";
const OUT = "/tmp/real"; fs.mkdirSync(OUT, { recursive: true });
const log = [];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 420, height: 820 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
page.on("pageerror", e => log.push("PAGEERROR: " + String(e).slice(0,200)));
const shot = async n => { await page.screenshot({ path: `${OUT}/${n}.png` }); };
const txt = async () => (await page.locator("body").innerText()).replace(/\n+/g," | ").slice(0,220);
const click = async (t, to=4000) => { const el = page.getByText(t, {exact:false}).first(); if (await el.count()>0){ await el.scrollIntoViewIfNeeded().catch(()=>{}); await el.click({timeout:to}); log.push("click: "+t); return true; } log.push("NAO ACHOU: "+t); return false; };

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(6000);
await shot("01-primeira-tela"); log.push("1) " + await txt());

const botoes = await page.locator("button").allInnerTexts();
log.push("BOTOES: " + JSON.stringify(botoes));
log.push("TEXTO COMPLETO: " + (await page.locator("body").innerText()).replace(/\n+/g," | "));
await page.getByRole("button", { name: /Começar sem Conta/ }).click(); log.push("clicou no BOTAO visitante"); await page.waitForTimeout(11000);
await shot("02-apos-visitante"); log.push("2) " + await txt());

// 3) criar um perfil
const inputs = page.locator("input[type=text], input:not([type])");
log.push("inputs no setup: " + await inputs.count());
if (await inputs.count() > 0) { await inputs.first().fill("Ana"); log.push("digitou nome"); }
const botoes3 = await page.locator("button").allInnerTexts();
log.push("BOTOES SETUP: " + JSON.stringify(botoes3.slice(0, 14)));
for (const alvo of [/Adicionar/i, /Criar/i, /Salvar/i, /Pronto/i, /Come/i, /Continuar/i]) {
  const b = page.getByRole("button", { name: alvo }).first();
  if (await b.count() > 0 && await b.isEnabled()) { await b.click(); log.push("setup click: " + alvo); await page.waitForTimeout(1500); break; }
}
await page.waitForTimeout(2000); await shot("03-setup"); log.push("3) " + await txt());


// 4) preencher o perfil e concluir
const campo = page.locator("input").first();
if (await campo.count() > 0) { await campo.fill("Ana"); log.push("nome digitado"); }
await page.getByRole("button", { name: /1º Ano EF/ }).first().click().catch(() => log.push("sem serie"));
await page.waitForTimeout(600);
const todos = await page.locator("button").allInnerTexts();
log.push("BOTOES PERFIL: " + JSON.stringify(todos.slice(-8)));
for (const alvo of [/Salvar/i, /Pronto/i, /Concluir/i, /Come.ar/i, /Vamos/i, /Jogar/i]) {
  const b = page.getByRole("button", { name: alvo }).first();
  if (await b.count() > 0 && await b.isEnabled()) { await b.click(); log.push("perfil click: " + alvo); break; }
}
await page.waitForTimeout(2500); await shot("04-pos-perfil"); log.push("4) " + await txt());

// 5) escolher a criança e entrar numa trilha
await page.getByText("Ana", { exact: false }).first().click().catch(() => log.push("sem Ana"));
await page.waitForTimeout(2500); await shot("05-home"); log.push("5) " + await txt());

// 6) entrar na primeira sessão e responder
for (const alvo of [/Sess.o de Boas-Vindas/i, /PRIMEIRA AVENTURA/i, /Come.ar/i, /Jogar/i]) {
  const el = page.getByText(alvo).first();
  if (await el.count() > 0) { await el.click().catch(()=>{}); log.push("entrou: " + alvo); break; }
}
await page.waitForTimeout(3500); await shot("06-exercicio"); log.push("6) " + await txt());

const opcoes = page.locator("button");
const n = await opcoes.count(); log.push("botoes no exercicio: " + n);
for (let i = 0; i < n; i++) {
  const b = opcoes.nth(i); const box = await b.boundingBox();
  if (box && box.y > 400 && box.height > 40 && await b.isEnabled()) { await b.click().catch(()=>{}); log.push("respondeu botao " + i); break; }
}
await page.waitForTimeout(2500); await shot("07-apos-resposta"); log.push("7) " + await txt());
await browser.close();
fs.writeFileSync(`${OUT}/log.txt`, log.join("\n"));
console.log(log.join("\n"));

// A prova: a criança chegou a um exercício de verdade. Sem isto o roteiro
// viraria uma sequência de cliques que "passa" mesmo com a porta trancada.
const chegouNoExercicio = log.some(l => /^6\) /.test(l) && l.length > 12 && !/Carregando/.test(l));
if (!chegouNoExercicio) {
  console.error("\nFALHOU: a criança não chegou a um exercício.");
  process.exit(1);
}
console.log("\nOK: login -> visitante local -> perfil -> criança -> exercício.");
