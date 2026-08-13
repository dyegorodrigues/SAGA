export const SkipCountMisconception = {
  PERDE_O_SALTO: "PERDE_O_SALTO",
  SALTO_DUPLO: "SALTO_DUPLO",
  SO_DEZENAS: "SO_DEZENAS",
  NAO_PARTE_DE: "NAO_PARTE_DE",
} as const;

export type SkipCountMisconception = typeof SkipCountMisconception[keyof typeof SkipCountMisconception];

export const SkipCountEvidence = {
  SEM_MANIPULAVEL: "contagem-saltos-sem-manipulavel",
  INICIO_DESLOCADO: "contagem-saltos-inicio-deslocado",
  salto: (valor: number) => `contagem-saltos-${valor}`,
} as const;
