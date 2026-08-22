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

const MODOS = {
  1: "aditiva-curta",
  2: "aditiva-ampla",
  3: "aditiva-decrescente",
  4: "lacuna-meio",
  5: "multiplicativa",
} as const;

type ModoF57 = typeof MODOS[keyof typeof MODOS];
type OperacaoF57 = "somar" | "multiplicar";

interface SpecF57 {
  nivel: number;
  modo: ModoF57;
  termos: Array<number | null>;
  indiceLacuna: number;
  resposta: number;
  regra: { operacao: OperacaoF57; valor: number; rotulo: string };
  diferencasVisiveis: boolean;
}

function aplicar(regra: SpecF57["regra"], valor: number): number {
  return regra.operacao === "somar" ? valor + regra.valor : valor * regra.valor;
}

describe("W14 regression-first — AL.04/F57", () => {
  afterEach(() => {
    COMPOSER_CANARIES.clear();
    for (const id of CANARIOS_ORIGINAIS) COMPOSER_CANARIES.add(id);
  });

  it("parte de fallback real, com AL.03 e N3.09 já servidos pelo Composer", () => {
    rollbackComposerCanary("AL.04");
    expect(getTrackById("AL.04")?.generatorSource).toBe("fallback");
    expect(getTrackById("AL.04")?.contentStatus).toBe("fallback");
    expect(getTrackById("AL.04")?.prereqs).toEqual(["AL.03", "N3.09"]);
    expect(getTrackById("AL.03")?.generatorSource).toBe("composer");
    expect(getTrackById("N3.09")?.generatorSource).toBe("composer");
  });

  it("materializa os cinco degraus canônicos F57 pela porta registrada e inativa", () => {
    expect(() => enableComposerCanary("AL.04")).not.toThrow();
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("AL.04", nivel);
      const spec = q.uiProps as SpecF57;
      expect(q.kind).toBe("regra-sequencia-f57");
      expect(q.isFallback).not.toBe(true);
      expect(spec.nivel).toBe(nivel);
      expect(spec.modo).toBe(MODOS[nivel as keyof typeof MODOS]);
      expect(spec.termos.filter(termo => termo === null)).toHaveLength(1);
      expect(spec.termos[spec.indiceLacuna]).toBeNull();
      expect(q.answer).toBe(String(spec.resposta));
      expect(q.evaluate?.(String(spec.resposta))).toBe(true);
      expect(q.evaluate?.(String(spec.resposta + 1))).toBe(false);
      expect(q.masteryRule).toEqual({
        acertos: 3,
        de: 3,
        sessoes: 2,
        evidenciasDistintas: {
          prefixo: "regra-sequencia-desafio:",
          minimo: 1,
          descricao: "Resolver pelo menos uma sequência decrescente ou com lacuna no meio.",
        },
      });
      expect(q.resolucao?.passos.at(-1)?.parcial).toBe(String(spec.resposta));
      expect(shouldRenderQuestionOptions(q)).toBe(false);
    }
  });

  it("mantém a progressão da ficha: arcos nos níveis 1-2 e retirada do andaime depois", () => {
    enableComposerCanary("AL.04");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const spec = generateRegisteredFichaQuestion("AL.04", nivel).uiProps as SpecF57;
      expect(spec.diferencasVisiveis).toBe(nivel <= 2);
    }
  });

  it("nível 4 coloca a lacuna no meio e exige aplicar a mesma regra dos dois lados", () => {
    enableComposerCanary("AL.04");
    const spec = generateRegisteredFichaQuestion("AL.04", 4).uiProps as SpecF57;
    expect(spec.indiceLacuna).toBeGreaterThan(0);
    expect(spec.indiceLacuna).toBeLessThan(spec.termos.length - 1);
    const anterior = spec.termos[spec.indiceLacuna - 1];
    const seguinte = spec.termos[spec.indiceLacuna + 1];
    expect(anterior).not.toBeNull();
    expect(seguinte).not.toBeNull();
    expect(aplicar(spec.regra, anterior!)).toBe(spec.resposta);
    expect(aplicar(spec.regra, spec.resposta)).toBe(seguinte);
  });

  it("nível 5 é multiplicativo, não uma soma inferida só do último par", () => {
    enableComposerCanary("AL.04");
    const spec = generateRegisteredFichaQuestion("AL.04", 5).uiProps as SpecF57;
    expect(spec.regra.operacao).toBe("multiplicar");
    expect(spec.regra.valor).toBeGreaterThan(1);
    expect(spec.indiceLacuna).toBe(spec.termos.length - 1);
  });

  it("mantém os três diagnósticos canônicos alcançáveis pela resolução R0-A", () => {
    enableComposerCanary("AL.04");
    const corrigidos = new Set<string>();
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("AL.04", nivel);
      for (const passo of q.resolucao?.passos ?? []) {
        for (const tag of passo.corrige ?? []) corrigidos.add(tag);
      }
    }
    expect(corrigidos).toEqual(new Set(["so-ultimo-par", "soma-quando-multiplica", "ignora-direcao"]));
  });
});
