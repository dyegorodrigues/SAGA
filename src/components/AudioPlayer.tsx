import { caminhoDaVoz, carregarVozes, temVozNativa } from "../audio/vozNativa";
import { textoFalado } from "../audio/chaveDaFala";

/**
 * Quem faz o app falar.
 *
 * ## Duas vozes, nesta ordem
 *
 * 1. **A voz que veio junto.** Áudio gerado antes (`npm run vozes`) e
 *    versionado no repositório. É a que toca sempre que a fala está no pacote.
 * 2. **A voz do aparelho** (`speechSynthesis`), para o resto.
 *
 * A ordem não é preferência estética. O app falava SÓ pelo aparelho, e num
 * celular sem voz pt-BR instalada não sai som nenhum — sem erro, sem aviso.
 * Para a criança de quatro a sete anos, que não lê, o enunciado só existe em
 * voz: sem voz, o exercício não é difícil, é impossível, e o app registra
 * como erro de matemática.
 */

let SPEAK_SEQ = 0;
let tocando: HTMLAudioElement | null = null;

/** O índice começa a carregar assim que o app sobe, para a primeira fala já achar. */
if (typeof window !== "undefined") void carregarVozes();

function pararArquivo() {
  if (!tocando) return;
  try { tocando.pause(); } catch { /* o navegador pode já ter descartado */ }
  tocando.onended = null;
  tocando.onerror = null;
  tocando = null;
}

/** A voz do aparelho — o caminho de antes, preservado inteiro. */
function vozDoAparelho(texto: string, seq: number, rate: number, onEnd?: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) { onEnd?.(); return; }
  window.speechSynthesis.cancel();
  if (!texto) return;
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = "pt-BR";
  u.rate = 1.05 * rate;
  u.pitch = 1.25;
  u.onend = () => { if (seq === SPEAK_SEQ) onEnd?.(); };
  u.onerror = () => { if (seq === SPEAK_SEQ) onEnd?.(); };
  window.speechSynthesis.speak(u);
}

export const AudioPlayer = {
  stop: () => {
    SPEAK_SEQ++;
    pararArquivo();
    try { window.speechSynthesis?.cancel(); } catch { /* ambiente sem fala */ }
  },

  play: (audioId: string, onEnd?: () => void) => {
    SPEAK_SEQ++;
    const seq = SPEAK_SEQ;
    setTimeout(() => {
      if (seq === SPEAK_SEQ && onEnd) onEnd();
    }, 1500);
  },

  speak: (text: string, onEnd?: () => void, rate = 1) => {
    const seq = ++SPEAK_SEQ;
    pararArquivo();
    try { window?.speechSynthesis?.cancel(); } catch { /* ambiente sem fala */ }

    const texto = textoFalado(text ?? "");
    if (!texto) { onEnd?.(); return; }

    const pedacos = emPedacos(texto);
    if (!pedacos.some(temVozNativa)) { vozDoAparelho(texto, seq, rate, onEnd); return; }
    tocarPedacos(pedacos, 0, seq, rate, onEnd);
  },
};

/**
 * A narração em pedaços.
 *
 * O `qSpeech` do GameLoop monta a fala juntando enunciado, som-alvo e "como
 * faz" com " ... " no meio. Medido no navegador: o que chegava ao
 * sintetizador era a frase inteira colada — e a frase inteira nunca está no
 * pacote, porque a junção é combinatória. Resultado: pacote carregado,
 * índice baixado, e nenhum áudio tocado.
 *
 * Falar pedaço por pedaço resolve três coisas de uma vez: cada pedaço acha o
 * seu áudio; o que não tiver cai para o aparelho sem levar o resto junto; e a
 * pausa entre eles é a que a reticência já pedia.
 */
function emPedacos(texto: string): string[] {
  return texto.split(/\s*\.\.\.\s*/).map(p => p.trim()).filter(Boolean);
}

function tocarPedacos(pedacos: string[], i: number, seq: number, rate: number, onEnd?: () => void) {
  if (seq !== SPEAK_SEQ) return;
  if (i >= pedacos.length) { onEnd?.(); return; }
  const adiante = () => tocarPedacos(pedacos, i + 1, seq, rate, onEnd);
  const pedaco = pedacos[i];

  if (!temVozNativa(pedaco)) { vozDoAparelho(pedaco, seq, rate, adiante); return; }

  const audio = new Audio(caminhoDaVoz(pedaco));
  audio.playbackRate = rate;
  tocando = audio;

  // Arquivo que não toca (pacote pela metade, formato recusado) não pode
  // virar silêncio: a criança fica sem o enunciado. Cai para o aparelho.
  let caiu = false;
  const cair = () => {
    if (caiu || seq !== SPEAK_SEQ) return;
    caiu = true;
    pararArquivo();
    vozDoAparelho(pedaco, seq, rate, adiante);
  };

  audio.onended = () => { if (seq === SPEAK_SEQ) { tocando = null; adiante(); } };
  audio.onerror = cair;
  void audio.play().catch(cair);
}
