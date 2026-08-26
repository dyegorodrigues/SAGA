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

    // O divisor certo vem do spec: a CLASS-003 sorteia o total, e com ele o
    // divisor que fecha o retângulo.
    const divisor = Number(spec.resposta);
    const testar = screen.getByRole("button", { name: `Testar divisor ${divisor}` });
    expect(testar.className).toMatch(/min-h-20/);
    fireEvent.click(testar);

    expect(container.querySelector("[data-f70-complete-rectangle]")).toBeInTheDocument();
    expect(onAnswer).not.toHaveBeenCalled();

    const correta = screen.getByRole("button", { name: `${divisor} — fecha um retângulo sem sobra` });
    expect(correta.className).toMatch(/min-h-20/);
    fireEvent.click(correta);
    expect(onAnswer).toHaveBeenCalledWith(divisor, {
      source: "array-grid",
      evidencias: ["f70-divisores-retangulo"],
    });
  });

  it("executa o Crivo de Eratóstenes nas próprias casas do Quadrado100 e preserva os primos-base", () => {
    const onAnswer = vi.fn();
    const spec = construirPrimosDivisoresF70Spec(5);
    const { container } = render(<PrimosDivisoresStage spec={spec} options={spec.opcoes} onAnswer={onAnswer} />);

    expect(container.querySelector("[data-quadrado100-f70]")).toBeInTheDocument();
    // As bases do crivo saem do spec; o que o nível ensina é a ORDEM, não o 2 e
    // o 3 em particular.
    const [primeira, segunda] = spec.crivoBases;
    const crivoA = screen.getByRole("button", { name: `Aplicar crivo do ${primeira}` });
    const crivoB = screen.getByRole("button", { name: `Aplicar crivo do ${segunda}` });
    expect(crivoA.className).toMatch(/min-h-20/);
    expect(crivoB, "a segunda base só abre depois da primeira").toBeDisabled();

    fireEvent.click(crivoA);
    expect(screen.getByRole("gridcell", { name: `Número ${primeira * 2}` })).toHaveAttribute("data-crossed", "true");
    expect(screen.getByRole("gridcell", { name: `Número ${primeira}` }), "a própria base não é riscada").toHaveAttribute("data-crossed", "false");
    expect(crivoB).not.toBeDisabled();

    fireEvent.click(crivoB);
    expect(screen.getByRole("gridcell", { name: `Número ${segunda * segunda}` })).toHaveAttribute("data-crossed", "true");
    expect(screen.getByRole("gridcell", { name: `Número ${segunda}` })).toHaveAttribute("data-crossed", "false");
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