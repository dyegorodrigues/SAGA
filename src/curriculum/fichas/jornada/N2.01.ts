import { MisconceptionTag } from "../../../constants/misconceptions";
import { FichaCompetencia } from "../../schema";

/**
 * F21 — A dezena: dez unidades viram uma unidade nova.
 *
 * A competência não é "ler dois algarismos". É construir a unidade composta e
 * conseguir ir nos dois sentidos: material → numeral e numeral → material.
 */
export const N2_01: FichaCompetencia = {
  id: "N2.01",
  nome: "Dezena e Unidades (Sistema Decimal)",
  strand: "N2",
  faixa: "F1",
  prereqs: ["N1.09", "N1.11"],
  bncc: "EF01MA04",

  howto: "Uma barra vale dez cubinhos. Conte as barras de dez em dez e depois junte as unidades soltas.",
  explain: "Dez unidades podem ser organizadas como uma dezena. A quantidade não muda: muda a unidade que usamos para contar.",
  // Os erros F21 dependem do gesto/contexto; o palco emite a ação ao Radar.
  distratores: [],

  niveis: {
    1: { primitiva: "tens", micro: "troca_10_por_1", andaime: "mao_fantasma" },
    2: { primitiva: "tens", micro: "ler_ate_59", andaime: "alto" },
    3: { primitiva: "tens", micro: "ler_ate_99", andaime: "medio" },
    4: { primitiva: "tens", micro: "produzir_material", andaime: "minimo" },
    // Relógio silencioso: telemetria/automaticidade; nunca concede mastery.
    5: { primitiva: "tens", micro: "misto", andaime: "nenhum", rt_alvo: 10000 },
  },

  micros: [
    {
      id: "troca_10_por_1",
      fonte: "F21",
      alvo: "agrupar dez unidades e reconhecer a dezena como unidade composta",
      kinds: ["tens"],
      params: {
        tutorial: [
          { fala: "Aqui temos dez cubinhos: dez unidades.", show: { destacarUnidades: true } },
          { fala: "Junte os dez. Quando fecham dez, eles podem virar uma barra.", show: { destacarAlvoTroca: true } },
          { fala: "Depois da troca, uma barra vale dez unidades.", show: { pulsarEquivalencia: true } },
        ],
      },
      dominio: {
        acertos: 9,
        de: 10,
        sessoes: 2,
        exige: { evidencia: "troca-10-por-1", descricao: "fazer ao menos uma troca real de dez unidades por uma dezena" },
      },
    },
    {
      id: "ler_ate_59",
      fonte: "F21",
      alvo: "ler dezenas e unidades até 59 usando a barra como unidade de dez",
      kinds: ["tens"],
      params: {},
      dominio: { acertos: 9, de: 10, sessoes: 2 },
    },
    {
      id: "ler_ate_99",
      fonte: "F21",
      alvo: "ler qualquer quantidade de 10 a 99 em dezenas e unidades",
      kinds: ["tens"],
      params: {},
      dominio: { acertos: 9, de: 10, sessoes: 2 },
    },
    {
      id: "produzir_material",
      fonte: "F21",
      alvo: "produzir dezenas e unidades a partir de um numeral",
      kinds: ["tens"],
      params: {},
      dominio: {
        acertos: 4,
        de: 5,
        sessoes: 2,
        exige: {
          evidencia: "producao-sem-contar-subdivisoes",
          descricao: "produzir o material tratando cada barra como uma dezena, sem recontar seus dez quadradinhos",
        },
      },
    },
    {
      id: "misto",
      fonte: "F21",
      alvo: "alternar leitura e produção sem pista sobre qual transformação vem",
      kinds: ["tens"],
      params: {},
      dominio: { acertos: 9, de: 10, sessoes: 2 },
    },
  ],

  erros_tipicos: [
    {
      id: MisconceptionTag.IGNORA_DEZENA,
      descricao: "Responde apenas pelas unidades soltas e trata a barra como se não valesse dez.",
    },
    {
      id: MisconceptionTag.CONCATENA,
      descricao: "Concatena a dezena já expandida com a unidade, por exemplo 3 dezenas e 4 unidades → 304.",
    },
    {
      id: MisconceptionTag.CONTA_TUDO,
      descricao: "Abre as barras e conta todos os quadradinhos em vez de usar cada barra como uma unidade de dez.",
    },
    {
      id: MisconceptionTag.TROCA_DU,
      descricao: "Na produção, coloca o algarismo das dezenas nas unidades e o das unidades nas dezenas.",
    },
  ],
};
