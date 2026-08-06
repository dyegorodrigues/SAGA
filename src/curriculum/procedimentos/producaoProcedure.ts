import { MisconceptionTag } from "../../constants/misconceptions";

/**
 * Procedimento da ficha **F04 — Produzir Quantidade** (N1.09).
 *
 * *"O inverso de contar: em vez de ler quantos são, fazer aparecer quantos foram
 * pedidos."*
 *
 * ---
 *
 * ### ⚠️ Divergência declarada: de quem é esta ficha
 *
 * Dois documentos do cânone discordam sobre o id desta competência, e a regra é
 * divergir em voz alta:
 *
 * - **`fichas/FICHAS_F0_COMPLETAS.md`** diz **N1.09** em três lugares — o índice
 *   (linha 40), a §1 da própria ficha e a lista de fechamento do bloco.
 * - **`GRAFO_DE_CONHECIMENTO_SAGA.md`** chama N1.09 de *"Contagem até 20 e a
 *   partir de qualquer número"* e põe *"produzir conjunto: 'me dá N'"* como a
 *   **micro (d) da N1.04** (cardinalidade).
 *
 * Sigo a **ficha**, porque é ela que especifica uma tela, porque é o que o
 * `PLANO_DO_BLOCO_F0.md §1` mapeia, e porque a F04 não caberia na N1.04: aquele
 * nó já tem os cinco degraus da F01 e ainda recebe a F03.
 *
 * **O que isso deixa em aberto, e está registrado como pendência P12:** quatro
 * arestas do grafo (`N1.12`, `N2.01`, `N3.03`, `AL.03`) declaram N1.09 como
 * pré-requisito querendo dizer *"conta até 20 e continua de qualquer número"*.
 * Nenhuma ficha do cânone escreve essa competência. Nada se perde agora — o
 * legado `gVis_Sequence` continua sendo o alvo de rollback —, mas a decisão de
 * dar um nó próprio a "contar até 20" é curricular, e é do dono do cânone.
 *
 * ---
 *
 * ### O que a §2 exige do motor, e por que ele é diferente de todos os outros
 *
 * > *"O auto-encerramento sem timer: as **vagas fantasma** mostram quantas
 * > faltam e encerram sozinhas. **Nunca usar debounce por tempo** — criança
 * > lenta seria penalizada por ser lenta, não por errar."*
 *
 * É a mesma família do §5.1-bis: tempo não é critério de compreensão.
 */

/**
 * O que a cena mostra como andaime — a coluna "vagas fantasma" da §5.
 *
 * - `pulsando` — contornos vazios que pulsam: "aqui falta algo" (nível 1)
 * - `visiveis` — contornos vazios, parados (nível 2)
 * - `contorno` — *"só contorno, sem pulsar"*: mais discreto (nível 3)
 * - `nenhuma` — *"cena livre"*. O salto da ficha (níveis 4 e 5)
 */
export type Vagas = "pulsando" | "visiveis" | "contorno" | "nenhuma";

interface DegrauDaF04 {
  min: number;
  max: number;
  vagas: Vagas;
  bandeja: number;
  /** §5, nível 5: *"o pedido é falado só uma vez, sem repetir"*. */
  repetivel: boolean;
}

/**
 * §5 — os cinco níveis, **transcritos** da tabela da ficha (§6.11: transcrever,
 * não parafrasear).
 *
 * | Nível | Quantidade | Vagas fantasma | Bandeja |
 * |---|---|---|---|
 * | 1 | 1 a 3 | visíveis, pulsando | 5 objetos |
 * | 2 | 1 a 5 | visíveis | 8 objetos |
 * | 3 | 1 a 5 | só contorno, sem pulsar | 8 objetos |
 * | 4 | 1 a 10 | nenhuma vaga — cena livre | 12 objetos |
 * | 5 | 1 a 10 | nenhuma | e o pedido é falado só uma vez |
 *
 * O nível 5 não declara bandeja: herda os 12 do nível 4, que é o único valor
 * compatível com um pedido de até 10 mais excedente. Divergência anotada, não
 * inventada.
 */
