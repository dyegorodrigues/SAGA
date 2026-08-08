// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { TouchPlaceStage } from "./TouchPlaceStage";
import { Composer } from "../../curriculum/Composer";
import { N1_13 } from "../../curriculum/fichas/jornada/N1.13";
import { ProducaoSpec } from "../../curriculum/procedimentos/producaoContract";
import { AcaoDeProducao } from "../../curriculum/procedimentos/producaoProcedure";
import { MisconceptionTag } from "../../constants/misconceptions";

const spec = (lvl: number) => Composer.generate(N1_13, lvl).uiProps as ProducaoSpec;

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function bandeja(container: HTMLElement) {
  return container.querySelector('[aria-label^="Pegar "]') as HTMLButtonElement;
}

function cena(container: HTMLElement) {
  return container.querySelector('.relative.overflow-hidden.rounded-3xl') as HTMLDivElement;
}

function colocarPorToque(container: HTMLElement) {
  fireEvent.click(bandeja(container));
  const vaga = container.querySelector('[aria-label="Vaga vazia"]') as HTMLButtonElement | null;
  fireEvent.click(vaga ?? (container.querySelector('[aria-label^="Colocar "]') as HTMLElement));
}

function livre(alvo = 3): ProducaoSpec {
  const base = spec(4);
  return { ...base, alvo, resposta: alvo, comAndaime: false, vagas: "nenhuma", limitaExcesso: false };
}

