import { describe, expect, it } from "vitest";
import { armadilhaReal, construirMedidasSpec, semEmpate } from "./medidasContract";

const seq = (valores: number[]) => {
  let i = 0;
  return () => valores[(i++) % valores.length];
};

describe("F50 — escada de massa e capacidade", () => {
  it("L1 usa peso; L2 capacidade", () => {
    expect(construirMedidasSpec(1, seq([0.2, 0.7])).modo).toBe("peso");
    expect(construirMedidasSpec(2, seq([0.2, 0.7])).modo).toBe("capacidade");
  });
  it("L3 cria a armadilha de formato: altura aparente e capacidade discordam", () => {
    const s = construirMedidasSpec(3, seq([0.1, 0.8, 0.3]));
    expect(s.formatosDiferentes).toBe(true);
    expect(s.contraintuitivo).toBe(true);
    expect(s.ordemVisual[0]).not.toBe(s.ordemCerta[0]);
    expect(armadilhaReal(s)).toBe(true);
  });
  it("L4 garante o pequeno pesado contra o grande leve", () => {
    const s = construirMedidasSpec(4, seq([0.2, 0.8]));
    expect(s.modo).toBe("peso");
    expect(s.ordemVisual[0]).not.toBe(s.ordemCerta[0]);
    expect(armadilhaReal(s)).toBe(true);
  });
  it("L5 possui três grandezas distintas e pode sortear os dois modos", () => {
    const peso = construirMedidasSpec(5, seq([0.1, 0.2, 0.3, 0.4]));
    const capacidade = construirMedidasSpec(5, seq([0.9, 0.2, 0.3, 0.4]));
    expect(peso.modo).toBe("peso");
    expect(capacidade.modo).toBe("capacidade");
    expect(peso.itens).toHaveLength(3);
    expect(capacidade.itens).toHaveLength(3);
    expect(semEmpate(peso)).toBe(true);
    expect(semEmpate(capacidade)).toBe(true);
  });
});
