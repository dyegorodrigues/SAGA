import { describe, expect, it } from "vitest";
import { opcoesPrecisamDeVoz, rotuloEhPalavra } from "./opcaoQueSeOuve";

describe("a alternativa que precisa ser ouvida", () => {
  it("palavra precisa de voz — a criança de quatro anos não lê", () => {
    // Exatamente as alternativas do primeiro exercício da Jornada.
    expect(opcoesPrecisamDeVoz({ options: [
      { value: 1, label: "Sobrou" }, { value: 2, label: "Deu certinho" }, { value: 3, label: "Faltou" },
    ] } as never)).toBe(true);
  });

  it("número e símbolo não precisam — é o que o exercício ensina a ler", () => {
    expect(opcoesPrecisamDeVoz({ options: [
      { value: 7, label: "7" }, { value: 8, label: "8" }, { value: 9, label: "9" },
    ] } as never)).toBe(false);
    expect(opcoesPrecisamDeVoz({ options: [
      { value: 1, label: "3 + 4" }, { value: 2, label: "½" }, { value: 3, label: "=" },
    ] } as never)).toBe(false);
  });

  it("uma letra sozinha é rótulo de coordenada, não palavra", () => {
    expect(rotuloEhPalavra("A")).toBe(false);
    expect(rotuloEhPalavra("B3")).toBe(false);
    expect(rotuloEhPalavra("Sobrou")).toBe(true);
  });

  it("a ficha ainda manda: `audibleOptions` continua valendo", () => {
    expect(opcoesPrecisamDeVoz({ audibleOptions: true, options: [{ value: 1, label: "5" }] } as never)).toBe(true);
  });

  it("sem alternativa nenhuma, não há o que ouvir", () => {
    expect(opcoesPrecisamDeVoz({ options: [] } as never)).toBe(false);
    expect(opcoesPrecisamDeVoz({} as never)).toBe(false);
  });
});
