import { MisconceptionTag } from "../../../constants/misconceptions";
import { FALAS } from "../../procedimentos/emojiRowProcedure";
import { FichaCompetencia } from "../../schema";

/**
 * JD1 — O Olhômetro. Bater o olho e saber quantos, sem contar.
 *
 * ---
 *
 * **O que a criança aprende:** reconhecer quantidades pequenas
 * **instantaneamente**, sem contar um a um.
 *
 * **Por que é competência separada:** subitização é uma capacidade perceptual
 * distinta da contagem. É o que permite depois "ver" 7 como 5+2 em vez de contar
 * sete vezes — a base de todo cálculo mental.
 *
 * **Por que o tempo curto É o exercício (§2):** se os objetos ficam na tela, a
 * criança conta um a um e a competência **não é treinada**. O sumiço é o que
 * força a percepção global.
 *
 * ### ⚠️ `excecaoCPA: "perceptual"`
 *
 * Não existe "olhômetro abstrato". Ela sobe por **automaticidade** — mais itens,
 * menos tempo, arranjo mais difícil —, nunca por abstração.
 *
 * ---
 *
 * ### O que esta versão corrigiu, e a pendência P1
 *
 * A ficha declarava `emojirow` com um `flash_ms` só, igual nos cinco níveis, e a
 * tela era o `EmojiRow` legado: ele monta, pisca e mostra um 🙈. Faltava a §4
 * inteira — a preparação, a regressiva, o silêncio, a revelação — e faltava a §8.
 *
 * Isso era a **pendência P1** (`PLANO_DO_BLOCO_F0 §7`): o `EmojiRow` estreando
 * em modo *flash* num nó **raiz** do grafo, sem nenhuma competência antes onde a
 * criança tivesse visto a fileira parada.
 *
 * A resolução está inteira em `emojiRowProcedure`, e o resumo é: o degrau que
 * faltava já estava escrito na §4 e na §8 desta ficha, e ninguém tinha
 * implementado. A micro-aula do nível 1 pisca uma quantidade de **demonstração**,
 * diz quanto era e mostra parada — sem cobrar nada. É o "nível zero que ensina o
 * desenho antes de cobrar a matemática" do Padrão Ouro §6.36.
 *
 * ### ⚠️ Divergência declarada — a coreografia do nível 3
 *
 * A §8 escreve coreografia só para o nível 1. O nível 3 troca o arranjo para
 * **padrão de dado**, e o padrão de dado é uma figura que a criança nunca viu:
 * estrear ali sem uma palavra é exatamente o §6.36 outra vez, dentro da ficha
 * que acabou de resolvê-lo.
 *
 * Acrescentei uma coreografia de um beat no nível 3, que revela o dado parado e
 * o nomeia. Divergir da ficha é permitido; divergir em silêncio, não.
 */

/** §9: critério **mais frouxo de propósito** — subitização tem ruído perceptual. */
const dominio = { acertos: 4, de: 5, sessoes: 2 };

/**
 * §8, transcrita.
 *
 * O `flash: { n: 2 }` é a quantidade de **demonstração**: ela não é a pergunta.
 * O `revelar: 2` é a fileira PARADA — o degrau *plain* que a escada não tinha.
 */
const coreografiaDoNivel1 = [
  { fala: "Prepare o olho!", show: { fixarOlhar: true } },
  { fala: "Já!", show: { flash: { n: 2, ms: 1500 } } },
  { fala: "Viu? Eram dois.", show: { revelar: 2 } },
];

/** Divergência declarada: o padrão de dado precisa ser apresentado. */
const coreografiaDoDado = [
  { fala: "Agora eles fazem um desenho, igual ao do dado.", show: { revelar: 3 } },
  { fala: "Olhe o desenho inteiro, não um por um.", show: { fixarOlhar: true } },
];

export const N1_03: FichaCompetencia = {
  id: "N1.03",
  nome: "Subitização perceptual (Olhômetro)",
  strand: "N1",
  faixa: "F0",
  // Raiz do grafo: `grafo_saga.ts` dá `prereqs: []` a N1.03, e é o grafo que
  // governa o desbloqueio. A lista que estava aqui (`["N1.01","N1.02"]`) não
  // valia nada em runtime e escondia a P1 de quem lesse só a ficha.
  prereqs: [],
  bncc: "EI03ET07",
  excecaoCPA: "perceptual",

  howto: FALAS.olhometro.howto,
  // §7: "o explain desta ficha é o mais delicado do app. Ele NUNCA pode dizer
  // 'conte com calma' — isso destrói a competência". Há teste que cobra.
  explain: FALAS.olhometro.explain,

  // `n+1`/`n-1` no formato que o Composer casa por valor; as outras duas vivem
  // em `tagDaAlternativa`, porque falam de posição na tela e de histórico, não
  // de aritmética.
  distratores: [
    { regra: "n+1", tag: MisconceptionTag.OFF_BY_ONE },
    { regra: "sempre a alternativa do meio", tag: MisconceptionTag.CHUTE_SEGURO },
    { regra: "erra no disperso e acerta com formato", tag: MisconceptionTag.DEPENDE_DE_FORMATO },
  ],

  // §5: a escada sobe por AUTOMATICIDADE. Quantidade, exposição e arranjo saem
  // do nível em `emojiRowProcedure` — a tabela mora lá, transcrita uma vez só.
  niveis: {
    1: { primitiva: "fileira", micro: "estreia", andaime: "mao_fantasma" },
    2: { primitiva: "fileira", micro: "fila", andaime: "alto" },
    3: { primitiva: "fileira", micro: "dado", andaime: "medio" },
    4: { primitiva: "fileira", micro: "dado_rapido", andaime: "minimo" },
    5: { primitiva: "fileira", micro: "disperso", andaime: "nenhum", rt_alvo: 1500 },
  },

  micros: [
    {
      id: "estreia",
      alvo: "ver o desenho parado antes de vê-lo sumir — e então reconhecer 1 ou 2 num relance",
      kinds: ["fileira"],
      params: {
        modo: "flash",
        audio_prompt: FALAS.olhometro.audioPrompt,
        tutorial: coreografiaDoNivel1,
      },
      dominio,
    },
    {
      id: "fila",
      alvo: "reconhecer até 3 numa fila, com menos tempo",
      kinds: ["fileira"],
      params: { modo: "flash", audio_prompt: FALAS.olhometro.audioPrompt },
      dominio,
    },
    {
      id: "dado",
      alvo: "usar a figura do dado como apoio — o andaime perceptual antes do disperso",
      kinds: ["fileira"],
      params: {
        modo: "flash",
        audio_prompt: FALAS.olhometro.audioPrompt,
        tutorial: coreografiaDoDado,
      },
      dominio,
    },
    {
      id: "dado_rapido",
      alvo: "sustentar o reconhecimento até 5, com a exposição caindo",
      kinds: ["fileira"],
      params: { modo: "flash", audio_prompt: FALAS.olhometro.audioPrompt },
      dominio,
    },
    {
      id: "disperso",
      alvo: "reconhecer SEM figura de apoio: quantidade, não formato",
      kinds: ["fileira"],
      params: { modo: "flash", audio_prompt: FALAS.olhometro.audioPrompt },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.OFF_BY_ONE, descricao: "Tentou contar e perdeu — clássico de quem não subitiza." },
    { id: MisconceptionTag.CHUTE_SEGURO, descricao: "Não viu e escolheu a opção central." },
    { id: MisconceptionTag.DEPENDE_DE_FORMATO, descricao: "Erra mais no disperso que no padrão: subitiza só com apoio estrutural." },
  ],
};
