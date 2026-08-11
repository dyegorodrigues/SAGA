import { describe, expect, it } from "vitest";
import { buildCoverageMatrix } from "./coverage_matrix";

/**
 * Dívida histórica já ativa quando §6.36 virou mecanismo.
 *
 * A finalidade desta lista NÃO é anistiar onboarding ausente. É impedir dois
 * erros de governança ao mesmo tempo:
 *
 * 1. uma nova promoção Padrão Ouro aumentar a dívida sem o CI perceber;
 * 2. uma entrada já corrigida ficar eternamente na allowlist e transformar a
 *    exceção temporária em permissão permanente.
 *
 * Ao resolver um item, apague-o desta lista no MESMO change-set. Se aparecer
 * qualquer id novo, o teste falha antes de a nova dívida virar normalidade.
 */
const GOLD_ONBOARDING_DEBT_BASELINE = [
  "N1.07",
  "N1.09",
  "N3.10",
  "N4.03",
  "N4.06",
] as const;

function activeGoldOnboardingDebt(): string[] {
  const matrix = buildCoverageMatrix();
  expect(matrix.failures, `Coverage Matrix já está divergente:\n${matrix.failures.join("\n")}`).toEqual([]);

  return matrix.rows
    .filter(row =>
      row.status === "padrao-ouro"
      && (row.modeSwaps.length > 0 || row.toolIntroductions.length > 0)
      && row.visualOnboarding !== "presente",
    )
    .map(row => row.id)
    .sort();
}

describe("§6.36 — progressão de linguagem visual", () => {
  it("nenhum novo Padrão Ouro aumenta a dívida de onboarding sem o CI perceber", () => {
    expect(activeGoldOnboardingDebt()).toEqual([...GOLD_ONBOARDING_DEBT_BASELINE].sort());
  });

  it("a baseline não mantém exceção morta depois que o onboarding é resolvido", () => {
    const active = new Set(activeGoldOnboardingDebt());
    for (const id of GOLD_ONBOARDING_DEBT_BASELINE) {
      expect(active.has(id), `${id} já não é dívida ativa — remova-o da baseline`).toBe(true);
    }
  });
});
