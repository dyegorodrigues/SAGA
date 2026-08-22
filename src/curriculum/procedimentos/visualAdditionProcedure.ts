import { AnswerMeta } from "../../types";
import type { VisualAdditionSpec } from "./visualAdditionContract";
import { VisualAdditionEvidence, VisualAdditionMisconception } from "./visualAdditionSemantics";

export interface AcaoVisualAddition {
  nivel: number;
  resposta: number;
  correta: boolean;
  juntou: boolean;
  usouAjuda: boolean;
  revisoes: number;
}

export interface AnswerMetaVisualAddition extends AnswerMeta {
  visualAddition: AcaoVisualAddition;
}

export function diagnosticarVisualAddition(
  resposta: number,
  spec: VisualAdditionSpec,
): string | undefined {
  if (resposta === spec.total) return undefined;
  if (resposta === spec.a || resposta === spec.b) return VisualAdditionMisconception.REPETE_PARCELA;
  if (Math.abs(resposta - spec.total) === 1) return VisualAdditionMisconception.OFF_BY_ONE;
  if (resposta === Math.abs(spec.a - spec.b)) return VisualAdditionMisconception.SUBTRAIU;
  return undefined;
}

export function evidenciasVisualAddition(acao: AcaoVisualAddition): string[] {
  return acao.correta && acao.nivel === 4
    ? [VisualAdditionEvidence.SEM_OBJETOS]
    : [];
}

/**
 * Guarda processo sem transformar ajuda, revisão ou velocidade em domínio.
 * A resposta continua sendo julgada apenas pela soma; o restante é observação.
 */
export function metaVisualAddition(
  acao: AcaoVisualAddition,
  spec: VisualAdditionSpec,
): AnswerMetaVisualAddition {
  const misconception = diagnosticarVisualAddition(acao.resposta, spec);
  const evidencias = evidenciasVisualAddition(acao);
  return {
    visualAddition: acao,
    ...(misconception ? { misconception } : {}),
    ...(evidencias.length ? { evidencias } : {}),
  };
}
