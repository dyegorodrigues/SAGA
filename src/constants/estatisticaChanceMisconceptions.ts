export const EstatisticaChanceMisconception = {
  FALACIA_APOSTADOR: "falacia-apostador",
  TUDO_CINQUENTA: "tudo-cinquenta",
  IGNORA_TOTAL: "ignora-total",
} as const;

export type EstatisticaChanceMisconceptionTag = typeof EstatisticaChanceMisconception[keyof typeof EstatisticaChanceMisconception];
