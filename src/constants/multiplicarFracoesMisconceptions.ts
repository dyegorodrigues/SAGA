export const MultiplicarFracoesMisconception = {
  MULTIPLICAR_AUMENTA: "multiplicar-aumenta",
  SOMA_EM_VEZ_DE_MULTIPLICAR: "soma-em-vez-de-multiplicar",
  DIVIDIR_DIMINUI: "dividir-diminui",
} as const;

export type MultiplicarFracoesMisconceptionTag = typeof MultiplicarFracoesMisconception[keyof typeof MultiplicarFracoesMisconception];
