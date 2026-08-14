import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import { Evidencia } from "../../constants/evidencias";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const DecimalMisconception = {
  DECIMAL_COMO_INTEIRO: "decimal-como-inteiro",
  SEM_VALOR_POSICIONAL: "sem-valor-posicional-decimal",
  ORDEM_TROCADA: "decimo-centesimo-trocados",
} as const;
export type DecimalMisconceptionTag = typeof DecimalMisconception[keyof typeof DecimalMisconception];
export type DecimalModo = "decimos" | "centesimos" | "fracao-decimal" | "comparar" | "ordenar";

export interface DecimalF75Spec {
  nivel: number;
  modo: DecimalModo;
  unidadeDoQuadrado: 1;
  valorDaColuna: 0.1;
  valorDaCelula: 0.01;
  pintados: number;
  resposta: string;
  fracao?: string;
  comparar?: { esquerda: number; direita: number };
  ordenar?: number[];
  opcoes: Array<{ value: string; label: string; misconception?: DecimalMisconceptionTag }>;
}

interface DecimalShow { pintados?: number; decimal?: string; fracao?: string; comparar?: [number, number]; }

const clampLevel = (level: number) => Math.max(1, Math.min(5, Math.round(level)));
function escolher<T>(itens: T[], rng: () => number): T {
  const raw = rng();
  const n = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999, raw)) : 0;
  return itens[Math.floor(n * itens.length)] ?? itens[0];
}
const decimal = (n: number) => n.toFixed(n < 0.1 ? 2 : (Number.isInteger(n * 10) ? 1 : 2));
const label = (s: string) => s.replace(".", ",");
function opcoes(correta: string, erradas: string[], tag: DecimalMisconceptionTag) {
  return [...new Set([correta, ...erradas])].slice(0, 4).map(value => ({ value, label: label(value), ...(value === correta ? {} : { misconception: tag }) }));
}

export function construirDecimalSpec(level: number, rng: () => number = Math.random): DecimalF75Spec {
  const nivel = clampLevel(level);
  const base = { nivel, unidadeDoQuadrado: 1 as const, valorDaColuna: 0.1 as const, valorDaCelula: 0.01 as const };
  if (nivel === 1) {
    const decimos = escolher([2, 3, 4, 5, 6, 7, 8], rng);
    const resposta = decimal(decimos / 10);
    return { ...base, modo: "decimos", pintados: decimos * 10, resposta, opcoes: opcoes(resposta, [decimal(decimos / 100), decimal(Math.min(9, decimos + 1) / 10), decimal(Math.max(1, decimos - 1) / 10)], DecimalMisconception.ORDEM_TROCADA) };
  }
  if (nivel === 2) {
    const centesimos = escolher([7, 12, 18, 24, 36, 47], rng);
    const resposta = decimal(centesimos / 100);
    return { ...base, modo: "centesimos", pintados: centesimos, resposta, opcoes: opcoes(resposta, [decimal(centesimos / 10), decimal(Math.min(99, centesimos + 10) / 100), decimal(Math.max(1, centesimos - 1) / 100)], DecimalMisconception.ORDEM_TROCADA) };
  }
  if (nivel === 3) {
    const decimos = escolher([2, 3, 4, 6, 7, 8], rng);
    const resposta = decimal(decimos / 10);
    return { ...base, modo: "fracao-decimal", pintados: decimos * 10, resposta, fracao: `${decimos}/10`, opcoes: opcoes(resposta, [decimal(decimos / 100), decimal((10 - decimos) / 10)], DecimalMisconception.SEM_VALOR_POSICIONAL) };
  }
  if (nivel === 4) {
    const pares = [[0.5, 0.25], [0.4, 0.35], [0.7, 0.62], [0.3, 0.28]] as const;
    const par = escolher([...pares], rng);
    const resposta = par[0] > par[1] ? "esquerda" : "direita";
    return { ...base, modo: "comparar", pintados: Math.round(par[0] * 100), resposta, comparar: { esquerda: par[0], direita: par[1] }, opcoes: [{ value: "esquerda", label: label(decimal(par[0])), ...(resposta === "esquerda" ? {} : { misconception: DecimalMisconception.DECIMAL_COMO_INTEIRO }) }, { value: "direita", label: label(decimal(par[1])), ...(resposta === "direita" ? {} : { misconception: DecimalMisconception.DECIMAL_COMO_INTEIRO }) }] };
  }
  const conjuntos = [[0.2, 0.45, 0.8], [0.15, 0.5, 0.72], [0.09, 0.3, 0.61]];
  const valores = escolher(conjuntos, rng);
  const ordenados = [...valores].sort((a, b) => a - b);
  const resposta = ordenados.map(decimal).join("<");
  const invertida = [...ordenados].reverse().map(decimal).join("<");
  const comoInteiros = [...valores].sort((a, b) => Number(String(a).split(".")[1] || 0) - Number(String(b).split(".")[1] || 0)).map(decimal).join("<");
  return { ...base, modo: "ordenar", pintados: Math.round(ordenados[1] * 100), resposta, ordenar: valores, opcoes: [...new Set([resposta, invertida, comoInteiros])].map(value => ({ value, label: value.split("<").map(label).join(" < "), ...(value === resposta ? {} : { misconception: DecimalMisconception.DECIMAL_COMO_INTEIRO }) })) };
}

export function construirDecimalResolucao(spec: DecimalF75Spec): ResolucaoDeclarativa<DecimalShow, string, DecimalMisconceptionTag> {
  return {
    estadoInicial: { pintados: spec.pintados },
    passos: [
      { id: "cem-vira-um", say: "O mesmo quadro de cem agora vale um inteiro. Uma coluna vale um décimo e uma casa vale um centésimo.", show: { pintados: spec.pintados }, corrige: [DecimalMisconception.ORDEM_TROCADA, DecimalMisconception.SEM_VALOR_POSICIONAL], parcial: "100-casas-agora-formam-1" },
      { id: "ler-valor", say: `A região pintada representa ${label(spec.resposta)} no sistema decimal.`, show: { pintados: spec.pintados, decimal: spec.resposta, ...(spec.fracao ? { fracao: spec.fracao } : {}) }, corrige: [DecimalMisconception.DECIMAL_COMO_INTEIRO], parcial: spec.resposta },
    ],
    fallback: 0,
  };
}

function masteryRuleDaFicha(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`N6.01 sem micro do nível ${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirDecimalQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N6.01") throw new Error(`decimalContract recebeu ${ficha.id}.`);
  const spec = construirDecimalSpec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`N6.01 sem micro do nível ${spec.nivel}.`);
  const prompt = spec.modo === "comparar" ? "Qual decimal pinta a maior parte do inteiro?" : spec.modo === "ordenar" ? "Coloque os decimais do menor para o maior." : "Quanto do quadrado inteiro está pintado?";
  const options: Option[] = spec.opcoes;
  return {
    kind: "decimos-centesimos-f75",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirDecimalResolucao(spec),
    masteryRule: masteryRuleDaFicha(ficha, spec.nivel),
    exigeEvidencia: Evidencia.DECIMAL_COMPARACAO,
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => String(answer) === spec.resposta,
  };
}
