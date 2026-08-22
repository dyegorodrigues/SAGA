import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";

describe("W32 regression-first — GM.09/F82 Problemas de Medida", () => {
  afterEach(() => rollbackComposerCanary("GM.09"));

  it("parte do fallback com os três pré-requisitos canônicos já servidos", () => {
    rollbackComposerCanary("GM.09");
    expect(getTrackById("GM.09")?.prereqs).toEqual(["GM.05", "N4.08", "N6.01"]);
    expect(getTrackById("GM.09")?.generatorSource).toBe("fallback");
    expect(hasComposerFicha("GM.09")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("GM.09")).toBe("problemas-medida-f82");
  });

  it("materializa a escada F82 sem ativar o canário por efeito colateral", () => {
    enableComposerCanary("GM.09");
    const modos = [
      "converter-comprimento",
      "converter-grandezas",
      "comparar-apos-converter",
      "operar-unidades-mistas",
      "problema-multietapa",
    ];
    const tags = new Set<string>();

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("GM.09", nivel);
      const spec = q.uiProps as any;
      expect(q.kind).toBe("problemas-medida-f82");
      expect(spec.nivel).toBe(nivel);
      expect(spec.modo).toBe(modos[nivel - 1]);
      expect(spec.primitivas).toEqual(["NumberLine", "Balanca"]);
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    const comprimento = generateRegisteredFichaQuestion("GM.09", 1).uiProps as any;
    expect(comprimento.conversao).toMatchObject({ de: "m", para: "cm", fator: 100 });
    expect(comprimento.mesmaQuantidade).toBe(true);

    const comparar = generateRegisteredFichaQuestion("GM.09", 3).uiProps as any;
    expect(comparar.exigeConversaoAntes).toBe(true);
    expect(comparar.valoresOriginais).toHaveLength(2);

    const misto = generateRegisteredFichaQuestion("GM.09", 4).uiProps as any;
    expect(misto.exigeConversaoAntes).toBe(true);
    expect(misto.unidadesMistas).toBe(true);

    const multi = generateRegisteredFichaQuestion("GM.09", 5).uiProps as any;
    expect(multi.etapas).toBeGreaterThanOrEqual(2);
    expect(multi.exigeConversaoAntes).toBe(true);

    expect(tags).toEqual(new Set(["compara-sem-converter", "inverte-operacao", "mistura-grandezas"]));
  });
});
