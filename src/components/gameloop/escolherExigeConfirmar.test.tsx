// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { ALL_MATH_TRACKS } from "../../curriculum/motores/curriculum";
import { GameLoopExerciseRenderer } from "./GameLoopExerciseRenderer";

const props = (q: unknown, handlePick: (v: unknown) => void, armedOpt: unknown, setArmedOpt: (v: unknown) => void) => ({
  q, status: null, idx: 0, handlePick, timeLeft: 30, promptDone: true, guidedIdx: null,
  mockTutorialN: null, tutShow: null, journeyDone: false, flashHidden: false, sel: null, totalQFor: () => 8,
  track: { id: "t", name: "t", color: "#2563EB", dark: "#1E40AF" }, aulaSuggest: false, guidedNarr: null,
  playAulinha: () => {}, setShowClockTutorial: () => {}, sound: true, peekAgain: () => {}, setJourneyDone: () => {},
  orderTaps: [], handleOrderTap: () => {}, orderShake: null, hiddenOpts: [] as unknown[], armedOpt, setArmedOpt,
});

const MOLDURA = /^(Fechar|Sair da missão|Avançar|Continuar|Ver Resultado|Sair|Voltar|Ouvir de novo|Ligar o som|Desligar o som|Ver de novo|Escolher outra)$|Como faz|aulinha|Tá difícil|Confirmar:|Ouvir de novo:/i;

/**
 * Nenhuma alternativa responde no primeiro toque.
 *
 * ## Por que existe
 *
 * A regra de ouvir-antes-de-escolher nasceu no renderizador genérico. Os
 * quinze palcos que desenham as PRÓPRIAS alternativas nunca passaram por ele,
 * então a regra valia em dois lugares e faltava em treze — e ninguém percebia,
 * porque cada palco tem o seu teste e nenhum teste olhava o conjunto.
 *
 * O pai encontrou o buraco no PRIMEIRO exercício da Jornada, depois de eu ter
 * dito que estava resolvido: *"no primeiro exercício nem confirma, o botão ali
 * verdinho para confirmar a resposta, não"*.
 *
 * Medido antes: **53 combinações respondiam no primeiro toque.** Depois de
 * tudo passar por `AlternativasQueFalam`: **zero.**
 *
 * ## O que este portão NÃO cobre
 *
 * Manipulação — estourar balão, arrastar peça, contar objeto. Ali o gesto É a
 * resposta, e pedir confirmação atravessaria o exercício. Por isso a varredura
 * só olha dentro de grupos `aria-label="Alternativas"`, que é onde mora
 * ESCOLHA.
 */
describe("escolher exige ouvir e confirmar, na jornada inteira", () => {
  it("⚠️ nenhuma alternativa responde no primeiro toque", () => {
    vi.useFakeTimers();
    const semConfirmar: string[] = [];
    const comConfirmar: string[] = [];
    for (const track of ALL_MATH_TRACKS) {
      for (const lvl of [1, 2, 3, 4, 5]) {
        let q: any;
        try { q = track.gen(lvl); } catch { continue; }
        let respondeu = false;
        let armado: unknown = null;
        const { container, unmount } = render(
          <GameLoopExerciseRenderer {...(props(q, () => { respondeu = true; }, armado, (v: unknown) => { armado = v; }) as unknown as React.ComponentProps<typeof GameLoopExerciseRenderer>)} />);
        act(() => { vi.advanceTimersByTime(9000); });

        // Só ESCOLHA entre alternativas. Manipulação (estourar balão, arrastar
        // peça, contar objeto) responde no toque de propósito: o gesto é a
        // resposta, e um confirmar ali seria atravessar o exercício.
        const grupos = [...container.querySelectorAll('[aria-label="Alternativas"], [role="radiogroup"]')];
        const alvos = grupos.flatMap(g => [...g.querySelectorAll("button")])
          .filter(b => !b.disabled)
          .filter(b => {
            const n = (b.getAttribute("aria-label") || b.textContent || "").replace(/\s+/g, " ").trim();
            return n && !MOLDURA.test(n);
          });
        if (alvos.length === 0) { unmount(); continue; }
        fireEvent.click(alvos[0]);
        act(() => { vi.advanceTimersByTime(300); });
        const temBarra = container.querySelector('[aria-label^="Confirmar:"]') !== null;
        if (respondeu && !temBarra) semConfirmar.push(`${track.id}|${lvl}|${q.kind}`);
        else if (temBarra || armado !== null) comConfirmar.push(`${track.id}|${lvl}`);
        unmount();
      }
    }
    vi.useRealTimers();
    expect(
      semConfirmar,
      [
        "Alternativas que respondem no primeiro toque, sem falar nem confirmar:",
        ...semConfirmar.map(s => `  ${s}`),
        "",
        "Use `AlternativasQueFalam`. Quem não lê não escolhe entre símbolos no escuro.",
      ].join("\n"),
    ).toEqual([]);

    // Prova de vida: se a varredura parasse de achar alternativa, "nenhuma
    // responde no primeiro toque" passaria a significar "não olhei".
    expect(comConfirmar.length, "a varredura ainda enxerga alternativas").toBeGreaterThan(40);
  }, 900000);
});
