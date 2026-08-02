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

/** Records touches in memory; persistence remains reserved for the terminal answer. */
export function recordQuestionAttempt(
  diagnostics: QuestionDiagnostics,
  isCorrect: boolean,
  misconception?: string,
): void {
  diagnostics.attemptCount += 1;
  diagnostics.hadError ||= !isCorrect;
  if (!isCorrect && misconception) diagnostics.misconceptionTags.add(misconception);
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
