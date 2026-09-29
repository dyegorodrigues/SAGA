/**
 * A voz sai do aparelho? — medido no navegador, no build de produção.
 *
 * ## Por que
 *
 * O pai relatou: "o áudio eu não consegui testar ali através do link, não dá
 * nem para saber". Ele tinha razão de não saber: o app falava só pelo
 * `speechSynthesis`, que num celular sem voz pt-BR simplesmente não emite som
 * e não reclama. Agora há pacote de áudio versionado — e "tem arquivo no
 * repositório" não prova que o app o toca.
 *
 * Esta sonda abre o app pela porta da frente, entra numa missão como uma
 * criança entraria, e mede no tráfego de rede: o índice foi buscado? algum
 * `.m4a` foi pedido? algum foi recusado?
 *
 *     npm run build && npm start &
 *     node scripts/sonda-voz.mjs
 */
import { chromium } from "playwright-core";

const BASE = process.env.SAGA_URL ?? "http://localhost:3000";
const CHROMIUM = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";

const esperar = async (page, cond, ms = 25000) => {
  const limite = Date.now() + ms;
  while (Date.now() < limite) {
    const t = (await page.locator("body").innerText().catch(() => "")).replace(/\s+/g, " ");
    if (cond(t)) return t;
    await page.waitForTimeout(300);
  }
  return null;
};

const clicar = async (page, nome, espera) => {
  const alvo = page.getByRole("button", { name: nome }).first();
  if (!(await alvo.count())) return false;
  await alvo.click({ timeout: 15000 }).catch(() => {});
  if (espera) return Boolean(await esperar(page, t => espera.test(t)));
  await page.waitForTimeout(800);
  return true;
};

const browser = await chromium.launch({ executablePath: CHROMIUM });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

/*
 * Medir REPRODUÇÃO, e não tráfego.
 *
 * A primeira versão desta sonda olhava só o código HTTP: índice 200, clipes
 * 206, "A VOZ SAI". Estava errada, e o erro era caro — o pacote nasceu em AAC
 * e **o Chromium de código aberto não decodifica AAC**. O arquivo chegava
 * inteiro e `play()` devolvia `NotSupportedError`. Bytes servidos não são som
 * na sala.
 *
 * Agora a sonda envolve o `Audio` da página e conta o que interessa: quantos
 * clipes COMEÇARAM a tocar (evento `playing`) e quantos deram erro, com o
 * motivo. Um pacote inteiro servido e nenhum tocando reprova.
 */
await page.addInitScript(() => {
  window.__voz = { criados: 0, tocaram: 0, erros: [] };
  const A = window.Audio;
  window.Audio = function (src) {
    const a = new A(src);
    window.__voz.criados += 1;
    a.addEventListener("playing", () => { window.__voz.tocaram += 1; });
    a.addEventListener("error", () => {
      const e = a.error;
      window.__voz.erros.push(`${String(src).split("/").pop()}: código ${e ? e.code : "?"} ${e && e.message ? e.message : ""}`.trim());
    });
    return a;
  };
  window.Audio.prototype = A.prototype;
});

await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
await esperar(page, t => /Começar sem Conta|Entrar com Conta/i.test(t), 30000);
await clicar(page, /Começar sem Conta/i, /Monte seus Perfis/i);
await clicar(page, /Criar Primeiro Perfil|Criar Perfil|Novo Perfil/i, /Configurar Perfil/i);
await page.locator('input[type="text"]').first().fill("Teo");
await clicar(page, /1º Ano EF/i);
await clicar(page, /Começar Aventura/i, /Quem vai brincar|JOGAR/i);
await clicar(page, /JOGAR/i, /Sensei|Aventura|Missão|Sondagem/i);
await clicar(page, /Começar Sondagem|Começar|Jogar|Missão/i, /Toque|Conte|Quantos|Qual|Dê /i);
await page.waitForTimeout(6000);

const indice = pedidos.filter(p => p.url.startsWith("indice.json"));
const clipes = pedidos.filter(p => p.url.endsWith(".mp3"));
// 206 é o normal para áudio: o `<audio>` pede por faixa de bytes. A primeira
// versão desta sonda tratava 206 como recusa e acusava de mudo um app que
// estava tocando — falsa acusação causada pelo próprio instrumento.
// 206 é o normal para áudio: o `<audio>` pede por faixa de bytes. A primeira
// versão desta sonda tratava 206 como recusa e acusava de mudo um app que
// estava tocando.
//
// `ERR_ABORTED` também é normal, e por bom motivo: quando uma fala nova
// começa, a anterior é cortada — é o que o app deve fazer para não falar duas
// coisas por cima. O navegador cancela o download em curso e registra isso
// como requisição falha. Recusa de verdade é 404 (arquivo que o índice
// prometeu e não existe) ou erro de servidor.
const serviu = s => s === 200 || s === 206;
const cancelado = s => typeof s === "string" && /ABORTED/.test(s);
const recusados = pedidos.filter(p => !serviu(p.status) && !cancelado(p.status));

console.log(`índice pedido: ${indice.length ? indice.map(i => i.status).join(",") : "NÃO"}`);
console.log(`clipes pedidos: ${clipes.length}`);
for (const c of clipes.slice(0, 10)) console.log(`  ${c.url} → ${c.status}`);
const cancelados = pedidos.filter(p => cancelado(p.status)).length;
console.log(recusados.length ? `RECUSADOS: ${recusados.map(r => `${r.url} ${r.status}`).join(", ")}` : "nenhum recusado");
const voz = await page.evaluate(() => window.__voz);
console.log(`clipes criados: ${voz.criados} · começaram a tocar: ${voz.tocaram}`);
for (const e of voz.erros.slice(0, 8)) console.log(`  erro: ${e}`);
if (cancelados) console.log(`${cancelados} download(s) cortado(s) por fala nova — esperado`);

await browser.close();
const bem = indice.some(i => serviu(i.status)) && clipes.some(c => serviu(c.status)) && !recusados.length;
console.log(bem ? "\nA VOZ SAI: o app buscou o índice e tocou áudio do pacote." : "\nA VOZ NÃO SAI pelo pacote.");
process.exit(bem ? 0 : 1);
