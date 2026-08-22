import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  rollbackComposerCanary,
} from "./motores/composerCanary";

describe("W22 — N6.03/F87 porcentagem", () => {
  afterEach(() => rollbackComposerCanary("N6.03"));

  it("nasce do fallback com os prereqs do DAG vivo", () => {
    rollbackComposerCanary("N6.03");
    expect(getTrackById("N6.03")?.prereqs).toEqual(["N6.01", "N5.03"]);
    expect(getTrackById("N6.03")?.generatorSource).toBe("fallback");
    expect(getTrackById("N6.03")?.contentStatus).toBe("fallback");
  });

  it("materializa a escada F87 pela porta registrada do Composer", () => {
    expect(hasComposerFicha("N6.03")).toBe(true);
    enableComposerCanary("N6.03");
    const qs = [1, 2, 3, 4, 5].map(level => generateRegisteredFichaQuestion("N6.03", level));

    expect(qs.map(q => q.kind)).toEqual(Array(5).fill("porcentagem-f87"));
    expect(qs.map(q => q.uiProps?.modo)).toEqual([
      "parte-de-cem",
      "ancoras",
      "percentual-de",
      "desconto-acrescimo",
      "percentual-inverso",
    ]);

    for (const q of qs) {
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.options?.filter(option => option.value === q.answer)).toHaveLength(1);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
    }
  });

  it("mantém os três diagnósticos centrais da F87 exercitáveis", () => {
    enableComposerCanary("N6.03");
    const tags = new Set<string>();
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("N6.03", nivel);
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }
    expect(tags).toEqual(new Set(["porcento-como-numero", "desconto-absoluto", "notacoes-separadas"]));
  });
});
