export const CountingOnMisconception = {
  CONTA_TUDO: "CONTA_TUDO",
  NAO_ESCOLHE_MAIOR: "NAO_ESCOLHE_MAIOR",
  OFF_BY_ONE: "OFF_BY_ONE",
  DEPENDE_DA_RETA: "DEPENDE_DA_RETA",
} as const;

export type CountingOnMisconception = typeof CountingOnMisconception[keyof typeof CountingOnMisconception];
