// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { GameLoopExerciseRenderer } from "./GameLoopExerciseRenderer";
import { shouldRenderQuestionOptions } from "./answerPolicy";
import { gN4_02 } from "../../utils/generatorsF2";
import type { Question } from "../../types";

/**
 * N4.02/F98 medido na tela, não no gerador.
 *
 * O dimensionamento da CLASS-007 registrou N4.02 como "ação opcional": o giro
 * existiria no runtime legado e a criança poderia ignorá-lo. A forma estava
 * certa no papel — `gN4_02` chega a declarar `nlEnd: 1, // hack to show rotate
 * button` — mas a medição na tela mostrou que a questão legada não carrega
 * `uiProps`, e sem `uiProps` o `GameLoopExerciseRenderer` nem chama o
 * `FichaRenderer`. O `ArrayGrid` nunca renderiza, e `shouldRenderQuestionOptions`
 * é `false` para `kind: "array"` justamente porque o `ArrayGrid` desenha as
 * próprias alternativas. Resultado: tela vazia nos cinco níveis.
 *
 * Não era bypass de ação executável, então não era CLASS-007 (a própria
 * definição exclui "ação canônica completamente ausente do runtime"). Era pior:
 * a competência inteira era injogável.
 */
const shell = {
  status: null, idx: 0, timeLeft: 0, promptDone: true,
  guidedIdx: null, mockTutorialN: null, tutShow: null, journeyDone: false, flashHidden: false,
  sel: null, totalQFor: () => 5, track: { id: "N4.02" }, aulaSuggest: false, guidedNarr: null,
  playAulinha: vi.fn(), setShowClockTutorial: vi.fn(), sound: false, peekAgain: vi.fn(),
  setJourneyDone: vi.fn(), orderTaps: [], handleOrderTap: vi.fn(), orderShake: null,
  hiddenOpts: [], armedOpt: null, setArmedOpt: vi.fn(),
};

function montar(nivel: number) {
  const q = gN4_02(nivel);
  const handlePick = vi.fn();
  const view = render(<GameLoopExerciseRenderer {...(shell as never)} q={q as never} handlePick={handlePick} />);
  const alternativas = () => [...view.container.querySelectorAll<HTMLButtonElement>("button")]
    .filter(botao => (q.options ?? []).some(option => (option.label ?? String(option.value)) === botao.textContent?.trim()));
  const girar = () => [...view.container.querySelectorAll<HTMLButtonElement>("button")]
    .find(botao => botao.textContent?.includes("Girar")) ?? null;
  const certa = () => {
    const alvo = alternativas().find(botao => botao.textContent?.trim() === rotuloCerto(q));
    if (!alvo) throw new Error(`N4.02 L${nivel} sem botão para ${String(q.answer)}.`);
    return alvo;
  };
  return { q, handlePick, view, alternativas, girar, certa };
}

const rotuloCerto = (q: Question) => {
  const option = (q.options ?? []).find(item => item.value === q.answer);
  return option?.label ?? String(q.answer);
};

describe("N4.02/F98 — o arranjo precisa existir na tela", () => {
  it("desenha a grade e as alternativas nos cinco níveis", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const { q, view, alternativas } = montar(nivel);
      expect(q.uiProps, `L${nivel} sem uiProps: o FichaRenderer nem é alcançado`).toBeTruthy();
      expect(shouldRenderQuestionOptions(q), "o ArrayGrid desenha as próprias alternativas").toBe(false);

      expect(view.container.querySelector("[aria-label*='linhas']"), `L${nivel} sem arranjo desenhado`).not.toBeNull();
      expect(alternativas().length, `L${nivel} sem alternativa nenhuma na tela`).toBe((q.options ?? []).length);
      view.unmount();
    }
  });

  it("L1 conta o total sem giro, porque a pergunta é a contagem", () => {
    const { q, handlePick, girar, certa } = montar(1);
    expect(girar(), "L1 não pede comutatividade").toBeNull();
    expect(certa().disabled).toBe(false);
    fireEvent.click(certa());
    expect(handlePick).toHaveBeenCalledWith(q.answer, undefined, expect.objectContaining({ source: "array-grid" }));
  });

  it("a partir de L2 a expressão só é aceita depois de girar o arranjo", () => {
    for (const nivel of [2, 3, 4, 5]) {
      const { q, handlePick, girar, certa, view } = montar(nivel);
      expect(girar(), `L${nivel} precisa oferecer o giro`).not.toBeNull();

      expect(certa().disabled, `L${nivel} respondeu a comutatividade sem girar`).toBe(true);
      fireEvent.click(certa());
      expect(handlePick).not.toHaveBeenCalled();

      fireEvent.click(girar()!);
      expect(certa().disabled, `L${nivel} continuou fechado depois do giro`).toBe(false);
      fireEvent.click(certa());
      expect(handlePick).toHaveBeenCalledWith(q.answer, undefined, expect.objectContaining({ source: "array-grid" }));
      view.unmount();
    }
  });

  it("o giro não imprime a conta na tela: quem responde é a criança", () => {
    const { view, girar } = montar(3);
    fireEvent.click(girar()!);
    // `showEquation` escreveria "N linhas × M colunas = ?" ao lado de alternativas
    // que são exatamente `N × M`, `N + M` e `M - N`. Seria o gabarito em duas
    // linhas diferentes da mesma tela.
    expect(view.container.textContent).not.toMatch(/linhas ×/);
  });
});
