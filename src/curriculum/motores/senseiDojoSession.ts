import type { DojoTrackState, Progress, Question, Track } from "../../types";
import { dojo_add } from "../fichas/dojo/sensei/dojo_add";
import { dojo_sub } from "../fichas/dojo/sensei/dojo_sub";
import { dojo_mul } from "../fichas/dojo/sensei/dojo_mul";
import { dojo_div } from "../fichas/dojo/sensei/dojo_div";
import { freshSenseiDojoState, SENSEI_DOJO_ROUND_ITENS, type SenseiDojoAttempt } from "./senseiDojoEngine";
import {
  SENSEI_DOJO_LEVEL_POLICIES,
  maxEligibleSenseiDojoStepById,
  senseiDojoMeta,
  stampSenseiDojoSessionSource,
  type SenseiDojoSessionSource,
  type SenseiDojoTempleId,
} from "./senseiDojoPolicy";

export interface SenseiDojoTemple {
  id: SenseiDojoTempleId;
  track: Track;
  levels: typeof SENSEI_DOJO_LEVEL_POLICIES[SenseiDojoTempleId];
}

/**
 * Política conservadora V1: o templo nunca corre na frente do conceito.
 * Alguns níveis históricos ainda não estão em ordem ótima de complexidade;
 * reordená-los é um lote pedagógico separado, sem abrir treino inseguro agora.
 */
export const SENSEI_DOJO_TEMPLES: SenseiDojoTemple[] = [
  { id: "dojo_add", track: dojo_add, levels: SENSEI_DOJO_LEVEL_POLICIES.dojo_add },
  { id: "dojo_sub", track: dojo_sub, levels: SENSEI_DOJO_LEVEL_POLICIES.dojo_sub },
  { id: "dojo_mul", track: dojo_mul, levels: SENSEI_DOJO_LEVEL_POLICIES.dojo_mul },
  { id: "dojo_div", track: dojo_div, levels: SENSEI_DOJO_LEVEL_POLICIES.dojo_div },
];

const TEMPLE_BY_ID = new Map(SENSEI_DOJO_TEMPLES.map(temple => [temple.id, temple] as const));

export function maxEligibleSenseiDojoStep(
  temple: SenseiDojoTemple,
  progressByNode: Record<string, Progress>,
): number {
  return maxEligibleSenseiDojoStepById(temple.id, progressByNode);
}

export function senseiDojoTempleById(id: string | undefined): SenseiDojoTemple | undefined {
  if (!id) return undefined;
  return TEMPLE_BY_ID.get(id as SenseiDojoTempleId);
}

/**
 * Materializa uma sessão com origem explícita. A porta crua dos templos é
 * manual; o Sensei deve pedir `prescribed` quando transformar uma prescrição em
 * missão. A origem viaja dentro de cada questão e chega até a persistência.
 */
export function senseiDojoTrack(
  temple: SenseiDojoTemple,
  source: SenseiDojoSessionSource = "manual",
): Track {
  return {
    ...temple.track,
    totalQ: SENSEI_DOJO_ROUND_ITENS,
    gen: rawStep => stampSenseiDojoSessionSource(temple.track.gen(rawStep), source),
  };
}

export function resolveSenseiDojoState(
  temple: SenseiDojoTemple,
  progressByNode: Record<string, Progress>,
  saved?: DojoTrackState,
): { state: DojoTrackState; maxEligibleStep: number } {
  const ceiling = maxEligibleSenseiDojoStep(temple, progressByNode);
  const base = freshSenseiDojoState(ceiling >= 1);
  if (ceiling < 1) return { state: base, maxEligibleStep: 0 };

  const currentStep = Math.min(ceiling, Math.max(1, saved?.currentStep ?? 1));
  const highestStep = Math.min(10, Math.max(currentStep, saved?.highestStep ?? currentStep));
  return {
    maxEligibleStep: ceiling,
    state: {
      ...base,
      ...saved,
      unlocked: true,
      mastered: saved?.mastered === true && ceiling >= 10,
      currentStep,
      highestStep,
      goodRounds: Math.max(0, saved?.goodRounds ?? 0),
      weakRounds: Math.max(0, saved?.weakRounds ?? 0),
      rounds: Math.max(0, saved?.rounds ?? 0),
      attempts: Math.max(0, saved?.attempts ?? 0),
      correct: Math.max(0, saved?.correct ?? 0),
      facts: { ...(saved?.facts ?? {}) },
      procs: { ...(saved?.procs ?? {}) },
    },
  };
}

/** Projeção exclusiva para a casca visual do GameLoop; nunca entra em state.progress. */
export function senseiDojoProgressProjection(state: DojoTrackState, servedStep?: number): Progress {
  const lvl = servedStep ?? state.currentStep ?? 1;
  return {
    lvl,
    maxLvl: state.highestStep ?? lvl,
    dom: false,
    streak: 0,
    bad: 0,
    stars: 0,
    ok: 0,
    tot: 0,
    bank: [],
    mast: 0,
    ...(state.lastDay ? { lastDay: state.lastDay } : {}),
    ...(state.avgCorrectRtMs !== undefined ? { rt: Math.round(state.avgCorrectRtMs) } : {}),
  };
}

export function tentativaSenseiDojoDoTerminal(input: {
  question: Question;
  terminalRight: boolean;
  attemptCount: number;
  durationMs: number;
}): SenseiDojoAttempt {
  const meta = senseiDojoMeta(input.question);
  if (!meta) throw new Error("Questão do Dojo Sensei sem metadado de fluência.");
  const targetRtMs = (input.question.rt_max_s ?? 0) * 1000;
  if (!Number.isFinite(targetRtMs) || targetRtMs <= 0) throw new Error("Questão do Dojo Sensei sem RT válido.");
  return {
    right: input.terminalRight && input.attemptCount === 1,
    durationMs: input.durationMs,
    targetRtMs,
    itemId: meta.itemId,
    itemKind: meta.itemKind,
  };
}
