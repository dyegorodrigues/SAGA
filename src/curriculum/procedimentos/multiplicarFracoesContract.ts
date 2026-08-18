import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import { Evidencia } from "../../constants/evidencias";
import { MultiplicarFracoesMisconception, type MultiplicarFracoesMisconceptionTag } from "../../constants/multiplicarFracoesMisconceptions";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export { MultiplicarFracoesMisconception };
export type { MultiplicarFracoesMisconceptionTag };

export type MultiplicarFracoesF86Modo =
  | "fracao-inteiro"
  | "fracao-inteiro-modelo"
  | "fracao-fracao-area"
  | "fracao-fracao-simbolico"
  | "divisao-fracoes";

export interface MultiplicarFracoesF86Spec {
  ficha: "F86";
  nivel: number;
  modo: MultiplicarFracoesF86Modo;
  primitiva: "ArrayGrid";
  visualizacao: "área";
  rows: number;
  cols: number;
  activeCells: number[];
  expressao: string;
  leitura: string;
  fatorA: string;
  fatorB: string;
  resposta: string | number;
  respostaLabel: string;
  mostrarIntersecao: boolean;
  acessibilidade: {
    toqueAlternativo: true;
    semArrastoObrigatorio: true;
    alvoMinPx: 80;
    erroMotorNaoTag: true;
  };
}

