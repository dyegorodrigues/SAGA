import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";
import type { FazerDezF33Spec } from "./procedimentos/fazerDezContract";

/**
 * W55 regression-first — N3.07/F33 Fazer Dez.
 *
 * A ficha canônica se chama a mais importante da faixa F1, e o que ela promete
 * é verificável: toda soma cruza a dezena, sempre sobra algo depois de fechar a
 * caixa, e o apoio some degrau a degrau até a criança fazer de cabeça.
 */
describe("W55 regression-first — N3.07/F33 Fazer Dez", () => {
  afterEach(() => rollbackComposerCanary("N3.07"));

  it("parte do fallback com a ficha registrada e o kind próprio", () => {
    rollbackComposerCanary("N3.07");
    expect(getTrackById("N3.07")?.prereqs).toEqual(["N1.11", "N1.10", "N2.01"]);
    expect(hasComposerFicha("N3.07")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("N3.07")).toBe("fazer-dez-f33");
  });

  it("toda soma cruza a dezena e sempre sobra — senão não há estratégia a usar", () => {
    enableComposerCanary("N3.07");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 40; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N3.07", nivel);
        const spec = q.uiProps as FazerDezF33Spec;

        expect(q.kind).toBe("fazer-dez-f33");
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(spec.resposta).toBe(spec.a + spec.b);
        expect(spec.faltamParaDez).toBe(10 - spec.a);
        expect(spec.b).toBe(spec.faltamParaDez + spec.sobra);

        // A primeira parcela nunca chega a dez sozinha, e o total sempre passa
        // dele: sem cruzar a dezena, a ficha não tem o que ensinar.
        expect(spec.a, "a primeira parcela precisa caber na caixa").toBeLessThan(10);
        expect(spec.resposta, "a soma precisa cruzar a dezena").toBeGreaterThan(10);
        // Sempre sobra: uma soma que fecha exatamente em dez não exercita o
        // terceiro passo, que é o caro.
        expect(spec.sobra, "precisa sobrar algo depois de fechar a caixa").toBeGreaterThan(0);

        // Chutar não pode ser meio a meio.
        expect(q.options?.length).toBeGreaterThanOrEqual(3);
        const valores = (q.options ?? []).map(o => o.value);
        expect(new Set(valores).size).toBe(valores.length);
      }
    }
  });

  it("o apoio some degrau a degrau, e o enunciado só aponta para o que está na tela", () => {
    enableComposerCanary("N3.07");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("N3.07", nivel);
      const spec = q.uiProps as FazerDezF33Spec;

      expect(spec.mostrarMolduras, `L${nivel}: as caixas vão até o L3`).toBe(nivel <= 3);
      expect(spec.exigeFecharACaixa, `L${nivel}: só há portão onde há caixa`).toBe(nivel <= 3);
      expect(spec.mostrarDecomposicao, `L${nivel}: o L3 tira a escrita, o L4 fica só com ela`).toBe(nivel <= 2 || nivel === 4);

      // Mandar "fechar a caixa" numa tela sem caixa seria apontar para o que
      // não está lá.
      if (!spec.mostrarMolduras) expect(q.prompt).not.toContain("caixa");
    }
  });

  it("responder dez está sempre na barra, etiquetado — é o erro que a ficha nomeia", () => {
    enableComposerCanary("N3.07");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 20; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N3.07", nivel);
        const parou = (q.options ?? []).find(o => o.value === 10);
        expect(parou?.misconception, "parar no dez precisa ser oferecido e diagnosticado").toBe("parou-no-dez");
        expect(q.answer, "dez nunca pode ser a resposta certa aqui").not.toBe(10);
      }
    }
  });

  it("o domínio é o rigoroso que a ficha pede: quatro de quatro, três sessões", () => {
    enableComposerCanary("N3.07");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("N3.07", nivel);
      expect(q.masteryRule).toEqual({ acertos: 4, de: 4, sessoes: 3 });
    }
  });
});
