import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import { Evidencia } from "../../constants/evidencias";
import type { MasteryRule, Option, Question } from "../../types";
import type { FichaCompetencia } from "../schema";

export const PerimetroMisconception = {
  CONFUNDE_COM_AREA: "confunde-com-area",
  ESQUECE_UM_LADO: "esquece-um-lado",
  CONTA_CANTOS_DUAS_VEZES: "conta-cantos-duas-vezes",
} as const;
export type PerimetroMisconceptionTag = typeof PerimetroMisconception[keyof typeof PerimetroMisconception];

export const PerimetroEvidence = {
  COMPAROU_PERIMETRO_AREA: Evidencia.PERIMETRO_VS_AREA,
} as const;

export type PerimetroModo = "contar-malha" | "somar-lados" | "figura-irregular" | "perimetro-vs-area" | "lado-faltante";

export interface PerimetroOpcao {
  value: number;
  label: string;
  misconception?: PerimetroMisconceptionTag;
}

export interface PerimetroF63Spec {
  nivel: number;
  modo: PerimetroModo;
  largura: number;
  altura: number;
  lados: number[];
  perimetro: number;
  area: number;
  resposta: number;
  ladoFaltante?: number;
  opcoes: PerimetroOpcao[];
}

interface PerimetroShow {
  lados: number[];
  percorrerBorda?: boolean;
  somaParcial?: number;
  area?: number;
  perimetro?: number;
  ladoFaltante?: number;
}

const CASOS = [
  { modo: "contar-malha", largura: 3, altura: 2, lados: [3, 2, 3, 2], area: 6 },
  { modo: "somar-lados", largura: 5, altura: 3, lados: [5, 3, 5, 3], area: 15 },
  { modo: "figura-irregular", largura: 4, altura: 3, lados: [4, 2, 1, 1, 3, 3], area: 8 },
  { modo: "perimetro-vs-area", largura: 4, altura: 3, lados: [4, 3, 4, 3], area: 12 },
  { modo: "lado-faltante", largura: 5, altura: 4, lados: [5, 4, 5, 4], area: 20 },
] as const satisfies ReadonlyArray<{ modo: PerimetroModo; largura: number; altura: number; lados: readonly number[]; area: number }>;

function clampLevel(level: number): number {
  return Math.max(1, Math.min(5, Math.round(level)));
}

function opcoes(nivel: number, resposta: number, perimetro: number, area: number, ultimoLado: number): PerimetroOpcao[] {
  const candidatos: PerimetroOpcao[] = [
    { value: resposta, label: String(resposta) },
    { value: area, label: String(area), misconception: PerimetroMisconception.CONFUNDE_COM_AREA },
    {
      value: nivel === 5 ? Math.max(1, resposta + 1) : Math.max(1, perimetro - ultimoLado),
      label: String(nivel === 5 ? Math.max(1, resposta + 1) : Math.max(1, perimetro - ultimoLado)),
      misconception: PerimetroMisconception.ESQUECE_UM_LADO,
    },
    { value: resposta + 4, label: String(resposta + 4), misconception: PerimetroMisconception.CONTA_CANTOS_DUAS_VEZES },
  ];
  const unicas = candidatos.filter((item, index, all) => all.findIndex(other => other.value === item.value) === index);
  if (unicas.length < 4) {
    const reserva = resposta + 2;
    if (!unicas.some(item => item.value === reserva)) unicas.push({ value: reserva, label: String(reserva), misconception: PerimetroMisconception.ESQUECE_UM_LADO });
  }
  return unicas.slice(0, 4);
}

export function construirPerimetroSpec(level: number): PerimetroF63Spec {
  const nivel = clampLevel(level);
  const caso = CASOS[nivel - 1];
  const lados = [...caso.lados];
  const perimetro = lados.reduce((soma, lado) => soma + lado, 0);
  const ladoFaltante = nivel === 5 ? lados[lados.length - 1] : undefined;
  const resposta = ladoFaltante ?? perimetro;
  return {
    nivel,
    modo: caso.modo,
    largura: caso.largura,
    altura: caso.altura,
    lados,
    perimetro,
    area: caso.area,
    resposta,
    ladoFaltante,
    opcoes: opcoes(nivel, resposta, perimetro, caso.area, lados[lados.length - 1]),
  };
}

export function construirPerimetroResolucao(spec: PerimetroF63Spec): ResolucaoDeclarativa<PerimetroShow, number, PerimetroMisconceptionTag> {
  const somaConhecida = spec.ladoFaltante === undefined ? spec.perimetro : spec.perimetro - spec.ladoFaltante;
  return {
    estadoInicial: { lados: spec.lados },
    passos: [
      {
        id: "percorrer-borda",
        say: "Comece em um canto e dê a volta inteira, sem entrar no meio da figura.",
        show: { lados: spec.lados, percorrerBorda: true },
        corrige: [PerimetroMisconception.CONFUNDE_COM_AREA, PerimetroMisconception.CONTA_CANTOS_DUAS_VEZES],
        parcial: somaConhecida,
      },
      {
        id: "somar-segmentos",
        say: `Some cada lado uma única vez. Os lados conhecidos somam ${somaConhecida}.`,
        show: { lados: spec.lados, percorrerBorda: true, somaParcial: somaConhecida, area: spec.area },
        corrige: [PerimetroMisconception.ESQUECE_UM_LADO],
        parcial: somaConhecida,
      },
      {
        id: spec.nivel === 5 ? "descobrir-lado" : "fechar-volta",
        say: spec.nivel === 5
          ? `A volta inteira mede ${spec.perimetro}. Tire os ${somaConhecida} já conhecidos: falta ${spec.resposta}.`
          : `A volta inteira mede ${spec.perimetro}. Isso é o perímetro; os ${spec.area} quadrados de dentro medem a área.`,
        show: { lados: spec.lados, perimetro: spec.perimetro, area: spec.area, ladoFaltante: spec.ladoFaltante },
        corrige: [PerimetroMisconception.CONFUNDE_COM_AREA],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GM.07 sem micro L${nivel}`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function evidenciasPerimetro(nivel: number, correta: boolean): string[] {
  return correta && nivel === 4 ? [Evidencia.PERIMETRO_VS_AREA] : [];
}

export function construirPerimetroQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GM.07") throw new Error(`perimetroContract recebeu ${ficha.id}`);
  const spec = construirPerimetroSpec(level);
  const prompt = spec.nivel === 5
    ? `A volta toda mede ${spec.perimetro}. Três lados medem ${spec.lados[0]}, ${spec.lados[1]} e ${spec.lados[2]}. Quanto mede o lado que falta?`
    : spec.nivel === 4
      ? "Qual número mede só a volta da figura, e não o chão de dentro?"
      : "Qual é o perímetro desta figura?";
  const options: Option[] = spec.opcoes;
  return {
    kind: "perimetro-f63",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    resolucao: construirPerimetroResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    exigeEvidencia: spec.nivel === 4 ? Evidencia.PERIMETRO_VS_AREA : undefined,
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => Number(answer) === spec.resposta,
  };
}
