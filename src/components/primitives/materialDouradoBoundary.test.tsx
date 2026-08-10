// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { FichaRenderer } from "../FichaRenderer";
import { MisconceptionTag } from "../../constants/misconceptions";
import { N2_01 } from "../../curriculum/fichas/jornada/N2.01";
import { construirDezenaUnidadesQuestion } from "../../curriculum/procedimentos/materialDouradoContract";
import { isRetryableAnswer, ownsAuthorialFeedback, ownsAuthorialRetry } from "../gameloop/answerPolicy";

function qDoNivel(nivel: number) {
  return construirDezenaUnidadesQuestion(N2_01, nivel);
}

describe("F21 — palco → FichaRenderer → AnswerMeta", () => {
  it("propaga CONTA_TUDO quando a criança inspeciona a barra e erra", () => {
    const q = qDoNivel(3);
    const onAnswer = vi.fn();
    const { container } = render(<FichaRenderer question={q} onAnswer={onAnswer} />);

    const barra = container.querySelector<HTMLButtonElement>("[data-material-inspect-ten]");
    const errada = container.querySelector<HTMLButtonElement>("[data-material-resposta-errada]");
    expect(barra).not.toBeNull();
    expect(errada).not.toBeNull();
    fireEvent.click(barra!);
    fireEvent.click(errada!);

    expect(onAnswer).toHaveBeenCalledWith(
      expect.any(Number),
      false,
      expect.objectContaining({ misconception: MisconceptionTag.CONTA_TUDO }),
    );
  });

  it("L1 só emite a evidência da troca depois do décimo cubinho e resposta correta", () => {
    const q = qDoNivel(1);
    const onAnswer = vi.fn();
    const { container } = render(<FichaRenderer question={q} onAnswer={onAnswer} />);

    for (let i = 0; i < 10; i += 1) {
      fireEvent.click(container.querySelector<HTMLButtonElement>("[data-material-unidade-solta]")!);
    }
    const certa = [...container.querySelectorAll<HTMLButtonElement>("[data-material-resposta]")]
      .find(button => Number(button.textContent) === q.answer);
    fireEvent.click(certa!);

    expect(onAnswer).toHaveBeenCalledWith(
      q.answer,
      true,
      expect.objectContaining({ evidencias: expect.arrayContaining(["troca-10-por-1"]) }),
    );
  });

  it("produção correta emite evidência sem recontar subdivisões", () => {
    const q = qDoNivel(4);
    const spec = q.uiProps as { dezenas: number; unidades: number };
    const onAnswer = vi.fn();
    const { container } = render(<FichaRenderer question={q} onAnswer={onAnswer} />);

    const addD = container.querySelector<HTMLButtonElement>("[data-material-add-dezena]")!;
    const addU = container.querySelector<HTMLButtonElement>("[data-material-add-unidade]")!;
    for (let i = 0; i < spec.dezenas; i += 1) fireEvent.click(addD);
    for (let i = 0; i < spec.unidades; i += 1) fireEvent.click(addU);
    fireEvent.click(container.querySelector<HTMLButtonElement>("[data-material-pronto]")!);

    expect(onAnswer).toHaveBeenCalledWith(
      q.answer,
      true,
      expect.objectContaining({
        evidencias: expect.arrayContaining(["producao-sem-contar-subdivisoes"]),
      }),
    );
  });

  it("o GameLoop reconhece material-dourado como retry/feedback autoral mesmo sem q.options", () => {
    const q = qDoNivel(4);
    expect(q.options).toBeUndefined();
    expect(isRetryableAnswer(q, 0)).toBe(true);
    expect(ownsAuthorialRetry(q)).toBe(true);
    expect(ownsAuthorialFeedback(q)).toBe(true);
  });
});
