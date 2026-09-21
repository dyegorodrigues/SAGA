import { describe, expect, it } from "vitest";
import { chaveDaFala, textoFalado } from "./chaveDaFala";

describe("a chave de uma fala", () => {
  it("é estável: o mesmo texto dá sempre o mesmo nome de arquivo", () => {
    expect(chaveDaFala("Muito bem!")).toBe(chaveDaFala("Muito bem!"));
    expect(chaveDaFala("Muito bem!")).toHaveLength(16);
    expect(chaveDaFala("Muito bem!")).toMatch(/^[0-9a-f]{16}$/);
  });

  it("ignora emoji e espaço, porque o sintetizador também ignora", () => {
    expect(textoFalado("Muito bem! 🎉")).toBe("Muito bem!");
    expect(textoFalado("  Olha   de novo!  ")).toBe("Olha de novo!");
    expect(chaveDaFala("Muito bem! 🎉")).toBe(chaveDaFala("Muito bem!"));
  });

  it("separa textos diferentes", () => {
    const vistas = new Set<string>();
    // Falas que o app diz de verdade, e que não podem colidir entre si.
    for (const t of ["um", "dois", "três", "Muito bem!", "Olha de novo!", "7 mais 1.", "1 mais 7."]) {
      vistas.add(chaveDaFala(t));
    }
    expect(vistas.size).toBe(7);
  });
});
