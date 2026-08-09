import type { DojoTrackState, Progress, Question, State } from "../../types";
import type { MasteryAttempt } from "./progressEngine";
import { applySenseiDojoRound, freshSenseiDojoState, type SenseiDojoAttempt } from "./senseiDojoEngine";
import {
  maxEligibleSenseiDojoStepById,
  senseiDojoMeta,
  type SenseiDojoQuestionMeta,
  type SenseiDojoTempleId,
} from "./senseiDojoPolicy";

export const SENSEI_DOJO_ATTEMPT_MARKER = "__senseiDojoAttempt" as const;
const SENSEI_DOJO_PENDING_ROUND = "__senseiDojoPendingRound" as const;

type PendingQuestion = {
  meta: SenseiDojoQuestionMeta;
  targetRtMs: number;
  attemptCount: number;
};

type DojoAttemptMarker = SenseiDojoAttempt & {
  templeId: SenseiDojoTempleId;
  step: number;
  practiceDay: string;
};

type MarkedProgress = Progress & {
  [SENSEI_DOJO_ATTEMPT_MARKER]?: DojoAttemptMarker;
};

type PendingRound = {
  step: number;
  attempts: SenseiDojoAttempt[];
};

type PersistedSenseiDojoState = DojoTrackState & {
  [SENSEI_DOJO_PENDING_ROUND]?: PendingRound;
};

let pendingQuestion: PendingQuestion | null = null;

/**
 * Chamado em toda tentativa real antes do terminal. O token é por geração de
 * questão, então repetir o mesmo fato em duas perguntas consecutivas não mistura
 * contagem de retries.
 */
export function recordSenseiDojoAttempt(question: Question): void {
  const meta = senseiDojoMeta(question);
  if (!meta) {
    pendingQuestion = null;
    return;
  }
  const targetRtMs = (question.rt_max_s ?? 0) * 1000;
  if (!Number.isFinite(targetRtMs) || targetRtMs <= 0) {
    throw new Error(`${meta.templeId} nível ${meta.step} sem rt_alvo válido.`);
  }
  if (pendingQuestion?.meta.token === meta.token) {
    pendingQuestion.attemptCount += 1;
  } else {
    pendingQuestion = { meta, targetRtMs, attemptCount: 1 };
  }
}

/**
 * Intercepta o progressEngine apenas quando a questão corrente é de um templo.
 * Nenhuma regra de Jornada roda: o retorno é somente um envelope transitório
 * que `materializeSenseiDojoProgress` consome no boundary do save.
 */
export function consumeSenseiDojoTerminal(
  fallback: Progress,
  terminalRight: boolean,
  attempt?: MasteryAttempt,
): { handled: false } | { handled: true; progress: Progress } {
  if (!pendingQuestion) return { handled: false };
  if (!attempt) throw new Error("Dojo Sensei recebeu resposta terminal sem MasteryAttempt/RT.");

  const { meta, targetRtMs, attemptCount } = pendingQuestion;
  pendingQuestion = null;
  const marker: DojoAttemptMarker = {
    templeId: meta.templeId,
    step: meta.step,
    itemId: meta.itemId,
    itemKind: meta.itemKind,
    right: terminalRight && attemptCount === 1,
    durationMs: attempt.durationMs,
    targetRtMs,
    practiceDay: attempt.practiceDay,
  };

  return {
    handled: true,
    progress: {
      ...fallback,
      // O envelope não tem autoridade conceitual. Mesmo que um save legado do
      // templo tenha `dom`, ele não atravessa para o novo pilar de fluência.
      dom: false,
      masteryEvidence: undefined,
      bank: [],
      [SENSEI_DOJO_ATTEMPT_MARKER]: marker,
    } as MarkedProgress,
  };
}

function markerOf(progress: Progress | undefined): DojoAttemptMarker | undefined {
  return (progress as MarkedProgress | undefined)?.[SENSEI_DOJO_ATTEMPT_MARKER];
}

function withoutMarker(progress: Progress): Progress {
  const clean = { ...(progress as MarkedProgress) };
  delete clean[SENSEI_DOJO_ATTEMPT_MARKER];
  return clean;
}

function legacyDojoState(progress: Progress, ceiling: number): PersistedSenseiDojoState {
  const currentStep = ceiling > 0 ? Math.min(ceiling, Math.max(1, progress.lvl || 1)) : 1;
  return {
    ...freshSenseiDojoState(ceiling > 0),
    currentStep,
    highestStep: Math.min(10, Math.max(currentStep, progress.maxLvl || progress.lvl || 1)),
    // Coroa antiga do Progress NÃO migra: ela nasceu no motor conceitual errado.
    mastered: false,
    attempts: Math.max(0, progress.tot || 0),
    correct: Math.max(0, progress.ok || 0),
    ...(progress.rt !== undefined ? { avgCorrectRtMs: progress.rt } : {}),
    ...(progress.lastDay ? { lastDay: progress.lastDay } : {}),
  };
}

