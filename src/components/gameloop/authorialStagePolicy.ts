import { AnswerMeta, Question } from "../../types";

/**
 * Alguns palcos não apenas coletam a resposta: a ficha lhes dá a autoria do
 * erro suave e do retry. Nesses casos o GameLoop deve registrar a tentativa,
 * mas não sobrepor sua própria fala/toast nem encerrar na terceira tentativa.
 *
 * F04/TouchPlace é o primeiro consumidor neste branch. Mantemos a política
 * separada de `answerPolicy` para não misturar diagnóstico com UX/orquestração.
 */
export function ownsAuthorialRetry(q: Question, meta?: AnswerMeta): boolean {
  return q.kind === "touchplace" && meta?.touchplace !== undefined;
}

/** O palco também narra o acerto/erro da F04; o GameLoop não fala por cima. */
export function ownsAuthorialFeedback(q: Question, meta?: AnswerMeta): boolean {
  return q.kind === "touchplace" && meta?.touchplace !== undefined;
}
