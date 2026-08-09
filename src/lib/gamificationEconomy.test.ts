import { describe, expect, it } from "vitest";
import type { State } from "../types";
import { materializeSenseiDojoProgress } from "../curriculum/motores/senseiDojoProgressContext";
import { getKidLifetimeStars } from "../components/MascotEvolution";

const stateWithDojoXp = (): State => ({
  schemaVersion: 1,
  kids: [{ id: "kid", name: "Kid", avatar: "🦊", grade: "ano1", theme: "classico" }],
  progress: {
    kid: {
      "N1.01": {
        lvl: 2, maxLvl: 2, streak: 0, bad: 0, stars: 10, ok: 5, tot: 6, bank: [], mast: 0,
      },
      dojo_add: {
        lvl: 2, maxLvl: 2, streak: 0, bad: 0, stars: 25, ok: 10, tot: 10, bank: [], mast: 0,
        lastDay: "2026-08-09",
      },
    },
  },
  dojoTracks: {},
  coins: { kid: 0 },
  album: { kid: [] },
  log: { kid: [] },
  sound: true,
  customTracks: [],
});

describe("Gamificação — XP vitalício separado da autoridade pedagógica", () => {
  it("XP ganho no Dojo não desaparece quando o envelope progress.dojo_* é materializado", () => {
    const before = stateWithDojoXp();
    expect(getKidLifetimeStars("kid", before)).toBe(35);

    const after = materializeSenseiDojoProgress(before);

    expect(after.progress.kid.dojo_add).toBeUndefined();
    expect(getKidLifetimeStars("kid", after)).toBe(35);
  });

  it("materialização repetida é idempotente para XP vitalício", () => {
    const once = materializeSenseiDojoProgress(stateWithDojoXp());
    const twice = materializeSenseiDojoProgress(once);

    expect(getKidLifetimeStars("kid", twice)).toBe(getKidLifetimeStars("kid", once));
  });
});
