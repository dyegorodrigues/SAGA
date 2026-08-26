import { afterEach, describe, expect, it } from "vitest";
import { construirSolidosGeometricosF59Spec } from "./solidosGeometricosContract";

/**
 * CLASS-003 — GE.04/F59.
 *
 * O sólido era um só por nível: cubo, cone, esfera, cubo, cubo. A ficha cobra
 * 3 acertos de 3 em 2 sessões, e a frente da CLASS-007 tornou o experimento
 * obrigatório — a criança testava a MESMA esfera na MESMA rampa seis vezes, e
 * a resposta certa era sempre a primeira alternativa.
 *
 * Aqui o sorteio é de sólido, não de número, e por isso a resposta deixa de ser
 * sempre "sim": um cubo na rampa não rola, e uma esfera não empilha.
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

function amostrar(nivel: number, semente = 0x5ae91c3) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirSolidosGeometricosF59Spec(nivel));
}

describe("CLASS-003 — GE.04/F59: o sólido muda, a escada não", () => {
  it("nenhum nível devolve sempre o mesmo sólido", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const solidos = new Set(amostrar(nivel).map(s => s.solido));
      expect(solidos.size, `L${nivel} devolveu sempre ${[...solidos][0]}`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo", () => {
    const modos = ["nomear-basicos", "nomear-familia", "testar-rolagem", "testar-empilhamento", "contar-elementos"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) expect(spec.modo).toBe(modos[nivel - 1]);
    }
  });

  it("o experimento diz a verdade sobre o sólido sorteado", () => {
    const rola: Record<string, boolean> = { esfera: true, cilindro: true, cone: true, cubo: false, piramide: false };
    const empilha: Record<string, boolean> = { esfera: false, cilindro: true, cone: true, cubo: true, piramide: true };
    for (const spec of amostrar(3)) {
      expect(spec.experimento).toBe("rampa");
      expect(spec.resultadoExperimento, `${spec.solido} na rampa`).toBe(rola[spec.solido]);
    }
    for (const spec of amostrar(4)) {
      expect(spec.experimento).toBe("empilhar");
      expect(spec.resultadoExperimento, `${spec.solido} empilhado`).toBe(empilha[spec.solido]);
    }
  });

  it("a resposta certa deixa de ser sempre a mesma: às vezes é 'não'", () => {
    for (const nivel of [3, 4]) {
      const certas = amostrar(nivel).map(spec => spec.opcoes.find(o => o.value === spec.resposta)?.label);
      expect(new Set(certas).size, `L${nivel} respondeu sempre "${certas[0]}"`).toBeGreaterThan(1);
    }
  });

  it("L5 só usa sólido com contagem que uma criança consegue conferir", () => {
    for (const spec of amostrar(5)) {
      expect(["cubo", "piramide"], `L5 sorteou ${spec.solido}, cuja contagem é discutível`).toContain(spec.solido);
      expect(spec.contagem, "L5 precisa da contagem").toBeDefined();
      const { faces, vertices, arestas } = spec.contagem!;
      expect(faces + vertices - arestas, `${spec.solido} não fecha a relação de Euler`).toBe(2);
    }
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => o.value);
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(new Set(spec.opcoes.map(o => o.label)).size, `L${nivel} repetiu rótulo em ${spec.solido}`).toBe(valores.length);
        expect(valores.filter(v => v === spec.resposta).length, `L${nivel} sem resposta única`).toBe(1);
        const certas = spec.opcoes.filter(o => !o.misconception);
        expect(certas.length, `L${nivel} deveria ter uma alternativa certa`).toBe(1);
        expect(certas[0].value).toBe(spec.resposta);
      }
    }
  });
});
