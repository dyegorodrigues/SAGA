import { describe, expect, it } from "vitest";
import {
  construirIgualdadeEquilibrioResolucao,
  construirIgualdadeEquilibrioSpec,
  evidenciasIgualdadeEquilibrio,
  IGUALDADE_EQUILIBRIO_EVIDENCE_PREFIX,
} from "./procedimentos/igualdadeEquilibrioContract";

describe("F46 — contrato de equilíbrio e diversidade L4", () => {
  it("produz casos L4 distintos sob o mesmo prefixo de domínio", () => {
    const specs = [0, 0.4, 0.8].map(seed => construirIgualdadeEquilibrioSpec(4, () => seed));
    const evidencias = specs.flatMap(spec => evidenciasIgualdadeEquilibrio(spec, true));
    expect(new Set(evidencias).size).toBe(3);
    expect(evidencias.every(evidencia => evidencia.startsWith(IGUALDADE_EQUILIBRIO_EVIDENCE_PREFIX))).toBe(true);
  });

  it("não emite diversidade em erro nem fora do L4", () => {
    const l4 = construirIgualdadeEquilibrioSpec(4, () => 0);
    const l3 = construirIgualdadeEquilibrioSpec(3, () => 0);
    expect(evidenciasIgualdadeEquilibrio(l4, false)).toEqual([]);
    expect(evidenciasIgualdadeEquilibrio(l3, true)).toEqual([]);
  });

  it("mantém resolução declarativa R0-A", () => {
    const spec = construirIgualdadeEquilibrioSpec(5, () => 0);
    const resolucao = construirIgualdadeEquilibrioResolucao(spec);
    expect(resolucao.fallback).toBe(0);
    expect(resolucao.passos).toHaveLength(3);
    expect(resolucao.passos.at(-1)?.parcial).toBe(spec.resposta);
  });
});
