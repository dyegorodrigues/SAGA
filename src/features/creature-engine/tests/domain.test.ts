import { describe, expect, it } from "vitest";

import {
  advanceCreatureClock,
  applyCreatureInteraction,
  applyLearningSnapshot,
  changeCreatureSpecies,
  chooseAutonomousIntent,
  createCreatureSave,
  normalizeCreatureSave,
  resolvePmdAction,
  stageForStars,
} from "../domain";

describe("Creature Engine domain", () => {
  it("creates a deterministic, non-punitive starter save", () => {
    const now = 1_000_000;
    expect(createCreatureSave("25", "Pikachu", "Faísca", now)).toEqual({
      schemaVersion: 1,
      speciesId: "0025",
      speciesName: "Pikachu",
      nickname: "Faísca",
      xp: 0,
      evolutionStage: 1,
      needs: { energy: 82, satiety: 78, joy: 84, bond: 55 },
      mood: "curioso",
      lastReaction: "idle",
      lastTickAt: now,
      lastInteractionAt: now,
      updatedAt: now,
      learning: { stars: 0, correct: 0, questions: 0, streak: 0 },
      unlockedSpecies: ["0025"],
    });
  });

  it("keeps needs above gentle floors even after a long absence", () => {
    const start = createCreatureSave("25", "Pikachu", "Faísca", 0);
    const afterThreeDays = advanceCreatureClock(start, 72 * 3_600_000);

    expect(afterThreeDays.needs.energy).toBeGreaterThanOrEqual(20);
    expect(afterThreeDays.needs.satiety).toBeGreaterThanOrEqual(20);
    expect(afterThreeDays.needs.joy).toBeGreaterThanOrEqual(25);
    expect(afterThreeDays.needs.bond).toBeGreaterThanOrEqual(35);
    expect(afterThreeDays.evolutionStage).toBe(1);
    expect(afterThreeDays.xp).toBe(0);
  });

  it("never punishes practice and rewards effort even without a perfect result", () => {
    const initial = createCreatureSave("133", "Eevee", "Lumi", 100);
    const practiced = applyLearningSnapshot(
      initial,
      { stars: 0, correct: 0, questions: 4, streak: 1, lastDay: "2026-08-05" },
      200,
    );

    expect(practiced.xp).toBeGreaterThan(initial.xp);
    expect(practiced.needs.bond).toBeGreaterThan(initial.needs.bond);
    expect(practiced.needs.joy).toBeGreaterThan(initial.needs.joy);
    expect(practiced.evolutionStage).toBeGreaterThanOrEqual(initial.evolutionStage);
  });

  it("does not double-count the same learning snapshot", () => {
    const initial = createCreatureSave("447", "Riolu", "Aura", 100);
    const snapshot = { stars: 15, correct: 10, questions: 12, streak: 3, lastDay: "2026-08-05" };
    const first = applyLearningSnapshot(initial, snapshot, 200);
    const second = applyLearningSnapshot(first, snapshot, 300);

    expect(second).toEqual(first);
    expect(first.evolutionStage).toBe(2);
  });

  it("applies caring interactions without dropping unrelated needs to unsafe values", () => {
    const low = normalizeCreatureSave({
      ...createCreatureSave("4", "Charmander", "Brasa", 0),
      needs: { energy: 20, satiety: 20, joy: 25, bond: 35 },
    });
    const played = applyCreatureInteraction(low, "play", 100);
    const trained = applyCreatureInteraction(played, "train", 200);

    expect(played.lastReaction).toBe("happy");
    expect(trained.lastReaction).toBe("attack");
    expect(trained.needs.energy).toBeGreaterThanOrEqual(20);
    expect(trained.needs.bond).toBeGreaterThan(low.needs.bond);
  });

  it("preserves progression when changing species", () => {
    const evolved = applyLearningSnapshot(
      createCreatureSave("25", "Pikachu", "Faísca", 0),
      { stars: 160, correct: 80, questions: 100, streak: 5 },
      100,
    );
    const changed = changeCreatureSpecies(evolved, "1", "Bulbasaur", 200);

    expect(changed.speciesId).toBe("0001");
    expect(changed.evolutionStage).toBe(evolved.evolutionStage);
    expect(changed.xp).toBe(evolved.xp);
    expect(changed.unlockedSpecies).toEqual(expect.arrayContaining(["0025", "0001"]));
  });

  it("maps semantic intentions to available PMD action names", () => {
    const available = ["Idle", "Walk", "Bite", "Dance", "Scratch"];

    expect(resolvePmdAction("eat", available)).toBe("Bite");
    expect(resolvePmdAction("celebrate", available)).toBe("Dance");
    expect(resolvePmdAction("attack", available)).toBe("Scratch");
    expect(resolvePmdAction("sleep", available)).toBe("Idle");
  });

  it("uses needs before random autonomy and follows the stage curve", () => {
    const sleepy = normalizeCreatureSave({
      ...createCreatureSave("7", "Squirtle", "Bolha", 0),
      needs: { energy: 25, satiety: 90, joy: 90, bond: 80 },
    });

    expect(chooseAutonomousIntent(sleepy, 0.99)).toBe("sleep");
    expect(stageForStars(0)).toBe(1);
    expect(stageForStars(15)).toBe(2);
    expect(stageForStars(1000)).toBe(8);
  });
});
