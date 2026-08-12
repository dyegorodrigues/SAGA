import type { DojoTrackState, State } from "../types";
import { missionXp, perfectMissionXpBonus, rewardForTerminalAnswer } from "./rewardPolicy";

/**
 * XP de fluência é meta-progressão, não autoridade pedagógica. Mantemos o campo
 * junto do estado do Dojo/Jardim para ele sobreviver à remoção obrigatória dos
 * envelopes `progress.dojo_*`, sem criar um Progress curricular falso.
 */
export type XpBearingDojoTrackState = DojoTrackState & { xpStars?: number };

export function dojoTrackXp(state: DojoTrackState | undefined): number {
  const raw = (state as XpBearingDojoTrackState | undefined)?.xpStars ?? 0;
  return Number.isFinite(raw) ? Math.max(0, raw) : 0;
}

/**
 * Fonte de leitura única do XP vitalício do perfil.
 *
 * - Jornada/conceito: `progress.*.stars` (legado ainda em produção);
 * - fluência: `dojoTracks.*.xpStars`.
 *
 * O total é apenas identidade/meta-jogo. Nunca deve alimentar mastery/unlock.
 */
export function getKidLifetimeXp(kidId: string, state: State): number {
  const conceptual = Object.values(state.progress?.[kidId] ?? {})
    .reduce((sum, progress) => sum + Math.max(0, progress.stars || 0), 0);
  const fluency = Object.values(state.dojoTracks?.[kidId] ?? {})
    .reduce((sum, dojoState) => sum + dojoTrackXp(dojoState), 0);
  return conceptual + fluency;
}

/**
 * Compatibilidade do boundary do Dojo: velocidade continua alimentando a força
 * de fluência, mas todo acerto terminal vale 1 XP de perfil.
 */
export function currentDojoAnswerXp(right: boolean, _durationMs: number): number {
  return rewardForTerminalAnswer(right, "dojo").xp;
}

export { perfectMissionXpBonus };

/** Jardim usa a mesma identidade econômica das outras modalidades. */
export function currentGardenRoundXp(correct: number, total: number): number {
  return missionXp(correct, total);
}

/**
 * Nível SAGA pertence à criança/perfil, não ao mascote.
 *
 * Curva inicial calibrável: XP acumulado necessário para ENTRAR no nível.
 * n = nível-1; threshold = 10n + 0,35n².
 *
 * Isso dá movimento cedo e alonga o meio/fim sem transformar nível em medida de
 * capacidade matemática. O nível 100 fica em ~4,4k XP e deve ser recalibrado
 * depois com telemetria longitudinal real.
 */
export function sagaLevelThresholdXp(level: number): number {
  const clamped = Math.min(100, Math.max(1, Math.floor(level)));
  const n = clamped - 1;
  return Math.round(10 * n + 0.35 * n * n);
}

export function sagaPlayerLevel(lifetimeXp: number): number {
  const xp = Math.max(0, Math.floor(Number.isFinite(lifetimeXp) ? lifetimeXp : 0));
  for (let level = 100; level >= 1; level -= 1) {
    if (xp >= sagaLevelThresholdXp(level)) return level;
  }
  return 1;
}

export interface SagaLevelProgress {
  level: number;
  xp: number;
  currentThreshold: number;
  nextThreshold: number | null;
  xpIntoLevel: number;
  xpForNextLevel: number | null;
  progress01: number;
}

export function sagaLevelProgress(lifetimeXp: number): SagaLevelProgress {
  const xp = Math.max(0, Math.floor(Number.isFinite(lifetimeXp) ? lifetimeXp : 0));
  const level = sagaPlayerLevel(xp);
  const currentThreshold = sagaLevelThresholdXp(level);
  if (level >= 100) {
    return {
      level,
      xp,
      currentThreshold,
      nextThreshold: null,
      xpIntoLevel: Math.max(0, xp - currentThreshold),
      xpForNextLevel: null,
      progress01: 1,
    };
  }
  const nextThreshold = sagaLevelThresholdXp(level + 1);
  const span = Math.max(1, nextThreshold - currentThreshold);
  const xpIntoLevel = Math.max(0, xp - currentThreshold);
  return {
    level,
    xp,
    currentThreshold,
    nextThreshold,
    xpIntoLevel,
    xpForNextLevel: Math.max(0, nextThreshold - xp),
    progress01: Math.min(1, xpIntoLevel / span),
  };
}
