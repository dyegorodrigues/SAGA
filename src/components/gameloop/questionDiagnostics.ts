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
 * Registra uma resposta/tentativa observável.
 *
 * Uma hipótese pode estar embutida numa ação que TERMINA correta: F51/F04
 * acumulam tentativas dentro da primitiva. Descartá-la por `isCorrect` apagava
 * o histórico que o Radar precisa enxergar.
 */
export function recordQuestionAttempt(
  diagnostics: QuestionDiagnostics,
  isCorrect: boolean,
  misconception?: string,
): void {
  diagnostics.attemptCount += 1;
  diagnostics.hadError ||= !isCorrect;
  if (misconception) diagnostics.misconceptionTags.add(misconception);
}

/**
 * Acrescenta uma hipótese derivada de HISTÓRICO sem fingir que houve outro
 * toque. Ex.: F04 `DEPENDE_DE_ANDAIME` compara questões com e sem vaga.
 */
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
