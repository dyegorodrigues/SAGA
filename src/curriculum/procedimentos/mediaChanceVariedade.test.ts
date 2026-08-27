import { afterEach, describe, expect, it } from "vitest";
import { construirMediaChanceSpec } from "./mediaChanceContract";

/**
 * CLASS-003, segunda dimensão — PE.03/F83.
 *
 * As torres eram sempre as mesmas: [2,4,6], [3,4,5,6,7], [2,5,8], e as chances
 * 3/5 e "Saco B". A resposta certa era 4, 5, 5, 3/5 e "Saco B" — para sempre.
 *
 * A medição encontrou também um distrator que não descrevia erro nenhum: em L5
 * o Saco B tinha ao mesmo tempo MAIS bolas marcadas e a MAIOR chance. Quem
 * ignora o total — que é o erro que o nível existe para pegar — comparava só as
 * marcadas, escolhia B e acertava. A armadilha nunca prendeu ninguém.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x71ba03d) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirMediaChanceSpec(nivel));
}
const media = (torres: number[]) => torres.reduce((s, t) => s + t, 0) / torres.length;

describe("CLASS-003 — PE.03/F83: as torres mudam, a escada não", () => {
  it("nenhum nível responde sempre igual nem monta sempre as mesmas torres", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const specs = amostrar(nivel);
      expect(new Set(specs.map(s => String(s.resposta))).size, `L${nivel} responde sempre ${specs[0].resposta}`).toBeGreaterThan(1);
      expect(new Set(specs.map(s => s.torres.join("-"))).size, `L${nivel} monta sempre ${specs[0].torres}`).toBeGreaterThan(1);
    }
  });

  it("o modo e o número de torres de cada nível continuam fixos", () => {
    const modos = ["nivelar-3", "nivelar-5", "calcular-media", "chance-fracao", "comparar-chances"];
    const quantas = [3, 5, 3, 2, 4];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.modo).toBe(modos[nivel - 1]);
        expect(spec.torres.length, `L${nivel} mudou o número de torres, que é o degrau`).toBe(quantas[nivel - 1]);
      }
    }
  });

  it("a média declarada é a média das torres, e o meio-bloco chega quando deve", () => {
    for (const nivel of [1, 2, 3]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.media, `L${nivel}: média declarada não é a das torres`).toBe(media(spec.torres));
        expect(Number.isInteger(spec.media), `L${nivel} nivela em altura inteira`).toBe(true);
        expect(spec.meioBloco, `L${nivel} ainda não conhece meio bloco`).toBe(false);
      }
    }
    for (const nivel of [4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.media).toBe(media(spec.torres));
        expect(spec.meioBloco, `L${nivel} existe para a média entre dois números`).toBe(true);
        expect(spec.media % 1, `L${nivel}: a média precisa cair no meio`).toBe(0.5);
      }
    }
  });

  it("a chance é uma fração legível, e a comparação de L5 prende quem ignora o total", () => {
    for (const spec of amostrar(4)) {
      const chance = spec.chance!;
      expect(chance.favoraveis, "casos favoráveis dentro do total").toBeLessThan(chance.total);
      expect(chance.favoraveis).toBeGreaterThan(0);
      expect(chance.fracao).toBe(`${chance.favoraveis}/${chance.total}`);
      expect(spec.resposta).toBe(chance.fracao);
    }
    for (const spec of amostrar(5)) {
      const [a, b] = spec.sacos!;
      const certo = spec.sacos!.find(saco => saco.label === spec.resposta)!;
      const errado = spec.sacos!.find(saco => saco.label !== spec.resposta)!;
      expect(certo.favoraveis / certo.total, "o saco certo é o de maior chance").toBeGreaterThan(errado.favoraveis / errado.total);
      // A armadilha do nível: quem conta só as bolas marcadas precisa ERRAR.
      // Se o saco de maior chance também tiver mais marcadas, o distrator
      // IGNORA_TOTAL nunca é escolhido por quem comete o erro que ele nomeia.
      expect(errado.favoraveis, "quem ignora o total tem de cair no saco errado").toBeGreaterThan(certo.favoraveis);
      expect(a.favoraveis).toBeLessThan(a.total);
      expect(b.favoraveis).toBeLessThan(b.total);
    }
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => String(o.value));
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(valores.filter(v => v === String(spec.resposta)).length, `L${nivel} sem resposta única`).toBe(1);
        expect(spec.opcoes.filter(o => !o.misconception).length, `L${nivel} sem alternativa certa única`).toBe(1);
        expect(spec.opcoes.length, `L${nivel} perdeu alternativa por colisão`).toBe(nivel === 5 ? 2 : 3);
      }
    }
    // Nivelar e calcular média: quem esquece de dividir entrega a soma, e a
    // média impossível fica FORA do intervalo das torres — é isso que a torna
    // impossível, e não um número qualquer maior que a resposta.
    for (const nivel of [1, 2, 3]) {
      for (const spec of amostrar(nivel)) {
        const soma = spec.torres.reduce((s, t) => s + t, 0);
        const impossivel = spec.opcoes.find(o => o.misconception === "media-impossivel")!;
        expect(spec.opcoes.find(o => o.misconception === "esqueceu-dividir")!.value, `L${nivel}: esqueceu-dividir não é a soma`).toBe(soma);
        expect(Number(impossivel.value), `L${nivel}: ${impossivel.value} cabe entre as torres, não é impossível`).toBeGreaterThan(Math.max(...spec.torres));
      }
    }
  });
});
