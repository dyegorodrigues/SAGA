/**
 * O que este palco mostra, fala e faz no primeiro toque — com foto.
 *
 *     ALVOS="Formas planas básicas|Amigos do 10" node scripts/palco.mjs
 *     ALVOS="Formas planas básicas" TOQUE="^o (círculo|quadrado)$" node scripts/palco.mjs
 *
 * ## Por que existe
 *
 * As varreduras respondem "quantos" e "quais". Esta responde "o QUÊ", de um
 * palco só, com evidência: o texto na tela, os botões com os nomes que o
 * leitor de tela lê, as falas que saíram e por qual via, uma foto, e — se
 * `TOQUE` casar com algum botão — o que muda ao tocar nele UMA vez.
 *
 * ## O que ela achou, nas duas direções
 *
 * 1. **Um defeito real.** A `GE.02` ("Formas planas básicas") abria o nível 1
 *    com *"Qual é o círculo?"*, três botões ESCRITOS e resposta no primeiro
 *    toque — sem falar, sem confirmar. O portão de confirmar relatava zero
 *    porque só olhava dentro de `aria-label="Alternativas"`, e aquele palco
 *    não marcava o grupo.
 *
 * 2. **Um alarme falso meu.** A varredura das 90 tinha acusado "palcos que não
 *    falam nada": `Contagem com cardinalidade — 1 fala`. Abri os três aqui e
 *    todos falavam 5 ou 6 vezes, tudo do pacote. A contagem da varredura longa
 *    cai quando a máquina está carregada, porque a janela de escuta começa
 *    antes de o palco montar. Remedindo as mesmas três sozinhas: 6, 5 e 6.
 *
 * Por isso esta sonda é o passo OBRIGATÓRIO entre uma varredura que acusa e um
 * conserto: varredura diz onde olhar, esta diz o que há. Acusação de varredura
 * longa que não reproduz aqui, sozinha, não é defeito — é carga de máquina.
 */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { T, primeiroAcesso, abrir } from "./navegar.mjs";

const ESPERA_MS = Number(process.env.ESPERA_MS ?? 14000);
const PASTA = process.env.PASTA ?? "/tmp/provas";

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: Number(process.env.LARGURA ?? 820), height: 900 } });
await page.addInitScript(() => {
  window.__f = [];
  const A = window.Audio;
  window.Audio = function (src) {
    const a = new A(src);
    window.__f.push({ via: "arq", t: Date.now(), o: String(src).split("/").pop() });
    return a;
  };
  window.Audio.prototype = A.prototype;
  const ss = window.speechSynthesis;
  if (ss?.speak) {
    const falar = ss.speak.bind(ss);
    ss.speak = u => { window.__f.push({ via: "apar", t: Date.now(), o: String(u.text).slice(0, 50) }); return falar(u); };
  }
});
await primeiroAcesso(page);
mkdirSync(PASTA, { recursive: true });

/** Nome que o leitor de tela lê, mais o aviso de botão morto. */
const botoes = async () => {
  const fora = [];
  for (const b of await page.getByRole("button").all()) {
    if (!(await b.isVisible().catch(() => false))) continue;
    const nome = (await b.getAttribute("aria-label")) ?? (await b.innerText().catch(() => "")).replace(/\s+/g, " ").slice(0, 30);
    fora.push(`${nome}${(await b.isDisabled().catch(() => false)) ? " [morto]" : ""}`);
  }
  return fora;
};

for (const alvo of (process.env.ALVOS ?? "Formas planas básicas").split("|")) {
  const nivel = Number(process.env.NIVEL ?? 1);
  if (!(await abrir(page, alvo, nivel))) { console.log(`sem cartão ${alvo}`); continue; }
  await page.evaluate(() => { window.__f = []; window.__t0 = Date.now(); });
  await page.waitForTimeout(ESPERA_MS);

  const falas = await page.evaluate(() => window.__f.map(x => `+${x.t - window.__t0}ms ${x.via} ${x.o}`));
  const foto = `${PASTA}/palco_${alvo.replace(/[^\w]+/g, "_")}_n${nivel}.png`;
  await page.screenshot({ path: foto });
  console.log(`\n=== ${alvo} · nível ${nivel} ===`);
  console.log(`falas (${falas.length}):`, falas.length ? falas.join(" | ") : "NENHUMA");
  console.log("texto :", (await T(page)).slice(0, 320));
  console.log("botões:", (await botoes()).join(" · "));
  console.log("foto  :", foto);

  if (!process.env.TOQUE) continue;
  const alvoDoToque = page.getByRole("button", { name: new RegExp(process.env.TOQUE) }).first();
  if (!(await alvoDoToque.count())) { console.log(`toque : nenhum botão casa /${process.env.TOQUE}/`); continue; }
  const rotulo = await alvoDoToque.getAttribute("aria-label");
  await page.evaluate(() => { window.__f = []; window.__t0 = Date.now(); });
  await alvoDoToque.click({ timeout: 5000 }).catch(e => console.log("clique falhou:", String(e).split("\n")[0].slice(0, 70)));
  await page.waitForTimeout(1500);
  console.log(`toque : ${rotulo}`);
  console.log("falou :", (await page.evaluate(() => window.__f.map(x => `${x.via} ${x.o}`))).join(" | ") || "NADA");
  console.log("depois:", (await T(page)).slice(0, 320));
  console.log("botões:", (await botoes()).join(" · "));
  await page.screenshot({ path: foto.replace(/\.png$/, "_tocado.png") });
}
await browser.close();