const DEGRAUS: Record<number, DegrauDaF04> = {
  1: { min: 1, max: 3, vagas: "pulsando", bandeja: 5, repetivel: true },
  2: { min: 1, max: 5, vagas: "visiveis", bandeja: 8, repetivel: true },
  3: { min: 1, max: 5, vagas: "contorno", bandeja: 8, repetivel: true },
  4: { min: 1, max: 10, vagas: "nenhuma", bandeja: 12, repetivel: true },
  5: { min: 1, max: 10, vagas: "nenhuma", bandeja: 12, repetivel: false },
};

function degrau(nivel: number): DegrauDaF04 {
  return DEGRAUS[Math.min(5, Math.max(1, Math.round(nivel)))];
}

export function escopoDoNivel(nivel: number): { min: number; max: number } {
  const d = degrau(nivel);
  return { min: d.min, max: d.max };
}

export function vagasDoNivel(nivel: number): Vagas {
  return degrau(nivel).vagas;
}

export function bandejaDoNivel(nivel: number): number {
  return degrau(nivel).bandeja;
}

/** §5, nível 5: o pedido é falado **uma vez**. Nos outros, ela pode pedir de novo. */
export function pedidoRepetivel(nivel: number): boolean {
  return degrau(nivel).repetivel;
}

/** Há andaime na tela? É a pergunta que a §9 usa para decidir o domínio. */
export function temAndaime(nivel: number): boolean {
  return vagasDoNivel(nivel) !== "nenhuma";
}

/**
 * ⚠️ A cena **impede** o objeto excedente de colar?
 *
 * ### O conflito real entre a §4 e a §5, e quem o resolve
 *
 * A §4 descreve o excesso como impossível:
 *
 * > *"Ao tentar colocar além do pedido: o objeto **não cola** — volta flutuando
 * > para a bandeja... A voz: 'já colocamos três!'. **O limite físico ensina.**"*
 *
 * A §5 descreve o nível 4 como o oposto:
 *
 * > *"O nível 4 é o salto: sem as vagas, a criança precisa contar enquanto
 * > coloca e **saber parar sozinha**. É a produção de quantidade sem andaime."*
 *
 * Não dá para as duas serem verdade no mesmo nível: se a tela para por ela, ela
 * nunca precisa parar sozinha.
 *
 * **Quem decide é a §9**, e decide sem ambiguidade:
 *
 * > *"Regra extra: pelo menos um acerto **sem vagas fantasma** (nível 4+).
 * > Produzir com o alvo visível não prova cardinalidade produtiva."*
 *
 * Um nível onde a tela trava o excedente é um nível onde **todo mundo acerta** —
 * e um "acerto" que a tela garante não prova nada, então a §9 estaria pedindo
 * uma evidência impossível. Logo o limite físico da §4 vale **onde há vaga
 * fantasma**: é a vaga que é o limite, e ela é o andaime. Some a vaga, some o
 * limite — que é exatamente o que "sem andaime" quer dizer.
 *
 * O mesmo raciocínio que fechou a P1: a ficha já respondia, em outra seção.
 */
export function limitaExcesso(nivel: number): boolean {
  return temAndaime(nivel);
}

/**
 * A cena encerra sozinha quando a última vaga é preenchida (§2).
 *
 * Sem vaga não há como a tela saber que ela terminou — daí o botão "Pronto!",
 * declarado abaixo.
 */
export function encerraSozinha(nivel: number): boolean {
  return temAndaime(nivel);
}

/**
 * ### Divergência declarada nº 2: o botão "Pronto!"
 *
 * A §3 lista três elementos — enunciado, cena, bandeja. Nenhum botão.
 *
 * Mas sem ele **dois pedaços da própria ficha ficam impossíveis**:
 *
 * 1. A §6 exige a tag `PRODUCAO_INCOMPLETA` — *"parou antes (colocou n−1)"*.
 *    Parar antes só é observável se parar for um ato. Sem botão, "parar" é ficar
 *    quieta, e a tela espera para sempre.
 * 2. A §5 exige que o nível 4 ensine a **parar sozinha**. Parar precisa de onde
 *    ser dito.
 *
 * E a §2 fecha a única alternativa: *"nunca usar debounce por tempo"*. Esperar
 * três segundos de silêncio e chamar de fim é exatamente o que ela proíbe.
 *
 * O botão só aparece **depois do primeiro objeto colocado**: na hora do primeiro
 * gesto a tela continua sendo o que a §3 desenha.
 */
