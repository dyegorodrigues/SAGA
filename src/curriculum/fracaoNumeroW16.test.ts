import { describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "./motores/composerCanary";

const EVIDENCIA_RETA = "fracao-numero-reta-nivel-3mais";

describe("W16 regression-first — N5.02/F72 fração é número", () => {
  it("parte do fallback real com os pré-requisitos servidos do DAG", () => {
    const track = getTrackById("N5.02");
    expect(track?.generatorSource).toBe("fallback");
    expect(track?.contentStatus).toBe("fallback");
    expect(track?.prereqs).toEqual(["N5.01", "N4.05"]);
  });

  it("fixa as três representações e a passagem obrigatória pela reta", () => {
    expect(hasComposerFicha("N5.02"), "N5.02 ainda não está registrada no Composer").toBe(true);
    const qs = [1, 2, 3, 4, 5].map(level => generateRegisteredFichaQuestion("N5.02", level));
    expect(qs.map(q => q.kind)).toEqual(Array(5).fill("fracao-numero-f72"));
    expect(qs.map(q => q.uiProps?.modo)).toEqual(["barra", "colecao", "reta", "reta-parcial", "impropria"]);
    expect(qs.map(q => q.uiProps?.suporte)).toEqual(["singapore", "colecao", "reta", "reta", "reta"]);
    for (const q of qs) {
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.exigeEvidencia).toBe(EVIDENCIA_RETA);
    }
    expect(qs[2].uiProps?.marcasCompletas).toBe(true);
    expect(qs[3].uiProps?.marcasCompletas).toBe(false);
    expect(qs[4].uiProps?.numerador).toBeGreaterThan(qs[4].uiProps?.denominador);
  });
});
