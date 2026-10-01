/**
 * Joga as NOVENTA competências até o fim, e registra onde cada uma para.
 *
 * ## O instrumento que faltava, e por que ele faltava três vezes
 *
 * 1. A suíte monta um palco e mede o que ele desenha. Não joga.
 * 2. `varrer-jogando` responde UMA vez. Travar é um estado do FIM.
 * 3. Toda sonda que eu fiz morria tentando VOLTAR ao mapa pela interface: a
 *    das 90 chegou a 45, a do enquadramento chegou a 3. Eu consertava o
 *    defeito e nunca o instrumento, e por isso media sempre os mesmos
 *    primeiros exercícios — justamente os que o pai já tinha relatado.
 *
 * O caminho de volta agora é `navegar.mjs`: recarrega a página. A chave do
 * modo de teste e o perfil ficam no aparelho, e o app volta sozinho.
 *
 * Cada competência recebe três perguntas:
 *
 * - **termina?** — jogando até o fim, a questão fecha ou a criança fica presa?
 * - **as vozes se atropelam?** — duas falas tocando ao mesmo tempo.
 * - **a tela está torta?** — medido em largura de tablet, não de celular.
 *
 *     npm run build && npm start &
 *     node scripts/varrer-ate-o-fim.mjs        # saída: /tmp/ateofim-todos.txt
 */
import { chromium } from "playwright-core";
import { writeFileSync, appendFileSync, mkdirSync } from "node:fs";
import { T, primeiroAcesso, abrir, competencias } from "./navegar.mjs";

const SAIDA = process.env.SAIDA ?? "/tmp/ateofim-todos.txt";
const LARGURA = Number(process.env.LARGURA ?? 820);
const PASSOS = Number(process.env.PASSOS ?? 20);
const SOBREPOSICAO_MS = 300;
const TOLERANCIA_PX = 24;

const MOLDURA = /^(Fechar|Sair da missão|Sair|Voltar|×|Ligar o som|Desligar o som|Ver Resultado)$|Como faz|aulinha|Tá difícil/i;
const AVANCOU = /Perfeito|Uhul|Isso!|Isso mesmo|Muito bem|Avançar|Continuar|Que lindo|brilha|Parabéns|Acertou|Boa!/i;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: LARGURA, height: 900 }, hasTouch: true });

await page.addInitScript(() => {
  window.__falas = [];
  const A = window.Audio;
  window.Audio = function (src) {
    const a = new A(src);
    const reg = { via: "arquivo", inicio: Date.now(), fim: null, src: String(src).split("/").pop() };
    window.__falas.push(reg);
    a.addEventListener("ended", () => { reg.fim = Date.now(); });
    a.addEventListener("pause", () => { if (reg.fim === null) reg.fim = Date.now(); });
    return a;
  };
  window.Audio.prototype = A.prototype;
  const ss = window.speechSynthesis;
  if (ss && ss.speak) {
    const orig = ss.speak.bind(ss);
    ss.speak = u => {
      const reg = { via: "aparelho", inicio: Date.now(), fim: null, src: String(u.text).slice(0, 36) };
      window.__falas.push(reg);
      u.addEventListener?.("end", () => { reg.fim = Date.now(); });
      // ⚠️ Fala que FALHA não durou dois segundos e meio: durou um
      // milissegundo. Sem esta linha a sonda dava toda fala do aparelho por
      // morta aos 2,5 s e acusava sobreposição em toda narração da forma
      // `enunciado ... como faz` — que são quase todas. Eu acreditei nela e
      // diagnostiquei um defeito que não existia. Ver scripts/uma-voz.mjs.
      u.addEventListener?.("error", () => { reg.fim = Date.now(); reg.falhou = true; });
      return orig(u);
    };
    const cancel = ss.cancel.bind(ss);
    ss.cancel = () => { for (const f of window.__falas) if (f.via === "aparelho" && f.fim === null) f.fim = Date.now(); return cancel(); };
  }
});

const erros = [];
page.on("pageerror", e => erros.push(String(e).slice(0, 120)));

await primeiroAcesso(page);

/*
 * ⚠️ A régua se confere antes de medir — ver scripts/uma-voz.mjs.
 *
 * Sem voz instalada a via do aparelho falha em ~1 ms e não sai som: a ORDEM e a
 * CONTAGEM das falas continuam válidas, a DURAÇÃO não. Acusação de
 * sobreposição nesta via, aqui, pede conferência antes de virar conserto.
 */
const vozesDoNavegador = await page.evaluate(() => (window.speechSynthesis?.getVoices?.() ?? []).length);
const AVISO_DA_REGUA = vozesDoNavegador === 0
  ? "⚠️ navegador sem voz instalada: duração da via do aparelho não é confiável\n"
  : `${vozesDoNavegador} voz(es) no navegador\n`;
console.log(AVISO_DA_REGUA);

const nomes = await competencias(page);
const alvos = process.env.ALVOS ? process.env.ALVOS.split("|") : nomes.slice(0, Number(process.env.QUANTOS ?? 90));
mkdirSync("/tmp/provas", { recursive: true });
writeFileSync(SAIDA, `jogando ${alvos.length} competências até o fim, a ${LARGURA}px\n${AVISO_DA_REGUA}\n`);

