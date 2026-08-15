import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const PoligonosMisconception = {
  NAO_FECHA: "nao-fecha",
  CONTA_LADOS_ERRADO: "conta-lados-errado",
  CONFUNDE_CLASSE: "confunde-classe",
} as const;
export type PoligonosMisconceptionTag = typeof PoligonosMisconception[keyof typeof PoligonosMisconception];
export type PoligonosModo = "identificar-poligono" | "triangulos" | "quadrilateros" | "classificar-propriedades" | "construir-classificar";
export type PoligonoFamilia = "triangulo" | "quadrilatero" | "quadrado" | "retangulo" | "nao-poligono";

export interface PoligonoFiguraF79 {
  id: string;
  familia: PoligonoFamilia;
  lados: number;
  fechada: boolean;
  ladosRetos: boolean;
  angulosRetos?: number;
  ladosIguais?: number;
  giro?: number;
}

export interface PoligonosF79Spec {
  nivel: number;
  modo: PoligonosModo;
  primitivas: ["ShapeCanvas", "DragGroup"];
  figuras: PoligonoFiguraF79[];
  resposta: string | number;
  opcoes: Array<{ value: string | number; label: string; misconception?: PoligonosMisconceptionTag }>;
  exigeFechada: true;
  exigeLadosRetos: true;
  incluiNaoExemploAberto: boolean;
  classificacaoPorPropriedades: boolean;
  quadradoTambemRetangulo: boolean;
  construcao: boolean;
  condicoes: string[];
  condicoesMinimas: number;
  alternativaPorToque: true;
}

