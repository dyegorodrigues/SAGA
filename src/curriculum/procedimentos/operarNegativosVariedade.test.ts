import { afterEach, describe, expect, it } from "vitest";
import { construirOperarNegativosSpec } from "./operarNegativosContract";

/**
 * CLASS-003 — N7.02/F85.
 *
 * A conta era uma só por nível: 4 + (−6), −7 + 3, −3 + (−4), −2 − (−5) e
 * −4 + 7 − (−3) + (−2). A ficha cobra repetição, então a criança andava a
 * MESMA reta seis vezes.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x9c4d203) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirOperarNegativosSpec(nivel));
}

/** Lê a expressão de volta em números, para conferir que a conta fecha. */
const numeros = (expressao: string) =>
  (expressao.replace(/−/g, "-").match(/-?\d+/g) ?? []).map(Number);

describe("CLASS-003 — N7.02/F85: a conta muda, a escada não", () => {
  it("nenhum nível devolve sempre a mesma expressão", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const casos = new Set(amostrar(nivel).map(s => s.expressao));
      expect(casos.size, `L${nivel} devolveu sempre ${[...casos][0]}`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo", () => {
    const modos = ["soma-pos-neg", "soma-neg-pos", "dois-negativos", "subtracao-negativo", "expressoes-mistas"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) expect(spec.modo).toBe(modos[nivel - 1]);
    }
  });

  it("os saltos contam a mesma história da expressão, e terminam na resposta", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.movimentos[0], `L${nivel}: o primeiro salto é a posição inicial`).toBe(spec.posicaoInicial);
        expect(spec.movimentos[spec.movimentos.length - 1], `L${nivel}: o último salto é a resposta`).toBe(spec.resposta);
        expect(numeros(spec.expressao)[0], `L${nivel}: a expressão começa onde o ponto começa`).toBe(spec.posicaoInicial);
        for (const passo of spec.movimentos) {
          expect(passo, `L${nivel}: salto ${passo} fora da reta`).toBeGreaterThanOrEqual(spec.inicio);
          expect(passo).toBeLessThanOrEqual(spec.fim);
        }
      }
    }
  });

  it("cada nível mantém o sinal que a escada ensina", () => {
    for (const spec of amostrar(1)) {
      expect(spec.posicaoInicial, "L1 parte de um positivo").toBeGreaterThan(0);
      expect(spec.resposta, "L1 soma um negativo maior: cruza o zero").toBeLessThan(0);
      expect(spec.cruzaZero).toBe(true);
    }
    for (const spec of amostrar(2)) {
      expect(spec.posicaoInicial, "L2 parte de um negativo").toBeLessThan(0);
      expect(spec.resposta, "L2 soma um positivo menor: não cruza").toBeLessThan(0);
      expect(spec.cruzaZero).toBe(false);
    }
    for (const spec of amostrar(3)) {
      expect(spec.posicaoInicial).toBeLessThan(0);
      expect(spec.resposta, "somar dois negativos vai mais para a esquerda").toBeLessThan(spec.posicaoInicial);
    }
    for (const spec of amostrar(4)) {
      expect(spec.expressao, "L4 subtrai um negativo").toContain("− (−");
      expect(spec.resposta, "subtrair negativo anda para a direita").toBeGreaterThan(spec.posicaoInicial);
    }
    for (const spec of amostrar(5)) {
      expect(spec.movimentos.length, "L5 é expressão de vários passos").toBeGreaterThan(3);
    }
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => String(o.value));
        expect(new Set(valores).size, `L${nivel} repetiu valor em ${spec.expressao}`).toBe(valores.length);
        expect(valores.filter(v => v === String(spec.resposta)).length, `L${nivel} sem resposta única`).toBe(1);
        expect(spec.opcoes.filter(o => !o.misconception).length, `L${nivel} sem alternativa certa única`).toBe(1);
        expect(spec.opcoes.length).toBeGreaterThanOrEqual(3);
      }
    }
  });
});
