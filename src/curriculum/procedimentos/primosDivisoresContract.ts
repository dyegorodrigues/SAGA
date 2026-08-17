import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import { PrimosDivisoresMisconception, type PrimosDivisoresMisconceptionTag } from "../../constants/primosDivisoresMisconceptions";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";
import { fatoresDe, tentativaRetangulo } from "./fatoresRetangulosProcedure";

export { PrimosDivisoresMisconception };
export type { PrimosDivisoresMisconceptionTag };

export type PrimosDivisoresF70Modo =
  | "multiplos-quadro"
  | "divisores-retangulo"
  | "distinguir"
  | "identificar-primos"
  | "crivo-eratostenes";

export interface PrimosDivisoresF70Option {
  value: number;
  label: string;
  misconception?: PrimosDivisoresMisconceptionTag;
}

export interface PrimosDivisoresF70Spec {
  ficha: "F70";
  nivel: number;
  modo: PrimosDivisoresF70Modo;
  primitivas: ["ArrayGrid", "Quadrado100"];
  total: number;
  base?: number;
  divisorInicial: number;
  divisoresTeste: number[];
  quadroDestacados: number[];
  crivoBases: number[];
  resposta: number;
  opcoes: PrimosDivisoresF70Option[];
}

interface PrimosDivisoresF70Show {
  total?: number;
  base?: number;
  divisor?: number;
  sobra?: number;
  destacados?: number[];
  riscarMultiplosDe?: number[];
  preservar?: number[];
  fatores?: number[];
  relacao?: string;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const option = (value: number, label: string, misconception?: PrimosDivisoresMisconceptionTag): PrimosDivisoresF70Option => ({
  value,
  label,
  ...(misconception ? { misconception } : {}),
});

export function riscadosDoCrivo(bases: number[]): number[] {
  const riscados = new Set<number>();
  for (const base of bases) {
    for (let n = base * 2; n <= 100; n += base) riscados.add(n);
  }
  return [...riscados].sort((a, b) => a - b);
}

export function construirPrimosDivisoresF70Spec(level: number): PrimosDivisoresF70Spec {
  const nivel = clamp(level);

  if (nivel === 1) {
    return {
      ficha: "F70",
      nivel,
      modo: "multiplos-quadro",
      primitivas: ["ArrayGrid", "Quadrado100"],
      total: 6,
      base: 6,
      divisorInicial: 2,
      divisoresTeste: [],
      quadroDestacados: [6, 12, 18],
      crivoBases: [],
      resposta: 24,
      opcoes: [
        option(24, "24"),
        option(3, "3 — porque cabe em 6", PrimosDivisoresMisconception.INVERTE_DIVISOR_MULTIPLO),
        option(20, "20"),
        option(25, "25"),
      ],
    };
  }

  if (nivel === 2) {
    return {
      ficha: "F70",
      nivel,
      modo: "divisores-retangulo",
      primitivas: ["ArrayGrid", "Quadrado100"],
      total: 18,
      divisorInicial: 4,
      divisoresTeste: [2, 3, 4, 5],
      quadroDestacados: [],
      crivoBases: [],
      resposta: 3,
      opcoes: [
        option(3, "3 — fecha um retângulo sem sobra"),
        option(4, "4"),
        option(5, "5"),
        option(36, "36 — é múltiplo de 18", PrimosDivisoresMisconception.INVERTE_DIVISOR_MULTIPLO),
      ],
    };
  }

  if (nivel === 3) {
    return {
      ficha: "F70",
      nivel,
      modo: "distinguir",
      primitivas: ["ArrayGrid", "Quadrado100"],
      total: 12,
      base: 4,
      divisorInicial: 4,
      divisoresTeste: [3, 4, 5],
      quadroDestacados: [4, 8, 12, 16, 20, 24],
      crivoBases: [],
      resposta: 1,
      opcoes: [
        option(1, "4 é divisor de 12; 12 é múltiplo de 4"),
        option(2, "12 é divisor de 4; 4 é múltiplo de 12", PrimosDivisoresMisconception.INVERTE_DIVISOR_MULTIPLO),
        option(3, "4 e 12 são só múltiplos um do outro"),
        option(4, "4 e 12 são só divisores um do outro"),
      ],
    };
  }

  if (nivel === 4) {
    return {
      ficha: "F70",
      nivel,
      modo: "identificar-primos",
      primitivas: ["ArrayGrid", "Quadrado100"],
      total: 13,
      divisorInicial: 2,
      divisoresTeste: [2, 3, 4],
      quadroDestacados: [],
      crivoBases: [],
      resposta: 1,
      opcoes: [
        option(1, "13 é primo: seus divisores positivos são 1 e 13"),
        option(0, "13 não é primo porque é ímpar", PrimosDivisoresMisconception.PRIMO_ERRADO),
        option(2, "13 é primo porque 1 também é primo", PrimosDivisoresMisconception.ESQUECE_UM),
      ],
    };
  }

  return {
    ficha: "F70",
    nivel,
    modo: "crivo-eratostenes",
    primitivas: ["ArrayGrid", "Quadrado100"],
    total: 100,
    divisorInicial: 2,
    divisoresTeste: [],
    quadroDestacados: [],
    crivoBases: [2, 3],
    resposta: 5,
    opcoes: [
      option(5, "5"),
      option(1, "1", PrimosDivisoresMisconception.ESQUECE_UM),
      option(9, "9", PrimosDivisoresMisconception.PRIMO_ERRADO),
      option(6, "6"),
    ],
  };
}

export function construirPrimosDivisoresF70Resolucao(
  spec: PrimosDivisoresF70Spec,
): ResolucaoDeclarativa<PrimosDivisoresF70Show, number, PrimosDivisoresMisconceptionTag> {
  if (spec.modo === "multiplos-quadro") {
    return {
      estadoInicial: { base: spec.base, destacados: spec.quadroDestacados },
      passos: [
        {
          id: "saltos-no-quadro",
          say: "No Quadrado100, múltiplos são as casas onde chegamos repetindo o mesmo salto: de 6 em 6 vemos 6, 12, 18 e continuamos o padrão.",
          show: { base: spec.base, destacados: spec.quadroDestacados },
          corrige: [PrimosDivisoresMisconception.INVERTE_DIVISOR_MULTIPLO],
          parcial: spec.resposta,
        },
      ],
      fallback: 0,
    };
  }

  if (spec.modo === "divisores-retangulo") {
    const tentativa = tentativaRetangulo(spec.total, 4);
    return {
      estadoInicial: { total: spec.total, divisor: tentativa.divisor, sobra: tentativa.sobra },
      passos: [
        {
          id: "divisor-cabe",
          say: "Divisor é uma medida que cabe no total sem sobra. No ArrayGrid, teste a largura: quando o retângulo fecha exatamente, essa largura divide o número.",
          show: { total: spec.total, divisor: tentativa.divisor, sobra: tentativa.sobra },
          corrige: [PrimosDivisoresMisconception.INVERTE_DIVISOR_MULTIPLO],
          parcial: spec.resposta,
        },
        {
          id: "um-tambem-divide",
          say: "Não esqueça o 1: o retângulo 1 × n sempre fecha, então 1 é divisor de todo número positivo.",
          show: { total: spec.total, divisor: 1, sobra: 0 },
          corrige: [PrimosDivisoresMisconception.ESQUECE_UM],
          parcial: spec.resposta,
        },
      ],
      fallback: 0,
    };
  }

  if (spec.modo === "distinguir") {
    return {
      estadoInicial: { total: spec.total, base: spec.base, relacao: "divisor versus múltiplo" },
      passos: [
        {
          id: "duas-direcoes",
          say: "Divisor cabe dentro sem sobra; múltiplo é onde chegamos repetindo o número. Por isso 4 é divisor de 12, enquanto 12 é múltiplo de 4.",
          show: { total: 12, divisor: 4, sobra: 0, base: 4, destacados: [4, 8, 12] },
          corrige: [PrimosDivisoresMisconception.INVERTE_DIVISOR_MULTIPLO],
          parcial: spec.resposta,
        },
      ],
      fallback: 0,
    };
  }

  if (spec.modo === "identificar-primos") {
    return {
      estadoInicial: { total: spec.total, fatores: fatoresDe(spec.total) },
      passos: [
        {
          id: "retangulos-do-primo",
          say: "Um número primo tem exatamente dois divisores positivos: 1 e ele mesmo. Para 13, o único retângulo sem repetir rotação é 1 × 13.",
          show: { total: spec.total, divisor: 1, sobra: 0, fatores: fatoresDe(spec.total) },
          corrige: [PrimosDivisoresMisconception.PRIMO_ERRADO],
          parcial: spec.resposta,
        },
        {
          id: "um-nao-e-primo",
          say: "O 1 divide todos os números, mas não é primo: ele tem apenas um divisor positivo, o próprio 1. E ser ímpar sozinho não basta para ser primo.",
          show: { total: 1, fatores: [1] },
          corrige: [PrimosDivisoresMisconception.ESQUECE_UM, PrimosDivisoresMisconception.PRIMO_ERRADO],
          parcial: spec.resposta,
        },
      ],
      fallback: 0,
    };
  }

  return {
    estadoInicial: { riscarMultiplosDe: [], preservar: [2, 3, 5, 7] },
    passos: [
      {
        id: "crivo-2",
        say: "No Crivo de Eratóstenes, preserve 2 e risque os múltiplos maiores de 2 no Quadrado100.",
        show: { riscarMultiplosDe: [2], preservar: [2] },
        parcial: spec.resposta,
      },
      {
        id: "crivo-3",
        say: "Depois preserve 3 e risque os múltiplos maiores de 3 que ainda restam. O processo continua sempre pelo próximo número não riscado.",
        show: { riscarMultiplosDe: [2, 3], preservar: [2, 3] },
        corrige: [PrimosDivisoresMisconception.PRIMO_ERRADO],
        parcial: spec.resposta,
      },
      {
        id: "crivo-continua",
        say: "O crivo continua com 5 e 7: cada primo fica, e seus múltiplos compostos são eliminados. Assim o quadro mostra os primos pelo processo, não por decoração.",
        show: { riscarMultiplosDe: [2, 3, 5, 7], preservar: [2, 3, 5, 7] },
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === id);
  if (!micro) throw new Error(`N4.11 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirPrimosDivisoresQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N4.11") throw new Error(`primosDivisoresContract recebeu ${ficha.id}.`);
  const spec = construirPrimosDivisoresF70Spec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === id);
  if (!micro) throw new Error(`N4.11 sem micro L${spec.nivel}.`);

  const prompt = spec.modo === "multiplos-quadro"
    ? "No quadro, 6, 12 e 18 seguem saltos iguais de 6. Qual é o próximo múltiplo?"
    : spec.modo === "divisores-retangulo"
      ? "Qual medida fecha um retângulo de 18 quadradinhos sem sobra?"
      : spec.modo === "distinguir"
        ? "Qual frase distingue corretamente divisor de múltiplo?"
        : spec.modo === "identificar-primos"
          ? "13 é primo? Use os retângulos possíveis para justificar."
          : "Depois de aplicar o crivo aos múltiplos de 2 e 3, qual é o próximo primo a preservar?";

  const options: Option[] = spec.opcoes;
  return {
    kind: "primos-divisores-f70",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirPrimosDivisoresF70Resolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => Number(answer) === spec.resposta,
  };
}
