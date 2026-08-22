/** W42/F70 — extensão canônica do Radar sem reescrever o catálogo histórico compartilhado. */
export const PrimosDivisoresMisconception = {
  /** Inverteu a relação e chamou múltiplo de divisor ou divisor de múltiplo. */
  INVERTE_DIVISOR_MULTIPLO: "inverte-divisor-multiplo",
  /** Esqueceu o divisor 1 ou tratou 1 como primo. */
  ESQUECE_UM: "esquece-um",
  /** Classificou composto como primo ou usou ímpar como sinônimo de primo. */
  PRIMO_ERRADO: "primo-errado",
} as const;

export type PrimosDivisoresMisconceptionTag =
  typeof PrimosDivisoresMisconception[keyof typeof PrimosDivisoresMisconception];
