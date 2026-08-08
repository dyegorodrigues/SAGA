// @vitest-environment jsdom
import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AudioChoiceStage } from "./AudioChoiceStage";
import { Composer } from "../../curriculum/Composer";
import { N1_06 } from "../../curriculum/fichas/jornada/N1.06";
import { AudioChoiceSpec } from "../../curriculum/procedimentos/audioChoiceContract";

vi.mock("../Mascot", () => ({ speak: vi.fn() }));

const spec = (nivel = 2) => Composer.generate(N1_06, nivel).uiProps as AudioChoiceSpec;

afterEach(() => {
  vi.useRealTimers();
});

describe("F05 — roteiro real de ouvir e escolher", () => {
  it("abre só com o botão; após a primeira audição revela opções e sinaliza a casca", () => {
    vi.useFakeTimers();
    const s = spec();
    const onPrimeiraAudicaoConcluida = vi.fn();
    render(
      <AudioChoiceStage
        spec={s}
        onPrimeiraAudicaoConcluida={onPrimeiraAudicaoConcluida}
      />,
    );

    expect(screen.getByLabelText("Escutar o número")).toBeTruthy();
    expect(screen.queryByRole("group", { name: "Números" })).toBeNull();
    expect(screen.queryByText(s.enunciado)).toBeNull();

    act(() => { vi.advanceTimersByTime(1199); });
    expect(screen.queryByRole("group", { name: "Números" })).toBeNull();
    expect(onPrimeiraAudicaoConcluida).not.toHaveBeenCalled();

    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.getByRole("group", { name: "Números" })).toBeTruthy();
    expect(onPrimeiraAudicaoConcluida).toHaveBeenCalledTimes(1);
    // O palco nunca se apropria do enunciado; o GameLoop é quem o desenha.
    expect(screen.queryByText(s.enunciado)).toBeNull();
  });

  it("quatro alternativas formam 2×2 simétrico, sem opção isolada", () => {
    vi.useFakeTimers();
    const s = spec(4);
    render(<AudioChoiceStage spec={s} />);
    act(() => { vi.advanceTimersByTime(1200); });

    const grupo = screen.getByRole("group", { name: "Números" });
    expect(s.alternativas).toHaveLength(4);
    expect(grupo.getAttribute("data-colunas")).toBe("2");
    expect(grupo.querySelectorAll("button")).toHaveLength(4);
  });

  it("erro não revela a resposta e não trava: botão de som continua ativo e a opção volta", () => {
    vi.useFakeTimers();
    const s = spec();
    const errado = s.alternativas.find(n => n !== s.resposta)!;
    const onAnswer = vi.fn();
    const { container } = render(<AudioChoiceStage spec={s} onAnswer={onAnswer} />);
    act(() => { vi.advanceTimersByTime(1200); });

    fireEvent.click(screen.getByRole("button", { name: String(errado) }));

    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(container.querySelector("[data-fecho-audiochoice]")).toBeNull();
    expect((screen.getByLabelText("Escutar o número") as HTMLButtonElement).disabled).toBe(false);
    expect((screen.getByRole("button", { name: String(errado) }) as HTMLButtonElement).disabled).toBe(true);

    act(() => { vi.advanceTimersByTime(1800); });
    expect((screen.getByRole("button", { name: String(errado) }) as HTMLButtonElement).disabled).toBe(false);
  });

  it("acerto fecha com o numeral correto sozinho e reporta o número da tentativa", () => {
    vi.useFakeTimers();
    const s = spec();
    const errado = s.alternativas.find(n => n !== s.resposta)!;
    const onAnswer = vi.fn();
    const { container } = render(<AudioChoiceStage spec={s} onAnswer={onAnswer} />);
    act(() => { vi.advanceTimersByTime(1200); });

    fireEvent.click(screen.getByRole("button", { name: String(errado) }));
    act(() => { vi.advanceTimersByTime(1800); });
    fireEvent.click(screen.getByRole("button", { name: String(s.resposta) }));

    expect(onAnswer).toHaveBeenCalledTimes(2);
    expect(onAnswer.mock.calls[0][1].tentativa).toBe(1);
    expect(onAnswer.mock.calls[1][1].tentativa).toBe(2);
    expect(screen.queryByLabelText("Escutar o número")).toBeNull();
    expect(screen.queryByRole("group", { name: "Números" })).toBeNull();
    expect(container.querySelector("[data-fecho-audiochoice]")?.textContent).toBe(String(s.resposta));
  });

  it("nova questão com o mesmo alvo reinicia a abertura e a primeira audição", () => {
    vi.useFakeTimers();
    const s = spec();
    const { container, rerender } = render(<AudioChoiceStage spec={s} />);
    act(() => { vi.advanceTimersByTime(1200); });
    fireEvent.click(screen.getByRole("button", { name: String(s.resposta) }));
    expect(container.querySelector("[data-fecho-audiochoice]")).not.toBeNull();

    const seguinte: AudioChoiceSpec = { ...s, alternativas: [...s.alternativas] };
    rerender(<AudioChoiceStage spec={seguinte} />);
    expect(container.querySelector("[data-fecho-audiochoice]")).toBeNull();
    expect(screen.getByLabelText("Escutar o número")).toBeTruthy();
    expect(screen.queryByRole("group", { name: "Números" })).toBeNull();

    act(() => { vi.advanceTimersByTime(1200); });
    expect(screen.getByRole("group", { name: "Números" })).toBeTruthy();
  });

  it("a microaula não disputa voz com autoplay e respeita os três beats da §8", () => {
    vi.useFakeTimers();
    const s = spec();
    const { rerender } = render(
      <AudioChoiceStage spec={s} mostrar={{ pulsar: "botaoSom" }} />,
    );
    act(() => { vi.advanceTimersByTime(1500); });
    expect(screen.queryByRole("group", { name: "Números" })).toBeNull();

    rerender(<AudioChoiceStage spec={s} mostrar={{ ondasSonoras: true }} />);
    expect(screen.getByLabelText("Escutar o número").textContent).toContain("🔊");
    expect(screen.queryByRole("group", { name: "Números" })).toBeNull();

    rerender(<AudioChoiceStage spec={s} mostrar={{ pulsarOpcoes: true }} />);
    expect(screen.getByRole("group", { name: "Números" })).toBeTruthy();
  });
});
