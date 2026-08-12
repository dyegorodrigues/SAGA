// @vitest-environment jsdom
import React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FichaRenderer } from "../FichaRenderer";
import { MisconceptionTag } from "../../constants/misconceptions";
import { N1_12 } from "../../curriculum/fichas/jornada/N1.12";
import { construirReta20Question, Reta20Spec } from "../../curriculum/procedimentos/reta20Contract";
import { isRetryableAnswer, ownsAuthorialFeedback, ownsAuthorialRetry } from "../gameloop/answerPolicy";

function qDoNivel(nivel: number) {
  return construirReta20Question(N1_12, nivel);
}

function vizinhoErradoQueNaoEhOrigem(spec: Reta20Spec): number {
  const candidatos = [spec.alvo - 1, spec.alvo + 1]
    .filter(valor => valor >= spec.inicio && valor <= spec.fim)
    .filter(valor => valor !== spec.posicaoInicial);
  if (!candidatos.length) throw new Error("F19 sem vizinho ±1 distinto da origem para testar OFF_BY_ONE.");
  return candidatos[0];
}

describe("F19 — Reta20Stage → FichaRenderer → AnswerMeta", () => {
  it("±1 preciso chega ao Radar como OFF_BY_ONE, não como escorregão motor", () => {
    const q = qDoNivel(3);
    const spec = q.uiProps as Reta20Spec;
    const onAnswer = vi.fn();
    const { container } = render(<FichaRenderer question={q} onAnswer={onAnswer} />);
    const errada = vizinhoErradoQueNaoEhOrigem(spec);
    fireEvent.click(container.querySelector<HTMLButtonElement>(`[data-reta-tick="${errada}"]`)!);
    expect(onAnswer).toHaveBeenCalledWith(
      errada,
      false,
      expect.objectContaining({
        misconception: MisconceptionTag.OFF_BY_ONE,
        manipulacao: expect.objectContaining({ precisoEmDestinoErrado: true }),
      }),
    );
  });

  it("acerto só chega ao boundary depois da coreografia e não produz misconception", () => {
    vi.useFakeTimers();
    try {
      const q = qDoNivel(2);
      const spec = q.uiProps as Reta20Spec;
      const onAnswer = vi.fn();
      const { container } = render(<FichaRenderer question={q} onAnswer={onAnswer} />);
      fireEvent.click(container.querySelector<HTMLButtonElement>(`[data-reta-tick="${spec.alvo}"]`)!);
      expect(onAnswer).not.toHaveBeenCalled();
      act(() => vi.runAllTimers());
      expect(onAnswer).toHaveBeenCalledWith(
        spec.alvo,
        true,
        expect.not.objectContaining({ misconception: expect.anything() }),
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it("o GameLoop reconhece numberline-f19 como retry e feedback autorais sem options", () => {
    const q = qDoNivel(4);
    expect(q.options).toBeUndefined();
    expect(isRetryableAnswer(q, 0)).toBe(true);
    expect(ownsAuthorialRetry(q)).toBe(true);
    expect(ownsAuthorialFeedback(q)).toBe(true);
  });
});