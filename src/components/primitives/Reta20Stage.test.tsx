// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import axe from "axe-core";
import { Reta20Stage } from "./Reta20Stage";
import { construirReta20Spec } from "../../curriculum/procedimentos/reta20Contract";

const zero = () => 0;

describe("Reta20Stage — F19 / N1.12", () => {
  it("oferece toque por tick como alternativa ao arrasto", () => {
    const spec = construirReta20Spec(1, zero);
    const onAnswer = vi.fn();
    const { container } = render(<Reta20Stage spec={spec} onAnswer={onAnswer} />);
    const alvo = container.querySelector<HTMLButtonElement>(`[data-reta-tick="${spec.alvo}"]`);
    expect(alvo).not.toBeNull();
    fireEvent.click(alvo!);
    expect(onAnswer).toHaveBeenCalledWith(
      spec.alvo,
      expect.objectContaining({ escolhido: spec.alvo, gesto: "toque" }),
      expect.anything(),
    );
  });

  it("erro conceitual balança mas não move o personagem nem apaga a origem", () => {
    const spec = construirReta20Spec(3, () => 0.5);
    const onAnswer = vi.fn();
    const { container } = render(<Reta20Stage spec={spec} onAnswer={onAnswer} />);
    const antes = container.querySelector("[data-reta-personagem]")?.getAttribute("data-posicao");
    const errada = spec.alvo + 1 <= spec.fim ? spec.alvo + 1 : spec.alvo - 1;
    fireEvent.click(container.querySelector<HTMLButtonElement>(`[data-reta-tick="${errada}"]`)!);
    expect(container.querySelector("[data-reta-personagem]")?.getAttribute("data-posicao")).toBe(antes);
    expect(container.querySelector("[data-reta-erro]")).not.toBeNull();
    expect(onAnswer).toHaveBeenCalledWith(
      errada,
      expect.objectContaining({ escolhido: errada, gesto: "toque" }),
      expect.objectContaining({ precisoEmDestinoErrado: true }),
    );
  });

  it("acerto move, mantém o percurso visível e fala somente números realmente atravessados", () => {
    const spec = construirReta20Spec(3, () => 0.5);
    const onAnswer = vi.fn();
    const falar = vi.fn();
    const { container } = render(<Reta20Stage spec={spec} onAnswer={onAnswer} falar={falar} />);
    fireEvent.click(container.querySelector<HTMLButtonElement>(`[data-reta-tick="${spec.alvo}"]`)!);
    expect(container.querySelector("[data-reta-personagem]")?.getAttribute("data-posicao")).toBe(String(spec.alvo));
    expect(container.querySelector("[data-reta-percurso]")).not.toBeNull();
    const esperados = spec.salto > 0
      ? Array.from({ length: spec.salto }, (_, i) => spec.posicaoInicial + i + 1)
      : Array.from({ length: Math.abs(spec.salto) }, (_, i) => spec.posicaoInicial - i - 1);
    expect(falar.mock.calls.map(call => call[0])).toEqual(esperados.map(String));
  });

  it("tutorial mostra a reta/alvo sem contaminar a posição da tentativa", () => {
    const spec = construirReta20Spec(1, zero);
    const onAnswer = vi.fn();
    const { container, rerender } = render(<Reta20Stage spec={spec} onAnswer={onAnswer} />);
    const inicial = container.querySelector("[data-reta-personagem]")?.getAttribute("data-posicao");
    rerender(<Reta20Stage spec={spec} onAnswer={onAnswer} mostrar={{ desenharReta: true, pulsarAlvo: spec.alvo }} />);
    expect(container.querySelector("[data-reta-personagem]")?.getAttribute("data-posicao")).toBe(inicial);
    expect(onAnswer).not.toHaveBeenCalled();
  });

  it("não apresenta violações WCAG nos cinco níveis", async () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const spec = construirReta20Spec(nivel, zero);
      const { container, unmount } = render(<Reta20Stage spec={spec} />);
      const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
      expect(violations.map(v => `L${nivel} ${v.id}: ${v.help}`)).toEqual([]);
      unmount();
    }
  }, 15_000);
});