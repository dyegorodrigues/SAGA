import type { DojoTrackState, FactStrength, ProcStrength } from "../../types";

export const SENSEI_DOJO_ROUND_ITENS = 10;
export const SENSEI_DOJO_ALVO = 0.8;
export const SENSEI_DOJO_LIMIAR_RECUO = 0.6;
export const SENSEI_DOJO_MAX_STEP = 10;

export type FluencyItemKind = "fact" | "procedure";

export interface SenseiDojoAttempt {
  right: boolean;
  durationMs: number;
  targetRtMs: number;
  itemId: string;
  itemKind: FluencyItemKind;
}

export type SenseiDojoRoundOutcome = "hold" | "advance" | "retreat" | "mastered" | "free-practice";

export interface SenseiDojoRoundResult {
  state: DojoTrackState;
  accuracy: number;
  fluentAccuracy: number;
  avgCorrectRtMs?: number;
  outcome: SenseiDojoRoundOutcome;
}

export function freshSenseiDojoState(unlocked = false): DojoTrackState {
  return {
    unlocked,
    mastered: false,
    family: "FD",
    currentStep: 1,
    highestStep: 1,
    goodRounds: 0,
    weakRounds: 0,
    rounds: 0,
    attempts: 0,
    correct: 0,
    facts: {},
    procs: {},
  };
}

function clampStep(step: number | undefined): number {
  return Math.min(SENSEI_DOJO_MAX_STEP, Math.max(1, Math.round(step ?? 1)));
}

function validateAttempts(attempts: SenseiDojoAttempt[]): void {
  if (attempts.length !== SENSEI_DOJO_ROUND_ITENS) {
    throw new Error(`Round do Dojo Sensei exige ${SENSEI_DOJO_ROUND_ITENS} itens; recebeu ${attempts.length}.`);
  }
  for (const attempt of attempts) {
    if (!attempt.itemId) throw new Error("Tentativa de fluência sem itemId.");
    if (!Number.isFinite(attempt.durationMs) || attempt.durationMs < 0) {
      throw new Error(`RT inválido no Dojo Sensei: ${attempt.durationMs}.`);
    }
    if (!Number.isFinite(attempt.targetRtMs) || attempt.targetRtMs <= 0) {
      throw new Error(`rt_alvo inválido no Dojo Sensei: ${attempt.targetRtMs}.`);
    }
  }
}

function updateFact(before: FactStrength | undefined, attempt: SenseiDojoAttempt, day: string): FactStrength {
  const fluent = attempt.right && attempt.durationMs <= attempt.targetRtMs;
  const oldRt = before?.rt_medio ?? attempt.durationMs;
  return {
    fact_id: attempt.itemId,
    rt_max_s: attempt.targetRtMs / 1000,
    forca: Math.min(5, Math.max(0, (before?.forca ?? 0) + (fluent ? 1 : attempt.right ? 0 : -1))),
    rt_medio: Math.round(before ? oldRt * 0.7 + attempt.durationMs * 0.3 : attempt.durationMs),
    ultima_vez: day,
    erros_seguidos: attempt.right ? 0 : (before?.erros_seguidos ?? 0) + 1,
  };
}

function updateProc(before: ProcStrength | undefined, attempt: SenseiDojoAttempt, day: string): ProcStrength {
  const fluent = attempt.right && attempt.durationMs <= attempt.targetRtMs;
  const oldPrecision = before?.precisao ?? (attempt.right ? 1 : 0);
  const oldRt = before?.tempo_medio ?? attempt.durationMs;
  return {
    proc_id: attempt.itemId,
    rt_max_s: attempt.targetRtMs / 1000,
    precisao: before ? oldPrecision * 0.7 + (attempt.right ? 1 : 0) * 0.3 : (attempt.right ? 1 : 0),
    tempo_medio: Math.round(before ? oldRt * 0.7 + attempt.durationMs * 0.3 : attempt.durationMs),
    forca: Math.min(5, Math.max(0, (before?.forca ?? 0) + (fluent ? 1 : attempt.right ? 0 : -1))),
    ultima_vez: day,
    erros_seguidos: attempt.right ? 0 : (before?.erros_seguidos ?? 0) + 1,
    ...(before?.passo_fraco ? { passo_fraco: before.passo_fraco } : {}),
  };
}

