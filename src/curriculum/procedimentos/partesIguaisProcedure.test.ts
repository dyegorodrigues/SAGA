import { describe, expect, it } from "vitest";
import { Evidencia } from "../../constants/evidencias";
import { cortesAlvoPartesIguais, cortesSaoPartesIguais, evidenciasPartesIguais, intervalosDosCortes } from "./partesIguaisProcedure";

describe("F45 — procedimento de partes iguais", () => {
  it.each([2, 3, 4])("gera %i partes matematicamente iguais", denominador => {
    const cortes = cortesAlvoPartesIguais(denominador);
    expect(cortes).toHaveLength(denominador - 1);
    expect(cortesSaoPartesIguais(cortes, denominador)).toBe(true);
    const intervalos = intervalosDosCortes(cortes);
    expect(intervalos).toHaveLength(denominador);
    expect(Math.max(...intervalos) - Math.min(...intervalos)).toBeLessThan(1e-9);
  });

  it("não transforma marca imprecisa em evidência conceitual", () => {
    const impreciso = [0.42];
    expect(cortesSaoPartesIguais(impreciso, 2)).toBe(false);
    expect(evidenciasPartesIguais({ nivel: 4, denominador: 2, cortes: impreciso })).toEqual([]);
  });

  it("emite a evidência da §9 somente para divisão correta no L4", () => {
    const corretos = cortesAlvoPartesIguais(3);
    expect(evidenciasPartesIguais({ nivel: 4, denominador: 3, cortes: corretos })).toEqual([Evidencia.PARTES_IGUAIS_DIVISAO]);
    expect(evidenciasPartesIguais({ nivel: 3, denominador: 3, cortes: corretos })).toEqual([]);
  });
});