describe("TouchPlaceStage — F04/N1.13", () => {
  it("não imprime o enunciado nem repete o número pedido dentro do palco", () => {
    const s = spec(2);
    const { container } = render(<TouchPlaceStage spec={s} />);
    expect(container.textContent ?? "").not.toContain(s.enunciado);
    expect(container.textContent ?? "").not.toContain(String(s.alvo));
  });

  it("a bandeja começa maior que o pedido", () => {
    const s = spec(1);
    const { container } = render(<TouchPlaceStage spec={s} />);
    expect(bandeja(container).querySelectorAll("span").length).toBe(s.bandeja);
    expect(s.bandeja).toBeGreaterThan(s.alvo);
  });

  it("mantém a alternativa por toque", () => {
    const s = spec(1);
    const { container } = render(<TouchPlaceStage spec={s} />);
    expect(container.querySelectorAll('[aria-label="Vaga vazia"]').length).toBe(s.alvo);
    colocarPorToque(container);
    expect(container.querySelectorAll('[aria-label="Vaga vazia"]').length).toBe(s.alvo - 1);
  });

  it("implementa arrasto real: mover >8px pega, acende halo e assenta", () => {
    const s = spec(1);
    const { container } = render(<TouchPlaceStage spec={s} />);
    const antes = container.querySelectorAll('[aria-label="Vaga vazia"]').length;
    const field = cena(container);
    vi.spyOn(field, "getBoundingClientRect").mockReturnValue({
      x: 0, y: 0, left: 0, top: 0, right: 326, bottom: 176,
      width: 326, height: 176, toJSON: () => ({}),
    } as DOMRect);
    const tray = bandeja(container);
    fireEvent.pointerDown(tray, { pointerId: 7, clientX: 20, clientY: 260 });
    fireEvent.pointerMove(tray, { pointerId: 7, clientX: s.ancoras[0].x, clientY: s.ancoras[0].y });
    expect(Array.from(container.querySelectorAll('[aria-label="Vaga vazia"]'))
      .some(el => (el as HTMLElement).style.boxShadow !== "none" && (el as HTMLElement).style.boxShadow !== "")).toBe(true);
    fireEvent.pointerUp(tray, { pointerId: 7, clientX: s.ancoras[0].x, clientY: s.ancoras[0].y });
    expect(container.querySelectorAll('[aria-label="Vaga vazia"]').length).toBe(antes - 1);
  });

  it("drop longe da cena devolve o objeto à bandeja", () => {
    const s = spec(1);
    const { container } = render(<TouchPlaceStage spec={s} />);
    const field = cena(container);
    vi.spyOn(field, "getBoundingClientRect").mockReturnValue({
      x: 0, y: 0, left: 0, top: 0, right: 326, bottom: 176,
      width: 326, height: 176, toJSON: () => ({}),
    } as DOMRect);
    const tray = bandeja(container);
    const antes = container.querySelectorAll('[aria-label="Vaga vazia"]').length;
    fireEvent.pointerDown(tray, { pointerId: 2, clientX: 20, clientY: 260 });
    fireEvent.pointerMove(tray, { pointerId: 2, clientX: 500, clientY: 500 });
    fireEvent.pointerUp(tray, { pointerId: 2, clientX: 500, clientY: 500 });
    expect(container.querySelectorAll('[aria-label="Vaga vazia"]').length).toBe(antes);
    expect(bandeja(container).disabled).toBe(false);
  });

  it("conta em voz alta a cada encaixe", () => {
    const falar = vi.fn();
    const s = spec(2);
    const { container } = render(<TouchPlaceStage spec={s} falar={falar} />);
    colocarPorToque(container);
    expect(falar).toHaveBeenCalledWith(s.tema.genero === "f" ? "uma..." : "um...");
  });

  it("nova spec limpa estado visual, mas não apaga histórico diagnóstico da missão", () => {
    vi.useFakeTimers();
    const comVaga = spec(1);
    const semVaga = livre(3);
    const recebidas: Array<AcaoDeProducao & { diagnosticosLongitudinais?: string[] }> = [];
    const { container, rerender } = render(
      <TouchPlaceStage spec={comVaga} onAnswer={(_v, a) => recebidas.push(a)} />,
    );

    for (let i = 0; i < comVaga.alvo; i += 1) colocarPorToque(container);
    act(() => { vi.advanceTimersByTime(900); });
    expect(recebidas).toHaveLength(1);
    expect(recebidas[0]).toMatchObject({ comAndaime: true, colocados: comVaga.alvo });

    rerender(<TouchPlaceStage spec={semVaga} onAnswer={(_v, a) => recebidas.push(a)} />);
    expect(container.querySelectorAll('[aria-label="Vaga vazia"]').length).toBe(0);
    expect(screen.queryByText("Pronto!")).toBeNull();

    colocarPorToque(container);
    fireEvent.click(screen.getByText("Pronto!"));
    expect(recebidas).toHaveLength(2);
    expect(recebidas[1].diagnosticosLongitudinais).toContain(MisconceptionTag.DEPENDE_DE_ANDAIME);
  });

  it("com vagas, trava na última colocação e publica 400ms após iniciar o fecho", () => {
    vi.useFakeTimers();
    const s = spec(1);
    const onAnswer = vi.fn();
    const { container } = render(<TouchPlaceStage spec={s} onAnswer={onAnswer} />);
    for (let i = 0; i < s.alvo; i += 1) colocarPorToque(container);
    expect(bandeja(container).disabled).toBe(true);
    act(() => { vi.advanceTimersByTime(899); });
    expect(onAnswer).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(1); });
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer.mock.calls[0][1]).toMatchObject({ colocados: s.alvo, recusas: 0, comAndaime: true });
  });

  it("sem vagas, excesso fica materializado; erro autoral é reportado e reinicia tentativa", () => {
    vi.useFakeTimers();
    const s = livre(2);
    const recebido: AcaoDeProducao[] = [];
    const { container } = render(<TouchPlaceStage spec={s} onAnswer={(_v, a) => recebido.push(a)} />);
    for (let i = 0; i < 3; i += 1) colocarPorToque(container);
    fireEvent.click(screen.getByText("Pronto!"));
    expect(recebido).toHaveLength(1);
    expect(recebido[0]).toMatchObject({ colocados: 3, alvo: 2, comAndaime: false });
    expect((screen.getByText("Pronto!") as HTMLButtonElement).disabled).toBe(true);
    act(() => { vi.advanceTimersByTime(900); });
    expect(screen.queryByText("Pronto!")).toBeNull();
    expect(bandeja(container).disabled).toBe(false);
  });

  it("se parou antes, reporta e preserva o que já produziu para continuar", () => {
    vi.useFakeTimers();
    const s = livre(3);
    const onAnswer = vi.fn();
    const { container } = render(<TouchPlaceStage spec={s} onAnswer={onAnswer} />);
    colocarPorToque(container);
    fireEvent.click(screen.getByText("Pronto!"));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer.mock.calls[0][1]).toMatchObject({ colocados: 1, alvo: 3 });
    act(() => { vi.advanceTimersByTime(900); });
    expect(screen.getByText("Pronto!")).toBeTruthy();
    colocarPorToque(container);
    expect(container.querySelectorAll(`[aria-label^="${s.tema.singular} "]`).length).toBe(2);
  });

  it("acerto sem vagas publica cedo; a janela autoral do GameLoop completa o fecho", () => {
    vi.useFakeTimers();
    const s = livre(2);
    const onAnswer = vi.fn();
    const { container } = render(<TouchPlaceStage spec={s} onAnswer={onAnswer} />);
    colocarPorToque(container);
    colocarPorToque(container);
    fireEvent.click(screen.getByText("Pronto!"));
    act(() => { vi.advanceTimersByTime(399); });
    expect(onAnswer).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(1); });
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer.mock.calls[0][1]).toMatchObject({ colocados: 2, alvo: 2, comAndaime: false });
  });

  it("Mão Fantasma demonstra objeto + mão sem resolver a resposta", () => {
    const s = spec(1);
    const { container } = render(<TouchPlaceStage spec={s} mostrar={{ maoFantasma: { de: "bandeja0", para: "vaga0" } }} />);
    expect(container.textContent).toContain("👆");
    expect(container.querySelectorAll('[aria-label="Vaga vazia"]').length).toBe(s.alvo);
  });

  it("nível 5 não oferece replay; níveis 4 e 5 não desenham vagas", () => {
    const { container: n4 } = render(<TouchPlaceStage spec={spec(4)} />);
    expect(n4.querySelector('[aria-label="Ouvir o pedido de novo"]')).toBeTruthy();
    expect(n4.querySelectorAll('[aria-label="Vaga vazia"]').length).toBe(0);
    const { container: n5 } = render(<TouchPlaceStage spec={spec(5)} />);
    expect(n5.querySelector('[aria-label="Ouvir o pedido de novo"]')).toBeNull();
    expect(n5.querySelectorAll('[aria-label="Vaga vazia"]').length).toBe(0);
  });

  it("sem violação de acessibilidade", async () => {
    const { container } = render(<TouchPlaceStage spec={spec(1)} />);
    const r = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(r.violations.map(v => v.id)).toEqual([]);
  });
});
