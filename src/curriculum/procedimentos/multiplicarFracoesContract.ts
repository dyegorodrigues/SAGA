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

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const mdc = (a: number, b: number): number => (b === 0 ? a : mdc(b, a % b));
const simplificar = (n: number, d: number) => { const g = mdc(n, d); return `${n / g}/${d / g}`; };
const NOMES = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze"] as const;
const porExtenso = (n: number) => NOMES[n] ?? String(n);
const PARTES: Record<number, string> = { 2: "meios", 3: "terços", 4: "quartos", 5: "quintos", 6: "sextos", 8: "oitavos" };

/**
 * CLASS-003 — a conta do nível é sorteada, a escada não.
 *
 * Era uma conta por nível — 1/2×8, 2/3×12, 1/2×3/4, 2/3×3/5, 2÷1/4 — e com ela
 * a resposta: decorar "4" vencia L1 sem multiplicar nada.
 *
 * A grade não é enfeite: ela É a conta. Em L1 e L2 `rows × cols` é o inteiro e
 * as casas pintadas são a resposta; em L3 e L4 as linhas são o denominador do
 * primeiro fator e as colunas o do segundo, e a interseção é o produto. Sortear
 * os números sem redesenhar a grade faria a figura contradizer a expressão.
 */
export function construirMultiplicarFracoesF86Spec(level: number): MultiplicarFracoesF86Spec {
  const nivel = clamp(level);
  const base = { ficha: "F86" as const, nivel, primitiva: "ArrayGrid" as const, visualizacao: "área" as const, acessibilidade };

  if (nivel === 1 || nivel === 2) {
    // L2 precisa de numerador entre 2 e denominador-1, então o denominador
    // começa em 3. Com denominador 2 a faixa se invertia e saía 2/2 = 1: a
    // resposta virava o próprio inteiro, as três alternativas colapsavam numa
    // e a tela passava a mostrar a resposta.
    const denominador = nivel === 1 ? ri(2, 4) : ri(3, 4);
    const numerador = nivel === 1 ? 1 : ri(2, denominador - 1);
    const cols = ri(3, 5);
    const inteiro = denominador * cols;
    const resposta = inteiro * numerador / denominador;
    const fatorA = `${numerador}/${denominador}`;
    return {
      ...base,
      modo: nivel === 1 ? "fracao-inteiro" : "fracao-inteiro-modelo",
      rows: denominador, cols, activeCells: cells(resposta),
      expressao: `${fatorA} × ${inteiro}`,
      leitura: `${numerador === 1 ? "a metade" : `${porExtenso(numerador)} ${PARTES[denominador] ?? "partes"}`} de ${porExtenso(inteiro)}`,
      fatorA, fatorB: String(inteiro),
      resposta, respostaLabel: String(resposta), mostrarIntersecao: true,
    };
  }

  if (nivel === 3 || nivel === 4) {
    const b = ri(2, 4);
    const d = ri(3, 5);
    const a = ri(1, b - 1);
    const c = ri(1, d - 1);
    const resposta = simplificar(a * c, b * d);
    const fatorA = `${a}/${b}`;
    const fatorB = `${c}/${d}`;
    return {
      ...base,
      modo: nivel === 3 ? "fracao-fracao-area" : "fracao-fracao-simbolico",
      rows: b, cols: d, activeCells: nivel === 3 ? cells(a * c) : [],
      expressao: `${fatorA} × ${fatorB}`,
      leitura: `${a === 1 ? "a metade" : `${porExtenso(a)} ${PARTES[b] ?? "partes"}`} de ${porExtenso(c)} ${PARTES[d] ?? "partes"}`,
      fatorA, fatorB,
      resposta, respostaLabel: resposta, mostrarIntersecao: nivel === 3,
    };
  }

  const inteiros = ri(2, 4);
  const denominador = ri(3, 5);
  const resposta = inteiros * denominador;
  return {
    ...base,
    modo: "divisao-fracoes",
    rows: inteiros, cols: denominador, activeCells: cells(resposta),
    expressao: `${inteiros} ÷ 1/${denominador}`,
    leitura: `quantos ${PARTES[denominador] ?? "partes"} cabem em ${porExtenso(inteiros)} inteiros`,
    fatorA: String(inteiros), fatorB: `1/${denominador}`,
    resposta, respostaLabel: String(resposta), mostrarIntersecao: true,
  };
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

export function evidenciasMultiplicarFracoesF86(spec: MultiplicarFracoesF86Spec, correta: boolean): string[] {
  if (!correta || spec.modo !== "fracao-fracao-area") return [];
  return [Evidencia.FRACAO_VEZES_FRACAO_F86];
}

/**
 * Alternativas derivadas da conta sorteada.
 *
 * Cada distrator continua nomeando o mesmo erro de antes: multiplicar por
 * fração faz crescer, somar em vez de multiplicar, dividir faz diminuir. O que
 * mudou é que agora eles saem dos números da conta, e não de uma lista escrita
 * para cinco contas fixas.
 */
function opcoes(spec: MultiplicarFracoesF86Spec): Option[] {
  const partes = (texto: string) => { const [n, d] = texto.split("/").map(Number); return { n, d: d ?? 1 }; };
  if (spec.nivel === 1 || spec.nivel === 2) {
    const a = partes(spec.fatorA);
    const inteiro = Number(spec.fatorB);
    // Multiplicar por fração faz crescer: usa o inverso da fração.
    const cresceu = inteiro * a.d / a.n;
    const candidatos: Option[] = [
      { value: spec.resposta, label: spec.respostaLabel },
      { value: cresceu, label: String(cresceu), misconception: MultiplicarFracoesMisconception.MULTIPLICAR_AUMENTA },
      { value: inteiro, label: String(inteiro) },
    ];
    return candidatos.filter((item, i, all) => all.findIndex(o => String(o.value) === String(item.value)) === i);
  }
  if (spec.nivel === 3 || spec.nivel === 4) {
    const a = partes(spec.fatorA);
    const b = partes(spec.fatorB);
    const somado = `${a.n + b.n}/${a.d + b.d}`;
    const candidatos: Option[] = [
      { value: spec.resposta, label: spec.respostaLabel },
      { value: somado, label: somado, misconception: MultiplicarFracoesMisconception.SOMA_EM_VEZ_DE_MULTIPLICAR },
      { value: spec.fatorB, label: spec.fatorB },
    ];
    return candidatos.filter((item, i, all) => all.findIndex(o => String(o.value) === String(item.value)) === i);
  }
  const b = partes(spec.fatorB);
  const diminuiu = `${Number(spec.fatorA)}/${b.d}`;
  return [
    { value: spec.resposta, label: spec.respostaLabel },
    { value: diminuiu, label: diminuiu, misconception: MultiplicarFracoesMisconception.DIVIDIR_DIMINUI },
    { value: Number(spec.fatorA), label: spec.fatorA },
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
