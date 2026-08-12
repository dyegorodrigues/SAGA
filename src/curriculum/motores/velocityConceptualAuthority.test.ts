import { describe, expect, it } from "vitest";
import type { Progress } from "../../types";
import { MisconceptionTag } from "../../constants/misconceptions";
import { applyJourneyAnswer } from "./progressEngine";
import { getRescueItems, trackMisconception } from "./radarEngine";

const progress = (overrides: Partial<Progress> = {}): Progress => ({
  lvl: 2,
  maxLvl: 2,
  streak: 0,
  bad: 0,
  stars: 0,
  ok: 0,
  tot: 0,
  bank: [],
  mast: 0,
  ...overrides,
});

describe("velocidade sem autoridade conceitual", () => {
  it("LENTO_DEDOS legado não entra no catálogo nem abre Oficina", () => {
    const p = progress();
    trackMisconception(p, "LENTO_DEDOS");
    trackMisconception(p, "LENTO_DEDOS");
    expect(p.misconceptions).toBeUndefined();

    const legacy = progress({
      misconceptions: [
        { tag: "LENTO_DEDOS", ts: 1000 },
        { tag: "LENTO_DEDOS", ts: 1100 },
      ],
    });
    expect(getRescueItems("kid", { "N3.01": legacy })).toEqual([]);
  });

  it("tag conceitual canônica continua sendo registrada e resgatável", () => {
    const p = progress();
    trackMisconception(p, MisconceptionTag.OFF_BY_ONE);
    trackMisconception(p, MisconceptionTag.OFF_BY_ONE);
    expect(p.misconceptions).toHaveLength(2);
    expect(getRescueItems("kid", { "N1.03": p })).toEqual(["N1.03"]);
  });

  it("mutação externa de streak após o motor não pode acelerar o próximo nível", () => {
    const first = applyJourneyAnswer(progress(), true, false).progress;
    expect(first.streak).toBe(1);

    // Replica o legado do GameLoop: rapid-fire <=3s tenta forçar streak=3.
    first.streak = 3;
    expect(first.streak).toBe(1);

    const second = applyJourneyAnswer(first, true, false);
    expect(second.progress.lvl).toBe(2);
    expect(second.progress.streak).toBe(2);
    expect(second.transition).toBeNull();

    const third = applyJourneyAnswer(second.progress, true, false);
    expect(third.progress.lvl).toBe(3);
    expect(third.progress.streak).toBe(0);
    expect(third.transition).toEqual({ type: "level-up", level: 3 });
  });

  it("acerto rápido e lento têm a mesma autoridade curricular fora do Dojo", () => {
    const base = progress({ lvl: 3, maxLvl: 3, streak: 1, tot: 4, ok: 4 });
    const common = {
      helpUsed: false,
      isReview: false,
      practiceDay: "2026-08-09",
      previousPracticeDay: "2026-08-08",
    };

    const fast = applyJourneyAnswer(base, true, false, {
      ...common,
      durationMs: 1500,
      targetRtMs: 10_000,
    });
    const slow = applyJourneyAnswer(base, true, false, {
      ...common,
      durationMs: 12_000,
      targetRtMs: 10_000,
    });

    expect({
      lvl: fast.progress.lvl,
      maxLvl: fast.progress.maxLvl,
      streak: fast.progress.streak,
      bad: fast.progress.bad,
      dom: fast.progress.dom,
      transition: fast.transition,
    }).toEqual({
      lvl: slow.progress.lvl,
      maxLvl: slow.progress.maxLvl,
      streak: slow.progress.streak,
      bad: slow.progress.bad,
      dom: slow.progress.dom,
      transition: slow.transition,
    });
  });
});