interface PoligonosShow {
  figura?: PoligonoFiguraF79;
  destacarFechamento?: boolean;
  contarLados?: boolean;
  mostrarClasses?: string[];
  condicoes?: string[];
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
function options(correta: string | number, label: string, erradas: Array<{ value: string | number; label: string; misconception: PoligonosMisconceptionTag }>): PoligonosF79Spec["opcoes"] {
  return [{ value: correta, label }, ...erradas]
    .filter((item, index, all) => all.findIndex(other => other.value === item.value) === index)
    .slice(0, 4);
}

const triangulo: PoligonoFiguraF79 = { id: "triangulo-a", familia: "triangulo", lados: 3, fechada: true, ladosRetos: true, giro: 24 };
const quadrilatero: PoligonoFiguraF79 = { id: "quad-a", familia: "quadrilatero", lados: 4, fechada: true, ladosRetos: true, angulosRetos: 0, giro: 12 };
const quadrado: PoligonoFiguraF79 = { id: "quadrado-a", familia: "quadrado", lados: 4, fechada: true, ladosRetos: true, angulosRetos: 4, ladosIguais: 4, giro: 18 };
const aberto: PoligonoFiguraF79 = { id: "aberto-a", familia: "nao-poligono", lados: 3, fechada: false, ladosRetos: true };

export function construirPoligonosSpec(level: number): PoligonosF79Spec {
  const nivel = clamp(level);
  const base = {
    nivel,
    primitivas: ["ShapeCanvas", "DragGroup"] as ["ShapeCanvas", "DragGroup"],
    exigeFechada: true as const,
    exigeLadosRetos: true as const,
    alternativaPorToque: true as const,
  };
  if (nivel === 1) return {
    ...base, modo: "identificar-poligono", figuras: [triangulo, aberto], resposta: "sim",
    opcoes: options("sim", "Sim, é polígono", [
      { value: "nao", label: "Não é polígono", misconception: PoligonosMisconception.NAO_FECHA },
      { value: "so-se-em-pe", label: "Só se estiver em pé", misconception: PoligonosMisconception.CONFUNDE_CLASSE },
    ]),
    incluiNaoExemploAberto: true, classificacaoPorPropriedades: false, quadradoTambemRetangulo: false, construcao: false,
    condicoes: ["figura fechada", "lados retos"], condicoesMinimas: 2,
  };
  if (nivel === 2) return {
    ...base, modo: "triangulos", figuras: [triangulo, { ...triangulo, id: "triangulo-b", giro: 118 }, quadrilatero], resposta: "triangulo",
    opcoes: options("triangulo", "Triângulo", [
      { value: "quadrilatero", label: "Quadrilátero", misconception: PoligonosMisconception.CONTA_LADOS_ERRADO },
      { value: "nao-poligono", label: "Não polígono", misconception: PoligonosMisconception.NAO_FECHA },
    ]),
    incluiNaoExemploAberto: false, classificacaoPorPropriedades: true, quadradoTambemRetangulo: false, construcao: false,
    condicoes: ["3 lados retos", "figura fechada"], condicoesMinimas: 2,
  };
  if (nivel === 3) return {
    ...base, modo: "quadrilateros", figuras: [quadrilatero, quadrado, triangulo], resposta: "quadrilatero",
    opcoes: options("quadrilatero", "Quadrilátero", [
      { value: "triangulo", label: "Triângulo", misconception: PoligonosMisconception.CONTA_LADOS_ERRADO },
      { value: "nao-poligono", label: "Não polígono", misconception: PoligonosMisconception.NAO_FECHA },
    ]),
    incluiNaoExemploAberto: false, classificacaoPorPropriedades: true, quadradoTambemRetangulo: false, construcao: false,
    condicoes: ["4 lados retos", "figura fechada"], condicoesMinimas: 2,
  };
  if (nivel === 4) return {
    ...base, modo: "classificar-propriedades", figuras: [quadrado], resposta: "quadrado-e-retangulo",
    opcoes: options("quadrado-e-retangulo", "Quadrado e também retângulo", [
      { value: "so-quadrado", label: "Só quadrado", misconception: PoligonosMisconception.CONFUNDE_CLASSE },
      { value: "so-retangulo", label: "Só retângulo", misconception: PoligonosMisconception.CONFUNDE_CLASSE },
      { value: "triangulo", label: "Triângulo", misconception: PoligonosMisconception.CONTA_LADOS_ERRADO },
    ]),
    incluiNaoExemploAberto: false, classificacaoPorPropriedades: true, quadradoTambemRetangulo: true, construcao: false,
    condicoes: ["4 lados", "4 ângulos retos", "lados opostos paralelos"], condicoesMinimas: 2,
  };
  return {
    ...base, modo: "construir-classificar", figuras: [quadrado, quadrilatero, triangulo], resposta: 4,
    opcoes: options(4, "Construir com 4 lados", [
      { value: 3, label: "Construir com 3 lados", misconception: PoligonosMisconception.CONTA_LADOS_ERRADO },
      { value: 5, label: "Construir com 5 lados", misconception: PoligonosMisconception.CONFUNDE_CLASSE },
      { value: 0, label: "Deixar a figura aberta", misconception: PoligonosMisconception.NAO_FECHA },
    ]),
    incluiNaoExemploAberto: true, classificacaoPorPropriedades: true, quadradoTambemRetangulo: true, construcao: true,
    condicoes: ["figura fechada", "4 lados retos", "4 ângulos retos"], condicoesMinimas: 2,
  };
}

export function construirPoligonosResolucao(spec: PoligonosF79Spec): ResolucaoDeclarativa<PoligonosShow, string | number, PoligonosMisconceptionTag> {
  const figura = spec.figuras[0];
  return {
    estadoInicial: { figura },
    passos: [
      { id: "fechar-contorno", say: "Primeiro confira se o contorno fecha e se todos os lados são retos.", show: { figura, destacarFechamento: true }, corrige: [PoligonosMisconception.NAO_FECHA], parcial: spec.resposta },
      { id: "contar-lados", say: "Agora percorra o contorno uma vez e conte cada lado sem repetir nenhum.", show: { figura, destacarFechamento: true, contarLados: true }, corrige: [PoligonosMisconception.CONTA_LADOS_ERRADO], parcial: spec.resposta },
      { id: "comparar-propriedades", say: spec.quadradoTambemRetangulo ? "Uma figura pode pertencer a mais de uma classe: todo quadrado satisfaz as propriedades de um retângulo." : "Use as propriedades, não a aparência ou a orientação, para escolher a classe.", show: { figura, contarLados: true, mostrarClasses: spec.quadradoTambemRetangulo ? ["quadrado", "retângulo"] : undefined, condicoes: spec.condicoes }, corrige: [PoligonosMisconception.CONFUNDE_CLASSE], parcial: spec.resposta },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.07 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirPoligonosQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GE.07") throw new Error(`poligonosContract recebeu ${ficha.id}.`);
  const spec = construirPoligonosSpec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.07 sem micro L${spec.nivel}.`);
  const prompt = spec.modo === "identificar-poligono" ? "A figura fechada com lados retos é um polígono?"
    : spec.modo === "triangulos" ? "Qual classe tem exatamente três lados?"
    : spec.modo === "quadrilateros" ? "Qual classe tem quatro lados?"
    : spec.modo === "classificar-propriedades" ? "Um quadrado também pertence a qual classe pelas suas propriedades?"
    : "Construa uma figura fechada que satisfaça as condições do cartão.";
  const options: Option[] = spec.opcoes;
  return { kind: "poligonos-f79", prompt, audioPrompt: prompt, howto: ficha.howto, explain: ficha.explain, tutorial: normalizeFichaTutorial(micro.params.tutorial), resolucao: construirPoligonosResolucao(spec), masteryRule: mastery(ficha, spec.nivel), uiProps: spec, options, answer: spec.resposta, evaluate: answer => String(answer) === String(spec.resposta) };
}
