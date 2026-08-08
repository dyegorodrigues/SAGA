import { Evidencia } from "../../../constants/evidencias";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { FALAS } from "../../procedimentos/tenFrameProcedure";
import { FichaCompetencia } from "../../schema";

/**
 * N1.10 — uma competencia, duas representacoes.
 *
 * JD5 instala parte-todo sem simbolo; o L5 formaliza a MESMA relacao com o
 * diagrama part-part-whole. A JD5 completa continua no Jardim do Dojo.
 */
const dominio = {
  acertos: 3,
  de: 3,
  sessoes: 2,
  exige: {
    evidencia: Evidencia.TOTAL_ALEM_DE_CINCO,
    descricao: "Acertar uma vez com mais de cinco objetos, guardando o total na memoria.",
  },
};

const coreografiaJD5 = [
  { fala: "Olha bem: um, dois, tres.", show: { contarUmAUm: 3 } },
  { fala: "Tres!", show: { destacarTodos: true } },
  { fala: "Vou esconder um...", show: { taparN: 1 } },
  { fala: "Quantos escondi?", show: { pulsarTampa: true } },
];

const coreografiaBond = [
  { fala: "Este numero de cima e o todo." },
  { fala: "Os dois de baixo sao as partes." },
  { fala: "E a mesma historia: uma parte aparece e a outra estava escondida." },
  { fala: "Descubra a parte que falta." },
];

export const N1_10: FichaCompetencia = {
  id: "N1.10",
  nome: "Parte-todo: do escondido ao number bond",
  strand: "N1",
  faixa: "F1",
  prereqs: ["N1.04", "N1.08"],
  bncc: "EF01MA06",

  howto: "Pense no todo e nas duas partes. Se uma parte e conhecida, descubra a outra.",
  explain: "O todo e formado pelas duas partes juntas. A parte que falta completa o todo.",

  distratores: [],

  niveis: {
    1: { primitiva: "moldura", micro: "esconde_um", andaime: "mao_fantasma" },
    2: { primitiva: "moldura", micro: "esconde_dois", andaime: "alto" },
    3: { primitiva: "moldura", micro: "sem_contagem", andaime: "medio" },
    4: { primitiva: "moldura", micro: "ate_dez", andaime: "minimo" },
    5: { primitiva: "bond", micro: "formaliza_bond", andaime: "nenhum", rt_alvo: 8000 },
  },

  micros: [
    {
      id: "esconde_um",
      fonte: "JD5",
      alvo: "um objeto some, com o total ancorado pela contagem em voz alta",
      kinds: ["moldura"],
      params: {
        modo: "escondidos",
        audio_prompt: FALAS.escondidos.audioPrompt,
        howto: FALAS.escondidos.howto,
        explain: FALAS.escondidos.explain,
        tutorial: coreografiaJD5,
      },
      dominio,
    },
    {
      id: "esconde_dois",
      fonte: "JD5",
      alvo: "ate dois somem: a parte oculta deixa de ser sempre a mesma",
      kinds: ["moldura"],
      params: {
        modo: "escondidos",
        audio_prompt: FALAS.escondidos.audioPrompt,
        howto: FALAS.escondidos.howto,
        explain: FALAS.escondidos.explain,
      },
      dominio,
    },
    {
      id: "sem_contagem",
      fonte: "JD5",
      alvo: "sem a contagem em voz alta: o total tem de ser construido pela crianca",
      kinds: ["moldura"],
      params: {
        modo: "escondidos",
        audio_prompt: FALAS.escondidos.audioPrompt,
        howto: FALAS.escondidos.howto,
        explain: FALAS.escondidos.explain,
      },
      dominio,
    },
    {
      id: "ate_dez",
      fonte: "JD5",
      alvo: "ate dez — memoria de trabalho real antes da formalizacao",
      kinds: ["moldura"],
      params: {
        modo: "escondidos",
        audio_prompt: FALAS.escondidos.audioPrompt,
        howto: FALAS.escondidos.howto,
        explain: FALAS.escondidos.explain,
      },
      dominio,
    },
    {
      id: "formaliza_bond",
      fonte: "F1-parte-todo",
      alvo: "reconhecer no diagrama a mesma relacao todo = parte + parte vivida na JD5",
      kinds: ["bond"],
      params: {
        soma_max: 10,
        whole_min: 4,
        interactive: "part",
        audio_prompt: "O todo esta em cima. Qual parte falta?",
        howto: "O numero de cima e o todo. Os dois de baixo sao as partes.",
        explain: "Junte as duas partes de baixo: elas precisam formar o todo de cima.",
        tutorial: coreografiaBond,
      },
      dominio,
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.RESPONDE_O_VISIVEL, descricao: "Respondeu a parte visivel em vez de inferir a parte oculta." },
    { id: MisconceptionTag.REPETE_A_PARTE, descricao: "No diagrama, repetiu a parte conhecida em vez de completar o todo." },
    { id: MisconceptionTag.RESPONDE_O_TODO, descricao: "Respondeu o todo quando a pergunta pedia a parte ausente." },
    { id: MisconceptionTag.OFF_BY_ONE, descricao: "Fez a relacao parte-todo e errou por um." },
    { id: MisconceptionTag.DEPENDE_DE_ESTRUTURA, descricao: "A relacao ainda depende do apoio perceptual da moldura." },
  ],
};
