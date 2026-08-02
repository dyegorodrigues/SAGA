import { describe, expect, it } from "vitest";
import { Progress, Track } from "../../types";
import {
  prescribeMisconceptionRescue,
  RESCUE_ESCALATION_LIMIT,
  RESCUE_UNLOCK_LEVEL,
} from "./rescuePlanner";

const progress = (over: Partial<Progress> = {}): Progress => ({
  lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0, ...over,
});
const track = (id: string): Track => ({
  id, graphId: id, name: id, icon: "🔧", color: "#000", dark: "#000",
  gen: () => ({ kind: "plain", prompt: id, options: [], answer: 1 }),
});

describe("prescribeMisconceptionRescue", () => {
  it("fortalece o pré-requisito mais frágil somente quando ele bloqueia o alvo", () => {
    const result = prescribeMisconceptionRescue(
      "N1.04",
      [track("N1.01"), track("N1.02"), track("N1.04")],
      { "N1.01": progress({ maxLvl: 2 }), "N1.02": progress({ maxLvl: 1 }) },
    );

    expect(result?.targetNodeId).toBe("N1.02");
    expect(result?.requiredLevel).toBe(RESCUE_UNLOCK_LEVEL);
    expect(result?.questionBudget).toBe(8);
  });

  it("mantém o resgate na própria competência quando as bases estão em pé", () => {
    const result = prescribeMisconceptionRescue(
      "N1.04",
      [track("N1.01"), track("N1.02"), track("N1.04")],
      {
        "N1.01": progress({ maxLvl: 3 }),
        "N1.02": progress({ maxLvl: 4 }),
        "N1.04": progress({ maxLvl: 1 }),
      },
    );

    expect(result?.targetNodeId).toBe("N1.04");
    expect(result?.requiredLevel).toBe(2);
    expect(result?.questionBudget).toBe(4);
  });

  it("após o teto de tentativas desce um degrau, quando existe ficha real", () => {
    const result = prescribeMisconceptionRescue(
      "N1.05",
      [track("N1.01"), track("N1.02"), track("N1.04"), track("N1.05")],
      {
        "N1.01": progress({ maxLvl: 1 }),
        "N1.02": progress({ maxLvl: 2 }),
        "N1.04": progress({ maxLvl: 1, rescueAttempts: RESCUE_ESCALATION_LIMIT }),
      },
    );

    expect(result?.targetNodeId).toBe("N1.01");
    expect(result?.escalated).toBe(true);
  });

  it("não inventa missão quando a ficha necessária não existe", () => {
    expect(prescribeMisconceptionRescue("N1.04", [], {})).toBeNull();
    expect(prescribeMisconceptionRescue(
      "N1.04",
      [{ ...track("N1.04"), contentStatus: "fallback" }],
      { "N1.04": progress() },
    )).toBeNull();
  });
});
