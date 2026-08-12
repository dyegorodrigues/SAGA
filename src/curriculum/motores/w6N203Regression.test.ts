import { afterEach, describe, expect, it } from "vitest";
import {
  COMPOSER_CANARIES,
  enableComposerCanary,
  rollbackComposerCanary,
} from "./composerCanary";
import { getTrackById } from "./curriculum";

/**
 * W6 — N2.03 / F29, regression-first.
 *
 * A regressão que motivou a onda é observável no runtime: a ficha normativa
 * exige quantidade → comparação → símbolo com Grupo nos níveis concretos, mas
 * N2.03 ainda é servido pelo legado numérico. Este teste não cria uma porta de
 * teste paralela: ele liga temporariamente o MESMO canário de produção e exige
 * que a implementação registrada entregue o contrato autoral especializado.
 *
 * O default continua deliberadamente INATIVO até a cadeia W6 ficar verde.
 */
const CANARIOS_ORIGINAIS = [...COMPOSER_CANARIES];

function questao(level: number) {
  return getTrackById("N2.03")!.gen(level);
}

function representacoes(level: number): string[] {
  const q = questao(level);
  const spec = q.uiProps as { lados?: Array<{ tipo?: string }> } | undefined;
  return (spec?.lados ?? []).map(lado => String(lado.tipo));
}

describe("W6 N2.03 — comparação simbólica F29", () => {
  afterEach(() => {
    COMPOSER_CANARIES.clear();
    for (const id of CANARIOS_ORIGINAIS) COMPOSER_CANARIES.add(id);
  });

  it("antes da promoção continua servido pelo legado", () => {
    rollbackComposerCanary("N2.03");
    expect(getTrackById("N2.03")?.generatorSource).toBe("legacy");
  });

  it("pode ser ligado pela porta de canário e usa kind especializado local", () => {
    expect(() => enableComposerCanary("N2.03")).not.toThrow();
    expect(getTrackById("N2.03")?.generatorSource).toBe("composer");
    expect(questao(1).kind).toBe("comparacao-simbolica");
  });

  it("cumpre a escada F29: grupo×grupo → grupo×numeral → numerais → expressões", () => {
    enableComposerCanary("N2.03");

    expect(representacoes(1)).toEqual(["grupo", "grupo"]);

    const l2 = representacoes(2);
    expect(l2.filter(tipo => tipo === "grupo")).toHaveLength(1);
    expect(l2.filter(tipo => tipo === "numeral")).toHaveLength(1);

    for (let i = 0; i < 40; i += 1) {
      const q3 = questao(3);
      const s3 = q3.uiProps as { lados: Array<{ tipo: string; valor: number }> };
      expect(s3.lados.every(l => l.tipo === "numeral")).toBe(true);
      expect(s3.lados.every(l => l.valor >= 0 && l.valor <= 20)).toBe(true);

      const q4 = questao(4);
      const s4 = q4.uiProps as { lados: Array<{ tipo: string; valor: number }> };
      expect(s4.lados.every(l => l.tipo === "numeral")).toBe(true);
      expect(s4.lados.every(l => l.valor >= 0 && l.valor <= 100)).toBe(true);

      expect(representacoes(5)).toEqual(["expressao", "expressao"]);
    }
  });

  it("oferece exatamente >, < e =, com inversão e não-comparação como distratores reais", () => {
    enableComposerCanary("N2.03");

    let viuInversao = false;
    let viuNaoCompara = false;
    let viuIgualdadeReal = false;

    for (let i = 0; i < 120; i += 1) {
      const q = questao((i % 5) + 1);
      expect(q.options?.map(o => o.value).sort()).toEqual(["<", "=", ">"].sort());
      expect(q.options?.filter(o => o.value === q.answer)).toHaveLength(1);
      if (q.answer === "=") viuIgualdadeReal = true;
      if (q.options?.some(o => o.value !== q.answer && o.misconception === "inverte-simbolo")) {
        viuInversao = true;
      }
      if (q.options?.some(o => o.value !== q.answer && o.misconception === "nao-compara-simbolo")) {
        viuNaoCompara = true;
      }
    }

    expect(viuInversao).toBe(true);
    expect(viuNaoCompara).toBe(true);
    expect(viuIgualdadeReal).toBe(true);
  });

  it("só aceita domínio autoral quando já houve acerto simbólico no L3+", () => {
    enableComposerCanary("N2.03");
    expect(questao(1).exigeEvidencia).toBeUndefined();
    expect(questao(2).exigeEvidencia).toBeUndefined();
    expect(questao(3).exigeEvidencia).toBe("comparacao-simbolica-sem-objetos");
    expect(questao(4).exigeEvidencia).toBe("comparacao-simbolica-sem-objetos");
    expect(questao(5).exigeEvidencia).toBe("comparacao-simbolica-sem-objetos");
  });

  it("mantém o relógio silencioso fora do critério de resposta", () => {
    enableComposerCanary("N2.03");
    for (let level = 1; level <= 5; level += 1) {
      const q = questao(level);
      expect(typeof q.evaluate).toBe("function");
      expect(q.evaluate?.(q.answer)).toBe(true);
      if (level === 5) expect(q.rt_max_s).toBeGreaterThan(0);
    }
  });
});
