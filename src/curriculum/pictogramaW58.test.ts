import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";
import type { PictogramaF56Spec } from "./procedimentos/pictogramaContract";

/**
 * W58 regression-first — PE.01/F56 O Contador de Animais.
 *
 * O degrau da ficha é a escala: quando um desenho vale dois, contar desenhos e
 * contar a quantidade deixam de dar o mesmo número. O que este teste cobra é
 * que os níveis um-para-um não escondam esse degrau por acidente, e que o
 * nível da legenda de fato o apresente.
 */
describe("W58 regression-first — PE.01/F56 O Contador de Animais", () => {
  afterEach(() => rollbackComposerCanary("PE.01"));

  it("parte do fallback com a ficha registrada e o kind próprio", () => {
    rollbackComposerCanary("PE.01");
    expect(getTrackById("PE.01")?.prereqs).toEqual(["N1.04", "N1.05"]);
    expect(hasComposerFicha("PE.01")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("PE.01")).toBe("pictograma-f56");
  });

  it("a tabela tem categorias distintas e contagens distintas", () => {
    enableComposerCanary("PE.01");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 40; amostra += 1) {
        const q = generateRegisteredFichaQuestion("PE.01", nivel);
        const spec = q.uiProps as PictogramaF56Spec;

        expect(q.kind).toBe("pictograma-f56");
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(spec.linhas.length).toBe(3);

        const rotulos = spec.linhas.map(l => l.rotulo);
        expect(new Set(rotulos).size, "categoria repetida na mesma tabela").toBe(rotulos.length);
        const contagens = spec.linhas.map(l => l.icones);
        expect(new Set(contagens).size, "duas linhas empatadas tornam 'linha trocada' indiagnosticável").toBe(contagens.length);

        // Chutar não pode ser meio a meio.
        expect(q.options?.length, `L${nivel} ficou com poucas alternativas`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("a escala é o degrau: um até o L3, dois no L4, misturada no L5", () => {
    enableComposerCanary("PE.01");
    const escalasDoCinco = new Set<number>();

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 40; amostra += 1) {
        const spec = generateRegisteredFichaQuestion("PE.01", nivel).uiProps as PictogramaF56Spec;
        if (nivel <= 3) expect(spec.escala, `L${nivel} é um-para-um`).toBe(1);
        if (nivel === 4) expect(spec.escala, "o L4 estreia a legenda").toBe(2);
        if (nivel === 5) escalasDoCinco.add(spec.escala);
      }
    }
    expect(escalasDoCinco, "o L5 precisa misturar as duas escalas").toEqual(new Set([1, 2]));
  });

  it("onde há legenda, contar desenhos é um erro etiquetado — e não a resposta", () => {
    enableComposerCanary("PE.01");
    for (let amostra = 0; amostra < 40; amostra += 1) {
      const q = generateRegisteredFichaQuestion("PE.01", 4);
      const spec = q.uiProps as PictogramaF56Spec;
      const contarDesenhos = spec.linhas[spec.perguntada].icones;
      expect(spec.resposta, "com legenda de dois, a resposta não é a contagem de desenhos").not.toBe(contarDesenhos);
      const ignorou = (q.options ?? []).find(o => o.value === contarDesenhos);
      expect(ignorou?.misconception, "o erro do nível precisa estar na barra, etiquetado").toBe("ignora-escala");
    }
  });

  it("só o nível que mistura escalas emite e exige as duas", () => {
    enableComposerCanary("PE.01");
    for (const nivel of [1, 2, 3, 4]) {
      const q = generateRegisteredFichaQuestion("PE.01", nivel);
      expect(q.evidenciaDeFamilia, `L${nivel} tem escala fixa: não há escolha a etiquetar`).toBeUndefined();
      expect(q.masteryRule?.evidenciasDistintas).toBeUndefined();
    }

    const familias = new Set<string>();
    for (let amostra = 0; amostra < 60; amostra += 1) {
      const q = generateRegisteredFichaQuestion("PE.01", 5);
      familias.add(String(q.evidenciaDeFamilia));
      expect(q.masteryRule?.evidenciasDistintas).toMatchObject({ prefixo: "familia:PE.01:", minimo: 2 });
    }
    expect(familias).toEqual(new Set(["familia:PE.01:um-para-um", "familia:PE.01:com-escala"]));
  });
});
