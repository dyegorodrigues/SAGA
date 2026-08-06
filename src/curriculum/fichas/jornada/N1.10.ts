import { Evidencia } from "../../../constants/evidencias";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { FALAS } from "../../procedimentos/tenFrameProcedure";
import { FichaCompetencia } from "../../schema";

/**
 * JD5 — Ver e imaginar. *Subtração antes de existir símbolo.*
 *
 * ---
 *
 * **O que a criança aprende (§2):** manter uma quantidade **na cabeça** e
 * deduzir a parte que sumiu.
 *
 * **Por que é a mais avançada de F0:** *"exige três coisas ao mesmo tempo —
 * perceber o total, guardá-lo na memória de trabalho, e comparar com o que
 * restou visível. É a primeira operação **mental** do currículo."*
 *
 * **Por que vem antes da subtração escrita:** *"quando a criança encontrar
 * '5 − 2', ela já terá vivido a experiência de ver 5, ver 3, e saber que 2
 * sumiram. O símbolo depois só nomeia o que ela já sabe fazer."*
 *
 * ---
 *
 * ### O que esta versão corrigiu
 *
 * A ficha anterior servia **`bond`** (o diagrama parte-todo) nos cinco níveis —
 * dois círculos embaixo e um em cima, com números escritos. A JD5 §1 nomeia
 * `TenFrame` + `EmojiRow` em flash duplo, e a §3 desenha uma **tampa deslizando
 * sobre parte do grupo**.
 *
 * A diferença não é de aparência. O number bond é a representação **simbólica**
 * do parte-todo: ele já pressupõe que a criança lê números e entende a estrutura
 * — que é a competência N1.10 na faixa F1, e é para onde ela vai depois. A JD5
 * é o que vem **antes**: nenhum símbolo, uma tampa, e a pergunta *"quantos
 * ficaram escondidos?"*.
 *
 * E ela estava **ativa**. A criança recebia o diagrama simbólico onde a ficha
 * pede a operação mental sem símbolo.
 *
 * ### A contagem em voz alta é obrigatória
 *
 * §4: *"a contagem em voz alta na abertura é **obrigatória**. Sem ela, a criança
 * não constrói o total na memória e o exercício vira adivinhação."* É o que os
 * níveis 1 e 2 fazem, e o degrau do nível 3 é justamente tirá-la.
 *
 * ### A escada da §5
 *
 * | Nível | Total | O que esconde | Apoio |
 * |---|---|---|---|
 * | 1 | até 3 | 1 objeto | moldura + contagem em voz alta |
 * | 2 | até 5 | 1 ou 2 | moldura + contagem |
 * | 3 | até 5 | qualquer parte | moldura, **sem contagem** |
 * | 4 | até 10 | qualquer parte | moldura |
 * | 5 | até 10 | qualquer parte | **sem moldura** — objetos soltos |
 */

/**
 * §9: 3 de 3 em 2 sessões — **e a regra extra**: pelo menos um acerto no nível
 * 4+ (total até 10), *"que exige memória de trabalho real"*.
 *
 * Guardar três na cabeça é subitização — a criança vê três sem contar. Guardar
 * oito é memória de trabalho, que é o que esta ficha mede (P13).
 */
const dominio = {
  acertos: 3,
  de: 3,
  sessoes: 2,
  exige: {
    evidencia: Evidencia.TOTAL_ALEM_DE_CINCO,
    descricao: "Acertar uma vez com mais de cinco objetos, guardando o total na memória.",
  },
};

/** §8, transcrita. */
const coreografia = [
  { fala: "Olha bem: um, dois, três.", show: { contarUmAUm: 3 } },
  { fala: "Três!", show: { destacarTodos: true } },
  { fala: "Vou esconder um...", show: { taparN: 1 } },
  { fala: "Quantos escondi?", show: { pulsarTampa: true } },
];

export const N1_10: FichaCompetencia = {
  id: "N1.10",
  nome: "Ver e imaginar (parte-todo mental)",
  strand: "N1",
  faixa: "F1",
  prereqs: ["N1.04", "N1.08"],
  bncc: "EF01MA06",

  howto: FALAS.escondidos.howto,
  explain: FALAS.escondidos.explain,

  distratores: [
    { regra: "n+1", tag: MisconceptionTag.OFF_BY_ONE },
    { regra: "n-1", tag: MisconceptionTag.OFF_BY_ONE },
  ],

  niveis: {
    1: { primitiva: "moldura", micro: "esconde_um", andaime: "mao_fantasma" },
    2: { primitiva: "moldura", micro: "esconde_dois", andaime: "alto" },
    3: { primitiva: "moldura", micro: "sem_contagem", andaime: "medio" },
    4: { primitiva: "moldura", micro: "ate_dez", andaime: "minimo" },
    5: { primitiva: "moldura", micro: "sem_moldura", andaime: "nenhum", rt_alvo: 8000 },
  },

  micros: [
    {
      id: "esconde_um",
      fonte: "JD5",
      alvo: "um objeto some, e a voz contou o total antes — o gesto inteiro em miniatura",
      kinds: ["moldura"],
      params: { modo: "escondidos", audio_prompt: FALAS.escondidos.audioPrompt, tutorial: coreografia },
      dominio,
    },
    {
      id: "esconde_dois",
      fonte: "JD5",
      alvo: "até dois somem: a parte oculta deixa de ser sempre a mesma",
      kinds: ["moldura"],
      params: { modo: "escondidos", audio_prompt: FALAS.escondidos.audioPrompt },
      dominio,
    },
    {
      id: "sem_contagem",
      fonte: "JD5",
      alvo: "SEM a contagem em voz alta: o total tem de ser construído por ela",
      kinds: ["moldura"],
      params: { modo: "escondidos", audio_prompt: FALAS.escondidos.audioPrompt },
      dominio,
    },
    {
      id: "ate_dez",
      fonte: "JD5",
      alvo: "até dez — memória de trabalho de verdade, não subitização",
      kinds: ["moldura"],
      params: { modo: "escondidos", audio_prompt: FALAS.escondidos.audioPrompt },
      dominio,
    },
    {
      id: "sem_moldura",
      fonte: "JD5",
      alvo: "sem a moldura: a imagem mental se sustenta sozinha",
      kinds: ["moldura"],
      params: { modo: "escondidos", audio_prompt: FALAS.escondidos.audioPrompt },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.RESPONDE_O_VISIVEL, descricao: "Respondeu quantos dá para ver: leu a tela em vez de operar." },
    { id: MisconceptionTag.RESPONDE_O_TODO, descricao: "Respondeu o total: não entendeu que a pergunta é sobre a parte oculta." },
    { id: MisconceptionTag.OFF_BY_ONE, descricao: "Fez a operação e errou por um." },
    { id: MisconceptionTag.DEPENDE_DE_ESTRUTURA, descricao: "Acerta com moldura e erra sem: ainda não tem imagem mental estável." },
  ],
};
