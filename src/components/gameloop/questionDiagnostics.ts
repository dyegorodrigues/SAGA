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
 * Registra UMA tentativa observável e todas as hipóteses que ela sustenta.
 *
 * F04 pode produzir simultaneamente uma hipótese imediata (ex.: parou antes) e
 * uma longitudinal (`DEPENDE_DE_ANDAIME`). Isso não são dois toques — portanto
 * o contador sobe uma vez e as duas tags entram no mesmo conjunto.
 */
export function recordQuestionAttempt(
  diagnostics: QuestionDiagnostics,
  isCorrect: boolean,
  misconception?: string | string[],
): void {
  diagnostics.attemptCount += 1;
  diagnostics.hadError ||= !isCorrect;
  if (Array.isArray(misconception)) {
    misconception.forEach(tag => tag && diagnostics.misconceptionTags.add(tag));
  } else if (misconception) {
    diagnostics.misconceptionTags.add(misconception);
  }
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
