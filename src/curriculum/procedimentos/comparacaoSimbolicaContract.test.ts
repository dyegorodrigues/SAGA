import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../constants/misconceptions";
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

function parcelas(texto: string): [number, number] {
  const valores = texto.split(" + ").map(Number);
  if (valores.length !== 2 || valores.some(valor => !Number.isFinite(valor))) {
    throw new Error(`Expressão F29 inválida: ${texto}`);
  }
  return [valores[0], valores[1]];
}

describe("contrato F29 — comparação simbólica", () => {
  it("mantém os limites concretos e simbólicos por nível", () => {
    for (let i = 0; i < 50; i += 1) {
      const l1 = construirComparacaoSimbolicaSpec(1);
      expect(l1.lados.map(l => l.tipo)).toEqual(["grupo", "grupo"]);
      expect(l1.lados.every(l => l.valor <= 10)).toBe(true);

      const l2 = construirComparacaoSimbolicaSpec(2);
      expect(l2.lados.map(l => l.tipo).sort()).toEqual(["grupo", "numeral"]);
      expect(l2.lados.every(l => l.valor <= 10)).toBe(true);

      const l3 = construirComparacaoSimbolicaSpec(3);
      expect(l3.lados.every(l => l.tipo === "numeral" && l.valor <= 20)).toBe(true);

      const l4 = construirComparacaoSimbolicaSpec(4);
      expect(l4.lados.every(l => l.tipo === "numeral" && l.valor <= 100)).toBe(true);

      const l5 = construirComparacaoSimbolicaSpec(5);
      expect(l5.lados.every(l => l.tipo === "expressao")).toBe(true);
    }
  });

  it("não dobra a faixa no mesmo degrau em que o numeral estreia no L2", () => {
    const spec = construirComparacaoSimbolicaSpec(2, seq(0.1, 0.95, 0.5, 0.1));
    expect(spec.lados.map(l => l.tipo).sort()).toEqual(["grupo", "numeral"]);
    expect(Math.max(...spec.lados.map(l => l.valor))).toBeLessThanOrEqual(10);
  });

  it("faz a ponte grupo × numeral no nível 2 sem alterar Grupo", () => {
    const spec = construirComparacaoSimbolicaSpec(2, seq(0.1, 0.2, 0.3, 0.1));
    expect(spec.lados.map(l => l.tipo).sort()).toEqual(["grupo", "numeral"]);
  });

  it("mantém o L5 relacional com parcela compartilhada, sem exigir cálculo de duas somas", () => {
    const spec = construirComparacaoSimbolicaSpec(5, seq(0.1, 0.5, 0.1, 0.2, 0.6));
    const [esquerda, direita] = spec.lados;
    const parcelasEsquerda = parcelas(esquerda.texto);
    const parcelasDireita = parcelas(direita.texto);

    expect(parcelasEsquerda[0] === parcelasDireita[0] || parcelasEsquerda[1] === parcelasDireita[1]).toBe(true);
    expect(parcelasEsquerda[0] + parcelasEsquerda[1]).toBe(esquerda.valor);
    expect(parcelasDireita[0] + parcelasDireita[1]).toBe(direita.valor);
    expect(spec.resposta).toBe(">");
  });

  it("calcula o símbolo pelos valores, não pelo andaime do jacaré", () => {
    const spec = construirComparacaoSimbolicaSpec(3, seq(0.1, 0.4, 0.5));
    const [a, b] = spec.lados.map(l => l.valor);
    expect(spec.resposta).toBe(a > b ? ">" : a < b ? "<" : "=");
  });

  it("entrega os três símbolos e tags canônicas reais nos distratores", () => {
    const canonicas = new Set(Object.values(MisconceptionTag));
    for (let i = 0; i < 40; i += 1) {
      const q = construirComparacaoSimbolicaQuestion(N2_03, 4);
      expect(q.options?.map(o => o.value).sort()).toEqual(["<", "=", ">"].sort());
      for (const opcao of q.options ?? []) {
        if (opcao.value === q.answer) expect(opcao.misconception).toBeUndefined();
        else {
          expect(opcao.misconception).toBeTruthy();
          expect(canonicas).toContain(opcao.misconception);
        }
      }
    }
  });

  it("diagnostica inversão, igualdade indevida e comparação ausente", () => {
    const maior = { ...construirComparacaoSimbolicaSpec(4), resposta: ">" as const };
    expect(diagnosticarComparacaoSimbolica("<", maior)).toBe(MisconceptionTag.INVERTE_SIMBOLO);
    expect(diagnosticarComparacaoSimbolica("=", maior)).toBe(MisconceptionTag.IGNORA_DIFERENCA);

    const igual = { ...maior, resposta: "=" as const };
    expect(diagnosticarComparacaoSimbolica(">", igual)).toBe(MisconceptionTag.NAO_COMPARA_SIMBOLO);
  });

  it("só emite evidência de domínio a partir do L3 e quando a resposta está certa", () => {
    expect(evidenciasComparacaoSimbolica({ nivel: 2, ordemDeToques: [], revisoesDeSimbolo: 0, escolha: ">", correta: true })).toEqual([]);
    expect(evidenciasComparacaoSimbolica({ nivel: 3, ordemDeToques: [], revisoesDeSimbolo: 0, escolha: ">", correta: false })).toEqual([]);
    expect(evidenciasComparacaoSimbolica({ nivel: 3, ordemDeToques: [], revisoesDeSimbolo: 0, escolha: ">", correta: true })).toEqual(["comparacao-simbolica-sem-objetos"]);
  });
});
