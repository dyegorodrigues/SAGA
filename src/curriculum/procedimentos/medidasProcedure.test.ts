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
});
