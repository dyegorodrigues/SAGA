import { MisconceptionTag } from "../../../constants/misconceptions";
import { FichaCompetencia } from "../../schema";

/**
 * F21 — A dezena.
 *
 * Dez unidades podem ser agrupadas e tratadas como UMA unidade de ordem
 * superior. A criança precisa fazer a troca; ver a barra pronta não instala o
 * conceito. O nível 4 inverte a direção e é a evidência bidirecional exigida.
 */
export const N2_01: FichaCompetencia = {
  id: "N2.01",
  nome: "Dezena e Unidades (Sistema Decimal)",
  strand: "N2",
  faixa: "F1",
  prereqs: ["N1.09", "N1.11"],
  bncc: "EF01MA04",

  howto: "Cada dez cubinhos viram uma barra. A barra vale dez.",
  explain: "Conte quantas barras você tem e quantos cubinhos sobraram.",
  // Os três erros F21 dependem do gesto/contexto; o palco emite a ação ao Radar.
  distratores: [],

  niveis: {
    1: { primitiva: "tens", micro: "agrupar_ate_19", andaime: "mao_fantasma" },
    2: { primitiva: "tens", micro: "agrupar_ate_39", andaime: "alto" },
    3: { primitiva: "tens", micro: "agrupar_sem_moldura", andaime: "nenhum" },
    4: { primitiva: "tens", micro: "montar_do_numeral", andaime: "minimo" },
    // RT silencioso: observabilidade/fluência; nunca concede mastery.
    5: { primitiva: "tens", micro: "decompor_mentalmente", andaime: "nenhum", rt_alvo: 10000 },
  },

  micros: [
    {
      id: "agrupar_ate_19",
      fonte: "F21",
      alvo: "agrupar manualmente até 19 e viver a troca de dez unidades por uma dezena",
      kinds: ["tens"],
      params: {
        tutorial: [
          { fala: "Vamos juntar de dez em dez.", show: { pulsarMoldura: true } },
          { fala: "Um, dois, três...", show: { preencherAte: 10 } },
          { fala: "Dez! Viraram uma barra!", show: { fundirEmBarra: true } },
          { fala: "Isso é uma dezena.", show: { destacarBarra: true } },
        ],
      },
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "agrupar_ate_39",
      fonte: "F21",
      alvo: "repetir ciclos manuais de agrupamento de dez em dez até 39",
      kinds: ["tens"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "agrupar_sem_moldura",
      fonte: "F21",
      alvo: "agrupar quantidades até 99 sem a moldura de apoio",
      kinds: ["tens"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "montar_do_numeral",
      fonte: "F21",
      alvo: "receber o numeral e montar corretamente suas dezenas e unidades",
      kinds: ["tens"],
      params: {},
      dominio: {
        acertos: 3,
        de: 3,
        sessoes: 2,
        exige: {
          evidencia: "montou-do-numeral",
          descricao: "montar corretamente o material a partir do numeral, provando compreensão bidirecional",
        },
      },
    },
    {
      id: "decompor_mentalmente",
      fonte: "F21",
      alvo: "decompor mentalmente um numeral em dezenas e unidades sem material",
      kinds: ["tens"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
  ],

  erros_tipicos: [
    {
      id: MisconceptionTag.IGNORA_VALOR,
      descricao: "Conta barras e cubinhos como se valessem a mesma coisa; não reconhece que a barra vale dez.",
    },
    {
      id: MisconceptionTag.INVERTE_ORDENS,
      descricao: "Inverte dezenas e unidades; por exemplo, lê ou monta 23 como 32.",
    },
    {
      id: MisconceptionTag.NAO_AGRUPA,
      descricao: "Continua contando um a um e não usa a dezena como unidade composta.",
    },
  ],
};
