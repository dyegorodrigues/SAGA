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

describe("W44 regression-first — N5.04/F74 Somar Frações", () => {
  afterEach(() => rollbackComposerCanary("N5.04"));

  it("parte do fallback com DAG satisfeito e exige a F74 integral antes da promoção", () => {
    rollbackComposerCanary("N5.04");
    expect(getTrackById("N5.04")?.prereqs).toEqual(["N5.03"]);
    expect(getTrackById("N5.04")?.generatorSource).toBe("fallback");

    const ficha = JOURNEY_FICHAS.find(item => item.id === "N5.04");
    expect(ficha).toBeDefined();
    expect(hasComposerFicha("N5.04")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("N5.04")).toBe("soma-fracoes-f74");

    enableComposerCanary("N5.04");
    const modos = ["somar-barras", "somar-simbolico", "subtrair", "fracao-impropria", "simplificar"];
    const tags = new Set<string>();

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("N5.04", nivel);
      const spec = q.uiProps as any;
      expect(q.kind).toBe("soma-fracoes-f74");
      expect(spec.nivel).toBe(nivel);
      expect(spec.modo).toBe(modos[nivel - 1]);
      expect(spec.primitivas).toEqual(["SingaporeBars"]);
      expect(spec.denominadoresIguais).toBe(true);
      expect(spec.restricaoDominio).toBe("sem-soma-denominador-precedente");
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    expect(tags).toEqual(new Set(["soma-denominador", "nao-simplifica", "impropria-invalida"]));
    for (const tag of tags) expect(isCanonicalMisconceptionTag(tag), `F74 tag fora do Radar: ${tag}`).toBe(true);

    expect(JSON.stringify(generateRegisteredFichaQuestion("N5.04", 1).resolucao)).toMatch(/barra|parte|denominador|tamanho/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N5.04", 2).resolucao)).toMatch(/numerador|denominador|não muda|nao muda/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N5.04", 3).resolucao)).toMatch(/subtra|tirar|partes/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N5.04", 4).resolucao)).toMatch(/maior que 1|imprópr|impropr|inteiro/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N5.04", 5).resolucao)).toMatch(/simplif|equival|mesma quantidade/i);
  });
});
