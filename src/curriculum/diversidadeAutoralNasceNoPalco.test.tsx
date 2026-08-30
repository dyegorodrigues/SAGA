// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { GameLoopExerciseRenderer } from "../components/gameloop/GameLoopExerciseRenderer";
import { evidenciasDaResposta } from "../components/gameloop/answerPolicy";
import { JOURNEY_FICHAS } from "./fichas";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "./motores/composerCanary";
import { prefixoDeFamilia } from "./procedimentos/familiaIntegradora";
import type { AnswerMeta, Question } from "../types";

/**
 * CLASS-008, a metade que faltava — a diversidade de prefixo AUTORAL.
 *
 * ## O buraco, e como ele apareceu
 *
 * O gate `nivelIntegradorExigeFamilias.test.ts` prova os dois sentidos da
 * regra de diversidade: quem sorteia famílias exige famílias, e quem exige
 * famílias consegue produzi-las. A segunda metade existe porque, sem ela,
 * bastaria escrever a exigência em toda ficha para o gate ficar verde — e uma
 * exigência que o nível nunca satisfaz é uma coroa que nunca chega.
 *
 * Só que aquele gate reconhece uma exigência pelo prefixo de família
 * (`prefixoDeFamilia(ficha.id)`), e três fichas declaram diversidade com
 * prefixo PRÓPRIO: o salto da contagem, o desafio da sequência, o caso da
 * balança. Para essas, a segunda metade nunca rodou. A exigência estava escrita
 * e ninguém tinha provado que existe caminho para cumpri-la.
 *
 * O simulador do aprendiz sintético (`npm run simular`) esbarrou nisso: as
 * competências de prefixo autoral eram as únicas que não coroavam, e a razão
 * era que a prova delas não nasce na questão — nasce no palco, no que a criança
 * faz. Este gate vai buscar lá.
 *
 * ## Por que é por descoberta, e não por lista
 *
 * Quem decide o que é "autoral" é o prefixo declarado comparado com o de
 * família: tudo que não é família cai aqui, sem nome escrito à mão. Ficha nova
 * que invente um prefixo entra na varredura sozinha (D068).
 *
 * ## Por que a evidência é colhida do palco de verdade
 *
 * `evidenciasRegraSequencia` e as irmãs são funções puras: testá-las
 * diretamente provaria que a função sabe calcular, não que a criança chega até
 * ela. O que quebra na prática é o fio — o palco que não passa o `meta`, o
 * `answerPolicy` que não lê o canal. Então aqui a criança RESPONDE: digita onde
 * há campo, clica onde há barra, e a evidência é a que o `GameLoop` receberia.
 *
 * ## Por que a busca varre os cinco níveis
 *
 * O motor guarda `evidenciasVistas` desde o primeiro nível e nunca as esquece.
 * Uma exigência declarada no nível cinco pode ser cumprida no três — é o caso
 * da AL.04, cujo desafio decrescente mora no L3. Exigir que o próprio nível a
 * emita seria inventar uma regra mais dura que a do motor.
 */

const casca = {
  status: null, idx: 0, timeLeft: 0, promptDone: true,
  guidedIdx: null, mockTutorialN: null, tutShow: null, journeyDone: false, flashHidden: false,
  sel: null, totalQFor: () => 8, track: { id: "diversidade-autoral" }, aulaSuggest: false, guidedNarr: null,
  playAulinha: vi.fn(), setShowClockTutorial: vi.fn(), sound: false, peekAgain: vi.fn(),
  setJourneyDone: vi.fn(), orderTaps: [], handleOrderTap: vi.fn(), orderShake: null,
  hiddenOpts: [], armedOpt: null, setArmedOpt: vi.fn(),
} as unknown as React.ComponentProps<typeof GameLoopExerciseRenderer>;

const acertou = (q: Question, valor: unknown) => (q.evaluate ? q.evaluate(valor as never) : valor === q.answer);

/** As evidências dos `handlePick` que avaliaram como acerto. */
function colher(chamadas: unknown[][], q: Question, destino: string[][]): void {
  for (const chamada of chamadas) {
    if (!acertou(q, chamada[0])) continue;
    destino.push(evidenciasDaResposta(chamada[2] as AnswerMeta | undefined, q));
  }
}

/**
 * Uma criança que SABE a resposta, respondendo pelo caminho que o palco oferece.
 *
 * Dois caminhos, nesta ordem: digitar (palco de campo, que só libera o
 * `CONFERIR` depois do número) e clicar (palco de barra). O primeiro que
 * produzir um acerto encerra a busca — o que interessa é a evidência que viajou
 * junto, não quantos caminhos existem.
 */
