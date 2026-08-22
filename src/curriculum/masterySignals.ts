export const MASTERY_DISQUALIFIER_PREFIX = "mastery-disqualifier:";

/**
 * Sinal efêmero que viaja apenas com a tentativa terminal.
 * Não é evidência positiva da ficha e não deve ser persistido em evidenciasVistas.
 */
export function masteryDisqualifier(tag: string): string {
  return `${MASTERY_DISQUALIFIER_PREFIX}${tag}`;
}

export function isMasteryDisqualifier(value: string): boolean {
  return value.startsWith(MASTERY_DISQUALIFIER_PREFIX);
}