export const ROTULO_DE_FECHO = "Pronto!";

/** Números por extenso, com gênero — a voz conta "uma, duas" ou "um, dois". */
const EXTENSO_M = [
  "zero", "um", "dois", "três", "quatro", "cinco",
  "seis", "sete", "oito", "nove", "dez",
];
const EXTENSO_F = [
  "zero", "uma", "duas", "três", "quatro", "cinco",
  "seis", "sete", "oito", "nove", "dez",
];

/**
 * §6.5 — concordância. *"uma, duas, três"* para estrelas; *"um, dois, três"*
 * para dinossauros. A voz que conta errado o gênero do objeto que ela mesma
 * mostrou ensina o erro junto com o número.
 */
export function contar(n: number, genero: "m" | "f"): string {
  const tabela = genero === "f" ? EXTENSO_F : EXTENSO_M;
  return tabela[n] ?? String(n);
}

/** A contagem inteira, do um até n: "uma, duas, três". */
export function contagemAteN(n: number, genero: "m" | "f"): string {
  return Array.from({ length: n }, (_, i) => contar(i + 1, genero)).join(", ");
}

/**
 * §7 — as falas, e a §4 as usa como **conteúdo**, não como enfeite.
 *
 * O `pedido` é o único texto da tela que traz o número. É proposital: esta ficha
 * é o inverso da F05 — aqui o número é dado e a quantidade é produzida.
 */
export const FALAS = {
  /** §7 audioPrompt, com concordância: "Coloque 1 estrela" / "Coloque 3 estrelas". */
  pedido: (n: number, singular: string, plural: string, onde: string): string =>
    `Coloque ${n} ${n === 1 ? singular : plural} ${onde}!`,

  howto: "Pegue uma de cada vez e conte enquanto coloca: uma, duas, três.",

  explain: "Conte em voz alta enquanto coloca. Pare quando chegar no número que eu pedi.",

  /** §4, o encaixe: a voz **conta** — "uma..." — a cada objeto que assenta. */
  aoEncaixar: (quantosJa: number, genero: "m" | "f"): string =>
    `${contar(quantosJa, genero)}...`,

  /**
   * §4, o excesso: *"já colocamos três!"*. Não diz "errou" — repete o alvo, que
   * é a informação que faltava. Mesma regra da F05.
   */
  excesso: (alvo: number, genero: "m" | "f"): string =>
    `Já colocamos ${contar(alvo, genero)}!`,

  /**
   * §4, o fecho: *"uma, duas, três! Três estrelas!"* — a voz conta tudo. É a
   * cardinalidade dita em voz alta: a contagem termina no número que É o total.
   */
  fecho: (alvo: number, genero: "m" | "f", plural: string, singular: string): string => {
    const total = contar(alvo, genero);
    const nome = alvo === 1 ? singular : plural;
    return `${contagemAteN(alvo, genero)}! ${total.charAt(0).toUpperCase()}${total.slice(1)} ${nome}!`;
  },

  /**
   * O erro suave. A §4 não escreve esta fala — ela só descreve o fecho do
   * acerto —, mas os níveis 4 e 5 podem terminar errados e o silêncio ali seria
   * a tela não dizendo nada sobre o que aconteceu. Segue a regra da casa: conta
   * o que está na tela e repete o pedido. Nunca "errou".
   */
  erroSuave: (colocados: number, alvo: number, genero: "m" | "f"): string =>
    `Você colocou ${contar(colocados, genero)}. Eu pedi ${contar(alvo, genero)}.`,
};

