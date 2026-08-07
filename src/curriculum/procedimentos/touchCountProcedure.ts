import { Evidencia } from "../../constants/evidencias";
import { MisconceptionTag, MisconceptionTagType } from "../../constants/misconceptions";

/**
 * `TouchCount` — a primitiva que faltava, e as duas competências que ela destrava.
 *
 * ---
 *
 * ### Por que esta primitiva vem antes de todas as outras
 *
 * Ela é a única primitiva de **N1.02** (sequência numérica oral, ficha F27) e de
 * **N1.04** (cardinalidade, ficha F01) — as duas competências mais fundamentais
 * do app. E N1.02 é pré-requisito de N1.04, N1.06, N1.07 e N1.09: metade do
 * bloco N1 depende dela.
 *
 * Enquanto ela não existia, o N1.04 era servido por `emojirow`/`tenframe`: a
 * criança olhava uma fileira e escolhia um número. Ou seja, o app entregava
 * exatamente a conduta que a F01 existe para superar, com o nome da certa.
 *
 * ---
 *
 * ### Os dois modos, e por que são a MESMA primitiva
 *
 * | | `toque` (F01 / N1.04) | `ritmico` (F27 / N1.02) |
 * |---|---|---|
 * | o gesto | tocar cada objeto | disparar o canhão num balão |
 * | o que ele produz | um numeral saltando sobre o objeto | um numeral saltando no centro |
 * | o que fica | o numeral encolhe no canto do objeto | o numeral voa para o contador |
 * | a pergunta | *"quantos foram?"* no teclado | não há: o fecho é a sequência inteira |
 *
 * Eles compartilham a **gramática visual** — e é isso que os torna uma primitiva
 * só, em vez de duas parecidas:
 *
 * > **uma ação = um alvo = um numeral.** O numeral é o produto do ato.
 *
 * ### ⚠️ A decisão de ordem que esta gramática resolve
 *
 * A criança encontra `TouchCount` primeiro em modo **rítmico** (N1.02 não tem
 * pré-requisito) e só depois em modo **toque** (N1.04 ← N1.01, N1.02). Pela
 * regra que governa tudo — *uma tela introduz no máximo UMA coisa nova* — isso
 * seria uma estreia de desenho em cima de conteúdo novo, o defeito §6.36.
 *
 * Não é, por uma razão de projeto: o modo `toque` **retira** o canhão e mantém a
 * gramática. Para a criança, N1.04 não é um desenho novo — é o mesmo desenho com
 * menos coisas. Quem inverte essa ordem, ou deixa as duas telas divergirem na
 * gramática, transforma o passo seguinte numa estreia de verdade.
 */

export type ModoDeContagem = "toque" | "ritmico";

/** Como os objetos estão dispostos. É um degrau de dificuldade (F01 §5). */
export type ArranjoDeContagem = "fila" | "grade" | "disperso";

/* ------------------------------------------------------------------ *
 *  Modo `toque` — ficha F01 §5, transcrita
 *
 *  | Nível | Quantidade | Arranjo  | Teclado | Andaime                   |
 *  |-------|------------|----------|---------|---------------------------|
 *  |   1   | 1 a 3      | fila     | 1-3     | Mão Fantasma toca os dois primeiros |
 *  |   2   | 1 a 5      | fila     | 1-5     | criança sozinha           |
 *  |   3   | 1 a 5      | grade    | 1-5     | linhas e colunas          |
 *  |   4   | 1 a 10     | disperso | 1-10    | o degrau difícil          |
 *  |   5   | 1 a 10     | disperso | 1-10    | SEM marcação de cor       |
 * ------------------------------------------------------------------ */

/** Quantos objetos, no máximo, o nível põe na tela. */
export function tetoDoToque(nivel: number): number {
  if (nivel <= 1) return 3;
  if (nivel <= 3) return 5;
  return 10;
}

/** A disposição. Espalhar é mais difícil que enfileirar. */
export function arranjoDoToque(nivel: number): ArranjoDeContagem {
  if (nivel <= 2) return "fila";
  if (nivel === 3) return "grade";
  return "disperso";
}

/**
 * O objeto tocado muda de cor?
 *
 * **O nível 5 é o desmame do andaime.** Sem a marcação, a criança precisa
 * segurar mentalmente quais já contou — é a transição para a contagem mental.
 * Manter a cor no 5 apagaria a única coisa que o nível 5 ensina.
 */
