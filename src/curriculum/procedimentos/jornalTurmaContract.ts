import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const JornalTurmaMisconception = {
  IGNORA_ESCALA: "ignora-escala",
  BARRA_ERRADA: "barra-errada",
  CONFUNDE_POSSIVEL_PROVAVEL: "confunde-possivel-provavel",
} as const;
export type JornalTurmaMisconceptionTag = typeof JornalTurmaMisconception[keyof typeof JornalTurmaMisconception];
export type JornalTurmaModo = "ler-barra" | "comparar-barras" | "completar-barra" | "construir-grafico" | "probabilidade";

export interface JornalTurmaF64Spec {
  nivel: number;
  modo: JornalTurmaModo;
  categorias: string[];
  /** O dado da pesquisa. É o que a coluna "Tabela" mostra. */
  tabela: number[];
  /** A altura desenhada de cada barra. Difere da tabela onde a barra falta. */
  valores: number[];
  escala: number;
  /** A categoria sobre a qual o enunciado pergunta. */
  perguntada: string;
  resposta: string | number;
  opcoes: Array<{ value: string | number; label: string; misconception?: JornalTurmaMisconceptionTag }>;
}

interface JornalTurmaShow { categorias: string[]; valores: number[]; escala: number; destacarEscala?: boolean }
const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
function opts(correta: string | number, erradas: Array<{ value: string | number; misconception: JornalTurmaMisconceptionTag }>): JornalTurmaF64Spec["opcoes"] {
  return [{ value: correta, label: String(correta) }, ...erradas.map(x => ({ ...x, label: String(x.value) }))]
    .filter((x, i, a) => a.findIndex(y => y.value === x.value) === i)
    .slice(0, 4);
}

/**
 * CLASS-003 — a pesquisa da turma é sorteada, a escada não.
 *
 * Era uma pesquisa só: Livros/Jogos/Música com os mesmos votos em todo nível e
 * "Jogos" sempre a barra perguntada. As respostas certas eram 8, "Jogos", 7, 9
 * e "azul", nessa ordem, para sempre — cinco rótulos decorados venciam a
 * competência inteira.
 *
 * O que continua fixo é o degrau: o modo do nível e a sua escala. Ler uma
 * barra com escala 2, comparar barras, completar a que falta, construir com
 * escala 3, e por fim ler probabilidade. Sortear a escala mudaria o que o
 * nível ensina; sortear a pesquisa só tira o gabarito da memória.
 */
const TEMAS: readonly (readonly [string, string, string])[] = [
  ["Livros", "Jogos", "Música"],
  ["Futebol", "Vôlei", "Natação"],
  ["Cachorro", "Gato", "Peixe"],
  ["Pizza", "Salada", "Sopa"],
  ["Praia", "Campo", "Cidade"],
  ["Verão", "Outono", "Inverno"],
];
const SACOS: readonly (readonly [string, string, string])[] = [
  ["azul", "verde", "amarela"],
  ["vermelha", "branca", "preta"],
  ["roxa", "laranja", "rosa"],
  ["dourada", "prateada", "marrom"],
];

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const escolher = <T,>(itens: readonly T[]): T => itens[Math.floor(Math.random() * itens.length)];

/**
 * Três valores distintos, todos múltiplos da escala.
 *
 * Distintos porque a maior barra precisa ser única: com empate, "qual tem
 * mais" passa a ter duas respostas certas e um dos distratores vira gabarito.
 */
function sortearValores(escala: number, maximoEmMarcas: number): number[] {
  const valores = new Set<number>();
  while (valores.size < 3) valores.add(ri(1, maximoEmMarcas) * escala);
  return [...valores];
}

/**
 * O par de distratores de um nível que responde por NÚMERO.
 *
 * `ignoraEscala` é a criança que conta as marcas e entrega a contagem em vez
 * do valor; `barraErrada` é a que lê a altura da barra vizinha. Os dois
 * precisam ser distintos entre si e da resposta — `opts` deduplica por valor, e
 * uma colisão apagaria silenciosamente um dos dois erros que a ficha nomeia.
 */
function distratoresNumericos(resposta: number, outros: number[], ignoraEscala: number): Array<{ value: number; misconception: JornalTurmaMisconceptionTag }> | null {
  const barraErrada = outros.find(valor => valor !== ignoraEscala && valor !== resposta);
  if (barraErrada === undefined || ignoraEscala === resposta) return null;
  return [
    { value: ignoraEscala, misconception: JornalTurmaMisconception.IGNORA_ESCALA },
    { value: barraErrada, misconception: JornalTurmaMisconception.BARRA_ERRADA },
  ];
}

