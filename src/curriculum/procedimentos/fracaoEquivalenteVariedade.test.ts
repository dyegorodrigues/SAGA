import { afterEach, describe, expect, it } from "vitest";
import { construirFracaoEquivalenteSpec } from "./fracaoEquivalenteContract";

/**
 * CLASS-003, segunda dimensão — N5.03/F73.
 *
 * Os três pares de L1 e L2 eram todos equivalentes: 1/2 e 2/4, 1/3 e 2/6,
 * 2/3 e 4/6. O nível pergunta "as duas frações representam a mesma
 * quantidade?", e a resposta era "São iguais" em todo sorteio. A criança
 * respondia sem olhar as barras, e três acertos de três em duas sessões
 * fechavam o nível.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x51ea37d) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirFracaoEquivalenteSpec(nivel));
}
const valor = (f: { numerador: number; denominador: number }) => f.numerador / f.denominador;

describe("CLASS-003 — N5.03/F73: o par muda, a comparação não", () => {
  it("nenhum nível responde sempre a mesma coisa", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const specs = amostrar(nivel);
      expect(new Set(specs.map(s => s.resposta)).size, `L${nivel} responde sempre ${specs[0].resposta}`).toBeGreaterThan(1);
    }
  });

  it("L1 e L2 mostram pares equivalentes E não equivalentes", () => {
    for (const nivel of [1, 2]) {
      const respostas = amostrar(nivel).map(s => s.resposta);
      expect(respostas.filter(r => r === "igual").length, `L${nivel} nunca mostra um par equivalente`).toBeGreaterThan(0);
      expect(respostas.filter(r => r !== "igual").length, `L${nivel} nunca mostra um par diferente`).toBeGreaterThan(0);
      // Os dois lados precisam poder vencer: prender a maior à esquerda seria
      // a mesma decoração num degrau abaixo.
      expect(new Set(respostas).size, `L${nivel} não usa os dois lados`).toBe(3);
    }
  });

  it("a resposta é a comparação de verdade entre as duas frações", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const esperado = valor(spec.esquerda) === valor(spec.direita) ? "igual"
          : valor(spec.esquerda) > valor(spec.direita) ? "esquerda" : "direita";
        expect(spec.resposta, `L${nivel}: ${spec.esquerda.numerador}/${spec.esquerda.denominador} vs ${spec.direita.numerador}/${spec.direita.denominador}`).toBe(esperado);
        for (const fracao of [spec.esquerda, spec.direita]) {
          expect(fracao.numerador, `L${nivel}: fração vazia`).toBeGreaterThan(0);
          expect(fracao.numerador, `L${nivel}: fração maior que o inteiro`).toBeLessThanOrEqual(fracao.denominador);
        }
      }
    }
  });

  it("a maior não fica sempre do mesmo lado", () => {
    // O rótulo traz a fração, então ele muda mesmo com a maior presa num lado —
    // e a varredura de rótulo não veria nada. Quem reparasse no lado venceria
    // L3 e L4 sem comparar barra nenhuma.
    for (const nivel of [1, 2, 3, 4, 5]) {
      const lados = new Set(amostrar(nivel).map(s => s.resposta));
      expect(lados.has("esquerda"), `L${nivel} nunca responde "esquerda"`).toBe(true);
      expect(lados.has("direita"), `L${nivel} nunca responde "direita"`).toBe(true);
    }
  });

  it("o modo de cada nível continua fixo", () => {
    const modos = ["equivalencia-sobreposta", "equivalencia-lado-a-lado", "mesmo-denominador", "mesmo-numerador", "denominadores-diferentes"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) expect(spec.modo).toBe(modos[nivel - 1]);
    }
    for (const spec of amostrar(3)) expect(spec.esquerda.denominador, "L3 compara com o mesmo denominador").toBe(spec.direita.denominador);
    for (const spec of amostrar(4)) expect(spec.esquerda.numerador, "L4 compara com o mesmo numerador").toBe(spec.direita.numerador);
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.opcoes, `L${nivel} perdeu alternativa`).toHaveLength(3);
        expect(new Set(spec.opcoes.map(o => o.label)).size, `L${nivel} repetiu rótulo`).toBe(3);
        expect(spec.opcoes.filter(o => !o.misconception), `L${nivel} sem alternativa certa única`).toHaveLength(1);
        expect(spec.opcoes.find(o => !o.misconception)!.value).toBe(spec.resposta);
      }
    }
  });
});
