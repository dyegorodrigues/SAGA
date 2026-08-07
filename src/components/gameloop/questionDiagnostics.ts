import { unbundleMisconceptions } from "./misconceptionBundle";

export interface QuestionDiagnostics {
  attemptCount: number;
  hadError: boolean;
  misconceptionTags: Set<string>;
}

export interface QuestionDiagnosticsSummary {
  attemptCount: number;
  recoveredAfterError: boolean;
  misconceptionTags: string[];
}

export const createQuestionDiagnostics = (): QuestionDiagnostics => ({
  attemptCount: 0,
  hadError: false,
  misconceptionTags: new Set<string>(),
});

/**
 * Registra UMA tentativa observável. O contrato vindo de answerPolicy continua
 * string; se ela embute várias hipóteses, o bundle é aberto aqui sem inflar o
 * contador de tentativas.
 */
export function recordQuestionAttempt(
  diagnostics: QuestionDiagnostics,
  isCorrect: boolean,
  misconception?: string,
): void {
  diagnostics.attemptCount += 1;
  diagnostics.hadError ||= !isCorrect;
  unbundleMisconceptions(misconception)
    .forEach(tag => diagnostics.misconceptionTags.add(tag));
}

/** Mantida para hipóteses de histórico produzidas por outros motores. */
export function recordQuestionHypothesis(
  diagnostics: QuestionDiagnostics,
  misconception?: string,
): void {
  if (misconception) diagnostics.misconceptionTags.add(misconception);
}

export function summarizeQuestionDiagnostics(
  diagnostics: QuestionDiagnostics,
  terminalAnswerIsCorrect: boolean,
): QuestionDiagnosticsSummary {
  return {
    attemptCount: diagnostics.attemptCount,
    recoveredAfterError: terminalAnswerIsCorrect && diagnostics.hadError,
    misconceptionTags: [...diagnostics.misconceptionTags],
  };
}
