import { describe, expect, it } from "vitest";
import { Evidencia } from "../../constants/evidencias";
import { construirDecimalSpec } from "./decimalContract";
import { evidenciasDecimais } from "./decimalProcedure";

describe("F75 — décimos e centésimos", () => {
  it("preserva 1 inteiro = 10 décimos = 100 centésimos", () => {
    const specs=[1,2,3,4,5].map(level=>construirDecimalSpec(level,()=>0.2));
    expect(specs.every(s=>s.unidadeDoQuadrado===1&&s.valorDaColuna===0.1&&s.valorDaCelula===0.01)).toBe(true);
    expect(specs.map(s=>s.modo)).toEqual(["decimos","centesimos","fracao-decimal","comparar","ordenar"]);
  });
  it("só a comparação correta L4 emite a evidência extra da §9", () => {
    expect(evidenciasDecimais(3,true)).toEqual([]);
    expect(evidenciasDecimais(4,false)).toEqual([]);
    expect(evidenciasDecimais(4,true)).toEqual([Evidencia.DECIMAL_COMPARACAO]);
  });
});
