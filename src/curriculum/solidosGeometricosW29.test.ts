import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import { enableComposerCanary, generateRegisteredFichaQuestion, hasComposerFicha, rollbackComposerCanary } from "./motores/composerCanary";

describe("W29 regression-first — GE.04/F59 Sólidos Geométricos", () => {
  afterEach(() => rollbackComposerCanary("GE.04"));

  it("parte do fallback com todos os pré-requisitos do DAG vivo já servidos", () => {
    rollbackComposerCanary("GE.04");
    expect(getTrackById("GE.04")?.prereqs).toEqual(["GE.02"]);
    expect(getTrackById("GE.04")?.generatorSource).toBe("fallback");
    expect(hasComposerFicha("GE.04")).toBe(true);
  });

  it("materializa integralmente a escada F59 sem ativar o canário por efeito colateral", () => {
    enableComposerCanary("GE.04");
    const modos = ["nomear-basicos", "nomear-familia", "testar-rolagem", "testar-empilhamento", "contar-elementos"];
    const tags = new Set<string>();

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("GE.04", nivel);
      expect(q.kind).toBe("solidos-geometricos-f59");
      expect((q.uiProps as any).modo).toBe(modos[nivel - 1]);
      expect((q.uiProps as any).acessibilidade).toMatchObject({ toqueAlternativo: true, alvoMinPx: 48 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    expect((generateRegisteredFichaQuestion("GE.04", 3).uiProps as any).experimento).toBe("rampa");
    expect((generateRegisteredFichaQuestion("GE.04", 4).uiProps as any).experimento).toBe("empilhar");
    expect((generateRegisteredFichaQuestion("GE.04", 5).uiProps as any).contagem).toMatchObject({ faces: expect.any(Number), vertices: expect.any(Number), arestas: expect.any(Number) });
    expect(tags).toEqual(new Set(["confunde-plano-solido", "so-um-angulo", "propriedade-errada"]));
  });
});
