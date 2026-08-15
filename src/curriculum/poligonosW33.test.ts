import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";

describe("W33 regression-first — GE.07/F79 Polígonos", () => {
  afterEach(() => rollbackComposerCanary("GE.07"));

  it("parte do fallback com os pré-requisitos geométricos canônicos já servidos", () => {
    rollbackComposerCanary("GE.07");
    expect(getTrackById("GE.07")?.prereqs).toEqual(["GE.03", "GE.06"]);
    expect(getTrackById("GE.07")?.generatorSource).toBe("fallback");
    expect(hasComposerFicha("GE.07")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("GE.07")).toBe("poligonos-f79");
  });

  it("materializa a escada F79 ShapeCanvas + DragGroup sem ativação por efeito colateral", () => {
    enableComposerCanary("GE.07");
    const modos = [
      "identificar-poligono",
      "triangulos",
      "quadrilateros",
      "classificar-propriedades",
      "construir-classificar",
    ];
    const tags = new Set<string>();

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("GE.07", nivel);
      const spec = q.uiProps as any;
      expect(q.kind).toBe("poligonos-f79");
      expect(spec.nivel).toBe(nivel);
      expect(spec.modo).toBe(modos[nivel - 1]);
      expect(spec.primitivas).toEqual(["ShapeCanvas", "DragGroup"]);
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    const l1 = generateRegisteredFichaQuestion("GE.07", 1).uiProps as any;
    expect(l1.incluiNaoExemploAberto).toBe(true);
    expect(l1.exigeFechada).toBe(true);
    expect(l1.exigeLadosRetos).toBe(true);

    const l4 = generateRegisteredFichaQuestion("GE.07", 4).uiProps as any;
    expect(l4.quadradoTambemRetangulo).toBe(true);
    expect(l4.classificacaoPorPropriedades).toBe(true);

    const l5 = generateRegisteredFichaQuestion("GE.07", 5).uiProps as any;
    expect(l5.construcao).toBe(true);
    expect(l5.condicoesMinimas).toBeGreaterThanOrEqual(2);
    expect(l5.alternativaPorToque).toBe(true);

    expect(tags).toEqual(new Set(["nao-fecha", "conta-lados-errado", "confunde-classe"]));
  });
});
