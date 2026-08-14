import { describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "./motores/composerCanary";

describe("W19 regression-first — N4.10/F69 divisão longa", () => {
  it("parte do fallback real, elegível no DAG vivo", () => {
    const track = getTrackById("N4.10");
    expect(track?.generatorSource).toBe("fallback");
    expect(track?.contentStatus).toBe("fallback");
    expect(track?.prereqs?.length).toBeGreaterThan(0);
  });

  it("fixa a escada concreto → algoritmo, resto e zero no quociente", () => {
    expect(hasComposerFicha("N4.10"), "N4.10 ainda não está registrada no Composer").toBe(true);
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
