import { afterEach, describe, expect, it } from "vitest";
import { JOURNEY_FICHAS } from "./fichas";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  rollbackComposerCanary,
} from "./motores/composerCanary";
import { isCanonicalMisconceptionTag } from "./motores/radarEngine";

describe("W47 regression-first — N6.02/F76 Contas com Vírgula", () => {
  afterEach(() => rollbackComposerCanary("N6.02"));

  it("parte do fallback com prereqs servidos e exige a F76 inteira antes da promoção", () => {
    rollbackComposerCanary("N6.02");
    expect(getTrackById("N6.02")?.prereqs).toEqual(["N6.01", "N3.11", "N3.12"]);
    expect(getTrackById("N6.02")?.generatorSource).toBe("fallback");

    // Regression-first deliberado: N6.02/F76 ainda não existe na Journey.
    // A primeira falha deve permanecer exatamente aqui até a materialização inativa.
    const ficha = JOURNEY_FICHAS.find(item => item.id === "N6.02");
    expect(ficha).toBeDefined();

    expect(ficha?.nome).toBe("Contas com Vírgula");
    expect(ficha?.prereqs).toEqual(["N6.01", "N3.11", "N3.12"]);
    expect(hasComposerFicha("N6.02")).toBe(true);

    enableComposerCanary("N6.02");
    const tags = new Set<string>();
    let viuCasasDiferentes = false;

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("N6.02", nivel);
      const spec = q.uiProps as any;

      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.rt_max_s).toBeUndefined();
      expect(spec?.acessibilidade?.semArrastoObrigatorio ?? true).toBe(true);

      if (nivel === 2 && q.exigeEvidencia) viuCasasDiferentes = true;
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    expect(viuCasasDiferentes, "F76 precisa provar domínio com ao menos um caso de casas decimais diferentes (L2)").toBe(true);
    expect(tags).toEqual(new Set([
      "alinha-pela-direita",
      "ignora-zeros",
      "virgula-perdida",
    ]));
    for (const tag of tags) expect(isCanonicalMisconceptionTag(tag), `F76 tag fora do Radar: ${tag}`).toBe(true);

    const resolucoes = [1, 2, 3, 4, 5].map(nivel => JSON.stringify(generateRegisteredFichaQuestion("N6.02", nivel).resolucao));
    expect(resolucoes[0]).toMatch(/vírgula|virgula|ordem|décim|decim/i);
    expect(resolucoes[1]).toMatch(/vírgula|virgula|zero|casa|ordem/i);
    expect(resolucoes[2]).toMatch(/subtra|vírgula|virgula|ordem/i);
    expect(resolucoes[3]).toMatch(/reagrup|reserva|troca|vírgula|virgula/i);
    expect(resolucoes[4]).toMatch(/10|100|vírgula|virgula|posição|posicao/i);
  });
});
