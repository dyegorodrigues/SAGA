import { MisconceptionTag, MisconceptionTagType } from "../../constants/misconceptions";

/**
 * `AudioChoice` — a ficha F05, N1.06. Ouvir e escolher.
 *
 * ---
 *
 * ### O que a criança aprende (§2)
 *
 * Ligar o **som** do número (*"três"*) ao **símbolo escrito** (`3`).
 *
 * > *"São dois sistemas separados na cabeça da criança. Ela sabe recitar 'um,
 * > dois, três' (som) e vê rabiscos na tela (símbolo) — mas a ponte entre os
 * > dois não é automática. Ela pode contar até 10 perfeitamente e não
 * > reconhecer o '7' escrito."*
 *
 * ### Por que este formato é obrigatório no SAGA
 *
 * A §2 é categórica:
 *
 * > *"É o **único** exercício do app onde a pergunta não depende de leitura.
 * > Sem ele, uma criança de 4 anos precisa de um adulto ao lado para tudo. Com
 * > ele, ela joga sozinha."*
 *
 * ---
 *
 * ### O que esta versão corrigiu, e por que era grave
 *
 * O `gN1_06` escrevia o número **por extenso na tela**:
 *
 * ```ts
 * big: "🔊 " + words[ans].toUpperCase()    // "🔊 TRÊS"
 * ```
 *
 * Ou seja: a única competência do app que existe para **não** depender de
 * leitura era resolvida **lendo**. Uma criança que reconhece a palavra "TRÊS"
 * escrita acerta sem ouvir nada; uma que não lê fica sem a informação que a
 * tela prometeu dar pelo ouvido. O exercício mede o oposto do que a ficha pede,
 * para as duas.
 *
 * E o `AudioChoice` — a primitiva que a ficha nomeia — **existia no código e
 * não estava ligada a lugar nenhum**: nem `case` no Composer, nem no renderer.
 * Estava pronta, órfã, enquanto a competência dela servia texto.
 *
 * ### A regra de design que a §3 impõe
 *
 * > *"A tela é deliberadamente **vazia**. Nada de cenário, nada de mascote,
 * > nada de objeto. Só o botão de som e os numerais. Qualquer elemento extra
 * > compete com a única coisa que importa: o som."*
 *
 * É a única ficha do bloco onde a tela vazia **não** é o defeito §6.6 — aqui o
 * vazio é o conteúdo. O que preenche a tela é o áudio.
 */

/* ------------------------------------------------------------------ *
 *  §5 — os cinco níveis, transcritos
 *
 *  | Nível | Escopo  | Opções | O que muda                          |
 *  |-------|---------|--------|-------------------------------------|
 *  |   1   | 1 a 3   |   2    | números bem distintos (1 e 3)       |
 *  |   2   | 1 a 5   |   3    | inclui vizinhos (2, 3, 4)           |
 *  |   3   | 1 a 10  |   3    | escopo dobra                        |
 *  |   4   | 1 a 10  |   4    | inclui **pares confundíveis** (6/7) |
 *  |   5   | 1 a 20  |   4    | e a voz fala **mais rápido**        |
 * ------------------------------------------------------------------ */

export function escopoDoNivel(nivel: number): { min: number; max: number } {
  if (nivel <= 1) return { min: 1, max: 3 };
  if (nivel === 2) return { min: 1, max: 5 };
  if (nivel <= 4) return { min: 1, max: 10 };
  return { min: 1, max: 20 };
}

export function opcoesDoNivel(nivel: number): number {
  if (nivel <= 1) return 2;
  if (nivel <= 3) return 3;
  return 4;
}

/**
 * A velocidade da fala, como fator do normal.
 *
 * §5, nível 5: *"a voz fala **mais rápido** — reconhecimento automático"*. É a
 * mesma ideia da exposição caindo na JD1: o degrau final não aumenta o número,
 * aumenta a **automaticidade**.
 */
export function velocidadeDoNivel(nivel: number): number {
  return nivel >= 5 ? 1.35 : 1;
}

/**
 * O nível 1 quer números **bem distintos** (§5: "1 e 3").
 *
 * Distintos em quê? No SOM. `1` e `3` são "um" e "três" — nada em comum. `2` e
 * `3` já dividem o encontro consonantal, e a ficha guarda os vizinhos para o
 * nível 2. Por isso o nível 1 exige distância ≥ 2 entre as alternativas.
 */
export function distanciaMinimaDoNivel(nivel: number): number {
  return nivel <= 1 ? 2 : 1;
}

/**
 * O nível 2 **inclui vizinhos** (§5: "2, 3, 4"), e o 4 inclui **pares
 * confundíveis**. Este é o degrau que a ficha chama de dificuldade real:
 *
 * > *"O nível 4 é onde mora a dificuldade real: distinguir 'seis' de 'sete' no
 * > som exige atenção fonológica, não só numérica."*
 */
export function exigeParFonologico(nivel: number): boolean {
  return nivel >= 4;
}

/* ------------------------------------------------------------------ *
 *  Os pares que soam parecido
 * ------------------------------------------------------------------ */

