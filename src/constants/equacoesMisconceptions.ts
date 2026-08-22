import { Evidencia } from "./evidencias";

export const EquacoesMisconception = {
  QUEBRA_EQUILIBRIO: "quebra-equilibrio",
  OPERACAO_INVERSA_ERRADA: "operacao-inversa-errada",
  NAO_APLICA_AOS_DOIS: "nao-aplica-aos-dois",
  RESPONDE_O_TODO: "responde-o-todo",
} as const;

export type EquacoesMisconceptionTag =
  typeof EquacoesMisconception[keyof typeof EquacoesMisconception];

/** F90: ao menos um acerto real em equação de L3 ou superior. */
export const EQUACOES_L3_MAIS_EVIDENCIA = Evidencia.EQUACAO_L3_MAIS_F90;
