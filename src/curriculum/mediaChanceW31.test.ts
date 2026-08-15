import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";

describe("W31 regression-first — PE.03/F83 Média e Chance", () => {
  afterEach(() => rollbackComposerCanary("PE.03"));

  it("parte do fallback com todos os pré-requisitos canônicos já servidos", () => {
    rollbackComposerCanary("PE.03");
    expect(getTrackById("PE.03")?.prereqs).toEqual(["PE.02", "N4.10", "N5.02"]);
    expect(getTrackById("PE.03")?.generatorSource).toBe("fallback");
    expect(hasComposerFicha("PE.03")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("PE.03")).toBe("media-chance-f83");
  });

  it("materializa a escada F83 sem ativar o canário por efeito colateral", () => {
    enableComposerCanary("PE.03");
    const modos = ["nivelar-3", "nivelar-5", "calcular-media", "chance-fracao", "comparar-chances"];
    const tags = new Set<string>();

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("PE.03", nivel);
      const spec = q.uiProps as any;
      expect(q.kind).toBe("media-chance-f83");
      expect(spec.nivel).toBe(nivel);
      expect(spec.modo).toBe(modos[nivel - 1]);
      expect(spec.primitiva).toBe("SingaporeBars");
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    for (const nivel of [1, 2, 3]) {
      const spec = generateRegisteredFichaQuestion("PE.03", nivel).uiProps as any;
      expect(Number.isInteger(spec.media)).toBe(true);
      expect(spec.torres.reduce((soma: number, valor: number) => soma + valor, 0)).toBe(spec.media * spec.torres.length);
      expect(spec.meioBloco).toBe(false);
    }

    const chance = generateRegisteredFichaQuestion("PE.03", 4).uiProps as any;
    expect(chance.chance).toMatchObject({ favoraveis: 3, total: 5, fracao: "3/5" });
    expect(chance.exemploMediaFracionaria).toMatchObject({ media: 4.5, meioBloco: true });

    const comparar = generateRegisteredFichaQuestion("PE.03", 5).uiProps as any;
    expect(comparar.sacos).toHaveLength(2);
    expect(comparar.exemploMediaFracionaria.meioBloco).toBe(true);
    expect(comparar.exemploMediaFracionaria.mediaPodeNaoSerValor).toBe(true);
    expect(comparar.exemploMediaFracionaria.torres).not.toContain(comparar.exemploMediaFracionaria.media);

    expect(tags).toEqual(new Set(["media-impossivel", "esqueceu-dividir", "ignora-total"]));
  });
});
