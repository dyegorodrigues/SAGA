import { AnswerMeta, Question } from "../../types";

export function isRetryableAnswer(q: Question, value: unknown, meta?: AnswerMeta): boolean {
  return value !== "__timeout__" && Boolean(q.options || q.groups || meta?.source);
}

export function misconceptionForAnswer(q: Question, value: unknown, meta?: AnswerMeta): string | undefined {
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
