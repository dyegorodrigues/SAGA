import { Progress, Question, State, Track } from "../../types";
import { clearTelemetryAulaSource, setTelemetryAulaSource } from "../../lib/telemetryIdentityContext";

/**
 * PÓS-P22 — identidade curricular de uma questão composta pela Minha Aula.
 *
 * `Track.id === "aula"` é apenas o envelope da missão. A autoridade curricular
 * continua sendo a trilha que GEROU cada questão. Como o GameLoop histórico
 * recebe um único `Progress`, esta camada resolve o progresso-fonte no instante
 * da resposta e deixa um marcador transitório para o reconciliador do save.
 *
 * O marcador NUNCA deve chegar ao estado persistido: `materializeAulaProgress`
 * move o progresso para `progress[kid][sourceTrackId]` e remove `progress.aula`.
 */
export const AULA_SOURCE_MARKER = "__aulaSourceTrackId" as const;

export type AulaQuestion = Question & {
  sourceTrackId?: string;
  sourceGraphId?: string;
  sourceLevel?: number;
};

type RoutedProgress = Progress & {
  [AULA_SOURCE_MARKER]?: string;
};

const progressByTrack = new Map<string, Progress>();
let pendingSourceTrackId: string | null = null;

function cloneProgress(progress: Progress): Progress {
  return {
    ...progress,
    bank: [...(progress.bank || [])],
    misconceptions: progress.misconceptions ? [...progress.misconceptions] : undefined,
    masteryEvidence: progress.masteryEvidence
      ? {
          ...progress.masteryEvidence,
          evidenciasVistas: progress.masteryEvidence.evidenciasVistas
            ? [...progress.masteryEvidence.evidenciasVistas]
            : undefined,
          comprehensionWindow: progress.masteryEvidence.comprehensionWindow
            ? [...progress.masteryEvidence.comprehensionWindow]
            : undefined,
          passedSessionDays: progress.masteryEvidence.passedSessionDays
            ? [...progress.masteryEvidence.passedSessionDays]
            : undefined,
        }
      : undefined,
  };
}

function stripMarker(progress: Progress): Progress {
  const clean = { ...(progress as RoutedProgress) };
  delete clean[AULA_SOURCE_MARKER];
  return cloneProgress(clean);
}

/** Uma nova composição representa uma nova sessão; snapshots antigos não vazam entre crianças/missões. */
export function beginAulaProgressSession(): void {
  progressByTrack.clear();
  pendingSourceTrackId = null;
  clearTelemetryAulaSource();
}

/** Registra o snapshot inicial apenas se o source ainda não foi atualizado nesta missão. */
export function registerAulaSourceProgress(trackId: string, progress: Progress): void {
  if (!trackId || trackId === "aula" || progressByTrack.has(trackId)) return;
  progressByTrack.set(trackId, cloneProgress(progress));
}

/**
 * Carimba uma questão com a identidade que sobreviverá até a resposta.
 * O snapshot é guardado fora da Question para não serializar Progress dentro do banco de erros.
 */
export function stampAulaQuestion(
  question: Question,
  track: Track,
  level: number,
  initialProgress: Progress,
): Question {
  registerAulaSourceProgress(track.id, initialProgress);
  return {
    ...question,
    sourceTrackId: track.id,
    sourceGraphId: track.graphId ?? track.id,
    sourceLevel: level,
  } as AulaQuestion;
}

/**
 * Chamado pela answer policy em TODA tentativa. Questão não composta limpa
 * qualquer tentativa abandonada de uma aula anterior.
 */
export function prepareAulaSourceForAnswer(question: Question): void {
  const sourceTrackId = (question as AulaQuestion).sourceTrackId;
  pendingSourceTrackId = sourceTrackId && sourceTrackId !== "aula" ? sourceTrackId : null;
  setTelemetryAulaSource(pendingSourceTrackId ?? undefined);
}

/**
 * Resolve o Progress que `applyJourneyAnswer` deve usar. O consumo é atômico:
 * depois da resposta terminal, uma questão comum não pode herdar o source anterior.
 */
export function consumeAulaSourceProgress(fallback: Progress): {
  progress: Progress;
  sourceTrackId?: string;
} {
  const sourceTrackId = pendingSourceTrackId ?? undefined;
  pendingSourceTrackId = null;
  if (!sourceTrackId) return { progress: fallback };

  const source = progressByTrack.get(sourceTrackId) ?? fallback;
  return { progress: cloneProgress(source), sourceTrackId };
}

/** Marca o commit transitório e atualiza o snapshot para outra questão do mesmo source na mesma missão. */
export function markAulaSourceProgress(progress: Progress, sourceTrackId?: string): Progress {
  if (!sourceTrackId) return progress;
  const clean = stripMarker(progress);
  progressByTrack.set(sourceTrackId, clean);
  return { ...clean, [AULA_SOURCE_MARKER]: sourceTrackId } as RoutedProgress;
}

export function sourceTrackIdFromProgress(progress: Progress | undefined): string | undefined {
  const source = (progress as RoutedProgress | undefined)?.[AULA_SOURCE_MARKER];
  return typeof source === "string" && source !== "aula" ? source : undefined;
}

/**
 * Materializa commits do envelope `aula` no nó-fonte ANTES de `setState` e de
 * qualquer gravação local/cloud. Também remove saves sintéticos antigos de
 * `progress.aula`: eles misturam competências e não podem servir como evidência.
 */
export function materializeAulaProgress(state: State): State {
  let changed = false;
  const nextProgress: State["progress"] = { ...state.progress };

  for (const [kidId, progressMap] of Object.entries(state.progress || {})) {
    const aulaProgress = progressMap?.aula;
    if (!aulaProgress) continue;

    changed = true;
    const sourceTrackId = sourceTrackIdFromProgress(aulaProgress);
    const nextKidProgress = { ...progressMap };
    delete nextKidProgress.aula;

    if (sourceTrackId) {
      const clean = stripMarker(aulaProgress);
      nextKidProgress[sourceTrackId] = clean;
      progressByTrack.set(sourceTrackId, cloneProgress(clean));
    }

    nextProgress[kidId] = nextKidProgress;
  }

  return changed ? { ...state, progress: nextProgress } : state;
}
