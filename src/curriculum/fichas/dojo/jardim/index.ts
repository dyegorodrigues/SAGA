import { FichaCompetencia } from "../../../schema";
import { FALAS } from "../../../procedimentos/emojiRowProcedure";
import { MisconceptionTag } from "../../../../constants/misconceptions";

/**
 * O Jardim do Dojo — a fluência **pré-simbólica**.
 *
 * ---
 *
 * ### O que é, segundo o cânone
 *
 * `DOJO_SAGA.md §7`: três camadas, uma escada natural — *"primeiro o olho
 * (Jardim) → depois o fato (FD) → depois o procedimento (PD)"*. O Jardim treina
 * o que a criança de 4 anos consegue automatizar antes de ler numeral: o
 * olhômetro, a mão, a moldura.
 *
 * > *"A resposta ao 'e o meu filho de 4?': fluência pré-simbólica existe, e é a
 * > MAIS importante — é o alicerce perceptual de todo cálculo mental futuro."*
 *
 * ### Por que este arquivo nasce agora (pendência P7)
 *
 * O Jardim **não existia em código**. `src/curriculum/fichas/dojo/` tinha só as
 * quatro trilhas Sensei (FD), e mesmo elas como geradores soltos. As cinco
 * trilhas JD1–JD5 viviam apenas no Markdown.
 *
 * Isso criou um problema real ao construir o N1.08: a JD2 §5 tem **cinco**
 * degraus (uma mão canônica → uma mão livre → duas mãos com uma cheia → duas
 * livres → duas sem cheia) e a Jornada do N1.08 só tem cinco no total, três dos
 * quais pertencem à F02 (a moldura de dez). Dois degraus da JD2 cabiam; três
 * ficavam sem lugar.
 *
 * A saída **não** é encolher a JD2 nem espremer a F02: é servir cada uma no
 * lugar que o cânone lhe dá. A Jornada recebe os dois primeiros degraus da mão —
 * que são o que a §2 chama de *"o degrau que falta entre o Olhômetro e a Moldura
 * de Dez"* — e o Jardim recebe a trilha inteira, que é onde a ficha diz que
 * também mora (*"Também é trilha do Dojo (JD2)"*).
 *
 * **Nenhum exercício se perde.** Os cinco níveis das duas trilhas existem,
 * geram questão e são verificados por teste. O que ainda não existe é o motor
 * que os apresenta à criança — o Jardim é um pilar autônomo do Dojo (§7) e
 * merece o próprio passo, não uma carona no passo da primitiva.
 *
 * ### A diferença entre uma trilha do Jardim e uma competência da Jornada
 *
 * | | Jornada | Jardim |
 * |---|---|---|
 * | mede | compreensão | **automaticidade** |
 * | sobe quando | domina o conceito | fica mais **rápida** no que já entende |
 * | o `rt_alvo` | não reprova (§5.1-bis) | é o instrumento |
 * | destrava por | pré-requisitos do grafo | a competência-mãe chegar ao nível 3 |
 *
 * Por isso as trilhas daqui **não entram no grafo** nem em `JOURNEY_FICHAS`:
 * elas não são nós de currículo, são treino de uma competência que já existe.
 */

/** A competência-mãe de cada trilha, e o nível dela que destrava o treino. */
export interface TrilhaDoJardim {
  ficha: FichaCompetencia;
  /** O nó da Jornada que esta trilha automatiza. */
  mae: string;
  /** O nível da mãe a partir do qual a trilha abre (§7: "destravam pelas N1"). */
  destravaNoNivel: number;
}

/** Critério do Jardim: automaticidade tem ruído; o critério é frouxo de propósito. */
const dominio = { acertos: 4, de: 5, sessoes: 2 };

/**
 * JD1 — Olhômetro Relâmpago. Mãe: N1.03.
 *
 * Os cinco níveis são os da §5 da ficha, os mesmos que a Jornada serve — aqui
 * eles são percorridos por velocidade, em rounds de 6 a 10 itens (§7), e não
 * por domínio conceitual.
 */
