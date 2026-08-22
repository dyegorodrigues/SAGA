// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PrimosDivisoresStage } from "../components/primitives/PrimosDivisoresStage";
import { construirPrimosDivisoresF70Spec } from "./procedimentos/primosDivisoresContract";

describe("W42/F70 — realização física ArrayGrid + Quadrado100", () => {
  it("testa divisores no ArrayGrid sem transformar exploração motora em resposta conceitual", () => {
    const onAnswer = vi.fn();
    const spec = construirPrimosDivisoresF70Spec(2);
    const { container } = render(<PrimosDivisoresStage spec={spec} options={spec.opcoes} onAnswer={onAnswer} />);

    expect(container.querySelector("[data-arraygrid-f70]")).toBeInTheDocument();
    expect(container.querySelector("[data-f70-remainder]")).toBeInTheDocument();

    const testar3 = screen.getByRole("button", { name: "Testar divisor 3" });
    expect(testar3.className).toMatch(/min-h-20/);
    fireEvent.click(testar3);

    expect(container.querySelector("[data-f70-complete-rectangle]")).toBeInTheDocument();
    expect(onAnswer).not.toHaveBeenCalled();

    const correta = screen.getByRole("button", { name: "3 — fecha um retângulo sem sobra" });
    expect(correta.className).toMatch(/min-h-20/);
    fireEvent.click(correta);
    expect(onAnswer).toHaveBeenCalledWith(3, {
      source: "array-grid",
      evidencias: ["f70-divisores-retangulo"],
    });
  });

  it("executa o Crivo de Eratóstenes nas próprias casas do Quadrado100 e preserva os primos-base", () => {
    const onAnswer = vi.fn();
    const spec = construirPrimosDivisoresF70Spec(5);
    const { container } = render(<PrimosDivisoresStage spec={spec} options={spec.opcoes} onAnswer={onAnswer} />);

    expect(container.querySelector("[data-quadrado100-f70]")).toBeInTheDocument();
    const crivo2 = screen.getByRole("button", { name: "Aplicar crivo do 2" });
    const crivo3 = screen.getByRole("button", { name: "Aplicar crivo do 3" });
    expect(crivo2.className).toMatch(/min-h-20/);
    expect(crivo3).toBeDisabled();

    fireEvent.click(crivo2);
    expect(screen.getByRole("gridcell", { name: "Número 4" })).toHaveAttribute("data-crossed", "true");
    expect(screen.getByRole("gridcell", { name: "Número 2" })).toHaveAttribute("data-crossed", "false");
    expect(crivo3).not.toBeDisabled();

    fireEvent.click(crivo3);
    expect(screen.getByRole("gridcell", { name: "Número 9" })).toHaveAttribute("data-crossed", "true");
    expect(screen.getByRole("gridcell", { name: "Número 3" })).toHaveAttribute("data-crossed", "false");
    expect(onAnswer).not.toHaveBeenCalled();
  });

  it("mantém a regra do 1 explícita sem vazar a classificação de 13 antes da resposta", () => {
    const onAnswer = vi.fn();
    const spec = construirPrimosDivisoresF70Spec(4);
    render(<PrimosDivisoresStage spec={spec} options={spec.opcoes} onAnswer={onAnswer} />);

    expect(screen.getByText(/1 sempre divide, mas 1 não é primo/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Testar divisor 2" }));
    expect(onAnswer).not.toHaveBeenCalled();
  });
});