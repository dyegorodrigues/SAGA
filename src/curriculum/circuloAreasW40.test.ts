import { afterEach, describe, expect, it } from "vitest";
import { JOURNEY_FICHAS } from "./fichas";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";
import { isCanonicalMisconceptionTag } from "./motores/radarEngine";

describe("W40 regression-first — GE.09/F91 Círculo e Áreas", () => {
  afterEach(() => rollbackComposerCanary("GE.09"));

  it("materializa a F91 inteira antes de qualquer promoção", () => {
    rollbackComposerCanary("GE.09");
    expect(getTrackById("GE.09")?.prereqs).toEqual(["GM.08", "GE.06"]);
    expect(getTrackById("GE.09")?.generatorSource).toBe("fallback");

    const ficha = JOURNEY_FICHAS.find(item => item.id === "GE.09");
    expect(ficha).toBeDefined();
    expect(hasComposerFicha("GE.09")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("GE.09")).toBe("circulo-areas-f91");

    enableComposerCanary("GE.09");
    const modos = ["triangulo-montagem", "formula-triangulo", "paralelogramo-corte", "circulo-medidas", "area-circulo"];
    const tags = new Set<string>();

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("GE.09", nivel);
      const spec = q.uiProps as any;
      expect(q.kind).toBe("circulo-areas-f91");
      expect(spec.nivel).toBe(nivel);
      expect(spec.modo).toBe(modos[nivel - 1]);
      expect(spec.primitivas).toEqual(["ShapeCanvas"]);
      expect(q.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    expect(tags).toEqual(new Set(["esquece-dividir-por-2", "altura-errada", "confunde-raio-diametro"]));
    for (const tag of tags) expect(isCanonicalMisconceptionTag(tag), `F91 tag fora do Radar: ${tag}`).toBe(true);

    const l1 = generateRegisteredFichaQuestion("GE.09", 1);
    expect(JSON.stringify(l1.resolucao)).toMatch(/dois triângulos|retângulo|metade|divid/i);

    const l2 = generateRegisteredFichaQuestion("GE.09", 2);
    const l2Text = JSON.stringify(l2.resolucao);
    expect(l2Text).toMatch(/base/i);
    expect(l2Text).toMatch(/altura/i);
    expect(l2Text).toMatch(/multiplic|produto|×|x\s*altura/i);
    expect(l2Text).toMatch(/metade|divid\w*\s*(?:por\s*)?2|÷\s*2/i);
    expect(l2Text).toMatch(/triângulo|triangulo|retângulo|retangulo/i);

    const l3 = generateRegisteredFichaQuestion("GE.09", 3);
    expect(JSON.stringify(l3.resolucao)).toMatch(/cort|encaix|mesma área|retângulo/i);

    const l4 = generateRegisteredFichaQuestion("GE.09", 4);
    const l4Text = JSON.stringify(l4.resolucao);
    expect(l4Text).toMatch(/raio/i);
    expect(l4Text).toMatch(/diâmetro|diametro/i);
    expect(l4Text).toMatch(/circunferência|circunferencia/i);
    expect(l4Text).toMatch(/dobro.*raio|dois raios|2\s*[×x*]\s*raio|raio.*metade.*diâmetro|raio.*metade.*diametro/i);
    expect(l4Text).toMatch(/borda|contorno|volta/i);

    const l5 = generateRegisteredFichaQuestion("GE.09", 5);
    expect(JSON.stringify(l5.resolucao)).toMatch(/círculo|setores|raio|π|pi/i);
  });
});
