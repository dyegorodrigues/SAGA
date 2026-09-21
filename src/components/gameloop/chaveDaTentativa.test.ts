import { describe, expect, it } from "vitest";
import { chaveDaTentativa } from "./chaveDaTentativa";

/**
 * A chave precisa MUDAR a cada tentativa concedida — é isso, e só isso, que
 * remonta o palco e devolve à criança alguma alternativa em que tocar.
 *
 * Uma chave constante compila, passa no olho, e recria o beco: o app diz
 * "Olha de novo!" para um palco fechado, e a criança fica presa na questão.
 */
describe("a chave que devolve a vez à criança", () => {
  it("muda a cada tentativa concedida", () => {
    const tres = [0, 1, 2].map(chaveDaTentativa);
    expect(new Set(tres).size, `chaves repetidas: ${tres.join(", ")}`).toBe(3);
  });

  it("começa estável enquanto ninguém errou", () => {
    expect(chaveDaTentativa(0)).toBe(chaveDaTentativa(0));
  });

  it("não quebra com entrada estranha", () => {
    expect(chaveDaTentativa(-1)).toBe(chaveDaTentativa(0));
  });
});
