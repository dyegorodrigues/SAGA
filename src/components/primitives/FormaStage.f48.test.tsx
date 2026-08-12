// @vitest-environment jsdom
import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Composer } from "../../curriculum/Composer";
import { GE_02 } from "../../curriculum/fichas/jornada/GE.02";
import { FormaSpec } from "../../curriculum/procedimentos/formaContract";
import { FormaStage } from "./FormaStage";

const spec = (lvl: number) => Composer.generate(GE_02, lvl).uiProps as FormaSpec;

function botao(container: HTMLElement, figura: string) {
  const el = container.querySelector<HTMLButtonElement>(`button[data-forma-figura="${figura}"]`);
  if (!el) throw new Error(`figura ${figura} ausente`);
  return el;
}

afterEach(() => vi.useRealTimers());

describe("FormaStage — F48", () => {
  it("erro mostra comparação de propriedades e devolve retry após 2,5s", () => {
    vi.useFakeTimers();
    const s = spec(2);
    const errada = s.opcoes.find(o => o.figura !== s.resposta)!;
    const onAnswer = vi.fn();
    const falar = vi.fn();
    const { container } = render(<FormaStage spec={s} onAnswer={onAnswer} falar={falar} />);

    fireEvent.click(botao(container, errada.figura));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(container.querySelector("[data-forma-comparison]")).toBeTruthy();
    expect(botao(container, s.resposta).disabled).toBe(true);

    act(() => vi.advanceTimersByTime(2500));
    expect(container.querySelector("[data-forma-comparison]")).toBeNull();
    expect(botao(container, s.resposta).disabled).toBe(false);
  });

  it("acerto publica antes do cinema, gira só a certa e fecha com lados marcados", () => {
    vi.useFakeTimers();
    const s = spec(2);
    const onAnswer = vi.fn();
    const { container } = render(<FormaStage spec={s} onAnswer={onAnswer} />);

    fireEvent.click(botao(container, s.resposta));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(botao(container, s.resposta).getAttribute("data-forma-spinning")).toBe("true");
    expect(container.querySelectorAll("[data-forma-spinning=true]")).toHaveLength(1);
    expect(container.querySelectorAll("[data-forma-side-marker]").length).toBeGreaterThan(0);

    act(() => vi.advanceTimersByTime(2200));
    expect(botao(container, s.resposta).getAttribute("data-forma-close")).toBe("true");
  });

  it("tutorial destacarTodas é visível, contarLados foca a certa e girarAlvo não gira distratores", () => {
    const s = spec(2);
    const a = render(<FormaStage spec={s} mostrar={{ destacarTodas: true }} />);
    const todos = [...a.container.querySelectorAll<HTMLButtonElement>('button[data-forma-figura]')];
    expect(todos.every(x => x.style.borderColor === "rgb(96, 165, 250)")).toBe(true);
    a.unmount();

    const b = render(<FormaStage spec={s} mostrar={{ contarLadosAlvo: true }} />);
    expect(b.container.querySelectorAll("[data-forma-side-marker]").length).toBeGreaterThan(0);
    b.unmount();

    const c = render(<FormaStage spec={s} mostrar={{ girarAlvo: true }} />);
    expect(c.container.querySelectorAll("[data-forma-spinning=true]")).toHaveLength(1);
  });

  it("trocar spec limpa erro e fecho anteriores", () => {
    vi.useFakeTimers();
    const s1 = spec(2);
    const s2 = spec(3);
    const { container, rerender } = render(<FormaStage spec={s1} />);
    fireEvent.click(botao(container, s1.resposta));
    act(() => vi.advanceTimersByTime(2200));
    expect(container.querySelector("[data-forma-close=true]")).toBeTruthy();

    rerender(<FormaStage spec={s2} />);
    expect(container.querySelector("[data-forma-close=true]")).toBeNull();
    expect(botao(container, s2.resposta).disabled).toBe(false);
  });

  it("N5 traz duas representações reais e duas puras, todas planas", () => {
    const s = spec(5);
    const { container } = render(<FormaStage spec={s} />);
    expect(container.querySelectorAll('[data-forma-representacao="real"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-forma-representacao="pura"]')).toHaveLength(2);
    expect(screen.queryByText(/cubo|esfera|cilindro/i)).toBeNull();
  });
});
