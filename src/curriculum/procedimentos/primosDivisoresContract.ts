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

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const escolher = <T,>(itens: readonly T[]): T => itens[Math.floor(Math.random() * itens.length)];
const PRIMOS_F70 = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43] as const;
const divisoresProprios = (n: number) => {
  const saida: number[] = [];
  for (let d = 2; d < n; d += 1) if (n % d === 0) saida.push(d);
  return saida;
};
const primo = (n: number) => { if (n < 2) return false; for (let d = 2; d * d <= n; d += 1) if (n % d === 0) return false; return true; };

/**
 * CLASS-003 — o número do nível é sorteado, a escada não.
 *
 * Era um caso por nível: base 6, total 18, o par 4/12, o primo 13 e o crivo com
 * bases 2 e 3. A criança riscava o MESMO quadro seis vezes.
 *
 * As bases de L1 e L3 são compostas de propósito: o distrator
 * `INVERTE_DIVISOR_MULTIPLO` precisa de um divisor próprio para existir, e
 * número primo não tem nenhum.
 */
export function construirPrimosDivisoresF70Spec(level: number): PrimosDivisoresF70Spec {
  const nivel = clamp(level);
  const base0 = { ficha: "F70" as const, nivel, primitivas: ["ArrayGrid", "Quadrado100"] as ["ArrayGrid", "Quadrado100"] };

  if (nivel === 1) {
    const base = escolher([4, 6, 8, 9, 12] as const);
    const destacados = [base, base * 2, base * 3];
    const resposta = base * 4;
    const divisorProprio = escolher(divisoresProprios(base));
    return {
      ...base0,
      modo: "multiplos-quadro",
      total: base,
      base,
      divisorInicial: 2,
      divisoresTeste: [],
      quadroDestacados: destacados,
      crivoBases: [],
      resposta,
      opcoes: [
        option(resposta, String(resposta)),
        option(divisorProprio, `${divisorProprio} — porque cabe em ${base}`, PrimosDivisoresMisconception.INVERTE_DIVISOR_MULTIPLO),
        option(resposta - 1, String(resposta - 1)),
        option(resposta + 1, String(resposta + 1)),
      ],
    };
  }

  if (nivel === 2) {
    const total = escolher([12, 15, 18, 20, 24, 28, 30, 36] as const);
    const divisores = divisoresProprios(total);
    const resposta = escolher(divisores);
    const naoDivisores: number[] = [];
    for (let d = 2; naoDivisores.length < 2 && d < total; d += 1) if (total % d !== 0 && d !== resposta) naoDivisores.push(d);
    return {
      ...base0,
      modo: "divisores-retangulo",
      total,
      divisorInicial: naoDivisores[0],
      divisoresTeste: [...new Set([resposta, ...naoDivisores])].sort((a, b) => a - b),
      quadroDestacados: [],
      crivoBases: [],
      resposta,
      opcoes: [
        option(resposta, `${resposta} — fecha um retângulo sem sobra`),
        option(naoDivisores[0], String(naoDivisores[0])),
        option(naoDivisores[1], String(naoDivisores[1])),
        option(total * 2, `${total * 2} — é múltiplo de ${total}`, PrimosDivisoresMisconception.INVERTE_DIVISOR_MULTIPLO),
      ],
    };
  }

  if (nivel === 3) {
    const base = escolher([3, 4, 5, 6, 8] as const);
    const total = base * ri(2, 5);
    return {
      ...base0,
      modo: "distinguir",
      total,
      base,
      divisorInicial: base,
      divisoresTeste: [base - 1, base, base + 1],
      quadroDestacados: Array.from({ length: 6 }, (_, i) => base * (i + 1)),
      crivoBases: [],
      resposta: 1,
      opcoes: [
        option(1, `${base} é divisor de ${total}; ${total} é múltiplo de ${base}`),
        option(2, `${total} é divisor de ${base}; ${base} é múltiplo de ${total}`, PrimosDivisoresMisconception.INVERTE_DIVISOR_MULTIPLO),
        option(3, `${base} e ${total} são só múltiplos um do outro`),
        option(4, `${base} e ${total} são só divisores um do outro`),
      ],
    };
  }

  if (nivel === 4) {
    const total = escolher(PRIMOS_F70);
    return {
      ...base0,
      modo: "identificar-primos",
      total,
      divisorInicial: 2,
      divisoresTeste: [2, 3, 4],
      quadroDestacados: [],
      crivoBases: [],
      resposta: 1,
      opcoes: [
        option(1, `${total} é primo: seus divisores positivos são 1 e ${total}`),
        option(0, `${total} não é primo porque é ímpar`, PrimosDivisoresMisconception.PRIMO_ERRADO),
        option(2, `${total} é primo porque 1 também é primo`, PrimosDivisoresMisconception.ESQUECE_UM),
      ],
    };
  }

  // L5: riscar as bases e apontar o primeiro primo que sobrou.
    // Sempre duas bases ou mais: o crivo é sequencial, e uma base só apagaria a
  // ordem que o nível ensina — riscar o 3 depois de ter riscado o 2.
  const crivoBases = escolher([[2, 3], [2, 3, 5], [2, 3, 5, 7]] as const);
  let resposta = Math.max(...crivoBases) + 1;
  while (!primo(resposta)) resposta += 1;
  const composto = resposta * resposta;
  return {
    ...base0,
    modo: "crivo-eratostenes",
    total: 100,
    divisorInicial: 2,
    divisoresTeste: [],
    quadroDestacados: [],
    crivoBases: [...crivoBases],
    resposta,
    opcoes: [
      option(resposta, String(resposta)),
      option(1, "1", PrimosDivisoresMisconception.ESQUECE_UM),
      option(composto, String(composto), PrimosDivisoresMisconception.PRIMO_ERRADO),
      option(resposta + 1, String(resposta + 1)),
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
