import { describe, expect, it } from "vitest";
import {
  missionCoins,
  missionXp,
  perfectMissionXpBonus,
  rewardForMissionCompletion,
  rewardForTerminalAnswer,
} from "./rewardPolicy";
import { sagaPlayerLevel, sagaLevelThresholdXp } from "./gamificationProgress";

const daysToLevel100 = (missionsPerDay: number, correctPerMission = 8, totalPerMission = 8) => {
  const dailyXp = missionXp(correctPerMission, totalPerMission) * missionsPerDay;
  return Math.ceil(sagaLevelThresholdXp(100) / dailyXp);
};

const dailyCoins = (missionsPerDay: number, correctPerMission = 8) => {
  if (missionsPerDay <= 0) return 0;
  return missionCoins(correctPerMission, "journey", true)
    + Math.max(0, missionsPerDay - 1) * missionCoins(correctPerMission, "journey", false);
};

describe("Política de recompensa — esforço válido sem pressão de velocidade", () => {
  it("acerto lento e acerto rápido têm o mesmo XP de perfil", () => {
    expect(rewardForTerminalAnswer(true, "journey").xp).toBe(1);
    expect(rewardForTerminalAnswer(true, "dojo").xp).toBe(1);
    expect(rewardForTerminalAnswer(true, "garden").xp).toBe(1);
  });

  it("erro terminal não paga XP nem moeda", () => {
    expect(rewardForTerminalAnswer(false, "journey")).toEqual({ xp: 0, coins: 0 });
    expect(rewardForTerminalAnswer(false, "dojo")).toEqual({ xp: 0, coins: 0 });
  });

  it("Misto dobra moeda, nunca XP", () => {
    expect(rewardForTerminalAnswer(true, "mixed")).toEqual({ xp: 1, coins: 2 });
    expect(rewardForTerminalAnswer(true, "journey")).toEqual({ xp: 1, coins: 1 });
    expect(missionCoins(10, "mixed", false)).toBe(26);
    expect(missionCoins(10, "journey", false)).toBe(13);
  });

  it("bônus perfeito recompensa precisão e só ocorre em missão realmente perfeita", () => {
    expect(perfectMissionXpBonus(8, 8)).toBe(5);
    expect(perfectMissionXpBonus(7, 8)).toBe(0);
    expect(perfectMissionXpBonus(0, 0)).toBe(0);
    expect(missionXp(8, 8)).toBe(13);
  });

  it("primeira missão do dia acelera moeda sem punir quem faltou", () => {
    expect(rewardForMissionCompletion("journey", true)).toEqual({ xp: 0, coins: 8, freeFood: 1 });
    expect(rewardForMissionCompletion("journey", false)).toEqual({ xp: 0, coins: 3, freeFood: 0 });
    expect(rewardForMissionCompletion("mixed", true)).toEqual({ xp: 0, coins: 16, freeFood: 1 });
    expect(missionCoins(8, "journey", true)).toBe(16);
    expect(missionCoins(8, "journey", false)).toBe(11);
  });
});

describe("Simulação econômica longitudinal — Nível SAGA", () => {
  it("1 missão perfeita/dia mantém o nível 100 na ordem de um ano", () => {
    const days = daysToLevel100(1);
    expect(days).toBeGreaterThanOrEqual(300);
    expect(days).toBeLessThanOrEqual(380);
    expect(sagaPlayerLevel(missionXp(8, 8) * 30)).toBeGreaterThan(10);
    expect(sagaPlayerLevel(missionXp(8, 8) * 30)).toBeLessThan(30);
  });

  it("atividade voluntária extra acelera de modo aproximadamente proporcional", () => {
    const one = daysToLevel100(1);
    const two = daysToLevel100(2);
    const three = daysToLevel100(3);
    expect(one).toBe(340);
    expect(two).toBe(170);
    expect(three).toBe(114);
  });

  it("errar parte da missão desacelera apenas a meta-progressão, sem saldo negativo", () => {
    expect(missionXp(4, 8)).toBe(4);
    expect(missionXp(0, 8)).toBe(0);
    expect(rewardForTerminalAnswer(false, "journey").coins).toBe(0);
  });

  it("moeda cresce de modo previsível em 30/90 dias e atividade extra acelera sem multiplicador oculto", () => {
    expect(dailyCoins(1)).toBe(16);
    expect(dailyCoins(2)).toBe(27);
    expect(dailyCoins(3)).toBe(38);
    expect(dailyCoins(1) * 30).toBe(480);
    expect(dailyCoins(1) * 90).toBe(1_440);
    expect(dailyCoins(2) * 30).toBe(810);
    expect(dailyCoins(3) * 30).toBe(1_140);
  });
});
