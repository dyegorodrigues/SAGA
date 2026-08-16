import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const PlanoCartesianoMisconception = {
  INVERTE_XY: "inverte-xy",
  IGNORA_ORIGEM: "ignora-origem",
  CONTA_MARCAS: "conta-marcas",
} as const;
export type PlanoCartesianoMisconceptionTag = typeof PlanoCartesianoMisconception[keyof typeof PlanoCartesianoMisconception];
export type PlanoCartesianoModo = "ler-ponto" | "colocar-ponto" | "caminho" | "figura-coordenadas" | "padrao-alinhado";

export interface PontoCartesianoF80 { x: number; y: number }
export interface PlanoCartesianoOpcao { value: string; label: string; misconception?: PlanoCartesianoMisconceptionTag }
export interface PlanoCartesianoF80Spec {
  nivel: number;
  modo: PlanoCartesianoModo;
  primitivas: ["ShapeCanvas"];
  modoShapeCanvas: "grade";
  maxCoord: 3;
  origem: PontoCartesianoF80;
  alvo: PontoCartesianoF80;
  inicio?: PontoCartesianoF80;
  vertices?: PontoCartesianoF80[];
  pontosPadrao?: PontoCartesianoF80[];
  objetivo: string;
  resposta: string;
  opcoes: PlanoCartesianoOpcao[];
  primeiroAndaDepoisSobe: true;
  alternativaPorToque: true;
  snapGeneroso: true;
  raioSnapPx: number;
  caminhoEntrePontos: boolean;
  desenharFigura: boolean;
  identificarPadrao: boolean;
}

interface PlanoCartesianoShow {
  origem: PontoCartesianoF80;
  alvo: PontoCartesianoF80;
  destacarOrigem?: boolean;
  andarEixoX?: number;
  subirEixoY?: number;
  marcarPonto?: PontoCartesianoF80;
  vertices?: PontoCartesianoF80[];
  pontosPadrao?: PontoCartesianoF80[];
}

const encode = ({ x, y }: PontoCartesianoF80) => `${x},${y}`;
const label = (p: PontoCartesianoF80) => `(${p.x}, ${p.y})`;
const makeOptions = (
  correta: PontoCartesianoF80,
  erradas: Array<{ ponto: PontoCartesianoF80; misconception: PlanoCartesianoMisconceptionTag }>,
): PlanoCartesianoOpcao[] => [
  { value: encode(correta), label: label(correta) },
  ...erradas.map(item => ({ value: encode(item.ponto), label: label(item.ponto), misconception: item.misconception })),
];

