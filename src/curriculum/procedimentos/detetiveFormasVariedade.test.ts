import { afterEach, describe, expect, it } from "vitest";
import { construirDetetiveFormasSpec } from "./detetiveFormasContract";

/**
 * CLASS-003 — GE.03/F58, nas duas dimensões.
 *
 * A figura era uma só por nível: quadrado, retângulo, círculo e a mesma malha
 * de simetria. Com a figura fixa, as afirmações verdadeiras eram sempre as
 * mesmas — decorar quais marcar vencia o nível sem olhar a forma.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x71ce408) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirDetetiveFormasSpec(nivel));
}

/** O que a forma realmente tem, para conferir cada afirmação. */
const VERDADE: Record<string, { lados: number; cantos: number; curvo: boolean; cantosRetos: boolean }> = {
  circulo: { lados: 0, cantos: 0, curvo: true, cantosRetos: false },
  triangulo: { lados: 3, cantos: 3, curvo: false, cantosRetos: false },
  quadrado: { lados: 4, cantos: 4, curvo: false, cantosRetos: true },
  retangulo: { lados: 4, cantos: 4, curvo: false, cantosRetos: true },
};

describe("CLASS-003 — GE.03/F58: a figura muda, e as afirmações verdadeiras com ela", () => {
  it("nenhum nível devolve sempre a mesma figura nem a mesma resposta", () => {
    for (const nivel of [1, 2, 3, 5]) {
      const specs = amostrar(nivel);
      // Em L5 a resposta é o id de um ponto; o que muda é a GEOMETRIA, então a
      // digital é o eixo e as casas, não o rótulo.
      const casos = new Set(specs.map(s => nivel === 5
        ? `${s.eixoGrade}:${(s.pontos ?? []).map(p => `${p.x},${p.y}`).join("|")}`
        : `${s.figura}/${s.resposta}`));
      expect(casos.size, `L${nivel} devolveu sempre ${[...casos][0]}`).toBeGreaterThan(1);
      if (nivel !== 5) expect(new Set(specs.map(s => s.resposta)).size, `L${nivel} responde sempre igual`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo", () => {
    const modos = ["atributos-lados", "atributos-cantos", "atributos-contorno", "simetria-eixo", "simetria-completar"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) expect(spec.modo).toBe(modos[nivel - 1]);
    }
  });

  it("cada afirmação é verdadeira ou falsa de acordo com a figura desenhada", () => {
    for (const nivel of [1, 2, 3]) {
      for (const spec of amostrar(nivel)) {
        const forma = VERDADE[spec.figura];
        expect(forma, `figura ${spec.figura} sem verdade conhecida`).toBeDefined();
        expect(spec.afirmacoes?.length, `L${nivel} sem afirmações`).toBeGreaterThanOrEqual(3);
        for (const afirmacao of spec.afirmacoes ?? []) {
          const esperado = afirmacao.id === "3-lados" ? forma.lados === 3
            : afirmacao.id === "4-lados" ? forma.lados === 4
            : afirmacao.id === "nenhum-lado-reto" ? forma.lados === 0
            : afirmacao.id === "4-cantos-quadrados" ? forma.cantosRetos
            : afirmacao.id === "3-cantos" ? forma.cantos === 3
            : afirmacao.id === "contorno-curvo" ? forma.curvo
            : afirmacao.id === "tem-cantos" ? forma.cantos > 0
            : afirmacao.id === "tem-lados-retos" ? forma.lados > 0
            : undefined;
          expect(esperado, `afirmação desconhecida: ${afirmacao.id}`).toBeDefined();
          expect(afirmacao.correta, `"${afirmacao.texto}" para ${spec.figura}`).toBe(esperado);
        }
        expect((spec.afirmacoes ?? []).some(a => a.correta), `L${nivel}: nenhuma afirmação verdadeira`).toBe(true);
        expect((spec.afirmacoes ?? []).some(a => !a.correta), `L${nivel}: todas verdadeiras não discrimina`).toBe(true);
      }
    }
  });

  it("L5 completa uma simetria de verdade: o ponto certo é o reflexo pelo eixo", () => {
    for (const spec of amostrar(5)) {
      const eixo = spec.eixoGrade!;
      const certo = (spec.pontos ?? []).find(p => p.resposta)!;
      const origens = (spec.pontos ?? []).filter(p => p.origem);
      expect(origens.length, "L5 precisa de origens").toBeGreaterThanOrEqual(2);
      const reflexos = origens.map(p => ({ x: 2 * eixo - p.x, y: p.y }));
      expect(reflexos.some(r => r.x === certo.x && r.y === certo.y),
        `o ponto certo (${certo.x},${certo.y}) não é reflexo de nenhuma origem pelo eixo ${eixo}`).toBe(true);
      for (const candidato of (spec.pontos ?? []).filter(p => !p.origem && !p.resposta)) {
        const eReflexo = reflexos.some(r => r.x === candidato.x && r.y === candidato.y)
          && !(spec.pontos ?? []).some(p => !p.origem && !p.resposta && p !== candidato && p.x === candidato.x && p.y === candidato.y);
        void eReflexo;
      }
    }
  });
});
