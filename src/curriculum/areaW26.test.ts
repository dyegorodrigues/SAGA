import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import { enableComposerCanary, generateRegisteredFichaQuestion, hasComposerFicha, rollbackComposerCanary } from "./motores/composerCanary";

describe("W26 — GM.08/F81 Área", () => {
  afterEach(() => enableComposerCanary("GM.08"));

  it("rollback preserva o DAG e devolve GM.08 ao fallback anterior", () => {
    rollbackComposerCanary("GM.08");
    expect(getTrackById("GM.08")?.prereqs).toEqual(["GM.07", "N4.02"]);
    expect(getTrackById("GM.08")?.generatorSource).toBe("fallback");
    expect(getTrackById("GM.08")?.contentStatus).toBe("fallback");
    expect(hasComposerFicha("GM.08"), "F81 continua registrada mesmo durante rollback").toBe(true);
  });

  it("F81 nasce em ArrayGrid, preserva cm² e separa chão de volta nos cinco níveis", () => {
    enableComposerCanary("GM.08");
    const modos = ["contar-quadrados", "linhas-colunas", "formula", "area-vs-perimetro", "compor-areas"];
    for (let lvl = 1; lvl <= 5; lvl += 1) {
      const q = generateRegisteredFichaQuestion("GM.08", lvl);
      expect(q.kind).toBe("area-f81");
      expect((q.uiProps as any).modo).toBe(modos[lvl - 1]);
      expect((q.uiProps as any).unidade).toBe("cm²");
      expect(q.evaluate?.(q.answer), `GM.08 L${lvl}: gabarito`).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
      if (q.options?.length) expect(q.options.filter(o => o.value === q.answer)).toHaveLength(1);
    }
  });
});
