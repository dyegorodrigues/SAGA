import { caminhoDaVoz, carregarVozes, temVozNativa, vozesCarregadas } from "../audio/vozNativa";
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

/**
 * ⚠️ UMA VIA CALA A OUTRA — a regra que faltava, e por que ela faltou tanto.
 *
 * O pai relatou "as vozes uma em cima da outra" em quatro conversas seguidas.
 * Eu "consertei" três vezes reforçando o cancelamento no começo do `speak`, e
 * voltou três vezes. Voltou porque eu estava olhando para o lugar errado.
 *
 * ## Onde a sobreposição nasce
 *
 * Quase toda narração do app tem a forma `enunciado ... como faz`. O
 * `emPedacos` separa os dois, e eles quase nunca vão pela mesma via: o
 * enunciado tem número ("Qual moeda vale 5 centavos?"), varia com o sorteio e
 * não está no pacote — cai no sintetizador do aparelho; o "como faz" é fixo,
 * está no pacote — toca como arquivo.
 *
 * Então a narração mais ouvida do app é: **aparelho, depois arquivo**, e a
 * emenda entre os dois é o `onend` do `speechSynthesis`.
 *
 * O `onend` do Chrome chega antes de o sintetizador calar — é bug conhecido, e
 * o próprio arquivo acima já registra que o TTS do Chrome trava e corta
 * utterances. Quando ele chega adiantado, o arquivo começa com o aparelho
 * ainda falando. Duas vozes, ao mesmo tempo, exatamente o que o pai ouve.
 *
 * ## Por que o cancelamento do `speak` nunca pegou isso
 *
 * Porque a emenda acontece DENTRO de uma narração só. O `speak` cancela na
 * entrada, uma vez, e aí entrega a narração ao `tocarPedacos` — que troca de
 * via no meio sem cancelar nada. Cada via desligava só a si mesma:
 * `pararArquivo()` não cala o sintetizador, `cancel()` não para o arquivo.
 *
 * A correção é mecânica e não depende de evento nenhum chegar na hora certa:
 * **antes de abrir a boca, cada via cala a outra.** Dentro de uma sequência
 * correta a outra via já está parada e o pedido é inócuo; na emenda torta, é
 * ele que impede as duas de falarem juntas.
 *
 * ## O que este defeito NÃO era (medido, e errei antes de acertar)
 *
 * Minha primeira hipótese foi que o app pedia duas falas no mesmo tique. Vinha
 * de uma medição minha no navegador que mostrava duas vias começando a 1 ms de
 * distância. Fui medir os dois lados antes de mexer:
 *
 * - o Chromium headless deste ambiente tem **zero vozes** instaladas, e
 *   `speechSynthesis.speak` falha em 1 ms com `synthesis-failed`. A sonda
 *   registrava a fala do aparelho como se durasse 2 s, e o arquivo seguinte
 *   — que começa certo, logo depois da falha — aparecia "por cima". O 1 ms
 *   era artefato da minha régua, não defeito do app;
 * - instrumentando o próprio `speak` em cinco competências: **29 pedidos de
 *   fala, zero no mesmo tique**. O app nunca pediu duas vozes de uma vez.
 *
 * Fica escrito porque a conclusão errada era plausível e eu quase coalesci
 * todo pedido de fala numa janela de 60 ms para consertar o que não existia —
 * o que atrasaria toda narração do app e quebraria o gesto do toque no iOS.
 * Ver `umaVozDeCadaVez.test.ts`, que trava as duas coisas: a exclusão mútua, e
 * que a fala sai no mesmo tique em que foi pedida.
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

/** A voz do aparelho — o caminho de antes, mais a exclusão mútua. */
function vozDoAparelho(texto: string, seq: number, rate: number, onEnd?: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) { onEnd?.(); return; }
  // ⚠️ Uma via cala a outra: o `cancel` abaixo não para arquivo nenhum.
  pararArquivo();
  window.speechSynthesis.cancel();
  if (!texto) return;
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = "pt-BR";
  u.rate = 1.05 * rate;
  u.pitch = 1.25;
  /*
   * ⚠️ O fim avisa UMA vez.
   *
   * `onend` e `onerror` chamavam os dois o mesmo `onEnd`, e navegador que
   * dispara os dois (ou que erra uma fala já encerrada, o que o `cancel` novo
   * acima torna possível) fazia o `adiante` do `tocarPedacos` correr duas
   * vezes: a narração PULAVA um pedaço. Na forma `enunciado ... como faz` o
   * pedaço pulado é o "como faz" — a criança que não lê perde justamente a
   * parte que diz o que fazer.
   */
  let avisou = false;
  const terminou = () => {
    if (avisou || seq !== SPEAK_SEQ) return;
    avisou = true;
    onEnd?.();
  };
  u.onend = terminou;
  u.onerror = terminou;
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

    const falar = () => {
      if (seq !== SPEAK_SEQ) return;
      const pedacos = emPedacos(texto);
      if (!pedacos.some(temVozNativa)) { vozDoAparelho(texto, seq, rate, onEnd); return; }
      tocarPedacos(pedacos, 0, seq, rate, onEnd);
    };

    // A PRIMEIRA fala do app costuma acontecer antes de o índice chegar, e
    // perdia o pacote por milissegundos: na N1.01 era o "Olha quem está
    // esperando." da aulinha, o primeiro som que a criança ouve na vida do
    // app. Se o índice ainda não chegou, espera-se por ele — `carregarVozes`
    // nunca rejeita, e pacote ausente resolve com índice vazio.
    if (vozesCarregadas() === 0) { void carregarVozes().then(falar); return; }
    falar();
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
  // ⚠️ Uma via cala a outra. Esta é A emenda do defeito: chegamos aqui pelo
  // `onend` do pedaço anterior, e o `onend` do Chrome chega antes de ele parar
  // de falar. Sem este cancelamento o arquivo entra por cima da voz.
  try { window.speechSynthesis?.cancel(); } catch { /* ambiente sem fala */ }

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
