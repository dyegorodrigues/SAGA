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

/**
 * A conta vem do spec, não do texto.
 *
 * Este arquivo cravava 399÷19 → 21 e contava os cliques na mão. Quando a
 * CLASS-003 passou a sortear a conta, o teste virou uma descrição de uma tela
 * que não existe mais. O que a F71 mede não é aquele número: é estimar por
 * dezenas, testar por multiplicação e ajustar de um em um.
 */
function passos(spec: { estimativaInicial: number; quociente: number }) {
  return {
    dezenas: Math.floor(spec.estimativaInicial / 10),
    ajustes: spec.quociente - spec.estimativaInicial,
  };
}

describe("W43/F71 — realização física InteractiveVertical com estimativa, teste e ajuste", () => {
  it("faz a conta a partir de uma estimativa produzida pela criança, sem vazar o quociente, e colhe a evidência do ajuste", () => {
    const onAnswer = vi.fn();
    const spec = construirDivisaoDoisDigitosF71Spec(2);
    const { container } = render(<DivisaoDoisDigitosStage spec={spec} onAnswer={onAnswer} />);

    expect(container.querySelector("[data-f71-problem]")).toBeInTheDocument();
    const { dezenas, ajustes } = passos(spec);
    expect(screen.getByText(`${spec.dividendo} ÷ ${spec.divisor}`)).toBeInTheDocument();
    expect(container.querySelector("[data-interactive-vertical-division-estimate]")).not.toBeInTheDocument();
    expect(screen.queryByText(new RegExp(`^${spec.quociente}$`)), "o quociente não pode estar na tela antes").not.toBeInTheDocument();

    const adicionar10 = screen.getByRole("button", { name: "Adicionar 10 na estimativa" });
    for (let i = 0; i < dezenas; i += 1) fireEvent.click(adicionar10);

    const produtoInicial = `${spec.estimativaInicial} × ${spec.divisor} = ${spec.estimativaInicial * spec.divisor}`;
    expect(container.querySelector("[data-interactive-vertical-division-estimate]")).toBeInTheDocument();
    expect(screen.getByLabelText(`Estimativa atual ${spec.estimativaInicial}`)).toBeInTheDocument();
    expect(screen.queryByText(produtoInicial)).not.toBeInTheDocument();

    const testar = screen.getByRole("button", { name: "Testar estimativa" });
    fireEvent.click(testar);
    expect(screen.getByText(produtoInicial)).toBeInTheDocument();
    expect(screen.getByText(/ainda cabe outro grupo/i)).toBeInTheDocument();
    expect(onAnswer).not.toHaveBeenCalled();

    const adicionar1 = screen.getByRole("button", { name: "Adicionar 1 na estimativa" });
    fireEvent.click(adicionar1);
    expect(screen.queryByText(produtoInicial)).not.toBeInTheDocument();
    expect(onAnswer).not.toHaveBeenCalled();
    for (let i = 1; i < ajustes; i += 1) fireEvent.click(adicionar1);

    fireEvent.click(testar);
    expect(screen.getByText(`${spec.quociente} × ${spec.divisor} = ${spec.dividendo}`)).toBeInTheDocument();
    expect(screen.getByText(/maior quantidade de grupos que cabe/i)).toBeInTheDocument();
    expect(onAnswer).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Confirmar esta estimativa" }));
    expect(onAnswer).toHaveBeenCalledWith(spec.quociente, {
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
    for (let i = 0; i < passos(spec).dezenas; i += 1) fireEvent.click(adicionar10);
    fireEvent.click(screen.getByRole("button", { name: "Testar estimativa" }));
    expect(onAnswer).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Confirmar esta estimativa" }));
    expect(onAnswer).toHaveBeenCalledWith(spec.estimativaInicial, {
      source: "vertical-column",
      misconception: DivisaoDoisDigitosMisconception.NAO_AJUSTA,
      evidencias: ["f71-divisor-quase-redondo-confirmacao-refutada"],
    });
  });

  it("preserva resto válido e zero posicional no contrato sem antecipar esses resultados na tela", () => {
    const resto = construirDivisaoDoisDigitosF71Spec(4);
    expect(resto.resto, "L4 existe para mostrar o resto").toBeGreaterThan(0);
    expect(resto.resto).toBeLessThan(resto.divisor);

    const zero = construirDivisaoDoisDigitosF71Spec(5);
    expect(String(zero.quociente)).toContain("0");
    expect(zero.primitivas).toEqual(["InteractiveVertical"]);
  });
});
