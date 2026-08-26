import { afterEach, describe, expect, it } from "vitest";
import { construirPerimetroSpec } from "./perimetroContract";

/**
 * CLASS-003 — GM.07/F63.
 *
 * A figura era uma só por nível: 3×2, 5×3, o L de lados [4,2,1,1,3,3], 4×3 e
 * 5×4. A ficha cobra repetição, então a criança media a MESMA borda seis vezes.
 *
 * A medição também encontrou uma incoerência que o caso fixo carregava: em L3
 * os lados descrevem um L de área 11, e o spec declarava `area: 8`. A área
 * alimenta o distrator `CONFUNDE_COM_AREA` — uma criança que calculasse a área
 * de verdade não acharia a própria conta entre as alternativas.
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

function amostrar(nivel: number, semente = 0x6f1a29d) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirPerimetroSpec(nivel));
}

describe("CLASS-003 — GM.07/F63: a figura muda, a escada não", () => {
  it("nenhum nível devolve sempre a mesma figura", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const figuras = new Set(amostrar(nivel).map(s => s.lados.join("-")));
      expect(figuras.size, `L${nivel} devolveu sempre ${[...figuras][0]}`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo", () => {
    const modos = ["contar-malha", "somar-lados", "figura-irregular", "perimetro-vs-area", "lado-faltante"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) expect(spec.modo).toBe(modos[nivel - 1]);
    }
  });

  it("perímetro é a soma dos lados, e a área é a da figura desenhada", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.perimetro, `L${nivel} perímetro não é a soma dos lados`)
          .toBe(spec.lados.reduce((soma, lado) => soma + lado, 0));
        expect(spec.perimetro, `L${nivel}: a borda de ${spec.largura}×${spec.altura} mede 2(l+a)`)
          .toBe(2 * (spec.largura + spec.altura));
        expect(spec.area, `L${nivel} sem área`).toBeGreaterThan(0);
        expect(spec.area, `L${nivel}: área maior que o retângulo que a contém`)
          .toBeLessThanOrEqual(spec.largura * spec.altura);
      }
    }
    // Retângulos: a área é exatamente largura × altura.
    for (const nivel of [1, 2, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.lados.length, `L${nivel} é retângulo`).toBe(4);
        expect(spec.area).toBe(spec.largura * spec.altura);
      }
    }
    // L3 é irregular: mais de quatro lados e área menor que a do retângulo.
    for (const spec of amostrar(3)) {
      expect(spec.lados.length, "L3 precisa de figura irregular").toBeGreaterThan(4);
      expect(spec.area).toBeLessThan(spec.largura * spec.altura);
      // O L é o retângulo menos a mordida, e a mordida está nos próprios lados:
      // [largura, altura-h, w, h, largura-w, altura]. Área declarada que não
      // fecha com o desenho quebra o distrator CONFUNDE_COM_AREA — a criança
      // que calcula a área de verdade não acha a própria conta na tela.
      const [, , w, h] = spec.lados;
      expect(spec.area, `L3: area declarada nao fecha com os lados ${spec.lados.join(",")}`)
        .toBe(spec.largura * spec.altura - w * h);
    }
  });

  it("L5 pergunta um lado que existe na figura", () => {
    for (const spec of amostrar(5)) {
      expect(spec.ladoFaltante, "L5 precisa do lado que falta").toBeDefined();
      expect(spec.lados, "o lado perguntado precisa ser um lado da figura").toContain(spec.ladoFaltante!);
      expect(spec.resposta).toBe(spec.ladoFaltante);
    }
  });

  it("as alternativas continuam íntegras e nenhuma repete a resposta", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => o.value);
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(valores.filter(v => v === spec.resposta).length, `L${nivel} sem resposta única`).toBe(1);
        expect(spec.opcoes.filter(o => !o.misconception).length, `L${nivel} sem alternativa certa única`).toBe(1);
        expect(spec.opcoes.length, `L${nivel} ficou com poucas alternativas`).toBeGreaterThanOrEqual(3);
        // Área e perímetro iguais tornariam o distrator de confusão correto.
        if (nivel !== 5) expect(spec.area, `L${nivel}: área e perímetro coincidem`).not.toBe(spec.perimetro);
      }
    }
  });
});
