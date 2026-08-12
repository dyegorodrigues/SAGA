import { describe, expect, it } from "vitest";
import { Progress } from "../../types";
import { masteryDisqualifier } from "../masterySignals";
import { EmojiRowRiscarMisconception } from "../procedimentos/emojiRowRiscarSemantics";
import { applyJourneyAnswer } from "./progressEngine";

function progress(overrides: Partial<Progress> = {}): Progress {
  return { lvl: 5, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0, maxLvl: 5, ...overrides };
}

const baseAttempt = {
  durationMs: 1500,
  targetRtMs: 4000,
  helpUsed: false,
  isReview: false,
  practiceDay: "2026-08-12",
  previousPracticeDay: "2026-08-12",
  masteryRule: { acertos: 3, de: 3, sessoes: 2 },
};

describe("W9 — correção após RESPONDE_O_REMOVIDO", () => {
  it("mantém o acerto real, mas não compra a sequência de domínio", () => {
    const sinal = masteryDisqualifier(EmojiRowRiscarMisconception.RESPONDE_O_REMOVIDO);
    let atual = applyJourneyAnswer(progress(), true, false, { ...baseAttempt, evidencias: [sinal] }).progress;
    expect(atual.ok).toBe(1);
    expect(atual.masteryEvidence?.comprehensionWindow).toEqual([false]);
    expect(atual.masteryEvidence?.evidenciasVistas || []).not.toContain(sinal);

    for (let i = 0; i < 3; i += 1) {
      atual = applyJourneyAnswer(atual, true, false, baseAttempt).progress;
    }
    expect(atual.masteryEvidence?.comprehensionWindow).toEqual([true, true, true]);
    expect(atual.masteryEvidence?.comprehensionStreak).toBe(3);
    expect(atual.dom).not.toBe(true);
  });
});
