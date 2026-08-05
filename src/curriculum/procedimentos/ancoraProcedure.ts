import { MisconceptionTag } from "../../constants/misconceptions";
import { Distrator } from "./tabuadaProcedure";

/**
 * Procedimento das tabuadas do 6 ao 9 — ficha F44, competência N4.07.
 *
 * **Quantos fatos realmente sobram.** Quem sabe ×2, ×3, ×4, ×5 e ×10, e entende
 * comutatividade, tem só **10 fatos genuinamente novos**: 6×6, 6×7, 6×8, 6×9,
 * 7×7, 7×8, 7×9, 8×8, 8×9, 9×9. As "tabuadas difíceis" são poucas de verdade.
 *
 * ---
 *
 * **A generalização que a ficha revela.** Todas as quatro estratégias da F44 têm
 * a mesma forma: *partir de um fato fácil e ajustar*.
 *
 * | Tabuada | Âncora | Ajuste            |
 * |---------|--------|-------------------|
 * | ×9      | ×10    | tirar um grupo    |
 * | ×6      | ×5     | somar um grupo    |
 * | ×7      | ×5     | somar dois grupos |
 * | ×8      | ×4     | dobrar            |
 *
 * E N4.04 cabe na mesma forma: ×4 é ×2 dobrado, ×3 é ×2 mais um grupo. Este
 * módulo descreve a forma geral; `decomposicaoProcedure` continua com sua
 * própria superfície porque já está em produção, e trocar o motor de um nó vivo
 * é assunto de outro PR — não deste.
 */

export const TABUADAS_DIFICEIS = [9, 6, 8, 7] as const;
export type TabuadaDificil = (typeof TABUADAS_DIFICEIS)[number];

export const OUTRO_FATOR_MIN = 2;
export const OUTRO_FATOR_MAX = 10;

export type Ajuste =
  | { tipo: "somar_grupos"; grupos: number }
  | { tipo: "tirar_grupos"; grupos: number }
  | { tipo: "dobrar" };

export interface Estrategia {
  /** A tabuada fácil de onde se parte. */
  ancora: number;
  ajuste: Ajuste;
  /** Como a voz nomeia a estratégia. */
  nome: string;
}

export const ESTRATEGIA_DE: Record<TabuadaDificil, Estrategia> = {
  9: { ancora: 10, ajuste: { tipo: "tirar_grupos", grupos: 1 }, nome: "dez menos um grupo" },
  6: { ancora: 5, ajuste: { tipo: "somar_grupos", grupos: 1 }, nome: "cinco mais um grupo" },
  7: { ancora: 5, ajuste: { tipo: "somar_grupos", grupos: 2 }, nome: "cinco mais dois grupos" },
  8: { ancora: 4, ajuste: { tipo: "dobrar" }, nome: "o dobro do quatro" },
};

export interface Conta {
  tabuada: TabuadaDificil;
  vezes: number;
}

export function resolver({ tabuada, vezes }: Conta): number {
  return tabuada * vezes;
}

/** O fato fácil de onde a criança parte. */
export function valorDaAncora({ tabuada, vezes }: Conta): number {
  return ESTRATEGIA_DE[tabuada].ancora * vezes;
}

export interface PassoDaAncora {
  conta: string;
  resultado: number;
  fala: string;
}

/** Os dois passos: o fato conhecido e o ajuste que o completa. */
export function passos(c: Conta): [PassoDaAncora, PassoDaAncora] {
  const { ancora, ajuste } = ESTRATEGIA_DE[c.tabuada];
  const base = valorDaAncora(c);
  const total = resolver(c);
  const primeiro: PassoDaAncora = {
    conta: `${c.vezes} × ${ancora} = ${base}`,
    resultado: base,
    fala: `${c.vezes} vezes ${ancora} é ${base}.`,
  };

  if (ajuste.tipo === "dobrar") {
    return [primeiro, {
      conta: `${base} × 2 = ${total}`,
      resultado: total,
      fala: `E o dobro de ${base} é ${total}.`,
    }];
  }
  const removido = ajuste.grupos * c.vezes;
  if (ajuste.tipo === "tirar_grupos") {
    return [primeiro, {
      conta: `${base} − ${removido} = ${total}`,
      resultado: total,
      fala: `Tirando ${removido} sobram ${total}.`,
    }];
  }
  return [primeiro, {
    conta: `${base} + ${removido} = ${total}`,
    resultado: total,
    fala: `Somando ${removido} dá ${total}.`,
  }];
}

/**
 * Os 10 fatos genuinamente novos — os que não se resolvem por comutatividade
 * a partir de uma tabuada já dominada.
 */
