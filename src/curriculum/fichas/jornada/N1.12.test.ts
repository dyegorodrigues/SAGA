import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { N1_12 } from "./N1.12";
import {
  construirReta20Question,
  construirReta20Spec,
} from "../../procedimentos/reta20Contract";
import { diagnosticarReta20, resolverSolturaReta } from "../../procedimentos/reta20Procedure";

function sorteio(...valores: number[]) {
  let i = 0;
  return () => valores[Math.min(i++, valores.length - 1)] ?? 0;
}

describe("N1.12 / F19 — número como posição e movimento", () => {
  it("preserva o DAG e a progressão F19 nos cinco níveis", () => {
    expect(N1_12.prereqs).toEqual(["N1.07", "N1.09"]);
    expect(N1_12.niveis?.[1]?.micro).toBe("localizar_0_10");
    expect(N1_12.niveis?.[2]?.micro).toBe("saltar_frente_0_10");
    expect(N1_12.niveis?.[3]?.micro).toBe("saltar_tras_0_10");
    expect(N1_12.niveis?.[4]?.micro).toBe("localizar_parcial_0_20");
    expect(N1_12.niveis?.[5]?.micro).toBe("saltos_variaveis");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      expect(N1_12.niveis?.[nivel]?.primitiva).toBe("numberline");
    }
    expect(N1_12.niveis?.[5]?.rt_alvo).toBeGreaterThan(0);
  });

  it("L1 localiza em 0–10 com todos os numerais visíveis", () => {
    const l1 = construirReta20Spec(1, sorteio(0.6));
    expect(l1.modo).toBe("localizar");
    expect(l1.inicio).toBe(0);
    expect(l1.fim).toBe(10);
    expect(l1.numeraisVisiveis).toEqual(Array.from({ length: 11 }, (_, i) => i));
    expect(l1.alvo).toBeGreaterThanOrEqual(1);
    expect(l1.alvo).toBeLessThanOrEqual(10);
  });

  it("L2 salta para frente e L3 para trás na reta 0–10", () => {
    for (let i = 0; i < 40; i += 1) {
      const l2 = construirReta20Spec(2, Math.random);
      const l3 = construirReta20Spec(3, Math.random);
      expect(l2.modo).toBe("saltar");
      expect(l2.inicio).toBe(0);
      expect(l2.fim).toBe(10);
      expect(l2.salto).toBeGreaterThan(0);
      expect(l2.alvo - l2.posicaoInicial).toBe(l2.salto);
      expect(l3.modo).toBe("saltar");
      expect(l3.inicio).toBe(0);
      expect(l3.fim).toBe(10);
      expect(l3.salto).toBeLessThan(0);
      expect(l3.alvo - l3.posicaoInicial).toBe(l3.salto);
    }
  });

  it("L4 remove quase todos os numerais e L5 varia tamanho e direção em 0–20", () => {
    for (let i = 0; i < 60; i += 1) {
      const l4 = construirReta20Spec(4, Math.random);
      const l5 = construirReta20Spec(5, Math.random);
      expect(l4.modo).toBe("localizar");
      expect(l4.inicio).toBe(0);
      expect(l4.fim).toBe(20);
      expect(l4.numeraisVisiveis).toEqual([0, 5, 10]);
      expect(l4.numeraisVisiveis).not.toContain(l4.alvo);
      expect(l5.modo).toBe("saltar");
      expect(l5.inicio).toBe(0);
      expect(l5.fim).toBe(20);
      expect(Math.abs(l5.salto)).toBeGreaterThanOrEqual(1);
      expect(l5.alvo - l5.posicaoInicial).toBe(l5.salto);
      expect(l5.alvo).toBeGreaterThanOrEqual(0);
      expect(l5.alvo).toBeLessThanOrEqual(20);
    }
  });

  it("specialized builder preserva tutorial, mastery e RT apenas como telemetria silenciosa", () => {
    const q1 = construirReta20Question(N1_12, 1);
    const q5 = construirReta20Question(N1_12, 5);
    expect(q1.kind).toBe("numberline-f19");
    expect(q1.tutorial?.length).toBeGreaterThan(0);
    expect(q1.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
    expect(q5.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
    expect(q5.rt_max_s).toBeGreaterThan(0);
    expect(q1.options).toBeUndefined();
  });

  it("resolve o snap antes do diagnóstico e preserva a dúvida a favor do motor", () => {
    const spec = construirReta20Spec(2, sorteio(0.4, 0));
    const largura = 420;
    const passo = largura / (spec.fim - spec.inicio);
    const centroAlvo = (spec.alvo - spec.inicio) * passo;

    const perto = resolverSolturaReta({ x: centroAlvo + passo * 0.2, left: 0, width: largura }, spec);
    expect(perto.escolhido).toBe(spec.alvo);
    expect(perto.manipulacao.distanciaDoAlvoCorreto).toBeLessThan(perto.manipulacao.raioDeSnap!);

    const fora = resolverSolturaReta({ x: -80, left: 0, width: largura }, spec);
    expect(fora.manipulacao.foraDeAlvoValido).toBe(true);
  });

  it("diagnostica direção, off-by-one, contagem de marcas e senso espacial pelas assinaturas observáveis", () => {
    // Origem no meio da reta: o destino espelhado realmente existe. Um teste
    // com partida no zero pediria uma posição negativa e não provaria a tag.
    const frente = construirReta20Spec(2, sorteio(0.4, 0.5));
    expect(frente.posicaoInicial - frente.salto).toBeGreaterThanOrEqual(frente.inicio);
    expect(diagnosticarReta20({
      escolhido: frente.posicaoInicial - frente.salto,
      posicaoInicial: frente.posicaoInicial,
      alvo: frente.alvo,
      salto: frente.salto,
      gesto: "toque",
      contouMarcaInicial: false,
    }, frente)).toBe(MisconceptionTag.INVERTE_DIRECAO);

    expect(diagnosticarReta20({
      escolhido: frente.alvo + 1,
      posicaoInicial: frente.posicaoInicial,
      alvo: frente.alvo,
      salto: frente.salto,
      gesto: "toque",
      contouMarcaInicial: false,
    }, frente)).toBe(MisconceptionTag.OFF_BY_ONE);

    expect(diagnosticarReta20({
      escolhido: frente.alvo - 1,
      posicaoInicial: frente.posicaoInicial,
      alvo: frente.alvo,
      salto: frente.salto,
      gesto: "toque",
      contouMarcaInicial: true,
    }, frente)).toBe(MisconceptionTag.CONTA_MARCAS);

    const parcial = construirReta20Spec(4, sorteio(0.7));
    const longe = parcial.alvo <= 10 ? parcial.alvo + 4 : parcial.alvo - 4;
    expect(diagnosticarReta20({
      escolhido: longe,
      posicaoInicial: parcial.posicaoInicial,
      alvo: parcial.alvo,
      salto: 0,
      gesto: "toque",
      contouMarcaInicial: false,
    }, parcial)).toBe(MisconceptionTag.SEM_SENSO_ESPACIAL);
  });
});