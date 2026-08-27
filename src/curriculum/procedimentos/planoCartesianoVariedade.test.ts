import { afterEach, describe, expect, it } from "vitest";
import { construirPlanoCartesianoF80Spec } from "./planoCartesianoContract";

/**
 * CLASS-003, segunda dimensão — GE.08/F80.
 *
 * O ponto era sempre o mesmo: (3,2), (2,3), (3,2), (1,3) e (3,3). A ficha
 * cobra 3 acertos de 3 em 2 sessões, e decorar cinco pares vencia a
 * competência sem a criança sair da origem uma vez.
 *
 * A malha continua indo até 3 nos dois eixos — é o escopo declarado da ficha.
 * O que passa a variar é o ponto dentro dela.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x2b7e491) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirPlanoCartesianoF80Spec(nivel));
}

describe("CLASS-003 — GE.08/F80: o ponto muda, a malha não", () => {
  it("nenhum nível marca sempre o mesmo ponto", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const specs = amostrar(nivel);
      expect(new Set(specs.map(s => s.resposta)).size, `L${nivel} responde sempre ${specs[0].resposta}`).toBeGreaterThan(1);
    }
  });

  it("o modo e as chaves de cena de cada nível continuam fixos", () => {
    const modos = ["ler-ponto", "colocar-ponto", "caminho", "figura-coordenadas", "padrao-alinhado"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.modo).toBe(modos[nivel - 1]);
        expect(spec.maxCoord).toBe(3);
        expect(spec.caminhoEntrePontos).toBe(nivel === 3);
        expect(spec.desenharFigura).toBe(nivel === 4);
        expect(spec.identificarPadrao).toBe(nivel === 5);
        expect(spec.origem).toEqual({ x: 0, y: 0 });
      }
    }
  });

  it("todo ponto oferecido cabe na malha, e a resposta é o alvo", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.resposta).toBe(`${spec.alvo.x},${spec.alvo.y}`);
        // x igual a y faria o distrator de inversão devolver o próprio alvo.
        expect(spec.alvo.x, `L${nivel}: alvo na diagonal apaga o distrator de inversão`).not.toBe(spec.alvo.y);
        for (const opcao of spec.opcoes) {
          const [x, y] = opcao.value.split(",").map(Number);
          expect(x, `L${nivel}: ${opcao.label} fora da malha`).toBeGreaterThanOrEqual(0);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(spec.maxCoord);
          expect(y).toBeLessThanOrEqual(spec.maxCoord);
        }
      }
    }
  });

  it("cada cena leva os pontos que o nível desenha, e o objetivo fala deles", () => {
    for (const spec of amostrar(2)) {
      expect(spec.objetivo, "L2 manda colocar o ponto que sorteou").toContain(`(${spec.alvo.x}, ${spec.alvo.y})`);
    }
    for (const spec of amostrar(3)) {
      expect(spec.inicio, "L3 precisa do ponto de partida").toBeDefined();
      expect(spec.inicio).not.toEqual(spec.alvo);
      expect(spec.objetivo).toContain(`(${spec.inicio!.x}, ${spec.inicio!.y})`);
      expect(spec.objetivo).toContain(`(${spec.alvo.x}, ${spec.alvo.y})`);
    }
    for (const spec of amostrar(4)) {
      // Os três vértices dados mais a resposta precisam FECHAR um retângulo.
      // Um quarto ponto que não fecha figura nenhuma faria o enunciado
      // prometer um retângulo que o desenho não entrega.
      const cantos = [...spec.vertices!, spec.alvo];
      expect(spec.vertices, "L4 desenha três vértices").toHaveLength(3);
      expect(new Set(cantos.map(p => p.x)).size, "um retângulo tem duas abscissas").toBe(2);
      expect(new Set(cantos.map(p => p.y)).size, "um retângulo tem duas ordenadas").toBe(2);
      expect(new Set(cantos.map(p => `${p.x},${p.y}`)).size, "quatro cantos distintos").toBe(4);
    }
    for (const spec of amostrar(5)) {
      const pontos = spec.pontosPadrao!;
      expect(pontos, "L5 mostra três pontos do padrão").toHaveLength(3);
      const dx = pontos[1].x - pontos[0].x;
      const dy = pontos[1].y - pontos[0].y;
      expect(pontos[2].x - pontos[1].x, "o passo do padrão precisa ser constante").toBe(dx);
      expect(pontos[2].y - pontos[1].y).toBe(dy);
      expect(spec.alvo, "o alvo é o próximo passo do mesmo padrão").toEqual({ x: pontos[2].x + dx, y: pontos[2].y + dy });
    }
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => o.value);
        expect(new Set(valores).size, `L${nivel} repetiu ponto`).toBe(valores.length);
        expect(valores.filter(v => v === spec.resposta).length, `L${nivel} sem resposta única`).toBe(1);
        expect(spec.opcoes.filter(o => !o.misconception).length, `L${nivel} sem alternativa certa única`).toBe(1);
        expect(spec.opcoes, `L${nivel} perdeu alternativa por colisão`).toHaveLength(4);
        expect(new Set(spec.opcoes.map(o => o.misconception).filter(Boolean)).size, `L${nivel} perdeu um erro nomeado`).toBe(3);
      }
    }
  });
});
