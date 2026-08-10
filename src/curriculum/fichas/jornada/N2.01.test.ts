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

describe("N2.01 / F21 — dezena como unidade composta", () => {
  it("preserva o grafo e usa MaterialDourado nos cinco níveis", () => {
    expect(N2_01.prereqs).toEqual(["N1.09", "N1.11"]);
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      expect(N2_01.niveis?.[nivel]?.primitiva).toBe("tens");
      expect(N2_01.niveis?.[nivel]?.micro).toBeTruthy();
    }
    expect(N2_01.niveis?.[5]?.rt_alvo).toBeGreaterThan(0);
  });

  it("L1 exige a troca 10 unidades → 1 dezena antes da leitura", () => {
    const spec = construirMaterialDouradoSpec(1, sorteio(0));
    expect(spec.modo).toBe("ler");
    expect(spec.exigeTroca).toBe(true);
    expect(spec.dezenas).toBe(1);
    expect(spec.unidades).toBeGreaterThanOrEqual(1);
    expect(spec.unidades).toBeLessThanOrEqual(9);
    expect(spec.equivalencia).toBe("10 unidades = 1 dezena");
    expect(spec.resposta).toBe(10 + spec.unidades);
  });

  it("L2/L3 ampliam o material sem retirar a representação concreta", () => {
    for (const nivel of [2, 3]) {
      for (let i = 0; i < 30; i += 1) {
        const spec = construirMaterialDouradoSpec(nivel, Math.random);
        expect(spec.modo).toBe("ler");
        expect(spec.exigeTroca).toBe(false);
        expect(spec.dezenas).toBeGreaterThanOrEqual(nivel === 2 ? 2 : 1);
        expect(spec.dezenas).toBeLessThanOrEqual(nivel === 2 ? 5 : 9);
        expect(spec.unidades).toBeGreaterThanOrEqual(0);
        expect(spec.unidades).toBeLessThanOrEqual(9);
        expect(spec.resposta).toBe(spec.dezenas * 10 + spec.unidades);
      }
    }
  });

  it("L4 inverte a operação: numeral → produzir barras e cubinhos", () => {
    const spec = construirMaterialDouradoSpec(4, sorteio(0.35, 0.2));
    expect(spec.modo).toBe("produzir");
    expect(spec.alvoNumeral).toBe(spec.dezenas * 10 + spec.unidades);
    expect(spec.resposta).toBe(spec.alvoNumeral);
  });

  it("L5 mistura leitura e produção e aceita zero unidades", () => {
    const leitura = construirMaterialDouradoSpec(5, sorteio(0.1, 0.3, 0));
    const producao = construirMaterialDouradoSpec(5, sorteio(0.9, 0.3, 0));
    expect(leitura.modo).toBe("ler");
    expect(producao.modo).toBe("produzir");
    expect(leitura.unidades).toBe(0);
    expect(producao.unidades).toBe(0);
  });

  it("specialized builder preserva tutorial, masteryRule e RT silencioso", () => {
    const q1 = construirDezenaUnidadesQuestion(N2_01, 1);
    const q5 = construirDezenaUnidadesQuestion(N2_01, 5);
    expect(q1.kind).toBe("material-dourado");
    expect((q1.uiProps as any).modo).toBe("ler");
    expect(q1.tutorial?.length).toBeGreaterThan(0);
    expect(q1.masteryRule).toEqual({ acertos: 9, de: 10, sessoes: 2 });
    expect(q5.masteryRule).toEqual({ acertos: 9, de: 10, sessoes: 2 });
    expect(q5.rt_max_s).toBeGreaterThan(0);
    expect(q1.options).toBeUndefined();
  });

  it("diagnostica pelas ações F21, não por strings soltas de alternativa", () => {
    const leitura = construirMaterialDouradoSpec(3, sorteio(0.2, 0.4));
    expect(diagnosticarMaterialDourado({
      modo: "ler",
      resposta: leitura.unidades,
      dezenasProduzidas: leitura.dezenas,
      unidadesProduzidas: leitura.unidades,
      contouSubdivisoes: false,
      completouTroca: true,
    }, leitura)).toBe(MisconceptionTag.IGNORA_DEZENA);

    expect(diagnosticarMaterialDourado({
      modo: "ler",
      resposta: leitura.dezenas * 100 + leitura.unidades,
      dezenasProduzidas: leitura.dezenas,
      unidadesProduzidas: leitura.unidades,
      contouSubdivisoes: false,
      completouTroca: true,
    }, leitura)).toBe(MisconceptionTag.CONCATENA);

    expect(diagnosticarMaterialDourado({
      modo: "ler",
      resposta: leitura.resposta - 1,
      dezenasProduzidas: leitura.dezenas,
      unidadesProduzidas: leitura.unidades,
      contouSubdivisoes: true,
      completouTroca: true,
    }, leitura)).toBe(MisconceptionTag.CONTA_TUDO);

    const producao = construirMaterialDouradoSpec(4, sorteio(0.3, 0.2));
    expect(diagnosticarMaterialDourado({
      modo: "produzir",
      resposta: producao.unidades * 10 + producao.dezenas,
      dezenasProduzidas: producao.unidades,
      unidadesProduzidas: producao.dezenas,
      contouSubdivisoes: false,
      completouTroca: true,
    }, producao)).toBe(MisconceptionTag.TROCA_DU);
  });
});