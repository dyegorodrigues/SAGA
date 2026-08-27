import { afterEach, describe, expect, it } from "vitest";
import { construirProblemasMedidaSpec } from "./problemasMedidaContract";

/**
 * CLASS-003, segunda dimensão — GM.09/F82.
 *
 * O problema era um só por nível: 2 m, 3 kg, 2 m contra 150 cm, 1 m mais 75 cm
 * e 2 L com 500 e 250 ml. A resposta certa era 200, 3000, 200, 175 e 1750 —
 * para sempre. A ficha cobra 3 acertos de 3 em 2 sessões.
 *
 * A escada é a GRANDEZA e o número de etapas: converter comprimento, converter
 * massa, comparar depois de converter, operar com unidades mistas, e o problema
 * de três etapas em capacidade. Isso não muda; os valores mudam.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x6c19d3f) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirProblemasMedidaSpec(nivel));
}

describe("CLASS-003 — GM.09/F82: as medidas mudam, a escada não", () => {
  it("nenhum nível mede sempre a mesma coisa nem responde sempre igual", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const specs = amostrar(nivel);
      expect(new Set(specs.map(s => s.resposta)).size, `L${nivel} responde sempre ${specs[0].resposta}`).toBeGreaterThan(1);
      expect(new Set(specs.map(s => s.conversao.valorInicial)).size, `L${nivel} parte sempre de ${specs[0].conversao.valorInicial}`).toBeGreaterThan(1);
    }
  });

  it("o modo, a grandeza e o número de etapas de cada nível continuam fixos", () => {
    const modos = ["converter-comprimento", "converter-grandezas", "comparar-apos-converter", "operar-unidades-mistas", "problema-multietapa"];
    const grandezas = ["comprimento", "massa", "comprimento", "comprimento", "capacidade"];
    const etapas = [1, 1, 2, 2, 3];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.modo).toBe(modos[nivel - 1]);
        expect(spec.grandeza, `L${nivel} trocou a grandeza, que é o degrau`).toBe(grandezas[nivel - 1]);
        expect(spec.etapas).toBe(etapas[nivel - 1]);
        expect(spec.exigeConversaoAntes).toBe(nivel >= 3);
        expect(spec.unidadesMistas).toBe(nivel >= 3);
      }
    }
  });

  it("a conversão declarada fecha com o fator da unidade", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const { valorInicial, valorConvertido, fator } = spec.conversao;
        expect(valorConvertido, `L${nivel}: ${valorInicial} × ${fator} não é ${valorConvertido}`).toBe(valorInicial * fator);
        expect(valorInicial, "converter de zero não ensina nada").toBeGreaterThan(0);
        expect(spec.resposta).toBeGreaterThan(0);
      }
    }
    // Os dois primeiros níveis respondem a própria conversão.
    for (const nivel of [1, 2, 3]) {
      for (const spec of amostrar(nivel)) expect(spec.resposta).toBe(spec.conversao.valorConvertido);
    }
    // L4 soma a medida convertida com a que já estava na unidade menor.
    for (const spec of amostrar(4)) {
      const [, segunda] = spec.valoresOriginais!;
      expect(spec.resposta, "L4 soma o convertido com o resto").toBe(spec.conversao.valorConvertido + segunda.valor);
      expect(segunda.unidade).toBe(spec.unidadeResposta);
    }
  });

  it("os dois valores de um problema misto estão em unidades diferentes", () => {
    for (const nivel of [3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const [primeira, segunda] = spec.valoresOriginais!;
        expect(primeira.unidade, `L${nivel}: as duas medidas na mesma unidade não exigem converter`).not.toBe(segunda.unidade);
        expect(primeira.valor).toBe(spec.conversao.valorInicial);
        expect(primeira.unidade).toBe(spec.conversao.de);
        expect(segunda.unidade).toBe(spec.conversao.para);
      }
    }
    // L3 compara: a medida convertida precisa mesmo ser a maior, senão a
    // resposta deixa de ser a que o enunciado pergunta.
    for (const spec of amostrar(3)) {
      const [, segunda] = spec.valoresOriginais!;
      expect(spec.conversao.valorConvertido, "L3: a convertida precisa vencer a comparação").toBeGreaterThan(segunda.valor);
    }
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => o.value);
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(valores.filter(v => v === spec.resposta).length, `L${nivel} sem resposta única`).toBe(1);
        expect(spec.opcoes.filter(o => !o.misconception).length, `L${nivel} sem alternativa certa única`).toBe(1);
        expect(spec.opcoes.length, `L${nivel} perdeu alternativa por colisão`).toBe(nivel === 5 ? 4 : 3);
        for (const opcao of spec.opcoes) {
          expect(opcao.label, `L${nivel}: o rótulo precisa trazer a unidade`).toBe(`${opcao.value} ${spec.unidadeResposta}`);
          expect(opcao.value, `L${nivel}: alternativa não positiva`).toBeGreaterThan(0);
        }
      }
    }
  });
});
