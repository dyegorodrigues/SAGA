// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { GameLoopExerciseRenderer } from "./GameLoopExerciseRenderer";
import { evidenciasDaResposta } from "./answerPolicy";
import { JOURNEY_FICHAS } from "../../curriculum/fichas";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "../../curriculum/motores/composerCanary";
import type { AnswerMeta, Question } from "../../types";

/**
 * CLASS-007, a metade que se pode medir hoje — a evidência exigida.
 *
 * `micro.dominio.exige.evidencia` é a §9 da ficha viajando na questão: a
 * condição que a criança precisa ter demonstrado ao menos uma vez para o motor
 * dar a coroa. Se essa condição nomeia uma AÇÃO e existe um clique que a
 * entrega sem a ação, a ficha vende a prova junto com o acerto.
 *
 * ### Como se separa condição de ação sem lista escrita à mão
 *
 * Pelo comportamento, e o critério é simples: quando a evidência acompanha
 * TODA resposta certa daquele nível, ela é uma propriedade do item — "comparou
 * sem objetos", "a dimensão é a que falta", "a fração multiplica outra fração".
 * Não há o que contornar: responder certo ali É a demonstração.
 *
 * Quando a evidência acompanha ALGUMAS respostas certas e não outras, ela
 * depende do que a criança fez — e aí um clique no mount que a entregue é a
 * ação sendo comprada.
 *
 * A varredura de hoje diz que, nas fichas que declaram a exigência, a evidência
 * é sempre da primeira espécie. O gate existe para o dia em que deixar de ser.
 */
const casca = {
  status: null, idx: 0, timeLeft: 0, promptDone: true,
  guidedIdx: null, mockTutorialN: null, tutShow: null, journeyDone: false, flashHidden: false,
  sel: null, totalQFor: () => 5, track: { id: "x" }, aulaSuggest: false, guidedNarr: null,
  playAulinha: vi.fn(), setShowClockTutorial: vi.fn(), sound: false, peekAgain: vi.fn(),
  setJourneyDone: vi.fn(), orderTaps: [], handleOrderTap: vi.fn(), orderShake: null,
  hiddenOpts: [], armedOpt: null, setArmedOpt: vi.fn(),
} as unknown as React.ComponentProps<typeof GameLoopExerciseRenderer>;

interface Leitura { comEvidencia: number; semEvidencia: number }

/** Clica cada botão num render limpo e separa os acertos que trazem a prova. */
function medir(q: Question): Leitura {
  const primeiro = render(<GameLoopExerciseRenderer {...casca} q={q} handlePick={vi.fn()} />);
  const total = primeiro.container.querySelectorAll("button").length;
  primeiro.unmount();

  const leitura: Leitura = { comEvidencia: 0, semEvidencia: 0 };
  for (let indice = 0; indice < total; indice += 1) {
    const handlePick = vi.fn();
    const { container, unmount } = render(<GameLoopExerciseRenderer {...casca} q={q} handlePick={handlePick} />);
    const botao = container.querySelectorAll("button")[indice] as HTMLButtonElement | undefined;
    if (botao && !botao.disabled) {
      fireEvent.click(botao);
      for (const chamada of handlePick.mock.calls) {
        const certo = q.evaluate ? q.evaluate(chamada[0]) : chamada[0] === q.answer;
        if (!certo) continue;
        const evidencias = evidenciasDaResposta(chamada[2] as AnswerMeta | undefined, q);
        if (evidencias.includes(q.exigeEvidencia!)) leitura.comEvidencia += 1;
        else leitura.semEvidencia += 1;
      }
    }
    unmount();
  }
  return leitura;
}

describe("CLASS-007 — a evidência exigida não se compra com um clique", () => {
  it("onde a evidência depende do que a criança fez, um clique no mount não a entrega", { timeout: 900000 }, () => {
    const compradas: string[] = [];
    let declaram = 0;
    let provasVistas = 0;

    for (const ficha of JOURNEY_FICHAS.filter(item => hasComposerFicha(item.id))) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const q = generateRegisteredFichaQuestion(ficha.id, nivel) as Question;
        if (!q.exigeEvidencia) continue;
        declaram += 1;

        const { comEvidencia, semEvidencia } = medir(q);
        provasVistas += comEvidencia;
        // Condicional E comprável no mount: a evidência nomeia uma ação e existe
        // caminho que a entrega sem a ação.
        if (comEvidencia > 0 && semEvidencia > 0) {
          compradas.push(`${ficha.id} L${nivel} (${q.exigeEvidencia}): ${comEvidencia} cliques entregam a prova e ${semEvidencia} acertam sem ela`);
        }
      }
    }

    expect(compradas, `evidência probatória comprada com um clique:\n${compradas.join("\n")}`).toEqual([]);

    // Prova de vida, nas duas pontas. Contar só as fichas que declaram não
    // basta: uma medição que parasse de separar "com prova" de "sem prova"
    // zeraria os dois lados e passaria calada. É preciso afirmar também que a
    // varredura VIU a prova chegar em algum acerto.
    expect(declaram, "a varredura parou de achar ficha que exige evidência").toBeGreaterThan(50);
    expect(provasVistas, "a varredura parou de ver a evidência chegar em acerto nenhum").toBeGreaterThan(20);
  });
});
