import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  rollbackComposerCanary,
} from "./motores/composerCanary";

describe("W21 — AL.05/F46 igualdade é equilíbrio", () => {
  afterEach(() => rollbackComposerCanary("AL.05"));

  it("nasce do fallback com os prereqs do DAG vivo", () => {
    rollbackComposerCanary("AL.05");
    expect(getTrackById("AL.05")?.prereqs).toEqual(["N2.03", "N3.05"]);
    expect(getTrackById("AL.05")?.generatorSource).toBe("fallback");
    expect(getTrackById("AL.05")?.contentStatus).toBe("fallback");
  });

  it("materializa a escada F46 pela porta registrada do Composer", () => {
    expect(hasComposerFicha("AL.05")).toBe(true);
    enableComposerCanary("AL.05");
    const qs = [1, 2, 3, 4, 5].map(level => generateRegisteredFichaQuestion("AL.05", level));

    expect(qs.map(q => q.kind)).toEqual(Array(5).fill("igualdade-equilibrio-f46"));
    expect(qs.map(q => q.uiProps?.modo)).toEqual([
      "igualdade-simples",
      "soma-um-lado",
      "incognita-meio",
      "somas-dois-lados",
      "saco-fechado",
    ]);

    for (const q of qs) {
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.options?.filter(option => option.value === q.answer)).toHaveLength(1);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.masteryRule).toMatchObject({ acertos: 4, de: 4, sessoes: 2 });
    }

    expect(qs[3].masteryRule?.evidenciasDistintas).toMatchObject({
      prefixo: "igualdade-equilibrio-l4-",
      minimo: 2,
    });
  });

  it("mantém os três diagnósticos centrais da F46 exercitáveis", () => {
    enableComposerCanary("AL.05");
    const tags = new Set<string>();
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("AL.05", nivel);
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }
    expect(tags).toEqual(new Set(["igual-e-resultado", "soma-tudo", "ignora-termo"]));
  });
});
