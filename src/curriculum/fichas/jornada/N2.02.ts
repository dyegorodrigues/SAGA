import { FichaCompetencia } from "../../schema";
import { Quadrado100Evidence, Quadrado100Misconception } from "../../procedimentos/quadrado100Semantics";

/**
 * F36 — Números até cem.
 *
 * A malha 10×10 não é decoração: a criança produz os deslocamentos que tornam
 * visível o sistema decimal. Uma casa à direita é +1; uma linha abaixo, na
 * mesma coluna, é +10. O legado `tens` reconhece um numeral pronto e não prova
 * essa leitura espacial do padrão.
 */
export const N2_02: FichaCompetencia = {
  id: "N2.02",
  nome: "Números até 100",
  strand: "N2",
  faixa: "F1",
  prereqs: ["N2.01"],

  howto: "Dez a mais é sempre uma casa para baixo, na mesma coluna.",
  explain: "Olhe a coluna: todos os números dela terminam com o mesmo algarismo.",
  // O diagnóstico nasce do percurso tocado, não de alternativa estática.
  distratores: [],

  niveis: {
    1: { primitiva: "quadrado100", micro: "linha_um_a_um", andaime: "alto" },
    2: { primitiva: "quadrado100", micro: "coluna_dez_em_dez", andaime: "medio" },
    3: { primitiva: "quadrado100", micro: "padrao_cinco", andaime: "minimo" },
    4: { primitiva: "quadrado100", micro: "vizinhos", andaime: "nenhum" },
    // O cânone F36 não fixa um número de segundos próprio. O catálogo, porém,
    // exige rt_alvo positivo no L5 de toda ficha de Jornada. Usamos 10 s como
    // alvo observacional conservador, alinhado ao N2.01: relógio silencioso para
    // fluência/Dojo, nunca critério de acerto, mastery ou recompensa.
    5: { primitiva: "quadrado100", micro: "lacunas_espalhadas", andaime: "nenhum", rt_alvo: 10000 },
  },

  micros: [
    {
      id: "linha_um_a_um",
      fonte: "F36",
      alvo: "usar a ordem horizontal do quadro para continuar uma sequência de um em um",
      kinds: ["quadrado100"],
      params: {
        // §6.36: Quadrado100 estreia aqui; a gramática visual precisa ser
        // ensinada antes de ser cobrada pelo primeiro Padrão Ouro que a usa.
        tutorial: [
          { fala: "Este quadro vai de um até cem.", show: { destacarCasa: 34 } },
          { fala: "Uma casa para a direita é um a mais.", show: { ligarCasas: [34, 35] } },
          { fala: "Uma casa para baixo é dez a mais.", show: { ligarCasas: [34, 44] } },
        ],
      },
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "coluna_dez_em_dez",
      fonte: "F36",
      alvo: "contar de dez em dez descendo na mesma coluna do quadro",
      kinds: ["quadrado100"],
      params: {},
      dominio: {
        acertos: 3,
        de: 3,
        sessoes: 2,
        exige: {
          evidencia: Quadrado100Evidence.PERCURSO_VERTICAL,
          descricao: "concluir corretamente pelo menos um percurso vertical de dez em dez",
        },
      },
    },
    {
      id: "padrao_cinco",
      fonte: "F36",
      alvo: "continuar uma sequência de cinco em cinco lendo sua trajetória no quadro",
      kinds: ["quadrado100"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "vizinhos",
      fonte: "F36",
      alvo: "achar +1, -1, +10 ou -10 a partir de qualquer casa válida",
      kinds: ["quadrado100"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "lacunas_espalhadas",
      fonte: "F36",
      alvo: "localizar numerais em casas espalhadas usando linha, coluna e vizinhança como referência",
      kinds: ["quadrado100"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
  ],

  erros_tipicos: [
    {
      id: Quadrado100Misconception.CONFUNDE_DIRECAO,
      descricao: "Anda horizontalmente quando a tarefa pede dez a mais ou dez a menos.",
    },
    {
      id: Quadrado100Misconception.NAO_VE_PADRAO_DEZENA,
      descricao: "Erra o vizinho vertical e não preserva a coluna/unidade ao variar uma dezena.",
    },
    {
      id: Quadrado100Misconception.SO_CONTA_UM_A_UM,
      descricao: "Tenta substituir um salto de dez por uma sequência de passos horizontais de um em um.",
    },
  ],
};
