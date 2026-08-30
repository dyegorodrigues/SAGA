import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";
import type { NumerosGrandesF65Spec } from "./procedimentos/numerosGrandesContract";

/**
 * W62 regression-first — N2.05/F65 Números Grandes.
 *
 * Arredondar é escolher entre as duas marcas que cercam o número. O que este
 * teste cobra é que as marcas de fato o cerquem, que a convenção do meio suba,
 * e que o caso do meio exato apareça — porque é só nele que o
 * ARREDONDA_SEMPRE_BAIXO fica visível.
 */
describe("W62 regression-first — N2.05/F65 Números Grandes", () => {
  afterEach(() => rollbackComposerCanary("N2.05"));

  it("parte do fallback com a ficha registrada e o kind próprio", () => {
    rollbackComposerCanary("N2.05");
    expect(getTrackById("N2.05")?.prereqs).toEqual(["N2.04"]);
    expect(hasComposerFicha("N2.05")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("N2.05")).toBe("numeros-grandes-f65");
  });

  it("as marcas cercam o número e a resposta é uma delas", () => {
    enableComposerCanary("N2.05");
    for (const nivel of [1, 2, 3]) {
      for (let amostra = 0; amostra < 40; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N2.05", nivel);
        const spec = q.uiProps as NumerosGrandesF65Spec;

        expect(q.kind).toBe("numeros-grandes-f65");
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(spec.marcaAcima - spec.marcaAbaixo, "as marcas distam uma ordem").toBe(spec.ordem);
        expect(spec.numero, "o número fica entre as marcas").toBeGreaterThan(spec.marcaAbaixo);
        expect(spec.numero).toBeLessThan(spec.marcaAcima);
        expect([spec.marcaAbaixo, spec.marcaAcima], "a resposta é uma das marcas").toContain(spec.resposta);
        // Cair exatamente numa marca não dá o que arredondar.
        expect(spec.numero % spec.ordem, "número já redondo não é caso desta ficha").not.toBe(0);
      }
    }
  });

  it("a ordem é a do nível, e o meio exato sobe", () => {
    enableComposerCanary("N2.05");
    for (const [nivel, ordem] of [[1, 10], [2, 100], [3, 1000]] as const) {
      for (let amostra = 0; amostra < 30; amostra += 1) {
        const spec = generateRegisteredFichaQuestion("N2.05", nivel).uiProps as NumerosGrandesF65Spec;
        expect(spec.ordem).toBe(ordem);
        const distanciaAbaixo = spec.numero - spec.marcaAbaixo;
        const distanciaAcima = spec.marcaAcima - spec.numero;
        if (distanciaAbaixo === distanciaAcima) {
          expect(spec.bemNoMeio).toBe(true);
          expect(spec.resposta, "no empate a convenção manda subir").toBe(spec.marcaAcima);
        } else {
          expect(spec.resposta, "fora do empate, decide a distância").toBe(
            distanciaAbaixo < distanciaAcima ? spec.marcaAbaixo : spec.marcaAcima,
          );
        }
      }
    }
  });

  it("o caso do meio aparece e é exigido — é onde a convenção mora", () => {
    enableComposerCanary("N2.05");
    for (const nivel of [1, 2, 3]) {
      const familias = new Set<string>();
      for (let amostra = 0; amostra < 120; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N2.05", nivel);
        familias.add(String(q.evidenciaDeFamilia));
        expect(q.masteryRule?.evidenciasDistintas).toMatchObject({ prefixo: "familia:N2.05:", minimo: 2 });
      }
      expect(familias, `L${nivel} precisa produzir os dois casos da reta`).toEqual(
        new Set(["familia:N2.05:mais-perto-de-uma", "familia:N2.05:bem-no-meio"]),
      );
    }

    // O L4 pergunta precisão e o L5 pede estimativa: nenhum coloca a criança
    // diante do empate, então nenhum etiqueta a família.
    for (const nivel of [4, 5]) {
      const q = generateRegisteredFichaQuestion("N2.05", nivel);
      expect(q.evidenciaDeFamilia, `L${nivel} não tem empate a demonstrar`).toBeUndefined();
    }
  });

  /**
   * O nível que oferece duas alternativas é cara ou coroa, e a barra encolhe
   * por colisão, não por decisão de quem escreveu a ficha.
   *
   * Os dois casos que este teste tranca foram medidos, não supostos. No L1, o
   * distrator "arredondou para a ordem de baixo" caía sempre em cima do
   * gabarito: 20 mil sorteios, 20 mil telas com duas alternativas. No L4, perto
   * da marca do milhar, a centena e a dezena caíam em cima da resposta ou uma
   * da outra: 0,45% das telas vinham com UMA alternativa — nem errar dava — e
   * 9,1% com duas.
   *
   * O contrato do canário amostra 40 sorteios e só recusa a tela de UMA
   * alternativa, então ele pegava o caso do L4 em cerca de um sexto das
   * execuções: uma falha intermitente, que é o jeito mais caro de descobrir um
   * defeito. Aqui a amostra é grande e o piso é três — as duas metades do que
   * foi medido.
   *
   * O L2 e o L3 ficam de fora de propósito: neles, arredondar para a ordem de
   * baixo às vezes ACERTA (399 vira 400 na dezena e na centena), e ali não há
   * erro para diagnosticar. Exigir uma terceira alternativa seria inventar um
   * erro que a criança não comete.
   */
  it("nenhum nível vira cara ou coroa: L1 e L4 sempre com três alternativas ou mais", () => {
    enableComposerCanary("N2.05");
    const magros: string[] = [];
    for (const nivel of [1, 4]) {
      for (let amostra = 0; amostra < 3000; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N2.05", nivel);
        const distintas = new Set((q.options ?? []).map(opcao => String(opcao.value))).size;
        if (distintas < 3) {
          magros.push(`L${nivel}: ${distintas} alternativas em ${JSON.stringify((q.options ?? []).map(o => o.value))} (número ${(q.uiProps as NumerosGrandesF65Spec).numero})`);
          break;
        }
      }
    }
    expect(magros, `níveis que encolheram a barra por colisão:\n${magros.join("\n")}`).toEqual([]);
  });

  it("estimar é arredondar as duas parcelas, não somar exato", () => {
    enableComposerCanary("N2.05");
    for (let amostra = 0; amostra < 30; amostra += 1) {
      const q = generateRegisteredFichaQuestion("N2.05", 5);
      const spec = q.uiProps as NumerosGrandesF65Spec;
      expect(spec.segundo).toBeDefined();
      expect(spec.resposta % 100, "a estimativa é feita de centenas redondas").toBe(0);
      const exato = spec.numero + (spec.segundo ?? 0);
      expect(q.prompt).toContain("Mais ou menos");
      expect(spec.resposta, "a estimativa não é a soma exata").not.toBe(exato);
    }
  });
});
