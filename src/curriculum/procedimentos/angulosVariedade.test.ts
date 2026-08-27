import { afterEach, describe, expect, it } from "vitest";
import { construirAngulosSpec } from "./angulosContract";

/**
 * CLASS-003, segunda dimensão — GE.06/F78.
 *
 * O ângulo era sempre o mesmo: 45°, 65 contra 120, 55 contra 105, 40° e 120°.
 * A resposta certa era "agudo", "B", "B", 40 e "obtuso" — para sempre. A ficha
 * cobra 3 acertos de 3 em 2 sessões, e cinco rótulos decorados bastavam.
 *
 * O degrau é o que o nível pergunta: classificar a abertura, comparar duas,
 * comparar com lados de tamanhos diferentes, medir em graus, e classificar o
 * ângulo de um polígono. Isso não muda.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x6ad13f9) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirAngulosSpec(nivel));
}
const tipo = (g: number) => (g === 90 ? "reto" : g < 90 ? "agudo" : "obtuso");

describe("CLASS-003 — GE.06/F78: a abertura muda, a escada não", () => {
  it("nenhum nível mostra sempre a mesma abertura nem responde sempre igual", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const specs = amostrar(nivel);
      expect(new Set(specs.map(s => `${s.anguloA}/${s.anguloB ?? ""}`)).size, `L${nivel} mostra sempre a mesma abertura`).toBeGreaterThan(1);
      expect(new Set(specs.map(s => String(s.resposta))).size, `L${nivel} responde sempre ${specs[0].resposta}`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo, e só quem compara tem dois ângulos", () => {
    const modos = ["classificar", "comparar", "lados-diferentes", "medir-graus", "poligonos"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.modo).toBe(modos[nivel - 1]);
        expect(spec.anguloB !== undefined, `L${nivel}: dois ângulos só onde o nível compara`).toBe(nivel === 2 || nivel === 3);
        for (const grau of [spec.anguloA, spec.anguloB].filter((g): g is number => g !== undefined)) {
          expect(grau, `L${nivel}: ${grau}° não é uma abertura desenhável`).toBeGreaterThan(0);
          expect(grau).toBeLessThan(180);
        }
      }
    }
  });

  it("classificar e polígonos respondem o tipo do ângulo que desenham", () => {
    for (const nivel of [1, 5]) {
      const tipos = new Set<string>();
      for (const spec of amostrar(nivel)) {
        expect(spec.resposta, `L${nivel}: a resposta não é o tipo do ângulo desenhado`).toBe(tipo(spec.anguloA));
        tipos.add(String(spec.resposta));
      }
      expect(tipos.size, `L${nivel} precisa dos três tipos ao longo do corpus`).toBe(3);
    }
  });

  it("comparar responde a abertura maior, e o lado mais longo fica com o ângulo menor", () => {
    for (const nivel of [2, 3]) {
      for (const spec of amostrar(nivel)) {
        const maior = spec.anguloA > spec.anguloB! ? "A" : "B";
        expect(spec.anguloA, `L${nivel}: aberturas iguais tornam "iguais" uma resposta certa`).not.toBe(spec.anguloB);
        expect(spec.resposta).toBe(maior);
      }
    }
    // L3 existe para desmentir "o lado mais comprido é o ângulo maior". Se o
    // ângulo maior também tivesse o lado mais comprido, quem comete o erro
    // acertaria, e o distrator ANGULO_PELO_LADO nomearia ninguém.
    for (const spec of amostrar(3)) {
      expect(spec.ladoA, "L3 precisa de lados de comprimentos diferentes").toBeDefined();
      const ladoDoMaior = spec.anguloA > spec.anguloB! ? spec.ladoA! : spec.ladoB!;
      const ladoDoMenor = spec.anguloA > spec.anguloB! ? spec.ladoB! : spec.ladoA!;
      expect(ladoDoMaior, "o ângulo maior precisa ter o lado mais CURTO").toBeLessThan(ladoDoMenor);
      const pelaAparencia = spec.opcoes.find(o => o.misconception === "angulo-pelo-lado")!;
      expect(pelaAparencia.value, "quem julga pelo lado escolhe o do lado mais comprido").toBe(spec.anguloA > spec.anguloB! ? "B" : "A");
    }
  });

  it("medir-graus oferece a leitura invertida do transferidor", () => {
    for (const spec of amostrar(4)) {
      expect(spec.resposta).toBe(spec.anguloA);
      expect(spec.anguloA % 5, "o transferidor lê de cinco em cinco").toBe(0);
      expect(spec.anguloA, "90° apagaria o distrator do ângulo reto").not.toBe(90);
      const invertido = spec.opcoes.find(o => o.misconception === "transferidor-invertido")!;
      expect(invertido.value, "ler pela outra escala dá o suplemento").toBe(180 - spec.anguloA);
    }
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => String(o.value));
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(valores.filter(v => v === String(spec.resposta)).length, `L${nivel} sem resposta única`).toBe(1);
        expect(spec.opcoes.filter(o => !o.misconception).length, `L${nivel} sem alternativa certa única`).toBe(1);
        expect(spec.opcoes.length, `L${nivel} perdeu alternativa por colisão`).toBe(nivel === 4 ? 4 : 3);
      }
    }
  });
});
