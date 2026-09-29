import { describe, expect, it } from "vitest";
import { colunasDasAlternativas, deixaAlguemSozinho } from "./colunasDasAlternativas";

describe("as colunas da barra de alternativas", () => {
  it("três alternativas ficam lado a lado — era esse o defeito", () => {
    // Com `grid-cols-2`, a terceira caía sozinha na linha de baixo e ganhava
    // saliência. 162 das 450 combinações têm exatamente três.
    expect(colunasDasAlternativas(3)).toBe(3);
  });

  it("nenhuma quantidade deixa uma alternativa sozinha na última linha", () => {
    const sozinhas: string[] = [];
    for (let quantas = 2; quantas <= 12; quantas += 1) {
      const colunas = colunasDasAlternativas(quantas);
      if (deixaAlguemSozinho(quantas, colunas)) sozinhas.push(`${quantas} em ${colunas} colunas`);
    }
    expect(sozinhas, `sobra uma sozinha em:\n${sozinhas.join("\n")}`).toEqual([]);
  });

  it("quatro ficam em 2×2, que é o maior botão possível para o dedo", () => {
    expect(colunasDasAlternativas(4)).toBe(2);
  });

  it("uma alternativa só não vira grade", () => {
    expect(colunasDasAlternativas(1)).toBe(1);
    expect(colunasDasAlternativas(0)).toBe(1);
  });
});
