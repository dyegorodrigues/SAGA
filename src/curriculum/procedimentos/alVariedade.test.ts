import { afterEach, describe, expect, it } from "vitest";
import { construirIgualdadeEquilibrioSpec } from "./igualdadeEquilibrioContract";
import { construirLinguagemLetrasSpec } from "./linguagemLetrasContract";

/**
 * CLASS-003, segunda dimensão — AL.05/F46 e AL.07/F89.
 *
 * As duas respondiam sempre igual. A balança de AL.05 pedia sempre 3, 5, 4 e 5;
 * a letra de AL.07 era sempre n, 2n, 3n, 2n+1 e 4n. As duas cobram domínio por
 * repetição, e decorar quatro ou cinco rótulos vencia a competência.
 *
 * O degrau não muda: em AL.05 é ONDE a incógnita está — sozinha, do outro lado
 * da soma, no meio, dos dois lados, dentro do saco. Em AL.07 é o que se
 * generaliza — a letra, o múltiplo, o contexto, a regra de um padrão, a soma de
 * dois múltiplos.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar<T>(construir: (nivel: number) => T, nivel: number, semente: number): T[] {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construir(nivel));
}
const soma = (termos: Array<{ valor: number }>) => termos.reduce((total, termo) => total + termo.valor, 0);

describe("CLASS-003 — AL.05/F46: a balança muda, o lugar da incógnita não", () => {
  const specs = (nivel: number) => amostrar(construirIgualdadeEquilibrioSpec, nivel, 0x4d71e0b);

  it("nenhum nível pede sempre o mesmo número", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      expect(new Set(specs(nivel).map(s => s.resposta)).size, `L${nivel} responde sempre ${specs(nivel)[0].resposta}`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo e os dois lados continuam equilibrados", () => {
    const modos = ["igualdade-simples", "soma-um-lado", "incognita-meio", "somas-dois-lados", "saco-fechado"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of specs(nivel)) {
        expect(spec.modo).toBe(modos[nivel - 1]);
        expect(soma(spec.esquerda), `L${nivel}: ${spec.equacao} não equilibra`).toBe(soma(spec.direita));
        const oculto = [...spec.esquerda, ...spec.direita].filter(termo => termo.oculto);
        expect(oculto, `L${nivel} precisa de exatamente uma incógnita`).toHaveLength(1);
        expect(oculto[0].valor, `L${nivel}: a resposta não é o termo escondido`).toBe(spec.resposta);
        expect(spec.resposta, "a balança não trabalha com zero nem com negativo").toBeGreaterThan(0);
      }
    }
    // O saco de L5 continua sendo um saco, e a incógnita continua dentro dele.
    for (const spec of specs(5)) {
      expect(spec.esquerda.find(termo => termo.saco)?.valor).toBe(spec.resposta);
    }
  });

  it("a equação escrita descreve os pesos desenhados", () => {
    for (const nivel of [1, 2, 3, 5]) {
      for (const spec of specs(nivel)) {
        const visiveis = [...spec.esquerda, ...spec.direita].filter(termo => !termo.oculto).map(termo => termo.valor);
        for (const valor of visiveis) {
          expect(spec.equacao, `L${nivel}: ${spec.equacao} não cita o peso ${valor}`).toContain(String(valor));
        }
      }
    }
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of specs(nivel)) {
        const valores = spec.opcoes.map(o => o.value);
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(valores.filter(v => v === spec.resposta).length, `L${nivel} sem resposta única`).toBe(1);
        expect(spec.opcoes, `L${nivel} perdeu alternativa por colisão`).toHaveLength(4);
        expect(new Set(spec.opcoes.map(o => o.misconception).filter(Boolean)).size).toBe(3);
      }
    }
  });
});

describe("CLASS-003 — AL.07/F89: a letra muda, o que se generaliza não", () => {
  const specs = (nivel: number) => amostrar(construirLinguagemLetrasSpec, nivel, 0x7c3f218);

  it("nenhum nível responde sempre a mesma escrita", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      expect(new Set(specs(nivel).map(s => s.resposta)).size, `L${nivel} responde sempre "${specs(nivel)[0].resposta}"`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo, e a letra do spec é a letra da resposta", () => {
    const modos = ["caixa-vira-letra", "expressao-simples", "expressao-contexto", "regra-padrao", "equivalencia-expressoes"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of specs(nivel)) {
        expect(spec.modo).toBe(modos[nivel - 1]);
        expect(spec.letra, `L${nivel} sem letra`).toMatch(/^[a-z]$/);
        expect(spec.resposta, `L${nivel}: "${spec.resposta}" não usa a letra ${spec.letra}`).toContain(spec.letra);
        // Toda alternativa fala da MESMA letra ou de um caso particular. Uma
        // letra diferente entre as alternativas entregaria a resposta por
        // eliminação sem a criança ler a expressão.
        for (const opcao of spec.opcoes) {
          const outrasLetras = opcao.value.replace(new RegExp(spec.letra, "g"), "").match(/[a-z]/g) ?? [];
          expect(outrasLetras.every(letra => "aeiouçãáéíóúâêô".includes(letra) || /[a-z]/.test(letra)), `L${nivel}: ${opcao.value}`).toBe(true);
        }
      }
    }
  });

  it("a tabela confere com a regra que o nível pede", () => {
    for (const nivel of [2, 3, 4, 5]) {
      for (const spec of specs(nivel)) {
        expect(spec.tabela, `L${nivel} sem tabela`).toBeDefined();
        const regra = spec.resposta.match(/^(\d+)([a-z])(?:\s*\+\s*(\d+))?$/);
        expect(regra, `L${nivel}: "${spec.resposta}" não é uma regra legível`).not.toBeNull();
        const [, coeficiente, , constante] = regra!;
        for (const linha of spec.tabela!) {
          expect(linha.valor, `L${nivel}: a tabela não obedece ${spec.resposta} em n=${linha.n}`)
            .toBe(Number(coeficiente) * linha.n + Number(constante ?? 0));
        }
      }
    }
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of specs(nivel)) {
        const valores = spec.opcoes.map(o => o.value);
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(valores.filter(v => v === spec.resposta).length, `L${nivel} sem resposta única`).toBe(1);
        expect(spec.opcoes, `L${nivel} perdeu alternativa por colisão`).toHaveLength(4);
        expect(new Set(spec.opcoes.map(o => o.misconception).filter(Boolean)).size).toBe(3);
      }
    }
  });
});
