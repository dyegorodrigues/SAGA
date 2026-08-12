import { describe, expect, it } from "vitest";
import { Evidencia } from "../../../constants/evidencias";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { GM_05 } from "./GM.05";
import {
  construirReguaQuestion,
  construirReguaSpec,
} from "../../procedimentos/reguaContract";
import {
  diagnosticarRegua,
  evidenciasDaRegua,
  resolverSolturaRegua,
} from "../../procedimentos/reguaProcedure";

function sorteio(...valores: number[]) {
  let i = 0;
  return () => valores[Math.min(i++, valores.length - 1)] ?? 0;
}

describe("GM.05 / F61 — medir com régua", () => {
  it("preserva o DAG vigente e a progressão autoral L1-L5", () => {
    expect(GM_05.prereqs).toEqual(["GM.12", "N2.02"]);
    expect(GM_05.niveis?.[1]?.micro).toBe("medida_informal");
    expect(GM_05.niveis?.[2]?.micro).toBe("ler_regua_alinhada");
    expect(GM_05.niveis?.[3]?.micro).toBe("alinhar_zero");
    expect(GM_05.niveis?.[4]?.micro).toBe("medir_comparar");
    expect(GM_05.niveis?.[5]?.micro).toBe("estimar_conferir");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      expect(GM_05.niveis?.[nivel]?.primitiva).toBe("regua");
    }
    expect(GM_05.niveis?.[5]?.rt_alvo).toBeGreaterThan(0);
  });

  it("materializa os cinco degraus sem misturar medida informal com a leitura da régua", () => {
    const l1 = construirReguaSpec(1, sorteio(0.3));
    const l2 = construirReguaSpec(2, sorteio(0.4));
    const l3 = construirReguaSpec(3, sorteio(0.5, 0.7));
    const l4 = construirReguaSpec(4, sorteio(0.2, 0.8));
    const l5 = construirReguaSpec(5, sorteio(0.6));

    expect(l1.modo).toBe("informal");
    expect(l1.unidade).toBe("bolas");
    expect(l2.modo).toBe("ler");
    expect(l2.unidade).toBe("cm");
    expect(l2.reguaAlinhada).toBe(true);
    expect(l3.modo).toBe("alinhar");
    expect(l3.reguaAlinhada).toBe(false);
    expect(Math.abs(l3.offsetInicialCm)).toBeGreaterThanOrEqual(1);
    expect(l4.modo).toBe("comparar");
    expect(l4.itens).toHaveLength(2);
    expect(l4.itens[0].comprimentoCm).not.toBe(l4.itens[1].comprimentoCm);
    expect(l4.itens[0].id.replace(/-a$/, "")).not.toBe(l4.itens[1].id.replace(/-b$/, ""));
    expect(l5.modo).toBe("estimar");
    expect(l5.estimativas?.length).toBeGreaterThanOrEqual(3);
  });

  it("F61 usa apenas centímetros inteiros; 0,5 não entra na progressão", () => {
    for (let nivel = 2; nivel <= 5; nivel += 1) {
      for (let i = 0; i < 100; i += 1) {
        const spec = construirReguaSpec(nivel, () => (i % 97) / 97);
        if (nivel === 4) {
          // L4 não pede um número: mede dois comprimentos inteiros e responde
          // qual objeto é maior. Portanto `valorCerto` é intencionalmente vazio.
          expect(spec.valorCerto).toBeUndefined();
          expect(spec.itens).toHaveLength(2);
          expect(spec.itens.every(item => Number.isInteger(item.comprimentoCm))).toBe(true);
          expect(spec.itemCerto).toBeTruthy();
        } else {
          expect(Number.isInteger(spec.valorCerto)).toBe(true);
        }
        expect(spec.alternativas.every(Number.isInteger)).toBe(true);
        expect((spec.estimativas ?? []).every(Number.isInteger)).toBe(true);
        expect(spec.offsetInicialCm).toBe(Math.round(spec.offsetInicialCm));
      }
    }
  });

  it("não usa objetos de proporção rígida que virem caricatura ao alongar", () => {
    const proibidos = ["carrinho", "borracha"];
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let i = 0; i < 100; i += 1) {
        const spec = construirReguaSpec(nivel, () => (i % 99) / 99);
        for (const objeto of spec.itens) {
          const tipo = objeto.id.replace(/-(?:a|b)$/, "");
          expect(proibidos).not.toContain(tipo);
        }
      }
    }
  });

  it("não repete o mesmo tipo de objeto no L4 mesmo com sorteio determinístico idêntico", () => {
    const l4 = construirReguaSpec(4, () => 0.5);
    const tipos = l4.itens.map(item => item.id.replace(/-(?:a|b)$/, ""));
    expect(new Set(tipos).size).toBe(2);
  });

  it("specialized builder mantém a resposta dentro do palco e domínio/evidência da ficha", () => {
    const q1 = construirReguaQuestion(GM_05, 1);
    const q3 = construirReguaQuestion(GM_05, 3);
    const q5 = construirReguaQuestion(GM_05, 5);

    expect(q1.kind).toBe("regua-f61");
    expect(q1.options).toBeUndefined();
    expect(q1.tutorial?.length).toBeGreaterThan(0);
    expect(q3.exigeEvidencia).toBe(Evidencia.ALINHOU_ZERO);
    expect(q3.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
    expect(q5.rt_max_s).toBeGreaterThan(0);
  });

  it("resolve alinhamento físico antes do diagnóstico e dá a dúvida ao filtro motor", () => {
    const spec = construirReguaSpec(3, sorteio(0.5, 0.7));
    const unitPx = 24;
    const objectLeft = 120;

    const pertoDoZero = resolverSolturaRegua({
      rulerLeft: objectLeft + unitPx * 0.2,
      objectLeft,
      unitPx,
      duracaoMs: 550,
    }, spec);
    expect(pertoDoZero.marcaAlinhada).toBe(0);
    expect(pertoDoZero.alinhado).toBe(true);
    expect(diagnosticarRegua(pertoDoZero, spec)).toBeUndefined();

    const noUm = resolverSolturaRegua({
      rulerLeft: objectLeft - unitPx,
      objectLeft,
      unitPx,
      duracaoMs: 650,
    }, spec);
    expect(noUm.marcaAlinhada).toBe(1);
    expect(diagnosticarRegua(noUm, spec)).toBe(MisconceptionTag.COMECA_NO_UM);
  });

  it("não transforma escorregão de dedo em misconception, mas preserva escolha conceitual precisa", () => {
    const spec = construirReguaSpec(3, sorteio(0.5, 0.7));
    const slip = resolverSolturaRegua({
      rulerLeft: 128,
      objectLeft: 120,
      unitPx: 24,
      duracaoMs: 550,
    }, spec);
    expect(slip.manipulacao?.distanciaDoAlvoCorreto).toBeLessThan((slip.manipulacao?.raioDeSnap ?? 0) * 1.5);
    expect(diagnosticarRegua(slip, spec)).toBeUndefined();

    expect(diagnosticarRegua({
      ...slip,
      alinhado: true,
      marcaAlinhada: 0,
      unidadeEscolhida: "m",
      unidadeCerta: "cm",
      manipulacao: undefined,
    }, spec)).toBe(MisconceptionTag.CONFUNDE_UNIDADE);
  });

  it("emite evidência de alinhamento somente quando a criança realmente alinha o zero", () => {
    const spec = construirReguaSpec(3, sorteio(0.5, 0.7));
    expect(evidenciasDaRegua({
      alinhado: true,
      marcaAlinhada: 0,
      alinhouManualmente: true,
      unidadeEscolhida: "cm",
      unidadeCerta: "cm",
    }, spec)).toContain(Evidencia.ALINHOU_ZERO);

    expect(evidenciasDaRegua({
      alinhado: true,
      marcaAlinhada: 0,
      alinhouManualmente: false,
      unidadeEscolhida: "cm",
      unidadeCerta: "cm",
    }, spec)).not.toContain(Evidencia.ALINHOU_ZERO);
  });
});