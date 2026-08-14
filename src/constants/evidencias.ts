/**
 * As condições da §9 — o que cada ficha exige ter visto pelo menos uma vez.
 *
 * O nome da condição aparece na ficha que a exige e no procedimento que a
 * emite; centralizar evita divergência silenciosa entre as duas pontas.
 */
export const Evidencia = {
  NAO_PERTENCE: "nao-pertence",
  ARRANJO_DISPERSO: "arranjo-disperso",
  PRIMEIRA_AUDICAO: "primeira-audicao",
  SEM_ANDAIME: "sem-andaime",
  FORMA_GIRADA: "forma-girada",
  DIFERENCA_PEQUENA: "diferenca-pequena",
  CASO_CONTRAINTUITIVO: "caso-contraintuitivo",
  ESTRUTURA_DAS_DUAS_FILEIRAS: "estrutura-das-duas-fileiras",
  TOTAL_ALEM_DE_CINCO: "total-alem-de-cinco",
  SEM_MOLDURA: "sem-moldura",
  MONTOU_DO_NUMERAL: "montou-do-numeral",
  SALTO_PARA_TRAS: "salto-para-tras",
  ALINHOU_ZERO: "alinhou-zero",
  COMPARACAO_SIMBOLICA_SEM_OBJETOS: "comparacao-simbolica-sem-objetos",
  PERCURSO_VERTICAL_QUADRADO100: "percurso-vertical-quadrado100",
  ADICAO_SEM_OBJETOS: "adicao-sem-objetos",
  SIMETRIA_EIXO: "detetive-formas-simetria-nivel-4",

  /**
   * F45 (N5.01): a criança produziu no L4 uma divisão cujos intervalos são
   * matematicamente iguais. A evidência depende do estado final, nunca da
   * precisão do gesto usado para posicionar as marcas.
   */
  PARTES_IGUAIS_DIVISAO: "partes-iguais-corte-nivel-4",
} as const;

export type EvidenciaType = typeof Evidencia[keyof typeof Evidencia];