/** O que a criança fez com os objetos — a leitura que o Radar recebe. */
export interface AcaoDeProducao {
  /** Quantos objetos ficaram na cena quando ela declarou fim. */
  colocados: number;
  /** Quantos o enunciado pediu. */
  alvo: number;
  /** Quantos objetos a bandeja tinha no começo. */
  bandeja: number;
  /**
   * Quantas vezes ela tentou colocar **além do pedido** e a tela recusou.
   *
   * Só existe onde `limitaExcesso` é verdade. É a única fonte de
   * `NAO_MONITORA_ALVO` nos níveis com vaga: como o excedente é empurrado de
   * volta, o estado final está sempre certo e a hipótese nunca apareceria no
   * repouso. Mesma armadilha do `TUDO_CABE` da F51.
   */
  recusas: number;
  /** Havia vaga fantasma na tela? Decide `DEPENDE_DE_ANDAIME` no histórico. */
  comAndaime: boolean;
}

/**
 * §6 — o diagnóstico.
 *
 * | O que a criança fez | Tag |
 * |---|---|
 * | parou antes (colocou n−1) | `PRODUCAO_INCOMPLETA` |
 * | tentou colocar mais que o pedido | `NAO_MONITORA_ALVO` |
 * | colocou tudo que tinha na bandeja | `IGNORA_QUANTIDADE` |
 * | acerta com vagas, erra sem | `DEPENDE_DE_ANDAIME` |
 *
 * ### A ordem não é a da tabela — é a do §6.8
 *
 * *"Esvaziar a bandeja"* é um caso particular de *"colocar mais que o pedido"*:
 * quem despeja os 12 também passou do 3. Testar `NAO_MONITORA_ALVO` primeiro
 * engoliria `IGNORA_QUANTIDADE` para sempre, e são aulas diferentes — uma
 * criança perdeu a conta, a outra não processou o número. Do mais específico
 * para o mais genérico.
 *
 * `DEPENDE_DE_ANDAIME` não está aqui: ela compara **duas questões** e mora em
 * `dependeDeAndaime`.
 */
export function diagnosticar(acao: AcaoDeProducao): string | undefined {
  const { colocados, alvo, bandeja, recusas } = acao;

  // Esvaziou a bandeja: agiu por impulso, o número não entrou. O mais
  // específico dos três — e ele exige bandeja maior que o pedido, que é
  // justamente por que a §3 manda a bandeja ter excedente.
  if (bandeja > alvo && colocados >= bandeja) return MisconceptionTag.IGNORA_QUANTIDADE;

  // Passou do pedido, ou tentou passar e a tela recusou.
  if (colocados > alvo || recusas > 0) return MisconceptionTag.NAO_MONITORA_ALVO;

  // Parou antes. A ficha exemplifica com n−1, mas qualquer falta é a mesma
  // hipótese: perdeu a conta durante a ação.
  if (colocados < alvo) return MisconceptionTag.PRODUCAO_INCOMPLETA;

  return undefined;
}

/**
 * `DEPENDE_DE_ANDAIME` — *"acerta com vagas, erra sem"*.
 *
 * É a única tag da §6 que **nenhuma questão isolada pode produzir**: ela é uma
 * comparação entre a produção com andaime e sem andaime. Some do app inteiro se
 * o diagnóstico só olhar a questão da vez — e ela é precisamente o que a §9
 * quer medir ao exigir um acerto sem vaga.
 */
export function dependeDeAndaime(historico: AcaoDeProducao[]): boolean {
  const comVaga = historico.filter(a => a.comAndaime);
  const semVaga = historico.filter(a => !a.comAndaime);
  if (comVaga.length === 0 || semVaga.length === 0) return false;
  const acertou = (a: AcaoDeProducao) => a.colocados === a.alvo && a.recusas === 0;
  return comVaga.every(acertou) && semVaga.every(a => !acertou(a));
}

/**
 * §9 — o domínio.
 *
 * `{ acertos: 3, de: 3, sessoes: 2 }` **e** a regra extra: pelo menos um acerto
 * sem vaga fantasma. *"Produzir com o alvo visível não prova cardinalidade
 * produtiva."*
 */
export function dominou(historico: AcaoDeProducao[]): boolean {
  const acertos = historico.filter(a => a.colocados === a.alvo && a.recusas === 0);
  if (acertos.length < 3) return false;
  return acertos.some(a => !a.comAndaime);
}
