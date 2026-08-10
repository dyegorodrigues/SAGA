// @vitest-environment jsdom
import React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import axe from "axe-core";
import { Reta20Stage } from "./Reta20Stage";
import { construirReta20Spec } from "../../curriculum/procedimentos/reta20Contract";

const zero = () => 0;

function rectDaReta(width = 420): DOMRect {
  return {
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: width,
    bottom: 120,
    width,
    height: 120,
    toJSON: () => ({}),
  } as DOMRect;
}

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

  it("um toque real pointerdown/up + click publica uma única tentativa", () => {
    const spec = construirReta20Spec(1, zero);
    const onAnswer = vi.fn();
    const { container } = render(<Reta20Stage spec={spec} onAnswer={onAnswer} />);
    const alvo = container.querySelector<HTMLButtonElement>(`[data-reta-tick="${spec.alvo}"]`)!;

    fireEvent.pointerDown(alvo, { pointerId: 1, clientX: 42 });
    fireEvent.pointerUp(alvo, { pointerId: 1, clientX: 42 });
    fireEvent.click(alvo);

    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(
      spec.alvo,
      expect.objectContaining({ gesto: "toque" }),
      expect.anything(),
    );
  });

  it("arrasto pode começar sobre o hitbox do foguete e fala cada casa atravessada", () => {
    const spec = construirReta20Spec(2, () => 0.4);
    const onAnswer = vi.fn();
    const falar = vi.fn();
    const { container } = render(<Reta20Stage spec={spec} onAnswer={onAnswer} falar={falar} />);
    const surface = container.querySelector<HTMLElement>("[data-reta-surface]")!;
    vi.spyOn(surface, "getBoundingClientRect").mockReturnValue(rectDaReta());

    const xInicial = (spec.posicaoInicial / spec.fim) * 420;
    const xAlvo = (spec.alvo / spec.fim) * 420;
    const origem = container.querySelector<HTMLButtonElement>(`[data-reta-tick="${spec.posicaoInicial}"]`)!;

    fireEvent.pointerDown(origem, { pointerId: 7, clientX: xInicial });
    fireEvent.pointerMove(surface, { pointerId: 7, clientX: xAlvo });
    fireEvent.pointerUp(surface, { pointerId: 7, clientX: xAlvo });

    const esperados = Array.from({ length: spec.salto }, (_, i) => spec.posicaoInicial + i + 1);
    expect(falar.mock.calls.map(call => call[0])).toEqual(esperados.map(String));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(
      spec.alvo,
      expect.objectContaining({ gesto: "arrasto" }),
      expect.anything(),
    );
  });

  it("L2 desenha um arco por salto e L3 retira esse andaime", () => {
    const l2 = construirReta20Spec(2, () => 0.4);
    const primeiro = render(<Reta20Stage spec={l2} />);
    expect(primeiro.container.querySelectorAll("[data-reta-arco-assistido]")).toHaveLength(Math.abs(l2.salto));
    primeiro.unmount();

    const l3 = construirReta20Spec(3, () => 0.4);
    const segundo = render(<Reta20Stage spec={l3} />);
    expect(segundo.container.querySelectorAll("[data-reta-arco-assistido]")).toHaveLength(0);
    segundo.unmount();
  });

  it("pointercancel aborta o gesto e não publica resposta", () => {
    const spec = construirReta20Spec(2, () => 0.4);
    const onAnswer = vi.fn();
    const { container } = render(<Reta20Stage spec={spec} onAnswer={onAnswer} />);
    const surface = container.querySelector<HTMLElement>("[data-reta-surface]")!;

    fireEvent.pointerDown(surface, { pointerId: 2, clientX: 80 });
    fireEvent.pointerCancel(surface, { pointerId: 2, clientX: 110 });

    expect(onAnswer).not.toHaveBeenCalled();
  });

  it("soltura muito fora da reta vira retry motor e nunca acerto por clamp", () => {
    const spec = construirReta20Spec(1, () => 0.999); // alvo = 10
    const onAnswer = vi.fn();
    const { container } = render(<Reta20Stage spec={spec} onAnswer={onAnswer} />);
    const surface = container.querySelector<HTMLElement>("[data-reta-surface]")!;
    vi.spyOn(surface, "getBoundingClientRect").mockReturnValue(rectDaReta());

    fireEvent.pointerDown(surface, { pointerId: 3, clientX: 200 });
    fireEvent.pointerUp(surface, { pointerId: 3, clientX: 1000 });

    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer.mock.calls[0][0]).not.toBe(spec.alvo);
    expect(onAnswer.mock.calls[0][2]).toEqual(expect.objectContaining({ foraDeAlvoValido: true }));
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

  it("salto por toque anima e fala casa a casa antes de publicar o acerto", () => {
    vi.useFakeTimers();
    try {
      const spec = construirReta20Spec(3, () => 0.5);
      const onAnswer = vi.fn();
      const falar = vi.fn();
      const { container } = render(<Reta20Stage spec={spec} onAnswer={onAnswer} falar={falar} />);
      const inicial = spec.posicaoInicial;
      const esperados = Array.from({ length: Math.abs(spec.salto) }, (_, i) => inicial - i - 1);

      fireEvent.click(container.querySelector<HTMLButtonElement>(`[data-reta-tick="${spec.alvo}"]`)!);
      expect(container.querySelector("[data-reta20-stage]")?.getAttribute("data-reta-animando")).toBe("true");
      expect(container.querySelector("[data-reta-personagem]")?.getAttribute("data-posicao")).toBe(String(inicial));
      expect(onAnswer).not.toHaveBeenCalled();
      expect(falar).not.toHaveBeenCalled();

      act(() => vi.advanceTimersByTime(380));
      expect(container.querySelector("[data-reta-personagem]")?.getAttribute("data-posicao")).toBe(String(esperados[0]));
      expect(falar.mock.calls.map(call => call[0])).toEqual([String(esperados[0])]);
      expect(onAnswer).not.toHaveBeenCalled();
      expect(container.querySelector("[data-reta-percurso]")).not.toBeNull();

      act(() => vi.runAllTimers());
      expect(container.querySelector("[data-reta-personagem]")?.getAttribute("data-posicao")).toBe(String(spec.alvo));
      expect(falar.mock.calls.map(call => call[0])).toEqual(esperados.map(String));
      expect(onAnswer).toHaveBeenCalledTimes(1);
      expect(onAnswer).toHaveBeenCalledWith(
        spec.alvo,
        expect.objectContaining({ escolhido: spec.alvo, gesto: "toque" }),
        expect.anything(),
      );
    } finally {
      vi.useRealTimers();
    }
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