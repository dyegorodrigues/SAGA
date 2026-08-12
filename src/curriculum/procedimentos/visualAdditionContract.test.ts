import { describe, expect, it } from "vitest";
import { N3_01 } from "../fichas/jornada/N3.01";
import { construirVisualAdditionQuestion, construirVisualAdditionSpec } from "./visualAdditionContract";
import { diagnosticarVisualAddition, evidenciasVisualAddition } from "./visualAdditionProcedure";
import { VisualAdditionEvidence, VisualAdditionMisconception } from "./visualAdditionSemantics";

describe("F13 — contrato VisualAddition", () => {
  it("preserva a escada objetos → numerais → símbolo", () => {
    expect(construirVisualAdditionSpec(1, () => 0).representacao).toBe("objetos");
    expect(construirVisualAdditionSpec(3, () => 0).representacao).toBe("objetos");
    expect(construirVisualAdditionSpec(4, () => 0).representacao).toBe("numerais");
    expect(construirVisualAdditionSpec(5, () => 0).representacao).toBe("simbolo");
  });

  it("limita L1/L2 a total 5 e L3+ a total 10", () => {
    for (let level = 1; level <= 5; level += 1) {
      for (let i = 0; i < 500; i += 1) {
        const spec = construirVisualAdditionSpec(level);
        expect(spec.a).toBeGreaterThanOrEqual(1);
        expect(spec.b).toBeGreaterThanOrEqual(1);
        expect(spec.total).toBeLessThanOrEqual(level <= 2 ? 5 : 10);
      }
    }
  });

  it("propaga onboarding, domínio L4 e RT silencioso L5", () => {
    const l1 = construirVisualAdditionQuestion(N3_01, 1);
    const l4 = construirVisualAdditionQuestion(N3_01, 4);
    const l5 = construirVisualAdditionQuestion(N3_01, 5);
    expect(l1.tutorial).toHaveLength(3);
    expect(l4.exigeEvidencia).toBe(VisualAdditionEvidence.SEM_OBJETOS);
    expect(l5.rt_max_s).toBe(5);
    expect(l5.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
  });

  it("diagnostica as assinaturas observáveis sem transformar velocidade em conceito", () => {
    const spec = { ...construirVisualAdditionSpec(4, () => 0), a: 3, b: 2, total: 5 };
    expect(diagnosticarVisualAddition(3, spec)).toBe(VisualAdditionMisconception.REPETE_PARCELA);
    expect(diagnosticarVisualAddition(4, spec)).toBe(VisualAdditionMisconception.OFF_BY_ONE);
    expect(diagnosticarVisualAddition(1, spec)).toBe(VisualAdditionMisconception.SUBTRAIU);
    expect(diagnosticarVisualAddition(5, spec)).toBeUndefined();
  });

  it("emite a evidência de retirada concreta somente no L4 correto", () => {
    expect(evidenciasVisualAddition({ nivel: 4, resposta: 5, correta: true, juntou: true, usouAjuda: false, revisoes: 0 }))
      .toContain(VisualAdditionEvidence.SEM_OBJETOS);
    expect(evidenciasVisualAddition({ nivel: 3, resposta: 5, correta: true, juntou: true, usouAjuda: false, revisoes: 0 }))
      .toEqual([]);
    expect(evidenciasVisualAddition({ nivel: 4, resposta: 4, correta: false, juntou: false, usouAjuda: false, revisoes: 0 }))
      .toEqual([]);
  });
});
