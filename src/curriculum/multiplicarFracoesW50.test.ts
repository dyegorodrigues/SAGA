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

describe("W50 regression-first — N5.05/F86 Multiplicar Frações", () => {
  afterEach(() => rollbackComposerCanary("N5.05"));

  it("parte do último fallback com prereqs servidos e exige a F86 inteira antes da promoção", () => {
    rollbackComposerCanary("N5.05");
    expect(getTrackById("N5.05")?.prereqs).toEqual(["N5.04", "N6.04"]);
    expect(getTrackById("N5.05")?.generatorSource).toBe("fallback");

    // Regression-first deliberado: N5.05/F86 ainda não existe na Journey.
    // A primeira falha deve permanecer exatamente aqui até a materialização inativa.
    const ficha = JOURNEY_FICHAS.find(item => item.id === "N5.05");
    expect(ficha).toBeDefined();

    expect(ficha?.nome).toBe("Multiplicar Frações");
    expect(ficha?.prereqs).toEqual(["N5.04", "N6.04"]);
    expect(hasComposerFicha("N5.05")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("N5.05")).toBe("multiplicar-fracoes-f86");

    enableComposerCanary("N5.05");
    const modos = ["fracao-inteiro", "fracao-inteiro-modelo", "fracao-fracao-area", "fracao-fracao-simbolico", "divisao-fracoes"];
    const tags = new Set<string>();
    let provouFracaoFracao = false;

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("N5.05", nivel);
      const spec = q.uiProps as any;

      expect(q.kind).toBe("multiplicar-fracoes-f86");
      expect(spec?.ficha).toBe("F86");
      expect(spec?.nivel).toBe(nivel);
      expect(spec?.modo).toBe(modos[nivel - 1]);
      expect(spec?.primitiva).toBe("ArrayGrid");
      expect(spec?.visualizacao).toBe("área");
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.rt_max_s).toBeUndefined();

      if (nivel === 3 && q.exigeEvidencia) provouFracaoFracao = true;
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    expect(provouFracaoFracao, "F86 precisa exigir evidência no nível 3 para satisfazer o domínio canônico").toBe(true);
    expect(tags).toEqual(new Set([
      "multiplicar-aumenta",
      "soma-em-vez-de-multiplicar",
      "dividir-diminui",
    ]));
    for (const tag of tags) expect(isCanonicalMisconceptionTag(tag), `F86 tag fora do Radar: ${tag}`).toBe(true);

    expect(JSON.stringify(generateRegisteredFichaQuestion("N5.05", 1).resolucao)).toMatch(/metade|de oito|fra[cç][aã]o|inteiro/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N5.05", 2).resolucao)).toMatch(/modelo|[aá]rea|parte|de/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N5.05", 3).resolucao)).toMatch(/interse[cç][aã]o|[aá]rea|produto|partes/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N5.05", 4).resolucao)).toMatch(/numerador|denominador|produto|multiplic/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N5.05", 5).resolucao)).toMatch(/quantos|cabem|divis[aã]o|fra[cç][aã]o/i);
  });
});
