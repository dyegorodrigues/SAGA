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

describe("W48 regression-first — GM.11/F94 Volume de Prismas", () => {
  afterEach(() => rollbackComposerCanary("GM.11"));

  it("parte do fallback com prereqs servidos e exige a F94 inteira antes da promoção", () => {
    rollbackComposerCanary("GM.11");
    expect(getTrackById("GM.11")?.prereqs).toEqual(["GM.09", "N4.02"]);
    expect(getTrackById("GM.11")?.generatorSource).toBe("fallback");

    // Regression-first deliberado: GM.11/F94 ainda não existe na Journey.
    // A primeira falha deve permanecer exatamente aqui até a materialização inativa.
    const ficha = JOURNEY_FICHAS.find(item => item.id === "GM.11");
    expect(ficha).toBeDefined();

    expect(ficha?.nome).toBe("Volume de Prismas");
    expect(ficha?.prereqs).toEqual(["GM.09", "N4.02"]);
    expect(hasComposerFicha("GM.11")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("GM.11")).toBe("volume-prismas-f94");

    enableComposerCanary("GM.11");
    const modos = ["contar-cubos", "camada-multiplicar", "formula", "dimensao-faltante", "prisma-nao-retangular"];
    const tags = new Set<string>();
    let provouDimensaoFaltante = false;

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("GM.11", nivel);
      const spec = q.uiProps as any;

      expect(q.kind).toBe("volume-prismas-f94");
      expect(spec?.ficha).toBe("F94");
      expect(spec?.nivel).toBe(nivel);
      expect(spec?.modo).toBe(modos[nivel - 1]);
      expect(spec?.primitivas).toEqual(["ArrayGrid"]);
      expect(spec?.visualizacao).toBe("3D");
      expect(spec?.acessibilidade).toMatchObject({ toqueAlternativo: true, semArrastoObrigatorio: true, alvoMinPx: 80 });
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.rt_max_s).toBeUndefined();

      if (nivel === 4 && q.exigeEvidencia) provouDimensaoFaltante = true;
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    expect(provouDimensaoFaltante, "F94 precisa exigir evidência no nível 4 para satisfazer o domínio canônico").toBe(true);
    expect(tags).toEqual(new Set([
      "soma-dimensoes",
      "confunde-com-area",
      "ignora-unidade-cubica",
    ]));
    for (const tag of tags) expect(isCanonicalMisconceptionTag(tag), `F94 tag fora do Radar: ${tag}`).toBe(true);

    expect(JSON.stringify(generateRegisteredFichaQuestion("GM.11", 1).resolucao)).toMatch(/cub|encher|cont/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("GM.11", 2).resolucao)).toMatch(/camada|base|multiplic/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("GM.11", 3).resolucao)).toMatch(/base|altura|volume|multiplic/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("GM.11", 4).resolucao)).toMatch(/dimens|falt|base|altura|divid/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("GM.11", 5).resolucao)).toMatch(/camada|prisma|base|decompo|soma/i);
  });
});
