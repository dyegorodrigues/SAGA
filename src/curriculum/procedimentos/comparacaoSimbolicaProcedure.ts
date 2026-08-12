import { Evidencia } from "../../constants/evidencias";
import { MisconceptionTag } from "../../constants/misconceptions";
import { AnswerMeta } from "../../types";
import type { ComparacaoSimbolicaSpec, SimboloComparacao } from "./comparacaoSimbolicaContract";

export interface AcaoDeComparacaoSimbolica {
  nivel: number;
  ordemDeToques: Array<0 | 1>;
  revisoesDeSimbolo: number;
  escolha: SimboloComparacao;
  correta: boolean;
}

export interface AnswerMetaComparacao extends AnswerMeta {
  comparacao: AcaoDeComparacaoSimbolica;
}

export function simboloParaValores(esquerda: number, direita: number): SimboloComparacao {
  if (esquerda > direita) return ">";
  if (esquerda < direita) return "<";
  return "=";
}

export function diagnosticarComparacaoSimbolica(
  escolha: SimboloComparacao,
  spec: ComparacaoSimbolicaSpec,
): string | undefined {
  if (escolha === spec.resposta) return undefined;
  if (escolha === "=" && spec.resposta !== "=") return MisconceptionTag.IGNORA_DIFERENCA;
  if (spec.resposta === "=" && escolha !== "=") return MisconceptionTag.NAO_COMPARA_SIMBOLO;
  if ((escolha === ">" || escolha === "<") && (spec.resposta === ">" || spec.resposta === "<")) {
    return MisconceptionTag.INVERTE_SIMBOLO;
  }
  return MisconceptionTag.NAO_COMPARA_SIMBOLO;
}

export function evidenciasComparacaoSimbolica(
  acao: AcaoDeComparacaoSimbolica,
): string[] {
  return acao.correta && acao.nivel >= 3
    ? [Evidencia.COMPARACAO_SIMBOLICA_SEM_OBJETOS]
    : [];
}

/**
 * AnswerMeta da W6 conserva evidência de processo para o futuro Thinking Engine:
 * quais lados foram inspecionados, em que ordem e quantas revisões de símbolo
 * ocorreram. Nada disso participa do critério de correção ou de mastery.
 */
export function metaComparacaoSimbolica(
  acao: AcaoDeComparacaoSimbolica,
  spec: ComparacaoSimbolicaSpec,
): AnswerMetaComparacao {
  const misconception = diagnosticarComparacaoSimbolica(acao.escolha, spec);
  const evidencias = evidenciasComparacaoSimbolica(acao);
  return {
    comparacao: acao,
    ...(misconception ? { misconception } : {}),
    ...(evidencias.length ? { evidencias } : {}),
  };
}
