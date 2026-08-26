import { afterEach, describe, expect, it } from "vitest";
import { construirConversaoUnidadesSpec } from "./conversaoUnidadesContract";

/**
 * CLASS-003 — GM.10/F93.
 *
 * A conversão era uma só por nível: 1 m, 2 kg, 1,5 m, a porta e 2,5 L. A ficha
 * cobra repetição, então a criança convertia o MESMO número seis vezes — e
 * decorar "100" vencia o nível sem entender o fator.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x77b3e12) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirConversaoUnidadesSpec(nivel));
}

const FATOR: Record<string, number> = { m: 100, kg: 1000, L: 1000 };

describe("CLASS-003 — GM.10/F93: o número muda, a escada não", () => {
  it("nenhum nível devolve sempre a mesma conversão", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const casos = new Set(amostrar(nivel).map(s => `${s.equivalencia.origem}${s.equivalencia.unidadeOrigem}`));
      expect(casos.size, `L${nivel} devolveu sempre ${[...casos][0]}`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo", () => {
    const modos = ["cm-m", "massa-capacidade", "decimal", "unidade-adequada", "problema"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) expect(spec.modo).toBe(modos[nivel - 1]);
    }
  });

  it("a equivalência é verdadeira: o destino é a origem vezes o fator da unidade", () => {
    for (const nivel of [1, 2, 3, 5]) {
      for (const spec of amostrar(nivel)) {
        const { origem, unidadeOrigem, destino } = spec.equivalencia;
        const fator = FATOR[unidadeOrigem];
        expect(fator, `L${nivel}: unidade ${unidadeOrigem} sem fator conhecido`).toBeDefined();
        expect(destino, `L${nivel}: ${origem}${unidadeOrigem} não é ${destino}`).toBe(Math.round(origem * fator));
        expect(spec.resposta).toBe(destino);
      }
    }
  });

  it("o decimal aparece onde a escada o exige, e não onde ela não pede", () => {
    for (const nivel of [1, 2]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.incluiDecimal, `L${nivel} não é nível de decimal`).toBe(false);
        expect(Number.isInteger(spec.equivalencia.origem), `L${nivel} sorteou origem decimal`).toBe(true);
      }
    }
    for (const nivel of [3, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.incluiDecimal, `L${nivel} é nível de decimal`).toBe(true);
        expect(Number.isInteger(spec.equivalencia.origem), `L${nivel} sorteou origem inteira`).toBe(false);
      }
    }
  });

  it("L4 pergunta a unidade adequada de um objeto que muda", () => {
    const specs = amostrar(4);
    expect(new Set(specs.map(s => s.equivalencia.unidadeOrigem)).size, "L4 usa sempre o mesmo objeto").toBeGreaterThan(1);
    for (const spec of specs) {
      expect(typeof spec.resposta, "L4 responde uma unidade, não um número").toBe("string");
      expect(spec.equivalencia.unidadeDestino).toBe(spec.resposta);
    }
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => String(o.value));
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(new Set(spec.opcoes.map(o => o.label)).size, `L${nivel} repetiu rótulo`).toBe(valores.length);
        expect(valores.filter(v => v === String(spec.resposta)).length, `L${nivel} sem resposta única`).toBe(1);
        expect(spec.opcoes.filter(o => !o.misconception).length, `L${nivel} sem alternativa certa única`).toBe(1);
        expect(spec.opcoes.length).toBeGreaterThanOrEqual(3);
      }
    }
  });
});
