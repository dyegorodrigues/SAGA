import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const LinguagemLetrasMisconception = {
  LETRA_COMO_OBJETO: "letra-como-objeto",
  SO_CASO_PARTICULAR: "so-caso-particular",
  NAO_GENERALIZA: "nao-generaliza",
} as const;
export type LinguagemLetrasMisconceptionTag = typeof LinguagemLetrasMisconception[keyof typeof LinguagemLetrasMisconception];
export type LinguagemLetrasModo = "caixa-vira-letra" | "expressao-simples" | "expressao-contexto" | "regra-padrao" | "equivalencia-expressoes";

export interface LinguagemLetrasF89Spec {
  nivel: number;
  modo: LinguagemLetrasModo;
  enunciadoVisual: string;
  expressao: string;
  /**
   * A letra que generaliza. Era o literal `"n"` — o tipo prendia o contrato a
   * uma letra só, e prender a letra é prender a resposta de L1.
   */
  letra: string;
  tabela?: Array<{ n: number; valor: number }>;
  barraPartes: number;
  barraDestaque: number;
  primitivas: ["SingaporeBars", "plain"];
  resposta: string;
  opcoes: Array<{ value: string; label: string; misconception?: LinguagemLetrasMisconceptionTag }>;
}

interface LinguagemLetrasShow {
  expressao: string;
  letra: string;
  tabela?: Array<{ n: number; valor: number }>;
  barraPartes: number;
  barraDestaque: number;
  testarValores?: number[];
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const opts = (correta: string, erradas: Array<{ value: string; misconception: LinguagemLetrasMisconceptionTag }>): LinguagemLetrasF89Spec["opcoes"] =>
  [{ value: correta, label: correta }, ...erradas.map(item => ({ ...item, label: item.value }))]
    .filter((item, index, all) => all.findIndex(other => other.value === item.value) === index)
    .slice(0, 4);

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const escolher = <T,>(itens: readonly T[]): T => itens[Math.floor(Math.random() * itens.length)];

/**
 * A letra, e o objeto cujo nome começa por ela.
 *
 * O objeto é o distrator `LETRA_COMO_OBJETO`: a criança que lê a letra como
 * abreviação de uma coisa — "n de nozes" — em vez de um número qualquer.
 */
const LETRAS_F89 = [
  { letra: "n", objeto: "nozes" },
  { letra: "x", objeto: "xícaras" },
  { letra: "k", objeto: "kiwis" },
  { letra: "a", objeto: "abelhas" },
  { letra: "m", objeto: "maçãs" },
  { letra: "p", objeto: "peras" },
] as const;

const CONTEXTOS_F89 = [
  { recipiente: "pacote", coisa: "figurinhas" },
  { recipiente: "caixa", coisa: "lápis" },
  { recipiente: "cesta", coisa: "ovos" },
  { recipiente: "saco", coisa: "bolinhas" },
] as const;

const MULTIPLOS_F89: Record<number, string> = { 2: "dobro", 3: "triplo", 4: "quádruplo", 5: "quíntuplo" };

/**
 * CLASS-003 — a letra muda, o que se generaliza não.
 *
 * A resposta era sempre n, 2n, 3n, 2n+1 e 4n. Decorar cinco escritas vencia a
 * competência sem a criança generalizar uma vez.
 *
 * O degrau continua sendo O QUE se generaliza: a letra no lugar da caixa, um
 * múltiplo, o múltiplo num contexto, a regra de um padrão, e a soma de dois
 * múltiplos. O coeficiente e a letra é que passam a ser sorteados.
 */
export function construirLinguagemLetrasSpec(level: number): LinguagemLetrasF89Spec {
  const nivel = clamp(level);
  const { letra, objeto } = escolher(LETRAS_F89);
  const primitivas = ["SingaporeBars", "plain"] as ["SingaporeBars", "plain"];

  if (nivel === 1) return {
    nivel,
    modo: "caixa-vira-letra",
    enunciadoVisual: "A caixa vazia guarda um número. Qual símbolo pode guardar esse mesmo lugar?",
    expressao: "□ → ?",
    letra,
    barraPartes: 4,
    barraDestaque: 1,
    primitivas,
    resposta: letra,
    opcoes: opts(letra, [
      { value: String(ri(2, 9)), misconception: LinguagemLetrasMisconception.SO_CASO_PARTICULAR },
      { value: objeto, misconception: LinguagemLetrasMisconception.LETRA_COMO_OBJETO },
      { value: "?", misconception: LinguagemLetrasMisconception.NAO_GENERALIZA },
    ]),
  };

  if (nivel === 2) {
    const fator = ri(2, 5);
    const caso = ri(2, 6);
    return {
      nivel,
      modo: "expressao-simples",
      enunciadoVisual: `Escreva o ${MULTIPLOS_F89[fator]} de qualquer número ${letra}.`,
      expressao: `${MULTIPLOS_F89[fator]} de ${letra}`,
      letra,
      tabela: [{ n: caso, valor: caso * fator }, { n: caso + 3, valor: (caso + 3) * fator }],
      barraPartes: fator,
      barraDestaque: fator,
      primitivas,
      resposta: `${fator}${letra}`,
      opcoes: opts(`${fator}${letra}`, [
        { value: `${letra}+${fator}`, misconception: LinguagemLetrasMisconception.NAO_GENERALIZA },
        { value: String(caso * fator), misconception: LinguagemLetrasMisconception.SO_CASO_PARTICULAR },
        { value: `${letra}${letra}`, misconception: LinguagemLetrasMisconception.LETRA_COMO_OBJETO },
      ]),
    };
  }

  if (nivel === 3) {
    const { recipiente, coisa } = escolher(CONTEXTOS_F89);
    const quantos = ri(2, 5);
    const caso = ri(2, 6);
    return {
      nivel,
      modo: "expressao-contexto",
      enunciadoVisual: `Cada ${recipiente} tem ${letra} ${coisa}. Quantas há em ${quantos} ${recipiente}s?`,
      expressao: `${quantos} ${recipiente}s × ${letra} ${coisa}`,
      letra,
      tabela: [{ n: caso, valor: caso * quantos }, { n: caso + 2, valor: (caso + 2) * quantos }],
      barraPartes: quantos,
      barraDestaque: quantos,
      primitivas,
      resposta: `${quantos}${letra}`,
      opcoes: opts(`${quantos}${letra}`, [
        { value: `${letra}+${quantos}`, misconception: LinguagemLetrasMisconception.NAO_GENERALIZA },
        { value: String(caso * quantos), misconception: LinguagemLetrasMisconception.SO_CASO_PARTICULAR },
        { value: `${quantos} ${coisa}`, misconception: LinguagemLetrasMisconception.LETRA_COMO_OBJETO },
      ]),
    };
  }

  if (nivel === 4) {
    // Um padrão aritmético: passo e ponto de partida sorteados. A regra é
    // `passo·n + inicial`, e a tabela nasce dela — não de uma lista escrita.
    const passo = ri(2, 4);
    const constante = ri(1, 5);
    const linhas = [1, 2, 3, 4].map(n => ({ n, valor: passo * n + constante }));
    return {
      nivel,
      modo: "regra-padrao",
      enunciadoVisual: `A tabela cresce ${linhas.map(linha => linha.valor).join(", ")}... Qual regra produz qualquer linha?`,
      expressao: `${letra} → ${linhas.map(linha => linha.valor).join(", ")}...`,
      letra,
      tabela: linhas,
      barraPartes: passo + 1,
      barraDestaque: passo,
      primitivas,
      resposta: `${passo}${letra}+${constante}`,
      opcoes: opts(`${passo}${letra}+${constante}`, [
        // Somar o passo em vez de multiplicar por ele: acerta uma linha e
        // erra as outras, que é exatamente não generalizar.
        { value: `${letra}+${passo}`, misconception: LinguagemLetrasMisconception.NAO_GENERALIZA },
        { value: String(linhas[2].valor), misconception: LinguagemLetrasMisconception.SO_CASO_PARTICULAR },
        { value: constante % 2 === 1 ? "número ímpar" : "número par", misconception: LinguagemLetrasMisconception.LETRA_COMO_OBJETO },
      ]),
    };
  }

  const parcela = ri(2, 4);
  const caso = ri(2, 5);
  const total = parcela * 2;
  return {
    nivel,
    modo: "equivalencia-expressoes",
    enunciadoVisual: `Duas barras mostram ${parcela}${letra} + ${parcela}${letra}. Qual escrita representa a mesma quantidade?`,
    expressao: `${parcela}${letra} + ${parcela}${letra}`,
    letra,
    tabela: [{ n: caso, valor: caso * total }, { n: caso + 3, valor: (caso + 3) * total }],
    barraPartes: total,
    barraDestaque: total,
    primitivas,
    resposta: `${total}${letra}`,
    opcoes: opts(`${total}${letra}`, [
      { value: `${total}${letra}²`, misconception: LinguagemLetrasMisconception.LETRA_COMO_OBJETO },
      { value: String(caso * total), misconception: LinguagemLetrasMisconception.SO_CASO_PARTICULAR },
      { value: `${parcela}${letra}+${parcela}`, misconception: LinguagemLetrasMisconception.NAO_GENERALIZA },
    ]),
  };
}

export function construirLinguagemLetrasResolucao(spec: LinguagemLetrasF89Spec): ResolucaoDeclarativa<LinguagemLetrasShow, string, LinguagemLetrasMisconceptionTag> {
  const inicial: LinguagemLetrasShow = {
    expressao: spec.expressao,
    letra: spec.letra,
    tabela: spec.tabela,
    barraPartes: spec.barraPartes,
    barraDestaque: spec.barraDestaque,
  };
  const validar = spec.modo === "regra-padrao"
    ? "Teste a regra em dois casos da tabela. Se funciona nos dois, ela começa a falar do geral, não de um caso só."
    : "Troque n por valores diferentes e confira se a escrita preserva a mesma relação.";
  return {
    estadoInicial: inicial,
    passos: [
      {
        id: "ligar-concreto-ao-simbolo",
        say: "A barra mostra a quantidade; a letra guarda o lugar do número que pode mudar.",
        show: inicial,
        corrige: [LinguagemLetrasMisconception.LETRA_COMO_OBJETO],
        parcial: spec.expressao,
      },
      {
        id: "testar-generalizacao",
        say: validar,
        show: { ...inicial, testarValores: spec.tabela?.slice(0, 2).map(item => item.n) ?? [2, 5], expressao: spec.resposta },
        corrige: [LinguagemLetrasMisconception.SO_CASO_PARTICULAR, LinguagemLetrasMisconception.NAO_GENERALIZA],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === id);
  if (!micro) throw new Error(`AL.07 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirLinguagemLetrasQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "AL.07") throw new Error(`linguagemLetrasContract recebeu ${ficha.id}.`);
  const spec = construirLinguagemLetrasSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === id);
  if (!micro) throw new Error(`AL.07 sem micro L${spec.nivel}.`);
  const options: Option[] = spec.opcoes;
  return {
    kind: "linguagem-letras-f89",
    prompt: spec.enunciadoVisual,
    audioPrompt: spec.enunciadoVisual,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirLinguagemLetrasResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => String(answer).replace(/\s+/g, "") === spec.resposta.replace(/\s+/g, ""),
  };
}
