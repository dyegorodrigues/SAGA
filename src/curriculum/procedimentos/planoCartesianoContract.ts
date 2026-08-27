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

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));

const MAX_COORD = 3;
const CENA_BASE = {
  primitivas: ["ShapeCanvas"] as ["ShapeCanvas"],
  modoShapeCanvas: "grade" as const,
  maxCoord: MAX_COORD as 3,
  origem: { x: 0, y: 0 },
  primeiroAndaDepoisSobe: true as const,
  alternativaPorToque: true as const,
  snapGeneroso: true as const,
  raioSnapPx: 44,
};

/**
 * Os três erros da ficha, escritos como deslocamentos do alvo.
 *
 * `INVERTE_XY` troca as coordenadas; `CONTA_MARCAS` anda uma casa a menos no
 * eixo horizontal — quem conta traços em vez de intervalos; `IGNORA_ORIGEM`
 * sobe uma a menos, como quem começa a contar no primeiro traço e não no zero.
 *
 * Um alvo na diagonal devolveria o próprio alvo na inversão, e o distrator
 * sumiria na deduplicação — por isso `x` e `y` do alvo nunca são iguais.
 */
function distratoresDoAlvo(alvo: PontoCartesianoF80): Array<{ ponto: PontoCartesianoF80; misconception: PlanoCartesianoMisconceptionTag }> {
  return [
    { ponto: { x: alvo.y, y: alvo.x }, misconception: PlanoCartesianoMisconception.INVERTE_XY },
    { ponto: { x: alvo.x - 1, y: alvo.y }, misconception: PlanoCartesianoMisconception.CONTA_MARCAS },
    { ponto: { x: alvo.x, y: alvo.y - 1 }, misconception: PlanoCartesianoMisconception.IGNORA_ORIGEM },
  ];
}

/** Um ponto da malha fora da diagonal, com folga para os dois distratores. */
function sortearAlvo(): PontoCartesianoF80 {
  for (;;) {
    const x = ri(1, MAX_COORD);
    const y = ri(1, MAX_COORD);
    if (x === y) continue;
    return { x, y };
  }
}

/**
 * CLASS-003 — o ponto muda, a malha não.
 *
 * O alvo era sempre o mesmo: (3,2), (2,3), (3,2), (1,3) e (3,3). Decorar cinco
 * pares vencia a competência sem a criança sair da origem uma vez.
 *
 * A malha continua indo até 3 nos dois eixos: é o escopo declarado da ficha, e
 * mexer nele mudaria o que o nível cobra. O que passa a variar é o ponto.
 */
export function construirPlanoCartesianoF80Spec(level: number): PlanoCartesianoF80Spec {
  const nivel = clamp(level);
  const cena = { ...CENA_BASE, nivel, origem: { x: 0, y: 0 }, caminhoEntrePontos: false, desenharFigura: false, identificarPadrao: false };

  if (nivel === 1 || nivel === 2) {
    const alvo = sortearAlvo();
    return {
      ...cena, modo: nivel === 1 ? "ler-ponto" : "colocar-ponto", alvo,
      objetivo: nivel === 1 ? "Leia o ponto marcado." : `Coloque o ponto em (${alvo.x}, ${alvo.y}).`,
      resposta: encode(alvo), opcoes: makeOptions(alvo, distratoresDoAlvo(alvo)),
    };
  }

  if (nivel === 3) {
    const alvo = sortearAlvo();
    // A partida fica dentro da malha e não pode ser o próprio destino: um
    // caminho de comprimento zero não é caminho.
    let inicio = { x: ri(0, MAX_COORD), y: ri(0, MAX_COORD) };
    while (inicio.x === alvo.x && inicio.y === alvo.y) inicio = { x: ri(0, MAX_COORD), y: ri(0, MAX_COORD) };
    return {
      ...cena, modo: "caminho", caminhoEntrePontos: true, inicio, alvo,
      objetivo: `Saia de (${inicio.x}, ${inicio.y}) e chegue a (${alvo.x}, ${alvo.y}). Qual ponto final respeita o caminho?`,
      resposta: encode(alvo), opcoes: makeOptions(alvo, distratoresDoAlvo(alvo)),
    };
  }

  if (nivel === 4) {
    // Três cantos desenhados e o quarto por colocar. Os quatro precisam FECHAR
    // o retângulo — um quarto ponto solto faria o enunciado prometer uma figura
    // que o desenho não entrega.
    for (;;) {
      const x1 = ri(0, MAX_COORD - 1);
      const x2 = ri(x1 + 1, MAX_COORD);
      const y1 = ri(0, MAX_COORD - 1);
      const y2 = ri(y1 + 1, MAX_COORD);
      // O canto que falta é (x1, y2); os outros três já vêm ligados.
      const alvo = { x: x1, y: y2 };
      if (alvo.x === alvo.y || alvo.x < 1 || alvo.y < 1) continue;
      return {
        ...cena, modo: "figura-coordenadas", desenharFigura: true, alvo,
        vertices: [{ x: x1, y: y1 }, { x: x2, y: y1 }, { x: x2, y: y2 }],
        objetivo: "Três vértices do retângulo já estão ligados. Coloque o quarto vértice para completar a figura.",
        resposta: encode(alvo), opcoes: makeOptions(alvo, distratoresDoAlvo(alvo)),
      };
    }
  }

  // O padrão anda em UM eixo por vez. Andar nos dois com passo igual só cabe na
  // diagonal dentro de uma malha de 3, e ali a inversão devolveria o alvo.
  const horizontal = Math.random() < 0.5;
  const fixo = ri(1, MAX_COORD - 1);
  const pontosPadrao = [0, 1, 2].map(passo => (horizontal ? { x: passo, y: fixo } : { x: fixo, y: passo }));
  const alvo = horizontal ? { x: 3, y: fixo } : { x: fixo, y: 3 };
  return {
    ...cena, modo: "padrao-alinhado", identificarPadrao: true, alvo, pontosPadrao,
    objetivo: "Os pontos estão alinhados seguindo o mesmo padrão. Qual vem depois?",
    resposta: encode(alvo), opcoes: makeOptions(alvo, distratoresDoAlvo(alvo)),
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
