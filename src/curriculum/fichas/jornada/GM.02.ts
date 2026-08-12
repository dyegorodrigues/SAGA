import { MisconceptionTag } from "../../../constants/misconceptions";
import { FichaCompetencia } from "../../schema";

/** P22.5 — GM.02: Tempo cotidiano pré-leitor. */
export const GM_02: FichaCompetencia = {
  id: "GM.02",
  nome: "Tempo cotidiano",
  strand: "GM",
  faixa: "F0",
  prereqs: [],
  bncc: "EI03ET07",

  howto: "Ouça a situação e use as pistas de rotina, sequência e passagem do tempo.",
  explain: "O tempo cotidiano tem uma ordem: partes do dia mudam, ontem vem antes de hoje, amanhã vem depois, e os acontecimentos também seguem sequências.",

  // O builder procedimental cria as alternativas porque precisa preservar
  // áudio por opção e distinguir apenas erros temporalmente causais.
  distratores: [],

  niveis: {
    1: { primitiva: "plain", micro: "partes_dia", andaime: "alto" },
    2: { primitiva: "plain", micro: "relativos", andaime: "medio" },
    3: { primitiva: "plain", micro: "semana", andaime: "medio" },
    4: { primitiva: "plain", micro: "ordem_eventos", andaime: "minimo" },
    // Metadado de fluência/Dojo. Nunca reprova domínio conceitual da Jornada.
    5: { primitiva: "plain", micro: "misto", andaime: "minimo", rt_alvo: 12000 },
  },

  micros: [
    {
      id: "partes_dia",
      fonte: "P22_GM02",
      alvo: "reconhecer manhã, tarde e noite por pistas de rotina e iluminação",
      kinds: ["plain"],
      params: { modo: "time_daypart", audio_primary: true },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
    {
      id: "relativos",
      fonte: "P22_GM02",
      alvo: "distinguir ontem, hoje e amanhã em uma pequena linha temporal",
      kinds: ["plain"],
      params: { modo: "time_relative", audio_primary: true },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
    {
      id: "semana",
      fonte: "P22_GM02",
      alvo: "localizar o dia anterior e o seguinte na sequência semanal",
      kinds: ["plain"],
      params: { modo: "weekday_next", audio_primary: true },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
    {
      id: "ordem_eventos",
      fonte: "P22_GM02",
      alvo: "ordenar três acontecimentos cotidianos por primeiro, depois e por último",
      kinds: ["plain"],
      params: { modo: "time_event_order", audio_primary: true },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
    {
      id: "misto",
      fonte: "P22_GM02",
      alvo: "alternar partes do dia, relativos temporais, semana e ordem de eventos sem pista de formato",
      kinds: ["plain"],
      params: { modo: "time_mixed", audio_primary: true },
      dominio: { acertos: 4, de: 5, sessoes: 2 },
    },
  ],

  erros_tipicos: [
    { id: MisconceptionTag.DIRECAO_ERRADA, descricao: "Inverte antes/depois na sequência dos dias." },
    { id: MisconceptionTag.OFF_BY_ONE, descricao: "Salta um dia e responde o vizinho do vizinho." },
    { id: MisconceptionTag.ORDEM_ERRADA, descricao: "Troca a ordem causal de uma rotina cotidiana." },
  ],
};