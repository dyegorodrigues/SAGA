import * as core from "./coverage_matrix_core";

/**
 * Ledger incremental do bloco W16–W19.
 *
 * O core conserva byte a byte o fechamento anterior; as ondas deste bloco só
 * entram aqui DEPOIS da Matrix observar o delta real. O wrapper atualiza o
 * objeto que o validador do core consulta em runtime, sem reescrever o snapshot
 * P21.1 nem antecipar ondas futuras.
 */
const W16 = {
  id: "W16-N5.02",
  competence: "N5.02",
  rationale: "F72 materializada no FracaoNumeroStage, compondo SingaporeBars + InteractiveNumberLine. O canário inativo 4789636c passou CI 31764367753 + transversal 31764367742 no mesmo SHA. A promoção a3bcf427 fez a Matrix observar 41 Composer, 15 legado, 34 fallback, 56 servidas e 11 divergências.",
  delta: { composer: 1, fallback: -1, served: 1 },
} as const;

(core.COVERAGE_MIGRATIONS as unknown as Array<typeof W16>).push(W16);
Object.assign(core.COVERAGE_BASELINE, {
  composer: core.COVERAGE_BASELINE.composer + 1,
  fallback: core.COVERAGE_BASELINE.fallback - 1,
  served: core.COVERAGE_BASELINE.served + 1,
});

export const COVERAGE_CLOSED_BASELINE = core.COVERAGE_CLOSED_BASELINE;
export const COVERAGE_MIGRATIONS = core.COVERAGE_MIGRATIONS;
export const COVERAGE_BASELINE = core.COVERAGE_BASELINE;
export const buildCoverageMatrix = core.buildCoverageMatrix;
export const renderCoverageMatrixMarkdown = core.renderCoverageMatrixMarkdown;
export const renderCoverageMatrixJson = core.renderCoverageMatrixJson;
export type { CoverageMatrixRow, CoverageMatrixCounts, CoverageMatrixResult } from "./coverage_matrix_core";
