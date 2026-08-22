import { Evidencia } from "../../constants/evidencias";
import { MisconceptionTag } from "../../constants/misconceptions";

/**
 * Semântica F13 sem strings soltas no builder/palco. Algumas hipóteses já
 * pertencem a famílias canônicas existentes: repetir uma parte, erro ±1,
 * confusão de operação e não contar a partir de um valor já conhecido.
 */
export const VisualAdditionMisconception = {
  REPETE_PARCELA: MisconceptionTag.REPETE_A_PARTE,
  OFF_BY_ONE: MisconceptionTag.OFF_BY_ONE,
  SUBTRAIU: MisconceptionTag.CONFUSAO_SINAL,
  CONTA_TUDO: MisconceptionTag.NAO_CONTA_A_PARTIR_DE,
} as const;

export const VisualAdditionEvidence = {
  SEM_OBJETOS: Evidencia.ADICAO_SEM_OBJETOS,
} as const;
