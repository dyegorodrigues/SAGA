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

describe("W42 regression-first — N4.11/F70 Primos e Divisores", () => {
  afterEach(() => rollbackComposerCanary("N4.11"));

  it("parte do fallback com o DAG vivo satisfeito e exige a F70 inteira antes da promoção", () => {
    rollbackComposerCanary("N4.11");
    expect(getTrackById("N4.11")?.prereqs).toEqual(["N4.07", "N4.10"]);
    expect(getTrackById("N4.11")?.generatorSource).toBe("fallback");

    const ficha = JOURNEY_FICHAS.find(item => item.id === "N4.11");
    expect(ficha).toBeDefined();
    expect(hasComposerFicha("N4.11")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("N4.11")).toBe("primos-divisores-f70");

    enableComposerCanary("N4.11");
    const modos = ["multiplos-quadro", "divisores-retangulo", "distinguir", "identificar-primos", "crivo-eratostenes"];
    const tags = new Set<string>();

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("N4.11", nivel);
      const spec = q.uiProps as any;
      expect(q.kind).toBe("primos-divisores-f70");
      expect(spec.nivel).toBe(nivel);
      expect(spec.modo).toBe(modos[nivel - 1]);
      expect(spec.primitivas).toEqual(["ArrayGrid", "Quadrado100"]);
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    expect(tags).toEqual(new Set(["inverte-divisor-multiplo", "esquece-um", "primo-errado"]));
    for (const tag of tags) expect(isCanonicalMisconceptionTag(tag), `F70 tag fora do Radar: ${tag}`).toBe(true);

    expect(JSON.stringify(generateRegisteredFichaQuestion("N4.11", 1).resolucao)).toMatch(/múltipl|multipl|quadro|salto/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N4.11", 2).resolucao)).toMatch(/divisor|retâng|retang|cabe/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N4.11", 3).resolucao)).toMatch(/divisor.*múltipl|múltipl.*divisor|multiplo/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N4.11", 4).resolucao)).toMatch(/primo|retâng|retang|1\s*[×x]\s*/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N4.11", 5).resolucao)).toMatch(/crivo|eratósten|eratosten|múltipl|multipl/i);
  });
});