export function construirJornalTurmaSpec(level: number): JornalTurmaF64Spec {
  const nivel = clamp(level);

  // Níveis que respondem por CATEGORIA: a perguntada é a de maior valor, e os
  // distratores são as outras duas — o erro aqui é escolher a barra errada.
  if (nivel === 2 || nivel === 5) {
    const categorias = [...(nivel === 2 ? escolher(TEMAS) : escolher(SACOS))];
    const escala = nivel === 2 ? 2 : 1;
    const tabela = sortearValores(escala, nivel === 2 ? 8 : 9);
    const iMaior = tabela.indexOf(Math.max(...tabela));
    const perguntada = categorias[iMaior];
    const outras = categorias.filter(categoria => categoria !== perguntada);
    // Em comparar-barras os dois erros ficam nomeados separados — ler a barra
    // vizinha e ler a altura sem converter pela escala levam a categorias
    // diferentes. Em probabilidade os dois são o mesmo engano: confundir o que
    // é possível com o que é mais provável.
    const erradas: Array<{ value: string; misconception: JornalTurmaMisconceptionTag }> = nivel === 2
      ? [
        { value: outras[0], misconception: JornalTurmaMisconception.BARRA_ERRADA },
        { value: outras[1], misconception: JornalTurmaMisconception.IGNORA_ESCALA },
      ]
      : outras.map(categoria => ({ value: categoria, misconception: JornalTurmaMisconception.CONFUNDE_POSSIVEL_PROVAVEL }));
    return {
      nivel, modo: nivel === 2 ? "comparar-barras" : "probabilidade",
      categorias, tabela, valores: tabela, escala, perguntada,
      resposta: perguntada, opcoes: opts(perguntada, erradas),
    };
  }

  const categorias = [...escolher(TEMAS)];
  const escala = nivel === 1 ? 2 : nivel === 3 ? 1 : 3;
  // O sorteio pode cair num trio em que o distrator de escala coincide com uma
  // barra vizinha. Em vez de remendar o valor depois, o caso é recusado na
  // origem e outro é sorteado: remendar deslocaria o valor para fora da tabela
  // desenhada, e o distrator deixaria de descrever um erro possível.
  for (let tentativa = 0; tentativa < 40; tentativa += 1) {
    const tabela = sortearValores(escala, nivel === 1 ? 8 : nivel === 3 ? 12 : 5);
    const iPerguntada = ri(0, 2);
    const resposta = tabela[iPerguntada];
    const outros = tabela.filter((_, i) => i !== iPerguntada);
    // Em L3 a escala é 1 e não há marca a converter: quem "ignora a escala"
    // dobra o dado. Nos outros, entrega a contagem de marcas.
    const ignoraEscala = nivel === 3 ? resposta * 2 : resposta / escala;
    const erradas = distratoresNumericos(resposta, outros, ignoraEscala);
    if (!erradas) continue;
    const valores = nivel === 3 ? tabela.map((valor, i) => (i === iPerguntada ? 0 : valor)) : tabela;
    return {
      nivel, modo: nivel === 1 ? "ler-barra" : nivel === 3 ? "completar-barra" : "construir-grafico",
      categorias, tabela, valores, escala, perguntada: categorias[iPerguntada],
      resposta, opcoes: opts(resposta, erradas),
    };
  }
  throw new Error(`PE.02 L${nivel}: não achei pesquisa com três alternativas distintas.`);
}

export function construirJornalTurmaResolucao(spec: JornalTurmaF64Spec): ResolucaoDeclarativa<JornalTurmaShow, string | number, JornalTurmaMisconceptionTag> {
  const show = { categorias: spec.categorias, valores: spec.valores, escala: spec.escala, destacarEscala: true };
  return { estadoInicial: show, passos: [
    { id: "ler-eixo", say: "Primeiro confira quanto vale cada marca da escala.", show, corrige: [JornalTurmaMisconception.IGNORA_ESCALA], parcial: spec.resposta },
    { id: "ligar-dado-barra", say: "Depois ligue cada rótulo ao dado e à altura da sua barra.", show, corrige: [JornalTurmaMisconception.BARRA_ERRADA, JornalTurmaMisconception.CONFUNDE_POSSIVEL_PROVAVEL], parcial: spec.resposta },
  ], fallback: 0 };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`PE.02 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirJornalTurmaQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "PE.02") throw new Error(`jornalTurmaContract recebeu ${ficha.id}.`);
  const spec = construirJornalTurmaSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`PE.02 sem micro L${spec.nivel}.`);
  const prompt = spec.modo === "ler-barra" ? `Quantos votos tem ${spec.perguntada}?`
    : spec.modo === "comparar-barras" ? "Qual categoria tem mais votos?"
    : spec.modo === "completar-barra" ? `A tabela diz ${spec.resposta} para ${spec.perguntada}. Até qual valor a barra deve chegar?`
    : spec.modo === "construir-grafico" ? `Qual altura deve ter a barra de ${spec.perguntada}?`
    : "Qual cor é mais provável de sair?";
  const options: Option[] = spec.opcoes;
  return { kind: "jornal-turma-f64", prompt, audioPrompt: prompt, howto: ficha.howto, explain: ficha.explain, tutorial: normalizeFichaTutorial(micro.params.tutorial), resolucao: construirJornalTurmaResolucao(spec), masteryRule: mastery(ficha, spec.nivel), uiProps: spec, options, answer: spec.resposta, evaluate: a => String(a) === String(spec.resposta) };
}
