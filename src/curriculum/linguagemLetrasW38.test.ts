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

describe("W38 regression-first — AL.07/F89 A Linguagem das Letras", () => {
  afterEach(() => rollbackComposerCanary("AL.07"));

  it("materializa a F89 inteira antes de qualquer promoção", () => {
    rollbackComposerCanary("AL.07");
    expect(getTrackById("AL.07")?.prereqs).toEqual(["AL.06", "AL.04"]);
    expect(getTrackById("AL.07")?.generatorSource).toBe("fallback");

    const ficha = JOURNEY_FICHAS.find(item => item.id === "AL.07");
    expect(ficha).toBeDefined();
    expect(hasComposerFicha("AL.07")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("AL.07")).toBe("linguagem-letras-f89");

    enableComposerCanary("AL.07");
    const modos = ["caixa-vira-letra", "expressao-simples", "expressao-contexto", "regra-padrao", "equivalencia-expressoes"];
    const tags = new Set<string>();

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("AL.07", nivel);
      const spec = q.uiProps as any;
      expect(q.kind).toBe("linguagem-letras-f89");
      expect(spec.nivel).toBe(nivel);
      expect(spec.modo).toBe(modos[nivel - 1]);
      expect(spec.primitivas).toEqual(["SingaporeBars", "plain"]);
      expect(q.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    expect(tags).toEqual(new Set(["letra-como-objeto", "so-caso-particular", "nao-generaliza"]));
    for (const tag of tags) expect(isCanonicalMisconceptionTag(tag), `F89 tag fora do Radar: ${tag}`).toBe(true);

    const l4 = generateRegisteredFichaQuestion("AL.07", 4);
    expect(JSON.stringify(l4.resolucao)).toMatch(/dois casos|funciona nos dois/i);
  });
});
