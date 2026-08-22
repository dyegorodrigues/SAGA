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
  letra: "n";
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

export function construirLinguagemLetrasSpec(level: number): LinguagemLetrasF89Spec {
  const nivel = clamp(level);
  if (nivel === 1) return {
    nivel,
    modo: "caixa-vira-letra",
    enunciadoVisual: "A caixa vazia guarda um número. Qual símbolo pode guardar esse mesmo lugar?",
    expressao: "□ → ?",
    letra: "n",
    barraPartes: 4,
    barraDestaque: 1,
    primitivas: ["SingaporeBars", "plain"],
    resposta: "n",
    opcoes: opts("n", [
      { value: "5", misconception: LinguagemLetrasMisconception.SO_CASO_PARTICULAR },
      { value: "nozes", misconception: LinguagemLetrasMisconception.LETRA_COMO_OBJETO },
      { value: "?", misconception: LinguagemLetrasMisconception.NAO_GENERALIZA },
    ]),
  };
  if (nivel === 2) return {
    nivel,
    modo: "expressao-simples",
    enunciadoVisual: "Escreva o dobro de qualquer número n.",
    expressao: "dobro de n",
    letra: "n",
    tabela: [{ n: 2, valor: 4 }, { n: 5, valor: 10 }],
    barraPartes: 2,
    barraDestaque: 2,
    primitivas: ["SingaporeBars", "plain"],
    resposta: "2n",
    opcoes: opts("2n", [
      { value: "n+2", misconception: LinguagemLetrasMisconception.NAO_GENERALIZA },
      { value: "4", misconception: LinguagemLetrasMisconception.SO_CASO_PARTICULAR },
      { value: "nn", misconception: LinguagemLetrasMisconception.LETRA_COMO_OBJETO },
    ]),
  };
  if (nivel === 3) return {
    nivel,
    modo: "expressao-contexto",
    enunciadoVisual: "Cada pacote tem n figurinhas. Quantas há em 3 pacotes?",
    expressao: "3 pacotes × n figurinhas",
    letra: "n",
    tabela: [{ n: 2, valor: 6 }, { n: 4, valor: 12 }],
    barraPartes: 3,
    barraDestaque: 3,
    primitivas: ["SingaporeBars", "plain"],
    resposta: "3n",
    opcoes: opts("3n", [
      { value: "n+3", misconception: LinguagemLetrasMisconception.NAO_GENERALIZA },
      { value: "6", misconception: LinguagemLetrasMisconception.SO_CASO_PARTICULAR },
      { value: "3 figurinhas", misconception: LinguagemLetrasMisconception.LETRA_COMO_OBJETO },
    ]),
  };
  if (nivel === 4) return {
    nivel,
    modo: "regra-padrao",
    enunciadoVisual: "A tabela cresce 3, 5, 7, 9... Qual regra produz qualquer linha?",
    expressao: "n → 3, 5, 7, 9...",
    letra: "n",
    tabela: [{ n: 1, valor: 3 }, { n: 2, valor: 5 }, { n: 3, valor: 7 }, { n: 4, valor: 9 }],
    barraPartes: 5,
    barraDestaque: 3,
    primitivas: ["SingaporeBars", "plain"],
    resposta: "2n+1",
    opcoes: opts("2n+1", [
      { value: "n+2", misconception: LinguagemLetrasMisconception.NAO_GENERALIZA },
      { value: "7", misconception: LinguagemLetrasMisconception.SO_CASO_PARTICULAR },
      { value: "número ímpar", misconception: LinguagemLetrasMisconception.LETRA_COMO_OBJETO },
    ]),
  };
  return {
    nivel,
    modo: "equivalencia-expressoes",
    enunciadoVisual: "Duas barras mostram 2n + 2n. Qual escrita representa a mesma quantidade?",
    expressao: "2n + 2n",
    letra: "n",
    tabela: [{ n: 2, valor: 8 }, { n: 5, valor: 20 }],
    barraPartes: 4,
    barraDestaque: 4,
    primitivas: ["SingaporeBars", "plain"],
    resposta: "4n",
    opcoes: opts("4n", [
      { value: "4n²", misconception: LinguagemLetrasMisconception.LETRA_COMO_OBJETO },
      { value: "8", misconception: LinguagemLetrasMisconception.SO_CASO_PARTICULAR },
      { value: "2n+2", misconception: LinguagemLetrasMisconception.NAO_GENERALIZA },
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
