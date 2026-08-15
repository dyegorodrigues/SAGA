import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const AreaF81Misconception = {
  CONFUNDE_PERIMETRO: "confunde-perimetro",
  CONTA_UM_A_UM: "conta-um-a-um",
  IGNORA_UNIDADE: "ignora-unidade",
} as const;
export type AreaF81MisconceptionTag = typeof AreaF81Misconception[keyof typeof AreaF81Misconception];
export type AreaF81Modo = "contar-quadrados" | "linhas-colunas" | "formula" | "area-vs-perimetro" | "compor-areas";

export interface AreaF81Regiao { rows: number; cols: number }
export interface AreaF81Spec {
  nivel: number;
  modo: AreaF81Modo;
  rows: number;
  cols: number;
  regioes: AreaF81Regiao[];
  area: number;
  perimetro: number;
  unidade: "cm²";
  resposta: number;
  opcoes: Array<{ value: number; label: string; misconception?: AreaF81MisconceptionTag }>;
}

interface AreaF81Show {
  rows: number;
  cols: number;
  regioes: AreaF81Regiao[];
  unidade: "cm²";
  destacarInterior?: boolean;
  destacarBorda?: boolean;
  destacarLinhasColunas?: boolean;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const areaDe = (regioes: AreaF81Regiao[]) => regioes.reduce((sum, r) => sum + r.rows * r.cols, 0);
const rotulo = (valor: number) => `${valor} cm²`;
function opcoes(correta: number, erradas: Array<{ value: number; misconception: AreaF81MisconceptionTag }>): AreaF81Spec["opcoes"] {
  return [{ value: correta, label: rotulo(correta) }, ...erradas.map(item => ({ ...item, label: rotulo(item.value) }))]
    .filter((item, index, all) => all.findIndex(other => other.value === item.value) === index)
    .slice(0, 4);
}

export function construirAreaF81Spec(level: number): AreaF81Spec {
  const nivel = clamp(level);
  if (nivel === 1) {
    const regioes = [{ rows: 3, cols: 4 }]; const area = areaDe(regioes);
    return { nivel, modo: "contar-quadrados", rows: 3, cols: 4, regioes, area, perimetro: 14, unidade: "cm²", resposta: area, opcoes: opcoes(area, [{ value: 7, misconception: AreaF81Misconception.CONTA_UM_A_UM }, { value: 14, misconception: AreaF81Misconception.CONFUNDE_PERIMETRO }]) };
  }
  if (nivel === 2) {
    const regioes = [{ rows: 4, cols: 6 }]; const area = areaDe(regioes);
    return { nivel, modo: "linhas-colunas", rows: 4, cols: 6, regioes, area, perimetro: 20, unidade: "cm²", resposta: area, opcoes: opcoes(area, [{ value: 10, misconception: AreaF81Misconception.CONTA_UM_A_UM }, { value: 20, misconception: AreaF81Misconception.CONFUNDE_PERIMETRO }]) };
  }
  if (nivel === 3) {
    const regioes = [{ rows: 5, cols: 7 }]; const area = areaDe(regioes);
    return { nivel, modo: "formula", rows: 5, cols: 7, regioes, area, perimetro: 24, unidade: "cm²", resposta: area, opcoes: opcoes(area, [{ value: 12, misconception: AreaF81Misconception.CONTA_UM_A_UM }, { value: 24, misconception: AreaF81Misconception.CONFUNDE_PERIMETRO }]) };
  }
  if (nivel === 4) {
    const regioes = [{ rows: 3, cols: 5 }]; const area = areaDe(regioes);
    return { nivel, modo: "area-vs-perimetro", rows: 3, cols: 5, regioes, area, perimetro: 16, unidade: "cm²", resposta: area, opcoes: opcoes(area, [{ value: 16, misconception: AreaF81Misconception.CONFUNDE_PERIMETRO }, { value: 8, misconception: AreaF81Misconception.IGNORA_UNIDADE }]) };
  }
  const regioes = [{ rows: 3, cols: 4 }, { rows: 2, cols: 4 }]; const area = areaDe(regioes);
  return { nivel, modo: "compor-areas", rows: 5, cols: 4, regioes, area, perimetro: 18, unidade: "cm²", resposta: area, opcoes: opcoes(area, [{ value: 12, misconception: AreaF81Misconception.CONTA_UM_A_UM }, { value: 18, misconception: AreaF81Misconception.CONFUNDE_PERIMETRO }]) };
}

export function construirAreaF81Resolucao(spec: AreaF81Spec): ResolucaoDeclarativa<AreaF81Show, number, AreaF81MisconceptionTag> {
  const base: AreaF81Show = { rows: spec.rows, cols: spec.cols, regioes: spec.regioes, unidade: spec.unidade };
  const primeiraParcial = spec.modo === "compor-areas" ? spec.regioes[0].rows * spec.regioes[0].cols : spec.cols;
  return {
    estadoInicial: base,
    passos: [
      { id: "ver-o-chao", say: "Área mede o chão preenchido. Primeiro veja os quadradinhos por dentro.", show: { ...base, destacarInterior: true }, corrige: [AreaF81Misconception.CONFUNDE_PERIMETRO], parcial: primeiraParcial },
      { id: "organizar-em-linhas", say: "Agora organize o preenchimento em linhas e colunas. Multiplicar evita contar um a um.", show: { ...base, destacarLinhasColunas: true }, corrige: [AreaF81Misconception.CONTA_UM_A_UM], parcial: spec.resposta },
      { id: "nomear-a-medida", say: "Como medimos quadradinhos, a unidade também é quadrada: centímetros quadrados, cm².", show: { ...base, destacarInterior: true }, corrige: [AreaF81Misconception.IGNORA_UNIDADE], parcial: spec.resposta },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === id);
  if (!micro) throw new Error(`GM.08 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirAreaF81Question(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GM.08") throw new Error(`areaF81Contract recebeu ${ficha.id}.`);
  const spec = construirAreaF81Spec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === id);
  if (!micro) throw new Error(`GM.08 sem micro L${spec.nivel}.`);
  const prompt = spec.modo === "contar-quadrados" ? "Quantos centímetros quadrados preenchem a figura?" : spec.modo === "linhas-colunas" ? "Use linhas × colunas. Qual é a área?" : spec.modo === "formula" ? "Qual é a área do retângulo?" : spec.modo === "area-vs-perimetro" ? "Qual número mede o chão, e não a volta?" : "Some as áreas das duas partes. Qual é a área total?";
  const options: Option[] = spec.opcoes;
  return {
    kind: "area-f81",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirAreaF81Resolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => Number(answer) === spec.resposta,
  };
}
