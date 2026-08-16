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

describe("W37 regression-first — N7.02/F85 Operar com Negativos", () => {
  afterEach(() => rollbackComposerCanary("N7.02"));

  it("materializa a F85 inteira antes de qualquer promoção", () => {
    rollbackComposerCanary("N7.02");
    expect(getTrackById("N7.02")?.prereqs).toEqual(["N7.01", "N3.13"]);
    expect(getTrackById("N7.02")?.generatorSource).toBe("fallback");

    const ficha = JOURNEY_FICHAS.find(item => item.id === "N7.02");
    expect(ficha).toBeDefined();
    expect(ficha?.dominioNumerico).toBe("inteiros");
    expect(hasComposerFicha("N7.02")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("N7.02")).toBe("operar-negativos-f85");

    enableComposerCanary("N7.02");
    const modos = ["soma-pos-neg", "soma-neg-pos", "dois-negativos", "subtracao-negativo", "expressoes-mistas"];
    const tags = new Set<string>();
    let cruzouZero = false;

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("N7.02", nivel);
      const spec = q.uiProps as any;
      expect(q.kind).toBe("operar-negativos-f85");
      expect(spec.nivel).toBe(nivel);
      expect(spec.modo).toBe(modos[nivel - 1]);
      expect(spec.primitivas).toEqual(["InteractiveNumberLine"]);
      expect(q.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      cruzouZero ||= Boolean(spec.cruzaZero);
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    expect(cruzouZero).toBe(true);
    expect(tags).toEqual(new Set(["ignora-sinal", "direcao-errada", "subtrair-negativo"]));

    const l4 = generateRegisteredFichaQuestion("N7.02", 4);
    expect(JSON.stringify(l4.resolucao)).toMatch(/cancelar uma dívida/i);
  });
});
