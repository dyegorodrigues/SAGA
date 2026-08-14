import { COVERAGE_BASELINE, COVERAGE_MIGRATIONS } from "./coverage_matrix_core";

/**
 * Extensão nominal do ledger após o fechamento W20.
 *
 * O core preserva o snapshot histórico reconciliado até W20. Cada nova onda só
 * entra aqui DEPOIS de a Matrix real ficar vermelha com o delta observado.
 * O baseline continua derivado por deltas, sem trocar expectativa para mascarar
 * regressão: esta extensão muta as mesmas referências exportadas pelo core antes
 * de qualquer consumidor executar buildCoverageMatrix().
 */
type LiveMigration = {
  id: string;
  competence: string;
  rationale: string;
  delta: Partial<Record<"composer" | "legacy" | "fallback" | "served" | "divergences" | "modeSwaps" | "toolIntroductions", number>>;
};

export const COVERAGE_LIVE_MIGRATIONS: readonly LiveMigration[] = [
  {
    id: "W21-AL.05",
    competence: "AL.05",
    rationale: "F46 materializada com Balanca como significado físico de igualdade, diversidade de dois casos L4 e resolução R0-A. O portão inativo 72cf0375 passou CI 31808928178 + transversal 31808928379. A promoção isolada 4a2d4d8e fez a Matrix observar 46 Composer, 15 legado, 29 fallback, 61 servidas e 11 divergências antes deste ledger.",
    delta: { composer: 1, fallback: -1, served: 1 },
  },
] as const;

const migrations = COVERAGE_MIGRATIONS as unknown as LiveMigration[];
const baseline = COVERAGE_BASELINE as unknown as Record<string, number | readonly string[]>;
for (const migration of COVERAGE_LIVE_MIGRATIONS) {
  if (migrations.some(existing => existing.id === migration.id)) continue;
  migrations.push(migration);
  for (const [key, delta] of Object.entries(migration.delta)) {
    if (typeof delta !== "number" || typeof baseline[key] !== "number") continue;
    baseline[key] = (baseline[key] as number) + delta;
  }
}
