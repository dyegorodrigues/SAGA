// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

const FALAS: string[] = [];
vi.mock("../Mascot", async (original) => {
  const real = await original<Record<string, unknown>>();
  return { ...real, speak: (t: string) => { FALAS.push(String(t)); } };
});

import { GameLoopExerciseRenderer } from "./GameLoopExerciseRenderer";

/**
 * Ouvir antes de escolher.
 *
 * A tela prometia isto por escrito — "Toque para OUVIR · toque de novo para
 * escolher" — e o código não cumpria: o primeiro toque falava E respondia no
 * mesmo gesto. Para a criança de quatro a seis anos, que NÃO LÊ, escolher
 * entre "Sobrou", "Deu certinho" e "Faltou" sem poder ouvir é chutar; e o app
 * anotava o chute como erro de matemática.
 *
 * O teste segura as duas metades: a promessa escrita e o comportamento. Uma
 * sem a outra é pior do que nenhuma — promessa quebrada ensina a criança a
 * desconfiar da tela.
 */

const PERGUNTA = {
  kind: "plain",
  prompt: "E aí, sobrou algum?",
  answer: 2,
  options: [
    { value: 1, label: "Sobrou" },
    { value: 2, label: "Deu certinho" },
    { value: 3, label: "Faltou" },
  ],
};

const NUMEROS = {
  kind: "plain",
  prompt: "Quanto é 3 mais 4?",
  answer: 7,
  options: [{ value: 6, label: "6" }, { value: 7, label: "7" }, { value: 8, label: "8" }],
};

function props(q: unknown, handlePick: (v: unknown) => void, armedOpt: unknown, setArmedOpt: (v: unknown) => void): any {
  return {
    q, status: null, idx: 0, handlePick, timeLeft: 30, promptDone: true, guidedIdx: null,
    mockTutorialN: null, tutShow: null, journeyDone: false, flashHidden: false, sel: null, totalQFor: () => 8,
    track: { id: "t", name: "t", color: "#2563EB", dark: "#1E40AF" }, aulaSuggest: false, guidedNarr: null,
    playAulinha: () => {}, setShowClockTutorial: () => {}, sound: true, peekAgain: () => {}, setJourneyDone: () => {},
    orderTaps: [], handleOrderTap: () => {}, orderShake: null, faseDaCena: undefined,
    hiddenOpts: [] as unknown[], armedOpt, setArmedOpt,
  };
}

describe("ouvir antes de escolher", () => {
  afterEach(() => { cleanup(); FALAS.length = 0; });

  it("o primeiro toque FALA e não responde", () => {
    const escolhas: unknown[] = [];
    let armado: unknown = null;
    render(<GameLoopExerciseRenderer {...props(PERGUNTA, v => escolhas.push(v), armado, (v: unknown) => { armado = v; })} />);

    fireEvent.click(screen.getByText("Faltou"));

    expect(FALAS, "o rótulo tem de ser falado no primeiro toque").toContain("faltou");
    expect(escolhas, "o primeiro toque NÃO é resposta").toEqual([]);
    expect(armado, "a alternativa fica armada para o segundo toque").toBe(3);
  });

  it("o segundo toque na MESMA alternativa responde", () => {
    const escolhas: unknown[] = [];
    // Já armada, como o app a devolve depois do primeiro toque.
    render(<GameLoopExerciseRenderer {...props(PERGUNTA, v => escolhas.push(v), 3, () => {})} />);

    fireEvent.click(screen.getByText("Faltou"));

    expect(escolhas, "o segundo toque escolhe").toEqual([3]);
  });

  it("a tela promete o que o código faz", () => {
    render(<GameLoopExerciseRenderer {...props(PERGUNTA, () => {}, null, () => {})} />);
    expect(screen.getByText(/Toque para OUVIR/i)).toBeTruthy();
  });

  it("alternativa de número responde no primeiro toque — não vira dois toques por conta", () => {
    const escolhas: unknown[] = [];
    render(<GameLoopExerciseRenderer {...props(NUMEROS, v => escolhas.push(v), null, () => {})} />);

    fireEvent.click(screen.getByText("7"));

    expect(escolhas, "numeral não pede audição: a missão ficaria arrastada").toEqual([7]);
    expect(screen.queryByText(/Toque para OUVIR/i), "e a tela não promete o que não faz").toBeNull();
  });
});
