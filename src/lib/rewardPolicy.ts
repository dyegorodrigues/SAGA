export type RewardMode = "journey" | "dojo" | "garden" | "mixed" | "placement" | "rescue";

export interface AnswerReward {
  xp: number;
  coins: number;
}

export interface MissionReward {
  xp: number;
  coins: number;
  freeFood: number;
}

/**
 * Contrato econômico V1: uma resposta terminal correta vale o mesmo XP base em
 * qualquer modalidade. Fluência continua sendo medida e recompensada dentro do
 * Dojo (força/faixa/insígnias), mas velocidade não multiplica identidade do
 * perfil. Criança lenta e correta não recebe menos meta-progressão.
 */
export function rewardForTerminalAnswer(right: boolean, mode: RewardMode): AnswerReward {
  if (!right) return { xp: 0, coins: 0 };
  const coinMultiplier = mode === "mixed" ? 2 : 1;
  return { xp: 1, coins: coinMultiplier };
}

/** Missão perfeita celebra precisão, não velocidade. */
export function perfectMissionXpBonus(correct: number, total: number): number {
  return total > 0 && correct === total ? 5 : 0;
}

/**
 * Bônus de fechamento. A primeira missão do dia ganha uma aceleração pequena e
 * uma ração; não depende de streak e não pune ausência.
 */
export function rewardForMissionCompletion(mode: RewardMode, firstMissionToday: boolean): MissionReward {
  const coinMultiplier = mode === "mixed" ? 2 : 1;
  return {
    xp: 0,
    coins: (3 + (firstMissionToday ? 5 : 0)) * coinMultiplier,
    freeFood: firstMissionToday ? 1 : 0,
  };
}

export function missionXp(correct: number, total: number): number {
  return Math.max(0, correct) + perfectMissionXpBonus(correct, total);
}
