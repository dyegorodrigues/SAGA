import { describe, expect, it } from "vitest";
import { Evidencia } from "../../constants/evidencias";
import { evidenciasFracaoNumero } from "./fracaoNumeroProcedure";
import { construirFracaoNumeroSpec } from "./fracaoNumeroContract";

describe("F72 — fração como número", () => {
  it("emite a prova de reta somente em acerto L3+", () => {
    expect(evidenciasFracaoNumero({ nivel: 2, correta: true })).toEqual([]);
    expect(evidenciasFracaoNumero({ nivel: 3, correta: false })).toEqual([]);
    expect(evidenciasFracaoNumero({ nivel: 3, correta: true })).toEqual([Evidencia.FRACAO_NUMERO_RETA]);
  });

  it("mantém a escada barra → coleção → reta → reta parcial → imprópria", () => {
    const specs = [1, 2, 3, 4, 5].map(level => construirFracaoNumeroSpec(level, () => 0.2));
    expect(specs.map(spec => spec.modo)).toEqual(["barra", "colecao", "reta", "reta-parcial", "impropria"]);
    expect(specs[4].numerador).toBeGreaterThan(specs[4].denominador);
  });
});
