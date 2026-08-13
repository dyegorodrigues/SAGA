// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";
import { construirVisualAdditionSpec } from "../../curriculum/procedimentos/visualAdditionContract";
import { VisualAdditionStage } from "./VisualAdditionStage";

const fixo = (value: number) => () => value;

describe("VisualAdditionStage — F13", () => {
  it("preserva objetos no L1-L3, numerais no L4 e símbolo puro no L5", () => {
    const { container, rerender } = render(
      <VisualAdditionStage spec={construirVisualAdditionSpec(1, fixo(0.2))} onAnswer={() => {}} />,
    );
    expect(container.querySelector('[data-visual-addition]')).toBeInTheDocument();
    expect(container.querySelector('[data-simbolo-puro]')).not.toBeInTheDocument();

    rerender(<VisualAdditionStage spec={construirVisualAdditionSpec(4, fixo(0.2))} onAnswer={() => {}} />);
    expect(container.querySelector('[data-representacao="numerais"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-visual-addition-group="A"] span[aria-hidden]')).toHaveLength(0);

    rerender(<VisualAdditionStage spec={construirVisualAdditionSpec(5, fixo(0.2))} onAnswer={() => {}} />);
    expect(container.querySelector('[data-simbolo-puro]')).toBeInTheDocument();
    expect(container.querySelector('[data-visual-addition]')).not.toBeInTheDocument();
  });

  it("oferece o botão de juntar somente no L2 e registra ajuda", () => {
    const onAnswer = vi.fn();
    const spec = construirVisualAdditionSpec(2, fixo(0.2));
    render(<VisualAdditionStage spec={spec} onAnswer={onAnswer} />);
    fireEvent.click(screen.getByRole("button", { name: "Quer juntar?" }));
    expect(screen.queryByRole("button", { name: "Quer juntar?" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: `Responder ${spec.total}` }));
    expect(onAnswer.mock.calls[0][1]).toMatchObject({ correta: true, juntou: true, usouAjuda: true });
  });

  it("materializa os três passos de onboarding visual", () => {
    const spec = construirVisualAdditionSpec(1, fixo(0.2));
    const { container, rerender } = render(
      <VisualAdditionStage spec={spec} mostrar={{ destacarGrupo: "A" }} onAnswer={() => {}} />,
    );
    expect(container.querySelector('[data-visual-addition-group="A"] > div')).toHaveClass("border-blue-600");

    rerender(<VisualAdditionStage spec={spec} mostrar={{ destacarGrupo: "B" }} onAnswer={() => {}} />);
    expect(container.querySelector('[data-visual-addition-group="B"] > div')).toHaveClass("border-blue-600");

    rerender(<VisualAdditionStage spec={spec} mostrar={{ fundirGrupos: true }} onAnswer={() => {}} />);
    expect(container.querySelector('[data-visual-addition-merged]')).toBeInTheDocument();
  });

  it("tem teclado acessível e alvos grandes", () => {
    const spec = construirVisualAdditionSpec(3, fixo(0.2));
    render(<VisualAdditionStage spec={spec} onAnswer={() => {}} />);
    expect(screen.getAllByRole("button", { name: /Responder/ })).toHaveLength(11);
    expect(screen.getByRole("button", { name: `Responder ${spec.total}` })).toHaveClass("min-h-16");
  });

  it("não apresenta violações de acessibilidade nos cinco níveis", async () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const { container, unmount } = render(
        <VisualAdditionStage spec={construirVisualAdditionSpec(nivel, fixo(0.2))} onAnswer={() => {}} />,
      );
      const resultado = await axe.run(container);
      expect(resultado.violations).toEqual([]);
      unmount();
    }
  }, 15000);
});