export function marcaComCor(nivel: number): boolean {
  return nivel <= 4;
}

/** O teclado é escalado ao escopo: não se oferece o 10 a quem viu três objetos. */
export function tetoDoTeclado(nivel: number): number {
  return tetoDoToque(nivel);
}

/* ------------------------------------------------------------------ *
 *  Modo `ritmico` — ficha F27 §5, transcrita
 *
 *  | Nível | Balões | Apoio                        | O que muda            |
 *  |-------|--------|------------------------------|-----------------------|
 *  |   1   |   3    | numeral + voz + Mão Fantasma | máximo                |
 *  |   2   |   5    | numeral + voz                | sozinha               |
 *  |   3   |  10    | numeral + voz                | escopo dobra          |
 *  |   4   |  10    | SÓ voz, sem numeral na tela  | segura a sequência    |
 *  |   5   |  10    | "continue de 4: cinco…"      | contar a partir de    |
 * ------------------------------------------------------------------ */

/** Quantos balões o nível põe no ar. */
export function baloesDoNivel(nivel: number): number {
  if (nivel <= 1) return 3;
  if (nivel === 2) return 5;
  return 10;
}

/**
 * O numeral aparece escrito na tela?
 *
 * No nível 4 some: *"só voz, sem numeral na tela"* — ela precisa segurar a
 * sequência mentalmente. A voz continua, porque a competência é **oral**.
 */
export function mostraNumeral(nivel: number): boolean {
  return nivel <= 3;
}

/**
 * Quantos alvos a cena já traz FEITOS quando abre.
 *
 * ### O que estava errado
 *
 * O nível 5 é a ponte para somar: continuar de um número dado, em vez de
 * recomeçar do 1, é a estratégia `counting-on`. A primeira versão implementou
 * isso deslocando a numeração — a criança estourava dez balões e os números
 * saíam 2, 3, … 11.
 *
 * Duas coisas quebravam:
 *
 * 1. **Não havia âncora.** Dez balões idênticos e intactos, e o enunciado
 *    dizendo *"continuando de 2"*. De onde? A criança não tinha como saber, e o
 *    deslocamento da numeração é invisível para quem não lê número.
 * 2. **A conta saía do escopo.** Dez balões a partir do 2 terminam em 11, e a
 *    ficha inteira trabalha até dez.
 *
 * ### O que a ficha pede
 *
 * A F27 §5 escreve o apoio assim: *"continue de 4: cinco, seis…"*. Ou seja,
 * **alguém já contou até quatro** — e é isso que a tela tem de mostrar. Os
 * balões já estourados são a âncora, e ela é física, não numérica: funciona no
 * nível 4 e 5, onde o numeral escrito nem aparece.
 *
 * Assim a sequência continua sendo 1 a 10, a criança faz de `jaFeitos + 1` até
 * o fim, e ela vê exatamente de onde continuar.
 */
export function jaFeitosNoNivel(nivel: number, sorteio = 0): number {
  if (nivel < 5) return 0;
  // 2 a 5 já feitos: o bastante para "continue de N" ser visivelmente diferente
  // de recomeçar, e pouco o bastante para sobrar contagem de verdade.
  return 2 + (sorteio % 4);
}

/** A Mão Fantasma age junto — só no nível 1, nos dois modos. */
export function temMaoFantasma(nivel: number): boolean {
  return nivel <= 1;
}

/**
 * Quantos alvos a Mão Fantasma faz antes de passar a vez.
 *
 * A F01 §5 diz **dois** ("toca os dois primeiros, narrando") e a F27 §8 mostra
 * **um** na coreografia ("vou estourar um" → "agora você estoura"). Não é
 * inconsistência das fichas: no canhão, um disparo já ensina o ritmo inteiro;
 * na contagem, dois toques são precisos para mostrar que o numeral **avança**.
 * Um só toque mostraria o numeral aparecendo, não a sequência.
 */
export function alvosDaMaoFantasma(nivel: number, modo: ModoDeContagem): number {
  if (!temMaoFantasma(nivel)) return 0;
  return modo === "toque" ? 2 : 1;
}

/* ------------------------------------------------------------------ *
 *  O que a criança fez — e o que isso revela
 * ------------------------------------------------------------------ */

