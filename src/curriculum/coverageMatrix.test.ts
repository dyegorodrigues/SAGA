import { describe, expect, it } from "vitest";
import { buildCoverageMatrix, COVERAGE_BASELINE, COVERAGE_CLOSED_BASELINE, COVERAGE_MIGRATIONS, renderCoverageMatrixJson, renderCoverageMatrixMarkdown } from "../../AI_Studio_Lab/tools/coverage_matrix";

describe("Coverage Matrix executável", () => {
  it("preserva o fechamento P21.1 e deriva o baseline vigente por migrações nomeadas", () => {
    expect(COVERAGE_CLOSED_BASELINE).toMatchObject({ composer: 26, legacy: 25, fallback: 39, served: 51, divergences: 21 });
    expect(COVERAGE_MIGRATIONS.map(m => m.id)).toEqual([
      "W1-N1.04", "W2-N1.05", "W3-N2.01", "W4-N1.12", "W5-GM.05", "W6-N2.03", "W7-N2.02", "W8-N3.01", "W9-N3.02", "W10-N3.03", "OBS-COMPOSITE-N4.03", "W11-AL.03", "W12-N4.01", "W13-GE.03", "W14-AL.04", "W15-N5.01", "W16-N5.02", "W17-N6.01", "W18-N5.03", "W19-N4.10", "W20-GM.07", "W21-AL.05", "W22-N6.03", "W23-GE.06", "W24-N7.01", "W25-PE.02", "W26-GM.08", "W27-AL.06", "W28-GE.05", "W29-GE.04", "W30-N2.06", "W31-PE.03", "W32-GM.09", "W33-GE.07", "W34-GE.08",
    ]);
    expect(COVERAGE_MIGRATIONS.at(-1)).toMatchObject({ id: "W34-GE.08", competence: "GE.08", delta: { composer: 1, fallback: -1, served: 1 } });
    expect(COVERAGE_BASELINE).toMatchObject({ composer: 59, legacy: 15, fallback: 16, served: 74, divergences: 11, modeSwaps: 12, toolIntroductions: 44 });
  });

  it("liga grafo, ficha, runtime, screen, Sensei, testes, dívida e ordem causal nas 90 competências", () => {
    const result = buildCoverageMatrix();
    const divergent = result.rows.filter(row => row.divergence.length > 0).map(row => `${row.id}: pede ${row.canonicalPrimitives.join(" + ")} → entrega ${row.runtimePrimitives.join(" + ") || "nada"}; faltam ${row.divergence.join(" + ")}`);
    expect(result.failures, ["Coverage Matrix divergiu do baseline vigente.", "Não ajuste expectativa para ficar verde: investigue e reconcilie a fonte real.", ...result.failures, "", `Divergências observadas (${divergent.length}):`, ...divergent].join("\n")).toEqual([]);
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