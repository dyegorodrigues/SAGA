import { describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import { enableComposerCanary, generateRegisteredFichaQuestion, hasComposerFicha, rollbackComposerCanary } from "./motores/composerCanary";

describe("W17 — N6.01/F75 décimos e centésimos", () => {
  it("serve Composer e preserva rollback explícito para o fallback anterior", () => {
    expect(getTrackById("N6.01")?.prereqs).toEqual(["N5.02", "N2.04"]);
    expect(getTrackById("N6.01")?.generatorSource).toBe("composer");
    rollbackComposerCanary("N6.01");
    try {
      expect(getTrackById("N6.01")?.generatorSource).toBe("fallback");
      expect(getTrackById("N6.01")?.contentStatus).toBe("fallback");
    } finally {
      enableComposerCanary("N6.01");
    }
    expect(getTrackById("N6.01")?.generatorSource).toBe("composer");
  });

  it("fixa a releitura do Quadrado100 como inteiro e a escada decimal", () => {
    expect(hasComposerFicha("N6.01")).toBe(true);
    const qs = [1,2,3,4,5].map(level => generateRegisteredFichaQuestion("N6.01", level));
    expect(qs.map(q => q.kind)).toEqual(Array(5).fill("decimos-centesimos-f75"));
    expect(qs.map(q => q.uiProps?.modo)).toEqual(["decimos","centesimos","fracao-decimal","comparar","ordenar"]);
    for (const q of qs) {
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
    }
    expect(qs[0].uiProps?.unidadeDoQuadrado).toBe(1);
    expect(qs[0].uiProps?.valorDaColuna).toBe(0.1);
    expect(qs[1].uiProps?.valorDaCelula).toBe(0.01);
    expect(qs[3].exigeEvidencia).toBe("decimal-comparacao-nivel-4");
  });
});
