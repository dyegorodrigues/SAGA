import { describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import { enableComposerCanary, generateRegisteredFichaQuestion, hasComposerFicha, rollbackComposerCanary } from "./motores/composerCanary";

describe("W19 — N4.10/F69 divisão longa", () => {
  it("serve Composer e preserva rollback explícito para o fallback anterior", () => {
    expect(getTrackById("N4.10")?.prereqs).toEqual(["N4.06", "N4.05", "N3.12"]);
    expect(getTrackById("N4.10")?.generatorSource).toBe("composer");
    expect(getTrackById("N4.10")?.contentStatus).toBe("served");
    rollbackComposerCanary("N4.10");
    try {
      expect(getTrackById("N4.10")?.generatorSource).toBe("fallback");
      expect(getTrackById("N4.10")?.contentStatus).toBe("fallback");
    } finally {
      enableComposerCanary("N4.10");
    }
    expect(getTrackById("N4.10")?.generatorSource).toBe("composer");
  });

  it("fixa a escada concreto → algoritmo, resto e zero no quociente", () => {
    expect(hasComposerFicha("N4.10")).toBe(true);
    const qs = [1, 2, 3, 4, 5].map(level => generateRegisteredFichaQuestion("N4.10", level));
    expect(qs.map(q => q.kind)).toEqual(Array(5).fill("divisao-longa-f69"));
    expect(qs.map(q => q.uiProps?.modo)).toEqual(["arranjo-exata", "arranjo-resto", "ponte-algoritmo", "algoritmo", "zero-quociente"]);
    for (const q of qs) {
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.masteryRule).toMatchObject({ acertos: 4, de: 4, sessoes: 3 });
    }
    expect(qs[4].exigeEvidencia).toBe("divisao-zero-quociente-nivel-5");
  });
});
