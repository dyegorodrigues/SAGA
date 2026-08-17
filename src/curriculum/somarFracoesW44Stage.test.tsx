// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SomaFracoesStage } from "../components/primitives/SomaFracoesStage";
import { construirSomaFracoesF74Spec } from "./procedimentos/somaFracoesContract";

describe("W44/F74 — realização física SingaporeBars e domínio especial", () => {
  it("mantém o denominador físico fixo e não pré-renderiza o resultado", () => {
    const spec = construirSomaFracoesF74Spec(1);
    const { container } = render(<SomaFracoesStage spec={spec} onAnswer={vi.fn()} />);

    expect(container.querySelector("[data-f74-denominador-fixo='4']")).toBeInTheDocument();
    expect(container.querySelector("[data-f74-result]")).not.toBeInTheDocument();
    const barras = [...container.querySelectorAll("[data-singapore-fraction-bar]")];
    expect(barras.length).toBeGreaterThanOrEqual(2);
    for (const barra of barras) expect(barra).toHaveAttribute("data-denominator", "4");
  });

  it("não credita mastery quando soma-denominador precede imediatamente o acerto", () => {
    const onAnswer = vi.fn();
    const spec = construirSomaFracoesF74Spec(1);
    render(<SomaFracoesStage spec={spec} onAnswer={onAnswer} />);

    fireEvent.click(screen.getByRole("button", { name: "3/8" }));
    expect(onAnswer).toHaveBeenLastCalledWith("3/8", { misconception: "soma-denominador" });

    fireEvent.click(screen.getByRole("button", { name: "3/4" }));
    expect(onAnswer).toHaveBeenLastCalledWith("3/4", {
      evidencias: ["f74-somar-barras", "mastery-disqualifier:f74-soma-denominador-precedente"],
    });
  });

  it("respeita o significado de imediatamente precedente quando outro erro intervém", () => {
    const onAnswer = vi.fn();
    const spec = construirSomaFracoesF74Spec(1);
    render(<SomaFracoesStage spec={spec} onAnswer={onAnswer} />);

    fireEvent.click(screen.getByRole("button", { name: "3/8" }));
    fireEvent.click(screen.getByRole("button", { name: "2/4" }));
    fireEvent.click(screen.getByRole("button", { name: "3/4" }));

    expect(onAnswer).toHaveBeenLastCalledWith("3/4", { evidencias: ["f74-somar-barras"] });
  });

  it("representa fração imprópria com mais de um inteiro somente depois do acerto", () => {
    const spec = construirSomaFracoesF74Spec(4);
    const { container } = render(<SomaFracoesStage spec={spec} onAnswer={vi.fn()} />);

    expect(container.querySelector("[data-f74-result]")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "5/4" }));
    expect(container.querySelector("[data-f74-result]")).toBeInTheDocument();
    expect(screen.getByText(/passar de um inteiro não torna a fração inválida/i)).toBeInTheDocument();
    const resultado = container.querySelector("[data-f74-result]")!;
    expect(resultado.querySelectorAll("[data-singapore-fraction-bar]")).toHaveLength(2);
  });

  it("simplifica como equivalência visual — mesma quantidade, outro nome", () => {
    const spec = construirSomaFracoesF74Spec(5);
    const { container } = render(<SomaFracoesStage spec={spec} onAnswer={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "1/2" }));
    const resultado = container.querySelector("[data-f74-result]")!;
    expect(resultado).toBeInTheDocument();
    expect(screen.getByText(/mesma quantidade, outro nome/i)).toBeInTheDocument();
    expect(resultado.querySelector("[data-denominator='8'][data-highlighted='4']")).toBeInTheDocument();
    expect(resultado.querySelector("[data-denominator='2'][data-highlighted='1']")).toBeInTheDocument();
  });
});