/** A leitura da ação, entregue pelo palco. */
export interface AcaoDeContagem {
  /** Quantos alvos distintos ela marcou. */
  marcados: number;
  /** Quantos alvos a cena tinha. */
  total: number;
  /** Toques em alvo já contado. Não é erro; é sinal. */
  toquesRepetidos: number;
  /**
   * Ela voltou a tocar os objetos DEPOIS de a pergunta aparecer.
   *
   * É o marco da F01: contar de novo para responder *"quantos são?"* significa
   * que o último número não respondeu à pergunta — soou como o nome do último
   * objeto, não como a quantidade do conjunto.
   */
  recontouAntesDeResponder?: boolean;
  /** O que ela escolheu no teclado, quando houve pergunta. */
  resposta?: number;
  /** No nível 5 rítmico: de que número ela de fato começou. */
  comecouDe?: number;
  /** Ela já acertou esta competência num arranjo `fila`? Vem do histórico. */
  acertouEmFila?: boolean;
  /** O arranjo desta cena. */
  arranjo?: ArranjoDeContagem;
}

/**
 * O erro que a ação revela — ou `undefined` quando não há erro conceitual.
 *
 * A ordem é deliberada. `NAO_TEM_CARDINALIDADE` vem **primeiro** entre os erros
 * de resposta porque é o marco cognitivo da ficha: uma criança que reconta para
 * responder pode até acertar o número, e acertar não apaga o que ela revelou.
 * Diagnosticar pelo número escolhido, e só por ele, deixaria passar exatamente
 * a coisa que a F01 foi escrita para detectar.
 */
export function diagnosticar(a: AcaoDeContagem): MisconceptionTagType | undefined {
  // Rítmico, nível 5: começar do 1 quando mandaram continuar do 4.
  if (a.comecouDe !== undefined && a.comecouDe === 1) {
    return MisconceptionTag.NAO_CONTA_A_PARTIR_DE;
  }

  // Ação: agiu mais vezes do que havia alvo.
  if (a.marcados > a.total) return MisconceptionTag.EXCESSO_ACAO;

  // O marco. Vem antes de olhar o número escolhido, de propósito.
  if (a.recontouAntesDeResponder) return MisconceptionTag.NAO_TEM_CARDINALIDADE;

  // Ação: parou no meio.
  if (a.resposta === undefined && a.marcados < a.total) {
    return MisconceptionTag.CONTAGEM_INCOMPLETA;
  }

  if (a.resposta !== undefined && a.resposta !== a.total) {
    if (a.resposta === a.total + 1) return MisconceptionTag.RECONTOU;
    if (a.resposta === a.total - 1) return MisconceptionTag.PULOU;
    // Errar no disperso quem já acerta em fila é depender do apoio espacial.
    // Sem o histórico da fila, isto é só um erro — e dizer "depende de ordem"
    // de quem nunca acertou em lugar nenhum seria inventar um diagnóstico.
    if (a.arranjo === "disperso" && a.acertouEmFila) {
      return MisconceptionTag.DEPENDE_DE_ORDEM;
    }
    return MisconceptionTag.OFF_BY_ONE;
  }

  return undefined;
}

/** Contou tudo, uma vez cada, e disse o total. */
export function contagemPerfeita(a: AcaoDeContagem): boolean {
  if (a.marcados !== a.total) return false;
  if (a.recontouAntesDeResponder) return false;
  if (a.resposta !== undefined && a.resposta !== a.total) return false;
  return true;
}

/* ------------------------------------------------------------------ *
 *  As falas — F01 §7 e F27 §7
 * ------------------------------------------------------------------ */

/**
 * O que a voz diz quando a criança toca um alvo já contado.
 *
 * **F01 §4, regra inviolável nº 2: silêncio é proibido.** Todo toque produz
 * alguma resposta, mesmo o repetido — e sem penalidade, sem X. Um toque que não
 * responde ensina que o app quebrou, não que o objeto já foi contado.
 */
export const FALA_DO_REPETIDO = "Esse já contamos!";

/** A pergunta do fecho, no modo `toque`. Vem depois de 800ms de silêncio. */
export const PERGUNTA_DO_FECHO = "Quantos foram?";

/**
 * A evidência da §9 que ESTA resposta carrega (P13).
 *
 * F01 §9: *"pelo menos um acerto no arranjo **disperso**"* — contar em fila não
 * prova cardinalidade, prova que ela segue um caminho.
 */
export function evidenciasDe(acao: AcaoDeContagem): string[] {
  const certo = acao.marcados === acao.total && acao.resposta === acao.total;
  return certo && acao.arranjo === "disperso" ? [Evidencia.ARRANJO_DISPERSO] : [];
}
