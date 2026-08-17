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

describe("W41 regression-first — GE.10/F92 Volume e Vistas", () => {
  afterEach(() => rollbackComposerCanary("GE.10"));

  it("parte do fallback com o DAG vivo satisfeito e materializa a F92 inteira antes da promoção", () => {
    rollbackComposerCanary("GE.10");
    expect(getTrackById("GE.10")?.prereqs).toEqual(["GE.04", "GM.08"]);
    expect(getTrackById("GE.10")?.generatorSource).toBe("fallback");

    const ficha = JOURNEY_FICHAS.find(item => item.id === "GE.10");
    expect(ficha).toBeDefined();
    expect(hasComposerFicha("GE.10")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("GE.10")).toBe("volume-vistas-f92");

    enableComposerCanary("GE.10");
    const modos = ["vista-frontal", "tres-vistas", "reconstruir-vistas", "cubos-ocultos", "desenhar-vistas"];
    const tags = new Set<string>();

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("GE.10", nivel);
      const spec = q.uiProps as any;
      expect(q.kind).toBe("volume-vistas-f92");
      expect(spec.nivel).toBe(nivel);
      expect(spec.modo).toBe(modos[nivel - 1]);
      expect(spec.primitivas).toEqual(["ArrayGrid"]);
      expect(spec.visualizacao).toBe("3D");
      expect(spec.acessibilidade).toMatchObject({ toqueAlternativo: true, snapGeneroso: true, alvoMinPx: 80 });
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(JSON.stringify(q.tutorial)).toMatch(/gire|vista|frente|cima|lado/i);
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    expect(tags).toEqual(new Set(["ignora-ocultos", "vista-trocada", "sem-rotacao-mental"]));
    for (const tag of tags) expect(isCanonicalMisconceptionTag(tag), `F92 tag fora do Radar: ${tag}`).toBe(true);

    expect(JSON.stringify(generateRegisteredFichaQuestion("GE.10", 1).resolucao)).toMatch(/frente|frontal/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("GE.10", 2).resolucao)).toMatch(/frente.*lado.*cima|frente.*cima.*lado|três vistas|tres vistas/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("GE.10", 3).resolucao)).toMatch(/reconstru|vistas|mont/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("GE.10", 4).resolucao)).toMatch(/ocult|não se vê|nao se ve|modelo mental/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("GE.10", 5).resolucao)).toMatch(/desenh|vista/i);
  });
});
