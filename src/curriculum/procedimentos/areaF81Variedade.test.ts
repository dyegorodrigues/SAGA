import { afterEach, describe, expect, it } from "vitest";
import { construirAreaF81Spec } from "./areaF81Contract";

/**
 * CLASS-003 — GM.08/F81.
 *
 * A região era uma só por nível: 3×4, 4×6, 5×7, 3×5 e o par 3×4+2×4. A ficha
 * cobra repetição, então a criança contava a MESMA malha seis vezes.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x4d0b7a1) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirAreaF81Spec(nivel));
}

describe("CLASS-003 — GM.08/F81: a região muda, a escada não", () => {
  it("nenhum nível devolve sempre a mesma região", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const regioes = new Set(amostrar(nivel).map(s => s.regioes.map(r => `${r.rows}x${r.cols}`).join("+")));
      expect(regioes.size, `L${nivel} devolveu sempre ${[...regioes][0]}`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo", () => {
    const modos = ["contar-quadrados", "linhas-colunas", "formula", "area-vs-perimetro", "compor-areas"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) expect(spec.modo).toBe(modos[nivel - 1]);
    }
  });

  it("área e perímetro são os da região desenhada", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const soma = spec.regioes.reduce((total, r) => total + r.rows * r.cols, 0);
        expect(spec.area, `L${nivel} área não é a soma das regiões`).toBe(soma);
        expect(spec.resposta).toBe(spec.area);
        expect(spec.perimetro, `L${nivel} perímetro não é 2(l+a) do contorno`).toBe(2 * (spec.rows + spec.cols));
        expect(spec.rows * spec.cols, `L${nivel}: as regiões precisam preencher o contorno`).toBe(spec.area);
      }
    }
    for (const spec of amostrar(5)) {
      expect(spec.regioes.length, "L5 compõe mais de uma região").toBeGreaterThan(1);
    }
  });

  it("nenhum distrator vira resposta certa", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        // Área igual ao perímetro tornaria o distrator de confusão correto;
        // área igual a linhas+colunas faria o mesmo com "contou um a um".
        expect(spec.area, `L${nivel}: área e perímetro coincidem`).not.toBe(spec.perimetro);
        expect(spec.area, `L${nivel}: área igual a linhas+colunas`).not.toBe(spec.rows + spec.cols);
        const valores = spec.opcoes.map(o => o.value);
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(valores.filter(v => v === spec.resposta).length).toBe(1);
        expect(spec.opcoes.filter(o => !o.misconception).length).toBe(1);
        expect(spec.opcoes.length).toBeGreaterThanOrEqual(3);
      }
    }
  });
});
