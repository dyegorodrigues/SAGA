import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";
import {
  ehPrimo,
  fatoresDe,
  FatoresRetangulosMisconception,
  type FatoresRetangulosMisconceptionTag,
  maiorFatorComum,
  paresDeFatores,
  tentativaRetangulo,
} from "./fatoresRetangulosProcedure";

export type FatoresRetangulosF66Modo =
  | "pares-com-dica"
  | "todos-pares"
  | "listar-fatores"
  | "identificar-primo"
  | "maior-fator-comum";

export interface FatoresRetangulosF66Option {
  value: number;
  label: string;
  misconception?: FatoresRetangulosMisconceptionTag;
}

export interface FatoresRetangulosF66Spec {
  ficha: "F66";
  nivel: number;
  modo: FatoresRetangulosF66Modo;
  primitivas: ["ArrayGrid"];
  total: number;
  segundoTotal?: number;
  fatores: number[];
  pares: Array<{ linhas: number; colunas: number }>;
  dicaQuantidadePares?: number;
  primo?: boolean;
  maiorFatorComum?: number;
  divisorInicial: number;
  previewDivisorByValue: Record<string, number>;
  resposta: number;
  opcoes: FatoresRetangulosF66Option[];
}

interface FatoresRetangulosF66Show {
  total: number;
  segundoTotal?: number;
  divisor?: number;
  linhasCompletas?: number;
  sobra?: number;
  pares?: Array<{ linhas: number; colunas: number }>;
  fatores?: number[];
  destacarTriviais?: boolean;
  destacarPrimo?: boolean;
  destacarComuns?: number[];
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const option = (value: number, label: string, misconception?: FatoresRetangulosMisconceptionTag): FatoresRetangulosF66Option => ({
  value,
  label,
  ...(misconception ? { misconception } : {}),
});

export function construirFatoresRetangulosF66Spec(level: number): FatoresRetangulosF66Spec {
  const nivel = clamp(level);

  if (nivel === 1) {
    const total = 12;
    return {
      ficha: "F66",
      nivel,
      modo: "pares-com-dica",
      primitivas: ["ArrayGrid"],
      total,
      fatores: fatoresDe(total),
      pares: paresDeFatores(total),
      dicaQuantidadePares: 3,
      divisorInicial: 2,
      previewDivisorByValue: { "3": 3, "5": 5, "2": 2, "12": 2 },
      resposta: 3,
      opcoes: [
        option(3, "3 × 4"),
        option(5, "5 × 2 e sobram 2", FatoresRetangulosMisconception.CONFUNDE_FATOR_MULTIPLO),
        option(2, "Parar em 2 × 6", FatoresRetangulosMisconception.PARA_CEDO),
        option(12, "Esquecer 1 × 12", FatoresRetangulosMisconception.ESQUECE_TRIVIAIS),
      ],
    };
  }

  if (nivel === 2) {
    const total = 24;
    return {
      ficha: "F66",
      nivel,
      modo: "todos-pares",
      primitivas: ["ArrayGrid"],
      total,
      fatores: fatoresDe(total),
      pares: paresDeFatores(total),
      divisorInicial: 4,
      previewDivisorByValue: { "4": 4, "3": 3, "1": 4, "5": 5 },
      resposta: 4,
      opcoes: [
        option(4, "1×24, 2×12, 3×8 e 4×6"),
        option(3, "2×12, 3×8 e 4×6", FatoresRetangulosMisconception.ESQUECE_TRIVIAIS),
        option(1, "Só 4×6", FatoresRetangulosMisconception.PARA_CEDO),
        option(5, "5×4 e tratar a sobra como fator", FatoresRetangulosMisconception.CONFUNDE_FATOR_MULTIPLO),
      ],
    };
  }

  if (nivel === 3) {
    const total = 18;
    return {
      ficha: "F66",
      nivel,
      modo: "listar-fatores",
      primitivas: ["ArrayGrid"],
      total,
      fatores: fatoresDe(total),
      pares: paresDeFatores(total),
      divisorInicial: 3,
      previewDivisorByValue: { "6": 6, "4": 3, "2": 3, "5": 5 },
      resposta: 6,
      opcoes: [
        option(6, "1, 2, 3, 6, 9, 18"),
        option(4, "2, 3, 6, 9", FatoresRetangulosMisconception.ESQUECE_TRIVIAIS),
        option(2, "1, 2 e parar", FatoresRetangulosMisconception.PARA_CEDO),
        option(5, "1, 2, 3, 5, 6, 9, 18", FatoresRetangulosMisconception.CONFUNDE_FATOR_MULTIPLO),
      ],
    };
  }

  if (nivel === 4) {
    const total = 13;
    return {
      ficha: "F66",
      nivel,
      modo: "identificar-primo",
      primitivas: ["ArrayGrid"],
      total,
      fatores: fatoresDe(total),
      pares: paresDeFatores(total),
      primo: ehPrimo(total),
      divisorInicial: 1,
      previewDivisorByValue: { "1": 1, "0": 2 },
      resposta: 1,
      opcoes: [
        option(1, "Sim — só existe 1 × 13"),
        option(0, "Não — deve existir outro retângulo", FatoresRetangulosMisconception.CONFUNDE_FATOR_MULTIPLO),
      ],
    };
  }

  const total = 18;
  const segundoTotal = 24;
  const mdc = maiorFatorComum(total, segundoTotal);
  return {
    ficha: "F66",
    nivel,
    modo: "maior-fator-comum",
    primitivas: ["ArrayGrid"],
    total,
    segundoTotal,
    fatores: fatoresDe(total),
    pares: paresDeFatores(total),
    maiorFatorComum: mdc,
    divisorInicial: mdc,
    previewDivisorByValue: { "6": 6, "3": 3, "12": 12, "2": 2 },
    resposta: mdc,
    opcoes: [
      option(6, "6"),
      option(3, "3", FatoresRetangulosMisconception.PARA_CEDO),
      option(12, "12", FatoresRetangulosMisconception.CONFUNDE_FATOR_MULTIPLO),
      option(2, "2", FatoresRetangulosMisconception.ESQUECE_TRIVIAIS),
    ],
  };
}

export function construirFatoresRetangulosF66Resolucao(
  spec: FatoresRetangulosF66Spec,
): ResolucaoDeclarativa<FatoresRetangulosF66Show, number, FatoresRetangulosMisconceptionTag> {
  const tentativaInvalida = tentativaRetangulo(spec.total, spec.modo === "identificar-primo" ? 2 : 5);
  const comuns = spec.segundoTotal ? spec.fatores.filter(fator => spec.segundoTotal! % fator === 0) : undefined;
  return {
    estadoInicial: { total: spec.total, segundoTotal: spec.segundoTotal, pares: spec.pares },
    passos: [
      {
        id: "fechar-retangulos",
        say: "Um fator fecha um retângulo completo: se sobrar quadradinho, essa medida não é fator.",
        show: { total: spec.total, divisor: tentativaInvalida.divisor, linhasCompletas: tentativaInvalida.linhasCompletas, sobra: tentativaInvalida.sobra },
        corrige: [FatoresRetangulosMisconception.CONFUNDE_FATOR_MULTIPLO],
        parcial: spec.resposta,
      },
      {
        id: "varrer-formacoes",
        say: "Continue procurando até esgotar as formações e não esqueça os retângulos triviais 1 × n.",
        show: { total: spec.total, pares: spec.pares, fatores: spec.fatores, destacarTriviais: true },
        corrige: [FatoresRetangulosMisconception.PARA_CEDO, FatoresRetangulosMisconception.ESQUECE_TRIVIAIS],
        parcial: spec.resposta,
      },
      ...(spec.modo === "identificar-primo" ? [{
        id: "ver-primo",
        say: "Número primo é o que tem um único par de fatores: um retângulo trivial 1 × n. Para 13, só existe 1 × 13.",
        show: { total: spec.total, pares: spec.pares, fatores: spec.fatores, destacarTriviais: true, destacarPrimo: true },
        parcial: spec.resposta,
      }] : []),
      ...(spec.modo === "maior-fator-comum" ? [{
        id: "comparar-fatores",
        say: "Liste os fatores dos dois números e escolha o maior que aparece nos dois conjuntos.",
        show: { total: spec.total, segundoTotal: spec.segundoTotal, fatores: spec.fatores, destacarComuns: comuns },
        parcial: spec.resposta,
      }] : []),
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === id);
  if (!micro) throw new Error(`N2.07 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirFatoresRetangulosQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N2.07") throw new Error(`fatoresRetangulosContract recebeu ${ficha.id}.`);
  const spec = construirFatoresRetangulosF66Spec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === id);
  if (!micro) throw new Error(`N2.07 sem micro L${spec.nivel}.`);

  const prompt = spec.modo === "pares-com-dica"
    ? `A dica diz que ${spec.total} tem ${spec.dicaQuantidadePares} formações. Qual completa a lista?`
    : spec.modo === "todos-pares"
      ? `Quais são todos os pares de fatores de ${spec.total}?`
      : spec.modo === "listar-fatores"
        ? `Qual lista contém todos os fatores de ${spec.total}?`
        : spec.modo === "identificar-primo"
          ? `${spec.total} é primo? Use os retângulos para decidir.`
          : `Qual é o maior fator comum de ${spec.total} e ${spec.segundoTotal}?`;

  const options: Option[] = spec.opcoes;
  return {
    kind: "fatores-retangulos-f66",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirFatoresRetangulosF66Resolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => Number(answer) === spec.resposta,
  };
}
