import { describe, expect, it } from "vitest";
import { arrayAnswer, arrayOptions, fitsArrayDimension } from "./arrayProcedure";

describe("procedimento do ArrayGrid", () => {
  it("calcula total e expressão sem revelar o produto na expressão", () => {
    expect(arrayAnswer({ rows: 3, cols: 4, answerMode: "total" })).toBe(12);
    expect(arrayAnswer({ rows: 3, cols: 4, answerMode: "equation" })).toBe("3 × 4");
  });

  it("mantém a resposta correta exatamente uma vez", () => {
    for (const answerMode of ["total", "equation"] as const) {
      const choice = { rows: 3, cols: 4, answerMode };
      expect(arrayOptions(choice).filter(option => option.value === arrayAnswer(choice))).toHaveLength(1);
    }
  });

  it("aceita somente dimensões inteiras de 1 a 10", () => {
    expect([1, 10].every(fitsArrayDimension)).toBe(true);
    expect([0, 11, 2.5].some(fitsArrayDimension)).toBe(false);
  });
});
