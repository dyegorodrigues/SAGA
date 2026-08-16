import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";

describe("W34 regression-first — GE.08/F80 O Plano Cartesiano", () => {
  afterEach(() => rollbackComposerCanary("GE.08"));

  it("parte do fallback com GE.05 e N1.12 já servidos", () => {
    rollbackComposerCanary("GE.08");
    expect(getTrackById("GE.08")?.prereqs).toEqual(["GE.05", "N1.12"]);
    expect(getTrackById("GE.08")?.generatorSource).toBe("fallback");
    expect(hasComposerFicha("GE.08")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("GE.08")).toBe("plano-cartesiano-f80");
  });

  it("materializa a escada F80 primeiro anda, depois sobe sem ativação por efeito colateral", () => {
    enableComposerCanary("GE.08");
    const modos = ["ler-ponto", "colocar-ponto", "caminho", "figura-coordenadas", "padrao-alinhado"];
    const tags = new Set<string>();

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("GE.08", nivel);
      const spec = q.uiProps as any;
      expect(q.kind).toBe("plano-cartesiano-f80");
      expect(spec.nivel).toBe(nivel);
      expect(spec.modo).toBe(modos[nivel - 1]);
      expect(spec.primitivas).toEqual(["ShapeCanvas"]);
      expect(spec.modoShapeCanvas).toBe("grade");
      expect(spec.primeiroAndaDepoisSobe).toBe(true);
      expect(spec.alternativaPorToque).toBe(true);
      expect(q.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    const l3 = generateRegisteredFichaQuestion("GE.08", 3).uiProps as any;
    expect(l3.caminhoEntrePontos).toBe(true);

    const l4 = generateRegisteredFichaQuestion("GE.08", 4).uiProps as any;
    expect(l4.desenharFigura).toBe(true);

    const l5 = generateRegisteredFichaQuestion("GE.08", 5).uiProps as any;
    expect(l5.identificarPadrao).toBe(true);

    expect(tags).toEqual(new Set(["inverte-xy", "ignora-origem", "conta-marcas"]));
  });
});
