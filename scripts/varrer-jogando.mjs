/**
 * Joga as noventa competências e registra quais TRAVAM.
 *
 * ## Por que
 *
 * Os portões da suíte montam um palco por vez e medem o que ele desenha. Eles
 * não jogam: não respondem, não esperam o app reagir, não veem a questão
 * seguinte chegar. O defeito que o pai encontrou no exercício dos dedos —
 * confirmar e a tela não mudar — passou por 4000 testes verdes porque nenhum
 * deles TOCAVA no botão dentro do app de verdade.
 *
 * Aqui se joga: abre o app destravado, entra na competência, deixa a aulinha
 * correr, responde pelo caminho que a criança usaria, e pergunta uma coisa
 * só — **a tela mudou?**
 *
 *     npm run build && npm start &
 *     node scripts/varrer-jogando.mjs                  # as noventa
 *     ALVOS="Correspondência um a um" node scripts/...  # uma só
 *
 * Saída: `/tmp/varredura.txt`, uma linha por competência.
 *
 * ## Onde ela para, e isso está medido
 *
 * A primeira execução completa chegou a **45 das 90** e depois passou a
 * escrever `SEM MAPA`: ela não soube sair de alguma tela e nunca mais achou
 * a Jornada. As 45 seguintes ficaram sem veredito — não são "ok", são
 * **não testadas**, e chamá-las de ok seria a mentira mais cara que uma
 * sonda pode contar.
 *
 * Nas 45 que ela alcançou: 3 julgadas (todas ok depois dos consertos), 42
 * de produção (fora do alcance), 2 travadas — `Sistema monetário` e `Horas`,
 * onde responder ERRADO deixava a tela byte a byte idêntica.
 *
 * O caminho de volta ao mapa é o que falta consertar aqui.
 */
import { chromium } from "playwright-core";
import { writeFileSync, appendFileSync } from "node:fs";

const BASE = process.env.SAGA_URL ?? "http://localhost:3000";
const SAIDA = process.env.SAIDA ?? "/tmp/varredura.txt";
const ESPERA = Number(process.env.ESPERA_MS ?? 13000);
const T = async p => (await p.locator("body").innerText().catch(() => "")).replace(/\s+/g, " ");
const esperar = async (p, c, ms = 25000) => { const l = Date.now() + ms; while (Date.now() < l) { const t = await T(p); if (c(t)) return t; await p.waitForTimeout(200); } return null; };
const clicar = async (p, re, esp) => { const a = p.getByRole("button", { name: re }).first(); if (!(await a.count())) return false; await a.click({ timeout: 15000 }).catch(() => {}); if (esp) return Boolean(await esperar(p, t => esp.test(t))); await p.waitForTimeout(500); return true; };

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
const errosJs = [];
page.on("pageerror", e => errosJs.push(String(e).slice(0, 120)));

await page.goto(`${BASE}/?destravado=123`, { waitUntil: "domcontentloaded", timeout: 60000 });
await esperar(page, t => /Começar sem Conta/i.test(t), 30000);
await clicar(page, /Começar sem Conta/i, /Monte seus Perfis/i);
await clicar(page, /Criar Primeiro Perfil|Criar Perfil|Novo Perfil/i, /Configurar Perfil/i);
await page.locator('input[type="text"]').first().fill("Teo");
await clicar(page, /1º Ano EF/i);
await clicar(page, /Começar Aventura/i, /Quem vai brincar|JOGAR/i);
await clicar(page, /JOGAR/i, /Sensei|Aventura|Missão|Sondagem/i);
await page.waitForTimeout(700);

