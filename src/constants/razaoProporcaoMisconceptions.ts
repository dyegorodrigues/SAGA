import { Evidencia } from "./evidencias";

export const RazaoProporcaoMisconception = {
  SOMA_EM_VEZ_DE_ESCALAR: "soma-em-vez-de-escalar",
  ESCALA_UM_LADO: "escala-um-lado",
  INVERTE_RAZAO: "inverte-razao",
} as const;

export type RazaoProporcaoMisconceptionTag =
  typeof RazaoProporcaoMisconception[keyof typeof RazaoProporcaoMisconception];

/** Evidência de domínio F88: ao menos um acerto com fator de escala não inteiro. */
export const RAZAO_PROPORCAO_ESCALA_NAO_INTEIRA_EVIDENCIA = Evidencia.ESCALA_NAO_INTEIRA_F88;