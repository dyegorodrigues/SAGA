import { describe, expect, it } from "vitest";
import { Progress } from "../../types";
import { applyJourneyAnswer, migrateLegacyCrown } from "./progressEngine";

function progress(overrides: Partial<Progress> = {}): Progress {
  return {
    lvl: 1,
    streak: 0,
    bad: 0,
    stars: 0,
    ok: 0,
    tot: 0,
    bank: [],
    mast: 0,
    ...overrides,
  };
}

describe("progressEngine", () => {
  it("promotes after the third correct answer and preserves earned maxLvl", () => {
    const result = applyJourneyAnswer(progress({ lvl: 2, streak: 2, maxLvl: 2 }), true, false);

    expect(result.progress).toMatchObject({ lvl: 3, maxLvl: 3, streak: 0, ok: 1, tot: 1 });
    expect(result.transition).toEqual({ type: "level-up", level: 3 });
  });

  it("keeps warmup errors from increasing frustration", () => {
    const result = applyJourneyAnswer(progress({ lvl: 3, streak: 2, bad: 2 }), false, true);

    expect(result.progress).toMatchObject({ lvl: 3, streak: 0, bad: 2, tot: 1 });
    expect(result.transition).toBeNull();
  });

  it("steps back only on the third non-warmup error", () => {
    const result = applyJourneyAnswer(progress({ lvl: 4, bad: 2 }), false, false);

    expect(result.progress).toMatchObject({ lvl: 3, bad: 0, tot: 1 });
    expect(result.transition).toEqual({ type: "level-down", level: 3 });
  });

  it("isolates the current legacy crown rule for the multidimensional migration", () => {
    const result = applyJourneyAnswer(progress({ lvl: 5, maxLvl: 5, streak: 2 }), true, false);

    expect(result.progress.dom).toBe(true);
    expect(result.transition).toEqual({ type: "legacy-crown" });
    expect(result.progress.masteryEvidence?.crownedBy).toBe("legacy");
  });

  it("requires comprehension, independence, fluency and delayed retention for a new crown", () => {
    let current = progress({ lvl: 5, maxLvl: 5 });
    const attempt = {
      durationMs: 1800,
      targetRtMs: 2000,
      helpUsed: false,
      isReview: false,
      practiceDay: "2026-07-01",
      previousPracticeDay: "2026-07-01",
    };

    for (let i = 0; i < 3; i += 1) {
      current = applyJourneyAnswer(current, true, false, attempt).progress;
    }
    expect(current.dom).not.toBe(true);
    expect(current.masteryEvidence).toMatchObject({
      comprehensionStreak: 3,
      independenceStreak: 3,
      fluencyStreak: 3,
      retentionPasses: 0,
      candidateDay: "2026-07-01",
    });

    const retained = applyJourneyAnswer(current, true, false, {
      ...attempt,
      isReview: true,
      practiceDay: "2026-07-03",
      previousPracticeDay: "2026-07-01",
    });
    expect(retained.progress.dom).toBe(true);
    expect(retained.progress.masteryEvidence?.crownedBy).toBe("multidimensional");
    expect(retained.transition).toEqual({ type: "multidimensional-crown" });
  });

  it("does not treat aided or slow answers as independent fluent evidence", () => {
    const aided = applyJourneyAnswer(progress({ lvl: 5, maxLvl: 5 }), true, false, {
      durationMs: 1500,
      targetRtMs: 2000,
      helpUsed: true,
      isReview: false,
      practiceDay: "2026-07-01",
    });
    expect(aided.progress.helpClicks).toBe(1);
    expect(aided.progress.masteryEvidence).toMatchObject({ independenceStreak: 0, fluencyStreak: 1 });

    const slow = applyJourneyAnswer(aided.progress, true, false, {
      durationMs: 2500,
      targetRtMs: 2000,
      helpUsed: false,
      isReview: false,
      practiceDay: "2026-07-01",
    });
    expect(slow.progress.masteryEvidence).toMatchObject({ independenceStreak: 1, fluencyStreak: 0 });
    expect(slow.progress.dom).not.toBe(true);
  });

  it("does not mutate the progress or review bank received from React state", () => {
    const original = progress({ bank: [{ sig: "q", hits: 0, q: { kind: "plain", prompt: "?", answer: 1 } }] });
    const result = applyJourneyAnswer(original, true, false);

    expect(result.progress).not.toBe(original);
    expect(result.progress.bank).not.toBe(original.bank);
    expect(original).toMatchObject({ ok: 0, tot: 0, streak: 0 });
  });

  it("preserves old crowns while marking their evidence provenance", () => {
    const migrated = migrateLegacyCrown(progress({ lvl: 5, dom: true }));

    expect(migrated.dom).toBe(true);
    expect(migrated.masteryEvidence?.crownedBy).toBe("legacy");
  });
});
