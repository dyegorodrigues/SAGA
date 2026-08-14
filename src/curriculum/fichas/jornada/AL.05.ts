import { FichaCompetencia, FichaDominio } from "../../schema";
import {
  IGUALDADE_EQUILIBRIO_EVIDENCE_PREFIX,
  IgualdadeEquilibrioMisconception,
} from "../../procedimentos/igualdadeEquilibrioContract";

const dominio: FichaDominio = { acertos: 4, de: 4, sessoes: 2 };
const dominioL4: FichaDominio = {
  ...dominio,
  evidenciasDistintas: {
    prefixo: IGUALDADE_EQUILIBRIO_EVIDENCE_PREFIX,
    minimo: 2,
    descricao: "Resolver pelo menos dois equilíbrios diferentes com somas nos dois lados.",
  },
};

/**
 * F46 — A Balança.
 *
 * O sinal de igualdade ocupa o lugar do fiel: `=` quer dizer que os dois lados
 * valem o mesmo. A escada vai da igualdade direta ao saco fechado, sempre
 * preservando a balança como significado antes da notação algébrica.
 */
export const AL_05: FichaCompetencia = {
  id: "AL.05",
  nome: "A Balança",
  strand: "AL",
  faixa: "F2",
  prereqs: ["N2.03", "N3.05"],

  howto: "Os dois lados precisam pesar igual. Veja qual está mais leve e complete.",
  explain: "Olhe qual lado está mais baixo. Ele está mais pesado. Some do outro lado.",
  distratores: [
    { regra: "lê o sinal de igual como lugar onde vem o resultado", tag: IgualdadeEquilibrioMisconception.IGUAL_E_RESULTADO },
    { regra: "soma todos os números sem separar os dois lados", tag: IgualdadeEquilibrioMisconception.SOMA_TUDO },
    { regra: "ignora um dos termos da igualdade", tag: IgualdadeEquilibrioMisconception.IGNORA_TERMO },
  ],

  niveis: {
    1: { primitiva: "balanca", micro: "igualdade-simples", andaime: "mao_fantasma" },
    2: { primitiva: "balanca", micro: "soma-um-lado", andaime: "alto" },
    3: { primitiva: "balanca", micro: "incognita-meio", andaime: "medio" },
    4: { primitiva: "balanca", micro: "somas-dois-lados", andaime: "minimo" },
    5: { primitiva: "balanca", micro: "saco-fechado", andaime: "nenhum", rt_alvo: 18000 },
  },

  micros: [
    {
      id: "igualdade-simples",
      fonte: "F46",
      alvo: "entender igualdade como dois pratos com o mesmo valor",
      kinds: ["balanca"],
      params: {
        tutorial: [
          { fala: "A balança está torta.", show: { desequilibrar: "esquerda" } },
          { fala: "Este lado pesa mais.", show: { destacarPrato: "esquerda" } },
          { fala: "Coloque o mesmo peso do outro lado.", show: { maoFantasma: "direita" } },
          { fala: "Equilibrou. São iguais!", show: { equilibrar: true } },
        ],
      },
      dominio,
    },
    { id: "soma-um-lado", fonte: "F46", alvo: "igualar uma soma a uma quantidade equivalente", kinds: ["balanca"], params: {}, dominio },
    { id: "incognita-meio", fonte: "F46", alvo: "encontrar a parcela que mantém uma igualdade", kinds: ["balanca"], params: {}, dominio },
    { id: "somas-dois-lados", fonte: "F46", alvo: "tratar os dois membros como expressões completas e equivalentes", kinds: ["balanca"], params: {}, dominio: dominioL4 },
    { id: "saco-fechado", fonte: "F46", alvo: "descobrir o valor desconhecido preservando o equilíbrio", kinds: ["balanca"], params: {}, dominio },
  ],

  erros_tipicos: [
    { id: IgualdadeEquilibrioMisconception.IGUAL_E_RESULTADO, descricao: "Lê o sinal de igual como instrução para escrever o resultado." },
    { id: IgualdadeEquilibrioMisconception.SOMA_TUDO, descricao: "Soma os valores dos dois membros como se fossem uma única expressão." },
    { id: IgualdadeEquilibrioMisconception.IGNORA_TERMO, descricao: "Desconsidera um termo ao comparar os pesos dos dois lados." },
  ],
};
