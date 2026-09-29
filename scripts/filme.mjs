/**
 * O filme do exercício — para enxergar o que se move.
 *
 * ## Por que existe
 *
 * As sondas anteriores tiravam UMA foto e liam o texto da tela. Isso encontra
 * tela morta, botão sem nome e alvo pequeno — e é cego para tudo que só existe
 * em MOVIMENTO: a demonstração que pisca, a tampa que fecha antes de a criança
 * ver o que tinha embaixo, o palco que troca de cena no meio.
 *
 * O pai descreveu exatamente esses: "ele tampa, mas não mostra o que tinha
 * antes, é muito rápido", "fica os três pontinhos oscilando, aí ele muda,
 * pisca, muda". Nenhuma foto única mostra isso.
 *
 * Este script filma: uma foto a cada `PASSO_MS` durante `SEGUNDOS`, e monta as
 * fotos numa FOLHA DE CONTATO — uma imagem só, em grade, na ordem do tempo.
 * Numa folha dessas o piscar aparece: é o quadro que quebra a sequência.
 *
 *     npm run build && npm start &
 *     ALVO="Correspondência um a um" NIVEL=1 node scripts/filme.mjs
 *     # saída: /tmp/saga-filme/<alvo>-n<nivel>/folha.png
 *
 * `COMOFAZ=1` clica em "Como faz?" antes de filmar. `ESPERA_MS` atrasa o
 * início, para pegar o meio de um roteiro longo.
 */
import { chromium } from "playwright-core";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";

const BASE = process.env.SAGA_URL ?? "http://localhost:3000";
const CHROMIUM = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";
const ALVO = process.env.ALVO ?? "Correspondência um a um";
const NIVEL = process.env.NIVEL ?? "1";
const PASSO_MS = Number(process.env.PASSO_MS ?? 250);
const SEGUNDOS = Number(process.env.SEGUNDOS ?? 12);
const ESPERA_MS = Number(process.env.ESPERA_MS ?? 0);
const COMOFAZ = process.env.COMOFAZ === "1";
const SAIDA = `/tmp/saga-filme/${ALVO.replace(/\W+/g, "_")}-n${NIVEL}`;

const T = async p => (await p.locator("body").innerText().catch(() => "")).replace(/\s+/g, " ");
const esperar = async (p, c, ms = 25000) => { const l = Date.now() + ms; while (Date.now() < l) { const t = await T(p); if (c(t)) return t; await p.waitForTimeout(250); } return null; };
const clicar = async (p, re, esp) => { const a = p.getByRole("button", { name: re }).first(); if (!(await a.count())) return false; await a.click({ timeout: 15000 }).catch(() => {}); if (esp) return Boolean(await esperar(p, t => esp.test(t))); await p.waitForTimeout(600); return true; };

rmSync(SAIDA, { recursive: true, force: true });
mkdirSync(SAIDA, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROMIUM });
const page = await browser.newPage({ viewport: { width: 390, height: 700 } });
page.on("pageerror", e => console.log("ERRO JS:", String(e).slice(0, 180)));

await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
await esperar(page, t => /Começar sem Conta/i.test(t), 30000);
await clicar(page, /Começar sem Conta/i, /Monte seus Perfis/i);
await clicar(page, /Criar Primeiro Perfil|Criar Perfil|Novo Perfil/i, /Configurar Perfil/i);
await page.locator('input[type="text"]').first().fill("Teo");
await clicar(page, /1º Ano EF/i);
await clicar(page, /Começar Aventura/i, /Quem vai brincar|JOGAR/i);
await clicar(page, /JOGAR/i, /Sensei|Aventura|Missão|Sondagem/i);
await page.waitForTimeout(700);

for (let i = 0; i < 4; i += 1) {
  const aba = page.locator("button", { hasText: /^Jornada$/i });
  if (await aba.count()) {
    await aba.first().click().catch(() => {});
    await page.waitForTimeout(1200);
    if (await page.getByRole("button", { name: /: disponível$/ }).count()) break;
  }
  for (const re of [/^Ver Outros Jogos$/, /^Sair da missão$/, /^(Sair|Sim|Confirmar)$/i]) {
    const b = page.getByRole("button", { name: re }).first();
    if (await b.count()) { await b.click().catch(() => {}); await page.waitForTimeout(800); }
  }
}

const cartao = page.getByRole("button", { name: `${ALVO}: disponível` }).first();
if (!(await cartao.count())) {
  const todos = await page.getByRole("button", { name: /: dispon[ií]vel$/ }).all();
  console.log("disponíveis:", (await Promise.all(todos.map(a => a.getAttribute("aria-label")))).join(" | "));
  await browser.close();
  process.exit(1);
}
await cartao.click();
await page.waitForTimeout(1000);
const bn = page.getByRole("button", { name: new RegExp(`^${NIVEL} N[ií]vel ${NIVEL}`) }).first();
if (await bn.count()) { await bn.click(); }

if (ESPERA_MS) await page.waitForTimeout(ESPERA_MS);
if (COMOFAZ) {
  await page.waitForTimeout(1500);
  const a = page.getByRole("button", { name: /Como faz|aulinha/i }).first();
  if (await a.count()) await a.click().catch(() => {});
}

const quadros = Math.round((SEGUNDOS * 1000) / PASSO_MS);
for (let i = 0; i < quadros; i += 1) {
  await page.screenshot({ path: `${SAIDA}/q${String(i).padStart(3, "0")}.png` });
  await page.waitForTimeout(PASSO_MS);
}
await browser.close();

// A folha de contato: uma imagem só, em grade, na ordem do tempo. É onde o
// piscar aparece — o quadro que quebra a sequência fica visível ao lado dos
// vizinhos, coisa que nenhuma foto isolada mostra.
const colunas = 6;
const linhas = Math.ceil(quadros / colunas);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", `${SAIDA}/q%03d.png`,
  "-filter_complex", `scale=210:-1,tile=${colunas}x${linhas}:margin=4:padding=4:color=0x334155`,
  `${SAIDA}/folha.png`]);
console.log(`${quadros} quadros a cada ${PASSO_MS}ms · folha em ${SAIDA}/folha.png`);
