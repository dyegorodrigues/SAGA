import { FichaCompetencia } from "../../schema";
import { SkipCountMisconception } from "../../procedimentos/skipCountSemantics";

/**
 * F30 — Contagem por saltos.
 *
 * Reancoragem W11: o grafo canônico exige N1.09 + N2.01. A ficha retira apoio
 * por linguagem, não por números maiores: reta com arcos → reta → composição
 * reta + Quadrado100 → sequência escrita → início deslocado mental.
 */
const dominio = { acertos: 3, de: 3, sessoes: 2 };

export const AL_03: FichaCompetencia = {
  id: "AL.03",
  nome: "Contagem por saltos (2, 5, 10)",
  strand: "AL",
  faixa: "F1",
  prereqs: ["N1.09", "N2.01"],

  howto: "Cada pulo anda a mesma distância. Conte junto e mantenha o tamanho do salto.",
  explain: "Olhe quanto muda de um número para o outro. O mesmo salto precisa se repetir.",
  // O palco emite a hipótese a partir do valor/processo; não dependemos de um
  // distrator genérico do Composer para diagnosticar F30.
  distratores: [],

  niveis: {
    1: { primitiva: "numberline", micro: "saltos_de_2", andaime: "alto" },
    2: { primitiva: "numberline", micro: "saltos_de_10", andaime: "medio" },
    3: { primitiva: "quadrado100", micro: "saltos_de_5", andaime: "minimo" },
    4: { primitiva: "plain", micro: "sequencia_escrita", andaime: "nenhum" },
    // F30 não transforma tempo em domínio. 8 s é apenas alvo observacional para
    // fluência/Dojo e permanece fora de evaluate/mastery/recompensa.
    5: { primitiva: "plain", micro: "inicio_deslocado", andaime: "nenhum", rt_alvo: 8000 },
  },

  micros: [
    {
      id: "saltos_de_2",
      fonte: "F30",
      alvo: "recitar e continuar de dois em dois até dez vendo saltos iguais na reta",
      kinds: ["numberline"],
      params: {
        tutorial: [
          { fala: "Vamos pular de dois em dois.", show: { marcarPonto: 0 } },
          { fala: "Dois!", show: { saltarDe: 0, para: 2 } },
          { fala: "Quatro!", show: { saltarDe: 2, para: 4 } },
          { fala: "Agora você!", show: { pulsarFoguete: true } },
        ],
      },
      dominio,
    },
    {
      id: "saltos_de_10",
      fonte: "F30",
      alvo: "recitar e continuar de dez em dez até cem usando a reta como apoio",
      kinds: ["numberline"],
      params: {},
      dominio,
    },
    {
      id: "saltos_de_5",
      fonte: "F30",
      alvo: "recitar e continuar de cinco em cinco até cinquenta e enxergar o padrão no quadro de cem",
      kinds: ["quadrado100"],
      params: {},
      dominio,
    },
    {
      id: "sequencia_escrita",
      fonte: "F30",
      alvo: "generalizar o mesmo salto em sequência escrita, inclusive além dos saltos-âncora 2, 5 e 10",
      kinds: ["plain"],
      params: {},
      dominio,
    },
    {
      id: "inicio_deslocado",
      fonte: "F30",
      alvo: "manter qualquer salto de 2 a 10 quando a sequência começa em outro número",
      kinds: ["plain"],
      params: {},
      dominio,
    },
  ],

  erros_tipicos: [
    { id: SkipCountMisconception.PERDE_O_SALTO, descricao: "Volta à contagem unitária em vez de manter o salto." },
    { id: SkipCountMisconception.SALTO_DUPLO, descricao: "Avança dois saltos de uma vez e perde o ritmo da sequência." },
    { id: SkipCountMisconception.SO_DEZENAS, descricao: "Mantém o padrão de dez em dez, mas não estabiliza o de cinco em cinco." },
    { id: SkipCountMisconception.NAO_PARTE_DE, descricao: "No início deslocado, volta a uma sequência ancorada no zero." },
  ],
};
