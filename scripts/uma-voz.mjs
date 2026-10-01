/**
 * Duas vozes ao mesmo tempo? — medido no navegador, em muitas competências.
 *
 * ## A cegueira que este arquivo existe para tirar
 *
 * O pai relatou "as vozes uma em cima da outra" em quatro conversas seguidas.
 * Eu "consertei" três vezes e voltou três vezes, porque eu media UMA tela por
 * vez, com uma sonda de rascunho que eu apagava depois. Sonda descartável é
 * defeito que volta: a medição não entra no repositório, ninguém a repete, e
 * o conserto seguinte é feito às cegas.
 *
 * Então ela fica aqui, e varre.
 *
 *     QUANTOS=12 node scripts/uma-voz.mjs
 *     ALVOS="Reta numérica até 20|Horas (ponteiros e digital)" node scripts/uma-voz.mjs
 *
 * ## O que se mede
 *
 * As DUAS vias de voz, instrumentadas na origem: `window.Audio` (o pacote de
 * vozes) e `speechSynthesis.speak` (a voz do aparelho). Nenhuma das duas
 * sabe da outra, e é dessa cegueira mútua que nasce a sobreposição.
 *
 * 1. **SOBREPOSIÇÃO** — duas falas TOCANDO ao mesmo tempo. É o defeito que a
 *    criança ouve. Toleram-se 200 ms de encavalamento na emenda, que é menos
 *    do que o ouvido separa.
 * 2. **emenda** — quanto tempo passa entre uma fala acabar e a próxima
 *    começar. Narração em pedaços tem emenda por construção; emenda negativa
 *    é sobreposição.
 *
 * ## ⚠️ O que esta sonda NÃO consegue ver, e que já me fez errar o diagnóstico
 *
 * **O Chromium deste ambiente não tem voz nenhuma instalada.**
 * `speechSynthesis.getVoices()` devolve zero e `speak()` falha em 1 ms com
 * `synthesis-failed` — medido. Então, aqui, a via do aparelho nunca dura o que
 * duraria no aparelho do pai: ela falha instantaneamente e a próxima fala
 * entra logo atrás, certíssima.
 *
 * A primeira versão desta sonda não registrava o `error` da fala e estimava
 * 2 s de duração para toda fala do aparelho. Resultado: ela acusava
 * sobreposição em TODA narração da forma `enunciado ... como faz` — que são
 * quase todas — e eu acreditei nela. Diagnostiquei um defeito que não existia
 * e quase atrasei toda a fala do app por causa disso.
 *
 * Por isso o `error` é registrado como fim (abaixo), e por isso uma
 * sobreposição acusada aqui na via do aparelho merece desconfiança antes de
 * virar conserto: **o número de falas e a ORDEM são confiáveis; a duração da
 * via do aparelho, não.** O que trava a regra de verdade é o
 * `src/components/umaVozDeCadaVez.test.ts`, que roda sem navegador.
 */
import { chromium } from "playwright-core";
import { writeFileSync, appendFileSync } from "node:fs";
import { primeiroAcesso, abrir, competencias } from "./navegar.mjs";

const SAIDA = process.env.SAIDA ?? "/tmp/uma-voz.txt";
const ESPERA_MS = Number(process.env.ESPERA_MS ?? 14000);
/** Encavalamento que o ouvido não separa. Abaixo disto é emenda, não bagunça. */
const TOLERANCIA_MS = 200;
/** Duas falas dentro desta janela são emenda de uma narração, não duas falas. */
const MESMO_TIQUE_MS = 80;

const espiao = () => {
  window.__f = [];
  const A = window.Audio;
  window.Audio = function (src) {
    const a = new A(src);
    const r = { via: "arq", src: String(src).split("/").pop(), inicio: Date.now(), tocou: null, fim: null };
    window.__f.push(r);
    a.addEventListener("playing", () => { r.tocou = Date.now(); });
    a.addEventListener("ended", () => { r.fim = Date.now(); });
    a.addEventListener("pause", () => { if (r.fim === null) r.fim = Date.now(); });
    return a;
  };
  window.Audio.prototype = A.prototype;
  const ss = window.speechSynthesis;
  if (!ss?.speak) return;
  const falarOriginal = ss.speak.bind(ss);
  ss.speak = u => {
    const r = { via: "apar", src: String(u.text).slice(0, 34), inicio: Date.now(), tocou: Date.now(), fim: null, erro: null };
    window.__f.push(r);
    u.addEventListener?.("end", () => { r.fim = Date.now(); });
    // ⚠️ Fala que FALHA não durou dois segundos: durou um milissegundo. Sem
    // esta linha a sonda inventava sobreposição em toda narração do app.
    u.addEventListener?.("error", e => { r.fim = Date.now(); r.erro = e?.error ?? "erro"; });
    return falarOriginal(u);
  };
  // Cancelar encerra o que estava tocando: sem isto toda fala do aparelho
  // parecia durar para sempre e tudo depois dela virava "sobreposição".
  const cancelarOriginal = ss.cancel.bind(ss);
  ss.cancel = () => {
    for (const f of window.__f) if (f.via === "apar" && f.fim === null) f.fim = Date.now();
    return cancelarOriginal();
  };
};

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 820, height: 900 } });
await page.addInitScript(espiao);
await primeiroAcesso(page);

