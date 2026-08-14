import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import { Evidencia } from "../../constants/evidencias";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";
import { cortesAlvoPartesIguais } from "./partesIguaisProcedure";

export const PartesIguaisMisconception = {
  IGNORA_IGUALDADE: "ignora-igualdade-das-partes",
  CONTA_PARTES: "conta-partes-sem-comparar-tamanho",
  MAIS_PARTES_MAIS_TUDO: "mais-partes-mais-tudo",
} as const;
export type PartesIguaisMisconceptionTag = typeof PartesIguaisMisconception[keyof typeof PartesIguaisMisconception];

export type PartesIguaisModo = "reconhecer" | "sobrepor" | "nomear" | "produzir" | "simbolo";
export type PartesIguaisSuporte = "circulo" | "barra";

export interface PartesIguaisF45Spec {
  nivel: number;
  modo: PartesIguaisModo;
  suporte: PartesIguaisSuporte;
  denominador: 2 | 3 | 4;
  partesIguais: boolean;
  sobrepor: boolean;
  cortes: number[];
  cortesAlvo: number[];
  toqueAlternativo: boolean;
  resposta: string;
  rotulo: "metade" | "terço" | "quarto";
  opcoes: Array<{ value: string; label: string; misconception?: PartesIguaisMisconceptionTag }>;
}

export interface PartesIguaisResolutionShow {
  suporte: PartesIguaisSuporte;
  denominador: number;
  cortes: number[];
  sobrepor?: boolean;
  rotulo?: string;
  simbolo?: string;
}

const clampLevel = (level: number) => Math.max(1, Math.min(5, Math.round(level)));
function safeIndex(rng: () => number, length: number): number {
  const raw = rng();
  const safe = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999999, raw)) : 0;
  return Math.floor(safe * length);
}
const denominadorPor = (rng: () => number): 2 | 3 | 4 => [2, 3, 4][safeIndex(rng, 3)] as 2 | 3 | 4;
const nomeDaParte = (denominador: 2 | 3 | 4): "metade" | "terço" | "quarto" => denominador === 2 ? "metade" : denominador === 3 ? "terço" : "quarto";

function opcoesNome(denominador: 2 | 3 | 4): PartesIguaisF45Spec["opcoes"] {
  const correta = nomeDaParte(denominador);
  return ([2, 3, 4] as const).map(valor => ({
    value: nomeDaParte(valor),
    label: nomeDaParte(valor),
    ...(valor === denominador ? {} : { misconception: PartesIguaisMisconception.CONTA_PARTES }),
  })).sort((a, b) => a.value === correta ? -1 : b.value === correta ? 1 : a.value.localeCompare(b.value));
}

function opcoesSimbolo(denominador: 2 | 3 | 4): PartesIguaisF45Spec["opcoes"] {
  const correta = `1/${denominador}`;
  return ([2, 3, 4] as const).map(valor => ({
    value: `1/${valor}`,
    label: `1/${valor}`,
    ...(valor === denominador ? {} : { misconception: valor > denominador ? PartesIguaisMisconception.MAIS_PARTES_MAIS_TUDO : PartesIguaisMisconception.CONTA_PARTES }),
  })).sort((a, b) => a.value === correta ? -1 : b.value === correta ? 1 : a.value.localeCompare(b.value));
}

