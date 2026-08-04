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
