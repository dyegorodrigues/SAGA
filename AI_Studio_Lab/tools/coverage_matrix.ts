import * as core from "./coverage_matrix_core";

/** Ledger incremental W16–W19. Só entra depois da Matrix observar o delta real. */
const MIGRACOES_DO_BLOCO = [
  {
    id: "W16-N5.02",
    competence: "N5.02",
    rationale: "F72 materializada no FracaoNumeroStage, compondo SingaporeBars + InteractiveNumberLine. Inativo 4789636c: CI 31764367753 + transversal 31764367742. Promoção a3bcf427: Matrix observou 41 Composer / 15 legado / 34 fallback / 56 servidas / 11 divergências.",
    delta: { composer: 1, fallback: -1, served: 1 },
  },
  {
    id: "W17-N6.01",
    competence: "N6.01",
    rationale: "F75 relê Quadrado100 como um inteiro, com décimos e centésimos. Inativo f52d74aa: CI 31766412517 + transversal 31766412457. Promoção b9dc5999: Matrix observou 42 Composer / 15 legado / 33 fallback / 57 servidas / 11 divergências.",
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
