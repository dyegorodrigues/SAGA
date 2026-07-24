import { describe, it, expect } from "vitest";
import { TUTORIALS, hasTutorial, tutorialSteps } from "./tutorials";
import { Question } from "../types";

const fakeQ = (kind: string): Question => ({ kind, prompt: "?", options: [], answer: 0 });

describe("Tutoriais guiados 👉 (generalizados)", () => {
  it("todo tutorial registrado tem passos, todos com fala não-vazia", () => {
    for (const kind of Object.keys(TUTORIALS)) {
      const steps = tutorialSteps(fakeQ(kind));
      expect(steps.length, `${kind} sem passos`).toBeGreaterThan(0);
      for (const s of steps) {
        expect(typeof s.say, kind).toBe("string");
        expect(s.say.trim().length, `${kind} fala vazia`).toBeGreaterThan(0);
      }
    }
  });

  it("hasTutorial só é true para kinds registrados", () => {
    expect(hasTutorial("grow")).toBe(true);
    expect(hasTutorial("tenframe")).toBe(true);
    expect(hasTutorial("count")).toBe(false); // count tem a mãozinha antiga hardcoded
    expect(hasTutorial("inexistente")).toBe(false);
  });

  it("kinds novos das cenas vivas estão cobertos", () => {
    for (const k of ["weather", "grow", "daypart", "emotion", "lifestage", "animal", "bond", "tenframe"]) {
      expect(hasTutorial(k), `falta tutorial de ${k}`).toBe(true);
    }
  });
});
