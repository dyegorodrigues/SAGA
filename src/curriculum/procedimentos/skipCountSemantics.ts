export const SkipCountMisconception = {
  PERDE_O_SALTO: "PERDE_O_SALTO",
  SALTO_DUPLO: "SALTO_DUPLO",
  SO_DEZENAS: "SO_DEZENAS",
  NAO_PARTE_DE: "NAO_PARTE_DE",
} as const;

export type SkipCountMisconception = typeof SkipCountMisconception[keyof typeof SkipCountMisconception];

/**
 * Vocabulário da evidência produzida pelo palco F30. A REGRA de domínio que
 * consome este prefixo mora na própria ficha AL.03 (`FichaDominio`), não aqui.
 */
export const SKIP_COUNT_STEP_EVIDENCE_PREFIX = "contagem-saltos-passo-";

export const SkipCountEvidence = {
  SEM_MANIPULAVEL: "contagem-saltos-sem-manipulavel",
  INICIO_DESLOCADO: "contagem-saltos-inicio-deslocado",
  salto: (valor: number) => `${SKIP_COUNT_STEP_EVIDENCE_PREFIX}${valor}`,
} as const;