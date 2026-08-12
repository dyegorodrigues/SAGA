import { Evidencia } from "../../constants/evidencias";
import { MisconceptionTag } from "../../constants/misconceptions";

export type ModoQuadrado100 = "linha" | "vertical" | "cinco" | "vizinho" | "lacunas";

/** Tags canônicas da F36, mantidas juntas para ficha, procedimento e Radar não divergirem. */
export const Quadrado100Misconception = {
  CONFUNDE_DIRECAO: MisconceptionTag.QUADRADO100_CONFUNDE_DIRECAO,
  NAO_VE_PADRAO_DEZENA: MisconceptionTag.QUADRADO100_NAO_VE_PADRAO_DEZENA,
  SO_CONTA_UM_A_UM: MisconceptionTag.QUADRADO100_SO_CONTA_UM_A_UM,
} as const;

/** §9 da F36: domínio precisa incluir pelo menos um percurso +10 vertical. */
export const Quadrado100Evidence = {
  PERCURSO_VERTICAL: Evidencia.PERCURSO_VERTICAL_QUADRADO100,
} as const;