/**
 * Os pares confundíveis **pelo som**, em português.
 *
 * A §5 dá dois exemplos — *"6 e 7"* e *"12 e 21 mais tarde"* — e a §6 dá um
 * terceiro, *"3/13"*. A lista abaixo é o princípio por trás deles, escrito por
 * extenso porque a confusão é fonética e não aritmética:
 *
 * | Par | Por que confunde |
 * |---|---|
 * | 6 · 7 | *seis* e *sete* começam igual e têm a mesma sílaba tônica |
 * | 3 · 13 | *três* está dentro de *treze* |
 * | 2 · 12 | *dois* / *doze* |
 * | 4 · 14 | *quatro* / *quatorze* |
 * | 5 · 15 | *cinco* / *quinze* — só o começo muda |
 * | 6 · 16, 7 · 17, 8 · 18, 9 · 19 | a dezena repete a unidade inteira |
 *
 * **Não é lista de vizinhos numéricos.** `6` e `7` são vizinhos E soam
 * parecido; `3` e `13` estão a dez de distância e confundem mais. Tratar as
 * duas coisas como a mesma faria `CONFUSAO_FONOLOGICA` virar `OFF_BY_ONE` com
 * outro nome, e o Radar mandaria a criança treinar contagem quando o que
 * falhou foi o ouvido.
 */
export const PARES_FONOLOGICOS: [number, number][] = [
  [6, 7],
  [3, 13], [2, 12], [4, 14], [5, 15],
  [6, 16], [7, 17], [8, 18], [9, 19],
];

/** Os números que soam parecido com `n`, dentro do escopo. */
export function confundiveisCom(n: number, max: number): number[] {
  return PARES_FONOLOGICOS
    .flatMap(([a, b]) => (a === n ? [b] : b === n ? [a] : []))
    .filter(v => v >= 1 && v <= max);
}

/** Dois números soam parecido? */
export function soaParecido(a: number, b: number): boolean {
  return PARES_FONOLOGICOS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

/* ------------------------------------------------------------------ *
 *  §6 — o diagnóstico
 * ------------------------------------------------------------------ */

/** A leitura de uma resposta. */
export interface RespostaOuvida {
  resposta: number;
  alvo: number;
  /** As alternativas, na ordem em que a tela as mostrou. */
  alternativas: number[];
  /**
   * Quantas vezes ela apertou o botão para ouvir de novo.
   *
   * §4: *"sem limite de repetições, sem penalidade"*. O número não pune — ele
   * **informa**: acertar depois de cinco audições não é o mesmo reconhecimento
   * que acertar na primeira, e a §9 faz disso critério de domínio.
   */
  repeticoes: number;
}

/**
 * O que a resposta revela — §6, do mais específico ao mais genérico.
 *
 * `NAO_ESCUTOU` vem primeiro porque é sobre **não ter tentado**, e as outras
 * três são sobre ter tentado e falhado. Diagnosticar quem chutou a primeira
 * opção como "confunde vizinho" mandaria treinar discriminação numérica em
 * quem nem apertou o botão.
 */
export function diagnosticar(r: RespostaOuvida): MisconceptionTagType | undefined {
  if (r.resposta === r.alvo) {
    // §9, regra extra: acertar depois de repetir várias vezes não prova
    // reconhecimento. Não é erro — é uma hipótese com peso, que o Radar
    // acumula (§11.4-bis) e que a §9 usa como critério de domínio.
    return r.repeticoes >= 3 ? MisconceptionTag.PRECISA_REPETICAO : undefined;
  }

  // Escolheu a primeira opção da tela sem ter ouvido de novo: não escutou.
  if (r.resposta === r.alternativas[0] && r.repeticoes === 0) {
    return MisconceptionTag.NAO_ESCUTOU;
  }

  if (soaParecido(r.resposta, r.alvo)) return MisconceptionTag.CONFUSAO_FONOLOGICA;
  if (Math.abs(r.resposta - r.alvo) === 1) return MisconceptionTag.CONFUNDE_VIZINHO;
  return MisconceptionTag.CONFUNDE_VIZINHO;
}

/* ------------------------------------------------------------------ *
 *  §7 — as falas, transcritas
 * ------------------------------------------------------------------ */

export const FALAS = {
  audioPrompt: "Aperte e escute. Que número você ouviu?",
  howto: "Aperte o botão azul. Escute bem. Depois toque no número que você ouviu.",
  explain: "Aperte de novo e escute com atenção. Eu vou falar devagar.",
  /**
   * §4, acerto: *"a voz confirma dizendo o número de novo: 'isso! Três!'"*.
   *
   * A confirmação **repete o número**, e não elogia. É o fecho da §4: *"a
   * associação som-símbolo é reforçada no fim"* — o que fixa a ponte é ouvir o
   * som junto do símbolo certo, não ouvir "muito bem".
   */
  acerto: (n: number) => `Isso! ${porExtenso(n)}!`,
  /**
   * §4, erro suave — e o detalhe que a ficha chama de *"o que faz funcionar"*:
   *
   * > *"No erro, a voz **não diz 'errou'** — ela **repete o número pedido**. O
   * > feedback É a informação que faltava."*
   */
  erroSuave: (n: number) => `Eu falei... ${porExtenso(n).toUpperCase()}`,
} as const;

/** Os números por extenso, até vinte — o escopo do nível 5. */
const EXTENSO = [
  "zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito",
  "nove", "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis",
  "dezessete", "dezoito", "dezenove", "vinte",
];

export function porExtenso(n: number): string {
  return EXTENSO[n] ?? String(n);
}
