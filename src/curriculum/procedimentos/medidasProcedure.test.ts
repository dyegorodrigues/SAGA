import { describe, expect, it } from "vitest";
import { Evidencia } from "../../constants/evidencias";
import { MisconceptionTag } from "../../constants/misconceptions";
import { AcaoDeMedida, diagnosticar, dominou, evidenciasDe } from "./medidasProcedure";

const base: AcaoDeMedida = {
  modo: "peso", escolhido: 0, certo: 0, ordemCerta: [0, 1], ordemVisual: [1, 0],
  contraintuitivo: true, formatosDiferentes: false, verificou: true, maiorVisual: 1,
};

describe("F50 — diagnóstico e evidência", () => {
  it("colhe a evidência do caso contraintuitivo somente no acerto", () => {
    expect(evidenciasDe(base)).toEqual([Evidencia.CASO_CONTRAINTUITIVO]);
    expect(evidenciasDe({ ...base, escolhido: 1 })).toEqual([]);
  });
  it("não concede evidência contraintuitiva de capacidade antes da verificação física", () => {
    const capacidadeSemVerificar: AcaoDeMedida = {
      ...base,
      modo: "capacidade",
      formatosDiferentes: true,
      verificou: false,
    };

    expect(evidenciasDe(capacidadeSemVerificar)).toEqual([]);
    expect(evidenciasDe({ ...capacidadeSemVerificar, verificou: true })).toEqual([Evidencia.CASO_CONTRAINTUITIVO]);
  });
  it("nomeia julgamento pelo tamanho no peso", () => {
    expect(diagnosticar({ ...base, escolhido: 1 })).toBe(MisconceptionTag.JULGA_PELO_TAMANHO);
  });
  it("nomeia ignorar formato na capacidade antes da verificação", () => {
    expect(diagnosticar({ ...base, modo: "capacidade", escolhido: 1, formatosDiferentes: true, verificou: false })).toBe(MisconceptionTag.IGNORA_FORMATO);
  });
  it("domínio exige três acertos e pelo menos um contraintuitivo", () => {
    expect(dominou([base, { ...base, contraintuitivo: false }, { ...base, contraintuitivo: false }])).toBe(true);
    expect(dominou([{ ...base, contraintuitivo: false }, { ...base, contraintuitivo: false }, { ...base, contraintuitivo: false }])).toBe(false);
  });
  it("não coroa capacidade contraintuitiva sem a verificação física", () => {
    const capacidade: AcaoDeMedida = { ...base, modo: "capacidade", formatosDiferentes: true };
    const semVerificar = { ...capacidade, verificou: false };
    const comVerificar = { ...capacidade, verificou: true };

    // Três acertos, um deles contraintuitivo — mas sem despejar. Não pode coroar.
    expect(dominou([semVerificar, semVerificar, semVerificar])).toBe(false);
    // O mesmo histórico, com a verificação feita, coroa.
    expect(dominou([comVerificar, comVerificar, comVerificar])).toBe(true);
  });
});
