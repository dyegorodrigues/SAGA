export type CreatureMood = 'curioso' | 'feliz' | 'sonolento' | 'confiante';

export interface CreatureState {
  readonly id: string;
  readonly name: string;
  readonly level: number;
  readonly xp: number;
  readonly care: number;
  readonly mood: CreatureMood;
}

export interface LearningSignal {
  readonly correct: boolean;
  readonly attempts: number;
  readonly streak: number;
}

const XP_PER_LEVEL = 100;

export function createCreature(id: string, name: string): CreatureState {
  return { id, name, level: 1, xp: 0, care: 70, mood: 'curioso' };
}

export function applyLearningSignal(creature: CreatureState, signal: LearningSignal): CreatureState {
  const safeAttempts = Math.max(1, signal.attempts);
  const earnedXp = signal.correct ? 20 + Math.min(signal.streak, 5) * 4 : 6;
  const careDelta = signal.correct ? 8 : Math.max(2, 7 - safeAttempts);
  const totalXp = creature.xp + earnedXp;
  const levelGain = Math.floor(totalXp / XP_PER_LEVEL);
  const nextLevel = creature.level + levelGain;
  const nextXp = totalXp % XP_PER_LEVEL;
  const nextCare = clamp(creature.care + careDelta, 0, 100);

  return {
    ...creature,
    level: nextLevel,
    xp: nextXp,
    care: nextCare,
    mood: selectMood(nextCare, signal, levelGain > 0),
  };
}

export function selectMood(care: number, signal: LearningSignal, evolved: boolean): CreatureMood {
  if (evolved || signal.streak >= 3) return 'confiante';
  if (care >= 80 || signal.correct) return 'feliz';
  if (care < 35) return 'sonolento';
  return 'curioso';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
