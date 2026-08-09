import type { Progress, Question, Track } from "../../types";
import type { AulaQuestion } from "./aulaProgressContext";

export interface QuestionCurricularIdentity {
  /** Competência que realmente gerou/recebe a evidência desta questão. */
  trackId: string;
  graphId: string;
  level: number;
  /** Envelope da missão quando ele difere da competência-fonte, ex.: `aula`. */
  sessionTrackId?: string;
}

/**
 * Resolve UMA identidade para Leitner, telemetria e qualquer consumidor que
 * precise saber o que a criança realmente praticou.
 *
 * `track.id === "aula"` é envelope de sessão. Questões compostas já carregam
 * `sourceTrackId/sourceGraphId/sourceLevel`; consumidores não devem voltar a
 * inferir identidade pelo envelope.
 */
export function resolveQuestionCurricularIdentity(
  track: Track,
  question: Question,
  progress: Progress,
): QuestionCurricularIdentity {
  const aulaQuestion = question as AulaQuestion;
  const sourceTrackId = typeof aulaQuestion.sourceTrackId === "string"
    && aulaQuestion.sourceTrackId
    && aulaQuestion.sourceTrackId !== "aula"
      ? aulaQuestion.sourceTrackId
      : undefined;
  const sourceGraphId = typeof aulaQuestion.sourceGraphId === "string" && aulaQuestion.sourceGraphId
    ? aulaQuestion.sourceGraphId
    : undefined;
  const sourceLevel = Number.isFinite(aulaQuestion.sourceLevel)
    ? Number(aulaQuestion.sourceLevel)
    : undefined;

  const trackId = sourceTrackId ?? track.id;
  return {
    trackId,
    graphId: sourceGraphId ?? track.graphId ?? trackId,
    level: sourceLevel ?? progress.lvl,
    ...(track.id !== trackId ? { sessionTrackId: track.id } : {}),
  };
}
