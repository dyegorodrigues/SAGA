// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DivisaoDoisDigitosStage } from "../components/primitives/DivisaoDoisDigitosStage";
import { Evidencia } from "../constants/evidencias";
import {
  construirDivisaoDoisDigitosF71Spec,
  DivisaoDoisDigitosMisconception,
} from "./procedimentos/divisaoDoisDigitosContract";

describe("W43/F71 — realização física InteractiveVertical com estimativa, teste e ajuste", () => {
  it("faz 399÷19 a partir de uma estimativa produzida pela criança, sem vazar 21, e colhe a evidência do ajuste", () => {
    const onAnswer = vi.fn();
    const spec = construirDivisaoDoisDigitosF71Spec(2);
    const { container } = render(<DivisaoDoisDigitosStage spec={spec} onAnswer={onAnswer} />);

    expect(container.querySelector("[data-f71-problem]")).toBeInTheDocument();
    expect(screen.getByText("399 ÷ 19")).toBeInTheDocument();
    expect(container.querySelector("[data-interactive-vertical-division-estimate]")).not.toBeInTheDocument();
    expect(screen.queryByText(/^21$/)).not.toBeInTheDocument();

    const adicionar10 = screen.getByRole("button", { name: "Adicionar 10 na estimativa" });
    fireEvent.click(adicionar10);
    fireEvent.click(adicionar10);

    expect(container.querySelector("[data-interactive-vertical-division-estimate]")).toBeInTheDocument();
    expect(screen.getByLabelText("Estimativa atual 20")).toBeInTheDocument();
    expect(screen.queryByText("20 × 19 = 380")).not.toBeInTheDocument();

    const testar = screen.getByRole("button", { name: "Testar estimativa" });
    fireEvent.click(testar);
    expect(screen.getByText("20 × 19 = 380")).toBeInTheDocument();
    expect(screen.getByText(/ainda cabe outro grupo/i)).toBeInTheDocument();
    expect(onAnswer).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Adicionar 1 na estimativa" }));
    expect(screen.queryByText("20 × 19 = 380")).not.toBeInTheDocument();
    expect(onAnswer).not.toHaveBeenCalled();

    fireEvent.click(testar);
    expect(screen.getByText("21 × 19 = 399")).toBeInTheDocument();
    expect(screen.getByText(/maior quantidade de grupos que cabe/i)).toBeInTheDocument();
    expect(onAnswer).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Confirmar esta estimativa" }));
    expect(onAnswer).toHaveBeenCalledWith(21, {
      source: "vertical-column",
      evidencias: ["f71-divisor-quase-redondo", Evidencia.AJUSTE_PRIMEIRA_ESTIMATIVA_F71],
    });
  });

  it("não transforma teste/ajuste em misconception e só diagnostica confirmação consciente de estimativa refutada", () => {
    const onAnswer = vi.fn();
    const spec = construirDivisaoDoisDigitosF71Spec(2);
    const { container } = render(<DivisaoDoisDigitosStage spec={spec} onAnswer={onAnswer} />);

    for (let i = 0; i < 5; i += 1) fireEvent.click(screen.getByRole("button", { name: "Adicionar 1 na estimativa" }));
    fireEvent.click(screen.getByRole("button", { name: "Testar estimativa" }));
    expect(onAnswer).not.toHaveBeenCalled();

    for (const control of container.querySelectorAll("[data-f71-motor-control]")) {
      expect((control as HTMLElement).className).toMatch(/min-h-20/);
    }

    fireEvent.click(screen.getByRole("button", { name: "Confirmar esta estimativa" }));
    expect(onAnswer).toHaveBeenCalledWith(5, {
      source: "vertical-column",
      misconception: DivisaoDoisDigitosMisconception.NAO_ESTIMA,
      evidencias: ["f71-divisor-quase-redondo-confirmacao-refutada"],
    });
  });

  it("distingue NAO_AJUSTA de NAO_ESTIMA quando a estimativa inicial é plausível, mas a criança ignora o teste", () => {
    const onAnswer = vi.fn();
    const spec = construirDivisaoDoisDigitosF71Spec(2);
    render(<DivisaoDoisDigitosStage spec={spec} onAnswer={onAnswer} />);

    const adicionar10 = screen.getByRole("button", { name: "Adicionar 10 na estimativa" });
    fireEvent.click(adicionar10);
    fireEvent.click(adicionar10);
    fireEvent.click(screen.getByRole("button", { name: "Testar estimativa" }));
    expect(onAnswer).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Confirmar esta estimativa" }));
    expect(onAnswer).toHaveBeenCalledWith(20, {
      source: "vertical-column",
      misconception: DivisaoDoisDigitosMisconception.NAO_AJUSTA,
      evidencias: ["f71-divisor-quase-redondo-confirmacao-refutada"],
    });
  });

  it("preserva resto válido e zero posicional no contrato sem antecipar esses resultados na tela", () => {
    const resto = construirDivisaoDoisDigitosF71Spec(4);
    expect(resto.resto).toBe(9);
    expect(resto.resto).toBeLessThan(resto.divisor);

    const zero = construirDivisaoDoisDigitosF71Spec(5);
    expect(String(zero.quociente)).toContain("0");
    expect(zero.primitivas).toEqual(["InteractiveVertical"]);
  });
});
