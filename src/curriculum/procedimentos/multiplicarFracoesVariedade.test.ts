import { afterEach, describe, expect, it } from "vitest";
import { construirMultiplicarFracoesF86Spec } from "./multiplicarFracoesContract";

/**
 * CLASS-003 — N5.05/F86, nas duas dimensões.
 *
 * A conta era uma só por nível — 1/2×8, 2/3×12, 1/2×3/4, 2/3×3/5, 2÷1/4 — e com
 * ela a resposta. Decorar "4" vencia L1.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x5c81ae3) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirMultiplicarFracoesF86Spec(nivel));
}
const fracao = (t: string) => { const [n, d] = t.split("/").map(Number); return { n, d: d ?? 1 }; };

describe("CLASS-003 — N5.05/F86: a conta muda, e a resposta com ela", () => {
  it("nenhum nível devolve sempre a mesma conta nem a mesma resposta", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const specs = amostrar(nivel);
      expect(new Set(specs.map(s => s.expressao)).size, `L${nivel} repete a expressão`).toBeGreaterThan(1);
      expect(new Set(specs.map(s => s.respostaLabel)).size, `L${nivel} responde sempre ${specs[0].respostaLabel}`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo", () => {
    const modos = ["fracao-inteiro", "fracao-inteiro-modelo", "fracao-fracao-area", "fracao-fracao-simbolico", "divisao-fracoes"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) expect(spec.modo).toBe(modos[nivel - 1]);
    }
  });

  it("a conta é verdadeira, e a grade desenha exatamente ela", () => {
    for (const spec of amostrar(1)) {
      const a = fracao(spec.fatorA); const inteiro = Number(spec.fatorB);
      expect(inteiro % a.d, "a fração precisa caber inteira no número").toBe(0);
      expect(a.n, "fração imprópria faria a resposta ser o próprio inteiro").toBeLessThan(a.d);
      expect(spec.resposta).toBe(inteiro * a.n / a.d);
      expect(spec.rows * spec.cols, "a grade representa o inteiro").toBe(inteiro);
      expect(spec.activeCells.length, "as casas pintadas são a resposta").toBe(Number(spec.resposta));
    }
    for (const spec of amostrar(2)) {
      const a = fracao(spec.fatorA); const inteiro = Number(spec.fatorB);
      expect(inteiro % a.d).toBe(0);
      expect(a.n, "fração imprópria faria a resposta ser o próprio inteiro").toBeLessThan(a.d);
      expect(spec.resposta).toBe(inteiro * a.n / a.d);
      expect(spec.rows * spec.cols).toBe(inteiro);
      expect(spec.activeCells.length).toBe(Number(spec.resposta));
    }
    for (const nivel of [3, 4]) {
      for (const spec of amostrar(nivel)) {
        const a = fracao(spec.fatorA); const b = fracao(spec.fatorB);
        expect(spec.rows, "as linhas são o denominador do primeiro fator").toBe(a.d);
        expect(spec.cols, "as colunas são o denominador do segundo").toBe(b.d);
        const r = fracao(String(spec.resposta));
        expect(r.n * (a.d * b.d), `L${nivel}: ${spec.expressao} não dá ${spec.resposta}`).toBe(a.n * b.n * r.d);
      }
    }
    for (const spec of amostrar(5)) {
      const b = fracao(spec.fatorB);
      expect(b.n, "L5 divide por fração unitária").toBe(1);
      expect(spec.resposta, "quantos b cabem em a").toBe(Number(spec.fatorA) * b.d);
    }
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.respostaLabel).toBe(String(spec.resposta));
      }
    }
  });
});
