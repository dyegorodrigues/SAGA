import { afterEach, describe, expect, it } from "vitest";
import { construirExpressaoF77Spec } from "./expressaoF77Contract";

/**
 * CLASS-003, segunda dimensão — AL.06/F77.
 *
 * A expressão era uma só por nível: 18÷3×2, 2+3×4, (2+3)×4, 3+□×2=11 e
 * (4+3)×5. A resposta certa era 12, 14, 20, 4 e 35 — para sempre. A ficha
 * cobra 3 acertos de 3 em 2 sessões, e cinco números decorados bastavam.
 *
 * A escada é a ORDEM que cada nível ensina: mesma ordem, precedência,
 * parênteses, incógnita no meio, distributiva. Os números é que mudam.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x35d9ab7) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirExpressaoF77Spec(nivel));
}

/** Avalia a expressão do spec como a matemática manda, para conferir a chave. */
function avaliar(expressao: string): number {
  const limpo = expressao.replace(/×/g, "*").replace(/÷/g, "/").replace(/\s+/g, "");
  if (!/^[\d+\-*/()]+$/.test(limpo)) throw new Error(`expressão não avaliável: ${expressao}`);
  // eslint-disable-next-line no-new-func
  return Function(`"use strict";return (${limpo});`)() as number;
}

describe("CLASS-003 — AL.06/F77: os números mudam, a ordem não", () => {
  it("nenhum nível mostra sempre a mesma expressão nem responde sempre igual", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const specs = amostrar(nivel);
      expect(new Set(specs.map(s => s.expressao)).size, `L${nivel} mostra sempre ${specs[0].expressao}`).toBeGreaterThan(1);
      expect(new Set(specs.map(s => s.resposta)).size, `L${nivel} responde sempre ${specs[0].resposta}`).toBeGreaterThan(1);
    }
  });

  it("o modo e a forma da expressão de cada nível continuam fixos", () => {
    const modos = ["mesma-ordem", "precedencia", "parenteses", "incognita-meio", "propriedades"];
    const formas = [/^\d+ ÷ \d+ × \d+$/, /^\d+ \+ \d+ × \d+$/, /^\(\d+ \+ \d+\) × \d+$/, /^\d+ \+ □ × \d+$/, /^\(\d+ \+ \d+\) × \d+$/];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.modo).toBe(modos[nivel - 1]);
        expect(spec.expressao, `L${nivel} mudou a forma da expressão, que é o degrau`).toMatch(formas[nivel - 1]);
        expect(spec.prioridade.length, `L${nivel} sem pacote prioritário`).toBeGreaterThan(0);
      }
    }
  });

  it("a resposta é o valor da expressão desenhada", () => {
    for (const nivel of [1, 2, 3, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(avaliar(spec.expressao), `L${nivel}: ${spec.expressao} não vale ${spec.resposta}`).toBe(spec.resposta);
      }
    }
    // L4 tem incógnita: substituir a resposta no lugar do quadrado fecha a conta.
    for (const spec of amostrar(4)) {
      expect(avaliar(spec.expressao.replace("□", String(spec.resposta))), `L4: ${spec.expressao} com ${spec.resposta} não dá ${spec.ladoDireito}`)
        .toBe(Number(spec.ladoDireito));
    }
    // L5 declara a forma distribuída, e ela precisa valer o mesmo.
    for (const spec of amostrar(5)) {
      expect(avaliar(spec.ladoDireito), `L5: ${spec.ladoDireito} não é equivalente a ${spec.expressao}`).toBe(spec.resposta);
    }
    // L1 é o único que divide: a divisão precisa ser exata, senão a "mesma
    // ordem" produz um número quebrado que o nível não sabe escrever.
    for (const spec of amostrar(1)) {
      const [a, b] = spec.expressao.split(" ÷ ");
      expect(Number(a) % Number(b.split(" × ")[0]), `L1: ${spec.expressao} não divide exato`).toBe(0);
    }
  });

  it("cada nível continua nomeando o erro que ele existe para pegar", () => {
    const esperado: Record<number, string | undefined> = {
      1: undefined, 2: "resolve-da-esquerda", 3: "ignora-parenteses", 4: "so-incognita-no-fim", 5: undefined,
    };
    for (const nivel of [2, 3, 4]) {
      for (const spec of amostrar(nivel)) {
        const errado = spec.opcoes.find(o => o.misconception === esperado[nivel]);
        expect(errado, `L${nivel} perdeu o distrator ${esperado[nivel]}`).toBeDefined();
        // O distrator precisa ser o resultado do erro, não um número qualquer.
        if (nivel === 2) {
          const [a, resto] = spec.expressao.split(" + ");
          const [b, c] = resto.split(" × ");
          expect(errado!.value, "somar antes de multiplicar").toBe((Number(a) + Number(b)) * Number(c));
        }
        if (nivel === 3) {
          const [dentro, c] = spec.expressao.replace("(", "").split(") × ");
          const [a, b] = dentro.split(" + ");
          expect(errado!.value, "ignorar o parêntese").toBe(Number(a) + Number(b) * Number(c));
        }
        if (nivel === 4) {
          const [a, resto] = spec.expressao.split(" + ");
          const c = Number(resto.split(" × ")[1]);
          // Quem trata a incógnita como se fosse o último operando resolve
          // "a + □ = resultado" e entrega a diferença, esquecendo o "× c".
          expect(c, "L4 sem multiplicador").toBeGreaterThan(1);
          expect(errado!.value, "tratar a incógnita como se estivesse no fim").toBe(Number(spec.ladoDireito) - Number(a));
        }
      }
    }
  });

  it("as alternativas continuam íntegras", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => o.value);
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(valores.filter(v => v === spec.resposta).length, `L${nivel} sem resposta única`).toBe(1);
        expect(spec.opcoes.find(o => o.value === spec.resposta)?.misconception, `L${nivel} marcou a certa como erro`).toBeUndefined();
        expect(spec.opcoes, `L${nivel} perdeu alternativa por colisão`).toHaveLength(4);
        for (const opcao of spec.opcoes) {
          expect(opcao.label, `L${nivel}: rótulo não é o valor`).toBe(String(opcao.value));
          expect(opcao.value, `L${nivel}: alternativa negativa`).toBeGreaterThan(0);
        }
      }
    }
  });
});
