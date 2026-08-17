export const DivisaoDoisDigitosMisconception = {
  NAO_ESTIMA: "nao-estima",
  NAO_AJUSTA: "nao-ajusta",
  // F69 já definiu a mesma falha matemática; F71 reutiliza a tag em vez de
  // criar uma segunda identidade para resto que ainda comporta o divisor.
  RESTO_INVALIDO: "resto-maior-ou-igual-divisor",
} as const;

export type DivisaoDoisDigitosMisconceptionTag =
  typeof DivisaoDoisDigitosMisconception[keyof typeof DivisaoDoisDigitosMisconception];
