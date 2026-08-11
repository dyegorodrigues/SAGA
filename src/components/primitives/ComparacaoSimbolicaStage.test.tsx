// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";
import { construirComparacaoSimbolicaSpec } from "../../curriculum/procedimentos/comparacaoSimbolicaContract";
import { ComparacaoSimbolicaStage } from "./ComparacaoSimbolicaStage";

function sorteioConstante(valor: number) {
  return () => valor;
}

describe("ComparacaoSimbolicaStage — F29", () => {
  it("preserva a escada visual concreta → numeral → símbolo", () => {
    const { rerender, container } = render(
      <ComparacaoSimbolicaStage spec={construirComparacaoSimbolicaSpec(1, sorteioConstante(0.2))} onAnswer={() => {}} />,
    );
    expect(container.querySelectorAll('[data-lado-tipo="grupo"]')).toHaveLength(2);
    expect(container.querySelector('[data-andaime-jacare="jacare-animado"]')).toBeInTheDocument();

    rerender(<ComparacaoSimbolicaStage spec={construirComparacaoSimbolicaSpec(2, sorteioConstante(0.2))} onAnswer={() => {}} />);
    expect(container.querySelectorAll('[data-lado-tipo="grupo"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-lado-tipo="numeral"]')).toHaveLength(1);

    rerender(<ComparacaoSimbolicaStage spec={construirComparacaoSimbolicaSpec(3, sorteioConstante(0.2))} onAnswer={() => {}} />);
    expect(container.querySelectorAll('[data-lado-tipo="numeral"]')).toHaveLength(2);
    expect(container.querySelector('[data-andaime-jacare="jacare-estatico"]')).toBeInTheDocument();

    rerender(<ComparacaoSimbolicaStage spec={construirComparacaoSimbolicaSpec(4, sorteioConstante(0.2))} onAnswer={() => {}} />);
    expect(container.querySelector('[data-andaime-jacare]')).not.toBeInTheDocument();

    rerender(<ComparacaoSimbolicaStage spec={construirComparacaoSimbolicaSpec(5, sorteioConstante(0.2))} onAnswer={() => {}} />);
    expect(container.querySelectorAll('[data-lado-tipo="expressao"]')).toHaveLength(2);
  });

  it("expõe exatamente três alvos grandes e acessíveis para >, < e =", () => {
    render(<ComparacaoSimbolicaStage spec={construirComparacaoSimbolicaSpec(3, sorteioConstante(0.2))} onAnswer={() => {}} />);
    expect(screen.getByRole("button", { name: "maior que" })).toHaveClass("min-h-20", "min-w-20");
    expect(screen.getByRole("button", { name: "menor que" })).toHaveClass("min-h-20", "min-w-20");
    expect(screen.getByRole("button", { name: "igual a" })).toHaveClass("min-h-20", "min-w-20");
  });

  it("emite processo e evidência somente em acerto simbólico L3+", () => {
    const onAnswer = vi.fn();
    const spec = construirComparacaoSimbolicaSpec(3, sorteioConstante(0.2));
    render(<ComparacaoSimbolicaStage spec={spec} onAnswer={onAnswer} />);

    fireEvent.click(screen.getAllByRole("button", { name: /Numeral/ })[0]);
    fireEvent.click(screen.getByRole("button", {
      name: spec.resposta === ">" ? "maior que" : spec.resposta === "<" ? "menor que" : "igual a",
    }));

    const [, meta] = onAnswer.mock.calls[0];
    expect(meta.comparacao).toMatchObject({
      nivel: 3,
      ordemDeToques: [0],
      escolha: spec.resposta,
      correta: true,
    });
    expect(meta.evidencias).toContain("comparacao-simbolica-sem-objetos");
  });

  it("mantém diagnóstico cognitivo separado do critério motor", () => {
    const onAnswer = vi.fn();
    const spec = construirComparacaoSimbolicaSpec(4, sorteioConstante(0.2));
    render(<ComparacaoSimbolicaStage spec={spec} onAnswer={onAnswer} />);
    const escolhaErrada = spec.resposta === ">" ? "menor que" : "maior que";
    fireEvent.click(screen.getByRole("button", { name: escolhaErrada }));
    const [, meta] = onAnswer.mock.calls[0];
    expect(meta.manipulacao).toBeUndefined();
    expect(meta.misconception).toBeTruthy();
  });

  it("não apresenta violações de acessibilidade nos cinco níveis", async () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const { container, unmount } = render(
        <ComparacaoSimbolicaStage spec={construirComparacaoSimbolicaSpec(nivel, sorteioConstante(0.2))} onAnswer={() => {}} />,
      );
      const resultado = await axe.run(container);
      expect(resultado.violations).toEqual([]);
      unmount();
    }
  }, 15000);
});
