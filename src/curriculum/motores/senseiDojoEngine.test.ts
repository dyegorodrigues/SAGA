import { describe, expect, it } from "vitest";
import type { DojoTrackState } from "../../types";
import {
  applySenseiDojoRound,
  freshSenseiDojoState,
  SENSEI_DOJO_ROUND_ITENS,
  type SenseiDojoAttempt,
} from "./senseiDojoEngine";

const attempts = (
  right: number,
  fluent: number,
  itemKind: "fact" | "procedure" = "fact",
): SenseiDojoAttempt[] => Array.from({ length: SENSEI_DOJO_ROUND_ITENS }, (_, index) => ({
  right: index < right,
  durationMs: index < fluent ? 1000 : 5000,
  targetRtMs: 2000,
  itemId: itemKind === "fact" ? `f:${index % 3}` : "p:L6",
  itemKind,
}));

const withStep = (step: number): DojoTrackState => ({
  ...freshSenseiDojoState(true),
  currentStep: step,
  highestStep: step,
});

describe("Dojo Sensei — automaticidade separada da Jornada", () => {
  it("dois rounds precisos E fluentes avançam a faixa", () => {
    const first = applySenseiDojoRound(withStep(2), attempts(9, 9), 2, 4, "2026-08-08");
    expect(first.outcome).toBe("hold");
    expect(first.state.goodRounds).toBe(1);

    const second = applySenseiDojoRound(first.state, attempts(9, 9), 2, 4, "2026-08-08");
    expect(second.outcome).toBe("advance");
    expect(second.state.currentStep).toBe(3);
    expect(second.state.highestStep).toBe(3);
  });

  it("acerto lento preserva precisão mas não promove automaticidade", () => {
    let state = withStep(2);
    for (let i = 0; i < 3; i += 1) {
      const result = applySenseiDojoRound(state, attempts(10, 2), 2, 4, "2026-08-08");
      expect(result.accuracy).toBe(1);
      expect(result.fluentAccuracy).toBe(0.2);
      expect(result.outcome).toBe("hold");
      state = result.state;
    }
    expect(state.currentStep).toBe(2);
  });

  it("dois rounds abaixo de 60% recuam só o treino e preservam a melhor faixa", () => {
    const first = applySenseiDojoRound(withStep(4), attempts(5, 5), 4, 6, "2026-08-08");
    expect(first.state.weakRounds).toBe(1);
    const second = applySenseiDojoRound(first.state, attempts(5, 5), 4, 6, "2026-08-08");
    expect(second.outcome).toBe("retreat");
    expect(second.state.currentStep).toBe(3);
    expect(second.state.highestStep).toBe(4);
  });

  it("nunca avança além do teto conceitual", () => {
    let state = withStep(3);
    state = applySenseiDojoRound(state, attempts(10, 10), 3, 3, "2026-08-08").state;
    const second = applySenseiDojoRound(state, attempts(10, 10), 3, 3, "2026-08-08");
    expect(second.state.currentStep).toBe(3);
    expect(second.state.mastered).toBe(false);
  });

  it("prática manual fora do currentStep atualiza força, mas não move a prescrição", () => {
    const state = withStep(2);
    const result = applySenseiDojoRound(state, attempts(10, 10), 4, 5, "2026-08-08", false);
    expect(result.outcome).toBe("free-practice");
    expect(result.state.currentStep).toBe(2);
    expect(Object.keys(result.state.facts ?? {}).length).toBeGreaterThan(0);
  });

  it("fato errado enfraquece; fato fluente fortalece; procedimento agrega por família", () => {
    const wrong = attempts(0, 0);
    wrong.forEach(item => { item.itemId = "add:2:3"; });
    let result = applySenseiDojoRound(withStep(1), wrong, 1, 3, "2026-08-08");
    expect(result.state.facts?.["add:2:3"].forca).toBe(0);
    expect(result.state.facts?.["add:2:3"].erros_seguidos).toBe(SENSEI_DOJO_ROUND_ITENS);

    const fast = attempts(10, 10);
    fast.forEach(item => { item.itemId = "add:2:3"; });
    result = applySenseiDojoRound(result.state, fast, 1, 3, "2026-08-09");
    expect(result.state.facts?.["add:2:3"].forca).toBeGreaterThan(0);
    expect(result.state.facts?.["add:2:3"].erros_seguidos).toBe(0);

    const proc = attempts(8, 8, "procedure");
    const p = applySenseiDojoRound(withStep(6), proc, 6, 6, "2026-08-09");
    expect(p.state.procs?.["p:L6"]).toBeDefined();
    expect(p.state.family).toBe("PD");
  });

  it("recusa faixa que o conceito ainda não liberou", () => {
    expect(() => applySenseiDojoRound(withStep(1), attempts(10, 10), 4, 3, "2026-08-08"))
      .toThrow(/excede teto conceitual/);
  });
});
