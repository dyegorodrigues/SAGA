import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import { Evidencia } from "../../constants/evidencias";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const FracaoNumeroMisconception = {
  CONTA_MARCAS: "conta-marcas-em-vez-de-intervalos",
  NAO_ORDENA_FRACAO: "nao-ordena-fracao-como-numero",
  DENOMINADOR_ERRADO: "denominador-errado-na-colecao",
  FRACAO_SO_MENOR_QUE_UM: "fracao-so-menor-que-um",
} as const;
export type FracaoNumeroMisconceptionTag = typeof FracaoNumeroMisconception[keyof typeof FracaoNumeroMisconception];
export type FracaoNumeroModo = "barra" | "colecao" | "reta" | "reta-parcial" | "impropria";
export type FracaoNumeroSuporte = "singapore" | "colecao" | "reta";

export interface FracaoNumeroF72Spec {
  nivel: number;
  modo: FracaoNumeroModo;
  suporte: FracaoNumeroSuporte;
  numerador: number;
  denominador: number;
  resposta: string;
  totalColecao?: number;
  marcasCompletas: boolean;
  retaFim: number;
  opcoes: Array<{ value: string; label: string; misconception?: FracaoNumeroMisconceptionTag }>;
}

interface FracaoNumeroShow {
  numerador: number;
  denominador: number;
  representacao: "barra" | "reta";
  retaFim?: number;
}

const clampLevel = (level: number) => Math.max(1, Math.min(5, Math.round(level)));
function escolher<T>(itens: T[], rng: () => number): T {
  const raw = rng();
  const n = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999, raw)) : 0;
  return itens[Math.floor(n * itens.length)] ?? itens[0];
}
const fracao = (n: number, d: number) => `${n}/${d}`;

function opcoesFracao(numerador: number, denominador: number, tag: FracaoNumeroMisconceptionTag): FracaoNumeroF72Spec["opcoes"] {
  const correta = fracao(numerador, denominador);
  const candidatos = new Set<string>([
    correta,
    fracao(Math.max(1, numerador - 1), denominador),
    fracao(Math.min(denominador - 1, numerador + 1), denominador),
    fracao(numerador, Math.max(2, denominador - 1)),
  ]);
  return [...candidatos].slice(0, 4).map(value => ({ value, label: value, ...(value === correta ? {} : { misconception: tag }) }));
}

export function construirFracaoNumeroSpec(level: number, rng: () => number = Math.random): FracaoNumeroF72Spec {
  const nivel = clampLevel(level);
  if (nivel === 1) {
    const denominador = escolher([2, 3, 4], rng);
    const numerador = escolher(Array.from({ length: denominador - 1 }, (_, i) => i + 1), rng);
    return { nivel, modo: "barra", suporte: "singapore", numerador, denominador, resposta: fracao(numerador, denominador), marcasCompletas: false, retaFim: denominador, opcoes: opcoesFracao(numerador, denominador, FracaoNumeroMisconception.NAO_ORDENA_FRACAO) };
  }
  if (nivel === 2) {
    const numerador = escolher([3, 4, 6, 8, 9], rng);
    const denominador = 12;
    return { nivel, modo: "colecao", suporte: "colecao", numerador, denominador, totalColecao: 12, resposta: fracao(numerador, denominador), marcasCompletas: false, retaFim: denominador, opcoes: opcoesFracao(numerador, denominador, FracaoNumeroMisconception.DENOMINADOR_ERRADO) };
  }
  if (nivel === 3) {
    const denominador = escolher([3, 4, 5], rng);
    const numerador = escolher(Array.from({ length: denominador - 1 }, (_, i) => i + 1), rng);
    return { nivel, modo: "reta", suporte: "reta", numerador, denominador, resposta: fracao(numerador, denominador), marcasCompletas: true, retaFim: denominador, opcoes: [] };
  }
  if (nivel === 4) {
    const denominador = 4;
    const numerador = escolher([1, 3], rng);
    return { nivel, modo: "reta-parcial", suporte: "reta", numerador, denominador, resposta: fracao(numerador, denominador), marcasCompletas: false, retaFim: denominador, opcoes: [] };
  }
  const denominador = escolher([3, 4], rng);
  const numerador = denominador + escolher([1, 2], rng);
  return { nivel, modo: "impropria", suporte: "reta", numerador, denominador, resposta: fracao(numerador, denominador), marcasCompletas: true, retaFim: denominador * 2, opcoes: [] };
}

export function construirFracaoNumeroResolucao(spec: FracaoNumeroF72Spec): ResolucaoDeclarativa<FracaoNumeroShow, string, FracaoNumeroMisconceptionTag> {
  return {
    estadoInicial: { numerador: spec.numerador, denominador: spec.denominador, representacao: "barra" },
    passos: [
      {
        id: "inteiro-vira-reta",
        say: "A barra inteira vale um. As divisões da barra viram as mesmas divisões na reta.",
        show: { numerador: spec.numerador, denominador: spec.denominador, representacao: "reta", retaFim: spec.retaFim },
        corrige: [FracaoNumeroMisconception.CONTA_MARCAS, FracaoNumeroMisconception.NAO_ORDENA_FRACAO],
        parcial: "barra-e-reta-sao-a-mesma-quantidade",
      },
      {
        id: "andar-o-numerador",
        say: `Divida em ${spec.denominador} partes iguais e avance ${spec.numerador}. Esse ponto é ${spec.resposta}.`,
        show: { numerador: spec.numerador, denominador: spec.denominador, representacao: "reta", retaFim: spec.retaFim },
        corrige: [FracaoNumeroMisconception.CONTA_MARCAS, FracaoNumeroMisconception.NAO_ORDENA_FRACAO, FracaoNumeroMisconception.FRACAO_SO_MENOR_QUE_UM],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function masteryRuleDaFicha(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`N5.02 sem micro do nível ${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirFracaoNumeroQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N5.02") throw new Error(`fracaoNumeroContract recebeu ${ficha.id}.`);
  const spec = construirFracaoNumeroSpec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`N5.02 sem micro do nível ${spec.nivel}.`);
  const prompt = spec.modo === "barra" ? "Qual fração da barra está pintada?"
    : spec.modo === "colecao" ? "Que fração da coleção está destacada?"
      : spec.modo === "impropria" ? `Onde fica ${spec.resposta} na reta até 2?`
        : `Onde fica ${spec.resposta} na reta?`;
  const options: Option[] | undefined = spec.opcoes.length ? spec.opcoes : undefined;
  return {
    kind: "fracao-numero-f72",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirFracaoNumeroResolucao(spec),
    masteryRule: masteryRuleDaFicha(ficha, spec.nivel),
    exigeEvidencia: Evidencia.FRACAO_NUMERO_RETA,
    uiProps: spec,
    ...(options ? { options } : {}),
    answer: spec.resposta,
    evaluate: answer => String(answer).trim() === spec.resposta,
  };
}
