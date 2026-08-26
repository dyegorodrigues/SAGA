import { afterEach, describe, expect, it } from "vitest";
import { construirCirculoAreasSpec } from "./circuloAreasContract";

/**
 * CLASS-003 — GE.09/F91.
 *
 * As medidas eram uma só por nível: 8×5, 10×6, 7×4, raio 4 e raio 3. A ficha
 * cobra repetição, e a frente da CLASS-007 pôs um portão de transformação na
 * frente — a criança montava, cortava e rearranjava a MESMA figura seis vezes.
 *
 * O que continua fixo é o `modo`: montagem, fórmula, corte, medidas do círculo
 * e área do círculo são a escada da F91.
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

function amostrar(nivel: number, semente = 0x1b7cd42) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirCirculoAreasSpec(nivel));
}

describe("CLASS-003 — GE.09/F91: as medidas mudam, a escada não", () => {
  it("nenhum nível devolve sempre a mesma figura", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const figuras = new Set(amostrar(nivel).map(s => `${s.base}x${s.altura}r${s.raio ?? ""}`));
      expect(figuras.size, `L${nivel} devolveu sempre ${[...figuras][0]}`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo", () => {
    const modos = ["triangulo-montagem", "formula-triangulo", "paralelogramo-corte", "circulo-medidas", "area-circulo"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) expect(spec.modo).toBe(modos[nivel - 1]);
    }
  });

  it("a resposta é a área que a figura do nível realmente tem", () => {
    for (const spec of amostrar(1)) expect(spec.resposta).toBe(String(spec.base * spec.altura / 2));
    for (const spec of amostrar(2)) expect(spec.resposta).toBe(String(spec.base * spec.altura / 2));
    for (const spec of amostrar(3)) expect(spec.resposta).toBe(String(spec.base * spec.altura));
    for (const spec of amostrar(4)) expect(spec.resposta).toBe(`raio-${spec.raio}-diametro-${spec.diametro}`);
    for (const spec of amostrar(5)) expect(spec.resposta).toBe(`${(spec.raio ?? 0) ** 2}π`);
  });

  it("as medidas ficam inteiras e legíveis para a criança", () => {
    for (const nivel of [1, 2]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.base * spec.altura % 2, `L${nivel}: metade de base × altura precisa ser inteira`).toBe(0);
        expect(spec.base).toBeGreaterThanOrEqual(4);
        expect(spec.altura).toBeGreaterThanOrEqual(3);
      }
    }
    for (const spec of amostrar(3)) {
      expect(spec.base * spec.altura % 2, "L3: o distrator de dividir por 2 precisa ser inteiro").toBe(0);
    }
    for (const spec of amostrar(4)) {
      expect(spec.diametro, "diâmetro é o dobro do raio").toBe((spec.raio ?? 0) * 2);
    }
    for (const spec of amostrar(5)) {
      // Com raio 2, o distrator do diâmetro (2r) e o de esquecer a metade (2r²)
      // valem os dois 4π: duas alternativas iguais na tela.
      expect(spec.raio, "raio 2 colapsa dois distratores em L5").toBeGreaterThanOrEqual(3);
      expect(spec.diametro).toBe((spec.raio ?? 0) * 2);
    }
  });

  it("nenhum distrator colapsa na resposta, e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => o.value);
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(new Set(spec.opcoes.map(o => o.label)).size, `L${nivel} repetiu rótulo`).toBe(valores.length);
        expect(valores.filter(v => v === spec.resposta).length, `L${nivel} sem resposta única`).toBe(1);
        const certas = spec.opcoes.filter(o => !o.misconception);
        expect(certas.length, `L${nivel} deveria ter uma alternativa certa`).toBe(1);
        expect(certas[0].value).toBe(spec.resposta);
        expect(spec.opcoes.length, `L${nivel} ficou com poucas alternativas`).toBeGreaterThanOrEqual(3);
      }
    }
  });
});
