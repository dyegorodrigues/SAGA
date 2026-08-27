// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SomaFracoesStage } from "../components/primitives/SomaFracoesStage";
import { construirSomaFracoesF74Spec } from "./procedimentos/somaFracoesContract";

/**
 * A conta é sorteada desde a CLASS-003: as expectativas saem do spec.
 *
 * Antes elas eram 3/4, 3/8, 2/4, 5/4 e 1/2 escritos à mão — o teste passava
 * porque o contrato tinha uma conta só por nível, que é exatamente o defeito
 * que a CLASS-003 veio remover.
 */
const rotuloCerto = (spec: ReturnType<typeof construirSomaFracoesF74Spec>) => spec.resposta;
const rotuloDoErro = (spec: ReturnType<typeof construirSomaFracoesF74Spec>, tag: string) =>
  spec.opcoes.find(o => o.misconception === tag)!.label;
const rotuloSemTag = (spec: ReturnType<typeof construirSomaFracoesF74Spec>) =>
  spec.opcoes.find(o => !o.misconception && o.value !== spec.resposta)!.label;

describe("W44/F74 — realização física SingaporeBars e domínio especial", () => {
  it("mantém o denominador físico fixo e não pré-renderiza o resultado", () => {
    const spec = construirSomaFracoesF74Spec(1);
    const { container } = render(<SomaFracoesStage spec={spec} onAnswer={vi.fn()} />);

    expect(container.querySelector(`[data-f74-denominador-fixo='${spec.denominador}']`)).toBeInTheDocument();
    expect(container.querySelector("[data-f74-result]")).not.toBeInTheDocument();
    const barras = [...container.querySelectorAll("[data-singapore-fraction-bar]")];
    expect(barras.length).toBeGreaterThanOrEqual(2);
    for (const barra of barras) expect(barra).toHaveAttribute("data-denominator", String(spec.denominador));
  });

  it("não credita mastery quando soma-denominador precede imediatamente o acerto", () => {
    const onAnswer = vi.fn();
    const spec = construirSomaFracoesF74Spec(1);
    render(<SomaFracoesStage spec={spec} onAnswer={onAnswer} />);

    const somouDenominador = rotuloDoErro(spec, "soma-denominador");
    fireEvent.click(screen.getByRole("button", { name: somouDenominador }));
    expect(onAnswer).toHaveBeenLastCalledWith(somouDenominador, { misconception: "soma-denominador" });

    fireEvent.click(screen.getByRole("button", { name: rotuloCerto(spec) }));
    expect(onAnswer).toHaveBeenLastCalledWith(rotuloCerto(spec), {
      evidencias: ["f74-somar-barras", "mastery-disqualifier:f74-soma-denominador-precedente"],
    });
  });

  it("respeita o significado de imediatamente precedente quando outro erro intervém", () => {
    const onAnswer = vi.fn();
    const spec = construirSomaFracoesF74Spec(1);
    render(<SomaFracoesStage spec={spec} onAnswer={onAnswer} />);

    fireEvent.click(screen.getByRole("button", { name: rotuloDoErro(spec, "soma-denominador") }));
    fireEvent.click(screen.getByRole("button", { name: rotuloSemTag(spec) }));
    fireEvent.click(screen.getByRole("button", { name: rotuloCerto(spec) }));

    expect(onAnswer).toHaveBeenLastCalledWith(rotuloCerto(spec), { evidencias: ["f74-somar-barras"] });
  });

  it("representa fração imprópria com mais de um inteiro somente depois do acerto", () => {
    const spec = construirSomaFracoesF74Spec(4);
    const { container } = render(<SomaFracoesStage spec={spec} onAnswer={vi.fn()} />);

    expect(container.querySelector("[data-f74-result]")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: rotuloCerto(spec) }));
    expect(container.querySelector("[data-f74-result]")).toBeInTheDocument();
    expect(screen.getByText(/passar de um inteiro não torna a fração inválida/i)).toBeInTheDocument();
    const resultado = container.querySelector("[data-f74-result]")!;
    // Uma barra por inteiro que a soma alcança, mais a barra do que sobra.
    expect(resultado.querySelectorAll("[data-singapore-fraction-bar]"))
      .toHaveLength(Math.ceil(spec.resultadoNumeradorBruto / spec.denominador));
  });

  it("simplifica como equivalência visual — mesma quantidade, outro nome", () => {
    const spec = construirSomaFracoesF74Spec(5);
    const { container } = render(<SomaFracoesStage spec={spec} onAnswer={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: rotuloCerto(spec) }));
    const resultado = container.querySelector("[data-f74-result]")!;
    expect(resultado).toBeInTheDocument();
    expect(screen.getByText(/mesma quantidade, outro nome/i)).toBeInTheDocument();
    const [numeradorSimples, denominadorSimples] = spec.resposta.split("/");
    expect(resultado.querySelector(`[data-denominator='${spec.denominador}'][data-highlighted='${spec.resultadoNumeradorBruto}']`)).toBeInTheDocument();
    expect(resultado.querySelector(`[data-denominator='${denominadorSimples}'][data-highlighted='${numeradorSimples}']`)).toBeInTheDocument();
  });
});
