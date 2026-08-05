import { diagnosticar as diagnosticarPareamento } from "../../curriculum/procedimentos/pareamentoProcedure";
import { classificarErro, podeGerarDiagnostico } from "../../curriculum/procedimentos/filtroMotor";
import { AnswerMeta, Question } from "../../types";

/**
 * §8.3-bis: o erro veio do dedo, não da cabeça?
 *
 * Só responde `true` quando houve gesto (`manipulacao`). Resposta por
 * alternativa não é manipulação e portanto nunca é escorregão.
 */
export function isMotorSlip(meta?: AnswerMeta): boolean {
  return meta?.manipulacao !== undefined && classificarErro(meta.manipulacao) === "motor";
}

export function isRetryableAnswer(q: Question, value: unknown, meta?: AnswerMeta): boolean {
  if (value === "__timeout__") return false;
  // Escorregão de dedo jamais é resposta terminal: a criança não decidiu nada.
  if (isMotorSlip(meta)) return true;
  return Boolean(q.options || q.groups || meta?.source);
}

export function misconceptionForAnswer(q: Question, value: unknown, meta?: AnswerMeta): string | undefined {
  // Antes de qualquer hipótese diagnóstica, o filtro motor. Uma tag nascida de
  // gesto escorregado contamina o Radar e dispara Oficina injusta (§8.3-bis).
  if (!podeGerarDiagnostico(meta?.manipulacao)) return undefined;

  // Ficha de PRODUÇÃO (N1.01/F07): não há alternativa que carregue a hipótese —
  // o erro está no que a criança FEZ com as peças. Sem esta leitura, distribuir
  // dois no mesmo lugar e deixar alguém sem chegariam ao Radar como o mesmo
  // silêncio, e são erros que pedem aulas diferentes.
  if (meta?.pareamento && q.uiProps && "receptores" in q.uiProps) {
    const cena = {
      receptores: (q.uiProps as { receptores: { quantidade: number } }).receptores.quantidade,
      itens: (q.uiProps as { itens: { quantidade: number } }).itens.quantidade,
    };
    const daAcao = diagnosticarPareamento(meta.pareamento, cena);
    if (daAcao) return daAcao;
  }

  const pickedOption = q.options?.find(option => option.value === value);
  return pickedOption?.misconception
    ? pickedOption.tag || pickedOption.misconception
    : meta?.misconception;
}

export function shouldRenderQuestionOptions(q: Question): boolean {
  return Boolean(q.options)
    && q.kind !== "vertical"
    && q.kind !== "numberline-interactive"
    && q.kind !== "drag-group"
    && q.kind !== "array";
}
