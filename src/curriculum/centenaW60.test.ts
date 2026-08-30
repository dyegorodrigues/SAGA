import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";
import type { CentenaF37Spec } from "./procedimentos/centenaContract";

/**
 * W60 regression-first — N2.04/F37 A Centena.
 *
 * A ficha é a dezena um nível acima. O que este teste cobra é que o material na
 * mesa e o número perguntado sejam a mesma coisa, que as faixas dos níveis não
 * se sobreponham, e que os três erros de valor posicional estejam na barra com
 * nome.
 */
describe("W60 regression-first — N2.04/F37 A Centena", () => {
  afterEach(() => rollbackComposerCanary("N2.04"));

  it("parte do fallback com a ficha registrada e o kind próprio", () => {
    rollbackComposerCanary("N2.04");
    expect(getTrackById("N2.04")?.prereqs).toEqual(["N2.02", "N2.01"]);
    expect(hasComposerFicha("N2.04")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("N2.04")).toBe("centena-f37");
  });

  it("o material na mesa é exatamente o número perguntado", () => {
    enableComposerCanary("N2.04");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 40; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N2.04", nivel);
        const spec = q.uiProps as CentenaF37Spec;

        expect(q.kind).toBe("centena-f37");
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(spec.numero).toBe(spec.centenas * 100 + spec.dezenas * 10 + spec.unidades);

        // Nenhuma ordem pode passar de nove: dez de qualquer ordem é a ordem
        // seguinte, e mostrar dez barras soltas ensinaria o erro que a ficha
        // combate.
        expect(spec.dezenas).toBeLessThanOrEqual(9);
        expect(spec.unidades).toBeLessThanOrEqual(9);
        expect(spec.centenas).toBeLessThanOrEqual(9);
        expect(spec.centenas).toBeGreaterThan(0);

        expect(q.options?.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("as faixas dos níveis não se sobrepõem — o degrau é de alcance", () => {
    enableComposerCanary("N2.04");
    for (let amostra = 0; amostra < 40; amostra += 1) {
      const l1 = generateRegisteredFichaQuestion("N2.04", 1).uiProps as CentenaF37Spec;
      const l2 = generateRegisteredFichaQuestion("N2.04", 2).uiProps as CentenaF37Spec;
      const l3 = generateRegisteredFichaQuestion("N2.04", 3).uiProps as CentenaF37Spec;
      expect(l1.numero, "o L1 fica dentro de 199").toBeLessThan(200);
      expect(l2.numero, "o L2 começa acima do L1").toBeGreaterThanOrEqual(200);
      expect(l2.numero, "o L2 vai até 500").toBeLessThan(500);
      expect(l3.numero, "o L3 começa acima do L2").toBeGreaterThanOrEqual(500);
    }
  });

  it("os três erros de valor posicional estão na barra, com nome", () => {
    enableComposerCanary("N2.04");
    let vistos = new Set<string>();
    for (const nivel of [1, 2, 3]) {
      for (let amostra = 0; amostra < 30; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N2.04", nivel);
        for (const opcao of q.options ?? []) if (opcao.misconception) vistos.add(String(opcao.misconception));
      }
    }
    expect(vistos).toEqual(new Set(["inverte-ordens", "ignora-valor", "nao-agrupa-dezenas"]));
  });

  it("os níveis que partem do numeral perguntam outra coisa, não o próprio numeral", () => {
    enableComposerCanary("N2.04");
    for (const nivel of [4, 5]) {
      for (let amostra = 0; amostra < 30; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N2.04", nivel);
        const spec = q.uiProps as CentenaF37Spec;
        expect(spec.partirDoNumeral).toBe(true);
        expect(q.prompt).toContain(String(spec.numero));
        // O numeral está no enunciado, então a resposta NÃO pode ser ele.
        expect(spec.resposta, "com o numeral escrito, perguntar o numeral é dar a resposta").not.toBe(spec.numero);
      }
    }
    for (const nivel of [1, 2, 3]) {
      const q = generateRegisteredFichaQuestion("N2.04", nivel);
      const spec = q.uiProps as CentenaF37Spec;
      expect(spec.partirDoNumeral).toBe(false);
      expect(q.prompt, "onde se pergunta o número, ele não pode estar escrito").not.toContain(String(spec.numero));
    }
  });
});