const tocaveis = async () => {
  const out = [];
  for (const b of await page.locator("button:not([disabled])").all()) {
    const n = ((await b.getAttribute("aria-label")) || (await b.textContent()) || "").replace(/\s+/g, " ").trim();
    if (n && !MOLDURA.test(n)) out.push({ b, n });
  }
  return out;
};

const desvioDaTinta = () => page.evaluate(() => {
  const palco = document.querySelector("main") ?? document.body;
  let esq = Infinity, dir = -Infinity;
  for (const el of palco.querySelectorAll("*")) {
    if (el.children.length > 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8 || r.width > window.innerWidth * 0.7) continue;
    if (r.top < 150 || r.bottom > window.innerHeight - 20) continue;
    const tinta = (el.textContent ?? "").trim().length > 0
      || getComputedStyle(el).backgroundImage !== "none" || el.tagName === "IMG";
    if (!tinta) continue;
    esq = Math.min(esq, r.left); dir = Math.max(dir, r.right);
  }
  return Number.isFinite(esq) ? Math.round((esq + dir) / 2 - window.innerWidth / 2) : null;
});

for (const alvo of alvos) {
  erros.length = 0;
  try {
    if (!(await abrir(page, alvo, 1))) { appendFileSync(SAIDA, `sem cartão  ${alvo}\n`); continue; }
    await page.evaluate(() => { window.__falas = []; });
    await page.waitForTimeout(12000);

    const desvio = await desvioDaTinta();
    /*
     * ⚠️ Preso é quando TODO controle já foi tentado e nada muda.
     *
     * A primeira versão clicava no primeiro botão vivo e, se a tela não
     * mudasse quatro vezes, gritava "em círculo". Ela acusou vinte
     * competências — mas o que ela fazia era bater no MESMO controle morto
     * quatro vezes (um objeto já contado, por exemplo, que não muda nada de
     * propósito). Criança não faz isso: ela tenta os outros.
     *
     * É o mesmo erro que eu já cometi duas vezes nesta sessão, e ele tem um
     * custo: sonda que grita demais a gente para de ouvir, e foi assim que o
     * travamento do balão sobreviveu. Agora cada passo escolhe um controle
     * AINDA NÃO TENTADO, e só se declara preso quando a lista acaba.
     */
    let veredito = "indefinido";
    const tentados = new Set();
    for (let passo = 1; passo <= PASSOS; passo += 1) {
      if (AVANCOU.test(await T(page))) { veredito = "termina"; break; }
      const alvosVivos = await tocaveis();
      if (alvosVivos.length === 0) { veredito = `TRAVA no passo ${passo} (nada tocável)`; break; }

      const novos = alvosVivos.filter(a => !tentados.has(a.n));
      if (novos.length === 0) {
        veredito = `PRESA no passo ${passo} (todos os ${alvosVivos.length} controles tentados, nada muda)`;
        break;
      }
      const conf = novos.find(a => /^Confirmar:/.test(a.n));
      const escolha = conf ?? novos.find(a => !/^(Ouvir de novo|Escolher outra|Ver de novo)/.test(a.n)) ?? novos[0];
      tentados.add(escolha.n);
      const antes = await T(page);
      await escolha.b.click({ timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(1100);
      // Mudou a tela? Então o mapa de tentados não vale mais: é outra cena.
      if ((await T(page)) !== antes) tentados.clear();
    }

    const falas = await page.evaluate(() => window.__falas.map(f => ({ ...f })));
    let sobrepostas = 0;
    for (let i = 0; i < falas.length; i += 1) {
      for (let j = i + 1; j < falas.length; j += 1) {
        // Fala que falhou nunca esteve no ar: não dá para estar por baixo de
        // outra. Era daqui que saíam as acusações falsas.
        if (falas[i].falhou) continue;
        const fimA = falas[i].fim ?? falas[i].inicio + 2500;
        if (falas[j].falhou) continue;
        if (falas[j].inicio >= falas[i].inicio && falas[j].inicio < fimA - SOBREPOSICAO_MS) sobrepostas += 1;
      }
    }
    const torto = desvio !== null && Math.abs(desvio) > TOLERANCIA_PX;
    /*
     * ⚠️ Toda acusação sai com FOTO.
     *
     * Três vezes nesta sessão eu li um veredito desta família, acreditei, e
     * fui consertar coisa que não estava quebrada. O veredito sozinho é
     * palpite com cara de medida. Com a foto do instante, quem lê confere em
     * dois segundos — e eu confiro antes de tocar no código.
     */
    const marcas = [
      veredito === "termina" ? "" : `⚠️ ${veredito}`,
      sobrepostas ? `⚠️ ${sobrepostas} vozes sobrepostas` : "",
      torto ? `⚠️ torto ${desvio}px` : "",
      erros.length ? `⚠️ erro JS: ${erros[0]}` : "",
    ].filter(Boolean);
    let foto = "";
    if (marcas.length) {
      foto = `/tmp/provas/${alvo.replace(/\W+/g, "_")}.png`;
      await page.screenshot({ path: foto }).catch(() => { foto = "(sem foto)"; });
    }
    appendFileSync(SAIDA, `${marcas.length ? "PROBLEMA" : "ok      "} ${alvo}${marcas.length ? " — " + marcas.join(" · ") + `  [${foto}]` : ""}\n`);
  } catch (e) {
    appendFileSync(SAIDA, `erro      ${alvo} — ${String(e).split("\n")[0].slice(0, 80)}\n`);
  }
}
await browser.close();
