import {
  Arranjo, Cena, Desfecho, MomentoDaPergunta, RESPOSTAS,
  arranjoDoNivel, desfechoDe, momentoDaPergunta, perguntaDoNivel, temMaoFantasma,
} from "./pareamentoProcedure";

/**
 * Contrato da tela de N1.01 — ficha F07, "Um pra cada".
 *
 * ---
 *
 * **A regra que governa tudo aqui: nada na tela é número.** Nem o enunciado, nem
 * os rótulos, nem a descrição de acessibilidade. Esta é a única ficha do cânone
 * com uma regra marcada com ⚠️, e ela existe porque a criança que ainda não
 * entende cardinalidade lê "4" como um símbolo sem sentido — e, pior, aprende
 * que a resposta se acha contando, que é exatamente o contrário do que a ficha
 * ensina.
 *
 * **A resposta não está na tela: está na ação.** Esta é uma ficha de PRODUÇÃO. A
 * criança não escolhe entre alternativas para distribuir — ela distribui. A
 * única escolha é a pergunta final, e mesmo ela é sobre o que ficou, nunca sobre
 * quanto.
 */

/** Um lado da cena: quem recebe, ou o que se distribui. */
export interface LadoSpec {
  emoji: string;
  quantidade: number;
  /** "os bombeiros" — o nome coletivo, para o áudio. Nunca traz quantidade. */
  nome: string;
}

export interface RespostaSpec {
  desfecho: Desfecho;
  rotulo: string;
}

export interface PareamentoSpec {
  /** "Dê um capacete para cada bombeiro!" — sem numeral. */
  enunciado: string;
  /** O mesmo, para quem não lê. */
  falado: string;
  receptores: LadoSpec;
  itens: LadoSpec;
  arranjo: Arranjo;
  /** A Mão Fantasma faz o primeiro par, narrando. Só no nível 1. */
  maoFantasma: boolean;
  /** A pergunta do "sobrou?", ou `null` quando o nível não pergunta. */
  pergunta: string | null;
  momentoDaPergunta: MomentoDaPergunta;
  /** As três respostas possíveis. Vazio quando não há pergunta. */
  respostas: RespostaSpec[];
  /** O que de fato acontece na cena. Usado para avaliar, NUNCA para desenhar. */
  desfecho: Desfecho;
}

/**
 * Os temas da ficha F07 §1: resgate, dinos, selva.
 *
 * Cada tema é um par receptor↔item que faz sentido junto — o capacete é do
 * bombeiro, e é isso que torna "um pra cada" uma história antes de ser uma
 * regra. Pares arbitrários (um sapato para cada nuvem) transformariam a tarefa
 * num exercício de encaixe sem significado.
 */
export const TEMAS = [
  { receptor: { emoji: "👨‍🚒", nome: "os bombeiros" }, item: { emoji: "⛑️", nome: "os capacetes" }, verbo: "capacete", quem: "bombeiro" },
  { receptor: { emoji: "🦕", nome: "os dinos" }, item: { emoji: "🥚", nome: "os ovos" }, verbo: "ovo", quem: "dino" },
  { receptor: { emoji: "🐵", nome: "os macacos" }, item: { emoji: "🍌", nome: "as bananas" }, verbo: "banana", quem: "macaco" },
] as const;

export type Tema = (typeof TEMAS)[number];

export function construirPareamentoSpec(c: Cena, nivel: number, tema: Tema): PareamentoSpec {
  const artigo = tema.verbo === "banana" ? "uma" : "um";
  const enunciado = `Dê ${artigo} ${tema.verbo} para cada ${tema.quem}!`;
  const pergunta = perguntaDoNivel(nivel);
  return {
    enunciado,
    falado: enunciado,
    receptores: { ...tema.receptor, quantidade: c.receptores },
    itens: { ...tema.item, quantidade: c.itens },
    arranjo: arranjoDoNivel(nivel),
    maoFantasma: temMaoFantasma(nivel),
    pergunta,
    momentoDaPergunta: momentoDaPergunta(nivel),
    respostas: pergunta ? RESPOSTAS.map(r => ({ ...r })) : [],
    desfecho: desfechoDe(c),
  };
}

/**
 * A tela contém algum numeral?
 *
 * Varre tudo que a criança pode ver ou ouvir. É a regra dura da ficha virada em
 * função — e o `desfecho` fica de fora de propósito: ele é o gabarito, não é
 * desenhado, e checá-lo aqui não faria sentido.
 */
export function nenhumNumeralNaTela(spec: PareamentoSpec): boolean {
  const visivel = [
    spec.enunciado, spec.falado, spec.pergunta,
    spec.receptores.nome, spec.itens.nome,
    ...spec.respostas.map(r => r.rotulo),
  ].filter(Boolean).join(" ");
  return !/\d/.test(visivel);
}