function evidenciasDeUmAcerto(q: Question): string[][] {
  const colhidas: string[][] = [];

  const handleDigitado = vi.fn();
  const digitado = render(<GameLoopExerciseRenderer {...casca} q={q} handlePick={handleDigitado} />);
  const campo = digitado.container.querySelector("input");
  if (campo && !(campo as HTMLInputElement).disabled) {
    fireEvent.change(campo, { target: { value: String(q.answer) } });
    fireEvent.keyDown(campo, { key: "Enter" });
    if (!handleDigitado.mock.calls.length) {
      for (const botao of [...digitado.container.querySelectorAll("button")]) {
        if ((botao as HTMLButtonElement).disabled) continue;
        fireEvent.click(botao);
        if (handleDigitado.mock.calls.length) break;
      }
    }
  }
  colher(handleDigitado.mock.calls, q, colhidas);
  const totalBotoes = digitado.container.querySelectorAll("button").length;
  digitado.unmount();
  if (colhidas.length) return colhidas;

  for (let indice = 0; indice < totalBotoes; indice += 1) {
    const handlePick = vi.fn();
    const { container, unmount } = render(<GameLoopExerciseRenderer {...casca} q={q} handlePick={handlePick} />);
    const botao = container.querySelectorAll("button")[indice] as HTMLButtonElement | undefined;
    if (botao && !botao.disabled) fireEvent.click(botao);
    colher(handlePick.mock.calls, q, colhidas);
    unmount();
    if (colhidas.length) break;
  }
  return colhidas;
}

interface ExigenciaAutoral {
  ficha: string;
  nivel: number;
  prefixo: string;
  minimo: number;
}

/** Toda exigência de diversidade cujo prefixo não é o de família da ficha. */
function exigenciasAutorais(): ExigenciaAutoral[] {
  const achadas: ExigenciaAutoral[] = [];
  for (const ficha of JOURNEY_FICHAS.filter(item => hasComposerFicha(item.id))) {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const regra = generateRegisteredFichaQuestion(ficha.id, nivel).masteryRule?.evidenciasDistintas;
      if (!regra || regra.prefixo === prefixoDeFamilia(ficha.id)) continue;
      achadas.push({ ficha: ficha.id, nivel, prefixo: regra.prefixo, minimo: regra.minimo });
    }
  }
  return achadas;
}

/** Máximo de questões sorteadas por nível na busca pela variedade. */
const SORTEIOS_POR_NIVEL = 12;

interface Busca {
  distintas: Set<string>;
  acertos: number;
}

/**
 * Procura, nos cinco níveis, a variedade que a exigência pede.
 *
 * Para assim que encontra: a afirmação é "existe caminho", e caminho encontrado
 * não precisa de mais amostra. Quando não existe, a busca paga o preço inteiro
 * — que é exatamente quando vale pagá-lo.
 */
function buscarVariedade(fichaId: string, prefixo: string, minimo: number): Busca {
  const busca: Busca = { distintas: new Set(), acertos: 0 };
  for (let nivel = 1; nivel <= 5; nivel += 1) {
    for (let sorteio = 0; sorteio < SORTEIOS_POR_NIVEL; sorteio += 1) {
      const q = generateRegisteredFichaQuestion(fichaId, nivel) as Question;
      for (const conjunto of evidenciasDeUmAcerto(q)) {
        busca.acertos += 1;
        for (const evidencia of conjunto) if (evidencia.startsWith(prefixo)) busca.distintas.add(evidencia);
      }
      if (busca.distintas.size >= minimo) return busca;
    }
  }
  return busca;
}

describe("CLASS-008 autoral — a diversidade de prefixo próprio nasce no palco", () => {
  it("toda exigência autoral tem caminho: o palco emite a variedade pedida", { timeout: 900000 }, () => {
    const exigencias = exigenciasAutorais();

    // Prova de vida: um gate que não achou exigência nenhuma passa calado, e
    // passar calado é o modo de falha que esta suíte existe para recusar.
    expect(
      exigencias.length,
      "nenhuma exigência de diversidade autoral encontrada — ou as fichas mudaram, ou a descoberta parou de observar",
    ).toBeGreaterThan(0);

    const semCaminho: string[] = [];
    const mudos: string[] = [];

    for (const exigencia of exigencias) {
      const busca = buscarVariedade(exigencia.ficha, exigencia.prefixo, exigencia.minimo);
      // O palco que não deixa a criança acertar não emite nada — e um conjunto
      // vazio por mudez pareceria idêntico a um conjunto vazio por falta de
      // variedade. Os dois são falhas, e são falhas diferentes.
      if (busca.acertos === 0) {
        mudos.push(`${exigencia.ficha} L${exigencia.nivel}: nenhuma resposta certa chegou ao GameLoop em ${SORTEIOS_POR_NIVEL * 5} sorteios`);
        continue;
      }
      if (busca.distintas.size < exigencia.minimo) {
        semCaminho.push(
          `${exigencia.ficha} L${exigencia.nivel} exige ${exigencia.minimo} evidências \`${exigencia.prefixo}*\` e o palco produziu ${busca.distintas.size} (${[...busca.distintas].join(", ") || "nenhuma"})`,
        );
      }
    }

    expect(mudos, `palcos que não deixaram a criança acertar:\n${mudos.join("\n")}`).toEqual([]);
    expect(semCaminho, `exigências de diversidade sem caminho no palco:\n${semCaminho.join("\n")}`).toEqual([]);
  });
});
