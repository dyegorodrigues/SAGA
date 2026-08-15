import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import { enableComposerCanary, generateRegisteredFichaQuestion, hasComposerFicha, rollbackComposerCanary } from "./motores/composerCanary";

describe("W27 — AL.06/F77 A Expressão", () => {
  afterEach(() => rollbackComposerCanary("AL.06"));

  it("parte do fallback com os pré-requisitos do DAG vivo", () => {
    rollbackComposerCanary("AL.06");
    expect(getTrackById("AL.06")?.prereqs).toEqual(["AL.05", "N4.06"]);
    expect(getTrackById("AL.06")?.generatorSource).toBe("fallback");
    expect(hasComposerFicha("AL.06")).toBe(true);
  });

  it("materializa a escada F77 pela porta registrada do Composer", () => {
    enableComposerCanary("AL.06");
    const modos = ["mesma-ordem", "precedencia", "parenteses", "incognita-meio", "propriedades"];
    const tags = new Set<string>();
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("AL.06", nivel);
      expect(q.kind).toBe("expressao-f77");
      expect((q.uiProps as any).modo).toBe(modos[nivel - 1]);
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.options?.filter(o => o.value === q.answer)).toHaveLength(1);
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }
    expect(tags).toEqual(new Set(["resolve-da-esquerda", "ignora-parenteses", "so-incognita-no-fim"]));
  });
});