/*
 * ⚠️ A sonda confere a PRÓPRIA régua antes de medir.
 *
 * Foi assim que este defeito sobreviveu a três consertos: a sonda media a via
 * do aparelho num navegador que não tem voz, dava a fala por morta aos 2 s, e
 * acusava sobreposição em toda narração. Eu li a acusação e fui consertar.
 *
 * Régua não conferida é pior que régua nenhuma: a ausência de medida deixa a
 * gente cauteloso, a medida errada deixa a gente confiante.
 */
const vozes = await page.evaluate(() => (window.speechSynthesis?.getVoices?.() ?? []).length);
const AVISO_DA_REGUA = vozes === 0
  ? "⚠️ ESTE NAVEGADOR NÃO TEM VOZ (0 vozes): a via do aparelho falha em ~1ms e não\n"
    + "   sai som. Contagem e ORDEM das falas são confiáveis; DURAÇÃO da via do\n"
    + "   aparelho, não. Sobreposição acusada nela merece conferência antes de conserto.\n"
  : `${vozes} voz(es) no navegador: a via do aparelho dura o que duraria no aparelho.\n`;
console.log(AVISO_DA_REGUA);

const nomes = await competencias(page);
const alvos = process.env.ALVOS ? process.env.ALVOS.split("|") : nomes.slice(0, Number(process.env.QUANTOS ?? 12));

writeFileSync(SAIDA, `uma voz de cada vez · ${alvos.length} competências · ${ESPERA_MS}ms de escuta\n${AVISO_DA_REGUA}`);
let comDefeito = 0;

for (const alvo of alvos) {
  try {
    if (!(await abrir(page, alvo, 1))) { appendFileSync(SAIDA, `sem cartão ${alvo}\n`); continue; }
    await page.evaluate(() => { window.__f = []; window.__t0 = Date.now(); });
    await page.waitForTimeout(ESPERA_MS);
    const f = await page.evaluate(() => window.__f.map(x => ({
      ...x,
      inicio: x.inicio - window.__t0,
      tocou: x.tocou === null ? null : x.tocou - window.__t0,
      fim: x.fim === null ? null : x.fim - window.__t0,
    })));

    const sobre = [];
    for (let i = 0; i < f.length; i += 1) {
      for (let j = i + 1; j < f.length; j += 1) {
        const a = f[i], b = f[j];
        if (a.tocou === null || b.tocou === null) continue;
        // Fala sem fim registrado: estima-se 2 s, a média de um enunciado
        // curto. Só se chega aqui quando nem `end` nem `error` chegaram —
        // com o `error` registrado, a fala que falha tem fim real de 1 ms.
        const fimA = a.fim ?? a.tocou + 2000;
        if (b.tocou >= a.tocou && b.tocou < fimA - TOLERANCIA_MS) {
          sobre.push(`${a.via}/${a.src} (${a.tocou}–${fimA}) × ${b.via}/${b.src} (${b.tocou})`);
        }
      }
    }
    const falhas = f.filter(x => x.erro).length;
    let emendas = 0;
    for (let i = 1; i < f.length; i += 1) if (f[i].inicio - f[i - 1].inicio < MESMO_TIQUE_MS) emendas += 1;

    if (sobre.length) {
      comDefeito += 1;
      appendFileSync(SAIDA, `SOBREPOSIÇÃO ${alvo} — ${sobre.length} em ${f.length} falas\n`);
      for (const s of sobre) appendFileSync(SAIDA, `             ${s}\n`);
    } else {
      const nota = [
        emendas ? `${emendas} emenda(s) de narração` : "",
        falhas ? `${falhas} sem voz no aparelho (este Chromium não tem voz)` : "",
      ].filter(Boolean).join(", ");
      appendFileSync(SAIDA, `ok           ${alvo} — ${f.length} falas${nota ? `, ${nota}` : ""}\n`);
    }
  } catch (e) {
    appendFileSync(SAIDA, `erro         ${alvo} — ${String(e).split("\n")[0].slice(0, 70)}\n`);
  }
}
appendFileSync(SAIDA, comDefeito ? `\n⚠️ ${comDefeito} competência(s) com voz em cima de voz\n` : "\nnenhuma sobreposição\n");
await browser.close();
process.exit(comDefeito ? 1 : 0);
