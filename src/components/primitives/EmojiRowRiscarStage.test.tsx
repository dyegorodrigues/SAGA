// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { construirEmojiRowRiscarSpec, EmojiRowRiscarSpec } from "../../curriculum/procedimentos/emojiRowRiscarContract";
import { EmojiRowRiscarStage } from "./EmojiRowRiscarStage";

const base: EmojiRowRiscarSpec = {
  nivel: 1,
  total: 5,
  remover: 2,
  restante: 3,
  emoji: "🎈",
  modo: "riscar",
  representacao: "x",
  maoFantasma: true,
  preRiscados: false,
  tecladoAte: 10,
  enunciado: "Risque 2 e diga quantos sobraram.",
  falado: "Risque dois. Quantos sobraram?",
};

const fixo = (value: number) => () => value;
afterEach(() => vi.useRealTimers());

describe("EmojiRowRiscarStage — F15", () => {
  it("ensina X = saiu sem oferecer cobrança ou controles no degrau de alfabetização", () => {
    const { container } = render(
      <EmojiRowRiscarStage spec={base} mostrar={{ alfabetizarModo: "riscar", marcarIndice: 0 }} onAnswer={() => {}} />,
    );
    expect(screen.getByText("X = saiu")).toBeInTheDocument();
    expect(container.querySelector('[data-mode-literacy="riscar"] [data-marked="true"]')).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("materializa o todo inteiro antes da demonstração do primeiro risco", () => {
    const { container, rerender } = render(
      <EmojiRowRiscarStage spec={base} mostrar={{ destacarTodos: true }} onAnswer={() => {}} />,
    );
    expect(container.querySelectorAll('[data-mode-tutorial="riscar"] [data-marked="true"]')).toHaveLength(0);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    rerender(<EmojiRowRiscarStage spec={base} mostrar={{ riscar: 0 }} onAnswer={() => {}} />);
    expect(container.querySelectorAll('[data-mode-tutorial="riscar"] [data-marked="true"]')).toHaveLength(1);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("mantém o removido no mesmo slot e só libera a equação 600ms depois da retirada pedida", () => {
    vi.useFakeTimers();
    const { container } = render(<EmojiRowRiscarStage spec={base} onAnswer={() => {}} />);
    expect(container.querySelectorAll('[data-marked="true"]')).toHaveLength(1);
    expect(screen.queryByLabelText("Teclado de resposta")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Riscar item 2" }));
    expect(container.querySelectorAll('[data-marked="true"]')).toHaveLength(2);
    act(() => { vi.advanceTimersByTime(599); });
    expect(screen.queryByLabelText("Teclado de resposta")).not.toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.getByLabelText("Teclado de resposta")).toBeInTheDocument();
  });

  it("recusa um risco excedente com feedback sem alterar a retirada", () => {
    const falar = vi.fn();
    const { container } = render(<EmojiRowRiscarStage spec={base} falar={falar} onAnswer={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Riscar item 2" }));
    fireEvent.click(screen.getByRole("button", { name: "Riscar item 3" }));
    expect(container.querySelectorAll('[data-marked="true"]')).toHaveLength(2);
    expect(falar).toHaveBeenLastCalledWith("Só 2!");
  });

  it("usa fantasma no L3, leitura pré-riscada no L4 e símbolo puro no L5", () => {
    const { container, rerender } = render(
      <EmojiRowRiscarStage spec={{ ...base, nivel: 3, representacao: "fantasma", maoFantasma: false }} onAnswer={() => {}} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Riscar item 1" }));
    expect(container.querySelector('[data-mark-style="ghost"]')).toBeInTheDocument();

    rerender(<EmojiRowRiscarStage spec={{ ...base, nivel: 4, representacao: "pre-riscado", maoFantasma: false, preRiscados: true }} onAnswer={() => {}} />);
    expect(container.querySelectorAll('[data-marked="true"]')).toHaveLength(2);
    expect(screen.getByLabelText("Teclado de resposta")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Riscar item/ })).not.toBeInTheDocument();

    rerender(<EmojiRowRiscarStage spec={{ ...base, nivel: 5, representacao: "simbolo", maoFantasma: false }} onAnswer={() => {}} />);
    expect(container.querySelector('[data-emojirow-riscar-stage] [data-marked]')).not.toBeInTheDocument();
    expect(screen.getByText("5 − 2 = ?")).toBeInTheDocument();
  });

  it("preserva o precedente de RESPONDE_O_REMOVIDO até o acerto corrigido", () => {
    const onAnswer = vi.fn();
    render(<EmojiRowRiscarStage spec={{ ...base, nivel: 4, representacao: "pre-riscado", maoFantasma: false, preRiscados: true }} onAnswer={onAnswer} />);
    fireEvent.click(screen.getByRole("button", { name: "Responder 2" }));
    fireEvent.click(screen.getByRole("button", { name: "Responder 3" }));
    expect(onAnswer.mock.calls[0][1]).toMatchObject({ correta: false, precedidoPorRespondeRemovido: true });
    expect(onAnswer.mock.calls[1][1]).toMatchObject({ correta: true, precedidoPorRespondeRemovido: true });
  });

  it("não apresenta violações de acessibilidade nos cinco níveis", async () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const { container, unmount } = render(
        <EmojiRowRiscarStage spec={construirEmojiRowRiscarSpec(nivel, fixo(0.7))} onAnswer={() => {}} />,
      );
      const resultado = await axe.run(container);
      expect(resultado.violations).toEqual([]);
      unmount();
    }
  }, 15000);
});
