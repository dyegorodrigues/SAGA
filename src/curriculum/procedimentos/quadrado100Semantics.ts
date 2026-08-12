export type ModoQuadrado100 = "linha" | "vertical" | "cinco" | "vizinho" | "lacunas";

/** Tags canônicas da F36, mantidas juntas para ficha, procedimento e Radar não divergirem. */
export const Quadrado100Misconception = {
  CONFUNDE_DIRECAO: "confunde-direcao-quadrado100",
  NAO_VE_PADRAO_DEZENA: "nao-ve-padrao-dezena",
  SO_CONTA_UM_A_UM: "so-conta-um-a-um-quadrado100",
} as const;

/** §9 da F36: domínio precisa incluir pelo menos um percurso +10 vertical. */
export const Quadrado100Evidence = {
  PERCURSO_VERTICAL: "percurso-vertical-quadrado100",
} as const;
