import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";
import type { RepartirMedirF99Spec } from "./procedimentos/repartirMedirContract";

/**
 * W61 regression-first — N4.05/F99 Repartir e Medir.
 *
 * O alvo da ficha é quem só conhece um rosto da divisão. O que este teste cobra
 * é que os dois rostos apareçam de fato, que a aritmética feche com o resto, e
 * que o nível do resto arredonde para cima — porque ali o contexto decide, e
 * "duas vans e sobra dois" deixa criança na calçada.
 */
describe("W61 regression-first — N4.05/F99 Repartir e Medir", () => {
  afterEach(() => rollbackComposerCanary("N4.05"));

  it("parte do fallback com a ficha registrada e o kind próprio", () => {
    rollbackComposerCanary("N4.05");
    expect(getTrackById("N4.05")?.prereqs).toEqual(["N4.01", "N3.02"]);
    expect(hasComposerFicha("N4.05")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("N4.05")).toBe("repartir-medir-f99");
  });

  it("a divisão fecha: total é divisor vezes quociente mais resto", () => {
    enableComposerCanary("N4.05");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 40; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N4.05", nivel);
        const spec = q.uiProps as RepartirMedirF99Spec;

        expect(q.kind).toBe("repartir-medir-f99");
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(spec.total).toBe(spec.divisor * spec.quociente + spec.resto);
        expect(spec.resto, "o resto é sempre menor que o divisor").toBeLessThan(spec.divisor);
        // Exato até o L3; com resto do L4 em diante é o que a escada promete.
        if (nivel <= 3) expect(spec.resto, `L${nivel} é exato`).toBe(0);
        else expect(spec.resto, `L${nivel} tem resto`).toBeGreaterThan(0);

        expect(q.options?.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("o L1 é partição, o L2 é medida, e do L3 em diante os dois aparecem", () => {
    enableComposerCanary("N4.05");
    for (let amostra = 0; amostra < 30; amostra += 1) {
      expect((generateRegisteredFichaQuestion("N4.05", 1).uiProps as RepartirMedirF99Spec).sentido).toBe("particao");
      expect((generateRegisteredFichaQuestion("N4.05", 2).uiProps as RepartirMedirF99Spec).sentido).toBe("medida");
    }

    for (const nivel of [3, 4]) {
      const sentidos = new Set<string>();
      for (let amostra = 0; amostra < 60; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N4.05", nivel);
        sentidos.add((q.uiProps as RepartirMedirF99Spec).sentido);
        expect(q.masteryRule?.evidenciasDistintas, `L${nivel} alterna e precisa exigir os dois`).toMatchObject({ prefixo: "familia:N4.05:", minimo: 2 });
      }
      expect(sentidos, `L${nivel} precisa produzir os dois rostos`).toEqual(new Set(["particao", "medida"]));
    }
  });

  it("no nível do resto, sobrar exige mais um — ninguém fica na calçada", () => {
    enableComposerCanary("N4.05");
    for (let amostra = 0; amostra < 40; amostra += 1) {
      const q = generateRegisteredFichaQuestion("N4.05", 5);
      const spec = q.uiProps as RepartirMedirF99Spec;
      expect(spec.restoDecide).toBe(true);
      expect(spec.resposta, "o contexto arredonda para cima").toBe(spec.quociente + 1);
      // Parar no quociente é o erro que o nível existe para pegar.
      const parou = (q.options ?? []).find(o => o.value === spec.quociente);
      expect(parou?.misconception).toBe("confunde-resto");
    }
  });

  it("só o L4 exige declarar o sentido — e o enunciado nunca entrega a resposta", () => {
    enableComposerCanary("N4.05");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 20; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N4.05", nivel);
        const spec = q.uiProps as RepartirMedirF99Spec;
        expect(spec.exigeIdentificar, `L${nivel}`).toBe(nivel === 4);
        // A história cita o total e o divisor; citar a resposta seria o
        // gabarito escrito no enunciado.
        expect(spec.historia).toContain(String(spec.total));
        expect(
          new RegExp(`\\b${spec.resposta}\\b`).test(spec.historia) && spec.resposta !== spec.total && spec.resposta !== spec.divisor,
          `a história entrega a resposta: "${spec.historia}"`,
        ).toBe(false);
      }
    }
  });
});
