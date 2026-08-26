import { afterEach, describe, expect, it } from "vitest";
import { avaliarEstimativaF71, construirDivisaoDoisDigitosF71Spec } from "./divisaoDoisDigitosContract";

/**
 * CLASS-003 — N4.12/F71.
 *
 * A conta era uma só por nível: 840÷20, 399÷19, 736÷23, 745÷23 e 2424÷24. A
 * ficha cobra repetição, então a criança estimava o MESMO quociente seis vezes.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x8b25c0f) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirDivisaoDoisDigitosF71Spec(nivel));
}

describe("CLASS-003 — N4.12/F71: a conta muda, a escada não", () => {
  it("nenhum nível devolve sempre a mesma conta", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const contas = new Set(amostrar(nivel).map(s => `${s.dividendo}÷${s.divisor}`));
      expect(contas.size, `L${nivel} devolveu sempre ${[...contas][0]}`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo", () => {
    const modos = ["divisor-redondo", "divisor-quase-redondo", "divisor-geral", "com-resto", "zero-quociente"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) expect(spec.modo).toBe(modos[nivel - 1]);
    }
  });

  it("toda conta fecha, e o divisor tem sempre dois dígitos", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.divisor, `L${nivel}: F71 é divisão por DOIS dígitos`).toBeGreaterThanOrEqual(10);
        expect(spec.divisor).toBeLessThanOrEqual(99);
        expect(spec.divisor * spec.quociente + spec.resto, `L${nivel}: ${spec.dividendo}÷${spec.divisor} não fecha`).toBe(spec.dividendo);
        expect(spec.resto, `L${nivel}: resto ≥ divisor`).toBeLessThan(spec.divisor);
        expect(spec.resto).toBeGreaterThanOrEqual(0);
        expect(spec.divisorArredondado, `L${nivel}: arredondamento não é o da dezena`).toBe(Math.round(spec.divisor / 10) * 10);
      }
    }
  });

  it("cada nível mantém o degrau que ensina", () => {
    for (const spec of amostrar(1)) {
      expect(spec.divisor % 10, "L1 usa divisor redondo").toBe(0);
      expect(spec.resto).toBe(0);
    }
    for (const spec of amostrar(2)) {
      expect(spec.divisorArredondado, "L2 arredonda PARA CIMA: é o que força o ajuste").toBeGreaterThan(spec.divisor);
      expect(spec.ajustePrimeiraEstimativaObrigatorio).toBe(true);
      expect(spec.estimativaInicial, "a primeira estimativa precisa estar errada").not.toBe(spec.quociente);
    }
    for (const spec of amostrar(3)) {
      expect(spec.divisor % 10, "L3 usa divisor geral").not.toBe(0);
      expect(spec.resto).toBe(0);
    }
    for (const spec of amostrar(4)) expect(spec.resto, "L4 existe para mostrar o resto").toBeGreaterThan(0);
    for (const spec of amostrar(5)) {
      expect(String(spec.quociente), `L5 precisa de zero no quociente, veio ${spec.quociente}`).toMatch(/0/);
      expect(spec.quociente).toBeGreaterThanOrEqual(100);
    }
  });

  it("a estimativa inicial é uma aproximação por baixo, nunca um chute que passa", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const passo = spec.quociente >= 100 ? 100 : 10;
        expect(spec.estimativaInicial, `L${nivel}: estimativa não é o quociente arredondado por baixo`)
          .toBe(Math.floor(spec.quociente / passo) * passo);
        const { relacao } = avaliarEstimativaF71(spec, spec.estimativaInicial);
        expect(relacao, `L${nivel}: a primeira estimativa passou do dividendo`).not.toBe("passou");
      }
    }
  });
});
