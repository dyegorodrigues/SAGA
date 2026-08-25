import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import { Evidencia } from "../../constants/evidencias";
import { VolumePrismasMisconception, type VolumePrismasMisconceptionTag } from "../../constants/volumePrismasMisconceptions";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export { VolumePrismasMisconception };
export type { VolumePrismasMisconceptionTag };

export type VolumePrismasF94Modo =
  | "contar-cubos"
  | "camada-multiplicar"
  | "formula"
  | "dimensao-faltante"
  | "prisma-nao-retangular";

export interface VolumePrismasF94Spec {
  ficha: "F94";
  nivel: number;
  modo: VolumePrismasF94Modo;
  primitivas: ["ArrayGrid"];
  visualizacao: "3D";
  baseRows: number;
  baseCols: number;
  baseCells: number[][];
  altura: number;
  areaBase: number;
  volume: number;
  unidade: "cm³";
  resposta: string;
  respostaLabel: string;
  dimensaoFaltante?: "altura";
  acessibilidade: {
    toqueAlternativo: true;
    semArrastoObrigatorio: true;
    alvoMinPx: 80;
    erroMotorNaoTag: true;
  };
}

interface VolumePrismasF94Show {
  areaBase?: number;
  altura?: number;
  camadas?: number;
  volume?: number;
  formula?: string;
  decomporBase?: boolean;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const acessibilidade = {
  toqueAlternativo: true as const,
  semArrastoObrigatorio: true as const,
  alvoMinPx: 80 as const,
  erroMotorNaoTag: true as const,
};

const retangular = (rows: number, cols: number) => Array.from({ length: rows }, () => Array.from({ length: cols }, () => 1));

export function construirVolumePrismasF94Spec(level: number): VolumePrismasF94Spec {
  const nivel = clamp(level);
  if (nivel === 1) return { ficha: "F94", nivel, modo: "contar-cubos", primitivas: ["ArrayGrid"], visualizacao: "3D", baseRows: 2, baseCols: 2, baseCells: retangular(2, 2), altura: 2, areaBase: 4, volume: 8, unidade: "cm³", resposta: "8-cm3", respostaLabel: "8 cm³", acessibilidade };
  if (nivel === 2) return { ficha: "F94", nivel, modo: "camada-multiplicar", primitivas: ["ArrayGrid"], visualizacao: "3D", baseRows: 3, baseCols: 4, baseCells: retangular(3, 4), altura: 3, areaBase: 12, volume: 36, unidade: "cm³", resposta: "36-cm3", respostaLabel: "36 cm³", acessibilidade };
  if (nivel === 3) return { ficha: "F94", nivel, modo: "formula", primitivas: ["ArrayGrid"], visualizacao: "3D", baseRows: 2, baseCols: 5, baseCells: retangular(2, 5), altura: 4, areaBase: 10, volume: 40, unidade: "cm³", resposta: "40-cm3", respostaLabel: "40 cm³", acessibilidade };
  if (nivel === 4) return { ficha: "F94", nivel, modo: "dimensao-faltante", primitivas: ["ArrayGrid"], visualizacao: "3D", baseRows: 3, baseCols: 4, baseCells: retangular(3, 4), altura: 3, areaBase: 12, volume: 36, unidade: "cm³", resposta: "3-altura", respostaLabel: "3 unidades de altura", dimensaoFaltante: "altura", acessibilidade };
  return { ficha: "F94", nivel, modo: "prisma-nao-retangular", primitivas: ["ArrayGrid"], visualizacao: "3D", baseRows: 3, baseCols: 3, baseCells: [[1, 1, 1], [1, 0, 0], [1, 0, 0]], altura: 3, areaBase: 5, volume: 15, unidade: "cm³", resposta: "15-cm3", respostaLabel: "15 cm³", acessibilidade };
}

export function alturasVisiveisVolumePrismasF94(spec: VolumePrismasF94Spec, camadas: number): number[][] {
  const preenchidas = Math.max(0, Math.min(spec.altura, Math.floor(camadas)));
  return spec.baseCells.map(row => row.map(cell => cell ? preenchidas : 0));
}

/** O que a criança precisa ter construído antes de a resposta valer. */
export type ConstrucaoExigidaF94 = "cubos" | "camadas" | "nenhuma";

export function construcaoExigidaVolumePrismasF94(spec: VolumePrismasF94Spec): ConstrucaoExigidaF94 {
  if (spec.modo === "contar-cubos") return "cubos";
  // L4 mostra só a base de propósito: a altura é o que se pergunta, e empilhar
  // camadas até fechar o volume entregaria a resposta na tela.
  if (spec.modo === "dimensao-faltante") return "nenhuma";
  return "camadas";
}

export function construcaoCompletaVolumePrismasF94(
  spec: VolumePrismasF94Spec,
  construido: { cubos: number; camadas: number },
): boolean {
  const exigida = construcaoExigidaVolumePrismasF94(spec);
  if (exigida === "nenhuma") return true;
  if (exigida === "cubos") return construido.cubos >= spec.volume;
  return construido.camadas >= spec.altura;
}

export function evidenciasVolumePrismasF94(spec: VolumePrismasF94Spec, correta: boolean): string[] {
  if (!correta || spec.modo !== "dimensao-faltante") return [];
  return [Evidencia.DIMENSAO_FALTANTE_F94];
}

export function construirVolumePrismasF94Resolucao(spec: VolumePrismasF94Spec): ResolucaoDeclarativa<VolumePrismasF94Show, string, VolumePrismasMisconceptionTag> {
  const introducao = spec.modo === "contar-cubos"
    ? "Preencha o prisma com cubos unitários. Cada cubo ocupa uma unidade cúbica de espaço."
    : spec.modo === "prisma-nao-retangular"
      ? "Mesmo com uma base que não é retangular, conte quantos cubos há em UMA camada e repita camadas idênticas."
      : "Comece por uma camada: ela mostra a área da base em cubos unitários.";

  return {
    estadoInicial: { areaBase: spec.areaBase, altura: spec.altura, camadas: 0 },
    passos: [
      {
        id: "construir-camada",
        say: introducao,
        show: { areaBase: spec.areaBase, camadas: 1, decomporBase: spec.modo === "prisma-nao-retangular" },
        corrige: [VolumePrismasMisconception.CONFUNDE_COM_AREA],
        parcial: `${spec.areaBase}-por-camada`,
      },
      {
        id: "repetir-camadas",
        say: `A base tem ${spec.areaBase} cubos por camada e a altura forma ${spec.altura} camadas idênticas. Não some as dimensões: repita a camada ${spec.altura} vezes.`,
        show: { areaBase: spec.areaBase, altura: spec.altura, camadas: spec.altura },
        corrige: [VolumePrismasMisconception.SOMA_DIMENSOES],
        parcial: `${spec.areaBase}x${spec.altura}`,
      },
      ...(spec.modo === "dimensao-faltante" ? [{
        id: "isolar-dimensao",
        say: `O volume é ${spec.volume} cm³ e a base tem área ${spec.areaBase}. Divida o volume pela área da base: ${spec.volume} ÷ ${spec.areaBase} = ${spec.altura}. Essa é a altura faltante.`,
        show: { areaBase: spec.areaBase, altura: spec.altura, volume: spec.volume, formula: "altura = volume ÷ área da base" },
        parcial: spec.resposta,
      }] : [{
        id: "calcular-volume",
        say: `Multiplique área da base pela altura: ${spec.areaBase} × ${spec.altura} = ${spec.volume}. Como estamos contando cubos, a unidade é cúbica: ${spec.volume} cm³.`,
        show: { areaBase: spec.areaBase, altura: spec.altura, volume: spec.volume, formula: "V = área da base × altura" },
        corrige: [VolumePrismasMisconception.IGNORA_UNIDADE_CUBICA],
        parcial: spec.resposta,
      }]),
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === id);
  if (!micro) throw new Error(`GM.11 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

function opcoes(spec: VolumePrismasF94Spec): Option[] {
  if (spec.modo === "dimensao-faltante") return [
    { value: spec.resposta, label: spec.respostaLabel },
    { value: `${spec.volume + spec.areaBase}-altura`, label: `${spec.volume + spec.areaBase} unidades`, misconception: VolumePrismasMisconception.SOMA_DIMENSOES },
    { value: `${spec.areaBase}-altura`, label: `${spec.areaBase} unidades`, misconception: VolumePrismasMisconception.CONFUNDE_COM_AREA },
    { value: `${spec.altura}-cm3`, label: `${spec.altura} cm³`, misconception: VolumePrismasMisconception.IGNORA_UNIDADE_CUBICA },
  ];
  return [
    { value: spec.resposta, label: spec.respostaLabel },
    { value: `${spec.baseRows + spec.baseCols + spec.altura}-cm3`, label: `${spec.baseRows + spec.baseCols + spec.altura} cm³`, misconception: VolumePrismasMisconception.SOMA_DIMENSOES },
    { value: `${spec.areaBase}-cm2`, label: `${spec.areaBase} cm²`, misconception: VolumePrismasMisconception.CONFUNDE_COM_AREA },
    { value: `${spec.volume}-cm2`, label: `${spec.volume} cm²`, misconception: VolumePrismasMisconception.IGNORA_UNIDADE_CUBICA },
  ];
}

export function construirVolumePrismasQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GM.11") throw new Error(`volumePrismasContract recebeu ${ficha.id}.`);
  const spec = construirVolumePrismasF94Spec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === id);
  if (!micro) throw new Error(`GM.11 sem micro L${spec.nivel}.`);

  const prompt = spec.modo === "contar-cubos"
    ? "Preencha o prisma com cubos unitários e descubra seu volume."
    : spec.modo === "camada-multiplicar"
      ? "Descubra quantos cubos há em uma camada e use as camadas para encontrar o volume."
      : spec.modo === "formula"
        ? "Use a área da base e a altura para encontrar o volume do prisma."
        : spec.modo === "dimensao-faltante"
          ? `O volume é ${spec.volume} cm³ e a área da base é ${spec.areaBase}. Qual é a altura que falta?`
          : "A base tem formato de L. Conte uma camada e use as camadas idênticas para encontrar o volume.";

  return {
    kind: "volume-prismas-f94",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirVolumePrismasF94Resolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options: opcoes(spec),
    answer: spec.resposta,
    exigeEvidencia: micro.dominio.exige?.evidencia,
    evaluate: answer => String(answer) === spec.resposta,
  };
}
