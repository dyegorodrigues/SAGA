import { afterEach, describe, expect, it } from "vitest";
import { construirVolumePrismasF94Spec } from "./volumePrismasContract";

/**
 * CLASS-003 — GM.11/F94.
 *
 * O prisma era um só por nível: 2×2×2, 3×4×3, 2×5×4, 3×4×3 e a base em L com
 * altura 3. A ficha cobra 3 acertos de 3 em 2 sessões, e a frente da CLASS-007
 * ainda pôs um portão de construção na frente — a criança constrói o mesmo
 * prisma seis vezes e o motor conclui domínio de volume.
 *
 * O que continua fixo é o `modo`: contar cubos, multiplicar camadas, fórmula,
 * dimensão faltante e base não retangular são a escada da F94.
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

function amostrar(nivel: number, semente = 0x3c9a15b) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirVolumePrismasF94Spec(nivel));
}

const areaDe = (cells: number[][]) => cells.flat().filter(Boolean).length;

describe("CLASS-003 — GM.11/F94: o prisma muda, a escada não", () => {
  it("nenhum nível devolve sempre o mesmo prisma", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const prismas = new Set(amostrar(nivel).map(s => `${s.baseRows}x${s.baseCols}x${s.altura}:${areaDe(s.baseCells)}`));
      expect(prismas.size, `L${nivel} devolveu sempre ${[...prismas][0]}`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo", () => {
    const modos = ["contar-cubos", "camada-multiplicar", "formula", "dimensao-faltante", "prisma-nao-retangular"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) expect(spec.modo).toBe(modos[nivel - 1]);
    }
  });

  it("área da base, altura e volume continuam coerentes entre si e com os cubos desenhados", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(areaDe(spec.baseCells), `L${nivel} baseCells não bate com areaBase`).toBe(spec.areaBase);
        expect(spec.baseCells.length).toBe(spec.baseRows);
        for (const linha of spec.baseCells) expect(linha.length).toBe(spec.baseCols);
        expect(spec.volume, `L${nivel} volume não é área × altura`).toBe(spec.areaBase * spec.altura);
        expect(spec.altura, `L${nivel} com altura 1 confunde volume e área`).toBeGreaterThan(1);
      }
    }
  });

  it("cada nível respeita a faixa que a escada e o palco exigem", () => {
    // L1 constrói cubo a cubo: o portão da CLASS-007 pede `volume` toques.
    for (const spec of amostrar(1)) {
      expect(spec.volume, "L1 ficaria cansativo de construir").toBeLessThanOrEqual(12);
      expect(spec.baseCells.flat().every(c => c === 1), "L1 usa base retangular").toBe(true);
    }
    for (const nivel of [2, 3, 4]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.baseCells.flat().every(c => c === 1), `L${nivel} usa base retangular`).toBe(true);
        expect(spec.altura, `L${nivel} pede camadas demais`).toBeLessThanOrEqual(5);
      }
    }
    for (const spec of amostrar(5)) {
      expect(spec.areaBase, "L5 precisa de base NÃO retangular").toBeLessThan(spec.baseRows * spec.baseCols);
      expect(spec.areaBase, "L5 ficou com base pequena demais para ler a forma").toBeGreaterThanOrEqual(4);
    }
    for (const spec of amostrar(4)) {
      expect(spec.dimensaoFaltante).toBe("altura");
    }
  });

  it("nenhum distrator colapsa na resposta", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const soma = spec.baseRows + spec.baseCols + spec.altura;
        if (spec.modo === "dimensao-faltante") {
          // Distratores: volume + área, área, e a altura com unidade cúbica.
          expect(spec.areaBase, `L${nivel}: distrator "área" viraria a altura certa`).not.toBe(spec.altura);
          expect(spec.volume + spec.areaBase).not.toBe(spec.altura);
        } else {
          expect(soma, `L${nivel}: distrator "soma das dimensões" viraria o volume`).not.toBe(spec.volume);
          expect(spec.areaBase, `L${nivel}: área e volume iguais apagam a unidade cúbica`).not.toBe(spec.volume);
        }
      }
    }
  });
});
