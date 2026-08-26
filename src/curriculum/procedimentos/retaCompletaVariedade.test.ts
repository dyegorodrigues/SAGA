import { afterEach, describe, expect, it } from "vitest";
import { construirRetaCompletaSpec } from "./retaCompletaContract";

/**
 * CLASS-003 — N7.01/F84.
 *
 * O ponto era um só por nível: −3, o par −5/−2, a lista −3,2,−7,5, o par −3/2
 * e o −6. A ficha cobra repetição, então a criança localizava o MESMO ponto
 * seis vezes — e decorar "−3" vencia L1 sem olhar a reta.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x3ef0b91) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirRetaCompletaSpec(nivel));
}

describe("CLASS-003 — N7.01/F84: o ponto muda, a escada não", () => {
  it("nenhum nível devolve sempre os mesmos pontos", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const casos = new Set(amostrar(nivel).map(s => s.pontos.join(",")));
      expect(casos.size, `L${nivel} devolveu sempre ${[...casos][0]}`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo", () => {
    const modos = ["localizar", "comparar-negativos", "ordenar-mistos", "distancia", "modulo"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) expect(spec.modo).toBe(modos[nivel - 1]);
    }
  });

  it("todo ponto cabe na reta desenhada, e a reta cruza o zero", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.inicio, `L${nivel}: a reta dos inteiros precisa começar no negativo`).toBeLessThan(0);
        expect(spec.fim, `L${nivel}: e terminar no positivo`).toBeGreaterThan(0);
        for (const ponto of spec.pontos) {
          expect(ponto, `L${nivel}: ponto ${ponto} fora da reta [${spec.inicio}, ${spec.fim}]`).toBeGreaterThanOrEqual(spec.inicio);
          expect(ponto).toBeLessThanOrEqual(spec.fim);
        }
      }
    }
  });

  it("a resposta é a que a pergunta do nível realmente tem", () => {
    for (const spec of amostrar(1)) expect(spec.resposta).toBe(spec.pontos[0]);
    for (const spec of amostrar(2)) {
      expect(spec.pontos.length).toBe(2);
      expect(spec.resposta, "comparar é dizer qual é o maior").toBe(Math.max(...spec.pontos));
    }
    for (const spec of amostrar(3)) {
      expect(spec.pontos.length).toBeGreaterThanOrEqual(4);
      expect(spec.resposta, "ordenar é do menor para o maior")
        .toBe([...spec.pontos].sort((a, b) => a - b).join(","));
    }
    for (const spec of amostrar(4)) {
      expect(spec.pontos.length).toBe(2);
      expect(spec.resposta, "distância é a diferença absoluta").toBe(Math.abs(spec.pontos[0] - spec.pontos[1]));
    }
    for (const spec of amostrar(5)) {
      expect(spec.pontos.length).toBe(1);
      expect(spec.resposta, "módulo é a distância até o zero").toBe(Math.abs(spec.pontos[0]));
      expect(spec.pontos[0], "o módulo de um positivo não ensina nada aqui").toBeLessThan(0);
    }
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => String(o.value));
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(valores.filter(v => v === String(spec.resposta)).length, `L${nivel} sem resposta única`).toBe(1);
        expect(spec.opcoes.filter(o => !o.misconception).length, `L${nivel} sem alternativa certa única`).toBe(1);
        expect(spec.opcoes.length).toBeGreaterThanOrEqual(3);
      }
    }
  });
});
