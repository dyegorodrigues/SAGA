import * as core from "./coverage_matrix_core";

/** Ledger incremental W16–W19. Só entra depois da Matrix observar o delta real. */
const MIGRACOES_DO_BLOCO = [
  {
    id: "W16-N5.02",
    competence: "N5.02",
    rationale: "F72: SingaporeBars + InteractiveNumberLine. Promoção observada pela Matrix como +1 Composer, -1 fallback, +1 servida.",
    delta: { composer: 1, fallback: -1, served: 1 },
  },
  {
    id: "W17-N6.01",
    competence: "N6.01",
    rationale: "F75: Quadrado100 relido como um inteiro. Promoção observada pela Matrix como +1 Composer, -1 fallback, +1 servida.",
    delta: { composer: 1, fallback: -1, served: 1 },
  },
  {
    id: "W18-N5.03",
    competence: "N5.03",
    rationale: "F73: duas SingaporeBars do mesmo inteiro para equivalência e comparação. A promoção fez a Matrix observar 43 Composer, 15 legado, 32 fallback, 58 servidas e 11 divergências.",
    delta: { composer: 1, fallback: -1, served: 1 },
  },
] as const;

for (const migracao of MIGRACOES_DO_BLOCO) {
  (core.COVERAGE_MIGRATIONS as unknown as Array<(typeof MIGRACOES_DO_BLOCO)[number]>).push(migracao);
  Object.assign(core.COVERAGE_BASELINE, {
    composer: core.COVERAGE_BASELINE.composer + (migracao.delta.composer ?? 0),
    fallback: core.COVERAGE_BASELINE.fallback + (migracao.delta.fallback ?? 0),
    served: core.COVERAGE_BASELINE.served + (migracao.delta.served ?? 0),
  });
}

export const COVERAGE_CLOSED_BASELINE = core.COVERAGE_CLOSED_BASELINE;
export const COVERAGE_MIGRATIONS = core.COVERAGE_MIGRATIONS;
export const COVERAGE_BASELINE = core.COVERAGE_BASELINE;
export const buildCoverageMatrix = core.buildCoverageMatrix;
export const renderCoverageMatrixMarkdown = core.renderCoverageMatrixMarkdown;
export const renderCoverageMatrixJson = core.renderCoverageMatrixJson;
export type { CoverageMatrixRow, CoverageMatrixCounts, CoverageMatrixResult } from "./coverage_matrix_core";
