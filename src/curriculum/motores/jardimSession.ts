import { Composer } from "../Composer";
import { JARDIM, type TrilhaDoJardim } from "../fichas/dojo/jardim";
import type { DojoTrackState, JardimTrackState, Progress, Track } from "../../types";
import {
  freshJardimTrackState,
  jardimUnlocked,
  type JardimAttempt,
} from "./jardimEngine";

export const JARDIM_ROUND_ITENS = 8;

const VISUAL: Record<string, { icon: string; color: string; dark: string }> = {
  JD1: { icon: "👀", color: "#D1FAE5", dark: "#059669" },
  JD2: { icon: "🖐️", color: "#DBEAFE", dark: "#2563EB" },
  JD3: { icon: "🔟", color: "#EDE9FE", dark: "#7C3AED" },
  JD4: { icon: "👣", color: "#FCE7F3", dark: "#DB2777" },
  JD5: { icon: "🧠", color: "#FEF3C7", dark: "#D97706" },
};

export interface JardimMissionSummary {
  /** Acertos terminais usados só para recompensa gentil. */
  rewardedCorrect: number;
  /** Acertos de primeira usados para precisão/automaticidade. */
  measuredCorrect: number;
  total: number;
  stars: number;
  durationMs: number;
}

export interface TerminalAttemptInput {
  terminalRight: boolean;
  attemptCount: number;
  durationMs: number;
  targetRtMs: number;
  misconceptionTags?: string[];
}

/**
 * O Jardim mede a PRIMEIRA resposta cognitiva. Um erro real seguido de dica e
 * recuperação continua sendo erro na métrica de automaticidade; erro motor nem
 * chega a `recordQuestionAttempt`, logo não aumenta `attemptCount`.
 */
export function tentativaJardimDoTerminal(input: TerminalAttemptInput): JardimAttempt {
  return {
    right: input.terminalRight && input.attemptCount === 1,
    durationMs: input.durationMs,
    targetRtMs: input.targetRtMs,
    ...(input.misconceptionTags?.[0] ? { misconception: input.misconceptionTags[0] } : {}),
  };
}

export function jardimTrilhaPorId(id: string | undefined): TrilhaDoJardim | undefined {
  if (!id) return undefined;
  return JARDIM.find(item => item.ficha.id === id);
}

export function jardimTrack(trilha: TrilhaDoJardim): Track {
  for (let lvl = 1; lvl <= 5; lvl += 1) {
    const alvo = trilha.ficha.niveis[lvl]?.rt_alvo;
    if (!Number.isFinite(alvo) || (alvo as number) <= 0) {
      throw new Error(`${trilha.ficha.id} nivel ${lvl} nao tem rt_alvo valido para o Jardim.`);
    }
  }
  const visual = VISUAL[trilha.ficha.id] ?? { icon: "🌱", color: "#DCFCE7", dark: "#16A34A" };
  return {
    id: trilha.ficha.id,
    name: trilha.ficha.nome,
    ...visual,
    totalQ: JARDIM_ROUND_ITENS,
    contentStatus: "explicit",
    gen: lvl => Composer.generate(trilha.ficha, Math.min(5, Math.max(1, Math.round(lvl)))),
  };
}

/**
 * `unlocked` salvo é cache/apresentação, nunca autoridade. A mãe decide toda
 * vez; um save corrompido não abre treino antes do conceito.
 */
export function resolveJardimState(
  trilha: TrilhaDoJardim,
  motherProgress: Progress | undefined,
  saved?: DojoTrackState,
): JardimTrackState {
  const base = freshJardimTrackState(jardimUnlocked(trilha, motherProgress));
  const currentStep = Math.min(5, Math.max(1, saved?.currentStep ?? base.currentStep));
  const highestStep = Math.min(5, Math.max(currentStep, saved?.highestStep ?? currentStep));
  return {
    ...base,
    ...saved,
    unlocked: jardimUnlocked(trilha, motherProgress),
    mastered: saved?.mastered === true,
    family: "JD",
    currentStep,
    highestStep,
    goodRounds: Math.max(0, saved?.goodRounds ?? 0),
    weakRounds: Math.max(0, saved?.weakRounds ?? 0),
    rounds: Math.max(0, saved?.rounds ?? 0),
    attempts: Math.max(0, saved?.attempts ?? 0),
    correct: Math.max(0, saved?.correct ?? 0),
  };
}

/**
 * Projeção SOMENTE para a casca do GameLoop. Nunca deve ser gravada em
 * `state.progress`: JD não é nó do currículo.
 */
export function jardimProgressProjection(state: JardimTrackState): Progress {
  return {
    lvl: state.currentStep,
    maxLvl: state.highestStep,
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
