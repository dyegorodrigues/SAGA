import { describe, expect, it } from "vitest";
import {
  buildCoverageMatrix,
  COVERAGE_BASELINE,
  renderCoverageMatrixJson,
  renderCoverageMatrixMarkdown,
} from "../../AI_Studio_Lab/tools/coverage_matrix";

describe("Coverage Matrix executável", () => {
  it("liga grafo, ficha, runtime, screen, Sensei, testes, dívida e ordem causal nas 90 competências", () => {
    const result = buildCoverageMatrix();

    expect(result.failures, [
      "Coverage Matrix divergiu do baseline vigente.",
      "Não ajuste expectativa para ficar verde: investigue e reconcilie a fonte real.",
      ...result.failures,
    ].join("\n")).toEqual([]);

    expect(result.rows).toHaveLength(COVERAGE_BASELINE.competencies);
    expect(new Set(result.rows.map(row => row.id)).size).toBe(COVERAGE_BASELINE.competencies);
    expect(result.rows.every(row => row.canonicalFichas.length > 0)).toBe(true);
    expect(result.rows.every(row => row.action.length > 0)).toBe(true);

    const format = process.env.SAGA_COVERAGE_FORMAT;
    if (format === "markdown") console.log(`\n${renderCoverageMatrixMarkdown(result)}`);
    if (format === "json") console.log(`\n${renderCoverageMatrixJson(result)}`);
    if (!format) console.log("\nSAGA — COVERAGE MATRIX: OK\n", JSON.stringify(result.counts, null, 2));
  });
});
