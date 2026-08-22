import { FichaCompetencia } from "../../schema";
import { VisualAdditionEvidence, VisualAdditionMisconception } from "../../procedimentos/visualAdditionSemantics";

/**
 * F13 — Juntar Dois Grupos.
 *
 * O contêiner preserva a identidade das parcelas; a ação de juntar transforma
 * duas partes em um total. A retirada progressiva dos objetos é intencional:
 * objetos+numerais → numerais nos contêineres → símbolo puro.
 */
export const N3_01: FichaCompetencia = {
  id: "N3.01",
  nome: "Adição concreta: juntar e acrescentar (até 10)",
  strand: "N3",
  faixa: "F1",
  prereqs: ["N1.04", "N1.10"],

  howto: "Guarde o número maior na cabeça e conte só os do outro grupo.",
  explain: "Junte os dois grupos e conte todos. Comece pelo grupo que tem mais.",
  distratores: [
    { regra: "repetir uma das parcelas sem juntar os grupos", tag: VisualAdditionMisconception.REPETE_PARCELA },
    { regra: "responder total mais ou menos um", tag: VisualAdditionMisconception.OFF_BY_ONE },
    { regra: "subtrair uma parcela da outra", tag: VisualAdditionMisconception.SUBTRAIU },
  ],

  niveis: {
    1: { primitiva: "visual-addition", micro: "juntar_ate_cinco_guiado", andaime: "mao_fantasma" },
    2: { primitiva: "visual-addition", micro: "juntar_ate_cinco", andaime: "alto" },
    3: { primitiva: "visual-addition", micro: "juntar_ate_dez", andaime: "minimo" },
    4: { primitiva: "visual-addition", micro: "juntar_sem_objetos", andaime: "nenhum" },
    // Relógio silencioso de fluência; nunca tranca domínio conceitual na Jornada.
    5: { primitiva: "visual-addition", micro: "soma_simbolica", andaime: "nenhum", rt_alvo: 5000 },
  },

  micros: [
    {
      id: "juntar_ate_cinco_guiado",
      fonte: "F13",
      alvo: "entender que duas parcelas permanecem identificáveis até serem reunidas em um total",
      kinds: ["visual-addition"],
      params: {
        // VisualAddition estreia na Jornada aqui: o primeiro contato ensina
        // a gramática grupo ↔ numeral e depois demonstra a ação de juntar.
        tutorial: [
          { fala: "Este grupo tem sua própria quantidade.", show: { destacarGrupo: "A" } },
          { fala: "Este é o outro grupo. Cada número fica junto do grupo que representa.", show: { destacarGrupo: "B" } },
          { fala: "Agora os dois grupos se juntam e viram um total.", show: { fundirGrupos: true } },
        ],
      },
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "juntar_ate_cinco",
      fonte: "F13",
      alvo: "juntar duas parcelas visíveis até cinco com a ajuda opcional de fusão",
      kinds: ["visual-addition"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "juntar_ate_dez",
      fonte: "F13",
      alvo: "somar até dez preservando mentalmente as parcelas mesmo sem botão de ajuda",
      kinds: ["visual-addition"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "juntar_sem_objetos",
      fonte: "F13",
      alvo: "operar apenas com os numerais ainda organizados nos contêineres de parcela",
      kinds: ["visual-addition"],
      params: {},
      dominio: {
        acertos: 3,
        de: 3,
        sessoes: 2,
        exige: {
          evidencia: VisualAdditionEvidence.SEM_OBJETOS,
          descricao: "acertar pelo menos uma soma no nível 4 sem objetos de apoio",
        },
      },
    },
    {
      id: "soma_simbolica",
      fonte: "F13",
      alvo: "resolver a soma como expressão simbólica depois da retirada do apoio concreto",
      kinds: ["visual-addition"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
  ],

  erros_tipicos: [
    {
      id: VisualAdditionMisconception.REPETE_PARCELA,
      descricao: "Responde uma das parcelas em vez de reunir as duas partes.",
    },
    {
      id: VisualAdditionMisconception.OFF_BY_ONE,
      descricao: "Junta as parcelas, mas erra a contagem do total por uma unidade.",
    },
    {
      id: VisualAdditionMisconception.SUBTRAIU,
      descricao: "Troca a operação e calcula a diferença entre as parcelas.",
    },
    {
      id: VisualAdditionMisconception.CONTA_TUDO,
      descricao: "Recomeça a sequência no um mesmo quando uma parcela já fornece um ponto de partida conhecido.",
    },
  ],
};
