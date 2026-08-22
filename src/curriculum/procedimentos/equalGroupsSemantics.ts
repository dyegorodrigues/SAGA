export const EqualGroupsMisconception = {
  SOMA_OS_FATORES: "soma-os-fatores",
  CONTA_UM_GRUPO: "conta-um-grupo",
  PERDEU_UM_GRUPO: "perdeu-um-grupo",
} as const;

export type EqualGroupsMisconceptionTag =
  typeof EqualGroupsMisconception[keyof typeof EqualGroupsMisconception];

/** Evidência canônica de F97: ao menos um acerto L3+ já em notação multiplicativa. */
export const EqualGroupsEvidence = {
  NOTACAO_MULTIPLICATIVA: "grupos-iguais-notacao-multiplicativa",
} as const;