/**
 * Aplica um round de automaticidade sem tocar em mastery conceitual.
 *
 * `servedStep` é o nível realmente treinado. `adaptive=true` significa treino
 * prescrito pelo Sensei no `currentStep`; prática manual em outro nível atualiza
 * forças e estatísticas, mas não move o ponteiro adaptativo.
 *
 * `maxEligibleStep` vem do conhecimento conceitual já demonstrado. O Dojo nunca
 * avança para uma faixa que a Jornada/Sensei ainda não tornou pedagogicamente segura.
 */
export function applySenseiDojoRound(
  current: DojoTrackState,
  attempts: SenseiDojoAttempt[],
  servedStep: number,
  maxEligibleStep: number,
  practiceDay: string,
  adaptive = true,
): SenseiDojoRoundResult {
  validateAttempts(attempts);
  const served = clampStep(servedStep);
  const ceiling = Math.max(0, Math.min(SENSEI_DOJO_MAX_STEP, Math.floor(maxEligibleStep)));
  if (ceiling < 1) throw new Error("Dojo Sensei não pode rodar sem faixa conceitualmente elegível.");
  if (served > ceiling) throw new Error(`Faixa ${served} excede teto conceitual ${ceiling}.`);

  const correct = attempts.filter(attempt => attempt.right);
  const fluent = attempts.filter(attempt => attempt.right && attempt.durationMs <= attempt.targetRtMs);
  const accuracy = correct.length / attempts.length;
  const fluentAccuracy = fluent.length / attempts.length;
  const avgCorrectRtMs = correct.length
    ? correct.reduce((sum, attempt) => sum + attempt.durationMs, 0) / correct.length
    : undefined;

  const facts = { ...(current.facts ?? {}) };
  const procs = { ...(current.procs ?? {}) };
  for (const attempt of attempts) {
    if (attempt.itemKind === "fact") facts[attempt.itemId] = updateFact(facts[attempt.itemId], attempt, practiceDay);
    else procs[attempt.itemId] = updateProc(procs[attempt.itemId], attempt, practiceDay);
  }

  const currentStep = Math.min(ceiling, clampStep(current.currentStep));
  let nextStep = currentStep;
  let highestStep = Math.min(ceiling, Math.max(clampStep(current.highestStep), currentStep));
  let goodRounds = Math.max(0, current.goodRounds ?? 0);
  let weakRounds = Math.max(0, current.weakRounds ?? 0);
  let mastered = current.mastered === true && ceiling >= SENSEI_DOJO_MAX_STEP;
  let outcome: SenseiDojoRoundOutcome = "free-practice";

  const governsAdaptivePointer = adaptive && served === currentStep;
  if (governsAdaptivePointer) {
    const roundGood = accuracy >= SENSEI_DOJO_ALVO && fluentAccuracy >= SENSEI_DOJO_ALVO;
    const roundWeak = accuracy < SENSEI_DOJO_LIMIAR_RECUO;
    goodRounds = roundGood ? goodRounds + 1 : 0;
    weakRounds = roundWeak ? weakRounds + 1 : 0;
    outcome = "hold";

    if (goodRounds >= 2) {
      if (currentStep < ceiling) {
        nextStep = currentStep + 1;
        highestStep = Math.max(highestStep, nextStep);
        outcome = "advance";
      } else if (ceiling >= SENSEI_DOJO_MAX_STEP) {
        mastered = true;
        outcome = "mastered";
      }
      goodRounds = 0;
      weakRounds = 0;
    } else if (weakRounds >= 2) {
      if (currentStep > 1) {
        nextStep = currentStep - 1;
        outcome = "retreat";
      }
      goodRounds = 0;
      weakRounds = 0;
    }
  }

  const historicalAvg = current.avgCorrectRtMs;
  const nextAvg = avgCorrectRtMs === undefined
    ? historicalAvg
    : historicalAvg === undefined
      ? avgCorrectRtMs
      : historicalAvg * 0.7 + avgCorrectRtMs * 0.3;
  const family = attempts.some(attempt => attempt.itemKind === "procedure") ? "PD" : "FD";

  const state: DojoTrackState = {
    ...current,
    unlocked: true,
    mastered,
    family,
    currentStep: nextStep,
    highestStep,
    goodRounds,
    weakRounds,
    rounds: (current.rounds ?? 0) + 1,
    attempts: (current.attempts ?? 0) + attempts.length,
    correct: (current.correct ?? 0) + correct.length,
    lastDay: practiceDay,
    facts,
    procs,
    ...(nextAvg === undefined ? {} : { avgCorrectRtMs: nextAvg }),
  };

  return { state, accuracy, fluentAccuracy, avgCorrectRtMs, outcome };
}
