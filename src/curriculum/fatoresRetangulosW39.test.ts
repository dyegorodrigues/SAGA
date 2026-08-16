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

describe("W39 regression-first — N2.07/F66 A Fábrica de Retângulos", () => {
  afterEach(() => rollbackComposerCanary("N2.07"));

  it("materializa a F66 inteira antes de qualquer promoção", () => {
    rollbackComposerCanary("N2.07");
    expect(getTrackById("N2.07")?.prereqs).toEqual(["N4.02", "N2.06"]);
    expect(getTrackById("N2.07")?.generatorSource).toBe("fallback");

    const ficha = JOURNEY_FICHAS.find(item => item.id === "N2.07");
    expect(ficha).toBeDefined();
    expect(hasComposerFicha("N2.07")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("N2.07")).toBe("fatores-retangulos-f66");

    enableComposerCanary("N2.07");
    const modos = ["pares-com-dica", "todos-pares", "listar-fatores", "identificar-primo", "maior-fator-comum"];
    const tags = new Set<string>();

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("N2.07", nivel);
      const spec = q.uiProps as any;
      expect(q.kind).toBe("fatores-retangulos-f66");
      expect(spec.nivel).toBe(nivel);
      expect(spec.modo).toBe(modos[nivel - 1]);
      expect(spec.primitivas).toEqual(["ArrayGrid"]);
      expect(q.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    expect(tags).toEqual(new Set(["esquece-triviais", "para-cedo", "confunde-fator-multiplo"]));
    for (const tag of tags) expect(isCanonicalMisconceptionTag(tag), `F66 tag fora do Radar: ${tag}`).toBe(true);

    const l4 = generateRegisteredFichaQuestion("N2.07", 4);
    expect((l4.uiProps as any).primo).toBe(true);
    expect(JSON.stringify(l4.resolucao)).toMatch(/primo|um retângulo|1\s*[×x]\s*/i);
  });
});
