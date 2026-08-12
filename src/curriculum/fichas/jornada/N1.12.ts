import { Evidencia } from "../../../constants/evidencias";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { FichaCompetencia } from "../../schema";

/**
 * F19 — A reta numérica até 20.
 *
 * O número deixa de ser apenas sequência recitada e vira posição/movimento em
 * um espaço ordenado. A precisão de dedo nunca é a competência: o palco resolve
 * snap/hitbox primeiro e só depois o endpoint vira evidência matemática.
 */
export const N1_12: FichaCompetencia = {
  id: "N1.12",
  nome: "Reta Numérica até 20",
  strand: "N1",
  faixa: "F0/F1",
  prereqs: ["N1.07", "N1.09"],
  bncc: "EF01MA05",

  howto: "Arraste o foguete pela reta ou toque no lugar onde ele deve pousar.",
  explain: "Cada número mora em uma posição. Para saltar, conte os espaços entre as marcas e observe a direção.",
  // Os erros dependem da ação/posição e são emitidos pelo procedure F19.
  distratores: [],

  niveis: {
    1: { primitiva: "numberline", micro: "localizar_0_10", andaime: "mao_fantasma" },
    2: { primitiva: "numberline", micro: "saltar_frente_0_10", andaime: "alto" },
    3: { primitiva: "numberline", micro: "saltar_tras_0_10", andaime: "medio" },
    4: { primitiva: "numberline", micro: "localizar_parcial_0_20", andaime: "minimo" },
    // F19 não fixa RT. 7s é alvo OPERACIONAL silencioso para observabilidade do
    // runtime (contrato global das fichas), nunca requisito de mastery/recompensa.
    5: { primitiva: "numberline", micro: "saltos_variaveis", andaime: "nenhum", rt_alvo: 7000 },
  },

  micros: [
    {
      id: "localizar_0_10",
      fonte: "F19",
      alvo: "localizar números de 0 a 10 como posições ordenadas na reta",
      kinds: ["numberline"],
      params: {
        tutorial: [
          { fala: "Esta é a reta dos números.", show: { desenharReta: true } },
          { fala: "Os números moram aqui, em ordem.", show: { destacarExtremos: true } },
          { fala: "Onde mora este número?", show: { pulsarAlvo: true } },
          { fala: "Leve o foguete até lá!", show: { maoFantasma: true } },
        ],
      },
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "saltar_frente_0_10",
      fonte: "F19",
      alvo: "usar a reta para produzir saltos para frente entre 0 e 10",
      kinds: ["numberline"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "saltar_tras_0_10",
      fonte: "F19",
      alvo: "usar a reta para produzir saltos para trás entre 0 e 10",
      kinds: ["numberline"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "localizar_parcial_0_20",
      fonte: "F19",
      alvo: "localizar posições até 20 quando quase todos os numerais estão ocultos",
      kinds: ["numberline"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "saltos_variaveis",
      fonte: "F19",
      alvo: "produzir saltos de tamanho e direção variáveis entre 0 e 20",
      kinds: ["numberline"],
      params: {},
      dominio: {
        acertos: 3,
        de: 3,
        sessoes: 2,
        exige: {
          evidencia: Evidencia.SALTO_PARA_TRAS,
          descricao: "acertar pelo menos um salto para trás para provar movimento bidirecional na reta",
        },
      },
    },
  ],

  erros_tipicos: [
    {
      id: MisconceptionTag.OFF_BY_ONE,
      descricao: "Pousa uma posição antes ou depois; pode estar contando o ponto de partida como se fosse um salto.",
    },
    {
      id: MisconceptionTag.INVERTE_DIRECAO,
      descricao: "Move para o lado oposto ao pedido; ainda não estabilizou frente e trás na reta.",
    },
    {
      id: MisconceptionTag.CONTA_MARCAS,
      descricao: "Conta as marcas visitadas em vez dos intervalos percorridos entre duas posições.",
    },
    {
      id: MisconceptionTag.SEM_SENSO_ESPACIAL,
      descricao: "Quando os numerais somem, posiciona o número longe da região proporcional esperada.",
    },
  ],
};