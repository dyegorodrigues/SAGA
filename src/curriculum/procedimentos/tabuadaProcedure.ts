import { MisconceptionTag } from "../../constants/misconceptions";

/**
 * Procedimento das tabuadas de padrão visível — ficha F42, competência N4.03.
 *
 * A ordem NÃO é numérica. ×2, ×5 e ×10 vêm primeiro porque têm regularidade
 * óbvia e, juntas, cobrem 30 dos 100 fatos. A criança aprende três regras em vez
 * de memorizar trinta fatos soltos.
 *
 * Camada pura: não sabe que existe tela. Nada aqui menciona pixel, cor ou
 * componente — é o que permite exercitá-lo com centenas de amostras em
 * milissegundos.
 */

/** As três tabuadas de padrão visível, na ordem em que se ensinam. */
export const TABUADAS_COM_PADRAO = [10, 5, 2] as const;
export type TabuadaComPadrao = (typeof TABUADAS_COM_PADRAO)[number];

/** O maior "outro fator" em jogo — mantém tudo dentro do quadro de 100. */
export const OUTRO_FATOR_MAX = 10;

export interface Multiplicacao {
  /** A tabuada: 10, 5 ou 2. */
  tabuada: TabuadaComPadrao;
  /** Quantas vezes ela é tomada. */
  vezes: number;
}

/**
 * O padrão que a criança descobre — não que lhe é ensinado.
 *
 * O texto existe aqui, e não na camada de conteúdo, porque é conhecimento
 * matemático: é a razão de a tabuada estar nesta lista.
 */
export const PADRAO_DA_TABUADA: Record<TabuadaComPadrao, string> = {
  10: "todos terminam em zero",
  5: "todos terminam em zero ou cinco",
  2: "são todos os números pares",
};

/** Quais tabuadas o nível apresenta. Níveis 1–3 isolam; 4–5 misturam. */
export function tabuadasDoNivel(nivel: number): TabuadaComPadrao[] {
  switch (nivel) {
    case 1: return [10];
    case 2: return [5];
    case 3: return [2];
    default: return [...TABUADAS_COM_PADRAO];
  }
}

/**
 * Os apoios visuais, exatamente como a tabela da ficha F42 os distribui:
 *
 * | nível | apoio          |
 * |-------|----------------|
 * | 1     | arranjo + saltos |
 * | 2     | arranjo + quadro |
 * | 3     | arranjo + quadro |
 * | 4     | só símbolo     |
 * | 5     | só símbolo, com alvo de tempo |
 *
 * Os três eixos são independentes de propósito. Se saíssem juntos, dois níveis
 * adjacentes ficariam iguais na prática — a armadilha 6.3 do Padrão Ouro.
 */

/** O quadro de 100 mostra o padrão. Entra no 2 e sai no 4. */
export function mostraQuadroDeCem(nivel: number): boolean {
  return nivel === 2 || nivel === 3;
}

/** O arranjo retangular mostra a multiplicação como forma. */
export function mostraArranjo(nivel: number): boolean {
  return nivel <= 3;
}

/**
 * Os saltos na reta numérica: contar de dez em dez, de cinco em cinco.
 *
 * Só no nível 1, e de propósito — é a estratégia de contagem saltada que a
 * ficha quer ensinar antes de qualquer padrão. No nível 2 ela já deu lugar ao
 * quadro, que mostra a regularidade em vez do procedimento.
 */
export function mostraSaltos(nivel: number): boolean {
  return nivel === 1;
}

/** Onde cada salto começa e termina: 0→10, 10→20, 20→30… */
export function saltosDe({ tabuada, vezes }: Multiplicacao): { de: number; para: number }[] {
  return Array.from({ length: vezes }, (_, i) => ({
    de: i * tabuada,
    para: (i + 1) * tabuada,
  }));
}

export function resolver({ tabuada, vezes }: Multiplicacao): number {
  return tabuada * vezes;
}

/** Os múltiplos que se pintam no quadro de 100, revelando as colunas. */
export function multiplosAteCem(tabuada: TabuadaComPadrao): number[] {
  const multiplos: number[] = [];
  for (let n = tabuada; n <= 100; n += tabuada) multiplos.push(n);
  return multiplos;
}

export interface Distrator {
  valor: number;
  tag: string;
}

/**
 * Erros com significado diagnóstico, do mais específico para o mais genérico.
 *
 * A ordem importa: quando dois erros produzem o MESMO número, o primeiro da
 * lista vence. Sem isso, a hipótese genérica encobre a específica e o Radar
 * aprende menos do que poderia. (Armadilha 6.8 do Padrão Ouro.)
 */
export function distratores(situacao: Multiplicacao): Distrator[] {
  const { tabuada, vezes } = situacao;
  const certo = resolver(situacao);

  const candidatos: Distrator[] = [
    // Confundiu a operação: somou onde era para multiplicar.
    { valor: tabuada + vezes, tag: MisconceptionTag.SOMA_OS_FATORES },
    // Memorizou a lista sem o padrão: devolve um múltiplo vizinho.
    { valor: certo - tabuada, tag: MisconceptionTag.TABUADA_TROCADA },
    { valor: certo + tabuada, tag: MisconceptionTag.TABUADA_TROCADA },
  ];

  const vistos = new Set<number>([certo]);
  return candidatos.filter(d => {
    // Distrator que não é positivo não ensina nada e confunde quem não lê.
    if (d.valor <= 0) return false;
    // Distrator repetido daria duas alternativas idênticas na tela.
    if (vistos.has(d.valor)) return false;
    vistos.add(d.valor);
    return true;
  });
}

/**
 * Uma multiplicação é boa para perguntar?
 *
 * Rejeita os casos em que acertar deixa de significar entender.
 *
 * 1. **Tomar uma vez só.** Em `10 × 1` a resposta é 10, que está escrito no
 *    próprio enunciado. Quem não sabe multiplicar repete o número visível e
 *    acerta por sorte — e o Radar registra um acerto que não aconteceu.
 * 2. **Somar dá o mesmo que multiplicar.** Em `2 × 2`, somar os fatores também
 *    dá 4. O distrator de operação trocada viraria resposta certa.
 *
 * Os dois são a mesma armadilha que N3.10 já havia pago (6.2 do Padrão Ouro),
 * reaparecendo numa competência sem nenhuma relação com aquela.
 */
export function ehPergunavelComDiagnostico(situacao: Multiplicacao): boolean {
  if (situacao.vezes <= 1) return false;
  const certo = resolver(situacao);
  if (certo === situacao.tabuada + situacao.vezes) return false;
  return distratores(situacao).length >= 2;
}

/** As alternativas da tela: a resposta certa e os distratores com significado. */
export function alternativas(situacao: Multiplicacao): Distrator[] {
  return [{ valor: resolver(situacao), tag: "" }, ...distratores(situacao)];
}
