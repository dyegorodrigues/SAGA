/**
 * Tags diagnósticas exclusivas da F29 / N2.03.
 *
 * Arquivo canônico local da W6 para impedir strings soltas enquanto a família
 * F29 é especializada. Não altera nem reinterpreta tags históricas do Radar.
 */
export const MisconceptionTagF29 = {
  INVERTE_SIMBOLO: "inverte-simbolo",
  IGNORA_DIFERENCA: "ignora-diferenca",
  NAO_COMPARA_SIMBOLO: "nao-compara-simbolo",
} as const;

export type MisconceptionTagF29Type = typeof MisconceptionTagF29[keyof typeof MisconceptionTagF29];
