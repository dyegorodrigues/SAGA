import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import { Evidencia } from "../../constants/evidencias";
import type { MasteryRule, Option, Question } from "../../types";
import type { FichaCompetencia } from "../schema";
import { formatarQuocienteResto, restoEhValido } from "./divisaoLongaProcedure";

export const DivisaoLongaMisconception = {
  ZERO_PULADO: "zero-pulado-no-quociente",
  ORDEM_INVERTIDA: "ordem-invertida-na-divisao",
  RESTO_INVALIDO: "resto-maior-ou-igual-divisor",
  NAO_BAIXOU: "nao-baixou-proximo-algarismo",
} as const;
export type DivisaoLongaMisconceptionTag = typeof DivisaoLongaMisconception[keyof typeof DivisaoLongaMisconception];
export type DivisaoLongaModo = "arranjo-exata" | "arranjo-resto" | "ponte-algoritmo" | "algoritmo" | "zero-quociente";

export interface DivisaoLongaOpcao {
  value: string;
  label: string;
  misconception?: DivisaoLongaMisconceptionTag;
}

export interface DivisaoLongaF69Spec {
  nivel: number;
  modo: DivisaoLongaModo;
  dividendo: number;
  divisor: number;
  quociente: number;
  resto: number;
  resposta: string;
  revelacaoProgressiva: true;
  opcoes: DivisaoLongaOpcao[];
}

interface DivisaoLongaShow {
  dividendo: number;
  divisor: number;
  grupos?: number;
  produto?: number;
  resto?: number;
  baixar?: boolean;
}

const MODOS: readonly DivisaoLongaModo[] = [
  "arranjo-exata", "arranjo-resto", "ponte-algoritmo", "algoritmo", "zero-quociente",
];

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

/**
 * CLASS-003 — o caso do nível é sorteado, a escada não.
 *
 * O contrato devolvia `24÷4`, `29÷4`, `84÷4`, `156÷3` e `612÷6`, um caso fixo
 * por nível, enquanto a ficha cobra 4 acertos de 4 em 3 sessões. Doze respostas
 * ao mesmo item medem memória de um item, não divisão.
 *
 * O que NÃO é sorteado é o `modo`: cada nível guarda a sua invariante —
 * exata em arranjo, resto visível, ponte de dois dígitos, algoritmo de três, e
 * zero no meio do quociente. Sortear a invariante desfaria a escada concreto →
 * algoritmo, que é o que a F69 ensina.
 *
 * As faixas ficam apertadas de propósito. Além da escada, elas seguram os
 * distratores de `alternativas()`: com quociente pequeno demais, `naoBaixou`
 * colapsa na própria resposta e a criança certa seria reprovada.
 */
function sortearCaso(nivel: number): { modo: DivisaoLongaModo; dividendo: number; divisor: number } {
  const modo = MODOS[nivel - 1];
  if (nivel === 1) {
    const divisor = ri(3, 5);
    return { modo, divisor, dividendo: divisor * ri(3, 8) };
  }
  if (nivel === 2) {
    const divisor = ri(3, 5);
    return { modo, divisor, dividendo: divisor * ri(3, 8) + ri(1, divisor - 1) };
  }
  if (nivel === 3) {
    const divisor = ri(3, 6);
    return { modo, divisor, dividendo: divisor * ri(11, Math.floor(99 / divisor)) };
  }
  if (nivel === 4) {
    const divisor = ri(3, 7);
    const quociente = ri(Math.max(30, Math.ceil(100 / divisor)), Math.floor(999 / divisor));
    return { modo, divisor, dividendo: divisor * quociente };
  }
  // L5: o quociente precisa carregar um zero no meio — é ele que o nível mede.
  const divisor = ri(2, 6);
  const centenas = ri(1, Math.floor(999 / divisor / 100));
  const quociente = centenas * 100 + ri(1, 9);
  return { modo, divisor, dividendo: divisor * quociente };
}

function clampLevel(level: number): number {
  return Math.max(1, Math.min(5, Math.round(level)));
}

