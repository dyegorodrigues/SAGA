export const VolumePrismasMisconception = {
  /** Somou comprimento + largura + altura em vez de compor camadas tridimensionais. */
  SOMA_DIMENSOES: "soma-dimensoes",
  /** Parou na quantidade de cubos de uma camada e tratou área da base como volume. */
  CONFUNDE_COM_AREA: "confunde-com-area",
  /** Calculou a quantidade correta, mas tratou volume como unidade linear/quadrada. */
  IGNORA_UNIDADE_CUBICA: "ignora-unidade-cubica",
} as const;

export type VolumePrismasMisconceptionTag = typeof VolumePrismasMisconception[keyof typeof VolumePrismasMisconception];
