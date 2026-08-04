import { MisconceptionTag } from "../../constants/misconceptions";
import {
  Distrator,
  Multiplicacao,
  TABUADAS_COM_PADRAO,
  TabuadaComPadrao,
  distratores as distratoresDePadrao,
  resolver as resolverPadrao,
} from "./tabuadaProcedure";

/**
 * Procedimento das tabuadas por decomposição — ficha F43, competência N4.04.
 *
 * Nenhuma tabuada nova: só combinação do que já se sabe.
 *
 * - **×4 é dobrar o dobro.** 7×2 = 14, 14×2 = 28.
 * - **×3 é o dobro mais um grupo.** 7×2 = 14, +7 = 21.
 *
 * Ensinar ×3 e ×4 como fatos independentes desperdiça o que a criança já tem.
 * Quem sabe ×2 já sabe ×4 e quase sabe ×3.
 */

export const TABUADAS_POR_DECOMPOSICAO = [4, 3] as const;
export type TabuadaPorDecomposicao = (typeof TABUADAS_POR_DECOMPOSICAO)[number];

/** Toda decomposição parte da mesma âncora: o dobro. */
export const ANCORA = 2;

export const OUTRO_FATOR_MIN = 2;
export const OUTRO_FATOR_MAX = 10;

export type Estrategia = "dobro_do_dobro" | "dobro_mais_grupo";

export const ESTRATEGIA_DE: Record<TabuadaPorDecomposicao, Estrategia> = {
  4: "dobro_do_dobro",
  3: "dobro_mais_grupo",
};

export const NOME_DA_ESTRATEGIA: Record<Estrategia, string> = {
  dobro_do_dobro: "dobrar o dobro",
  dobro_mais_grupo: "o dobro mais um grupo",
};

export interface Decomposicao {
  tabuada: TabuadaPorDecomposicao;
  vezes: number;
}

export function resolver({ tabuada, vezes }: Decomposicao): number {
  return tabuada * vezes;
}

/** O fato que a criança já domina e que serve de ponto de partida. */
export function dobroAncora({ vezes }: Decomposicao): number {
  return ANCORA * vezes;
}

export interface PassoDaDecomposicao {
  conta: string;
  resultado: number;
  /** O que a voz diz neste passo. */
  fala: string;
}

/** Os dois passos escritos que aparecem no nível 2 e na recapitulação. */
export function passos(d: Decomposicao): [PassoDaDecomposicao, PassoDaDecomposicao] {
  const dobro = dobroAncora(d);
  const total = resolver(d);
  const primeiro: PassoDaDecomposicao = {
    conta: `${d.vezes} × ${ANCORA} = ${dobro}`,
    resultado: dobro,
    fala: `${d.vezes} vezes 2 é ${dobro}.`,
  };

  if (ESTRATEGIA_DE[d.tabuada] === "dobro_do_dobro") {
    return [primeiro, {
      conta: `${dobro} × ${ANCORA} = ${total}`,
      resultado: total,
      fala: `E o dobro de ${dobro} é ${total}.`,
    }];
  }
  return [primeiro, {
    conta: `${dobro} + ${d.vezes} = ${total}`,
    resultado: total,
    fala: `Mais um grupo de ${d.vezes} dá ${total}.`,
  }];
}

/**
 * Quais tabuadas cada nível apresenta, na ordem da ficha F43.
 *
 * O nível 5 mistura com as de padrão visível (N4.03), porque a fluência final
 * não separa por estratégia — a criança precisa recuperar o fato, venha ele de
 * padrão ou de decomposição.
 */
export function tabuadasDoNivel(nivel: number): number[] {
  switch (nivel) {
    case 1: return [4];
    case 2: return [4];
    case 3: return [3];
    case 4: return [3, 4];
    default: return [...TABUADAS_POR_DECOMPOSICAO, ...TABUADAS_COM_PADRAO];
  }
}

/** O arranjo que se duplica aparece enquanto a estratégia está sendo construída. */
export function mostraArranjo(nivel: number): boolean {
  return nivel === 1 || nivel === 3;
}

/** A decomposição escrita entra no nível 2, quando o gesto já foi visto. */
export function mostraDecomposicaoEscrita(nivel: number): boolean {
  return nivel === 2;
}

/**
 * Erros com significado, específicos da decomposição.
 *
 * A simetria vale ser notada: **as duas estratégias são o distrator uma da
 * outra.** Quem devolve 4n numa questão de ×3 aplicou "dobrar o dobro" onde
 * cabia "dobro mais um grupo" — e vice-versa. Isso diagnostica muito mais do
 * que um número vizinho qualquer.
 */
export function distratores(d: Decomposicao): Distrator[] {
  const certo = resolver(d);
  const dobro = dobroAncora(d);
  const outraEstrategia = ESTRATEGIA_DE[d.tabuada] === "dobro_do_dobro"
    ? 3 * d.vezes   // aplicou "dobro mais um grupo" onde cabia dobrar o dobro
    : 4 * d.vezes;  // dobrou o dobro onde cabia somar um grupo

  const candidatos: Distrator[] = [
    { valor: dobro, tag: MisconceptionTag.PAROU_NO_DOBRO },
    { valor: outraEstrategia, tag: MisconceptionTag.TROCOU_ESTRATEGIA },
    { valor: d.tabuada + d.vezes, tag: MisconceptionTag.SOMA_OS_FATORES },
  ];

  const vistos = new Set<number>([certo]);
  return candidatos.filter(c => {
    if (c.valor <= 0) return false;
    if (vistos.has(c.valor)) return false;
    vistos.add(c.valor);
    return true;
  });
}

/**
 * Serve para perguntar?
 *
 * Recusa `vezes <= 1` pela mesma razão de N4.03 — a resposta apareceria escrita
 * no enunciado — e exige que os dois erros característicos da decomposição
 * sobrevivam. Sem eles, a questão não distingue quem entendeu de quem chutou.
 */
export function ehPergunavelComDiagnostico(d: Decomposicao): boolean {
  if (d.vezes <= 1) return false;
  const certo = resolver(d);
  if (certo === d.tabuada + d.vezes) return false;
  const tags = new Set(distratores(d).map(x => x.tag));
  return tags.has(MisconceptionTag.PAROU_NO_DOBRO)
    && tags.has(MisconceptionTag.TROCOU_ESTRATEGIA);
}

/** É uma tabuada que se resolve por decomposição, ou por padrão visível? */
export function ehPorDecomposicao(tabuada: number): tabuada is TabuadaPorDecomposicao {
  return (TABUADAS_POR_DECOMPOSICAO as readonly number[]).includes(tabuada);
}

/**
 * Alternativas para qualquer tabuada que o nível apresente.
 *
 * No nível 5 entram também ×2, ×5 e ×10, que não se decompõem — para essas o
 * procedimento de N4.03 já sabe distratar, e reusá-lo é melhor que reinventar
 * um conjunto de erros paralelo que envelheceria em separado.
 */
export function alternativasPara(tabuada: number, vezes: number): Distrator[] {
  if (ehPorDecomposicao(tabuada)) {
    const d = { tabuada, vezes };
    return [{ valor: resolver(d), tag: "" }, ...distratores(d)];
  }
  const m = { tabuada: tabuada as TabuadaComPadrao, vezes } as Multiplicacao;
  return [{ valor: resolverPadrao(m), tag: "" }, ...distratoresDePadrao(m)];
}
