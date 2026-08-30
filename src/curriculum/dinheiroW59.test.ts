import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";
import { escreverValor, MOEDAS_DO_REAL } from "./procedimentos/dinheiroContract";
import type { DinheiroF53Spec } from "./procedimentos/dinheiroContract";

/**
 * W59 regression-first — GM.03/F53 O Tesouro do Pirata.
 *
 * O que a ficha ensina é valor simbólico atribuído: o número gravado, não o
 * tamanho. Este teste cobra que as moedas sejam as do Real de verdade, que os
 * valores escritos estejam corretos em reais e centavos, e que a escada vá do
 * reconhecimento à mistura que exige ordenação.
 */
describe("W59 regression-first — GM.03/F53 O Tesouro do Pirata", () => {
  afterEach(() => rollbackComposerCanary("GM.03"));

  it("parte do fallback com a ficha registrada e o kind próprio", () => {
    rollbackComposerCanary("GM.03");
    expect(getTrackById("GM.03")?.prereqs).toEqual(["N2.01", "N3.09"]);
    expect(hasComposerFicha("GM.03")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("GM.03")).toBe("dinheiro-f53");
  });

  it("só existem moedas do Real, e o total confere com o que está na mesa", () => {
    enableComposerCanary("GM.03");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 40; amostra += 1) {
        const q = generateRegisteredFichaQuestion("GM.03", nivel);
        const spec = q.uiProps as DinheiroF53Spec;

        expect(q.kind).toBe("dinheiro-f53");
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(spec.moedas.length).toBeGreaterThan(0);
        for (const moeda of spec.moedas) {
          expect(MOEDAS_DO_REAL, `moeda inexistente no Real: ${moeda}`).toContain(moeda as 5);
        }
        expect(spec.total, "o total precisa ser o das moedas na mesa").toBe(spec.moedas.reduce((s, m) => s + m, 0));
        expect(q.options?.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("a escada vai do reconhecimento à mistura", () => {
    enableComposerCanary("GM.03");
    const modos = ["reconhecer", "moedas-iguais", "duas-denominacoes", "compor-um-real", "misturadas"];
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 20; amostra += 1) {
        const spec = generateRegisteredFichaQuestion("GM.03", nivel).uiProps as DinheiroF53Spec;
        expect(spec.modo).toBe(modos[nivel - 1]);
        // O nível das moedas iguais tem uma denominação só — é multiplicação
        // disfarçada, e é por isso que vem antes da mistura.
        if (nivel === 2) expect(new Set(spec.moedas).size).toBe(1);
        // Compor um real: o que está na mesa nunca fecha sozinho, senão não há
        // o que compor.
        if (nivel === 4) {
          expect(spec.total).toBeLessThan(100);
          expect(spec.resposta).toBe(100 - spec.total);
        }
      }
    }
  });

  it("escreve reais e centavos como se fala", () => {
    expect(escreverValor(5)).toBe("5 centavos");
    expect(escreverValor(50)).toBe("50 centavos");
    expect(escreverValor(100)).toBe("1 real");
    expect(escreverValor(125)).toBe("1 real e 25 centavos");
    expect(escreverValor(200)).toBe("2 reais");
  });

  it("contar moedas em vez de valores está na barra, etiquetado", () => {
    enableComposerCanary("GM.03");
    for (let amostra = 0; amostra < 40; amostra += 1) {
      const q = generateRegisteredFichaQuestion("GM.03", 2);
      const spec = q.uiProps as DinheiroF53Spec;
      if (spec.moedas.length === spec.resposta) continue;
      const contou = (q.options ?? []).find(o => o.value === spec.moedas.length);
      expect(contou?.misconception, "responder o número de moedas é CONTA_MOEDAS").toBe("conta-moedas");
    }
  });

  it("só o nível misturado emite e exige as duas famílias de composição", () => {
    enableComposerCanary("GM.03");
    for (const nivel of [1, 2, 3, 4]) {
      const q = generateRegisteredFichaQuestion("GM.03", nivel);
      expect(q.evidenciaDeFamilia, `L${nivel} tem composição fixa pelo próprio nível`).toBeUndefined();
    }
    const familias = new Set<string>();
    for (let amostra = 0; amostra < 80; amostra += 1) {
      const q = generateRegisteredFichaQuestion("GM.03", 5);
      familias.add(String(q.evidenciaDeFamilia));
      expect(q.masteryRule?.evidenciasDistintas).toMatchObject({ prefixo: "familia:GM.03:", minimo: 2 });
    }
    expect(familias).toEqual(new Set(["familia:GM.03:so-uma-denominacao", "familia:GM.03:denominacoes-diferentes"]));
  });
});
