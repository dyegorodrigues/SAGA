import { describe, expect, it } from "vitest";
import type { Progress } from "../../types";
import { localDay } from "../../utils/calendarDay";
import { migrate } from "../../utils/migrator";
import { applyJardimRound, freshJardimTrackState, type JardimAttempt } from "./jardimEngine";
import { applyJourneyAnswer } from "./progressEngine";
import { getDueReviews } from "./radarEngine";
import {
  applySenseiDojoRound,
  freshSenseiDojoState,
  type SenseiDojoAttempt,
} from "./senseiDojoEngine";

const progress = (): Progress => ({
  lvl: 2,
  maxLvl: 2,
  streak: 0,
  bad: 0,
  stars: 0,
  ok: 0,
  tot: 0,
  bank: [],
  mast: 0,
});

const gardenAttempts: JardimAttempt[] = Array.from({ length: 6 }, () => ({
  right: true,
  durationMs: 500,
  targetRtMs: 1000,
}));

const dojoAttempts: SenseiDojoAttempt[] = Array.from({ length: 10 }, (_, i) => ({
  right: true,
  durationMs: 500,
  targetRtMs: 1000,
  itemId: `f${i}`,
  itemKind: "fact" as const,
}));

describe("timezone — uma identidade de dia entre motores", () => {
  it("Journey grava practiceDay explícito e normaliza a escrita UTC atual do caller legado", () => {
    const result = applyJourneyAnswer(progress(), true, false, {
      durationMs: 500,
      targetRtMs: 1000,
      helpUsed: false,
      isReview: false,
      practiceDay: "2026-07-01",
    });
    expect(result.progress.lastDay).toBe("2026-07-01");

    result.progress.lastDay = new Date().toISOString().slice(0, 10);
    expect(result.progress.lastDay).toBe(localDay());
  });

  it("Jardim e Dojo preservam day key histórica explícita", () => {
    const jardim = applyJardimRound(freshJardimTrackState(true), gardenAttempts, "2026-07-02");
    expect(jardim.state.lastDay).toBe("2026-07-02");

    const dojo = applySenseiDojoRound(freshSenseiDojoState(true), dojoAttempts, 1, 2, "2026-07-03", true);
    expect(dojo.state.lastDay).toBe("2026-07-03");
    expect(dojo.state.facts?.f0.ultima_vez).toBe("2026-07-03");
  });

  it("Leitner vence por distância de calendário, não por horário de 24h", () => {
    const oneDay = { A: { ...progress(), reviewForce: 1, lastDay: "2026-03-07" } };
    expect(getDueReviews(oneDay, "2026-03-08")).toEqual(["A"]);

    const twentyOneDays = { B: { ...progress(), reviewForce: 5, lastDay: "2026-08-09" } };
    expect(getDueReviews(twentyOneDays, "2026-08-29")).toEqual([]);
    expect(getDueReviews(twentyOneDays, "2026-08-30")).toEqual(["B"]);
  });

  it("migração do mascote conta dias civis sem depender de 23/24/25 horas", () => {
    const state = migrate({
      schemaVersion: 1,
      kids: [{ id: "kid", name: "Kid", grade: "ano1", theme: "classico", petEnergy: 80, petDay: "2026-03-07" }],
      progress: { kid: {} },
      dojoTracks: { kid: {} },
      coins: { kid: 0 },
      album: { kid: [] },
      log: { kid: [] },
      sound: false,
      customTracks: [],
    }, "2026-03-08");

    expect(state.kids[0].petEnergy).toBe(55);
    expect(state.kids[0].petDay).toBe("2026-03-08");
  });
});
