import { afterEach, describe, expect, it } from "vitest";
import { shouldRenderQuestionOptions } from "../components/gameloop/answerPolicy";
import {
  COMPOSER_CANARIES,
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  rollbackComposerCanary,
} from "./motores/composerCanary";
import { getTrackById } from "./motores/curriculum";

const CANARIOS_ORIGINAIS = [...COMPOSER_CANARIES];
const EVIDENCIA_SIMETRIA = "detetive-formas-simetria-nivel-4";

const MODOS = {
  1: "atributos-lados",
  2: "atributos-cantos",
  3: "atributos-contorno",
  4: "simetria-eixo",
  5: "simetria-completar",
} as const;

type ModoF58 = typeof MODOS[keyof typeof MODOS];
type EixoF58 = "vertical" | "horizontal" | "diagonal" | "diagonal-oposta";

interface SpecF58 {
  nivel: number;
  modo: ModoF58;
  resposta: string;
  eixoCorreto?: EixoF58;
  eixosDisponiveis?: EixoF58[];
}

describe("W13 regression-first — GE.03/F58", () => {
  afterEach(() => {
    COMPOSER_CANARIES.clear();
    for (const id of CANARIOS_ORIGINAIS) COMPOSER_CANARIES.add(id);
  });

  it("parte de fallback real, com GE.02 já servido pelo Composer", () => {
    rollbackComposerCanary("GE.03");
    expect(getTrackById("GE.03")?.generatorSource).toBe("fallback");
    expect(getTrackById("GE.03")?.contentStatus).toBe("fallback");
    expect(getTrackById("GE.03")?.prereqs).toEqual(["GE.02"]);
    expect(getTrackById("GE.02")?.generatorSource).toBe("composer");
  });

  it("materializa os cinco degraus canônicos F58 pela porta registrada e inativa", () => {
    expect(() => enableComposerCanary("GE.03")).not.toThrow();

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("GE.03", nivel);
      const spec = q.uiProps as SpecF58;

      expect(q.kind).toBe("detetive-formas-f58");
      expect(q.isFallback).not.toBe(true);
      expect(spec.nivel).toBe(nivel);
      expect(spec.modo).toBe(MODOS[nivel as keyof typeof MODOS]);
      expect(q.answer).toBe(spec.resposta);
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.exigeEvidencia).toBe(EVIDENCIA_SIMETRIA);
      expect(q.resolucao?.passos.at(-1)?.parcial).toBe(q.answer);
      expect(shouldRenderQuestionOptions(q)).toBe(false);
    }
  });

  it("mantém os quatro diagnósticos canônicos alcançáveis pela resolução R0-A", () => {
    enableComposerCanary("GE.03");
    const corrigidos = new Set<string>();

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("GE.03", nivel);
      for (const passo of q.resolucao?.passos ?? []) {
        for (const tag of passo.corrige ?? []) corrigidos.add(tag);
      }
    }

    expect(corrigidos).toEqual(new Set([
      "conta-errado-lados",
      "confunde-lado-canto",
      "eixo-errado",
      "so-eixo-vertical",
    ]));
  });

  it("nível 4 não ensina que todo eixo de simetria é vertical", () => {
    enableComposerCanary("GE.03");
    const originalRandom = Math.random;
    Math.random = () => 0.8;
    try {
      const q = generateRegisteredFichaQuestion("GE.03", 4);
      const spec = q.uiProps as SpecF58;
      expect(spec.eixosDisponiveis).toEqual(expect.arrayContaining(["vertical", "horizontal", "diagonal"]));
      expect(spec.eixoCorreto).not.toBe("vertical");
      expect(q.answer).toBe(spec.eixoCorreto);
    } finally {
      Math.random = originalRandom;
    }
  });
});
