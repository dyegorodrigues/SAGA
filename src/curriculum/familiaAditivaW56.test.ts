import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";
import type { FamiliaAditivaF16Spec } from "./procedimentos/familiaAditivaContract";

/**
 * W56 regression-first — N3.05/F16 Família de Fatos.
 *
 * A ficha reduz a carga pela metade: quem vê a relação deduz a subtração da
 * adição. O que este teste cobra é que o trio seja de fato um trio, que o
 * vértice perguntado não vaze por lugar nenhum — nem pelo triângulo, nem pelo
 * apoio — e que os níveis de subtração exijam as duas direções.
 */
describe("W56 regression-first — N3.05/F16 Família de Fatos", () => {
  afterEach(() => rollbackComposerCanary("N3.05"));

  it("parte do fallback com a ficha registrada e o kind próprio", () => {
    rollbackComposerCanary("N3.05");
    expect(getTrackById("N3.05")?.prereqs).toEqual(["N1.10", "N3.03", "N3.04"]);
    expect(hasComposerFicha("N3.05")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("N3.05")).toBe("familia-aditiva-f16");
  });

  it("o trio fecha, as partes são distintas e a resposta é o vértice oculto", () => {
    enableComposerCanary("N3.05");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 40; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N3.05", nivel);
        const spec = q.uiProps as FamiliaAditivaF16Spec;

        expect(q.kind).toBe("familia-aditiva-f16");
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(spec.parte1 + spec.parte2, "o trio precisa fechar").toBe(spec.todo);
        // Partes iguais colapsariam as duas subtrações da família numa só, e o
        // trio deixaria de gerar quatro frases diferentes.
        expect(spec.parte1, "partes iguais destroem a família").not.toBe(spec.parte2);

        const esperada = spec.oculto === "todo" ? spec.todo : spec.oculto === "parte1" ? spec.parte1 : spec.parte2;
        expect(spec.resposta).toBe(esperada);

        expect(q.options?.length, `L${nivel} ficou com poucas alternativas`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("o vértice oculto não aparece escrito em lugar nenhum da tela", () => {
    enableComposerCanary("N3.05");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 40; amostra += 1) {
        const spec = generateRegisteredFichaQuestion("N3.05", nivel).uiProps as FamiliaAditivaF16Spec;

        // No triângulo: o vértice perguntado recebe '?', o número não chega.
        const vertices = [spec.triangulo.topo, spec.triangulo.esquerda, spec.triangulo.direita];
        expect(vertices.filter(v => v === "?").length, "exatamente um vértice é o perguntado").toBe(1);

        // No apoio e na conta em aberto: o número oculto não pode estar escrito.
        // Foi assim que a primeira versão vazou — perguntado o todo de 1 + 2, o
        // apoio saía "3 − 1 = ?" com o três ali do lado.
        const escrito = [spec.contaEmAberto, ...spec.apoio].join(" ");
        const numeros: string[] = escrito.match(/\d+/g) ?? [];
        expect(
          numeros.includes(String(spec.resposta)),
          `a resposta ${spec.resposta} está escrita em "${escrito}"`,
        ).toBe(false);
      }
    }
  });

  it("a subtração só entra do L3 em diante, e é ela que a coroa exige", () => {
    enableComposerCanary("N3.05");

    for (const nivel of [1, 2]) {
      for (let amostra = 0; amostra < 20; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N3.05", nivel);
        const spec = q.uiProps as FamiliaAditivaF16Spec;
        expect(spec.oculto, `L${nivel} só pergunta o todo`).toBe("todo");
        expect(q.masteryRule?.evidenciasDistintas, `L${nivel} não apresenta subtração`).toBeUndefined();
      }
    }

    for (const nivel of [3, 4, 5]) {
      const familias = new Set<string>();
      for (let amostra = 0; amostra < 60; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N3.05", nivel);
        familias.add(String(q.evidenciaDeFamilia));
        expect(q.masteryRule?.evidenciasDistintas).toMatchObject({ prefixo: "familia:N3.05:", minimo: 2 });
      }
      expect(familias, `L${nivel} precisa das duas direções`).toEqual(
        new Set(["familia:N3.05:adicao", "familia:N3.05:subtracao"]),
      );
    }
  });

  it("o L5 inverte: o triângulo sem a conta escrita", () => {
    enableComposerCanary("N3.05");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const spec = generateRegisteredFichaQuestion("N3.05", nivel).uiProps as FamiliaAditivaF16Spec;
      expect(spec.mostrarConta, `L${nivel}: só o L5 esconde a conta`).toBe(nivel <= 4);
    }
  });
});
