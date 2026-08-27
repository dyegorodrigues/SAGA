// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { GameLoopExerciseRenderer } from "./GameLoopExerciseRenderer";
import { JOURNEY_FICHAS } from "../../curriculum/fichas";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "../../curriculum/motores/composerCanary";
import type { Question } from "../../types";

/**
 * CLASS-010 — a resposta desenhada duas vezes.
 *
 * O palco autoral desenha as próprias alternativas e a casca desenhava as
 * mesmas por baixo, vindas de `shouldRenderQuestionOptions`. Não era só feio:
 * eram DOIS caminhos para o mesmo acerto, e o de baixo não conhece portão, nem
 * cena, nem manipulação. A criança que ignora o palco encontra o mesmo rótulo
 * logo abaixo, habilitado.
 *
 * É primo da CLASS-007 e foi encontrado por ela: a frente que fechou as
 * alternativas DENTRO dos palcos descobriu que a barra de fora continuava
 * vendendo o acerto. Ali o remendo foi por lista; aqui a lista some.
 *
 * ### A medição é por comportamento, não por texto
 *
 * O que conta não é quantas vezes o rótulo aparece — um teclado numérico
 * legitimamente tem o dígito da resposta, e uma malha tem a casa certa. O que
 * conta é quantos BOTÕES, sozinhos e no mount, fazem o `handlePick` receber
 * uma resposta que a questão aceita. Dois é a compra em duplicata.
 *
 * Zero também não é defeito aqui: onde a ficha exige uma ação antes — construir
 * o prisma, rodar o experimento, conferir os critérios —, nenhum clique isolado
 * vende nada, e é exatamente isso que a CLASS-007 veio garantir. Quem cobra a
 * existência do caminho é `portaDeFora.test.tsx`, do outro lado.
 *
 * Gate por descoberta com catraca nos dois sentidos (D068): palco novo que
 * duplicar reprova sem ninguém inscrever nada, e entrada que parou de duplicar
 * também, para o registro encolher a cada reparo. Ele está vazio.
 */
const DUPLICAM: Record<string, { niveis: number[]; porque: string }> = {};

const casca = {
  status: null, idx: 0, timeLeft: 0, promptDone: true,
  guidedIdx: null, mockTutorialN: null, tutShow: null, journeyDone: false, flashHidden: false,
  sel: null, totalQFor: () => 5, track: { id: "x" }, aulaSuggest: false, guidedNarr: null,
  playAulinha: vi.fn(), setShowClockTutorial: vi.fn(), sound: false, peekAgain: vi.fn(),
  setJourneyDone: vi.fn(), orderTaps: [], handleOrderTap: vi.fn(), orderShake: null,
  hiddenOpts: [], armedOpt: null, setArmedOpt: vi.fn(),
} as unknown as React.ComponentProps<typeof GameLoopExerciseRenderer>;

const rotuloDaResposta = (q: Question): string => {
  const opcoes = q.options ?? [];
  const certa = opcoes.find(option => q.evaluate?.(option.value)) ?? opcoes.find(option => option.value === q.answer);
  return String(certa?.label ?? certa?.value ?? q.answer);
};

/**
 * Quantos botões com o rótulo da resposta vendem o acerto sozinhos.
 *
 * Cada candidato é clicado num render limpo: o primeiro clique pode desabilitar
 * a tela inteira, e contar os seguintes no mesmo render diria que só existe um
 * caminho justamente onde existem dois.
 */
function caminhosQueVendem(q: Question): number {
  const rotulo = rotuloDaResposta(q);
  const primeiro = render(<GameLoopExerciseRenderer {...casca} q={q} handlePick={vi.fn()} />);
  const indices = [...primeiro.container.querySelectorAll("button")]
    .map((botao, indice) => ({ botao, indice }))
    .filter(({ botao }) => (botao.textContent ?? "").trim() === rotulo)
    .map(({ indice }) => indice);
  primeiro.unmount();

  let vendem = 0;
  for (const indice of indices) {
    const handlePick = vi.fn();
    const { container, unmount } = render(<GameLoopExerciseRenderer {...casca} q={q} handlePick={handlePick} />);
    const botao = container.querySelectorAll("button")[indice] as HTMLButtonElement | undefined;
    if (botao && !botao.disabled) {
      fireEvent.click(botao);
      const vendeu = handlePick.mock.calls.some(chamada => (q.evaluate ? q.evaluate(chamada[0]) : chamada[0] === q.answer));
      if (vendeu) vendem += 1;
    }
    unmount();
  }
  return vendem;
}

function varrer(): { duplicam: Map<string, number[]>; comUmCaminho: number } {
  const duplicam = new Map<string, number[]>();
  let comUmCaminho = 0;
  for (const id of JOURNEY_FICHAS.map(ficha => ficha.id).filter(hasComposerFicha)) {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion(id, nivel) as Question;
      const caminhos = caminhosQueVendem(q);
      if (caminhos > 1) duplicam.set(id, [...(duplicam.get(id) ?? []), nivel]);
      if (caminhos === 1) comUmCaminho += 1;
    }
  }
  return { duplicam, comUmCaminho };
}

describe("CLASS-010 — a mesma resposta não pode ser comprada por dois caminhos", () => {
  it("a varredura cobre todas as fichas servidas pelo Composer", () => {
    expect(JOURNEY_FICHAS.map(ficha => ficha.id).filter(hasComposerFicha).length).toBeGreaterThanOrEqual(75);
  });

  it("nenhum palco desenha a resposta duas vezes fora do registro", { timeout: 600000 }, () => {
    const { duplicam, comUmCaminho } = varrer();
    const novas = [...duplicam.keys()].filter(id => !DUPLICAM[id]).sort();
    const obsoletas = Object.keys(DUPLICAM).filter(id => !duplicam.has(id)).sort();

    expect(novas, `palcos que passaram a duplicar a resposta: ${novas.join(", ")}`).toEqual([]);
    expect(obsoletas, `entradas que pararam de duplicar — remova-as: ${obsoletas.join(", ")}`).toEqual([]);

    // Prova de vida do instrumento. Com o registro vazio, um gate que parasse
    // de medir passaria calado: "ninguém duplica" e "não olhei" dão o mesmo
    // verde. Este número diz que a varredura continua vendo cliques venderem
    // acerto — se ele desabar, quem quebrou foi a medição, não o app.
    expect(comUmCaminho, "a varredura parou de enxergar clique nenhum vendendo acerto").toBeGreaterThan(80);
  });
});
