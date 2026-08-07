// @vitest-environment jsdom
import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CenaDePosicaoStage } from "./CenaDePosicaoStage";
import { Composer } from "../../curriculum/Composer";
import { GE_01 } from "../../curriculum/fichas/jornada/GE.01";
import { LARGURA_DA_CENA, ALTURA_DA_CENA, PosicaoSpec } from "../../curriculum/procedimentos/posicaoContract";

const spec = (lvl: number) => Composer.generate(GE_01, lvl).uiProps as PosicaoSpec;

function objeto(container: HTMLElement, posicao: string) {
  const el = [...container.querySelectorAll<HTMLButtonElement>('button[aria-label^="Objeto "]')]
    .find(x => (x.getAttribute("aria-label") ?? "").startsWith(`Objeto ${posicao} `));
  if (!el) throw new Error(`objeto ${posicao} ausente`);
  return el;
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.querySelectorAll("[data-position-drag-ghost]").forEach(x => x.remove());
});

describe("F47 — contrato temporal e motor da cena de posição", () => {
  it("erro de objeto ensina vocabulário, não revela o gabarito e volta à tentativa", () => {
    vi.useFakeTimers();
    const s = spec(1);
    const errada = s.objetos.find(o => o.posicao !== s.pedida)!;
    const onAnswer = vi.fn();
    const falar = vi.fn();
    const { container } = render(<CenaDePosicaoStage spec={s} onAnswer={onAnswer} falar={falar} />);

    fireEvent.click(objeto(container, errada.posicao));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(falar).toHaveBeenCalledWith(`Esse está ${errada.posicao}. Eu pedi ${s.pedida}.`);
    expect(container.querySelectorAll("[data-position-error-label]")).toHaveLength(1);
    expect(container.querySelectorAll("[data-position-close-label]")).toHaveLength(0);
    expect(objeto(container, s.pedida).disabled).toBe(true);

    act(() => vi.advanceTimersByTime(2000));
    expect(objeto(container, s.pedida).disabled).toBe(false);
    fireEvent.click(objeto(container, s.pedida));
    expect(onAnswer).toHaveBeenCalledTimes(2);
  });

  it("acerto publica imediatamente, desenha relação e só depois entra no fecho rotulado", () => {
    vi.useFakeTimers();
    const s = spec(1);
    const onAnswer = vi.fn();
    const { container } = render(<CenaDePosicaoStage spec={s} onAnswer={onAnswer} />);

    fireEvent.click(objeto(container, s.pedida));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(container.querySelector("[data-position-arrow]")).toBeTruthy();
    expect(container.querySelector("[data-position-relation-label]")?.textContent).toBe(s.pedida);
    expect(container.querySelectorAll("[data-position-close-label]")).toHaveLength(0);

    act(() => vi.advanceTimersByTime(1800));
    expect(container.querySelector("[data-position-arrow]")).toBeNull();
    expect(container.querySelectorAll("[data-position-close-label]")).toHaveLength(2);
  });

  it("tocar o referencial registra IGNORA_REFERENCIAL e bloqueia sobreposição durante a aula", () => {
    vi.useFakeTimers();
    const s = spec(1);
    const onAnswer = vi.fn();
    const { container } = render(<CenaDePosicaoStage spec={s} onAnswer={onAnswer} />);

    fireEvent.click(screen.getByLabelText(`${s.referencial.nome} (a referência)`));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer.mock.calls[0][1].escolhida).toBeNull();
    fireEvent.click(objeto(container, s.pedida));
    expect(onAnswer).toHaveBeenCalledTimes(1);

    act(() => vi.advanceTimersByTime(2000));
    fireEvent.click(objeto(container, s.pedida));
    expect(onAnswer).toHaveBeenCalledTimes(2);
  });

  it("nível 5 tem arrasto Pointer real com ghost em portal e solta na relação pedida", () => {
    const s = spec(5);
    const onAnswer = vi.fn();
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      x: 20, y: 30, left: 20, top: 30,
      width: LARGURA_DA_CENA, height: ALTURA_DA_CENA,
      right: 20 + LARGURA_DA_CENA, bottom: 30 + ALTURA_DA_CENA,
      toJSON: () => ({}),
    } as DOMRect);
    render(<CenaDePosicaoStage spec={s} onAnswer={onAnswer} />);

    const tray = screen.getByLabelText("Pegar o objeto");
    const destino = s.alvoDaProducao!.destinoCerto;
    const clientX = 20 + destino.x;
    const clientY = 30 + destino.y;

    fireEvent.pointerDown(tray, { pointerId: 7, clientX: 180, clientY: 540 });
    fireEvent.pointerMove(tray, { pointerId: 7, clientX, clientY });
    expect(document.body.querySelector("[data-position-drag-ghost]")).toBeTruthy();
    fireEvent.pointerUp(tray, { pointerId: 7, clientX, clientY });

    expect(document.body.querySelector("[data-position-drag-ghost]")).toBeNull();
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer.mock.calls[0][1].escolhida).toBe(s.pedida);
  });

  it("trocar a spec limpa fecho, erro e estado motor da questão anterior", () => {
    vi.useFakeTimers();
    const s1 = spec(1);
    const s2 = spec(2);
    const { container, rerender } = render(<CenaDePosicaoStage spec={s1} />);
    fireEvent.click(objeto(container, s1.pedida));
    act(() => vi.advanceTimersByTime(1800));
    expect(container.querySelectorAll("[data-position-close-label]").length).toBeGreaterThan(0);

    rerender(<CenaDePosicaoStage spec={s2} />);
    expect(container.querySelectorAll("[data-position-close-label]")).toHaveLength(0);
    expect((screen.getByLabelText(`${s2.referencial.nome} (a referência)`) as HTMLButtonElement).disabled).toBe(false);
  });
});