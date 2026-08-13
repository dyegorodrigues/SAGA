import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";
import { EqualGroupsEvidence, EqualGroupsMisconception, type EqualGroupsMisconceptionTag } from "./equalGroupsSemantics";

export type EqualGroupsRepresentacao = "soma-repetida" | "ponte" | "multiplicacao";
export interface EqualGroupsF97Spec {
  nivel: number; grupos: number; porGrupo: number; total: number;
  representacao: EqualGroupsRepresentacao;
  limites: { gruposMax: number; porGrupoMax: number };
  frase: string; somaRepetida: string; multiplicacao: string;
  mostrarSoma: boolean; mostrarMultiplicacao: boolean;
}
export interface EqualGroupsResolutionShow {
  grupos: number; porGrupo: number; gruposDestacados: number;
  frase: string; somaRepetida?: string; multiplicacao?: string; resultado?: number;
}

function ri(min: number, max: number, rng: () => number): number {
  const n = Number.isFinite(rng()) ? Math.max(0, Math.min(0.999999999, rng())) : 0;
  return min + Math.floor(n * (max - min + 1));
}

export function construirEqualGroupsSpec(nivel: number, rng: () => number = Math.random): EqualGroupsF97Spec {
  const n = Math.max(1, Math.min(5, Math.round(nivel)));
  const limites = n === 1 ? { gruposMax: 3, porGrupoMax: 3 }
    : n === 2 ? { gruposMax: 5, porGrupoMax: 3 }
    : n === 3 ? { gruposMax: 5, porGrupoMax: 5 }
    : n === 4 ? { gruposMax: 10, porGrupoMax: 5 }
    : { gruposMax: 10, porGrupoMax: 10 };
  const grupos = ri(2, limites.gruposMax, rng);
  const porGrupo = ri(2, limites.porGrupoMax, rng);
  const total = grupos * porGrupo;
  const mostrarSoma = n <= 3;
  const mostrarMultiplicacao = n >= 3;
  return {
    nivel: n, grupos, porGrupo, total, limites,
    representacao: n <= 2 ? "soma-repetida" : n === 3 ? "ponte" : "multiplicacao",
    frase: `${grupos} grupos de ${porGrupo}`,
    somaRepetida: Array.from({ length: grupos }, () => String(porGrupo)).join(" + "),
    multiplicacao: `${grupos} × ${porGrupo}`,
    mostrarSoma, mostrarMultiplicacao,
  };
}

function opcoes(spec: EqualGroupsF97Spec): Option[] {
  const candidatas: Option[] = [
    { value: spec.total, label: String(spec.total) },
    { value: spec.grupos + spec.porGrupo, label: String(spec.grupos + spec.porGrupo), misconception: EqualGroupsMisconception.SOMA_OS_FATORES },
    { value: spec.porGrupo, label: String(spec.porGrupo), misconception: EqualGroupsMisconception.CONTA_UM_GRUPO },
    { value: (spec.grupos - 1) * spec.porGrupo, label: String((spec.grupos - 1) * spec.porGrupo), misconception: EqualGroupsMisconception.PERDEU_UM_GRUPO },
  ];
  return candidatas.filter((option, index) => candidatas.findIndex(other => Number(other.value) === Number(option.value)) === index);
}

export function construirEqualGroupsResolucao(spec: EqualGroupsF97Spec): ResolucaoDeclarativa<EqualGroupsResolutionShow, number, EqualGroupsMisconceptionTag> {
  const inicial = { grupos: spec.grupos, porGrupo: spec.porGrupo, gruposDestacados: 0, frase: spec.frase };
  return {
    estadoInicial: inicial,
    passos: [
      {
        id: "ler-os-grupos",
        say: `Leia a cena como ${spec.frase}. Cada grupo tem a mesma quantidade.`,
        show: { ...inicial, gruposDestacados: spec.grupos, ...(spec.mostrarSoma ? { somaRepetida: spec.somaRepetida } : {}) },
        corrige: [EqualGroupsMisconception.CONTA_UM_GRUPO, EqualGroupsMisconception.PERDEU_UM_GRUPO],
        parcial: spec.porGrupo,
      },
      {
        id: "ligar-grupos-a-operacao",
        say: spec.mostrarMultiplicacao ? `${spec.multiplicacao}. O total é ${spec.total}.` : `${spec.somaRepetida}. O total é ${spec.total}.`,
        show: { ...inicial, gruposDestacados: spec.grupos, ...(spec.mostrarSoma ? { somaRepetida: spec.somaRepetida } : {}), ...(spec.mostrarMultiplicacao ? { multiplicacao: spec.multiplicacao } : {}), resultado: spec.total },
        corrige: [EqualGroupsMisconception.SOMA_OS_FATORES],
        parcial: spec.total,
      },
    ],
    fallback: 0,
  };
}

export function construirEqualGroupsQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N4.01") throw new Error(`equalGroupsContract recebeu ${ficha.id}.`);
  const spec = construirEqualGroupsSpec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`N4.01 sem micro do nível ${spec.nivel}.`);
  const rt = ficha.niveis?.[spec.nivel]?.rt_alvo;
  return {
    kind: "equal-groups-f97",
    prompt: `Quantos há em ${spec.frase}?`, audioPrompt: `Quantos há em ${spec.frase}?`,
    howto: ficha.howto, explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirEqualGroupsResolucao(spec),
    masteryRule: { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes },
    exigeEvidencia: spec.nivel >= 3 ? EqualGroupsEvidence.NOTACAO_MULTIPLICATIVA : undefined,
    ...(typeof rt === "number" && rt > 0 ? { rt_max_s: rt / 1000 } : {}),
    uiProps: spec, options: opcoes(spec), answer: spec.total,
    evaluate: answer => Number(answer) === spec.total,
  };
}
