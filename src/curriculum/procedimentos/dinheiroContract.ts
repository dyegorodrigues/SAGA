import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";
import { evidenciaDeFamilia } from "./familiaIntegradora";

/**
 * F53 / GM.03 — o tesouro do pirata. Reconhecer e compor dinheiro.
 *
 * ## O que é específico do dinheiro
 *
 * É a primeira vez no currículo que a criança lida com **valor simbólico
 * atribuído**: a moeda de 50 centavos é menor que a de 25 no dinheiro de
 * verdade. O valor não se lê no tamanho — precisa ser reconhecido.
 *
 * ## A composição é o coração
 *
 * Entender que um real pode ser duas de 50, ou quatro de 25, ou dez de 10 — é
 * aqui que dinheiro vira matemática em vez de memorização. Por isso o L4 é o
 * nível da equivalência, e não um exercício de soma a mais.
 *
 * ## Por que a mistura vem por último
 *
 * Somar `25 + 50 + 10` é muito mais difícil que contar moedas iguais, porque
 * exige lidar com múltiplos diferentes ao mesmo tempo. A estratégia que a ficha
 * ensina é **ordenar da maior para a menor antes de somar**, e é isso que o L5
 * cobra.
 *
 * A competência só abre depois de N3.09 — somar até 100 sem reagrupar. A
 * criança chega aqui sabendo somar; o que ela não sabe é atribuir valor.
 */
export const DinheiroMisconception = {
  CONTA_MOEDAS: "conta-moedas",
  VALOR_PELO_TAMANHO: "valor-pelo-tamanho",
  SEM_EQUIVALENCIA: "sem-equivalencia",
} as const;
export type DinheiroMisconceptionTag = typeof DinheiroMisconception[keyof typeof DinheiroMisconception];

export type DinheiroModo = "reconhecer" | "moedas-iguais" | "duas-denominacoes" | "compor-um-real" | "misturadas";
export type FamiliaDaComposicao = "so-uma-denominacao" | "denominacoes-diferentes";

/** As moedas do Real que a ficha usa, em centavos. */
export const MOEDAS_DO_REAL = [5, 10, 25, 50, 100] as const;

export interface DinheiroF53Spec {
  nivel: number;
  modo: DinheiroModo;
  /** As moedas na mesa, em centavos. */
  moedas: number[];
  /** No L1 é o valor que a pergunta pede reconhecer. */
  procurada?: number;
  /** O total em centavos das moedas na mesa. */
  total: number;
  resposta: number;
  familia: FamiliaDaComposicao;
  opcoes: Array<{ value: number; label: string; misconception?: DinheiroMisconceptionTag }>;
}