export function construirPartesIguaisSpec(level: number, rng: () => number = Math.random): PartesIguaisF45Spec {
  const nivel = clampLevel(level);
  const denominador = nivel === 1 ? ([2, 4][safeIndex(rng, 2)] as 2 | 4) : denominadorPor(rng);
  const alvo = cortesAlvoPartesIguais(denominador);
  const rotulo = nomeDaParte(denominador);

  if (nivel === 1) {
    const partesIguais = rng() >= 0.45;
    const cortes = partesIguais ? alvo : alvo.map((valor, indice) => Math.max(0.08, Math.min(0.92, valor + (indice % 2 === 0 ? 0.10 : -0.08))));
    return {
      nivel, modo: "reconhecer", suporte: "circulo", denominador, partesIguais, sobrepor: false,
      cortes, cortesAlvo: alvo, toqueAlternativo: false,
      resposta: partesIguais ? "iguais" : "diferentes", rotulo,
      opcoes: [
        { value: "iguais", label: "São iguais", ...(partesIguais ? {} : { misconception: PartesIguaisMisconception.IGNORA_IGUALDADE }) },
        { value: "diferentes", label: "Não são iguais", ...(!partesIguais ? {} : { misconception: PartesIguaisMisconception.IGNORA_IGUALDADE }) },
      ],
    };
  }
  if (nivel === 2) {
    return {
      nivel, modo: "sobrepor", suporte: "circulo", denominador, partesIguais: true, sobrepor: true,
      cortes: alvo, cortesAlvo: alvo, toqueAlternativo: false, resposta: "iguais", rotulo,
      opcoes: [
        { value: "iguais", label: "Encaixam: são iguais" },
        { value: "diferentes", label: "Não encaixam", misconception: PartesIguaisMisconception.IGNORA_IGUALDADE },
      ],
    };
  }
  if (nivel === 3) {
    return {
      nivel, modo: "nomear", suporte: "barra", denominador, partesIguais: true, sobrepor: false,
      cortes: alvo, cortesAlvo: alvo, toqueAlternativo: false, resposta: rotulo, rotulo,
      opcoes: opcoesNome(denominador),
    };
  }
  if (nivel === 4) {
    const cortes = alvo.map((valor, indice) => Math.max(1 / 12, Math.min(11 / 12, valor + (indice % 2 === 0 ? 1 / 12 : -1 / 12))));
    return {
      nivel, modo: "produzir", suporte: "barra", denominador, partesIguais: false, sobrepor: false,
      cortes, cortesAlvo: alvo, toqueAlternativo: true, resposta: "partes-iguais", rotulo, opcoes: [],
    };
  }
  return {
    nivel, modo: "simbolo", suporte: "barra", denominador, partesIguais: true, sobrepor: false,
    cortes: alvo, cortesAlvo: alvo, toqueAlternativo: false, resposta: `1/${denominador}`, rotulo,
    opcoes: opcoesSimbolo(denominador),
  };
}

export function construirPartesIguaisResolucao(spec: PartesIguaisF45Spec): ResolucaoDeclarativa<PartesIguaisResolutionShow, string, PartesIguaisMisconceptionTag> {
  const corrige = [PartesIguaisMisconception.IGNORA_IGUALDADE, PartesIguaisMisconception.CONTA_PARTES];
  return {
    estadoInicial: { suporte: spec.suporte, denominador: spec.denominador, cortes: spec.cortes, sobrepor: spec.sobrepor },
    passos: [
      {
        id: "comparar-o-tamanho",
        say: "Antes de contar as partes, compare o tamanho delas. Fração começa com partes do mesmo tamanho.",
        show: { suporte: spec.suporte, denominador: spec.denominador, cortes: spec.cortesAlvo, sobrepor: true },
        corrige,
        parcial: "partes-do-mesmo-tamanho",
      },
      {
        id: "nomear-uma-parte",
        say: `O inteiro foi dividido em ${spec.denominador} partes iguais. Uma delas é ${spec.rotulo}.`,
        show: { suporte: spec.suporte, denominador: spec.denominador, cortes: spec.cortesAlvo, rotulo: spec.rotulo, simbolo: `1/${spec.denominador}` },
        corrige: [...corrige, PartesIguaisMisconception.MAIS_PARTES_MAIS_TUDO],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function masteryRuleDaFicha(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`N5.01 sem micro do nível ${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirPartesIguaisQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N5.01") throw new Error(`partesIguaisContract recebeu ${ficha.id}.`);
  const spec = construirPartesIguaisSpec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`N5.01 sem micro do nível ${spec.nivel}.`);
  const prompt = spec.modo === "reconhecer" ? "Essas partes têm o mesmo tamanho?"
    : spec.modo === "sobrepor" ? "Quando sobrepomos as partes, elas encaixam?"
      : spec.modo === "nomear" ? "Como chamamos uma destas partes iguais?"
        : spec.modo === "produzir" ? `Divida a barra em ${spec.denominador} partes iguais.`
          : "Qual símbolo representa uma destas partes iguais?";
  const options: Option[] | undefined = spec.opcoes.length ? spec.opcoes : undefined;
  return {
    kind: "partes-iguais-f45",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirPartesIguaisResolucao(spec),
    masteryRule: masteryRuleDaFicha(ficha, spec.nivel),
    exigeEvidencia: Evidencia.PARTES_IGUAIS_DIVISAO,
    uiProps: spec,
    ...(options ? { options } : {}),
    answer: spec.resposta,
    evaluate: answer => String(answer).trim().toLowerCase() === spec.resposta.toLowerCase(),
  };
}
