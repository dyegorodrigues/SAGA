import { describe, expect, it } from "vitest";
import { buildCoverageMatrix, COVERAGE_BASELINE, COVERAGE_CLOSED_BASELINE, COVERAGE_MIGRATIONS, renderCoverageMatrixJson, renderCoverageMatrixMarkdown } from "../../AI_Studio_Lab/tools/coverage_matrix";

describe("Coverage Matrix executável", () => {
  it("preserva o fechamento P21.1 e deriva o baseline vigente por migrações nomeadas", () => {
    expect(COVERAGE_CLOSED_BASELINE).toMatchObject({ composer: 26, legacy: 25, fallback: 39, served: 51, divergences: 21 });
    expect(COVERAGE_MIGRATIONS.map(m => m.id)).toEqual([
      "W1-N1.04", "W2-N1.05", "W3-N2.01", "W4-N1.12", "W5-GM.05", "W6-N2.03", "W7-N2.02", "W8-N3.01", "W9-N3.02", "W10-N3.03", "OBS-COMPOSITE-N4.03", "W11-AL.03", "W12-N4.01", "W13-GE.03", "W14-AL.04", "W15-N5.01", "W16-N5.02", "W17-N6.01", "W18-N5.03", "W19-N4.10", "W20-GM.07", "W21-AL.05", "W22-N6.03", "W23-GE.06", "W24-N7.01", "W25-PE.02", "W26-GM.08", "W27-AL.06", "W28-GE.05", "W29-GE.04", "W30-N2.06", "W31-PE.03", "W32-GM.09", "W33-GE.07", "W34-GE.08", "W35-GM.06", "W36-GM.10", "W37-N7.02", "W38-AL.07", "W39-N2.07", "W40-GE.09", "W41-GE.10", "W42-N4.11", "W43-N4.12", "W44-N5.04", "W45-N6.04", "W46-AL.08", "W47-N6.02", "W48-GM.11", "W49-PE.04", "W50-N5.05", "W51-N4.02", "W52-N3.11", "W53-N3.04", "W54-N3.06", "W55-N3.07", "W56-N3.05", "W57-N3.08", "W58-PE.01", "W59-GM.03", "W60-N2.04", "W61-N4.05", "W62-N2.05",
    ]);
    expect(COVERAGE_MIGRATIONS.at(-1)).toMatchObject({ id: "W62-N2.05", competence: "N2.05", delta: { composer: 1, legacy: -1 } });
    expect(COVERAGE_BASELINE).toMatchObject({ composer: 87, legacy: 3, fallback: 0, served: 90, divergences: 8, modeSwaps: 12, toolIntroductions: 44 });
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