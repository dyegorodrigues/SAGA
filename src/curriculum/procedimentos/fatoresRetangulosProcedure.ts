export const FatoresRetangulosMisconception = {
  ESQUECE_TRIVIAIS: "esquece-triviais",
  PARA_CEDO: "para-cedo",
  CONFUNDE_FATOR_MULTIPLO: "confunde-fator-multiplo",
} as const;

export type FatoresRetangulosMisconceptionTag =
  typeof FatoresRetangulosMisconception[keyof typeof FatoresRetangulosMisconception];

export interface ParDeFatores {
  linhas: number;
  colunas: number;
}

export interface TentativaRetangulo {
  total: number;
  divisor: number;
  linhasCompletas: number;
  sobra: number;
  fecha: boolean;
}

/** F66: fatores são exatamente os divisores que organizam o total sem sobra. */
export function fatoresDe(total: number): number[] {
  const n = Math.max(1, Math.round(total));
  return Array.from({ length: n }, (_, index) => index + 1).filter(divisor => n % divisor === 0);
}

/** Pares sem duplicar rotações: 3×4 e 4×3 são a mesma formação. */
export function paresDeFatores(total: number): ParDeFatores[] {
  return fatoresDe(total)
    .filter(divisor => divisor <= Math.sqrt(total))
    .map(divisor => ({ linhas: divisor, colunas: total / divisor }));
}

export function tentativaRetangulo(total: number, divisor: number): TentativaRetangulo {
  const n = Math.max(1, Math.round(total));
  const d = Math.max(1, Math.round(divisor));
  const linhasCompletas = Math.floor(n / d);
  const sobra = n % d;
  return { total: n, divisor: d, linhasCompletas, sobra, fecha: sobra === 0 };
}

export function ehPrimo(total: number): boolean {
  return fatoresDe(total).length === 2;
}

export function maiorFatorComum(a: number, b: number): number {
  const comuns = fatoresDe(a).filter(fator => b % fator === 0);
  return comuns[comuns.length - 1] ?? 1;
}
