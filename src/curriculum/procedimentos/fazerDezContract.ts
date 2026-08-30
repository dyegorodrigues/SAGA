import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

/**
 * F33 / N3.07 — fazer dez.
 *
 * ## A ficha mais importante da faixa F1
 *
 * É aqui que os amigos do dez, aprendidos na N1.11, **deixam de ser exercício e
 * viram ferramenta**. Sem esta estratégia, toda soma acima de dez é contagem
 * nos dedos — pela vida inteira.
 *
 * `8 + 5` vira `8 + 2 + 3`, que vira `10 + 3`, que é 13. São três passos
 * mentais encadeados: saber quanto falta para dez, quebrar a segunda parcela, e
 * somar o resto. É a primeira operação de múltiplos passos do currículo, e é
 * por isso que ela trava.
 *
 * ## Por que a moldura dupla resolve
 *
 * A criança **vê** a primeira moldura fechar e a segunda começar. A quebra da
 * parcela não é abstrata: os objetos literalmente se dividem entre as duas
 * caixas. O "fechou! dez!" é o momento pedagógico central — é a recompensa
 * perceptual que ancora a estratégia, e a criança quer fechar a caixa.
 *
 * ## Os dois erros de um a menos, e por que não são o mesmo
 *
 * `DECOMPOSICAO_ERRADA` e `OFF_BY_ONE` diferem por um em direções opostas, e
 * isso não é acaso da aritmética: quem erra o amigo do dez põe uma peça a mais
 * na primeira caixa e chega a um a MENOS no total; quem sabe a estratégia e
 * escorrega na contagem erra para qualquer lado. Separá-las por direção é o que
 * permite ao Radar distinguir "não sabe os amigos do dez" de "sabe e contou
 * torto" — dois diagnósticos com resgates diferentes.
 */
export const FazerDezMisconception = {
  PAROU_NO_DEZ: "parou-no-dez",
  DECOMPOSICAO_ERRADA: "decomposicao-errada",
  OFF_BY_ONE: "off-by-one",
} as const;
export type FazerDezMisconceptionTag = typeof FazerDezMisconception[keyof typeof FazerDezMisconception];

export type FazerDezModo = "sobra-pouca" | "moldura-e-bandeja" | "sem-decomposicao-escrita" | "so-decomposicao" | "mental";

export interface FazerDezF33Spec {
  nivel: number;
  modo: FazerDezModo;
  /** A parcela que já está na primeira caixa. */
  a: number;
  /** A parcela que vem na bandeja e precisa ser quebrada. */
  b: number;
  /** Quantos faltam para a primeira caixa fechar — o amigo do dez de `a`. */
  faltamParaDez: number;
  /** O que sobra da bandeja depois de fechar a caixa. */
  sobra: number;
  resposta: number;
  /** L1..L3 mostram as duas caixas; do L4 em diante elas somem. */
  mostrarMolduras: boolean;
  /** L3 tira a decomposição escrita; o L4 fica só com ela. */
  mostrarDecomposicao: boolean;
  /** Onde as caixas existem, fechar a primeira é a ação probatória. */
  exigeFecharACaixa: boolean;
  opcoes: Array<{ value: number; label: string; misconception?: FazerDezMisconceptionTag }>;
}

