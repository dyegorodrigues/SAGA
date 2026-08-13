import { describe, expect, it } from "vitest";
import { construirQuadrado100Spec } from "./quadrado100Contract";
import { diagnosticarQuadrado100, evidenciasQuadrado100 } from "./quadrado100Procedure";
import { Quadrado100Evidence, Quadrado100Misconception } from "./quadrado100Semantics";

function sorteioConstante(valor: number): () => number {
  return () => valor;
}

describe("F36 — contrato e procedimento Quadrado100", () => {
  it("L1 e L2 nunca atravessam a borda e preservam seus passos canônicos", () => {
    for (const seed of [0, 0.1, 0.25, 0.5, 0.75, 0.99]) {
      const l1 = construirQuadrado100Spec(1, sorteioConstante(seed));
      expect(l1.caminho.map((n, i) => n - (i === 0 ? l1.inicio : l1.caminho[i - 1]))).toEqual([1, 1, 1]);
      expect(l1.caminho.every(n => Math.floor((n - 1) / 10) === Math.floor((l1.inicio - 1) / 10))).toBe(true);

      const l2 = construirQuadrado100Spec(2, sorteioConstante(seed));
      expect(l2.caminho.map((n, i) => n - (i === 0 ? l2.inicio : l2.caminho[i - 1]))).toEqual([10, 10, 10]);
      expect(l2.caminho.every(n => (n - 1) % 10 === (l2.inicio - 1) % 10)).toBe(true);
    }
  });

  it("L4 sorteia apenas vizinhos geometricamente válidos, sem wrap 10↔11", () => {
    for (let i = 0; i < 200; i += 1) {
      let calls = 0;
      const spec = construirQuadrado100Spec(4, () => ((i + calls++) % 200) / 200);
      expect(spec.caminho).toEqual([spec.alvo]);
      expect(spec.alvo).toBeGreaterThanOrEqual(1);
      expect(spec.alvo).toBeLessThanOrEqual(100);
      expect(spec.alvo - spec.inicio).toBe(spec.passo);
      if (Math.abs(spec.passo) === 1) {
        expect(Math.floor((spec.alvo - 1) / 10)).toBe(Math.floor((spec.inicio - 1) / 10));
      }
    }
  });

  it("L5 cria cinco lacunas únicas, internas ao quadro, e cobra exatamente essas casas", () => {
    const sequencia = [0.02, 0.31, 0.77, 0.14, 0.61, 0.43, 0.92];
    let i = 0;
    const spec = construirQuadrado100Spec(5, () => sequencia[(i++) % sequencia.length]);
    expect(spec.casasOcultas).toHaveLength(5);
    expect(new Set(spec.casasOcultas).size).toBe(5);
    expect(spec.casasOcultas.every(n => n >= 12 && n <= 89)).toBe(true);
    expect([...spec.caminho].sort((a, b) => a - b)).toEqual([...spec.casasOcultas].sort((a, b) => a - b));
  });

  it("um erro lateral isolado em +10 é direção; dois erros andando de um em um viram estratégia SO_CONTA_UM_A_UM", () => {
    const spec = {
      ...construirQuadrado100Spec(2, sorteioConstante(0.3)),
      inicio: 34,
      caminho: [44, 54, 64],
      casasOcultas: [44, 54, 64],
      alvo: 64,
    };

    expect(diagnosticarQuadrado100({
      modo: "vertical",
      inicio: 34,
      caminho: [44, 54, 64],
      toques: [35],
      erros: [35],
      esperado: 44,
      ultimoToque: 35,
      acertosParciais: 0,
      revisoes: 1,
      completo: false,
    }, spec)).toBe(Quadrado100Misconception.CONFUNDE_DIRECAO);

    expect(diagnosticarQuadrado100({
      modo: "vertical",
      inicio: 34,
      caminho: [44, 54, 64],
      toques: [35, 36],
      erros: [35, 36],
      esperado: 44,
      ultimoToque: 36,
      acertosParciais: 0,
      revisoes: 2,
      completo: false,
    }, spec)).toBe(Quadrado100Misconception.SO_CONTA_UM_A_UM);
  });

  it("evidência vertical só nasce quando o percurso +10 termina", () => {
    const spec = construirQuadrado100Spec(2, sorteioConstante(0.4));
    const base = {
      modo: spec.modo,
      inicio: spec.inicio,
      caminho: [...spec.caminho],
      toques: [...spec.caminho],
      erros: [],
      esperado: spec.alvo,
      ultimoToque: spec.alvo,
      acertosParciais: spec.caminho.length,
      revisoes: 0,
    };
    expect(evidenciasQuadrado100({ ...base, completo: false }, spec)).toEqual([]);
    expect(evidenciasQuadrado100({ ...base, completo: true }, spec)).toEqual([
      Quadrado100Evidence.PERCURSO_VERTICAL,
    ]);
  });
});
