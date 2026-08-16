import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";

describe("W33 — GE.07/F79 Polígonos — contrato canônico reconciliado", () => {
  afterEach(() => rollbackComposerCanary("GE.07"));

  it("permanece materializada e inativa com os pré-requisitos geométricos canônicos", () => {
    rollbackComposerCanary("GE.07");
    expect(getTrackById("GE.07")?.prereqs).toEqual(["GE.03", "GE.06"]);
    expect(getTrackById("GE.07")?.generatorSource).toBe("fallback");
    expect(hasComposerFicha("GE.07")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("GE.07")).toBe("poligonos-f79");
  });

  it("segue F79: lados → ângulos → quadriláteros → hierarquia → propriedades combinadas", () => {
    enableComposerCanary("GE.07");
    const modos = [
      "triangulos-lados",
      "triangulos-angulos",
      "quadrilateros",
      "hierarquia",
      "propriedades-combinadas",
    ];
    const tags = new Set<string>();

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("GE.07", nivel);
      const spec = q.uiProps as any;
      expect(q.kind).toBe("poligonos-f79");
      expect(spec.nivel).toBe(nivel);
      expect(spec.modo).toBe(modos[nivel - 1]);
      expect(spec.primitivas).toEqual(["ShapeCanvas", "DragGroup"]);
      expect(spec.alternativaPorToque).toBe(true);
      expect(q.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    const l1 = generateRegisteredFichaQuestion("GE.07", 1).uiProps as any;
    expect(l1.criterio).toBe("lados");
    expect(l1.orientacoesVariadas).toBe(true);

    const l2 = generateRegisteredFichaQuestion("GE.07", 2).uiProps as any;
    expect(l2.criterio).toBe("angulos");
    expect(l2.orientacoesVariadas).toBe(true);

    const l4 = generateRegisteredFichaQuestion("GE.07", 4).uiProps as any;
    expect(l4.hierarquia).toBe(true);
    expect(l4.quadradoTambemRetangulo).toBe(true);
    expect(l4.lacosAninhados).toContain("quadrados⊂retângulos");

    const l5 = generateRegisteredFichaQuestion("GE.07", 5).uiProps as any;
    expect(l5.propriedadesCombinadas).toBe(true);
    expect(l5.criteriosMinimos).toBeGreaterThanOrEqual(2);

    expect(tags).toEqual(new Set(["categorias-exclusivas", "so-um-criterio", "orientacao-fixa"]));
  });
});
