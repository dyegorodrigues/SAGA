import { describe, expect, it } from "vitest";
import { fisherYates } from "./shuffle";

function lcg(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

describe("fisherYates", () => {
  it("é determinístico quando recebe a mesma fonte seeded", () => {
    const original = [1, 2, 3, 4, 5];
    expect(fisherYates(original, lcg(42))).toEqual(fisherYates(original, lcg(42)));
    expect(fisherYates(original, lcg(42))).not.toEqual(fisherYates(original, lcg(99)));
    expect(original).toEqual([1, 2, 3, 4, 5]);
  });

  it("move a alternativa inteira: valor e misconception nunca se separam", () => {
    const options = [
      { value: 10, misconception: "CERTO" },
      { value: 11, misconception: "OFF_BY_ONE" },
      { value: 20, misconception: "RESPONDE_O_TODO" },
    ];
    const shuffled = fisherYates(options, lcg(7));
    const tagsPorValor = new Map(shuffled.map(option => [option.value, option.misconception]));
    expect(tagsPorValor.get(10)).toBe("CERTO");
    expect(tagsPorValor.get(11)).toBe("OFF_BY_ONE");
    expect(tagsPorValor.get(20)).toBe("RESPONDE_O_TODO");
  });
});