export const JD1: FichaCompetencia = {
  id: "JD1",
  nome: "Jardim · Olhômetro Relâmpago",
  strand: "JD",
  faixa: "F0",
  prereqs: ["N1.03"],
  excecaoCPA: "perceptual",
  howto: FALAS.olhometro.howto,
  explain: FALAS.olhometro.explain,
  distratores: [
    { regra: "n+1", tag: MisconceptionTag.OFF_BY_ONE },
    { regra: "n-1", tag: MisconceptionTag.OFF_BY_ONE },
  ],
  niveis: {
    1: { primitiva: "fileira", micro: "relance", rt_alvo: 4000 },
    2: { primitiva: "fileira", micro: "relance", rt_alvo: 3500 },
    3: { primitiva: "fileira", micro: "relance", rt_alvo: 3000 },
    4: { primitiva: "fileira", micro: "relance", rt_alvo: 2500 },
    5: { primitiva: "fileira", micro: "relance", rt_alvo: 2000 },
  },
  micros: [{
    id: "relance",
    alvo: "o olho ficando anzan: reconhecer sem contar, cada vez mais rápido",
    kinds: ["fileira"],
    fonte: "JD1",
    params: { modo: "flash", audio_prompt: FALAS.olhometro.audioPrompt },
    dominio,
  }],
  erros_tipicos: [
    { id: MisconceptionTag.OFF_BY_ONE, descricao: "Tentou contar e perdeu o fio." },
    { id: MisconceptionTag.DEPENDE_DE_FORMATO, descricao: "Subitiza só com apoio estrutural." },
  ],
};

/**
 * JD2 — A Mão Relâmpago. Mãe: N1.08.
 *
 * **Aqui os cinco degraus da §5 existem inteiros**, inclusive os três de duas
 * mãos que não cabem na escada da Jornada. É a resolução da P7: a Jornada
 * instala a âncora do 5 (níveis 1 e 2, uma mão); o Jardim automatiza a
 * decomposição *"uma mão cheia e dois — sete"* até virar reflexo.
 */
export const JD2: FichaCompetencia = {
  id: "JD2",
  nome: "Jardim · A Mão Relâmpago",
  strand: "JD",
  faixa: "F0",
  prereqs: ["N1.08"],
  excecaoCPA: "perceptual",
  howto: FALAS.mao.howto,
  // §7 da JD2, e o veto em negrito: nunca "conte os dedos".
  explain: FALAS.mao.explain,
  distratores: [
    { regra: "n+1", tag: MisconceptionTag.OFF_BY_ONE },
    { regra: "n-1", tag: MisconceptionTag.OFF_BY_ONE },
    { regra: "n-5", tag: MisconceptionTag.IGNORA_SEGUNDA_MAO },
  ],
  niveis: {
    1: { primitiva: "fileira", micro: "mao", rt_alvo: 4000 },
    2: { primitiva: "fileira", micro: "mao", rt_alvo: 3500 },
    // A partir daqui são os degraus que a Jornada não comporta: duas mãos.
    3: { primitiva: "fileira", micro: "mao", rt_alvo: 3000 },
    4: { primitiva: "fileira", micro: "mao", rt_alvo: 2500 },
    5: { primitiva: "fileira", micro: "mao", rt_alvo: 2000 },
  },
  micros: [{
    id: "mao",
    alvo: "a sub-base 5 virando reflexo: 7 é 'uma mão e dois', sem contar",
    kinds: ["fileira"],
    fonte: "JD2",
    params: {
      modo: "flash-mao",
      audio_prompt: FALAS.mao.audioPrompt,
      howto: FALAS.mao.howto,
      explain: FALAS.mao.explain,
    },
    dominio,
  }],
  erros_tipicos: [
    { id: MisconceptionTag.ANCORA_CINCO_RIGIDA, descricao: "Fixou 'mão = 5' e não vê a variação." },
    { id: MisconceptionTag.IGNORA_SEGUNDA_MAO, descricao: "Não integra os dois conjuntos." },
  ],
};

/**
 * As trilhas do Jardim que já têm primitiva.
 *
 * JD3 (moldura relâmpago) e JD5 (ver e imaginar) dependem do `TenFrame`, que é
 * o passo 3 do `PLANO_DO_BLOCO_F0`. Entram lá, e não aqui, para não nascerem
 * apontando para uma primitiva que ainda vai ser reescrita. JD4 (próximo passo)
 * usa `NumberLine` e pertence ao passo 5.
 */
export const JARDIM: TrilhaDoJardim[] = [
  { ficha: JD1, mae: "N1.03", destravaNoNivel: 3 },
  { ficha: JD2, mae: "N1.08", destravaNoNivel: 3 },
];

export const JARDIM_FICHAS: FichaCompetencia[] = JARDIM.map(t => t.ficha);