async function irParaJornada() {
  for (let i = 0; i < 5; i += 1) {
    for (const re of [/^Ver Outros Jogos$/, /^Sair da missão$/, /^(Sair|Sim|Confirmar)$/i]) {
      const b = page.getByRole("button", { name: re }).first();
      if (await b.count()) { await b.click().catch(() => {}); await page.waitForTimeout(600); }
    }
    const aba = page.locator("button", { hasText: /^Jornada$/i });
    if (await aba.count()) { await aba.first().click().catch(() => {}); await page.waitForTimeout(1000); }
    if (await page.getByRole("button", { name: /: dispon[ií]vel$/ }).count()) return true;
  }
  return false;
}

await irParaJornada();
const todos = await page.getByRole("button", { name: /: dispon[ií]vel$/ }).all();
const nomes = (await Promise.all(todos.map(a => a.getAttribute("aria-label")))).map(n => n.replace(/: disponível$/, ""));
const alvos = process.env.ALVOS ? process.env.ALVOS.split("|") : nomes;
writeFileSync(SAIDA, `varrendo ${alvos.length} competências\n`);

for (const alvo of alvos) {
  errosJs.length = 0;
  let nota = "";
  try {
    if (!(await irParaJornada())) { appendFileSync(SAIDA, `SEM MAPA  ${alvo}\n`); continue; }
    const cartao = page.getByRole("button", { name: `${alvo}: disponível` }).first();
    if (!(await cartao.count())) { appendFileSync(SAIDA, `SEM CARTÃO ${alvo}\n`); continue; }
    await cartao.click();
    await page.waitForTimeout(900);
    const bn = page.getByRole("button", { name: /^1 N[ií]vel 1/ }).first();
    if (await bn.count()) await bn.click();
    await page.waitForTimeout(ESPERA);

    const antes = await T(page);
    /*
     * ⚠️ Só se julga o que este instrumento SABE julgar.
     *
     * A primeira versão clicava no primeiro botão vivo de qualquer palco e
     * perguntava "a tela mudou?". Ela acusou trinta competências de travadas
     * — incluindo a N1.01, que eu tinha acabado de jogar à mão, com o dedo,
     * e que funcionava.
     *
     * O erro era do instrumento. Em palco de PRODUÇÃO (distribuir peças,
     * estourar balões, posicionar a régua), um toque não é uma resposta: é um
     * gesto no meio do exercício, e a tela não mudar depois dele é o
     * comportamento CERTO. Chamar isso de travamento é acusar o app de um
     * defeito que existe só na sonda — e uma sonda que acusa tudo é tão
     * inútil quanto uma que não acusa nada.
     *
     * Então: onde há ALTERNATIVAS, armar e confirmar TEM de mudar a tela, e
     * aí o veredito vale. Onde não há, registra-se "produção" e não se julga.
     */
    const alt = page.locator('[aria-label="Alternativas"] button:not([disabled])').first();
    if (!(await alt.count())) {
      appendFileSync(SAIDA, `produção ${alvo} — palco de manipulação, fora do alcance desta sonda\n`);
      continue;
    }
    const rotulo = ((await alt.getAttribute("aria-label")) || (await alt.textContent()) || "").trim();
    await alt.click({ timeout: 5000 }).catch(() => { nota = "a alternativa não aceitou o clique"; });
    await page.waitForTimeout(600);
    const conf = page.locator('[aria-label^="Confirmar:"]').first();
    if (!(await conf.count())) {
      appendFileSync(SAIDA, `FALTA    ${alvo} — alternativa "${rotulo}" sem barra de confirmar\n`);
      continue;
    }
    await conf.click({ timeout: 5000 }).catch(() => { nota = "o confirmar não aceitou o clique"; });
    await page.waitForTimeout(2800);
    const depois = await T(page);
    const linha = `${depois !== antes ? "ok       " : "TRAVOU   "}${alvo}${nota ? " — " + nota : ""}${errosJs.length ? " | ERRO JS: " + errosJs[0] : ""}`;
    appendFileSync(SAIDA, linha + "\n");
  } catch (e) {
    appendFileSync(SAIDA, `ERRO    ${alvo} — ${String(e).split("\n")[0].slice(0, 90)}\n`);
  }
}
await browser.close();
