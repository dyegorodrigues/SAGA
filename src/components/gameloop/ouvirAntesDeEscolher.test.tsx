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

  /**
   * ⚠️ Este teste dizia "o segundo toque na MESMA alternativa responde".
   *
   * Estava certo sobre a regra e cego sobre a tela: nada dizia à criança que
   * tocar de novo decidia. O pai desenhou o conserto:
   *
   * > *"ela ouviu o som (...) e embaixo ou do lado (...) o botão de confirmar,
   * > sei lá, piscando, piscando para a criança entender."*
   */
  it("⚠️ quem responde é o botão de confirmar, não um segundo toque invisível", () => {
    const escolhas: unknown[] = [];
    render(<GameLoopExerciseRenderer {...props(PERGUNTA, v => escolhas.push(v), 3, () => {})} />);

    // Tocar de novo na alternativa NÃO responde: só re-arma e fala.
    fireEvent.click(screen.getByText("Faltou"));
    expect(escolhas, "a alternativa não decide sozinha").toEqual([]);

    fireEvent.click(screen.getByLabelText("Confirmar: Faltou"));
    expect(escolhas, "o confirmar decide").toEqual([3]);
  });

  it("a tela promete o que o código faz", () => {
    render(<GameLoopExerciseRenderer {...props(PERGUNTA, () => {}, null, () => {})} />);
    expect(screen.getByText(/Toque para OUVIR/i)).toBeTruthy();
  });

  it("a promessa não aparece quando ainda não há alternativa na tela", () => {
    /*
     * Vários palcos guardam a pergunta para DEPOIS da ação: na N1.01 a criança
     * distribui os ovos e só então aparecem "Sobrou / Deu certinho / Faltou".
     * A frase "Toque para OUVIR" saía desde o começo, prometendo um toque em
     * nada. Promessa fora de hora ensina a ignorar a frase justamente onde ela
     * importa.
     */
    const semAlternativaAinda = { ...PERGUNTA, options: [] };
    render(<GameLoopExerciseRenderer {...props(semAlternativaAinda, () => {}, null, () => {})} />);
    expect(screen.queryByText(/Toque para OUVIR/i)).toBeNull();
  });

  /**
   * ⚠️ Este teste também guardava a decisão antiga — ver `opcaoQueSeOuve.test.ts`.
   *
   * O numeral passou a pedir audição, então o primeiro toque OUVE e não
   * responde. Quem responde é o botão de confirmar, que agora existe na tela.
   */
  it("⚠️ alternativa de número OUVE no primeiro toque e não responde sozinha", () => {
    const escolhas: unknown[] = [];
    render(<GameLoopExerciseRenderer {...props(NUMEROS, v => escolhas.push(v), null, () => {})} />);

    fireEvent.click(screen.getByText("7"));

    expect(escolhas, "o primeiro toque não decide nada").toEqual([]);
  });

  /**
   * ⚠️ O segundo toque precisa ser VISÍVEL.
   *
   * O pai desenhou este conserto:
   *
   * > *"quando tu aperta a primeira vez (...) ela ouviu o som, deu certinho,
   * > deu não sei o que, e embaixo ou do lado (...) o botão de confirmar, sei
   * > lá, piscando, piscando para a criança entender."*
   *
   * A regra "toque de novo para escolher" estava certa e era invisível: nada
   * na tela dizia que o segundo toque valia. A criança ouvia, ficava
   * satisfeita, e a resposta nunca saía.
   */
  it("dá para ouvir de novo sem responder, quantas vezes quiser", () => {
    const escolhas: unknown[] = [];
    render(<GameLoopExerciseRenderer {...props(PERGUNTA, v => escolhas.push(v), 1, () => {})} />);
    fireEvent.click(screen.getByLabelText("Ouvir de novo: Sobrou"));
    fireEvent.click(screen.getByLabelText("Ouvir de novo: Sobrou"));
    expect(FALAS.filter(f => /sobrou/i.test(f)).length, "falou as duas vezes").toBe(2);
    expect(escolhas, "e não respondeu nenhuma").toEqual([]);
  });

  it("dá para mudar de ideia antes de confirmar", () => {
    const escolhas: unknown[] = [];
    let armado: unknown = 1;
    render(<GameLoopExerciseRenderer {...props(PERGUNTA, v => escolhas.push(v), armado, (v: unknown) => { armado = v; })} />);
    fireEvent.click(screen.getByLabelText("Escolher outra"));
    expect(armado, "desarmou").toBeNull();
    expect(escolhas, "sem responder").toEqual([]);
  });

});
