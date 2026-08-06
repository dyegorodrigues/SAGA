import { MisconceptionTag } from "../../../constants/misconceptions";
import { FALAS } from "../../procedimentos/emojiRowProcedure";
import { FichaCompetencia } from "../../schema";

/**
 * F52 — O que vem depois? Padrões, e o começo do pensamento algébrico.
 *
 * ---
 *
 * **O que a criança aprende (§2):** identificar a **regra de repetição** e
 * continuar a sequência.
 *
 * **Por que é pré-álgebra:** encontrar o padrão é encontrar a **regra geral**. É
 * a mesma operação mental de descobrir a fórmula, décadas antes de existir letra.
 *
 * **Por que trava:** ela copia os últimos elementos sem perceber a unidade de
 * repetição. Vê ●▲●▲● e responde ● porque foi o último que viu, não porque
 * entendeu o AB. Por isso `COPIA_ULTIMO` não é um erro entre outros: é **o
 * alvo** da ficha, e o diagnóstico que a olha primeiro.
 *
 * ---
 *
 * ### Esta ficha não existia em runtime
 *
 * O AL.02 era servido por `gAL_02`, que devolve sempre a **mesma questão**:
 * `🔴🔵🔴🔵🔴` com duas alternativas, ignorando o nível. Os cinco degraus da §5 —
 * AAB, ABC, lacuna no meio, padrão crescente — não existiam, e a competência
 * inteira cabia numa linha de código.
 *
 * ### O terceiro degrau da escada do `EmojiRow`
 *
 * O modo `padrao` é o **último** degrau da escada (`PLANO §3`), e ele chega bem:
 * o AL.02 tem `AL.01` como pré-requisito e a criança já viu a fileira parada na
 * revelação da JD1. A sequência daqui **não some** — fica na tela enquanto ela
 * pensa —, então o degrau anterior (relance) já a alfabetizou de sobra.
 *
 * ### ⚠️ Divergência declarada — copiar × continuar
 *
 * A §3 desenha em ASCII a variante "**copie o padrão**": o modelo em cima e uma
 * fila de vagas vazias embaixo, para a criança repetir a sequência inteira. Mas
 * o título da ficha é *"O que vem depois?"*, o enunciado da §3 item 1 é
 * *"O que vem depois?"*, a §5 fala em **lacuna** (no fim, e no meio no nível 4) e
 * a §8 termina em `pulsarLacuna`. Quatro seções descrevem a variante de lacuna e
 * uma o desenho de cópia.
 *
 * Implementei a **lacuna**. Copiar a fila inteira é outro exercício — mede
 * memória visual e precisão motora junto com o padrão —, e escolhê-lo contra
 * quatro seções seria seguir o desenho e ignorar a ficha. Registro aqui para
 * quem ler as duas coisas lado a lado encontrar a divergência explicada, como
 * manda o §5 da RETOMADA.
 */

/** §9: `{ acertos: 3, de: 3, sessoes: 2 }` — incluindo um padrão que não seja AB. */
const dominio = { acertos: 3, de: 3, sessoes: 2 };

/**
 * §8, transcrita.
 *
 * `molduraUnidade` aparece duas vezes de propósito: a §4 diz que a moldura
 * **desliza mostrando cada repetição**. Um único enquadramento mostraria um
 * pedaço; dois mostram que o pedaço se REPETE, que é a competência inteira.
 */
const coreografia = [
  { fala: "Olha o padrão.", show: { destacarSequencia: true } },
  { fala: "Bola, triângulo.", show: { molduraUnidade: [0, 1] } },
  { fala: "E de novo!", show: { molduraUnidade: [2, 3] } },
  { fala: "O que vem agora?", show: { pulsarLacuna: true } },
];

export const AL_02: FichaCompetencia = {
  id: "AL.02",
  nome: "Padrões de repetição",
  strand: "AL",
  faixa: "F0",
  prereqs: ["AL.01"],
  bncc: "EI03ET05",

  howto: FALAS.padrao.howto,
  explain: FALAS.padrao.explain,

  distratores: [
    { regra: "repete o último elemento visto", tag: MisconceptionTag.COPIA_ULTIMO },
    { regra: "peça do banco que não continua a unidade", tag: MisconceptionTag.NAO_VE_UNIDADE },
  ],

  // §5: a escada cresce em ESTRUTURA — a unidade de repetição fica maior, depois
  // muda de lugar, depois deixa de ser um conjunto e vira um passo. Nenhum degrau
  // aumenta só a quantidade de peças, que seria escada falsa (Padrão Ouro §1).
  niveis: {
    1: { primitiva: "fileira", micro: "ab", andaime: "mao_fantasma" },
    2: { primitiva: "fileira", micro: "aab_abb", andaime: "alto" },
    3: { primitiva: "fileira", micro: "abc", andaime: "medio" },
    4: { primitiva: "fileira", micro: "lacuna_no_meio", andaime: "minimo" },
    // `rt_alvo` alimenta a trilha FD do Dojo, nunca o domínio na Jornada
    // (adendo v3.1, §5.1-bis: "relógio silencioso").
    5: { primitiva: "fileira", micro: "crescente", andaime: "nenhum", rt_alvo: 12000 },
  },

  micros: [
    {
      id: "ab",
      alvo: "ver o pedaço que se repete num padrão AB e continuar a sequência",
      kinds: ["fileira"],
      params: { modo: "padrao", audio_prompt: FALAS.padrao.audioPrompt, tutorial: coreografia },
      dominio,
    },
    {
      id: "aab_abb",
      alvo: "a unidade tem três peças: contar o pedaço, não o último elemento",
      kinds: ["fileira"],
      params: { modo: "padrao", audio_prompt: FALAS.padrao.audioPrompt },
      dominio,
    },
    {
      id: "abc",
      alvo: "três elementos distintos: nenhuma peça se repete dentro da unidade",
      kinds: ["fileira"],
      params: { modo: "padrao", audio_prompt: FALAS.padrao.audioPrompt },
      dominio,
    },
    {
      id: "lacuna_no_meio",
      alvo: "a lacuna muda de lugar: continuar deixa de ser 'olhar o último'",
      kinds: ["fileira"],
      params: { modo: "padrao", audio_prompt: FALAS.padrao.audioPrompt },
      dominio,
    },
    {
      id: "crescente",
      alvo: "padrão que muda de TAMANHO — a ponte para a sequência numérica (AL.03/AL.04)",
      kinds: ["fileira"],
      params: { modo: "padrao", audio_prompt: FALAS.padrao.audioPrompt },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.COPIA_ULTIMO, descricao: "Repetiu o último elemento visto: não identificou a unidade de repetição. É o alvo da ficha." },
    { id: MisconceptionTag.NAO_VE_UNIDADE, descricao: "Escolheu uma peça que não continua a regra: não achou o pedaço que se repete." },
    { id: MisconceptionTag.SO_AB, descricao: "Resolve o AB e erra assim que a unidade cresce." },
  ],
};
