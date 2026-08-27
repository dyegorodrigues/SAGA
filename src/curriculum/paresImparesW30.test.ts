import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import { enableComposerCanary, generateRegisteredFichaQuestion, hasComposerFicha, rollbackComposerCanary } from "./motores/composerCanary";

describe("W30 regression-first — N2.06/F38 Pares e Ímpares", () => {
  afterEach(() => rollbackComposerCanary("N2.06"));

  it("parte do fallback com o pré-requisito do DAG vivo já servido", () => {
    rollbackComposerCanary("N2.06");
    expect(getTrackById("N2.06")?.prereqs).toEqual(["N2.03"]);
    expect(getTrackById("N2.06")?.generatorSource).toBe("fallback");
    expect(hasComposerFicha("N2.06")).toBe(true);
  });

  it("materializa a escada F38 em DragGroup#duplas sem ativar o canário por efeito colateral", () => {
    enableComposerCanary("N2.06");
    const etapas = ["formar-duplas-10", "formar-duplas-20", "decidir-visual", "ultimo-algarismo", "regra-soma"];
    const tags = new Set<string>();

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("N2.06", nivel);
      const spec = q.uiProps as any;
      expect(q.kind).toBe("draggroup");
      expect(spec.ficha).toBe("F38");
      expect(spec.modo).toBe("duplas");
      expect(spec.etapa).toBe(etapas[nivel - 1]);
      expect(spec.primitiva).toBe("DragGroup");
      expect(spec.modoPrimitiva).toBe("duplas");
      expect(spec.acessibilidade).toMatchObject({ toqueAlternativo: true, alvoMinPx: 48 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    // O `zero-impar` só existe onde a quantidade é zero, e desde a CLASS-003 o
    // zero é um dos casos de L3, não O caso. Um sorteio por nível não basta
    // para ver os três erros: a união se mede sobre o corpus.
    for (let amostra = 0; amostra < 200 && tags.size < 3; amostra += 1) {
      for (const option of generateRegisteredFichaQuestion("N2.06", 3).options ?? []) {
        if (option.misconception) tags.add(option.misconception);
      }
    }

    expect((generateRegisteredFichaQuestion("N2.06", 1).uiProps as any).quantidade).toBeLessThanOrEqual(10);
    expect((generateRegisteredFichaQuestion("N2.06", 2).uiProps as any).quantidade).toBeLessThanOrEqual(20);
    expect((generateRegisteredFichaQuestion("N2.06", 3).uiProps as any).formarDuplas).toBe(false);
    expect((generateRegisteredFichaQuestion("N2.06", 4).uiProps as any).regraUltimoAlgarismo).toBe(true);
    expect((generateRegisteredFichaQuestion("N2.06", 5).uiProps as any).soma).toMatchObject({ a: expect.any(Number), b: expect.any(Number) });
    expect(tags).toEqual(new Set(["confunde-tamanho", "zero-impar", "decora-sem-entender"]));
  });
});
