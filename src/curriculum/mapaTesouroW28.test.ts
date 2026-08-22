import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import { enableComposerCanary, generateRegisteredFichaQuestion, hasComposerFicha, rollbackComposerCanary } from "./motores/composerCanary";

describe("W28 — GE.05/F60 O Mapa do Tesouro", () => {
  afterEach(() => rollbackComposerCanary("GE.05"));

  it("parte do fallback com os pré-requisitos do DAG vivo", () => {
    rollbackComposerCanary("GE.05");
    expect(getTrackById("GE.05")?.prereqs).toEqual(["GE.01"]);
    expect(getTrackById("GE.05")?.generatorSource).toBe("fallback");
    expect(hasComposerFicha("GE.05")).toBe(true);
  });

  it("materializa a escada F60 pela porta registrada do Composer", () => {
    enableComposerCanary("GE.05");
    const modos = ["achar-objeto", "dizer-coordenada", "colocar-objeto", "descrever-caminho", "pre-cartesiano"];
    const tags = new Set<string>();
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("GE.05", nivel);
      expect(q.kind).toBe("mapa-tesouro-f60");
      expect((q.uiProps as any).modo).toBe(modos[nivel - 1]);
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.options?.filter(o => o.value === q.answer)).toHaveLength(1);
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }
    expect(tags).toEqual(new Set(["inverte-coordenadas", "so-uma-coordenada", "confunde-linha-coluna"]));
  });
});
