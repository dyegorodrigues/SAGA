import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const PorcentagemMisconception = {
  PORCENTO_COMO_NUMERO: "porcento-como-numero",
  DESCONTO_ABSOLUTO: "desconto-absoluto",
  NOTACOES_SEPARADAS: "notacoes-separadas",
} as const;
export type PorcentagemMisconceptionTag = typeof PorcentagemMisconception[keyof typeof PorcentagemMisconception];
export type PorcentagemModo = "parte-de-cem" | "ancoras" | "percentual-de" | "desconto-acrescimo" | "percentual-inverso";

export interface PorcentagemF87Spec {
  nivel: number;
  modo: PorcentagemModo;
  percentual: number;
  total: number;
  parte: number;
  resposta: number;
  operacao?: "desconto" | "acrescimo";
  opcoes: Array<{ value: number; label: string; misconception?: PorcentagemMisconceptionTag }>;
}

interface PorcentagemShow {
  percentual: number;
  total: number;
  parte: number;
  fracao?: string;
  decimal?: string;
  operacao?: "desconto" | "acrescimo";
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
function escolher<T>(itens: readonly T[], rng: () => number): T {
  const raw = rng();
  const safe = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999, raw)) : 0;
  return itens[Math.floor(safe * itens.length)] ?? itens[0];
}
function opcoes(correta: number, erradas: Array<{ value: number; misconception: PorcentagemMisconceptionTag }>): PorcentagemF87Spec["opcoes"] {
  const todos = [{ value: correta, label: String(correta) }, ...erradas.map(item => ({ ...item, label: String(item.value) }))];
  return todos.filter((item, index, all) => all.findIndex(other => other.value === item.value) === index).slice(0, 4);
}

export function construirPorcentagemSpec(level: number, rng: () => number = Math.random): PorcentagemF87Spec {
  const nivel = clamp(level);
  if (nivel === 1) {
    const percentual = escolher([18, 32, 47, 63], rng);
    return {
      nivel, modo: "parte-de-cem", percentual, total: 100, parte: percentual, resposta: percentual,
      opcoes: opcoes(percentual, [
        { value: Math.round(percentual / 10), misconception: PorcentagemMisconception.NOTACOES_SEPARADAS },
        { value: 100 - percentual, misconception: PorcentagemMisconception.NOTACOES_SEPARADAS },
        { value: Math.min(100, percentual + 10), misconception: PorcentagemMisconception.PORCENTO_COMO_NUMERO },
      ]),
    };
  }
  if (nivel === 2) {
    const percentual = escolher([10, 25, 50, 75], rng);
    return {
      nivel, modo: "ancoras", percentual, total: 100, parte: percentual, resposta: percentual,
      opcoes: opcoes(percentual, [
        { value: percentual === 25 ? 4 : percentual === 50 ? 2 : percentual === 75 ? 3 : 10, misconception: PorcentagemMisconception.NOTACOES_SEPARADAS },
        { value: 100 - percentual, misconception: PorcentagemMisconception.NOTACOES_SEPARADAS },
        { value: Math.min(100, percentual + 10), misconception: PorcentagemMisconception.PORCENTO_COMO_NUMERO },
      ]),
    };
  }
  if (nivel === 3) {
    const caso = escolher([
      { percentual: 25, total: 80, parte: 20 },
      { percentual: 50, total: 60, parte: 30 },
      { percentual: 10, total: 90, parte: 9 },
      { percentual: 75, total: 40, parte: 30 },
    ], rng);
    return {
      nivel, modo: "percentual-de", ...caso, resposta: caso.parte,
      opcoes: opcoes(caso.parte, [
        { value: caso.total + caso.percentual, misconception: PorcentagemMisconception.PORCENTO_COMO_NUMERO },
        { value: Math.max(0, caso.total - caso.percentual), misconception: PorcentagemMisconception.PORCENTO_COMO_NUMERO },
        { value: caso.percentual, misconception: PorcentagemMisconception.NOTACOES_SEPARADAS },
      ]),
    };
  }
  if (nivel === 4) {
    const caso = escolher([
      { percentual: 25, total: 80, parte: 20, operacao: "desconto" as const, resposta: 60 },
      { percentual: 10, total: 50, parte: 5, operacao: "acrescimo" as const, resposta: 55 },
      { percentual: 20, total: 100, parte: 20, operacao: "desconto" as const, resposta: 80 },
    ], rng);
    const absoluto = caso.operacao === "desconto" ? caso.total - caso.percentual : caso.total + caso.percentual;
    return {
      nivel, modo: "desconto-acrescimo", percentual: caso.percentual, total: caso.total, parte: caso.parte, resposta: caso.resposta, operacao: caso.operacao,
      opcoes: opcoes(caso.resposta, [
        { value: absoluto, misconception: PorcentagemMisconception.DESCONTO_ABSOLUTO },
        { value: caso.parte, misconception: PorcentagemMisconception.NOTACOES_SEPARADAS },
        { value: caso.total + caso.percentual, misconception: PorcentagemMisconception.PORCENTO_COMO_NUMERO },
      ]),
    };
  }
  const caso = escolher([
    { percentual: 20, parte: 15, total: 75 },
    { percentual: 25, parte: 20, total: 80 },
    { percentual: 50, parte: 35, total: 70 },
  ], rng);
  return {
    nivel, modo: "percentual-inverso", percentual: caso.percentual, total: caso.total, parte: caso.parte, resposta: caso.total,
    opcoes: opcoes(caso.total, [
      { value: caso.parte + caso.percentual, misconception: PorcentagemMisconception.PORCENTO_COMO_NUMERO },
      { value: Math.round(caso.parte * caso.percentual / 100), misconception: PorcentagemMisconception.NOTACOES_SEPARADAS },
      { value: caso.percentual, misconception: PorcentagemMisconception.NOTACOES_SEPARADAS },
    ]),
  };
}

