import { describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "./motores/composerCanary";

describe("W18 regression-first — N5.03/F73 frações equivalentes", () => {
  it("parte do fallback real com N5.02 servido no DAG", () => {
    const track = getTrackById("N5.03");
    expect(track?.generatorSource).toBe("fallback");
    expect(track?.contentStatus).toBe("fallback");
    expect(track?.prereqs).toEqual(["N5.02"]);
  });

  it("fixa equivalência e comparação sem transformar denominador em tamanho", () => {
    expect(hasComposerFicha("N5.03"), "N5.03 ainda não está registrada no Composer").toBe(true);
    const qs = [1,2,3,4,5].map(level => generateRegisteredFichaQuestion("N5.03", level));
    expect(qs.map(q => q.kind)).toEqual(Array(5).fill("fracoes-equivalentes-f73"));
    expect(qs.map(q => q.uiProps?.modo)).toEqual(["equivalencia-sobreposta","equivalencia-lado-a-lado","mesmo-denominador","mesmo-numerador","denominadores-diferentes"]);
    for (const q of qs) {
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
    }
    expect(qs[3].exigeEvidencia).toBe("fracao-mesmo-numerador-nivel-4");
  });
});