export const FATOS_NOVOS: ReadonlyArray<Conta> = [
  { tabuada: 6, vezes: 6 }, { tabuada: 6, vezes: 7 }, { tabuada: 6, vezes: 8 },
  { tabuada: 6, vezes: 9 }, { tabuada: 7, vezes: 7 }, { tabuada: 7, vezes: 8 },
  { tabuada: 7, vezes: 9 }, { tabuada: 8, vezes: 8 }, { tabuada: 8, vezes: 9 },
  { tabuada: 9, vezes: 9 },
];

/** A escada da ficha F44: uma estratégia por nível, depois tudo junto. */
export function tabuadasDoNivel(nivel: number): number[] {
  switch (nivel) {
    case 1: return [9];
    case 2: return [6];
    case 3: return [8];
    case 4: return [7, 6, 8, 9];
    default: return [2, 3, 4, 5, 6, 7, 8, 9, 10];
  }
}

/** O apoio visual acompanha a construção da estratégia; sai no nível 4. */
export function mostraEstrategia(nivel: number): boolean {
  return nivel <= 3;
}

/**
 * O truque do ×9 que vale mostrar: os dígitos do resultado somam sempre 9, e a
 * dezena é sempre um a menos que o multiplicador. É padrão que encanta e ajuda.
 */
export function digitosSomamNove(valor: number): boolean {
  return String(valor).split("").reduce((t, d) => t + Number(d), 0) % 9 === 0;
}

/**
 * Erros com significado, específicos da estratégia por âncora.
 *
 * `PAROU_NA_ANCORA` e `DIRECAO_ERRADA` são o par que diagnostica de verdade:
 * o primeiro é não ter completado, o segundo é ter completado para o lado
 * errado. Um número vizinho qualquer não distingue os dois.
 */
export function distratores(c: Conta): Distrator[] {
  const certo = resolver(c);
  const base = valorDaAncora(c);
  const { ajuste } = ESTRATEGIA_DE[c.tabuada];

  const paraOLadoErrado = ajuste.tipo === "dobrar"
    ? base + c.vezes            // somou um grupo em vez de dobrar
    : ajuste.tipo === "tirar_grupos"
      ? base + ajuste.grupos * c.vezes   // somou onde era tirar
      : base - ajuste.grupos * c.vezes;  // tirou onde era somar

  const candidatos: Distrator[] = [
    { valor: base, tag: MisconceptionTag.PAROU_NA_ANCORA },
    { valor: paraOLadoErrado, tag: MisconceptionTag.DIRECAO_ERRADA },
    { valor: certo - c.vezes, tag: MisconceptionTag.TABUADA_TROCADA },
    { valor: certo + c.vezes, tag: MisconceptionTag.TABUADA_TROCADA },
  ];

  const vistos = new Set<number>([certo]);
  const validos = candidatos.filter(d => {
    if (d.valor <= 0) return false;
    if (vistos.has(d.valor)) return false;
    vistos.add(d.valor);
    return true;
  });

  // O cânone manda 3 a 4 alternativas na tela (§9.1). Quatro estratégias com
  // dois vizinhos davam CINCO opções — mais escolhas do que uma criança de 8
  // anos consegue varrer, e o excesso de opção vira ruído, não dificuldade.
  // Os dois primeiros são os específicos e ficam sempre; o vizinho entra como
  // terceiro, e um vizinho basta para representar a hipótese.
  return validos.slice(0, MAX_DISTRATORES);
}

/** Três distratores + a resposta = quatro opções, o teto do cânone. */
export const MAX_DISTRATORES = 3;

/**
 * Serve para perguntar?
 *
 * Além das recusas de sempre (`×1` traz a resposta no enunciado; somar
 * coincidindo com multiplicar), exige que os dois erros característicos da
 * âncora sobrevivam — sem eles a questão não distingue quem entendeu a
 * estratégia de quem chutou.
 */
export function ehPergunavelComDiagnostico(c: Conta): boolean {
  if (c.vezes <= 1) return false;
  if (resolver(c) === c.tabuada + c.vezes) return false;
  const tags = new Set(distratores(c).map(d => d.tag));
  return tags.has(MisconceptionTag.PAROU_NA_ANCORA)
    && tags.has(MisconceptionTag.DIRECAO_ERRADA);
}

export function ehTabuadaDificil(tabuada: number): tabuada is TabuadaDificil {
  return (TABUADAS_DIFICEIS as readonly number[]).includes(tabuada);
}

/** Alternativas: a resposta certa primeiro, depois os erros com significado. */
export function alternativas(c: Conta): Distrator[] {
  return [{ valor: resolver(c), tag: "" }, ...distratores(c)];
}
