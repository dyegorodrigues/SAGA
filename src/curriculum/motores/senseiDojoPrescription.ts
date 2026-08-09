import type { DojoTrackState, Progress, Track } from "../../types";
import {
  SENSEI_DOJO_TEMPLES,
  resolveSenseiDojoState,
  senseiDojoTrack,
  type SenseiDojoTemple,
} from "./senseiDojoSession";

export type SenseiDojoPrescriptionReason = "weak-items" | "fluency-gap" | "refresh" | "newly-unlocked";

export interface SenseiDojoPrescription {
  temple: SenseiDojoTemple;
  track: Track;
  step: number;
  maxEligibleStep: number;
  reason: SenseiDojoPrescriptionReason;
  reasonText: string;
  weakItems: number;
  daysSincePractice?: number;
}

function dayDistance(from: string | undefined, to: string): number | undefined {
  if (!from) return undefined;
  const a = Date.parse(`${from}T00:00:00Z`);
  const b = Date.parse(`${to}T00:00:00Z`);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return undefined;
  return Math.max(0, Math.floor((b - a) / 86400000));
}

function weakItemCount(state: DojoTrackState): number {
  const facts = Object.values(state.facts ?? {});
  const procs = Object.values(state.procs ?? {});
  return facts.filter(item => item.forca <= 1 || item.erros_seguidos >= 2).length
    + procs.filter(item => item.forca <= 1 || item.erros_seguidos >= 2).length;
}

function candidate(
  temple: SenseiDojoTemple,
  progressByNode: Record<string, Progress>,
  dojoTracks: Record<string, DojoTrackState>,
  today: string,
): { prescription: SenseiDojoPrescription; score: number } | null {
  const { state, maxEligibleStep } = resolveSenseiDojoState(temple, progressByNode, dojoTracks[temple.id]);
  if (maxEligibleStep < 1) return null;

  const weakItems = weakItemCount(state);
  const currentStep = Math.min(maxEligibleStep, Math.max(1, state.currentStep ?? 1));
  const lag = Math.max(0, maxEligibleStep - currentStep);
  const days = dayDistance(state.lastDay, today);
  const practicedToday = state.lastDay === today;
  if (practicedToday) return null;

  if (weakItems > 0) {
    return {
      score: 400 + weakItems * 10 + lag,
      prescription: {
        temple,
        track: senseiDojoTrack(temple),
        step: currentStep,
        maxEligibleStep,
        reason: "weak-items",
        reasonText: `${weakItems} ${weakItems === 1 ? "fato ainda precisa" : "fatos ainda precisam"} ficar mais firme${weakItems === 1 ? "" : "s"}.`,
        weakItems,
        daysSincePractice: days,
      },
    };
  }

  if (lag > 0) {
    return {
      score: 300 + lag * 10,
      prescription: {
        temple,
        track: senseiDojoTrack(temple),
        step: currentStep,
        maxEligibleStep,
        reason: "fluency-gap",
        reasonText: `Você já entende até a faixa ${maxEligibleStep}; vamos deixar a faixa ${currentStep} automática.`,
        weakItems: 0,
        daysSincePractice: days,
      },
    };
  }

  if ((state.rounds ?? 0) === 0) {
    return {
      score: 250,
      prescription: {
        temple,
        track: senseiDojoTrack(temple),
        step: currentStep,
        maxEligibleStep,
        reason: "newly-unlocked",
        reasonText: "Este treino acabou de ficar seguro para o que você já aprendeu.",
        weakItems: 0,
        daysSincePractice: days,
      },
    };
  }

  // Revisão de fluência é deliberadamente esparsa. Antes de 4 dias, o Sensei
  // não ocupa a rota principal só para repetir velocidade já estável.
  if (days !== undefined && days >= 4) {
    return {
      score: 100 + Math.min(days, 30),
      prescription: {
        temple,
        track: senseiDojoTrack(temple),
        step: currentStep,
        maxEligibleStep,
        reason: "refresh",
        reasonText: `Faz ${days} dias desde este treino; um round curto mantém o reflexo vivo.`,
        weakItems: 0,
        daysSincePractice: days,
      },
    };
  }

  return null;
}

/**
 * Escolhe no máximo UM templo por missão do Sensei.
 *
 * Ordem emergente do score:
 * 1. itens fracos observados;
 * 2. conhecimento conceitual à frente da automaticidade;
 * 3. templo recém-liberado;
 * 4. refresco espaçado.
 *
 * Empate é estável pela ordem dos templos; não há sorteio.
 */
export function prescribeSenseiDojo(
  progressByNode: Record<string, Progress>,
  dojoTracks: Record<string, DojoTrackState> = {},
  today: string,
): SenseiDojoPrescription | null {
  return SENSEI_DOJO_TEMPLES
    .map(temple => candidate(temple, progressByNode, dojoTracks, today))
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => b.score - a.score)[0]?.prescription ?? null;
}
