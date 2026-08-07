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
 * Registra a história da questão em memória; só a resposta terminal persiste.
 *
 * Importante: uma hipótese pode nascer de uma ação que TERMINA correta. F51 e
 * F04 acumulam tentativas dentro da própria primitiva; F05 pode acertar depois
 * de várias repetições. Nesses casos `misconception` descreve a trajetória, não
 * o valor terminal. Descartá-la quando `isCorrect === true` apagava exatamente
 * os erros recuperados que o Radar precisa enxergar.
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
