import { afterEach, describe, expect, it } from "vitest";
import { construirParesImparesF38Spec } from "./paresImparesContract";

/**
 * CLASS-003, segunda dimensão — N2.06/F38.
 *
 * A quantidade era uma só por nível: 8, 15, 0, 47 e 14. A resposta certa era
 * Par, Ímpar, Par, Ímpar, Par — nessa ordem, para sempre, entre duas
 * alternativas. Decorar cinco palavras vencia a competência sem a criança
 * formar uma dupla.
 *
 * O degrau continua: formar duplas até 10, até 20, decidir sem formar, a regra
 * do último algarismo, e a paridade de uma soma. O que muda é a quantidade.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x2ef50c9) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirParesImparesF38Spec(nivel));
}

describe("CLASS-003 — N2.06/F38: a quantidade muda, a escada não", () => {
  it("nenhum nível responde sempre par nem sempre ímpar", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const specs = amostrar(nivel);
      expect(new Set(specs.map(s => s.resposta)).size, `L${nivel} responde sempre ${specs[0].resposta === 1 ? "Par" : "Ímpar"}`).toBe(2);
      expect(new Set(specs.map(s => s.quantidade)).size, `L${nivel} mostra sempre ${specs[0].quantidade}`).toBeGreaterThan(1);
    }
  });

  it("a etapa e o escopo de cada nível continuam fixos", () => {
    const etapas = ["formar-duplas-10", "formar-duplas-20", "decidir-visual", "ultimo-algarismo", "regra-soma"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.etapa).toBe(etapas[nivel - 1]);
        expect(spec.formarDuplas, `L${nivel}: formar duplas é o degrau de L1 e L2`).toBe(nivel <= 2);
        expect(spec.regraUltimoAlgarismo === true, `L${nivel}: a regra do último algarismo é L4`).toBe(nivel === 4);
        expect(spec.soma !== undefined, `L${nivel}: a soma é L5`).toBe(nivel === 5);
      }
    }
    for (const spec of amostrar(1)) expect(spec.quantidade, "L1 forma duplas até 10").toBeLessThanOrEqual(10);
    for (const spec of amostrar(2)) {
      expect(spec.quantidade, "L2 vai de 11 a 20").toBeGreaterThan(10);
      expect(spec.quantidade).toBeLessThanOrEqual(20);
    }
    for (const spec of amostrar(4)) {
      expect(spec.quantidade, "a regra do último algarismo precisa de mais de um algarismo").toBeGreaterThan(20);
    }
  });

  it("a resposta é a paridade da quantidade desenhada, e o zero continua aparecendo", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.resposta, `L${nivel}: ${spec.quantidade} não é ${spec.resposta === 1 ? "par" : "ímpar"}`)
          .toBe(spec.quantidade % 2 === 0 ? 1 : 0);
      }
    }
    // Zero é par, e é o caso que a ficha nomeia num erro típico próprio. Ele
    // sai do caso fixo mas não pode sumir do corpus: sem ele, ZERO_IMPAR fica
    // sendo um erro que a tela nunca dá chance de cometer.
    const comZero = amostrar(3).filter(spec => spec.quantidade === 0);
    expect(comZero.length, "L3 precisa continuar sorteando o zero").toBeGreaterThan(0);
    for (const spec of comZero) {
      expect(spec.resposta, "zero é par").toBe(1);
      expect(spec.opcoes.find(o => o.misconception)?.misconception, "no zero o erro nomeado é achar que ele é ímpar").toBe("zero-impar");
    }
  });

  it("a soma de L5 é a conta da quantidade que ela mostra", () => {
    for (const spec of amostrar(5)) {
      expect(spec.soma!.a + spec.soma!.b, "a soma precisa dar a quantidade").toBe(spec.quantidade);
      expect(spec.soma!.a).toBeGreaterThan(0);
      expect(spec.soma!.b).toBeGreaterThan(0);
    }
    // As duas paridades de parcela precisam aparecer: par+par, ímpar+ímpar e
    // par+ímpar produzem resultados diferentes, e é isso que o nível ensina.
    const combinacoes = new Set(amostrar(5).map(s => `${s.soma!.a % 2}${s.soma!.b % 2}`));
    expect(combinacoes.size, "L5 precisa variar a paridade das parcelas").toBeGreaterThan(2);
  });

  it("as duas alternativas continuam íntegras e o erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.opcoes, `L${nivel} perdeu alternativa`).toHaveLength(2);
        expect(spec.opcoes.map(o => o.label)).toEqual(["Par", "Ímpar"]);
        expect(spec.opcoes.filter(o => !o.misconception), `L${nivel} sem alternativa certa única`).toHaveLength(1);
        expect(spec.opcoes.find(o => !o.misconception)!.value).toBe(spec.resposta);
      }
    }
  });
});
