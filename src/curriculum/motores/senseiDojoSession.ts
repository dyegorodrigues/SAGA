import type { DojoTrackState, Progress, Question, Track } from "../../types";
import { dojo_add } from "../fichas/dojo/sensei/dojo_add";
import { dojo_sub } from "../fichas/dojo/sensei/dojo_sub";
import { dojo_mul } from "../fichas/dojo/sensei/dojo_mul";
import { dojo_div } from "../fichas/dojo/sensei/dojo_div";
import {
  freshSenseiDojoState,
  SENSEI_DOJO_MAX_STEP,
  SENSEI_DOJO_ROUND_ITENS,
  type FluencyItemKind,
  type SenseiDojoAttempt,
} from "./senseiDojoEngine";

export interface SenseiDojoLevelPolicy {
  /** Conceitos que precisam ter chegado ao limiar de unlock antes desta faixa. */
  requires: string[];
  /** Fato recuperável ou procedimento multi-etapas/valor-posicional. */
  itemKind: FluencyItemKind;
}

export interface SenseiDojoTemple {
  id: "dojo_add" | "dojo_sub" | "dojo_mul" | "dojo_div";
  track: Track;
  levels: Record<number, SenseiDojoLevelPolicy>;
}

/**
 * Política conservadora V1: o templo nunca corre na frente do conceito.
 *
 * Alguns níveis históricos dos quatro geradores ainda não estão em ordem ótima
 * de complexidade (por exemplo, fatos de ×5 aparecem depois de ×3/×4). Por isso
 * o teto é deliberadamente seguro. Reordenar a taxonomia dos 10 níveis é lote
 * pedagógico separado; não abrimos treino cedo só para preservar numeração antiga.
 */
export const SENSEI_DOJO_TEMPLES: SenseiDojoTemple[] = [
  {
    id: "dojo_add",
    track: dojo_add,
    levels: {
      1: { requires: ["N3.01"], itemKind: "fact" },
      2: { requires: ["N3.01"], itemKind: "fact" },
      3: { requires: ["N1.11"], itemKind: "fact" },
      4: { requires: ["N3.07"], itemKind: "fact" },
      5: { requires: ["N2.01", "N3.01"], itemKind: "procedure" },
      6: { requires: ["N3.09"], itemKind: "procedure" },
      7: { requires: ["N3.11"], itemKind: "procedure" },
      8: { requires: ["N3.09"], itemKind: "procedure" },
      9: { requires: ["N3.09"], itemKind: "procedure" },
      10: { requires: ["N3.11"], itemKind: "procedure" },
    },
  },
  {
    id: "dojo_sub",
    track: dojo_sub,
    levels: {
      1: { requires: ["N3.02"], itemKind: "fact" },
      2: { requires: ["N3.02"], itemKind: "fact" },
      3: { requires: ["N3.05"], itemKind: "fact" },
      4: { requires: ["N3.08"], itemKind: "fact" },
      5: { requires: ["N3.08", "N2.01"], itemKind: "procedure" },
      6: { requires: ["N3.09"], itemKind: "procedure" },
      7: { requires: ["N3.12"], itemKind: "procedure" },
      8: { requires: ["N3.09"], itemKind: "procedure" },
      9: { requires: ["N3.09"], itemKind: "procedure" },
      10: { requires: ["N3.12"], itemKind: "procedure" },
    },
  },
  {
    id: "dojo_mul",
    track: dojo_mul,
    levels: {
      1: { requires: ["N4.03"], itemKind: "fact" },
      2: { requires: ["N4.04"], itemKind: "fact" },
      3: { requires: ["N4.04"], itemKind: "fact" },
      4: { requires: ["N4.03"], itemKind: "fact" },
      5: { requires: ["N4.04"], itemKind: "fact" },
      6: { requires: ["N4.07"], itemKind: "fact" },
      7: { requires: ["N4.07"], itemKind: "fact" },
      8: { requires: ["N4.07"], itemKind: "fact" },
      9: { requires: ["N4.07"], itemKind: "fact" },
      10: { requires: ["N4.08"], itemKind: "procedure" },
    },
  },
  {
    id: "dojo_div",
    track: dojo_div,
    levels: {
      1: { requires: ["N4.05", "N4.06", "N4.03"], itemKind: "fact" },
      2: { requires: ["N4.05", "N4.06", "N4.04"], itemKind: "fact" },
      3: { requires: ["N4.05", "N4.06", "N4.04"], itemKind: "fact" },
      4: { requires: ["N4.05", "N4.06", "N4.03"], itemKind: "fact" },
      5: { requires: ["N4.05", "N4.06", "N4.04"], itemKind: "fact" },
      6: { requires: ["N4.06", "N4.07"], itemKind: "fact" },
      7: { requires: ["N4.06", "N4.07"], itemKind: "fact" },
      8: { requires: ["N4.06", "N4.07"], itemKind: "fact" },
      9: { requires: ["N4.06", "N4.07"], itemKind: "fact" },
      10: { requires: ["N4.06", "N2.04"], itemKind: "procedure" },
    },
  },
];

