import { describe, expect, it } from "vitest";
import type { Progress } from "../../types";
import { JARDIM } from "../fichas/dojo/jardim";
import {
  applyJardimRound,
  freshJardimTrackState,
  jardimUnlocked,
  type JardimAttempt,
} from "./jardimEngine";

const round = (
  correct: number,
  fluent: number,
  total = 10,
  misconception = "ERRO_CONCEITUAL",
): JardimAttempt[] => Array.from({ length: total }, (_, index) => ({
  right: index < correct,
  durationMs: index < fluent ? 1500 : 5000,
  targetRtMs: 2000,
  ...(index >= correct ? { misconception } : {}),
}));

const progress = (lvl: number, maxLvl = lvl, dom = false): Progress => ({
  lvl, maxLvl, dom,
  streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0,
});

describe("P8 — motor puro do Jardim do Dojo", () => {
  it("desbloqueia pela mãe e pelo maior nível já conquistado, nunca por estrela", () => {
    for (const trilha of JARDIM) {
      expect(jardimUnlocked(trilha, undefined)).toBe(false);
      expect(jardimUnlocked(trilha, { ...progress(2), stars: 999 })).toBe(false);
      expect(jardimUnlocked(trilha, progress(3))).toBe(true);
      expect(jardimUnlocked(trilha, progress(1, 3))).toBe(true);
      expect(jardimUnlocked(trilha, progress(1, 1, true))).toBe(true);
    }
  });

  it("dois rounds >=80% corretos E fluidos avançam um degrau", () => {
    let state = freshJardimTrackState(true);
    let result = applyJardimRound(state, round(8, 8));
    expect(result.outcome).toBe("hold");
    state = result.state;
    result = applyJardimRound(state, round(9, 8));
    expect(result.outcome).toBe("advance");
    expect(result.state.currentStep).toBe(2);
    expect(result.state.highestStep).toBe(2);
  });

  it("acerto lento preserva precisão, mas não promove automaticidade", () => {
    let state = freshJardimTrackState(true);
    const slow = round(10, 4);
    let result = applyJardimRound(state, slow);
    expect(result.accuracy).toBe(1);
    expect(result.fluentAccuracy).toBe(0.4);
    expect(result.misconceptions).toEqual([]);
    state = result.state;
    result = applyJardimRound(state, slow);
    expect(result.outcome).toBe("hold");
    expect(result.state.currentStep).toBe(1);
    expect(result.state.goodRounds).toBe(0);
  });

  it("dois rounds abaixo de 60% recuam o treino, mas nunca a conquista", () => {
    let state = { ...freshJardimTrackState(true), currentStep: 4, highestStep: 5 };
    state = applyJardimRound(state, round(5, 5)).state;
    const result = applyJardimRound(state, round(4, 4));
    expect(result.outcome).toBe("retreat");
    expect(result.state.currentStep).toBe(3);
    expect(result.state.highestStep).toBe(5);
  });

  it("duas provas fluentes no topo consolidam domínio sem tornar lentidão um erro", () => {
    let state = { ...freshJardimTrackState(true), currentStep: 5, highestStep: 5 };
    state = applyJardimRound(state, round(9, 9), "2026-08-08").state;
    const result = applyJardimRound(state, round(8, 8), "2026-08-08");
    expect(result.outcome).toBe("mastered");
    expect(result.state.mastered).toBe(true);
    expect(result.state.highestStep).toBe(5);
    expect(result.state.lastDay).toBe("2026-08-08");
  });

  it("só agrega misconception de resposta errada", () => {
    const attempts = round(8, 3);
    const result = applyJardimRound(freshJardimTrackState(true), attempts);
    expect(result.misconceptions).toEqual(["ERRO_CONCEITUAL"]);
    expect(result.misconceptions).not.toContain("LENTO_DEDOS");
  });

  it("recusa round fora do contrato de 6–10 itens e rt_alvo inválido", () => {
    expect(() => applyJardimRound(freshJardimTrackState(), round(5, 5, 5))).toThrow(/6-10/);
    expect(() => applyJardimRound(freshJardimTrackState(), round(10, 10, 11))).toThrow(/6-10/);
    const invalid = round(6, 6, 6);
    invalid[0].targetRtMs = 0;
    expect(() => applyJardimRound(freshJardimTrackState(), invalid)).toThrow(/rt_alvo/);
  });
});
