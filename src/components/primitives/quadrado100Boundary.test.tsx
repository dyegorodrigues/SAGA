// @vitest-environment jsdom
import React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FichaRenderer } from "../FichaRenderer";
import { isRetryableAnswer, ownsAuthorialFeedback, ownsAuthorialRetry } from "../gameloop/answerPolicy";
import { Quadrado100Spec } from "../../curriculum/procedimentos/quadrado100Contract";
import { Quadrado100Evidence, Quadrado100Misconception } from "../../curriculum/procedimentos/quadrado100Semantics";
import { Question } from "../../types";

function specVertical(): Quadrado100Spec {
  return {
    nivel: 2,
    modo: "vertical",
    inicio: 34,
    mostrarInicio: true,
    caminho: [44, 54, 64],
    casasOcultas: [44, 54, 64],
    passo: 10,
    alvo: 64,
    enunciado: "Comece no 34 e conte de dez em dez.",
    falado: "Comece no trinta e quatro e conte de dez em dez.",
  };
}

function questao(spec: Quadrado100Spec): Question {
  return {
    kind: "quadrado100-f36",
    prompt: spec.enunciado,
    audioPrompt: spec.falado,
    uiProps: spec,
    answer: spec.alvo,
    evaluate: answer => Number(answer) === spec.alvo,
    options: undefined,
  };
}

function casa(container: HTMLElement, n: number): HTMLButtonElement {
  const node = container.querySelector<HTMLButtonElement>(`[data-quadrado100-cell="${n}"]`);
  if (!node) throw new Error(`Casa ${n} não renderizada.`);
  return node;
}

describe("F36 — Quadrado100Stage → FichaRenderer → AnswerMeta", () => {
  it("erro lateral preciso no percurso +10 chega ao Radar como CONFUNDE_DIRECAO e continua retry autoral", () => {
    const q = questao(specVertical());
    const onAnswer = vi.fn();
    const { container } = render(<FichaRenderer question={q} onAnswer={onAnswer} />);

    fireEvent.click(casa(container, 35));

    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenLastCalledWith(
      35,
      false,
      expect.objectContaining({
        misconception: Quadrado100Misconception.CONFUNDE_DIRECAO,
        manipulacao: expect.objectContaining({ precisoEmDestinoErrado: true }),
      }),
    );
    expect(isRetryableAnswer(q, 35, onAnswer.mock.calls[0][2])).toBe(true);
    expect(ownsAuthorialRetry(q, onAnswer.mock.calls[0][2])).toBe(true);
    expect(ownsAuthorialFeedback(q, onAnswer.mock.calls[0][2])).toBe(true);
  });

  it("só fecha a resposta após produzir todo o percurso e emite a evidência vertical", () => {
    vi.useFakeTimers();
    try {
      const q = questao(specVertical());
      const onAnswer = vi.fn();
      const { container } = render(<FichaRenderer question={q} onAnswer={onAnswer} />);

      fireEvent.click(casa(container, 44));
      fireEvent.click(casa(container, 54));
      expect(onAnswer).not.toHaveBeenCalled();

      fireEvent.click(casa(container, 64));
      expect(onAnswer).not.toHaveBeenCalled();
      act(() => vi.advanceTimersByTime(450));

      expect(onAnswer).toHaveBeenCalledTimes(1);
      expect(onAnswer).toHaveBeenCalledWith(
        64,
        true,
        expect.objectContaining({
          evidencias: [Quadrado100Evidence.PERCURSO_VERTICAL],
          quadrado100: expect.objectContaining({
            inicio: 34,
            caminho: [44, 54, 64],
            toques: [44, 54, 64],
            erros: [],
            revisoes: 0,
            completo: true,
          }),
        }),
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it("casa oculta não entrega o numeral no texto nem no nome acessível", () => {
    const q = questao(specVertical());
    const { container } = render(<FichaRenderer question={q} onAnswer={() => undefined} />);
    const oculta = casa(container, 44);

    expect(oculta.dataset.hidden).toBe("true");
    expect(oculta.textContent).not.toContain("44");
    expect(oculta.getAttribute("aria-label")).toBe("Casa vazia, linha 5, coluna 4");
    expect(oculta.getAttribute("aria-label")).not.toContain("44");
  });

  it("a grade mantém exatamente cem casas tocáveis no contrato autoral", () => {
    const q = questao(specVertical());
    const { container } = render(<FichaRenderer question={q} onAnswer={() => undefined} />);
    expect(container.querySelectorAll("[data-quadrado100-cell]")).toHaveLength(100);
  });
});