interface DinheiroShow {
  moedas: number[];
  destacarMoeda?: number;
  acumular?: number;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const escolher = <T,>(itens: readonly T[]): T => itens[Math.floor(Math.random() * itens.length)];

/** Em centavos até 99 escrevemos "N centavos"; de 100 em diante, em reais. */
export function escreverValor(centavos: number): string {
  if (centavos < 100) return `${centavos} centavos`;
  const reais = Math.floor(centavos / 100);
  const resto = centavos % 100;
  const parteReais = reais === 1 ? "1 real" : `${reais} reais`;
  return resto === 0 ? parteReais : `${parteReais} e ${resto} centavos`;
}

function opcoes(correta: number, erradas: Array<{ value: number; misconception: DinheiroMisconceptionTag }>): DinheiroF53Spec["opcoes"] {
  return [
    { value: correta, label: escreverValor(correta) },
    ...erradas.map(x => ({ value: x.value, label: escreverValor(x.value), misconception: x.misconception })),
  ]
    .filter((x, i, a) => a.findIndex(y => y.value === x.value) === i)
    .filter(x => x.value > 0)
    .slice(0, 4);
}

/** As combinações de moedas iguais que fecham exatamente um real. */
const COMPOSICOES_DE_UM_REAL: number[][] = [
  [50, 50],
  [25, 25, 25, 25],
  [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  [50, 25, 25],
  [50, 25, 10, 10, 5],
];

export function construirDinheiroSpec(level: number, familiaPedida?: FamiliaDaComposicao): DinheiroF53Spec {
  const nivel = clamp(level);
  const DM = DinheiroMisconception;

  if (nivel === 1) {
    // Reconhecer: o valor antes de qualquer operação. As alternativas são os
    // valores das OUTRAS moedas na mesa — é o reconhecimento que está em jogo.
    const mesa = [...MOEDAS_DO_REAL];
    const procurada = escolher(mesa);
    const outras = mesa.filter(m => m !== procurada);
    return {
      nivel, modo: "reconhecer", moedas: mesa, procurada,
      total: mesa.reduce((s, m) => s + m, 0), resposta: procurada,
      familia: "so-uma-denominacao",
      opcoes: opcoes(procurada, [
        // Julgou pelo tamanho: pegou a moeda fisicamente maior que a certa.
        { value: outras[0], misconception: DM.VALOR_PELO_TAMANHO },
        { value: outras[1], misconception: DM.VALOR_PELO_TAMANHO },
        { value: outras[2], misconception: DM.VALOR_PELO_TAMANHO },
      ]),
    };
  }

  if (nivel === 2) {
    // Moedas iguais: é multiplicação disfarçada, e por isso vem antes.
    const valor = escolher([10, 25, 50] as const);
    const quantidade = ri(2, valor === 50 ? 3 : 4);
    const moedas = Array.from({ length: quantidade }, () => valor);
    const total = valor * quantidade;
    return {
      nivel, modo: "moedas-iguais", moedas, total, resposta: total,
      familia: "so-uma-denominacao",
      opcoes: opcoes(total, [
        // Contou moedas em vez de valores: três moedas viram "3".
        { value: quantidade, misconception: DM.CONTA_MOEDAS },
        { value: total - valor, misconception: DM.CONTA_MOEDAS },
        { value: total + valor, misconception: DM.VALOR_PELO_TAMANHO },
      ]),
    };
  }

  if (nivel === 4) {
    // Compor um real: a descoberta da equivalência. A pergunta é quanto FALTA
    // para fechar o real — o que exige ver a composição, não só somar.
    const composicao = escolher(COMPOSICOES_DE_UM_REAL);
    const retiradas = ri(1, Math.min(2, composicao.length - 1));
    const naMesa = composicao.slice(0, composicao.length - retiradas);
    const total = naMesa.reduce((s, m) => s + m, 0);
    const falta = 100 - total;
    return {
      nivel, modo: "compor-um-real", moedas: naMesa, total, resposta: falta,
      familia: naMesa.every(m => m === naMesa[0]) ? "so-uma-denominacao" : "denominacoes-diferentes",
      opcoes: opcoes(falta, [
        // Não compôs: respondeu o que já está na mesa.
        { value: total, misconception: DM.SEM_EQUIVALENCIA },
        // Contou moedas em vez de valores.
        { value: naMesa.length, misconception: DM.CONTA_MOEDAS },
        { value: 100, misconception: DM.SEM_EQUIVALENCIA },
      ]),
    };
  }

  // L3: duas denominações compatíveis. L5: várias misturadas, onde ordenar da
  // maior para a menor é a estratégia que a ficha ensina.
  const denominacoes = nivel === 3
    ? [escolher([50, 25, 10] as const), escolher([25, 10, 5] as const)]
    : [50, 25, 10, 5];
  const quantas = nivel === 3 ? 2 : ri(3, 4);
  const moedas: number[] = [];

  // No nível integrador a família é ESCOLHIDA, não sorteada por acidente.
  //
  // Antes, as três ou quatro moedas eram tiradas de forma independente e a
  // família saía do resultado: "só uma denominação" exigia que todas caíssem
  // iguais — 1/16 com três moedas, 1/64 com quatro. Medido em 20 mil sorteios:
  // 4,04%. A criança via o caso misto 96% das vezes num nível que existe para
  // ela ALTERNAR, e a coroa — que cobra as duas famílias — passava a depender
  // de um sorteio raro dentro de uma janela de três a cinco questões.
  const familiaDoNivel: FamiliaDaComposicao = nivel === 5
    ? familiaPedida ?? (Math.random() < 0.5 ? "so-uma-denominacao" : "denominacoes-diferentes")
    : "denominacoes-diferentes";

  if (nivel === 5 && familiaDoNivel === "so-uma-denominacao") {
    const unica = escolher(denominacoes);
    for (let i = 0; i < quantas; i += 1) moedas.push(unica);
  } else if (nivel === 5) {
    // Pelo menos duas denominações distintas: a primeira é livre, a segunda é
    // obrigatoriamente outra, e o resto volta a ser sorteio.
    const primeira = escolher(denominacoes);
    const outras = denominacoes.filter(d => d !== primeira);
    moedas.push(primeira, escolher(outras));
    for (let i = 2; i < quantas; i += 1) moedas.push(escolher(denominacoes));
  } else {
    for (let i = 0; i < quantas; i += 1) moedas.push(escolher(denominacoes));
  }
  // Fora de ordem de propósito: ordenar é a estratégia, não o presente.
  const total = moedas.reduce((s, m) => s + m, 0);
  const distintas = new Set(moedas).size;

  return {
    nivel,
    modo: nivel === 3 ? "duas-denominacoes" : "misturadas",
    moedas,
    total,
    resposta: total,
    familia: distintas === 1 ? "so-uma-denominacao" : "denominacoes-diferentes",
    opcoes: opcoes(total, [
      // Contou moedas em vez de valores.
      { value: moedas.length, misconception: DM.CONTA_MOEDAS },
      // Trocou o valor de duas moedas de tamanhos parecidos.
      { value: total + 25, misconception: DM.VALOR_PELO_TAMANHO },
      { value: Math.max(5, total - 25), misconception: DM.VALOR_PELO_TAMANHO },
    ]),
  };
}

export function construirDinheiroResolucao(spec: DinheiroF53Spec): ResolucaoDeclarativa<DinheiroShow, number, DinheiroMisconceptionTag> {
  const ordenadas = [...spec.moedas].sort((a, b) => b - a);
  const cena: DinheiroShow = { moedas: spec.moedas };
  return {
    estadoInicial: cena,
    passos: [
      {
        id: "ler-o-numero",
        say: "Olhe o número escrito na moeda, não o tamanho dela.",
        show: { ...cena, destacarMoeda: ordenadas[0] },
        corrige: [DinheiroMisconception.VALOR_PELO_TAMANHO],
        parcial: ordenadas[0],
      },
      {
        id: "da-maior-para-a-menor",
        say: "Comece pela moeda de maior valor e vá somando as menores.",
        show: { ...cena, acumular: ordenadas[0] },
        corrige: [DinheiroMisconception.CONTA_MOEDAS],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`GM.03 sem micro L${nivel}.`);
  return {
    acertos: micro.dominio.acertos,
    de: micro.dominio.de,
    sessoes: micro.dominio.sessoes,
    ...(micro.dominio.evidenciasDistintas ? { evidenciasDistintas: micro.dominio.evidenciasDistintas } : {}),
  };
}

export function construirDinheiroQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GM.03") throw new Error(`dinheiroContract recebeu ${ficha.id}.`);
  const spec = construirDinheiroSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`GM.03 sem micro L${spec.nivel}.`);

  const prompt = spec.modo === "reconhecer"
    ? `Qual moeda vale ${escreverValor(spec.procurada ?? 0)}?`
    : spec.modo === "compor-um-real"
      ? "Quanto falta para fechar um real?"
      : "Quanto dinheiro há aqui?";
  const options: Option[] = spec.opcoes;
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "dinheiro-f53",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirDinheiroResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    // A família só é evidência onde o nível de fato varia entre uma e várias
    // denominações — que é o L5. Nos outros ela é fixa pelo próprio nível.
    ...(spec.nivel === 5 ? { evidenciaDeFamilia: evidenciaDeFamilia(ficha.id, spec.familia) } : {}),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: a => Number(a) === spec.resposta,
  };
}
