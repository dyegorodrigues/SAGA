import { describe, expect, it } from "vitest";
import { Progress } from "../../types";
import { getMasteryViewModel } from "./MasteryDimensions";

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

describe("MasteryDimensions", () => {
  it("derives the four parent-facing dimensions from progress evidence", () => {
    const model = getMasteryViewModel(progress({
      lvl: 5,
      maxLvl: 5,
      masteryEvidence: {
        schemaVersion: 1,
        comprehensionStreak: 3,
        independenceStreak: 2,
        fluencyStreak: 1,
        retentionPasses: 0,
      },
    }));

    expect(Object.fromEntries(model.dimensions.map(item => [item.id, item.value]))).toEqual({
      comprehension: 100,
      fluency: 33,
      retention: 0,
      independence: 67,
    });
  });

  it("does not fabricate dimensions for a preserved legacy crown", () => {
    const model = getMasteryViewModel(progress({
      lvl: 5,
      dom: true,
      masteryEvidence: {
        schemaVersion: 1,
        comprehensionStreak: 3,
        independenceStreak: 0,
        fluencyStreak: 0,
        retentionPasses: 0,
        crownedBy: "legacy",
      },
    }));

    expect(model.legacy).toBe(true);
    expect(model.crowned).toBe(true);
    expect(model.dimensions.every(item => item.value === null)).toBe(true);
  });
});
