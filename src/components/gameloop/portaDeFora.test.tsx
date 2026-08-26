// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { GameLoopExerciseRenderer } from "./GameLoopExerciseRenderer";
import { enableComposerCanary, generateRegisteredFichaQuestion } from "../../curriculum/motores/composerCanary";
import type { Question } from "../../types";

/**
 * CLASS-007 medida na casca, não no palco.
 *
 * Os reparos desta frente fecharam as alternativas DENTRO do palco: o prisma
 * precisa estar construído, a transformação precisa ter acontecido, o
 * experimento precisa ter rodado. Só que a casca desenha uma segunda barra de
 * alternativas por fora, vinda de `shouldRenderQuestionOptions`, e essa barra
 * não conhece portão nenhum. A criança que ignora a ação encontra o mesmo
 * rótulo logo abaixo, habilitado, e compra o acerto por ali.
 *
 * É a definição da CLASS-007 na altura errada: a ação é executável, a ficha a
 * trata como probatória, e existe um caminho que envia a resposta sem ela. O
 * defeito não é novo — o comentário de `pareamento`/`touchcount` em
 * `answerPolicy.test.ts` descreve exatamente esta porta —, mas ele tinha sido
 * fechado com uma lista escrita à mão, e a lista ficou para trás.
 */
const shell = {
  status: null, idx: 0, timeLeft: 0, promptDone: true,
  guidedIdx: null, mockTutorialN: null, tutShow: null, journeyDone: false, flashHidden: false,
  sel: null, totalQFor: () => 5, track: { id: "x" }, aulaSuggest: false, guidedNarr: null,
  playAulinha: vi.fn(), setShowClockTutorial: vi.fn(), sound: false, peekAgain: vi.fn(),
  setJourneyDone: vi.fn(), orderTaps: [], handleOrderTap: vi.fn(), orderShake: null,
  hiddenOpts: [], armedOpt: null, setArmedOpt: vi.fn(),
} as unknown as React.ComponentProps<typeof GameLoopExerciseRenderer>;

const rotuloDa = (q: Question, valor: unknown) => {
  const option = (q.options ?? []).find(item => item.value === valor);
  return String(option?.label ?? valor);
};

/**
 * Os palcos autorais que desenham as próprias alternativas. A lista não é o
 * detector — o detector é a medição abaixo, que renderiza a casca inteira e
 * conta quantos botões carregam o rótulo da resposta.
 */
const PALCOS_QUE_DESENHAM: Array<[string, number[]]> = [
  ["GE.04", [1, 2, 3, 4, 5]],
  ["GE.07", [1, 2, 3, 4, 5]],
  ["GE.09", [1, 2, 3, 4, 5]],
  ["GM.11", [1, 2, 3, 4, 5]],
  ["N2.07", [1, 2, 3, 4, 5]],
];

/**
 * Onde a ficha exige uma ação antes da resposta. `N2.07` não entra de
 * propósito: exigir todas as formações revelaria a quantidade perguntada, e a
 * ausência de catraca ali é decisão medida, não esquecimento (livro de reparos
 * §4, linha 4).
 */
const PALCOS_COM_PORTAO: Array<[string, number[]]> = [
  ["GE.04", [3, 4]],
  ["GE.09", [1, 3, 5]],
  ["GM.11", [1, 2, 3, 5]],
];

function montar(id: string, nivel: number) {
  enableComposerCanary(id);
  const q = generateRegisteredFichaQuestion(id, nivel);
  const handlePick = vi.fn();
  const view = render(<GameLoopExerciseRenderer {...shell} q={q} handlePick={handlePick} />);
  const comORotuloDaResposta = () => [...view.container.querySelectorAll("button")]
    .filter(botao => botao.textContent?.trim() === rotuloDa(q, q.answer));
  return { q, handlePick, view, comORotuloDaResposta };
}

describe("CLASS-007 na casca — o portão do palco não pode ter porta dos fundos", () => {
  it("o rótulo da resposta aparece uma vez só: a casca não duplica o palco", () => {
    for (const [id, niveis] of PALCOS_QUE_DESENHAM) {
      for (const nivel of niveis) {
        const { view, comORotuloDaResposta } = montar(id, nivel);
        expect(comORotuloDaResposta().length, `${id} L${nivel} desenhou a resposta duas vezes`).toBe(1);
        view.unmount();
      }
    }
  });

  it("onde há portão, o único caminho que sobrou também está fechado no mount", () => {
    for (const [id, niveis] of PALCOS_COM_PORTAO) {
      for (const nivel of niveis) {
        const { handlePick, view, comORotuloDaResposta } = montar(id, nivel);
        for (const botao of comORotuloDaResposta()) fireEvent.click(botao);
        expect(handlePick, `${id} L${nivel} vendeu mastery sem a ação da ficha`).not.toHaveBeenCalled();
        view.unmount();
      }
    }
  });

  it("quem só ilustra continua recebendo a barra: suprimir ali deixaria a questão sem resposta", () => {
    // A direção perigosa do mesmo ajuste. `tabuada`, `area` e `deslocamento`
    // mostram o material e não desenham alternativa nenhuma; sem a barra da
    // casca a criança ficaria olhando uma cena sem ter onde responder.
    for (const id of ["N4.03", "N4.08", "N4.09"]) {
      const { q, view } = montar(id, 1);
      const habilitados = [...view.container.querySelectorAll("button")]
        .filter(botao => !botao.disabled && (q.options ?? []).some(o => String(o.label ?? o.value) === botao.textContent?.trim()));
      expect(habilitados.length, `${id} ficou sem caminho para responder`).toBeGreaterThan(0);
      view.unmount();
    }
  });
});
