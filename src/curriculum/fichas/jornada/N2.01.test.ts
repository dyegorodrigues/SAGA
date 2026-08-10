import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { N2_01 } from "./N2.01";
import {
  construirDezenaUnidadesQuestion,
  construirMaterialDouradoSpec,
} from "../../procedimentos/materialDouradoContract";
import { diagnosticarMaterialDourado } from "../../procedimentos/materialDouradoProcedure";

function sorteio(...valores: number[]) {
  let i = 0;
  return () => valores[Math.min(i++, valores.length - 1)] ?? 0;
}

describe("N2.01 / F21 — dez unidades viram uma unidade nova", () => {
  it("preserva o grafo, a progressão F21 e o domínio bidirecional", () => {
    expect(N2_01.prereqs).toEqual(["N1.09", "N1.11"]);
    expect(N2_01.niveis?.[1]?.micro).toBe("agrupar_ate_19");
    expect(N2_01.niveis?.[2]?.micro).toBe("agrupar_ate_39");
    expect(N2_01.niveis?.[3]?.micro).toBe("agrupar_sem_moldura");
    expect(N2_01.niveis?.[4]?.micro).toBe("montar_do_numeral");
    expect(N2_01.niveis?.[5]?.micro).toBe("decompor_mentalmente");
    expect(N2_01.niveis?.[5]?.rt_alvo).toBeGreaterThan(0);

    for (const micro of N2_01.micros) {
      expect(micro.dominio.acertos).toBe(3);
      expect(micro.dominio.de).toBe(3);
      expect(micro.dominio.sessoes).toBe(2);
    }
    expect(N2_01.micros.find(m => m.id === "montar_do_numeral")?.dominio.exige)
      .toEqual({
        evidencia: "montou-do-numeral",
        descricao: expect.stringContaining("montar"),
      });
  });

  it("L1 gera 10–19 e exige agrupamento manual com moldura", () => {
    for (let i = 0; i < 40; i += 1) {
      const spec = construirMaterialDouradoSpec(1, Math.random);
      expect(spec.modo).toBe("agrupar");
      expect(spec.total).toBeGreaterThanOrEqual(10);
      expect(spec.total).toBeLessThanOrEqual(19);
      expect(spec.usarMoldura).toBe(true);
      expect(spec.dezenas).toBe(Math.floor(spec.total / 10));
      expect(spec.unidades).toBe(spec.total % 10);
    }
  });

  it("L2 gera 20–39 e exige ciclos manuais de agrupamento com moldura", () => {
    for (let i = 0; i < 40; i += 1) {
      const spec = construirMaterialDouradoSpec(2, Math.random);
      expect(spec.modo).toBe("agrupar");
      expect(spec.total).toBeGreaterThanOrEqual(20);
      expect(spec.total).toBeLessThanOrEqual(39);
      expect(spec.usarMoldura).toBe(true);
      expect(spec.dezenas).toBeGreaterThanOrEqual(2);
      expect(spec.dezenas).toBeLessThanOrEqual(3);
    }
  });

  it("L3 continua agrupando até 99, mas retira a moldura de apoio", () => {
    for (let i = 0; i < 60; i += 1) {
      const spec = construirMaterialDouradoSpec(3, Math.random);
      expect(spec.modo).toBe("agrupar");
      expect(spec.total).toBeGreaterThanOrEqual(10);
      expect(spec.total).toBeLessThanOrEqual(99);
      expect(spec.usarMoldura).toBe(false);
      expect(spec.dezenas).toBe(Math.floor(spec.total / 10));
      expect(spec.unidades).toBe(spec.total % 10);
    }
  });

  it("L4 inverte: recebe um numeral e monta barras + cubinhos", () => {
    const spec = construirMaterialDouradoSpec(4, sorteio(0.24));
    expect(spec.modo).toBe("montar");
    expect(spec.total).toBeGreaterThanOrEqual(10);
    expect(spec.total).toBeLessThanOrEqual(99);
    expect(spec.alvoNumeral).toBe(spec.total);
    expect(spec.dezenas).toBe(Math.floor(spec.total / 10));
    expect(spec.unidades).toBe(spec.total % 10);
  });

  it("L5 é decomposição mental, nunca mistura aleatória de leitura/produção", () => {
    for (let i = 0; i < 40; i += 1) {
      const spec = construirMaterialDouradoSpec(5, Math.random);
      expect(spec.modo).toBe("decompor");
      expect(spec.total).toBeGreaterThanOrEqual(10);
      expect(spec.total).toBeLessThanOrEqual(99);
      expect(spec.dezenas).toBe(Math.floor(spec.total / 10));
      expect(spec.unidades).toBe(spec.total % 10);
    }
  });

  it("specialized builder preserva a coreografia F21, domínio e RT silencioso", () => {
    const q1 = construirDezenaUnidadesQuestion(N2_01, 1);
    const q4 = construirDezenaUnidadesQuestion(N2_01, 4);
    const q5 = construirDezenaUnidadesQuestion(N2_01, 5);

    expect(q1.kind).toBe("material-dourado");
    expect(q1.tutorial).toEqual([
      expect.objectContaining({ say: "Vamos juntar de dez em dez.", show: { pulsarMoldura: true } }),
      expect.objectContaining({ say: "Um, dois, três...", show: { preencherAte: 10 } }),
      expect.objectContaining({ say: "Dez! Viraram uma barra!", show: { fundirEmBarra: true } }),
      expect.objectContaining({ say: "Isso é uma dezena.", show: { destacarBarra: true } }),
    ]);
    expect(q1.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
    expect(q4.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
    expect(q4.exigeEvidencia).toBe("montou-do-numeral");
    expect(q5.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
    expect(q5.rt_max_s).toBeGreaterThan(0);
    expect(q1.options).toBeUndefined();
  });

  it("usa somente os três diagnósticos canônicos da F21", () => {
    const spec = construirMaterialDouradoSpec(4, sorteio(0.13));

    expect(diagnosticarMaterialDourado({
      modo: "montar",
      resposta: spec.dezenas + spec.unidades,
      dezenasProduzidas: 0,
      unidadesProduzidas: spec.dezenas + spec.unidades,
      contouUmAUm: false,
      trocasConcluidas: 0,
    }, spec)).toBe(MisconceptionTag.IGNORA_VALOR);

    expect(diagnosticarMaterialDourado({
      modo: "montar",
      resposta: spec.unidades * 10 + spec.dezenas,
      dezenasProduzidas: spec.unidades,
      unidadesProduzidas: spec.dezenas,
      contouUmAUm: false,
      trocasConcluidas: 0,
    }, spec)).toBe(MisconceptionTag.INVERTE_ORDENS);

    const agrupamento = construirMaterialDouradoSpec(3, sorteio(0.4));
    expect(diagnosticarMaterialDourado({
      modo: "agrupar",
      resposta: agrupamento.total,
      dezenasProduzidas: agrupamento.dezenas,
      unidadesProduzidas: agrupamento.unidades,
      contouUmAUm: true,
      trocasConcluidas: agrupamento.dezenas,
    }, agrupamento)).toBe(MisconceptionTag.NAO_AGRUPA);
  });
});