import { describe, expect, it } from "vitest";
import { Composer } from "../../Composer";
import { N4_02 } from "./N4.02";
import { getTrackById } from "../../motores/curriculum";

describe("paridade controlada de N4.02", () => {
  it("mantém gN4_02 em produção, sem canário do Composer", () => {
    const production = getTrackById("N4.02");
    expect(production?.generatorSource).toBe("legacy");
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
