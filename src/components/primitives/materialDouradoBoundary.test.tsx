// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { FichaRenderer } from "../FichaRenderer";
import { MisconceptionTag } from "../../constants/misconceptions";
import { N2_01 } from "../../curriculum/fichas/jornada/N2.01";
import {
  MaterialDouradoSpec,
  construirDezenaUnidadesQuestion,
} from "../../curriculum/procedimentos/materialDouradoContract";
import { isRetryableAnswer, ownsAuthorialFeedback, ownsAuthorialRetry } from "../gameloop/answerPolicy";

function qDoNivel(nivel: number) {
  return construirDezenaUnidadesQuestion(N2_01, nivel);
}

function agruparTodasAsDezenas(container: HTMLElement, spec: MaterialDouradoSpec) {
  for (let i = 0; i < spec.dezenas * 10; i += 1) {
    const cubo = container.querySelector<HTMLButtonElement>("[data-material-unidade-solta]");
    expect(cubo).not.toBeNull();
    fireEvent.click(cubo!);
  }
}

describe("F21 — palco → FichaRenderer → AnswerMeta", () => {
  it("propaga NAO_AGRUPA mesmo quando o total final está correto", () => {
    const q = qDoNivel(3);
    const spec = q.uiProps as MaterialDouradoSpec;
    const onAnswer = vi.fn();
    const { container } = render(<FichaRenderer question={q} onAnswer={onAnswer} />);

    agruparTodasAsDezenas(container, spec);
    const barra = container.querySelector<HTMLButtonElement>("[data-material-inspect-ten]");
    expect(barra).not.toBeNull();
    fireEvent.click(barra!);

    const certa = [...container.querySelectorAll<HTMLButtonElement>("[data-material-resposta]")]
      .find(button => Number(button.textContent) === spec.total);
    expect(certa).not.toBeUndefined();
    fireEvent.click(certa!);

    expect(onAnswer).toHaveBeenCalledWith(
      spec.total,
      true,
      expect.objectContaining({ misconception: MisconceptionTag.NAO_AGRUPA }),
    );
  });

  it("L1 só emite evidência de agrupamento depois das dez unidades e resposta correta", () => {
    const q = qDoNivel(1);
    const spec = q.uiProps as MaterialDouradoSpec;
    const onAnswer = vi.fn();
    const { container } = render(<FichaRenderer question={q} onAnswer={onAnswer} />);

    agruparTodasAsDezenas(container, spec);
    const certa = [...container.querySelectorAll<HTMLButtonElement>("[data-material-resposta]")]
      .find(button => Number(button.textContent) === spec.total);
    fireEvent.click(certa!);

    expect(onAnswer).toHaveBeenCalledWith(
      spec.total,
      true,
      expect.objectContaining({ evidencias: expect.arrayContaining(["agrupou-dez-em-dez"]) }),
    );
  });

  it("L4 correto emite a evidência bidirecional exigida pela F21 §9", () => {
    const q = qDoNivel(4);
    const spec = q.uiProps as MaterialDouradoSpec;
    const onAnswer = vi.fn();
    const { container } = render(<FichaRenderer question={q} onAnswer={onAnswer} />);

    const addD = container.querySelector<HTMLButtonElement>("[data-material-add-dezena]")!;
    const addU = container.querySelector<HTMLButtonElement>("[data-material-add-unidade]")!;
    for (let i = 0; i < spec.dezenas; i += 1) fireEvent.click(addD);
    for (let i = 0; i < spec.unidades; i += 1) fireEvent.click(addU);
    fireEvent.click(container.querySelector<HTMLButtonElement>("[data-material-pronto]")!);

    expect(onAnswer).toHaveBeenCalledWith(
      spec.total,
      true,
      expect.objectContaining({ evidencias: expect.arrayContaining(["montou-do-numeral"]) }),
    );
  });

  it("L5 decompõe sem material e mantém o mesmo boundary de evidência", () => {
    const q = qDoNivel(5);
    const spec = q.uiProps as MaterialDouradoSpec;
    const onAnswer = vi.fn();
    const { container } = render(<FichaRenderer question={q} onAnswer={onAnswer} />);

    const addD = container.querySelector<HTMLButtonElement>("[data-decompor-add-dezena]")!;
    const addU = container.querySelector<HTMLButtonElement>("[data-decompor-add-unidade]")!;
    for (let i = 0; i < spec.dezenas; i += 1) fireEvent.click(addD);
    for (let i = 0; i < spec.unidades; i += 1) fireEvent.click(addU);
    fireEvent.click(container.querySelector<HTMLButtonElement>("[data-decompor-pronto]")!);

    expect(onAnswer).toHaveBeenCalledWith(
      spec.total,
      true,
      expect.objectContaining({ evidencias: expect.arrayContaining(["decomposicao-mental-du"]) }),
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