const specs: readonly PlanoCartesianoF80Spec[] = [
  {
    nivel: 1, modo: "ler-ponto", primitivas: ["ShapeCanvas"], modoShapeCanvas: "grade", maxCoord: 3,
    origem: { x: 0, y: 0 }, alvo: { x: 3, y: 2 }, objetivo: "Leia o ponto marcado.", resposta: "3,2",
    opcoes: makeOptions({ x: 3, y: 2 }, [
      { ponto: { x: 2, y: 3 }, misconception: PlanoCartesianoMisconception.INVERTE_XY },
      { ponto: { x: 2, y: 2 }, misconception: PlanoCartesianoMisconception.CONTA_MARCAS },
      { ponto: { x: 3, y: 1 }, misconception: PlanoCartesianoMisconception.IGNORA_ORIGEM },
    ]),
    primeiroAndaDepoisSobe: true, alternativaPorToque: true, snapGeneroso: true, raioSnapPx: 44,
    caminhoEntrePontos: false, desenharFigura: false, identificarPadrao: false,
  },
  {
    nivel: 2, modo: "colocar-ponto", primitivas: ["ShapeCanvas"], modoShapeCanvas: "grade", maxCoord: 3,
    origem: { x: 0, y: 0 }, alvo: { x: 2, y: 3 }, objetivo: "Coloque o ponto em (2, 3).", resposta: "2,3",
    opcoes: makeOptions({ x: 2, y: 3 }, [
      { ponto: { x: 3, y: 2 }, misconception: PlanoCartesianoMisconception.INVERTE_XY },
      { ponto: { x: 1, y: 2 }, misconception: PlanoCartesianoMisconception.CONTA_MARCAS },
      { ponto: { x: 2, y: 2 }, misconception: PlanoCartesianoMisconception.IGNORA_ORIGEM },
    ]),
    primeiroAndaDepoisSobe: true, alternativaPorToque: true, snapGeneroso: true, raioSnapPx: 44,
    caminhoEntrePontos: false, desenharFigura: false, identificarPadrao: false,
  },
  {
    nivel: 3, modo: "caminho", primitivas: ["ShapeCanvas"], modoShapeCanvas: "grade", maxCoord: 3,
    origem: { x: 0, y: 0 }, inicio: { x: 1, y: 1 }, alvo: { x: 3, y: 2 }, objetivo: "Saia de (1, 1) e chegue a (3, 2). Qual ponto final respeita o caminho?", resposta: "3,2",
    opcoes: makeOptions({ x: 3, y: 2 }, [
      { ponto: { x: 2, y: 3 }, misconception: PlanoCartesianoMisconception.INVERTE_XY },
      { ponto: { x: 2, y: 1 }, misconception: PlanoCartesianoMisconception.CONTA_MARCAS },
      { ponto: { x: 3, y: 1 }, misconception: PlanoCartesianoMisconception.IGNORA_ORIGEM },
    ]),
    primeiroAndaDepoisSobe: true, alternativaPorToque: true, snapGeneroso: true, raioSnapPx: 44,
    caminhoEntrePontos: true, desenharFigura: false, identificarPadrao: false,
  },
  {
    nivel: 4, modo: "figura-coordenadas", primitivas: ["ShapeCanvas"], modoShapeCanvas: "grade", maxCoord: 3,
    origem: { x: 0, y: 0 }, alvo: { x: 1, y: 3 }, vertices: [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 3 }],
    objetivo: "Três vértices do retângulo já estão ligados. Coloque o quarto vértice para completar a figura.", resposta: "1,3",
    opcoes: makeOptions({ x: 1, y: 3 }, [
      { ponto: { x: 3, y: 1 }, misconception: PlanoCartesianoMisconception.INVERTE_XY },
      { ponto: { x: 0, y: 3 }, misconception: PlanoCartesianoMisconception.IGNORA_ORIGEM },
      { ponto: { x: 1, y: 2 }, misconception: PlanoCartesianoMisconception.CONTA_MARCAS },
    ]),
    primeiroAndaDepoisSobe: true, alternativaPorToque: true, snapGeneroso: true, raioSnapPx: 44,
    caminhoEntrePontos: false, desenharFigura: true, identificarPadrao: false,
  },
  {
    nivel: 5, modo: "padrao-alinhado", primitivas: ["ShapeCanvas"], modoShapeCanvas: "grade", maxCoord: 3,
    origem: { x: 0, y: 0 }, alvo: { x: 3, y: 3 }, pontosPadrao: [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }],
    objetivo: "Os pontos estão alinhados seguindo o mesmo padrão. Qual vem depois?", resposta: "3,3",
    opcoes: makeOptions({ x: 3, y: 3 }, [
      { ponto: { x: 3, y: 2 }, misconception: PlanoCartesianoMisconception.IGNORA_ORIGEM },
      { ponto: { x: 2, y: 3 }, misconception: PlanoCartesianoMisconception.INVERTE_XY },
      { ponto: { x: 2, y: 2 }, misconception: PlanoCartesianoMisconception.CONTA_MARCAS },
    ]),
    primeiroAndaDepoisSobe: true, alternativaPorToque: true, snapGeneroso: true, raioSnapPx: 44,
    caminhoEntrePontos: false, desenharFigura: false, identificarPadrao: true,
  },
] as const;

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
export function construirPlanoCartesianoF80Spec(level: number): PlanoCartesianoF80Spec {
  const spec = specs[clamp(level) - 1];
  return {
    ...spec,
    origem: { ...spec.origem },
    alvo: { ...spec.alvo },
    inicio: spec.inicio ? { ...spec.inicio } : undefined,
    vertices: spec.vertices?.map(p => ({ ...p })),
    pontosPadrao: spec.pontosPadrao?.map(p => ({ ...p })),
    opcoes: spec.opcoes.map(option => ({ ...option })),
  };
}

export function construirPlanoCartesianoResolucao(spec: PlanoCartesianoF80Spec): ResolucaoDeclarativa<PlanoCartesianoShow, string, PlanoCartesianoMisconceptionTag> {
  return {
    estadoInicial: { origem: spec.origem, alvo: spec.alvo, vertices: spec.vertices, pontosPadrao: spec.pontosPadrao },
    passos: [
      { id: "partir-da-origem", say: "Comece no zero: ele é a origem dos dois eixos.", show: { origem: spec.origem, alvo: spec.alvo, destacarOrigem: true }, corrige: [PlanoCartesianoMisconception.IGNORA_ORIGEM], parcial: spec.resposta },
      { id: "andar-no-x", say: `Primeiro ande ${spec.alvo.x} no eixo de baixo.`, show: { origem: spec.origem, alvo: spec.alvo, destacarOrigem: true, andarEixoX: spec.alvo.x }, corrige: [PlanoCartesianoMisconception.INVERTE_XY, PlanoCartesianoMisconception.CONTA_MARCAS], parcial: spec.resposta },
      { id: "subir-no-y", say: `Depois suba ${spec.alvo.y}. O ponto é (${spec.alvo.x}, ${spec.alvo.y}).`, show: { origem: spec.origem, alvo: spec.alvo, andarEixoX: spec.alvo.x, subirEixoY: spec.alvo.y, marcarPonto: spec.alvo, vertices: spec.vertices, pontosPadrao: spec.pontosPadrao }, corrige: [PlanoCartesianoMisconception.INVERTE_XY], parcial: spec.resposta },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.08 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirPlanoCartesianoQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GE.08") throw new Error(`planoCartesianoContract recebeu ${ficha.id}.`);
  const spec = construirPlanoCartesianoF80Spec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.08 sem micro L${spec.nivel}.`);
  const prompt = spec.objetivo;
  const options: Option[] = spec.opcoes;
  return {
    kind: "plano-cartesiano-f80",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirPlanoCartesianoResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => String(answer) === spec.resposta,
  };
}
