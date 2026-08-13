import type { AnswerMeta } from "../../types";
import type { SkipCountF30Spec } from "./skipCountContract";
import {
  SkipCountEvidence,
  SkipCountMisconception,
  type SkipCountMisconception as SkipCountMisconceptionTag,
} from "./skipCountSemantics";

export interface AcaoSkipCount {
  nivel: number;
  valor: number;
  esperado: number;
  salto: number;
  inicio: number;
  correta: boolean;
}

export function diagnosticarSkipCount(
  acao: AcaoSkipCount,
  spec: SkipCountF30Spec,
): SkipCountMisconceptionTag | undefined {
  if (acao.correta) return undefined;
  const opcao = spec.opcoes.find(candidate => candidate.valor === acao.valor);
  if (opcao?.misconception) return opcao.misconception;
  return SkipCountMisconception.PERDE_O_SALTO;
}

export function evidenciasSkipCount(
  acao: AcaoSkipCount,
  spec: SkipCountF30Spec,
): string[] {
  if (!acao.correta) return [];
  const evidencias = [SkipCountEvidence.salto(spec.salto)];
  if (!spec.mostrarReta && !spec.mostrarQuadrado100) evidencias.push(SkipCountEvidence.SEM_MANIPULAVEL);
  if (spec.nivel === 5 && spec.inicio > 0) evidencias.push(SkipCountEvidence.INICIO_DESLOCADO);
  return evidencias;
}

export function metaSkipCount(acao: AcaoSkipCount, spec: SkipCountF30Spec): AnswerMeta {
  const misconception = diagnosticarSkipCount(acao, spec);
  const evidencias = evidenciasSkipCount(acao, spec);
  return {
    ...(misconception ? { misconception } : {}),
    ...(evidencias.length ? { evidencias } : {}),
  };
}
