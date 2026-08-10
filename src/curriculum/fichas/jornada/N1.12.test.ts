import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { N1_12 } from "./N1.12";
import {
  construirReta20Question,
  construirReta20Spec,
} from "../../procedimentos/reta20Contract";
import { diagnosticarReta20 } from "../../procedimentos/reta20Procedure";

function sorteio(...valores: number[]) {
  let i = 0;
  return () => valores[Math.min(i++, valores.length - 1)] ?? 0;
}

describe("N1.12 / F19 — número como posição e movimento", () => {
  it("preserva o DAG e a progressão F19 nos cinco níveis", () => {
    expect(N1_12.prereqs).toEqual(["N1.07", "N1.09"]);
    expect(N1_12.niveis?.[1]?.micro).toBe("localizar_0_10");
    expect(N1_12.niveis?.[2]?.micro).toBe("localizar_0_20");
    expect(N1_12.niveis?.[3]?.micro).toBe("saltar_mais_1_2");
    expect(N1_12.niveis?.[4]?.micro).toBe("saltar_menos_1_2");
    expect(N1_12.niveis?.[5]?.micro).toBe("saltos_mistos");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      expect(N1_12.niveis?.[nivel]?.primitiva).toBe("numberline");
    }
    expect(N1_12.niveis?.[5]?.rt_alvo).toBe(7000);
  });

  it("L1/L2 localizam posições sem transformar a reta em pergunta de sucessor", () => {
    const l1 = construirReta20Spec(1, sorteio(0.6));
    const l2 = construirReta20Spec(2, sorteio(0.6));
    expect(l1.modo).toBe("localizar");
    expect(l1.inicio).toBe(0);
    expect(l1.fim).toBe(10);
    expect(l1.alvo).toBeGreaterThanOrEqual(1);
    expect(l1.alvo).toBeLessThanOrEqual(10);
    expect(l2.modo).toBe("localizar");
    expect(l2.inicio).toBe(0);
    expect(l2.fim).toBe(20);
    expect(l2.alvo).toBeGreaterThanOrEqual(1);
    expect(l2.alvo).toBeLessThanOrEqual(20);
  });

  it("L3/L4/L5 treinam direção e tamanho de salto, não escala maior", () => {
    for (let i = 0; i < 40; i += 1) {
      const l3 = construirReta20Spec(3, Math.random);
      const l4 = construirReta20Spec(4, Math.random);
      const l5 = construirReta20Spec(5, Math.random);
      expect(l3.modo).toBe("saltar");
      expect([1, 2]).toContain(l3.salto);
      expect(l3.alvo - l3.posicaoInicial).toBe(l3.salto);
      expect(l4.modo).toBe("saltar");
      expect([-1, -2]).toContain(l4.salto);
      expect(l4.alvo - l4.posicaoInicial).toBe(l4.salto);
      expect(l5.modo).toBe("saltar");
      expect([-2, -1, 1, 2]).toContain(l5.salto);
      expect(l5.alvo - l5.posicaoInicial).toBe(l5.salto);
      for (const spec of [l3, l4, l5]) {
        expect(spec.inicio).toBe(0);
        expect(spec.fim).toBe(20);
        expect(spec.alvo).toBeGreaterThanOrEqual(0);
        expect(spec.alvo).toBeLessThanOrEqual(20);
      }
    }
  });

  it("specialized builder preserva tutorial, mastery e RT silencioso", () => {
    const q1 = construirReta20Question(N1_12, 1);
    const q5 = construirReta20Question(N1_12, 5);
    expect(q1.kind).toBe("numberline-f19");
    expect(q1.tutorial?.length).toBeGreaterThan(0);
    expect(q1.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
    expect(q5.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
    expect(q5.rt_max_s).toBe(7);
    expect(q1.options).toBeUndefined();
  });

  it("diagnostica a decisão matemática depois da resolução motora", () => {
    const frente = construirReta20Spec(3, sorteio(0.4, 0));
    expect(diagnosticarReta20({
      escolhido: frente.posicaoInicial - frente.salto,
      posicaoInicial: frente.posicaoInicial,
      alvo: frente.alvo,
      salto: frente.salto,
      gesto: "toque",
    }, frente)).toBe(MisconceptionTag.DIRECAO_INVERTIDA);

    expect(diagnosticarReta20({
      escolhido: frente.alvo + 1,
      posicaoInicial: frente.posicaoInicial,
      alvo: frente.alvo,
      salto: frente.salto,
      gesto: "toque",
    }, frente)).toBe(MisconceptionTag.ERRO_DE_UM);

    expect(diagnosticarReta20({
      escolhido: Math.abs(frente.salto),
      posicaoInicial: frente.posicaoInicial,
      alvo: frente.alvo,
      salto: frente.salto,
      gesto: "toque",
    }, frente)).toBe(MisconceptionTag.CONTA_SEM_POSICAO);
  });
});