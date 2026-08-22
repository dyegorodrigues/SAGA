import { readFileSync } from "node:fs";
import { describe, expect, expectTypeOf, it } from "vitest";
import type { Question } from "../../types";
import type {
  ResolucaoDeclarativa,
  TutStep,
} from "../../contracts/pedagogySteps";
import type { TutStep as TutStepPublico } from "../../utils/tutorials";
import {
  estadoAntesDoPasso,
  misconceptionsSemCobertura,
  pontoDeEntradaDaResolucao,
  resolucaoTerminaNaResposta,
} from "./resolutionProcedure";

type VerticalFixtureMisconception =
  | "errou-unidades"
  | "ignora-reagrupamento"
  | "esquece-vai-um"
  | "troca-colunas";

interface VerticalFixtureShow {
  coluna: "unidades" | "dezenas";
  somaUnidades?: number;
  unidadeEscrita?: number;
  vaiUm?: 1;
  promocao?: { de: "unidades"; para: "dezenas"; quantidade: 1 };
  somaDezenas?: number;
  resultado?: number;
}

/**
 * Fixture EXIGENTE da R0-A. É só dado de teste: não importa nem reutiliza o
 * vertical de produção. A conta 27+15 força três passos, promoção de ordem e
 * dois pontos de entrada diagnósticos diferentes.
 */
const RESOLUCAO_27_MAIS_15: ResolucaoDeclarativa<
  VerticalFixtureShow,
  number,
  VerticalFixtureMisconception
> = {
  estadoInicial: { coluna: "unidades" },
  fallback: 0,
  passos: [
    {
      id: "somar-unidades",
      say: "Comece pelas unidades: sete mais cinco são doze.",
      show: { coluna: "unidades", somaUnidades: 12 },
      corrige: ["errou-unidades"],
      parcial: 12,
    },
    {
      id: "promover-dezena",
      say: "Doze unidades viram duas unidades e uma dezena que sobe.",
      show: {
        coluna: "unidades",
        somaUnidades: 12,
        unidadeEscrita: 2,
        vaiUm: 1,
        promocao: { de: "unidades", para: "dezenas", quantidade: 1 },
      },
      corrige: ["ignora-reagrupamento"],
      parcial: 2,
    },
    {
      id: "somar-dezenas-com-vai-um",
      say: "Agora duas dezenas mais uma dezena, mais a dezena que subiu: quatro dezenas. Resultado: quarenta e dois.",
      show: {
        coluna: "dezenas",
        unidadeEscrita: 2,
        vaiUm: 1,
        promocao: { de: "unidades", para: "dezenas", quantidade: 1 },
        somaDezenas: 4,
        resultado: 42,
      },
      corrige: ["esquece-vai-um"],
      parcial: 42,
    },
  ],
};

describe("R0-A — contrato de resolução declarativa", () => {
  it("consolida TutStep numa única definição pública, incluindo sync", () => {
    expectTypeOf<TutStepPublico>().toEqualTypeOf<TutStep>();
    expectTypeOf<NonNullable<Question["tutorial"]>[number]>().toEqualTypeOf<TutStep>();
    const passo: NonNullable<Question["tutorial"]>[number] = {
      say: "Mostre junto.",
      show: { destacar: true },
      sync: "junto",
    };
    expect(passo.sync).toBe("junto");
  });

  it("fixture 27+15 prova múltiplos passos e promoção de ordem sem código vertical de produção", () => {
    expect(RESOLUCAO_27_MAIS_15.passos).toHaveLength(3);
    expect(RESOLUCAO_27_MAIS_15.passos[1].show.promocao).toEqual({
      de: "unidades",
      para: "dezenas",
      quantidade: 1,
    });
    expect(RESOLUCAO_27_MAIS_15.passos[1].show.vaiUm).toBe(1);
  });

  it("entra pelo equívoco e instala diretamente o snapshot anterior", () => {
    const entradaReagrupamento = pontoDeEntradaDaResolucao(
      RESOLUCAO_27_MAIS_15,
      "ignora-reagrupamento",
    );
    expect(entradaReagrupamento).toBe(1);
    expect(estadoAntesDoPasso(RESOLUCAO_27_MAIS_15, entradaReagrupamento)).toBe(
      RESOLUCAO_27_MAIS_15.passos[0].show,
    );

    const entradaVaiUm = pontoDeEntradaDaResolucao(
      RESOLUCAO_27_MAIS_15,
      "esquece-vai-um",
    );
    expect(entradaVaiUm).toBe(2);
    const antesDoVaiUm = estadoAntesDoPasso(RESOLUCAO_27_MAIS_15, entradaVaiUm);
    expect(antesDoVaiUm.promocao?.quantidade).toBe(1);
    expect(antesDoVaiUm.vaiUm).toBe(1);
  });

  it("snapshot é idempotente: consultar novamente não reaplica nem muta passos anteriores", () => {
    const primeira = estadoAntesDoPasso(RESOLUCAO_27_MAIS_15, 2);
    const segunda = estadoAntesDoPasso(RESOLUCAO_27_MAIS_15, 2);
    expect(segunda).toBe(primeira);
    expect(RESOLUCAO_27_MAIS_15.passos[0].show).toEqual({ coluna: "unidades", somaUnidades: 12 });
  });

  it("misconception desconhecida usa somente o fallback explícito", () => {
    expect(pontoDeEntradaDaResolucao(RESOLUCAO_27_MAIS_15, "troca-colunas")).toBe(0);
  });

  it("gate acusa misconception gerável sem passo corretivo quando não existe fallback", () => {
    const semFallback = { ...RESOLUCAO_27_MAIS_15, fallback: undefined };
    expect(misconceptionsSemCobertura(semFallback, [
      "errou-unidades",
      "ignora-reagrupamento",
      "esquece-vai-um",
      "troca-colunas",
    ])).toEqual(["troca-colunas"]);
    expect(misconceptionsSemCobertura(RESOLUCAO_27_MAIS_15, ["troca-colunas"])).toEqual([]);
  });

  it("caminho declarado termina na resposta validável", () => {
    expect(resolucaoTerminaNaResposta(RESOLUCAO_27_MAIS_15, 42)).toBe(true);
    expect(resolucaoTerminaNaResposta(RESOLUCAO_27_MAIS_15, 41)).toBe(false);
  });

  it("procedimento e contrato permanecem puros, sem React ou DOM", () => {
    const procedure = readFileSync(new URL("./resolutionProcedure.ts", import.meta.url), "utf8");
    const contract = readFileSync(new URL("../../contracts/pedagogySteps.ts", import.meta.url), "utf8");
    for (const source of [procedure, contract]) {
      expect(source).not.toMatch(/from\s+["']react["']/);
      expect(source).not.toMatch(/\bwindow\b|\bdocument\b|\bHTMLElement\b/);
    }
  });
});
