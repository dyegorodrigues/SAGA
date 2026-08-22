import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const ParesImparesMisconception = {
  CONFUNDE_TAMANHO: "confunde-tamanho",
  ZERO_IMPAR: "zero-impar",
  DECORA_SEM_ENTENDER: "decora-sem-entender",
} as const;
export type ParesImparesMisconceptionTag = typeof ParesImparesMisconception[keyof typeof ParesImparesMisconception];
export type ParesImparesEtapa = "formar-duplas-10" | "formar-duplas-20" | "decidir-visual" | "ultimo-algarismo" | "regra-soma";

export interface ParesImparesOpcao {
  value: 0 | 1;
  label: "Ímpar" | "Par";
  misconception?: ParesImparesMisconceptionTag;
}

export interface ParesImparesF38Spec {
  ficha: "F38";
  nivel: number;
  /** Nome do idioma visual canônico: DragGroup#duplas. */
  modo: "duplas";
  etapa: ParesImparesEtapa;
  primitiva: "DragGroup";
  modoPrimitiva: "duplas";
  quantidade: number;
  formarDuplas: boolean;
  regraUltimoAlgarismo?: true;
  soma?: { a: number; b: number };
  resposta: 0 | 1;
  opcoes: ParesImparesOpcao[];
  acessibilidade: { toqueAlternativo: true; alvoMinPx: 48 };
}

type ParesShow = {
  quantidade: number;
  pares?: number;
  sobra?: number;
  ultimoAlgarismo?: number;
  soma?: { a: number; b: number };
};

const acessibilidade = { toqueAlternativo: true, alvoMinPx: 48 } as const;
const paridade = (n: number): 0 | 1 => (n % 2 === 0 ? 1 : 0);
const opcoes = (resposta: 0 | 1, erro: ParesImparesMisconceptionTag): ParesImparesOpcao[] => [
  { value: 1, label: "Par", ...(resposta === 1 ? {} : { misconception: erro }) },
  { value: 0, label: "Ímpar", ...(resposta === 0 ? {} : { misconception: erro }) },
];

const specs: readonly ParesImparesF38Spec[] = [
  { ficha: "F38", nivel: 1, modo: "duplas", etapa: "formar-duplas-10", primitiva: "DragGroup", modoPrimitiva: "duplas", quantidade: 8, formarDuplas: true, resposta: 1, opcoes: opcoes(1, ParesImparesMisconception.CONFUNDE_TAMANHO), acessibilidade },
  { ficha: "F38", nivel: 2, modo: "duplas", etapa: "formar-duplas-20", primitiva: "DragGroup", modoPrimitiva: "duplas", quantidade: 15, formarDuplas: true, resposta: 0, opcoes: opcoes(0, ParesImparesMisconception.CONFUNDE_TAMANHO), acessibilidade },
  { ficha: "F38", nivel: 3, modo: "duplas", etapa: "decidir-visual", primitiva: "DragGroup", modoPrimitiva: "duplas", quantidade: 0, formarDuplas: false, resposta: 1, opcoes: opcoes(1, ParesImparesMisconception.ZERO_IMPAR), acessibilidade },
  { ficha: "F38", nivel: 4, modo: "duplas", etapa: "ultimo-algarismo", primitiva: "DragGroup", modoPrimitiva: "duplas", quantidade: 47, formarDuplas: false, regraUltimoAlgarismo: true, resposta: 0, opcoes: opcoes(0, ParesImparesMisconception.DECORA_SEM_ENTENDER), acessibilidade },
  { ficha: "F38", nivel: 5, modo: "duplas", etapa: "regra-soma", primitiva: "DragGroup", modoPrimitiva: "duplas", quantidade: 14, formarDuplas: false, soma: { a: 8, b: 6 }, resposta: 1, opcoes: opcoes(1, ParesImparesMisconception.DECORA_SEM_ENTENDER), acessibilidade },
] as const;

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
export function construirParesImparesF38Spec(level: number): ParesImparesF38Spec {
  const spec = specs[clamp(level) - 1];
  return {
    ...spec,
    opcoes: spec.opcoes.map(option => ({ ...option })),
    soma: spec.soma ? { ...spec.soma } : undefined,
    acessibilidade: { ...spec.acessibilidade },
  };
}

export function construirParesImparesResolucao(spec: ParesImparesF38Spec): ResolucaoDeclarativa<ParesShow, number, ParesImparesMisconceptionTag> {
  const pares = Math.floor(spec.quantidade / 2);
  const sobra = spec.quantidade % 2;
  return {
    estadoInicial: { quantidade: spec.quantidade },
    passos: [
      { id: "formar-duplas", say: "Junte os objetos de dois em dois. O tamanho do conjunto não decide se ele é par.", show: { quantidade: spec.quantidade, pares }, corrige: [ParesImparesMisconception.CONFUNDE_TAMANHO], parcial: spec.resposta },
      { id: "olhar-sobra", say: "Se não sobra ninguém, é par. Zero também é par: forma zero duplas e sobra zero.", show: { quantidade: spec.quantidade, pares, sobra }, corrige: [ParesImparesMisconception.ZERO_IMPAR], parcial: spec.resposta },
      ...(spec.regraUltimoAlgarismo ? [{ id: "ultimo-algarismo", say: "A regra do último algarismo resume as duplas; ela não substitui o porquê.", show: { quantidade: spec.quantidade, ultimoAlgarismo: spec.quantidade % 10 }, corrige: [ParesImparesMisconception.DECORA_SEM_ENTENDER], parcial: spec.resposta }] : []),
      ...(spec.soma ? [{ id: "compor-soma", say: "Pense na paridade de cada parcela e depois confira formando duplas no total.", show: { quantidade: spec.quantidade, soma: { ...spec.soma } }, corrige: [ParesImparesMisconception.DECORA_SEM_ENTENDER], parcial: spec.resposta }] : []),
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`N2.06 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirParesImparesQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N2.06") throw new Error(`paresImparesContract recebeu ${ficha.id}.`);
  const spec = construirParesImparesF38Spec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`N2.06 sem micro L${spec.nivel}.`);
  const options: Option[] = spec.opcoes;
  const prompt = spec.etapa === "regra-soma" && spec.soma
    ? `${spec.soma.a} + ${spec.soma.b} é par ou ímpar?`
    : spec.etapa === "ultimo-algarismo"
      ? `${spec.quantidade} é par ou ímpar? Explique pensando em duplas.`
      : spec.formarDuplas
        ? "Arrume de dois em dois. Sobrou alguém?"
        : `${spec.quantidade} é par ou ímpar?`;
  return {
    kind: "draggroup",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirParesImparesResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => Number(answer) === spec.resposta,
  };
}
