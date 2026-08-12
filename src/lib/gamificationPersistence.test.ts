import { describe, expect, it } from "vitest";
import type { State } from "../types";
import { materializeSenseiDojoProgress } from "../curriculum/motores/senseiDojoProgressContext";
import { getKidLifetimeXp, dojoTrackXp } from "./gamificationProgress";
import { migrate } from "../utils/migrator";

const baseState = (): State => ({
  schemaVersion: 1,
  kids: [{ id: "kid", name: "Kid", avatar: "🦊", grade: "ano1", theme: "classico" }],
  progress: {
    kid: {
      "N1.01": {
        lvl: 2, maxLvl: 2, streak: 0, bad: 0, stars: 10, ok: 4, tot: 5, bank: [], mast: 0,
      },
    },
  },
  dojoTracks: {
    kid: {
      dojo_add: {
        unlocked: true,
        mastered: false,
        currentStep: 2,
        highestStep: 2,
        attempts: 10,
        correct: 9,
        xpStars: 25,
      } as any,
    },
  },
  coins: { kid: 12 },
  album: { kid: [] },
  log: { kid: [] },
  sound: true,
  customTracks: [],
});

describe("Persistência da meta-progressão", () => {
  it("JSON → migrate preserva XP conceitual + XP de fluência sem duplicar", () => {
    const raw = JSON.parse(JSON.stringify(baseState()));
    const loaded = migrate(raw, "2026-08-09");

    expect(dojoTrackXp(loaded.dojoTracks?.kid?.dojo_add)).toBe(25);
    expect(getKidLifetimeXp("kid", loaded)).toBe(35);
    expect(loaded.coins.kid).toBe(12);
  });

  it("legacy dojo → materialização → JSON → migrate mantém o mesmo XP vitalício", () => {
    const state = baseState();
    state.dojoTracks = { kid: {} };
    state.progress.kid.dojo_add = {
      lvl: 2, maxLvl: 2, streak: 0, bad: 0, stars: 25, ok: 9, tot: 10, bank: [], mast: 0,
      lastDay: "2026-08-09",
    };

    const materialized = materializeSenseiDojoProgress(state);
    expect(getKidLifetimeXp("kid", materialized)).toBe(35);

    const reloaded = migrate(JSON.parse(JSON.stringify(materialized)), "2026-08-09");
    expect(reloaded.progress.kid.dojo_add).toBeUndefined();
    expect(dojoTrackXp(reloaded.dojoTracks?.kid?.dojo_add)).toBe(25);
    expect(getKidLifetimeXp("kid", reloaded)).toBe(35);
  });

  it("reload + materialização repetida é idempotente", () => {
    const once = migrate(JSON.parse(JSON.stringify(baseState())), "2026-08-09");
    const twice = materializeSenseiDojoProgress(once);
    const thrice = materializeSenseiDojoProgress(twice);

    expect(getKidLifetimeXp("kid", twice)).toBe(35);
    expect(getKidLifetimeXp("kid", thrice)).toBe(35);
    expect(dojoTrackXp(thrice.dojoTracks?.kid?.dojo_add)).toBe(25);
  });
});