function normalizeSaved(
  saved: DojoTrackState | undefined,
  fallbackLegacy: Progress | undefined,
  ceiling: number,
): PersistedSenseiDojoState {
  if (!saved) return fallbackLegacy ? legacyDojoState(fallbackLegacy, ceiling) : freshSenseiDojoState(ceiling > 0);
  const extended = saved as PersistedSenseiDojoState;
  const currentStep = ceiling > 0 ? Math.min(ceiling, Math.max(1, saved.currentStep ?? 1)) : 1;
  return {
    ...freshSenseiDojoState(ceiling > 0),
    ...saved,
    unlocked: ceiling > 0,
    mastered: saved.mastered === true && ceiling >= 10,
    currentStep,
    highestStep: Math.min(10, Math.max(saved.highestStep ?? currentStep, currentStep)),
    facts: { ...(saved.facts ?? {}) },
    procs: { ...(saved.procs ?? {}) },
    ...(extended[SENSEI_DOJO_PENDING_ROUND]
      ? { [SENSEI_DOJO_PENDING_ROUND]: {
          step: extended[SENSEI_DOJO_PENDING_ROUND]!.step,
          attempts: [...extended[SENSEI_DOJO_PENDING_ROUND]!.attempts],
        } }
      : {}),
  };
}

/** Remove o buffer parcial antes de entregar um round fechado ao motor puro. */
function withoutPendingRound(state: PersistedSenseiDojoState): DojoTrackState {
  const clean = { ...state };
  delete clean[SENSEI_DOJO_PENDING_ROUND];
  return clean;
}

/**
 * Move eventos transitórios `progress.dojo_*` para o estado de fluência do kid.
 * Também migra silenciosamente saves legados dos quatro templos, preservando
 * volume/RT/faixa como histórico de treino, mas nunca `dom/masteryEvidence`.
 */
export function materializeSenseiDojoProgress(state: State): State {
  const knownTempleIds: SenseiDojoTempleId[] = ["dojo_add", "dojo_sub", "dojo_mul", "dojo_div"];
  let changed = false;
  const nextProgress: State["progress"] = { ...state.progress };
  const nextDojoTracks: NonNullable<State["dojoTracks"]> = { ...(state.dojoTracks ?? {}) };

  for (const [kidId, rawProgressMap] of Object.entries(state.progress ?? {})) {
    const progressMap = { ...rawProgressMap };
    let kidChanged = false;
    const kidDojo = { ...(nextDojoTracks[kidId] ?? {}) };

    for (const templeId of knownTempleIds) {
      const legacyOrMarker = progressMap[templeId];
      const marker = markerOf(legacyOrMarker);
      if (!legacyOrMarker && !marker) continue;

      const conceptualProgress = { ...progressMap };
      for (const id of knownTempleIds) delete conceptualProgress[id];
      const ceiling = maxEligibleSenseiDojoStepById(templeId, conceptualProgress);
      let dojoState = normalizeSaved(kidDojo[templeId], marker ? undefined : legacyOrMarker, ceiling);

      // O Progress do templo antigo/transitório deixa de ser fonte de verdade.
      delete progressMap[templeId];
      kidChanged = true;
      changed = true;

      if (marker) {
        // Defesa final: um nível clicado por UI antiga não ganha evidência se o
        // conceito ainda não o tornou seguro. A UI é restringida também.
        if (ceiling >= marker.step && ceiling > 0) {
          const extended = dojoState as PersistedSenseiDojoState;
          const oldPending = extended[SENSEI_DOJO_PENDING_ROUND];
          const pending: PendingRound = oldPending?.step === marker.step
            ? { step: marker.step, attempts: [...oldPending.attempts, marker] }
            : { step: marker.step, attempts: [marker] };

          if (pending.attempts.length >= 10) {
            const adaptive = marker.step === (dojoState.currentStep ?? 1);
            const result = applySenseiDojoRound(
              withoutPendingRound(extended),
              pending.attempts.slice(0, 10),
              marker.step,
              ceiling,
              marker.practiceDay,
              adaptive,
            );
            // O motor recebe e devolve apenas o estado público; o round fechado
            // não pode reaparecer no 11º item por herança de spread.
            dojoState = { ...result.state };
          } else {
            dojoState = { ...dojoState, [SENSEI_DOJO_PENDING_ROUND]: pending } as PersistedSenseiDojoState;
          }
        }
      }

      kidDojo[templeId] = dojoState;
    }

    if (kidChanged) {
      nextProgress[kidId] = progressMap;
      nextDojoTracks[kidId] = kidDojo;
    }
  }

  return changed ? { ...state, progress: nextProgress, dojoTracks: nextDojoTracks } : state;
}

/** Test/debug only: confirma que o envelope nunca carrega mastery real. */
export function stripSenseiDojoMarkerForTest(progress: Progress): Progress {
  return withoutMarker(progress);
}
