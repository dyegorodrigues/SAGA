import { Evidencia } from "../../constants/evidencias";
import { MisconceptionTag, MisconceptionTagType } from "../../constants/misconceptions";
import { RespostaOuvida, soaParecido } from "./audioChoiceProcedure";

/**
 * O estado que o palco sabe e o procedimento antigo não carregava.
 *
 * `tentativa` separa "primeira AUDIÇÃO" de "primeira RESPOSTA". Sem isso,
 * errar, ouvir o feedback e acertar em seguida sem apertar 🔊 ganhava a
 * evidência PRIMEIRA_AUDICAO — uma coroa por algo que não aconteceu.
 */
export interface RespostaOuvidaRuntime extends RespostaOuvida {
  tentativa?: number;
  primeiraAudicaoConcluida?: boolean;
}

/**
 * Divergência canônica declarada — F05 §4 × §6.
 *
 * §4: o áudio toca automaticamente e as opções só aparecem DEPOIS.
 * §6: `NAO_ESCUTOU` é descrito como escolher a primeira opção "sem apertar o
 * botão". Depois do autoplay, não apertar é o fluxo correto e não prova que a
 * criança não ouviu. Portanto a tag só vale no estado defensivo em que uma
 * resposta aconteceu antes de a primeira audição terminar. A UI corrigida
 * torna isso inalcançável; a guarda existe para impedir regressão silenciosa.
 */
export function diagnosticarAudioChoiceRuntime(
  r: RespostaOuvidaRuntime,
): MisconceptionTagType | undefined {
  if (r.resposta === r.alvo) {
    return r.repeticoes >= 3 ? MisconceptionTag.PRECISA_REPETICAO : undefined;
  }
  if (r.primeiraAudicaoConcluida === false && r.resposta === r.alternativas[0]) {
    return MisconceptionTag.NAO_ESCUTOU;
  }
  if (soaParecido(r.resposta, r.alvo)) return MisconceptionTag.CONFUSAO_FONOLOGICA;
  return MisconceptionTag.CONFUNDE_VIZINHO;
}

/** §9: primeira audição = sem replay E primeira resposta certa. */
export function evidenciasAudioChoiceRuntime(r: RespostaOuvidaRuntime): string[] {
  return r.resposta === r.alvo && r.repeticoes === 0 && (r.tentativa ?? 1) === 1
    ? [Evidencia.PRIMEIRA_AUDICAO]
    : [];
}
