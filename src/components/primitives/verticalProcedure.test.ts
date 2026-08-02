import { describe, expect, it } from "vitest";
import { getVerticalColumnStep, verticalDigitChoices } from "./verticalProcedure";

describe("procedimento da conta vertical", () => {
  it("expõe a troca da unidade e leva a dezena para a próxima coluna", () => {
    expect(getVerticalColumnStep(27, 35, "+", 0)).toEqual({
      expectedDigit: 2,
      carry: true,
      borrow: false,
    });
    expect(getVerticalColumnStep(27, 35, "+", 1)).toEqual({
      expectedDigit: 6,
      carry: false,
      borrow: false,
    });
  });

  it("calcula duas trocas consecutivas no reagrupamento duplo", () => {
    expect(getVerticalColumnStep(278, 786, "+", 0).carry).toBe(true);
    expect(getVerticalColumnStep(278, 786, "+", 1)).toEqual({
      expectedDigit: 6,
      carry: true,
      borrow: false,
    });
  });

  it("oferece exatamente três algarismos únicos com a resposta uma vez", () => {
    const choices = verticalDigitChoices(2, 62);
    expect(choices).toHaveLength(3);
    expect(new Set(choices).size).toBe(3);
    expect(choices.filter(value => value === 2)).toHaveLength(1);
  });
});
