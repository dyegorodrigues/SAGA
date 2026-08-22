import { describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import { enableComposerCanary, generateRegisteredFichaQuestion, hasComposerFicha, rollbackComposerCanary } from "./motores/composerCanary";

const EVIDENCIA_RETA = "fracao-numero-reta-nivel-3mais";

describe("W16 — N5.02/F72 fração é número", () => {
  it("preserva o fallback como rollback e serve o Composer após a promoção", () => {
    expect(getTrackById("N5.02")?.prereqs).toEqual(["N5.01", "N4.05"]);
    expect(getTrackById("N5.02")?.generatorSource).toBe("composer");
    rollbackComposerCanary("N5.02");
    try {
      expect(getTrackById("N5.02")?.generatorSource).toBe("fallback");
      expect(getTrackById("N5.02")?.contentStatus).toBe("fallback");
    } finally {
      enableComposerCanary("N5.02");
    }
    expect(getTrackById("N5.02")?.generatorSource).toBe("composer");
  });

  it("fixa as três representações e a passagem obrigatória pela reta", () => {
    expect(hasComposerFicha("N5.02")).toBe(true);
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