function alternativas(nivel: number, dividendo: number, divisor: number, quociente: number, resto: number): DivisaoLongaOpcao[] {
  const resposta = formatarQuocienteResto(quociente, resto);
  const semZero = nivel === 5 ? String(Number(String(quociente).replace("0", ""))) : String(Math.max(0, quociente - 1));
  const restoInvalido = `${Math.max(0, quociente - 1)} r ${divisor + Math.max(1, resto)}`;
  const naoBaixou = String(Math.max(1, Math.floor(quociente / 10)));
  const candidatos: DivisaoLongaOpcao[] = [
    { value: resposta, label: resto > 0 ? `${quociente}, resto ${resto}` : String(quociente) },
    { value: semZero, label: semZero, misconception: nivel === 5 ? DivisaoLongaMisconception.ZERO_PULADO : DivisaoLongaMisconception.NAO_BAIXOU },
    { value: restoInvalido, label: restoInvalido.replace(" r ", ", resto "), misconception: DivisaoLongaMisconception.RESTO_INVALIDO },
    { value: naoBaixou, label: naoBaixou, misconception: DivisaoLongaMisconception.NAO_BAIXOU },
  ];
  const unicas = candidatos.filter((item, index, all) => all.findIndex(other => other.value === item.value) === index);
  if (unicas.length < 3) unicas.push({ value: String(divisor), label: String(divisor), misconception: DivisaoLongaMisconception.ORDEM_INVERTIDA });
  return unicas.slice(0, 4);
}

export function construirDivisaoLongaSpec(level: number): DivisaoLongaF69Spec {
  const nivel = clampLevel(level);
  const caso = sortearCaso(nivel);
  const quociente = Math.floor(caso.dividendo / caso.divisor);
  const resto = caso.dividendo % caso.divisor;
  if (!restoEhValido(caso.dividendo, caso.divisor, quociente, resto)) throw new Error("F69 gerou divisão inválida");
  return {
    nivel,
    modo: caso.modo,
    dividendo: caso.dividendo,
    divisor: caso.divisor,
    quociente,
    resto,
    resposta: formatarQuocienteResto(quociente, resto),
    revelacaoProgressiva: true,
    opcoes: alternativas(nivel, caso.dividendo, caso.divisor, quociente, resto),
  };
}

export function construirDivisaoLongaResolucao(spec: DivisaoLongaF69Spec): ResolucaoDeclarativa<DivisaoLongaShow, string, DivisaoLongaMisconceptionTag> {
  const produto = spec.quociente * spec.divisor;
  return {
    estadoInicial: { dividendo: spec.dividendo, divisor: spec.divisor },
    passos: [
      {
        id: "estimar-grupos",
        say: `Quantos grupos de ${spec.divisor} cabem? Comece por um pedaço grande e ajuste.`,
        show: { dividendo: spec.dividendo, divisor: spec.divisor, grupos: spec.quociente },
        corrige: [DivisaoLongaMisconception.ORDEM_INVERTIDA],
        parcial: "estimar",
      },
      {
        id: "multiplicar-subtrair",
        say: `Confira os grupos: ${spec.quociente} grupos usam ${produto}. O que sobra precisa ser menor que ${spec.divisor}.`,
        show: { dividendo: spec.dividendo, divisor: spec.divisor, grupos: spec.quociente, produto, resto: spec.resto },
        corrige: [DivisaoLongaMisconception.RESTO_INVALIDO],
        parcial: "conferir-resto",
      },
      {
        id: "preservar-posicoes",
        say: spec.nivel === 5 ? "Ao baixar o próximo algarismo, uma posição sem grupos precisa aparecer como zero no quociente." : "Baixe o próximo algarismo sem pular nenhuma posição do quociente.",
        show: { dividendo: spec.dividendo, divisor: spec.divisor, grupos: spec.quociente, produto, resto: spec.resto, baixar: true },
        corrige: [DivisaoLongaMisconception.ZERO_PULADO, DivisaoLongaMisconception.NAO_BAIXOU],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`N4.10 sem micro L${nivel}`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirDivisaoLongaQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N4.10") throw new Error(`divisaoLongaContract recebeu ${ficha.id}`);
  const spec = construirDivisaoLongaSpec(level);
  const prompt = spec.resto > 0
    ? `Resolva ${spec.dividendo} ÷ ${spec.divisor}. Qual é o quociente e o resto?`
    : `Resolva ${spec.dividendo} ÷ ${spec.divisor}.`;
  const options: Option[] = spec.opcoes;
  return {
    kind: "divisao-longa-f69",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    resolucao: construirDivisaoLongaResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    exigeEvidencia: spec.nivel === 5 ? Evidencia.DIVISAO_ZERO_QUOCIENTE : undefined,
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => String(answer) === spec.resposta,
  };
}
