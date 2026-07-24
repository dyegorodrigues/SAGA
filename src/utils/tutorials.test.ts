import { describe, it, expect } from "vitest";
import { hasTutorial, tutorialSteps } from "./tutorials";
import { LEGACY_CHOREOGRAPHIES } from "./choreographyRegistry";
import { Question } from "../types";

const fakeQ = (kind: string): Question => ({ kind, prompt: "?", options: [], answer: 0 });

describe("Tutoriais guiados 👉 (generalizados)", () => {
  it("todo tutorial registrado tem passos, todos com fala não-vazia, e pelo menos um passo com show não-vazio", () => {
    for (const kind of Object.keys(LEGACY_CHOREOGRAPHIES)) {
      const steps = tutorialSteps(fakeQ(kind));
      expect(steps.length, `${kind} sem passos`).toBeGreaterThan(0);
      for (const s of steps) {
        expect(typeof s.say, kind).toBe("string");
        expect(s.say.trim().length, `${kind} fala vazia`).toBeGreaterThan(0);
      }
      const hasShow = steps.some(s => s.show !== undefined && s.show !== null && s.show !== "");
      expect(hasShow, `Coreografia de ${kind} é só narração: não tem nenhum show`).toBe(true);
    }
  });

  it("hasTutorial só é true para kinds registrados", () => {
    expect(hasTutorial("grow")).toBe(true);
    expect(hasTutorial("tenframe")).toBe(true);
    expect(hasTutorial("count")).toBe(true);
    expect(hasTutorial("inexistente")).toBe(false);
  });

  it("kinds novos das cenas vivas estão cobertos", () => {
    for (const k of ["weather", "grow", "daypart", "emotion", "lifestage", "animal", "bond", "tenframe"]) {
      expect(hasTutorial(k), `falta tutorial de ${k}`).toBe(true);
    }
  });
});

describe("Aulinha 🎬 — orquestração", () => {
  it("hasAulinha cobre mãozinhas antigas E tutoriais narrados", async () => {
    const { hasAulinha, aulaSeen, markAulaSeen } = await import("./tutorials");
    for (const k of ["count", "sum", "subvis", "tens", "grow", "daypart", "emotion"]) {
      expect(hasAulinha(k), k).toBe(true);
    }
    expect(hasAulinha("math")).toBe(false);
    expect(hasAulinha("journey")).toBe(false);
    // memória de "já vi" com storage injetado (sem localStorage, trata como vista)
    const mem: Record<string, string> = {};
    const fake = { getItem: (k: string) => mem[k] ?? null, setItem: (k: string, v: string) => { mem[k] = v; } };
    expect(aulaSeen("kid1", "count", fake)).toBe(false);
    markAulaSeen("kid1", "count", fake);
    expect(aulaSeen("kid1", "count", fake)).toBe(true);
    expect(aulaSeen("kid2", "count", fake)).toBe(false);
    expect(aulaSeen("kid1", "count", null)).toBe(true); // sem storage: nunca repete aula automática
  });

  it("passos com `show` (aula com imagens) apontam estados válidos", async () => {
    const { tutorialSteps } = await import("./tutorials");
    const dp = tutorialSteps({ kind: "daypart", prompt: "?", options: [], answer: 0 } as any);
    expect(dp.some((s) => s.show === "manha") && dp.some((s) => s.show === "tarde") && dp.some((s) => s.show === "noite")).toBe(true);
    const gw = tutorialSteps({ kind: "grow", prompt: "?", options: [], answer: 0 } as any);
    expect(gw.map((s) => s.show)).toEqual([1, 2, 3, 4]);
  });
});
