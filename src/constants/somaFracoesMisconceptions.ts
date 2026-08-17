/** W44/F74 — diagnósticos canônicos de soma/subtração de frações com denominadores iguais. */
export const SomaFracoesMisconception = {
  /** Operou também o denominador, como se o tamanho das partes mudasse ao juntar/retirar partes. */
  SOMA_DENOMINADOR: "soma-denominador",
  /** Chegou a uma fração equivalente não reduzida e tratou-a como forma final no nível de simplificação. */
  NAO_SIMPLIFICA: "nao-simplifica",
  /** Rejeitou uma fração maior que um inteiro por considerar numerador > denominador inválido. */
  IMPROPRIA_INVALIDA: "impropria-invalida",
} as const;

export type SomaFracoesMisconceptionTag =
  typeof SomaFracoesMisconception[keyof typeof SomaFracoesMisconception];