const TEMPLE_BY_ID = new Map(SENSEI_DOJO_TEMPLES.map(temple => [temple.id, temple] as const));

const conceptLevel = (progress?: Progress): number => progress?.dom
  ? 5
  : Math.max(progress?.maxLvl ?? 0, progress?.lvl ?? 0);

const ready = (id: string, progressByNode: Record<string, Progress>): boolean =>
  conceptLevel(progressByNode[id]) >= 3;

/** Maior faixa CONTÍGUA pedagogicamente segura. */
export function maxEligibleSenseiDojoStep(
  temple: SenseiDojoTemple,
  progressByNode: Record<string, Progress>,
): number {
  let ceiling = 0;
  for (let step = 1; step <= SENSEI_DOJO_MAX_STEP; step += 1) {
    const policy = temple.levels[step];
    if (!policy || !policy.requires.every(id => ready(id, progressByNode))) break;
    ceiling = step;
  }
  return ceiling;
}

export function senseiDojoTempleById(id: string | undefined): SenseiDojoTemple | undefined {
  if (!id) return undefined;
  return TEMPLE_BY_ID.get(id as SenseiDojoTemple["id"]);
}

function normalizeFact(templeId: SenseiDojoTemple["id"], expr: string | undefined): string {
  const values = (expr ?? "").match(/\d+/g)?.map(Number) ?? [];
  const [a, b] = values;
  if (!Number.isFinite(a) || !Number.isFinite(b)) return `${templeId}:${expr ?? "unknown"}`;
  if (templeId === "dojo_add" || templeId === "dojo_mul") {
    const [lo, hi] = [a, b].sort((x, y) => x - y);
    return `${templeId}:${lo}:${hi}`;
  }
  return `${templeId}:${a}:${b}`;
}

export type SenseiDojoQuestion = Question & {
  uiProps?: Question["uiProps"] & {
    fluency?: {
      templeId: SenseiDojoTemple["id"];
      step: number;
      itemId: string;
      itemKind: FluencyItemKind;
    };
  };
};

export function senseiDojoTrack(temple: SenseiDojoTemple): Track {
  return {
    ...temple.track,
    totalQ: SENSEI_DOJO_ROUND_ITENS,
    gen: rawStep => {
      const step = Math.min(SENSEI_DOJO_MAX_STEP, Math.max(1, Math.round(rawStep)));
      const policy = temple.levels[step];
      if (!policy) throw new Error(`${temple.id} sem política para faixa ${step}.`);
      const question = temple.track.gen(step);
      if (!Number.isFinite(question.rt_max_s) || (question.rt_max_s as number) <= 0) {
        throw new Error(`${temple.id} faixa ${step} sem rt_max_s válido.`);
      }
      const itemId = policy.itemKind === "fact"
        ? normalizeFact(temple.id, question.expr)
        : `${temple.id}:L${step}`;
      return {
        ...question,
        uiProps: {
          ...(question.uiProps ?? {}),
          fluency: { templeId: temple.id, step, itemId, itemKind: policy.itemKind },
        },
      } as SenseiDojoQuestion;
    },
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
  const highestStep = Math.min(SENSEI_DOJO_MAX_STEP, Math.max(currentStep, saved?.highestStep ?? currentStep));
  return {
    maxEligibleStep: ceiling,
    state: {
      ...base,
      ...saved,
      unlocked: true,
      mastered: saved?.mastered === true && ceiling >= SENSEI_DOJO_MAX_STEP,
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
  const meta = (input.question as SenseiDojoQuestion).uiProps?.fluency;
  if (!meta) throw new Error("Questão do Dojo Sensei sem metadado de fluência.");
  const targetRtMs = (input.question.rt_max_s ?? 0) * 1000;
  if (!Number.isFinite(targetRtMs) || targetRtMs <= 0) throw new Error("Questão do Dojo Sensei sem RT válido.");
  return {
    // Tal como no Jardim, recuperação após erro conta para recompensa, não para fluência.
    right: input.terminalRight && input.attemptCount === 1,
    durationMs: input.durationMs,
    targetRtMs,
    itemId: meta.itemId,
    itemKind: meta.itemKind,
  };
}
