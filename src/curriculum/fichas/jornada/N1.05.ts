import { MisconceptionTag } from "../../../constants/misconceptions";
import { FichaCompetencia } from "../../schema";

/**
 * F06 — Qual tem mais.
 *
 * Comparação de quantidades não progride retirando os objetos e mostrando
 * numerais. O eixo correto é perceptual: diferença óbvia → próxima → tamanho
 * enganoso → espalhamento enganoso. O primitive canônico é Grupo; em runtime a
 * ficha usa o canal `grandeza`, cujo palco é composto por Grupo e discrimina
 * `modo: quantidade` no specialized builder da porta de canário.
 *
 * `rt_alvo` é relógio silencioso: alimenta fluência/telemetria, nunca domínio.
 */
export const N1_05: FichaCompetencia = {
  id: "N1.05",
  nome: "Comparar quantidades",
  strand: "N1",
  faixa: "F0",
  // O Curriculum Graph é a autoridade causal: N1.05 depende de cardinalidade.
  // Subitização ajuda, mas não é pré-requisito de desbloqueio para parear grupos.
  prereqs: ["N1.04"],
  bncc: "EI03ET07",

  howto: "Faça um par de cada vez: um daqui, um dali. Quem sobrar tem mais.",
  explain: "Não olhe o tamanho do monte. Ligue um de cada lado e veja quem sobra.",
  distratores: [],

  niveis: {
    1: { primitiva: "grandeza", micro: "diferenca_obvia", andaime: "mao_fantasma" },
    2: { primitiva: "grandeza", micro: "diferenca_clara", andaime: "alto" },
    3: { primitiva: "grandeza", micro: "quantidades_proximas", andaime: "medio" },
    4: { primitiva: "grandeza", micro: "tamanho_engana", andaime: "baixo" },
    5: { primitiva: "grandeza", micro: "espaco_engana", andaime: "nenhum", rt_alvo: 8000 },
  },

  micros: [
    {
      id: "diferenca_obvia",
      fonte: "F06",
      alvo: "comparar dois grupos com diferença grande e aprender o pareamento",
      kinds: ["grandeza"],
      params: {
        // Adendo normativo §7.1-bis: demonstra o primeiro gesto e devolve a tela.
        // Nunca mostra a sobra inteira antes de a criança responder.
        tutorial: [
          { fala: "Olha os dois grupos.", show: { destacarAmbos: true } },
          { fala: "Vou ligar um de cada lado.", show: { parear: 0 } },
          { fala: "Agora compare você.", show: { pulsarGrupos: true } },
        ],
      },
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "diferenca_clara",
      fonte: "F06",
      alvo: "comparar grupos ainda claros, com pareamento disponível sob demanda",
      kinds: ["grandeza"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "quantidades_proximas",
      fonte: "F06",
      alvo: "comparar quantidades vizinhas sem julgar pelo volume visual",
      kinds: ["grandeza"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "tamanho_engana",
      fonte: "F06",
      alvo: "ignorar o tamanho dos objetos e comparar a quantidade",
      kinds: ["grandeza"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "espaco_engana",
      fonte: "F06",
      alvo: "conservar quantidade quando o grupo menor ocupa mais espaço",
      kinds: ["grandeza"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
  ],

  erros_tipicos: [
    {
      id: MisconceptionTag.CONSERVACAO_ESPACO,
      descricao: "Escolheu o grupo que ocupa mais espaço, não o que tem mais itens.",
    },
    {
      id: MisconceptionTag.CONFUNDE_TAMANHO_QUANTIDADE,
      descricao: "Escolheu objetos maiores como se tamanho físico fosse quantidade.",
    },
    {
      id: MisconceptionTag.COMPARA_SEM_CONTAR,
      descricao: "Acerta diferenças grandes e perde as próximas porque julga só pela percepção global.",
    },
  ],
};