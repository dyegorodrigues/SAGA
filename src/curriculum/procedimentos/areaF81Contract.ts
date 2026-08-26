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

const MODOS_F81 = ["contar-quadrados", "linhas-colunas", "formula", "area-vs-perimetro", "compor-areas"] as const;
const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

/**
 * CLASS-003 — a região do nível é sorteada, a escada não.
 *
 * Era uma região por nível: 3×4, 4×6, 5×7, 3×5 e o par 3×4+2×4. A ficha cobra
 * repetição, então a criança contava a MESMA malha seis vezes.
 *
 * Duas colisões que as faixas precisam evitar, e ambas transformariam um
 * distrator em resposta certa: área igual ao perímetro (acontece em 3×6, 4×4 e
 * 6×3) alimenta `CONFUNDE_PERIMETRO`, e área igual a linhas + colunas
 * alimentaria `CONTA_UM_A_UM`.
 */
function sortearRegiao(nivel: number): { rows: number; cols: number; regioes: AreaF81Regiao[] } {
  const faixa: [number, number] = nivel <= 2 ? [3, 6] : nivel === 3 ? [4, 8] : [3, 7];
  for (let tentativa = 0; tentativa < 40; tentativa += 1) {
    const cols = ri(faixa[0], faixa[1]);
    const rows = nivel === 5 ? ri(4, 7) : ri(faixa[0], faixa[1]);
    const area = rows * cols;
    if (area === 2 * (rows + cols) || area === rows + cols) continue;
    if (nivel === 5) {
      // Duas faixas empilhadas, mesma largura: a composição preenche o contorno.
      const primeira = ri(2, rows - 2);
      return { rows, cols, regioes: [{ rows: primeira, cols }, { rows: rows - primeira, cols }] };
    }
    return { rows, cols, regioes: [{ rows, cols }] };
  }
  return { rows: 3, cols: 4, regioes: [{ rows: 3, cols: 4 }] };
}

export function construirAreaF81Spec(level: number): AreaF81Spec {
  const nivel = clamp(level);
  const { rows, cols, regioes } = sortearRegiao(nivel);
  const area = areaDe(regioes);
  const perimetro = 2 * (rows + cols);
  const contouUmAUm = rows + cols;
  const erradas = nivel === 4
    ? [
        { value: perimetro, misconception: AreaF81Misconception.CONFUNDE_PERIMETRO },
        { value: contouUmAUm, misconception: AreaF81Misconception.IGNORA_UNIDADE },
      ]
    : [
        { value: contouUmAUm, misconception: AreaF81Misconception.CONTA_UM_A_UM },
        { value: perimetro, misconception: AreaF81Misconception.CONFUNDE_PERIMETRO },
      ];
  return {
    nivel,
    modo: MODOS_F81[nivel - 1],
    rows,
    cols,
    regioes,
    area,
    perimetro,
    unidade: "cm²",
    resposta: area,
    opcoes: opcoes(area, erradas),
  };
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
