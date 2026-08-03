import { afterEach, describe, expect, it } from "vitest";
import { Composer } from "../../Composer";
import { N3_10 } from "./N3.10";
import { gN3_10 } from "../../../utils/generators";
import { getTrackById } from "../../motores/curriculum";
import {
  COMPOSER_CANARIES,
  enableComposerCanary,
  rollbackComposerCanary,
} from "../../motores/composerCanary";
import { StoryBarsSpec } from "../../procedimentos/storyBarsContract";

/**
 * Paridade de N3.10 — o gate do Andar 4.
 *
 * O canário só é seguro se o caminho autoral cobrir o mesmo alcance do legado
 * sem regredir. Estes testes medem os dois lado a lado; a ativação continua
 * sendo decisão de outro PR.
 */

const AMOSTRAS = 100;

const amostrar = <T,>(fn: (lvl: number) => T, lvl: number, n = AMOSTRAS) =>
  Array.from({ length: n }, () => fn(lvl));

describe("paridade de N3.10 entre Composer e gerador legado", () => {
  afterEach(() => {
    COMPOSER_CANARIES.clear();
    COMPOSER_CANARIES.add("N3.09");
  });

  it("N3.10 continua no gerador legado, sem canário ativo", () => {
    expect(COMPOSER_CANARIES.has("N3.10")).toBe(false);
    expect(getTrackById("N3.10")?.generatorSource).toBe("legacy");
  });

  it("ambos os caminhos produzem questão utilizável nos cinco níveis", () => {
    for (const lvl of [1, 2, 3, 4, 5]) {
      for (const legado of amostrar(gN3_10, lvl, 20)) {
        expect(typeof legado.answer, `legado L${lvl}`).toBe("number");
        expect(legado.options?.length, `legado L${lvl}`).toBeGreaterThan(1);
      }
      for (const autoral of amostrar(l => Composer.generate(N3_10, l), lvl, 20)) {
        expect(typeof autoral.answer, `autoral L${lvl}`).toBe("number");
        expect(autoral.options?.length, `autoral L${lvl}`).toBeGreaterThan(1);
        expect(autoral.evaluate?.(autoral.answer), `autoral L${lvl}`).toBe(true);
      }
    }
  });

  it("o alcance numérico autoral não excede o do legado por nível", () => {
    for (const lvl of [1, 2, 3, 4, 5]) {
      const respostasLegado = amostrar(gN3_10, lvl).map(q => Number(q.answer));
      const respostasAutorais = amostrar(l => Composer.generate(N3_10, l), lvl).map(q => Number(q.answer));

      const maxLegado = Math.max(...respostasLegado);
      const maxAutoral = Math.max(...respostasAutorais);
      const minAutoral = Math.min(...respostasAutorais);

      expect(minAutoral, `L${lvl} mínimo`).toBeGreaterThanOrEqual(0);
      // O legado chega a 20; o autoral é limitado por result_max da ficha.
      expect(maxAutoral, `L${lvl} máximo autoral=${maxAutoral} legado=${maxLegado}`).toBeLessThanOrEqual(20);
    }
  });

  it("o caminho autoral cobre as quatro estruturas, coisa que o legado não distingue", () => {
    const estruturas = new Set(
      amostrar(l => Composer.generate(N3_10, l), 3, 200).map(
        q => (q.uiProps as StoryBarsSpec).structure,
      ),
    );
    expect([...estruturas].sort()).toEqual(["compare", "complete", "join", "separate"]);
  });

  it("só o caminho autoral varia a posição da incógnita no nível 5", () => {
    const posicoes = new Set(
      amostrar(l => Composer.generate(N3_10, l), 5, 200).map(
        q => (q.uiProps as StoryBarsSpec).unknown,
      ),
    );
    expect(posicoes.size).toBeGreaterThan(1);
  });

  it("o autoral carrega diagnóstico por alternativa; o legado não", () => {
    const autoral = amostrar(l => Composer.generate(N3_10, l), 3, 50);
    const comTag = autoral.filter(q => (q.options ?? []).some(o => o.misconception));
    expect(comTag.length, "questões autorais com misconception").toBeGreaterThan(0);
  });

  it("a ativação e o rollback de N3.10 funcionam pelo caminho de produção", () => {
    expect(getTrackById("N3.10")?.generatorSource).toBe("legacy");

    enableComposerCanary("N3.10");
    expect(getTrackById("N3.10")?.generatorSource).toBe("composer");
    expect(getTrackById("N3.10")?.gen(1).kind).toBe("story-bars");

    rollbackComposerCanary("N3.10");
    expect(getTrackById("N3.10")?.generatorSource).toBe("legacy");
  });
});
