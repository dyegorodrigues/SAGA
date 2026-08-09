import { describe, expect, it } from "vitest";
import type { State } from "../types";
import { materializeSenseiDojoProgress } from "../curriculum/motores/senseiDojoProgressContext";
import { applyJardimRound, freshJardimTrackState, type JardimAttempt } from "../curriculum/motores/jardimEngine";
import { getKidLifetimeStars } from "../components/MascotEvolution";
import {
  dojoTrackXp,
  sagaLevelProgress,
  sagaLevelThresholdXp,
  sagaPlayerLevel,
} from "./gamificationProgress";

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

const perfectGardenRound = (): JardimAttempt[] => Array.from({ length: 8 }, () => ({
  right: true,
  durationMs: 1_000,
  targetRtMs: 2_000,
}));

describe("Gamificação — XP vitalício separado da autoridade pedagógica", () => {
  it("XP ganho no Dojo não desaparece quando o envelope progress.dojo_* é materializado", () => {
    const before = stateWithDojoXp();
    expect(getKidLifetimeStars("kid", before)).toBe(35);

    const after = materializeSenseiDojoProgress(before);

    expect(after.progress.kid.dojo_add).toBeUndefined();
    expect(dojoTrackXp(after.dojoTracks?.kid?.dojo_add)).toBe(25);
    expect(getKidLifetimeStars("kid", after)).toBe(35);
  });

  it("materialização repetida é idempotente para XP vitalício", () => {
    const once = materializeSenseiDojoProgress(stateWithDojoXp());
    const twice = materializeSenseiDojoProgress(once);

    expect(getKidLifetimeStars("kid", twice)).toBe(getKidLifetimeStars("kid", once));
    expect(dojoTrackXp(twice.dojoTracks?.kid?.dojo_add)).toBe(25);
  });

  it("Jardim acumula XP próprio sem tocar em Progress conceitual", () => {
    const current = freshJardimTrackState(true);
    const result = applyJardimRound(current, perfectGardenRound(), "2026-08-09");

    expect(dojoTrackXp(result.state)).toBe(13); // 8 acertos + 5 pelo round perfeito
    expect(result.state.correct).toBe(8);
    expect(result.state.attempts).toBe(8);
  });

  it("XP de conceito + XP de fluência compõem o mesmo total vitalício", () => {
    const garden = applyJardimRound(freshJardimTrackState(true), perfectGardenRound(), "2026-08-09").state;
    const state = stateWithDojoXp();
    delete state.progress.kid.dojo_add;
    state.dojoTracks = { kid: { jardim_cardinalidade: garden } };

    expect(getKidLifetimeStars("kid", state)).toBe(23);
  });
});

describe("Nível SAGA — identidade do perfil, não mastery", () => {
  it("usa curva monotônica 1–100 com início rápido e teto em meses, não em uma sessão", () => {
    let previous = -1;
    for (let level = 1; level <= 100; level += 1) {
      const threshold = sagaLevelThresholdXp(level);
      expect(threshold).toBeGreaterThan(previous);
      previous = threshold;
    }

    expect(sagaLevelThresholdXp(1)).toBe(0);
    expect(sagaLevelThresholdXp(2)).toBe(10);
    expect(sagaLevelThresholdXp(10)).toBe(118);
    expect(sagaLevelThresholdXp(100)).toBe(4420);
  });

  it("resolve fronteiras e progresso do nível sem extrapolar 100", () => {
    expect(sagaPlayerLevel(0)).toBe(1);
    expect(sagaPlayerLevel(9)).toBe(1);
    expect(sagaPlayerLevel(10)).toBe(2);
    expect(sagaPlayerLevel(4_420)).toBe(100);
    expect(sagaPlayerLevel(999_999)).toBe(100);

    const l2 = sagaLevelProgress(10);
    expect(l2.level).toBe(2);
    expect(l2.progress01).toBe(0);
    expect(l2.xpForNextLevel).toBeGreaterThan(0);

    const max = sagaLevelProgress(5_000);
    expect(max.level).toBe(100);
    expect(max.nextThreshold).toBeNull();
    expect(max.progress01).toBe(1);
  });
});