interface MultiplicarFracoesF86Show {
  expressao: string;
  leitura?: string;
  linhas?: number;
  colunas?: number;
  intersecao?: number;
  regra?: string;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const acessibilidade = {
  toqueAlternativo: true as const,
  semArrastoObrigatorio: true as const,
  alvoMinPx: 80 as const,
  erroMotorNaoTag: true as const,
};
const cells = (n: number) => Array.from({ length: Math.max(0, n) }, (_, index) => index);

export function construirMultiplicarFracoesF86Spec(level: number): MultiplicarFracoesF86Spec {
  const nivel = clamp(level);
  if (nivel === 1) return {
    ficha: "F86", nivel, modo: "fracao-inteiro", primitiva: "ArrayGrid", visualizacao: "área",
    rows: 2, cols: 4, activeCells: cells(4), expressao: "1/2 × 8", leitura: "metade de oito",
    fatorA: "1/2", fatorB: "8", resposta: 4, respostaLabel: "4", mostrarIntersecao: true, acessibilidade,
  };
  if (nivel === 2) return {
    ficha: "F86", nivel, modo: "fracao-inteiro-modelo", primitiva: "ArrayGrid", visualizacao: "área",
    rows: 3, cols: 4, activeCells: cells(8), expressao: "2/3 × 12", leitura: "dois terços de doze",
    fatorA: "2/3", fatorB: "12", resposta: 8, respostaLabel: "8", mostrarIntersecao: true, acessibilidade,
  };
  if (nivel === 3) return {
    ficha: "F86", nivel, modo: "fracao-fracao-area", primitiva: "ArrayGrid", visualizacao: "área",
    rows: 2, cols: 4, activeCells: cells(3), expressao: "1/2 × 3/4", leitura: "metade de três quartos",
    fatorA: "1/2", fatorB: "3/4", resposta: "3/8", respostaLabel: "3/8", mostrarIntersecao: true, acessibilidade,
  };
  if (nivel === 4) return {
    ficha: "F86", nivel, modo: "fracao-fracao-simbolico", primitiva: "ArrayGrid", visualizacao: "área",
    rows: 3, cols: 5, activeCells: [], expressao: "2/3 × 3/5", leitura: "dois terços de três quintos",
    fatorA: "2/3", fatorB: "3/5", resposta: "2/5", respostaLabel: "2/5", mostrarIntersecao: false, acessibilidade,
  };
  return {
    ficha: "F86", nivel, modo: "divisao-fracoes", primitiva: "ArrayGrid", visualizacao: "área",
    rows: 2, cols: 4, activeCells: cells(8), expressao: "2 ÷ 1/4", leitura: "quantos quartos cabem em dois inteiros",
    fatorA: "2", fatorB: "1/4", resposta: 8, respostaLabel: "8", mostrarIntersecao: true, acessibilidade,
  };
}

export function evidenciasMultiplicarFracoesF86(spec: MultiplicarFracoesF86Spec, correta: boolean): string[] {
  if (!correta || spec.modo !== "fracao-fracao-area") return [];
  return [Evidencia.FRACAO_VEZES_FRACAO_F86];
}

export function construirMultiplicarFracoesF86Resolucao(spec: MultiplicarFracoesF86Spec): ResolucaoDeclarativa<MultiplicarFracoesF86Show, string | number, MultiplicarFracoesMisconceptionTag> {
  if (spec.modo === "fracao-inteiro") return {
    estadoInicial: { expressao: spec.expressao, leitura: spec.leitura, linhas: 2, colunas: 4 },
    passos: [
      { id: "ler-de", say: "Leia o sinal de multiplicação como 'de': um meio de oito significa pegar metade de oito.", show: { expressao: spec.expressao, leitura: "metade de oito" }, corrige: [MultiplicarFracoesMisconception.MULTIPLICAR_AUMENTA], parcial: "1/2 de 8" },
      { id: "partir-inteiro", say: "Separe os oito quadrados em duas partes iguais. Cada metade tem quatro quadrados.", show: { expressao: spec.expressao, linhas: 2, colunas: 4, intersecao: 4 }, parcial: spec.resposta },
    ], fallback: 0,
  };
  if (spec.modo === "fracao-inteiro-modelo") return {
    estadoInicial: { expressao: spec.expressao, leitura: spec.leitura, linhas: 3, colunas: 4 },
    passos: [
      { id: "partir-tercos", say: "O modelo de área tem doze quadrados. Divida em três faixas iguais: cada terço tem quatro.", show: { expressao: spec.expressao, linhas: 3, colunas: 4 }, parcial: 4 },
      { id: "tomar-dois-tercos", say: "Pegue duas dessas três partes: dois grupos de quatro formam oito. Multiplicar por dois terços escolhe dois terços do inteiro.", show: { expressao: spec.expressao, linhas: 3, colunas: 4, intersecao: 8 }, corrige: [MultiplicarFracoesMisconception.MULTIPLICAR_AUMENTA], parcial: spec.resposta },
    ], fallback: 0,
  };
  if (spec.modo === "fracao-fracao-area") return {
    estadoInicial: { expressao: spec.expressao, leitura: spec.leitura, linhas: 2, colunas: 4 },
    passos: [
      { id: "cruzar-pinturas", say: "Pinte três quartos numa direção e metade na outra. O produto é a interseção das duas áreas: a parte que recebeu as duas pinturas.", show: { expressao: spec.expressao, linhas: 2, colunas: 4, intersecao: 3 }, parcial: "3 de 8 partes" },
      { id: "nomear-produto", say: "A interseção ocupa três das oito partes iguais do inteiro. Portanto um meio vezes três quartos é três oitavos.", show: { expressao: spec.expressao, intersecao: 3, regra: "numerador × numerador; denominador × denominador" }, corrige: [MultiplicarFracoesMisconception.SOMA_EM_VEZ_DE_MULTIPLICAR], parcial: spec.resposta },
    ], fallback: 0,
  };
  if (spec.modo === "fracao-fracao-simbolico") return {
    estadoInicial: { expressao: spec.expressao, leitura: spec.leitura, linhas: 3, colunas: 5 },
    passos: [
      { id: "multiplicar-partes", say: "Agora o modelo não pinta a resposta. Multiplique numerador por numerador e denominador por denominador: 2×3 sobre 3×5.", show: { expressao: spec.expressao, regra: "2×3 / 3×5 = 6/15" }, corrige: [MultiplicarFracoesMisconception.SOMA_EM_VEZ_DE_MULTIPLICAR], parcial: "6/15" },
      { id: "simplificar", say: "Seis quinze avos representa a mesma quantidade que dois quintos. Simplifique dividindo numerador e denominador por três.", show: { expressao: spec.expressao, regra: "6/15 = 2/5" }, parcial: spec.resposta },
    ], fallback: 0,
  };
  return {
    estadoInicial: { expressao: spec.expressao, leitura: spec.leitura, linhas: 2, colunas: 4 },
    passos: [
      { id: "perguntar-quantos-cabem", say: "Dividir por uma fração pergunta quantas partes desse tamanho cabem na quantidade. Em cada inteiro cabem quatro quartos.", show: { expressao: spec.expressao, linhas: 2, colunas: 4, regra: "1 inteiro = 4 quartos" }, corrige: [MultiplicarFracoesMisconception.DIVIDIR_DIMINUI], parcial: 4 },
      { id: "contar-nos-dois", say: "Em dois inteiros cabem oito quartos. Dividir por um quarto aumenta o número de grupos porque cada grupo é menor que um inteiro.", show: { expressao: spec.expressao, intersecao: 8, regra: "2 ÷ 1/4 = 8" }, parcial: spec.resposta },
    ], fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === id);
  if (!micro) throw new Error(`N5.05 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

function opcoes(spec: MultiplicarFracoesF86Spec): Option[] {
  if (spec.nivel === 1) return [
    { value: 4, label: "4" },
    { value: 16, label: "16", misconception: MultiplicarFracoesMisconception.MULTIPLICAR_AUMENTA },
    { value: 8, label: "8" },
  ];
  if (spec.nivel === 2) return [
    { value: 8, label: "8" },
    { value: 18, label: "18", misconception: MultiplicarFracoesMisconception.MULTIPLICAR_AUMENTA },
    { value: 6, label: "6" },
  ];
  if (spec.nivel === 3) return [
    { value: "3/8", label: "3/8" },
    { value: "4/6", label: "4/6", misconception: MultiplicarFracoesMisconception.SOMA_EM_VEZ_DE_MULTIPLICAR },
    { value: "3/4", label: "3/4" },
  ];
  if (spec.nivel === 4) return [
    { value: "2/5", label: "2/5" },
    { value: "5/8", label: "5/8", misconception: MultiplicarFracoesMisconception.SOMA_EM_VEZ_DE_MULTIPLICAR },
    { value: "6/15", label: "6/15" },
  ];
  return [
    { value: 8, label: "8" },
    { value: "1/2", label: "1/2", misconception: MultiplicarFracoesMisconception.DIVIDIR_DIMINUI },
    { value: 2, label: "2" },
  ];
}

export function construirMultiplicarFracoesQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N5.05") throw new Error(`multiplicarFracoesContract recebeu ${ficha.id}.`);
  const spec = construirMultiplicarFracoesF86Spec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === id);
  if (!micro) throw new Error(`N5.05 sem micro L${spec.nivel}.`);

  const prompt = spec.modo === "fracao-inteiro"
    ? "Quanto é metade de 8? Leia como 1/2 × 8."
    : spec.modo === "fracao-inteiro-modelo"
      ? "Quanto são 2/3 de 12? Use o modelo de área."
      : spec.modo === "fracao-fracao-area"
        ? "Qual fração fica na interseção de 1/2 com 3/4?"
        : spec.modo === "fracao-fracao-simbolico"
          ? "Calcule 2/3 × 3/5 e simplifique."
          : "Quantos grupos de 1/4 cabem em 2 inteiros?";

  return {
    kind: "multiplicar-fracoes-f86",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirMultiplicarFracoesF86Resolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options: opcoes(spec),
    answer: spec.resposta,
    exigeEvidencia: micro.dominio.exige?.evidencia,
    evaluate: answer => String(answer) === String(spec.resposta),
  };
}
