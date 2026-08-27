import { afterEach, describe, expect, it } from "vitest";
import { construirMapaTesouroF60Spec } from "./mapaTesouroContract";

/**
 * CLASS-003, segunda dimensão — GE.05/F60.
 *
 * O tesouro estava sempre na mesma casa: B2, C4, D2, D2 e (3,2). A ficha cobra
 * 3 acertos de 3 em 2 sessões, e decorar cinco rótulos vencia a competência
 * sem a criança cruzar coluna com linha uma vez sequer.
 *
 * O degrau não muda: o tamanho da grade, se os eixos são letra/número ou
 * número/número, e o que cada nível pede — achar, dizer, colocar, descrever o
 * caminho, ler os dois eixos numéricos.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x5c02b41) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirMapaTesouroF60Spec(nivel));
}

describe("CLASS-003 — GE.05/F60: o tesouro muda de casa, a escada não", () => {
  it("nenhum nível esconde o tesouro sempre na mesma casa", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const specs = amostrar(nivel);
      // Coluna e linha medidas separadas. Medir só o par deixava passar um
      // tesouro preso na coluna B com a linha sorteada: a resposta mudava, mas
      // a criança aprendia a olhar uma coluna só.
      expect(new Set(specs.map(s => s.alvoColuna)).size, `L${nivel} usa sempre a coluna ${specs[0].alvoColuna}`).toBeGreaterThan(1);
      expect(new Set(specs.map(s => s.alvoLinha)).size, `L${nivel} usa sempre a linha ${specs[0].alvoLinha}`).toBeGreaterThan(1);
      const certos = specs.map(s => s.opcoes.find(o => o.value === s.resposta)!.label);
      expect(new Set(certos).size, `L${nivel} responde sempre "${certos[0]}"`).toBeGreaterThan(1);
    }
  });

  it("o modo, a grade e os eixos de cada nível continuam fixos", () => {
    const modos = ["achar-objeto", "dizer-coordenada", "colocar-objeto", "descrever-caminho", "pre-cartesiano"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.modo).toBe(modos[nivel - 1]);
        expect(spec.gradeSize, `L${nivel} mudou o tamanho da grade`).toBe(nivel === 1 ? 3 : 5);
        expect(spec.colunas).toHaveLength(spec.gradeSize);
        expect(spec.linhas).toHaveLength(spec.gradeSize);
        // Só o último nível troca a letra pelo número no eixo horizontal: é o
        // que faz dele "pré-cartesiano".
        expect(spec.colunas[0], `L${nivel} trocou o eixo horizontal`).toBe(nivel === 5 ? "1" : "A");
      }
    }
  });

  it("o alvo cai dentro da grade e o objetivo fala da casa sorteada", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.alvoColuna).toBeGreaterThanOrEqual(1);
        expect(spec.alvoColuna).toBeLessThanOrEqual(spec.gradeSize);
        expect(spec.alvoLinha).toBeGreaterThanOrEqual(1);
        expect(spec.alvoLinha).toBeLessThanOrEqual(spec.gradeSize);
        // Coluna igual a linha faria o distrator de inversão coincidir com a
        // resposta, e a alternativa sumiria na deduplicação.
        expect(spec.alvoColuna, `L${nivel}: coluna e linha iguais apagam o distrator de inversão`).not.toBe(spec.alvoLinha);
        expect(spec.objetivo.length, `L${nivel} sem objetivo`).toBeGreaterThan(5);
      }
    }
    for (const spec of amostrar(3)) {
      const rotulo = `${spec.colunas[spec.alvoColuna - 1]}${spec.linhas[spec.alvoLinha - 1]}`;
      expect(spec.objetivo, "L3 manda colocar o tesouro na casa que sorteou").toContain(rotulo);
    }
  });

  it("L4 descreve um caminho que sai de uma casa da grade e chega no alvo", () => {
    for (const spec of amostrar(4)) {
      expect(spec.origemColuna, "L4 precisa da casa de partida").toBeGreaterThanOrEqual(1);
      expect(spec.origemColuna!).toBeLessThan(spec.alvoColuna);
      expect(spec.origemLinha!, "o caminho sobe: a linha de partida é maior").toBeGreaterThan(spec.alvoLinha);
      const dx = spec.alvoColuna - spec.origemColuna!;
      const dy = spec.origemLinha! - spec.alvoLinha;
      expect(dx, "andar o mesmo tanto nos dois eixos apaga o distrator de inversão").not.toBe(dy);
      const certo = spec.opcoes.find(o => o.value === spec.resposta)!;
      expect(certo.label).toBe(`${dx} à direita, ${dy} para cima`);
    }
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => o.value);
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(new Set(spec.opcoes.map(o => o.label)).size, `L${nivel} repetiu rótulo`).toBe(valores.length);
        expect(valores.filter(v => v === spec.resposta).length, `L${nivel} sem resposta única`).toBe(1);
        expect(spec.opcoes.filter(o => !o.misconception).length, `L${nivel} sem alternativa certa única`).toBe(1);
        expect(spec.opcoes, `L${nivel} perdeu alternativa por colisão`).toHaveLength(4);
        // Os três erros da ficha em todo nível. O caso fixo deixava a quarta
        // alternativa de L1 sem tag — uma casa errada que o Radar não sabia
        // ler. Ela vira o distrator de inversão, que existe desde L1: trocar
        // coluna com linha é escolher uma casa, não uma forma de dizer.
        const tags = new Set(spec.opcoes.map(o => o.misconception).filter(Boolean));
        expect(tags.size, `L${nivel} perdeu um erro nomeado`).toBe(3);
      }
    }
  });
});
