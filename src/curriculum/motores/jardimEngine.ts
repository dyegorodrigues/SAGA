import type { JardimTrackState, Progress } from "../../types";
import type { TrilhaDoJardim } from "../fichas/dojo/jardim";

/** DOJO_SAGA §7: o Jardim trabalha em rounds curtos de 6–10 itens. */
export const JARDIM_MIN_ITENS = 6;
export const JARDIM_MAX_ITENS = 10;
/** DOJO_SAGA §3-bis: dois rounds >=80% promovem. */
export const JARDIM_ALVO_ROUND = 0.8;
/** DOJO_SAGA §4: dois rounds abaixo de 60% recuam o treino sem tirar conquista. */
export const JARDIM_LIMIAR_RECUO = 0.6;
export const JARDIM_MAX_DEGRAU = 5;

export interface JardimAttempt {
  right: boolean;
  durationMs: number;
  /** rt_alvo da ficha no degrau servido. Medido em silêncio. */
  targetRtMs: number;
  /** Só erros cognitivos reais entram no Radar; lentidão não é misconception. */
  misconception?: string;
}

export type JardimRoundOutcome = "hold" | "advance" | "retreat" | "mastered";

export interface JardimRoundResult {
  state: JardimTrackState;
  accuracy: number;
  /** Fração do round que foi correta E respondeu dentro do alvo. */
  fluentAccuracy: number;
  avgCorrectRtMs?: number;
  outcome: JardimRoundOutcome;
  /** Tags vindas de respostas erradas; nunca inclui lentidão correta. */
  misconceptions: string[];
}

export function freshJardimTrackState(unlocked = false): JardimTrackState {
  return {
    unlocked,
    mastered: false,
    family: "JD",
    currentStep: 1,
    highestStep: 1,
    goodRounds: 0,
    weakRounds: 0,
    rounds: 0,
    attempts: 0,
    correct: 0,
  };
}

/**
 * O unlock do Jardim é DERIVADO da competência-mãe. Não nasce de estrela,
 * `dojoTracks.unlocked`, nem de um nó JD no DAG. `maxLvl` vence `lvl`: uma
 * regressão de treino da Jornada nunca fecha uma porta que a criança já abriu.
 */
export function jardimUnlocked(
  trilha: Pick<TrilhaDoJardim, "destravaNoNivel">,
  motherProgress: Progress | undefined,
): boolean {
  if (!motherProgress) return false;
  if (motherProgress.dom) return true;
  return Math.max(motherProgress.maxLvl ?? 0, motherProgress.lvl ?? 0) >= trilha.destravaNoNivel;
}

function validateRound(attempts: JardimAttempt[]): void {
  if (attempts.length < JARDIM_MIN_ITENS || attempts.length > JARDIM_MAX_ITENS) {
    throw new Error(
      `Round do Jardim exige ${JARDIM_MIN_ITENS}-${JARDIM_MAX_ITENS} itens; recebeu ${attempts.length}.`,
    );
  }
  for (const attempt of attempts) {
    if (!Number.isFinite(attempt.durationMs) || attempt.durationMs < 0) {
      throw new Error(`RT inválido no Jardim: ${attempt.durationMs}.`);
    }
    if (!Number.isFinite(attempt.targetRtMs) || attempt.targetRtMs <= 0) {
      throw new Error(`rt_alvo inválido no Jardim: ${attempt.targetRtMs}.`);
    }
  }
}

/**
 * Aplica UM round já encerrado. O motor não usa tempo para dizer que a criança
 * "errou":
 *
 * - certo + dentro do rt_alvo = resposta fluente;
 * - certo + lento = compreensão preservada, automaticidade ainda em treino;
 * - errado = erro cognitivo/estratégico, podendo alimentar Radar;
 * - 2 rounds bons -> avança o degrau de treino;
 * - 2 rounds <60% -> recua o treino, mas `highestStep`/faixa nunca regride.
 *
 * Para o Jardim, "round bom" precisa satisfazer as DUAS dimensões: >=80% de
 * precisão e >=80% de respostas corretas dentro do rt_alvo. A exposição curta
 * e o RT são o instrumento de automaticidade; usar só precisão transformaria o
 * Jardim numa segunda Jornada.
 */
export function applyJardimRound(
  current: JardimTrackState,
  attempts: JardimAttempt[],
  practiceDay?: string,
): JardimRoundResult {
  validateRound(attempts);

  const total = attempts.length;
  const correctAttempts = attempts.filter(a => a.right);
  const fluent = attempts.filter(a => a.right && a.durationMs <= a.targetRtMs).length;
  const accuracy = correctAttempts.length / total;
  const fluentAccuracy = fluent / total;
  const avgCorrectRtMs = correctAttempts.length
    ? correctAttempts.reduce((sum, a) => sum + a.durationMs, 0) / correctAttempts.length
    : undefined;

  const roundGood = accuracy >= JARDIM_ALVO_ROUND && fluentAccuracy >= JARDIM_ALVO_ROUND;
  const roundWeak = accuracy < JARDIM_LIMIAR_RECUO;

  let goodRounds = roundGood ? current.goodRounds + 1 : 0;
  let weakRounds = roundWeak ? current.weakRounds + 1 : 0;
  let currentStep = Math.min(JARDIM_MAX_DEGRAU, Math.max(1, current.currentStep));
  let highestStep = Math.min(JARDIM_MAX_DEGRAU, Math.max(current.highestStep, currentStep));
  let mastered = current.mastered;
  let outcome: JardimRoundOutcome = "hold";

  if (goodRounds >= 2) {
    if (currentStep < JARDIM_MAX_DEGRAU) {
      currentStep += 1;
      highestStep = Math.max(highestStep, currentStep);
      outcome = "advance";
    } else {
      mastered = true;
      outcome = "mastered";
    }
    goodRounds = 0;
    weakRounds = 0;
  } else if (weakRounds >= 2) {
    // Recuo invisível de treino: faixa/conquista não desce.
    if (currentStep > 1) {
      currentStep -= 1;
      outcome = "retreat";
    }
    weakRounds = 0;
    goodRounds = 0;
  }

  const historicalAvg = current.avgCorrectRtMs;
  const nextAvg = avgCorrectRtMs === undefined
    ? historicalAvg
    : historicalAvg === undefined
      ? avgCorrectRtMs
      : historicalAvg * 0.7 + avgCorrectRtMs * 0.3;

  const state: JardimTrackState = {
    ...current,
    unlocked: current.unlocked,
    mastered,
    family: "JD",
    currentStep,
    highestStep,
    goodRounds,
    weakRounds,
    rounds: current.rounds + 1,
    attempts: current.attempts + total,
    correct: current.correct + correctAttempts.length,
    ...(nextAvg === undefined ? {} : { avgCorrectRtMs: nextAvg }),
    ...(practiceDay ? { lastDay: practiceDay } : {}),
  };

  const misconceptions = [...new Set(
    attempts.filter(a => !a.right && a.misconception).map(a => a.misconception as string),
  )];

  return { state, accuracy, fluentAccuracy, avgCorrectRtMs, outcome, misconceptions };
}
