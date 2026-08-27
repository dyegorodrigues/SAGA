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

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));

/**
 * CLASS-003 — a quantidade é sorteada, a escada não.
 *
 * Era uma quantidade só por nível — 8, 15, 0, 47 e 14 —, e a resposta certa
 * saía sempre na mesma ordem: Par, Ímpar, Par, Ímpar, Par. Entre duas
 * alternativas, decorar cinco palavras vencia a competência sem a criança
 * formar uma dupla.
 *
 * O degrau continua sendo o ESCOPO e o método: formar duplas até 10, até 20,
 * decidir sem formar, a regra do último algarismo, e a paridade de uma soma.
 */
export function construirParesImparesF38Spec(level: number): ParesImparesF38Spec {
  const nivel = clamp(level);
  const base = { ficha: "F38" as const, nivel, modo: "duplas" as const, primitiva: "DragGroup" as const, modoPrimitiva: "duplas" as const, acessibilidade: { ...acessibilidade } };

  if (nivel === 1 || nivel === 2) {
    const quantidade = nivel === 1 ? ri(3, 10) : ri(11, 20);
    return {
      ...base, etapa: nivel === 1 ? "formar-duplas-10" : "formar-duplas-20", quantidade, formarDuplas: true,
      resposta: paridade(quantidade), opcoes: opcoes(paridade(quantidade), ParesImparesMisconception.CONFUNDE_TAMANHO),
    };
  }

  if (nivel === 3) {
    // Zero sai do caso fixo mas não some do corpus: é o único lugar onde a
    // criança pode cometer o `ZERO_IMPAR`, e um erro que a tela nunca dá
    // chance de cometer é um erro que o Radar nunca vê.
    const quantidade = Math.random() < 0.25 ? 0 : ri(1, 12);
    return {
      ...base, etapa: "decidir-visual", quantidade, formarDuplas: false,
      resposta: paridade(quantidade),
      opcoes: opcoes(paridade(quantidade), quantidade === 0 ? ParesImparesMisconception.ZERO_IMPAR : ParesImparesMisconception.CONFUNDE_TAMANHO),
    };
  }

  if (nivel === 4) {
    const quantidade = ri(21, 99);
    return {
      ...base, etapa: "ultimo-algarismo", quantidade, formarDuplas: false, regraUltimoAlgarismo: true,
      resposta: paridade(quantidade), opcoes: opcoes(paridade(quantidade), ParesImparesMisconception.DECORA_SEM_ENTENDER),
    };
  }

  // As duas parcelas variam de paridade: par+par, ímpar+ímpar e par+ímpar dão
  // resultados diferentes, e prever isso é o que o nível ensina.
  const a = ri(2, 12);
  const b = ri(2, 12);
  const quantidade = a + b;
  return {
    ...base, etapa: "regra-soma", quantidade, formarDuplas: false, soma: { a, b },
    resposta: paridade(quantidade), opcoes: opcoes(paridade(quantidade), ParesImparesMisconception.DECORA_SEM_ENTENDER),
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