export function construirPorcentagemResolucao(spec: PorcentagemF87Spec): ResolucaoDeclarativa<PorcentagemShow, number, PorcentagemMisconceptionTag> {
  const decimal = (spec.percentual / 100).toString().replace(".", ",");
  return {
    estadoInicial: { percentual: spec.percentual, total: spec.total, parte: spec.parte, ...(spec.operacao ? { operacao: spec.operacao } : {}) },
    passos: [
      {
        id: "parte-de-cem",
        say: `${spec.percentual} por cento quer dizer ${spec.percentual} de cada cem.`,
        show: { percentual: spec.percentual, total: spec.total, parte: spec.parte, fracao: `${spec.percentual}/100`, decimal },
        corrige: [PorcentagemMisconception.NOTACOES_SEPARADAS],
        parcial: spec.parte,
      },
      {
        id: "aplicar-proporcao",
        say: spec.modo === "percentual-inverso" ? "Use essa mesma proporção para reconstruir o inteiro." : "Use a mesma fração da barra para encontrar a parte pedida.",
        show: { percentual: spec.percentual, total: spec.total, parte: spec.parte, ...(spec.operacao ? { operacao: spec.operacao } : {}) },
        corrige: [PorcentagemMisconception.PORCENTO_COMO_NUMERO, PorcentagemMisconception.DESCONTO_ABSOLUTO],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`N6.03 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirPorcentagemQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N6.03") throw new Error(`porcentagemContract recebeu ${ficha.id}.`);
  const spec = construirPorcentagemSpec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`N6.03 sem micro L${spec.nivel}.`);
  const prompt = spec.modo === "parte-de-cem" || spec.modo === "ancoras"
    ? "Quanto por cento do quadro está pintado?"
    : spec.modo === "percentual-de"
      ? `Quanto é ${spec.percentual}% de ${spec.total}?`
      : spec.modo === "desconto-acrescimo"
        ? `Qual é o valor final após ${spec.percentual}% de ${spec.operacao} sobre ${spec.total}?`
        : `${spec.percentual}% de um total são ${spec.parte}. Qual é o total?`;
  const options: Option[] = spec.opcoes;
  return {
    kind: "porcentagem-f87",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirPorcentagemResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => Number(answer) === spec.resposta,
  };
}
