import { describe, expect, it } from "vitest";
import { Composer } from "../../Composer";
import { N4_02 } from "./N4.02";
import { getTrackById } from "../../motores/curriculum";

describe("paridade controlada de N4.02", () => {
  it("W51: a ficha F98 assume a produção e o legado sai", () => {
    // A paridade nasceu guardando o legado enquanto a ficha amadurecia. A ficha
    // amadureceu: registrada no Composer, passou os dez gates da Jornada, e o
    // portão de giro da CLASS-007 apareceu no inventário de portões medidos.
    const production = getTrackById("N4.02");
    expect(production?.generatorSource).toBe("composer");
    expect(production?.gen(1).kind).toBe("array");
  });

  it("o caminho autoral cobre cinco níveis com produtos válidos", () => {
    for (let level = 1; level <= 5; level += 1) {
      for (let sample = 0; sample < 20; sample += 1) {
        const question = Composer.generate(N4_02, level);
        expect(question.evaluate?.(question.answer)).toBe(true);
        expect(question.uiProps.rows * question.uiProps.cols).toBeLessThanOrEqual(100);
      }
    }
  });
});
