import { Evidencia } from "../../../constants/evidencias";
import { MisconceptionTagF29 } from "../../../constants/misconceptionsF29";
import { FichaCompetencia } from "../../schema";

/**
 * F29 — Maior, Menor, Igual.
 *
 * A ordem pedagógica é deliberada: quantidade → comparação → símbolo. O sinal
 * entra depois que a criança já sabe comparar grupos (N1.05, pré-requisito
 * direto), portanto a W6 reutiliza Grupo e não inaugura uma linguagem visual.
 */
export const N2_03: FichaCompetencia = {
  id: "N2.03",
  nome: "Maior, Menor, Igual",
  strand: "N2",
  faixa: "F1",
  prereqs: ["N2.02", "N1.05"],

  howto: "A boca aberta fica virada para o número maior. O bico fica para o menor.",
  explain: "Qual dos dois é maior? O jacaré sempre abre a boca para esse lado.",
  distratores: [
    { regra: "inverter a direção de > ou <", tag: MisconceptionTagF29.INVERTE_SIMBOLO },
    { regra: "usar = quando os lados são diferentes", tag: MisconceptionTagF29.IGNORA_DIFERENCA },
    { regra: "não comparar corretamente depois da retirada dos objetos", tag: MisconceptionTagF29.NAO_COMPARA_SIMBOLO },
  ],

  niveis: {
    1: { primitiva: "grandeza", micro: "comparar_grupos", andaime: "alto" },
    2: { primitiva: "grandeza", micro: "ponte_grupo_numeral", andaime: "medio" },
    3: { primitiva: "grandeza", micro: "simbolizar_ate_20", andaime: "minimo" },
    4: { primitiva: "grandeza", micro: "simbolizar_ate_100", andaime: "nenhum" },
    // RT silencioso: mede automatização; jamais concede domínio sozinho.
    5: { primitiva: "grandeza", micro: "comparar_expressoes", andaime: "nenhum", rt_alvo: 8000 },
  },

  micros: [
    {
      id: "comparar_grupos",
      fonte: "F29",
      alvo: "comparar duas quantidades concretas antes de nomear a relação com um símbolo",
      kinds: ["grandeza"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "ponte_grupo_numeral",
      fonte: "F29",
      alvo: "comparar uma quantidade concreta com seu registro numeral",
      kinds: ["grandeza"],
      params: {},
      dominio: { acertos: 3, de: 3, sessoes: 2 },
    },
    {
      id: "simbolizar_ate_20",
      fonte: "F29",
      alvo: "comparar numerais até 20 e registrar a relação com >, < ou = sem objetos",
      kinds: ["grandeza"],
      params: {},
      dominio: {
        acertos: 3,
        de: 3,
        sessoes: 2,
        exige: {
          evidencia: Evidencia.COMPARACAO_SIMBOLICA_SEM_OBJETOS,
          descricao: "acertar uma comparação simbólica de numerais sem objetos de apoio",
        },
      },
    },
    {
      id: "simbolizar_ate_100",
      fonte: "F29",
      alvo: "comparar numerais até 100 usando somente >, < ou =",
      kinds: ["grandeza"],
      params: {},
      dominio: {
        acertos: 3,
        de: 3,
        sessoes: 2,
        exige: {
          evidencia: Evidencia.COMPARACAO_SIMBOLICA_SEM_OBJETOS,
          descricao: "acertar uma comparação simbólica de numerais sem objetos de apoio",
        },
      },
    },
    {
      id: "comparar_expressoes",
      fonte: "F29",
      alvo: "comparar os valores de duas expressões e escolher >, < ou =",
      kinds: ["grandeza"],
      params: {},
      dominio: {
        acertos: 3,
        de: 3,
        sessoes: 2,
        exige: {
          evidencia: Evidencia.COMPARACAO_SIMBOLICA_SEM_OBJETOS,
          descricao: "acertar uma comparação simbólica sem objetos de apoio",
        },
      },
    },
  ],

  erros_tipicos: [
    {
      id: MisconceptionTagF29.INVERTE_SIMBOLO,
      descricao: "Inverte > e < mesmo tendo identificado qual lado é maior.",
    },
    {
      id: MisconceptionTagF29.IGNORA_DIFERENCA,
      descricao: "Escolhe = quando as duas quantidades ou expressões têm valores diferentes.",
    },
    {
      id: MisconceptionTagF29.NAO_COMPARA_SIMBOLO,
      descricao: "Sem objetos, escolhe o símbolo sem comparar corretamente os valores dos dois lados.",
    },
  ],
};
