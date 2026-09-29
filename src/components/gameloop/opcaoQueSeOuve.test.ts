import { describe, expect, it } from "vitest";
import { opcoesPrecisamDeVoz, rotuloEhPalavra } from "./opcaoQueSeOuve";

describe("a alternativa que precisa ser ouvida", () => {
  it("palavra precisa de voz — a criança de quatro anos não lê", () => {
    // Exatamente as alternativas do primeiro exercício da Jornada.
    expect(opcoesPrecisamDeVoz({ options: [
      { value: 1, label: "Sobrou" }, { value: 2, label: "Deu certinho" }, { value: 3, label: "Faltou" },
    ] } as never)).toBe(true);
  });

  /**
   * ⚠️ Este teste dizia o CONTRÁRIO, e a decisão que ele guardava era minha.
   *
   * "Número e símbolo não precisam — é o que o exercício ensina a ler." Eu
   * escrevi isso raciocinando como quem lê. O pai devolveu a medida certa, no
   * exercício do relance, onde as alternativas são "1" e "2":
   *
   * > *"tinha que dar essa opção de ouvir também, né? Um, dois, tu apertar nos
   * > botões e ouvir o som."*
   *
   * Para uma criança de quatro anos o algarismo 2 é tão ilegível quanto a
   * palavra "dois" — é exatamente isso que essas fichas existem para ensinar.
   * Escolher entre dois símbolos que ela ainda não lê é cara ou coroa, e o app
   * anotava o cara ou coroa como erro de matemática.
   */
  it("⚠️ número também precisa: para quem não lê, '2' é tão opaco quanto 'dois'", () => {
    expect(opcoesPrecisamDeVoz({ options: [
      { value: 7, label: "7" }, { value: 8, label: "8" }, { value: 9, label: "9" },
    ] } as never)).toBe(true);
    expect(opcoesPrecisamDeVoz({ options: [
      { value: 1, label: "3 + 4" }, { value: 2, label: "½" }, { value: 3, label: "=" },
    ] } as never)).toBe(true);
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
