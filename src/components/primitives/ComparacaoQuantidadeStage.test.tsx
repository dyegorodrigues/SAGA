// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render } from "@testing-library/react";
import axe from "axe-core";
import { ComparacaoQuantidadeStage } from "./ComparacaoQuantidadeStage";
import { construirComparacaoQuantidadeSpec } from "../../curriculum/procedimentos/comparacaoQuantidadeContract";

const sempreEsquerda = () => 0;

describe("ComparacaoQuantidadeStage — F06 / N1.05", () => {
  it("não entrega a sobra antes de a criança agir", () => {
    const spec = construirComparacaoQuantidadeSpec(1, sempreEsquerda);
    const { container } = render(<ComparacaoQuantidadeStage spec={spec} />);

    expect(container.querySelector("[data-comparacao-pareamento]")).toBeNull();
    expect(container.querySelector("[data-comparacao-sobra]")).toBeNull();
  });

  it("a micro-aula mostra só o primeiro par e devolve a tela sem revelar a sobra", () => {
    const spec = construirComparacaoQuantidadeSpec(1, sempreEsquerda);
    const { container, rerender } = render(
      <ComparacaoQuantidadeStage spec={spec} mostrar={{ parear: 0 }} />,
    );

    expect(container.querySelector("[data-comparacao-pareamento]")).not.toBeNull();
    expect(container.querySelectorAll("[data-comparacao-par]")).toHaveLength(1);
    expect(container.querySelector("[data-comparacao-sobra]")).toBeNull();

    rerender(<ComparacaoQuantidadeStage spec={spec} mostrar={{ pulsarGrupos: true }} />);
    expect(container.querySelector("[data-comparacao-pareamento]")).toBeNull();
    expect(container.querySelector("[data-comparacao-sobra]")).toBeNull();
  });

  it("no erro explica com pareamento completo, mas não deixa a resposta colada no retry", () => {
    vi.useFakeTimers();
    try {
      const spec = construirComparacaoQuantidadeSpec(4, sempreEsquerda);
      const onAnswer = vi.fn();
      const { container } = render(<ComparacaoQuantidadeStage spec={spec} onAnswer={onAnswer} />);
      const grupos = container.querySelectorAll<HTMLButtonElement>("button[aria-label^='grupo']");
      const errada = spec.resposta === 0 ? grupos[1] : grupos[0];

      fireEvent.click(errada);
      expect(container.querySelector("[data-comparacao-pareamento]")).not.toBeNull();
      expect(container.querySelector("[data-comparacao-sobra]")).not.toBeNull();

      act(() => {
        vi.advanceTimersByTime(2500);
      });
      expect(container.querySelector("[data-comparacao-pareamento]")).toBeNull();
      expect(container.querySelector("[data-comparacao-sobra]")).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("o andaime por demanda continua disponível a partir do nível 2", () => {
    const spec = construirComparacaoQuantidadeSpec(2, sempreEsquerda);
    const { container } = render(<ComparacaoQuantidadeStage spec={spec} />);
    const botao = container.querySelector<HTMLButtonElement>("[data-comparacao-parear]");
    expect(botao).not.toBeNull();
    fireEvent.click(botao!);
    expect(container.querySelector("[data-comparacao-pareamento]")).not.toBeNull();
  });

  it("não apresenta violações de acessibilidade nos cinco níveis", async () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const spec = construirComparacaoQuantidadeSpec(nivel, sempreEsquerda);
      const { container, unmount } = render(<ComparacaoQuantidadeStage spec={spec} />);
      const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
      expect(violations.map(v => `L${nivel} ${v.id}: ${v.help}`)).toEqual([]);
      unmount();
    }
  }, 15_000);
});