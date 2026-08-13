export const EmojiRowRiscarMisconception = {
  RESPONDE_O_REMOVIDO: "RESPONDE_O_REMOVIDO",
  RESPONDE_O_TODO: "RESPONDE_O_TODO",
  OFF_BY_ONE: "OFF_BY_ONE",
  SOMOU: "SOMOU",
} as const;

export type EmojiRowRiscarMisconceptionId = typeof EmojiRowRiscarMisconception[keyof typeof EmojiRowRiscarMisconception];