interface FazerDezShow {
  a: number;
  b: number;
  faltamParaDez: number;
  sobra: number;
  preencherAte?: number;
  piscarVazias?: boolean;
  numeral?: number;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

function opcoes(correta: number, erradas: Array<{ value: number; misconception: FazerDezMisconceptionTag }>): FazerDezF33Spec["opcoes"] {
  return [
    { value: correta, label: String(correta) },
    ...erradas.map(x => ({ value: x.value, label: String(x.value), misconception: x.misconception })),
  ]
    .filter((x, i, a) => a.findIndex(y => y.value === x.value) === i)
    .filter(x => x.value > 0)
    .slice(0, 4);
}

export function construirFazerDezSpec(level: number): FazerDezF33Spec {
  const nivel = clamp(level);
  const FM = FazerDezMisconception;

  // A escada é de quanto sobra depois de fechar a caixa. No L1 sobra pouco —
  // `8+3`, `9+2` — porque o terceiro passo ainda é o mais caro. Do L3 em diante
  // qualquer soma até `9+9` entra, e o que muda é o apoio que some.
  const a = nivel === 1 ? ri(7, 9) : nivel === 2 ? ri(6, 9) : ri(5, 9);
  const faltamParaDez = 10 - a;
  const sobra = nivel === 1 ? ri(1, 2) : nivel === 2 ? ri(3, 4) : ri(1, 9 - faltamParaDez);
  const b = faltamParaDez + sobra;
  const resposta = a + b;

  return {
    nivel,
    modo: nivel === 1 ? "sobra-pouca" : nivel === 2 ? "moldura-e-bandeja" : nivel === 3 ? "sem-decomposicao-escrita" : nivel === 4 ? "so-decomposicao" : "mental",
    a,
    b,
    faltamParaDez,
    sobra,
    resposta,
    mostrarMolduras: nivel <= 3,
    mostrarDecomposicao: nivel <= 2 || nivel === 4,
    exigeFecharACaixa: nivel <= 3,
    opcoes: opcoes(resposta, [
      // Fechou a caixa e parou: respondeu o próprio dez.
      { value: 10, misconception: FM.PAROU_NO_DEZ },
      // Errou o amigo do dez: pôs uma peça a mais na primeira caixa e chegou a
      // um a menos no total.
      { value: resposta - 1, misconception: FM.DECOMPOSICAO_ERRADA },
      // Estratégia certa, contagem torta.
      { value: resposta + 1, misconception: FM.OFF_BY_ONE },
    ]),
  };
}

export function construirFazerDezResolucao(spec: FazerDezF33Spec): ResolucaoDeclarativa<FazerDezShow, number, FazerDezMisconceptionTag> {
  const cena: FazerDezShow = { a: spec.a, b: spec.b, faltamParaDez: spec.faltamParaDez, sobra: spec.sobra };
  return {
    estadoInicial: cena,
    passos: [
      {
        id: "quanto-falta",
        say: `Temos ${spec.a} na caixa. Quantos faltam para fechar?`,
        show: { ...cena, preencherAte: spec.a, piscarVazias: true },
        corrige: [FazerDezMisconception.DECOMPOSICAO_ERRADA],
        parcial: spec.faltamParaDez,
      },
      {
        id: "fechar",
        say: `Coloque ${spec.faltamParaDez} da bandeja. Fechou: dez!`,
        show: { ...cena, preencherAte: 10, numeral: 10 },
        corrige: [FazerDezMisconception.DECOMPOSICAO_ERRADA],
        parcial: 10,
      },
      {
        id: "somar-a-sobra",
        say: `E ainda sobraram ${spec.sobra}. Dez e mais ${spec.sobra}.`,
        show: { ...cena, preencherAte: 10, numeral: spec.resposta },
        corrige: [FazerDezMisconception.PAROU_NO_DEZ, FazerDezMisconception.OFF_BY_ONE],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N3.07 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirFazerDezQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N3.07") throw new Error(`fazerDezContract recebeu ${ficha.id}.`);
  const spec = construirFazerDezSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`N3.07 sem micro L${spec.nivel}.`);

  // O enunciado só manda fechar a caixa onde existe caixa. No L4 as molduras
  // somem e sobra a decomposição escrita; mandar "fechar a caixa" ali seria
  // apontar para uma coisa que não está na tela.
  const prompt = spec.mostrarMolduras
    ? `${spec.a} + ${spec.b}. Vamos fechar a caixa primeiro!`
    : spec.mostrarDecomposicao
      ? `${spec.a} + ${spec.b}. Complete o dez e some o que sobrou.`
      : `${spec.a} + ${spec.b}. Faça dez de cabeça.`;
  const options: Option[] = spec.opcoes;
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "fazer-dez-f33",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirFazerDezResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: a => Number(a) === spec.resposta,
  };
}
