import { MisconceptionTag } from "../../../constants/misconceptions";
import { FALAS } from "../../procedimentos/tenFrameProcedure";
import { FichaCompetencia } from "../../schema";

const dominioJD3 = { acertos: 4, de: 5, sessoes: 2 };
const dominioF28 = { acertos: 4, de: 4, sessoes: 3 };

const coreografiaJD3 = [
  { fala: "Prepare o olho!", show: { moldura: { vazia: true } } },
  { fala: "Ja!", show: { flash: { tenframe: 8, ms: 1500 } } },
  { fala: "Faltavam dois.", show: { preencherFaltantes: 2 } },
];

const coreografiaBond = [
  { fala: "Agora o dez virou o todo do diagrama." },
  { fala: "Uma parte ja esta aqui." },
  { fala: "Qual e a outra parte que fecha dez?" },
];

export const N1_11: FichaCompetencia = {
  id: "N1.11",
  nome: "Amigos do 10: ver, estruturar e simbolizar",
  strand: "N1",
  faixa: "F1",
  prereqs: ["N1.08", "N1.10"],
  bncc: "EF01MA06",

  howto: "Pense no par que fecha dez. As duas partes juntas precisam formar 10.",
  explain: "Veja a parte que ja temos e a parte que falta: juntas formam dez.",

  distratores: [],

  niveis: {
    1: { primitiva: "moldura", micro: "jd3_faltam_um_dois", andaime: "mao_fantasma" },
    2: { primitiva: "moldura", micro: "jd3_faltam_ate_quatro", andaime: "alto" },
    3: { primitiva: "bond", micro: "f28_bond", andaime: "medio" },
    4: { primitiva: "plain", micro: "f28_simbolo", andaime: "minimo" },
    5: { primitiva: "plain", micro: "f28_simbolo", andaime: "nenhum", rt_alvo: 3000 },
  },

  micros: [
    {
      id: "jd3_faltam_um_dois",
      fonte: "JD3",
      alvo: "ver um vazio pequeno como quantidade, sem contar casa por casa",
      kinds: ["moldura"],
      params: {
        modo: "faltam",
        audio_prompt: FALAS.faltam.audioPrompt,
        howto: FALAS.faltam.howto,
        explain: FALAS.faltam.explain,
        tutorial: coreografiaJD3,
      },
      dominio: dominioJD3,
    },
    {
      id: "jd3_faltam_ate_quatro",
      fonte: "JD3",
      alvo: "o vazio cresce, mas continua sendo percebido como uma parte",
      kinds: ["moldura"],
      params: {
        modo: "faltam",
        audio_prompt: FALAS.faltam.audioPrompt,
        howto: FALAS.faltam.howto,
        explain: FALAS.faltam.explain,
      },
      dominio: dominioJD3,
    },
    {
      id: "f28_bond",
      fonte: "F28",
      alvo: "o 10 vira o todo do number bond; a parte ausente deixa de depender da moldura",
      kinds: ["bond"],
      params: {
        soma_max: 10,
        whole_fixed: 10,
        interactive: "part",
        audio_prompt: "O todo e dez. Qual parte falta?",
        howto: "O 10 e o todo. As duas partes de baixo precisam completar dez.",
        explain: "Junte mentalmente as duas partes: o resultado precisa ser 10.",
        tutorial: coreografiaBond,
      },
      dominio: dominioF28,
    },
    {
      id: "f28_simbolo",
      fonte: "F28",
      alvo: "transferir o amigo do 10 para a sentenca n + caixa = 10",
      kinds: ["plain"],
      params: {
        complemento_dez: true,
        audio_prompt: "Quanto falta para completar dez?",
        howto: "Use o par que voce ja viu na moldura e no diagrama.",
        explain: "A caixa e a parte que falta para as duas partes formarem dez.",
      },
      dominio: dominioF28,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.RESPONDE_O_CHEIO, descricao: "Na moldura, disse quantas fichas ha em vez de quantas faltam." },
    { id: MisconceptionTag.SEM_ANCORA_CINCO, descricao: "Ainda nao usa a fileira de cinco como unidade." },
    { id: MisconceptionTag.REPETE_A_PARTE, descricao: "No diagrama/conta, repetiu a parte conhecida." },
    { id: MisconceptionTag.RESPONDE_O_TODO, descricao: "Respondeu 10 quando a pergunta pedia o complemento." },
    { id: MisconceptionTag.SO_FUNCIONA_VISUAL, descricao: "Acerta com representacao visual e ainda falha na sentenca simbolica." },
    { id: MisconceptionTag.OFF_BY_ONE, descricao: "Conhece o par, mas errou por uma unidade." },
  ],
};
