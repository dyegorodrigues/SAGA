import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import { enableComposerCanary, generateRegisteredFichaQuestion, hasComposerFicha, rollbackComposerCanary } from "./motores/composerCanary";

describe("W23 — GE.06/F78 ângulos", () => {
  afterEach(() => rollbackComposerCanary("GE.06"));

  it("nasce do fallback com o prereq do DAG vivo", () => {
    rollbackComposerCanary("GE.06");
    expect(getTrackById("GE.06")?.prereqs).toEqual(["GE.03"]);
    expect(getTrackById("GE.06")?.generatorSource).toBe("fallback");
    expect(getTrackById("GE.06")?.contentStatus).toBe("fallback");
  });

  it("materializa a escada F78 pela porta registrada do Composer", () => {
    expect(hasComposerFicha("GE.06")).toBe(true);
    enableComposerCanary("GE.06");
    const qs = [1, 2, 3, 4, 5].map(level => generateRegisteredFichaQuestion("GE.06", level));
    expect(qs.map(q => q.kind)).toEqual(Array(5).fill("angulos-f78"));
    expect(qs.map(q => q.uiProps?.modo)).toEqual(["classificar", "comparar", "lados-diferentes", "medir-graus", "poligonos"]);
    for (const q of qs) {
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.options?.filter(option => option.value === q.answer)).toHaveLength(1);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
    }
  });

  it("mantém os três diagnósticos centrais da F78 exercitáveis", () => {
    enableComposerCanary("GE.06");
    const tags = new Set<string>();
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("GE.06", nivel);
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }
    expect(tags).toEqual(new Set(["angulo-pelo-lado", "confunde-agudo-obtuso", "transferidor-invertido"]));
  });
});
