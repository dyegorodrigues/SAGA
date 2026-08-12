import { describe, expect, it } from "vitest";
import {
  buildCoverageMatrix,
  COVERAGE_BASELINE,
  COVERAGE_CLOSED_BASELINE,
  COVERAGE_MIGRATIONS,
  renderCoverageMatrixJson,
  renderCoverageMatrixMarkdown,
} from "../../AI_Studio_Lab/tools/coverage_matrix";

describe("Coverage Matrix executável", () => {
  it("preserva o fechamento P21.1 e deriva o baseline vigente por migrações nomeadas", () => {
    expect(COVERAGE_CLOSED_BASELINE).toMatchObject({
      composer: 26,
      legacy: 25,
      fallback: 39,
      served: 51,
      divergences: 21,
    });
    expect(COVERAGE_MIGRATIONS).toEqual([
      expect.objectContaining({ id: "W1-N1.04", competence: "N1.04", delta: { divergences: -1 } }),
      expect.objectContaining({ id: "W2-N1.05", competence: "N1.05", delta: { composer: 1, legacy: -1, divergences: -1 } }),
      expect.objectContaining({ id: "W3-N2.01", competence: "N2.01", delta: { composer: 1, legacy: -1, divergences: -1 } }),
      expect.objectContaining({ id: "W4-N1.12", competence: "N1.12", delta: { composer: 1, legacy: -1, divergences: -1 } }),
      expect.objectContaining({ id: "W5-GM.05", competence: "GM.05", delta: { composer: 1, fallback: -1, served: 1 } }),
      expect.objectContaining({ id: "W6-N2.03", competence: "N2.03", delta: { composer: 1, legacy: -1, divergences: -1 } }),
      expect.objectContaining({ id: "W7-N2.02", competence: "N2.02", delta: { composer: 1, legacy: -1 } }),
      expect.objectContaining({ id: "W8-N3.01", competence: "N3.01", delta: { composer: 1, legacy: -1 } }),
    ]);
    expect(COVERAGE_BASELINE).toMatchObject({
      composer: 33,
      legacy: 19,
      fallback: 38,
      served: 52,
      divergences: 16,
      modeSwaps: 12,
      toolIntroductions: 44,
    });
  });

  it("liga grafo, ficha, runtime, screen, Sensei, testes, dívida e ordem causal nas 90 competências", () => {
    const result = buildCoverageMatrix();
    const divergent = result.rows
      .filter(row => row.divergence.length > 0)
      .map(row => `${row.id}: pede ${row.canonicalPrimitives.join(" + ")} → entrega ${row.runtimePrimitives.join(" + ") || "nada"}; faltam ${row.divergence.join(" + ")}`);

    expect(result.failures, [
      "Coverage Matrix divergiu do baseline vigente.",
      "Não ajuste expectativa para ficar verde: investigue e reconcilie a fonte real.",
      ...result.failures,
      "",
      `Divergências observadas (${divergent.length}):`,
      ...divergent,
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