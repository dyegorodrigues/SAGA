import { describe, expect, it } from "vitest";
import { MisconceptionTagF29 } from "../../constants/misconceptionsF29";
import { N2_03 } from "../fichas/jornada/N2.03";
import {
  construirComparacaoSimbolicaQuestion,
  construirComparacaoSimbolicaSpec,
} from "./comparacaoSimbolicaContract";
import {
  diagnosticarComparacaoSimbolica,
  evidenciasComparacaoSimbolica,
} from "./comparacaoSimbolicaProcedure";

function seq(...valores: number[]) {
  let i = 0;
  return () => valores[i++ % valores.length];
}

describe("contrato F29 — comparação simbólica", () => {
  it("mantém os limites concretos e simbólicos por nível", () => {
    for (let i = 0; i < 50; i += 1) {
      const l1 = construirComparacaoSimbolicaSpec(1);
      expect(l1.lados.map(l => l.tipo)).toEqual(["grupo", "grupo"]);
      expect(l1.lados.every(l => l.valor <= 10)).toBe(true);

      const l3 = construirComparacaoSimbolicaSpec(3);
      expect(l3.lados.every(l => l.tipo === "numeral" && l.valor <= 20)).toBe(true);

      const l4 = construirComparacaoSimbolicaSpec(4);
      expect(l4.lados.every(l => l.tipo === "numeral" && l.valor <= 100)).toBe(true);

      const l5 = construirComparacaoSimbolicaSpec(5);
      expect(l5.lados.every(l => l.tipo === "expressao")).toBe(true);
    }
  });

  it("faz a ponte grupo × numeral no nível 2 sem alterar Grupo", () => {
    const spec = construirComparacaoSimbolicaSpec(2, seq(0.1, 0.2, 0.3, 0.1));
    expect(spec.lados.map(l => l.tipo).sort()).toEqual(["grupo", "numeral"]);
  });

  it("calcula o símbolo pelos valores, não pelo andaime do jacaré", () => {
    const spec = construirComparacaoSimbolicaSpec(3, seq(0.1, 0.4, 0.5));
    const [a, b] = spec.lados.map(l => l.valor);
    expect(spec.resposta).toBe(a > b ? ">" : a < b ? "<" : "=");
  });

  it("entrega os três símbolos e tags reais nos distratores", () => {
    for (let i = 0; i < 40; i += 1) {
      const q = construirComparacaoSimbolicaQuestion(N2_03, 4);
      expect(q.options?.map(o => o.value).sort()).toEqual(["<", "=", ">"].sort());
      for (const opcao of q.options ?? []) {
        if (opcao.value === q.answer) expect(opcao.misconception).toBeUndefined();
        else expect(opcao.misconception).toBeTruthy();
      }
    }
  });

  it("diagnostica inversão, igualdade indevida e comparação ausente", () => {
    const maior = { ...construirComparacaoSimbolicaSpec(4), resposta: ">" as const };
    expect(diagnosticarComparacaoSimbolica("<", maior)).toBe(MisconceptionTagF29.INVERTE_SIMBOLO);
    expect(diagnosticarComparacaoSimbolica("=", maior)).toBe(MisconceptionTagF29.IGNORA_DIFERENCA);

    const igual = { ...maior, resposta: "=" as const };
    expect(diagnosticarComparacaoSimbolica(">", igual)).toBe(MisconceptionTagF29.NAO_COMPARA_SIMBOLO);
  });

  it("só emite evidência de domínio a partir do L3 e quando a resposta está certa", () => {
    expect(evidenciasComparacaoSimbolica({ nivel: 2, ordemDeToques: [], revisoesDeSimbolo: 0, escolha: ">", correta: true })).toEqual([]);
    expect(evidenciasComparacaoSimbolica({ nivel: 3, ordemDeToques: [], revisoesDeSimbolo: 0, escolha: ">", correta: false })).toEqual([]);
    expect(evidenciasComparacaoSimbolica({ nivel: 3, ordemDeToques: [], revisoesDeSimbolo: 0, escolha: ">", correta: true })).toEqual(["comparacao-simbolica-sem-objetos"]);
  });
});
