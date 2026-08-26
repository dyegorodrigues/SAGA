import { afterEach, describe, expect, it } from "vitest";
import { construirDivisaoLongaSpec } from "./divisaoLongaContract";
import { restoEhValido } from "./divisaoLongaProcedure";

/**
 * CLASS-003 — N4.10/F69 é o primeiro reparo de variedade.
 *
 * A ficha cobra 4 acertos de 4 em 3 sessões: doze respostas. O contrato
 * devolvia `24÷4`, `29÷4`, `84÷4`, `156÷3` e `612÷6` — um caso fixo por nível.
 * Doze respostas ao mesmo item não são prática distribuída.
 *
 * Variedade sozinha não basta: cada nível carrega uma invariante semântica que
 * o caso sorteado precisa respeitar, senão a escada concreto → algoritmo se
 * desfaz. É isso que este arquivo fixa, junto com a variedade.
 */
const AMOSTRAS = 60;

const original = Math.random;
afterEach(() => { Math.random = original; });

function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => {
    estado = (estado * 1664525 + 1013904223) >>> 0;
    return estado / 0x100000000;
  };
}

function amostrar(nivel: number, semente = 0x51f3a7d) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirDivisaoLongaSpec(nivel));
}

describe("CLASS-003 — N4.10/F69: cada nível sorteia o caso e mantém a invariante", () => {
  it("nenhum nível devolve sempre a mesma conta", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const contas = new Set(amostrar(nivel).map(spec => `${spec.dividendo}÷${spec.divisor}`));
      expect(contas.size, `L${nivel} devolveu sempre ${[...contas][0]}`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo: a escada não é sorteada", () => {
    const modos = ["arranjo-exata", "arranjo-resto", "ponte-algoritmo", "algoritmo", "zero-quociente"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) expect(spec.modo).toBe(modos[nivel - 1]);
    }
  });

  it("toda conta sorteada é uma divisão válida", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(restoEhValido(spec.dividendo, spec.divisor, spec.quociente, spec.resto),
          `L${nivel} gerou ${spec.dividendo}÷${spec.divisor} = ${spec.quociente} r ${spec.resto}`).toBe(true);
      }
    }
  });

  it("cada nível respeita a faixa que a escada exige", () => {
    for (const spec of amostrar(1)) {
      expect(spec.resto, "L1 é divisão exata em arranjo").toBe(0);
      expect(spec.dividendo).toBeLessThanOrEqual(50);
    }
    for (const spec of amostrar(2)) {
      expect(spec.resto, "L2 existe para mostrar o resto").toBeGreaterThan(0);
      expect(spec.dividendo).toBeLessThanOrEqual(50);
    }
    for (const spec of amostrar(3)) {
      expect(spec.resto, "L3 é a ponte para o algoritmo, sem resto").toBe(0);
      expect(spec.dividendo, "L3 usa dois dígitos").toBeGreaterThanOrEqual(10);
      expect(spec.dividendo).toBeLessThanOrEqual(99);
    }
    for (const spec of amostrar(4)) {
      expect(spec.dividendo, "L4 usa três dígitos").toBeGreaterThanOrEqual(100);
      expect(spec.dividendo).toBeLessThanOrEqual(999);
    }
    for (const spec of amostrar(5)) {
      expect(String(spec.quociente), `L5 precisa de zero no quociente, veio ${spec.quociente}`).toMatch(/0/);
      expect(spec.resto, "L5 mede o zero posicional, não o resto").toBe(0);
    }
  });

  it("as alternativas nunca repetem a resposta nem somem", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(opcao => opcao.value);
        expect(valores.length, `L${nivel} ficou com ${valores.length} alternativas`).toBeGreaterThanOrEqual(3);
        expect(new Set(valores).size, `L${nivel} repetiu alternativa em ${spec.dividendo}÷${spec.divisor}`).toBe(valores.length);
        expect(valores.filter(valor => valor === spec.resposta).length,
          `L${nivel} não ofereceu a resposta em ${spec.dividendo}÷${spec.divisor}`).toBe(1);
        // Um distrator igual à resposta reprovaria a criança certa.
        const distratores = spec.opcoes.filter(opcao => opcao.misconception).map(opcao => opcao.value);
        expect(distratores, `L${nivel} tem distrator igual à resposta`).not.toContain(spec.resposta);
      }
    }
  });
});
