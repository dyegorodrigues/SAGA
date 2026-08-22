import { Evidencia } from "./evidencias";

export const ContasVirgulaMisconception = {
  ALINHA_PELA_DIREITA: "alinha-pela-direita",
  IGNORA_ZEROS: "ignora-zeros",
  VIRGULA_PERDIDA: "virgula-perdida",
} as const;

export type ContasVirgulaMisconceptionTag =
  typeof ContasVirgulaMisconception[keyof typeof ContasVirgulaMisconception];

/** F76: ao menos um acerto real em L2, com quantidades de casas decimais diferentes. */
export const CONTAS_VIRGULA_CASAS_DIFERENTES_EVIDENCIA = Evidencia.CONTAS_VIRGULA_CASAS_DIFERENTES_F76;
