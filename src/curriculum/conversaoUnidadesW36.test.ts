import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";

describe("W36 regression-first — GM.10/F93 Conversão de Unidades", () => {
  afterEach(() => rollbackComposerCanary("GM.10"));

  it("parte do fallback com GM.05 e N2.04 já servidos", () => {
    rollbackComposerCanary("GM.10");
    expect(getTrackById("GM.10")?.prereqs).toEqual(["GM.05", "N2.04"]);
    expect(getTrackById("GM.10")?.generatorSource).toBe("fallback");
    expect(hasComposerFicha("GM.10")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("GM.10")).toBe("conversao-unidades-f93");
  });

  it("materializa a escada F93 preservando a grandeza e a equivalência física", () => {
    enableComposerCanary("GM.10");
    const modos = ["cm-m", "massa-capacidade", "decimal", "unidade-adequada", "problema"];
    const tags = new Set<string>();

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("GM.10", nivel);
      const spec = q.uiProps as any;
      expect(q.kind).toBe("conversao-unidades-f93");
      expect(spec.nivel).toBe(nivel);
      expect(spec.modo).toBe(modos[nivel - 1]);
      expect(spec.primitivas).toEqual(["NumberLine", "Balanca"]);
      expect(spec.quantidadeFisicaPreservada).toBe(true);
      expect(q.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    // A CLASS-003 sorteia o número; o que a F93 fixa é o PAR de unidades e o
    // fator, não o valor. Cravar "1 m" aqui voltaria a exigir caso único.
    const l1 = generateRegisteredFichaQuestion("GM.10", 1).uiProps as any;
    expect(l1.equivalencia).toMatchObject({ unidadeOrigem: "m", unidadeDestino: "cm" });
    expect(l1.equivalencia.destino).toBe(l1.equivalencia.origem * 100);
    expect(l1.incluiDecimal).toBe(false);

    const l3 = generateRegisteredFichaQuestion("GM.10", 3).uiProps as any;
    expect(l3.equivalencia).toMatchObject({ unidadeOrigem: "m", unidadeDestino: "cm" });
    expect(l3.equivalencia.destino).toBe(Math.round(l3.equivalencia.origem * 100));
    expect(Number.isInteger(l3.equivalencia.origem), "L3 é o degrau do decimal").toBe(false);
    expect(l3.incluiDecimal).toBe(true);

    expect(tags).toEqual(new Set(["inverte-operacao", "mistura-grandezas", "ignora-decimal"]));
  });
});
