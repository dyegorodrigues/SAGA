import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  rollbackComposerCanary,
} from "./motores/composerCanary";

describe("W20 — GM.07/F63 perímetro é a volta", () => {
  afterEach(() => rollbackComposerCanary("GM.07"));

  it("nasce do fallback e preserva os prereqs canônicos", () => {
    rollbackComposerCanary("GM.07");
    expect(getTrackById("GM.07")?.prereqs).toEqual(["GM.05", "N3.11"]);
    expect(getTrackById("GM.07")?.generatorSource).toBe("fallback");
    expect(getTrackById("GM.07")?.contentStatus).toBe("fallback");
  });

  it("materializa a escada F63 pela porta registrada do Composer", () => {
    expect(hasComposerFicha("GM.07")).toBe(true);
    enableComposerCanary("GM.07");
    const qs = [1, 2, 3, 4, 5].map(level => generateRegisteredFichaQuestion("GM.07", level));

    expect(qs.map(q => q.kind)).toEqual(Array(5).fill("perimetro-f63"));
    expect(qs.map(q => q.uiProps?.modo)).toEqual([
      "contar-malha",
      "somar-lados",
      "figura-irregular",
      "perimetro-vs-area",
      "lado-faltante",
    ]);

    for (const q of qs) {
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.options?.filter(option => option.value === q.answer)).toHaveLength(1);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
    }

    expect(qs[3].exigeEvidencia).toBe("perimetro-vs-area-nivel-4");
  });

  it("mantém os três diagnósticos da F63 exercitáveis", () => {
    enableComposerCanary("GM.07");
    const tags = new Set<string>();
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("GM.07", nivel);
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }
    expect(tags).toEqual(new Set(["confunde-com-area", "esquece-um-lado", "conta-cantos-duas-vezes"]));
  });
});
