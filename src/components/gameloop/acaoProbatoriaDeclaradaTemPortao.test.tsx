// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { GameLoopExerciseRenderer } from "./GameLoopExerciseRenderer";
import { JOURNEY_FICHAS } from "../../curriculum/fichas";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "../../curriculum/motores/composerCanary";
import type { Question } from "../../types";

/**
 * D068 — a outra metade: onde a ficha DIZ que existe prova, a tela precisa ter.
 *
 * ## A metade que faltava
 *
 * `portaDeFora.test.tsx` descobre onde EXISTE portão — mede, nível a nível, se
 * o rótulo da resposta está na tela e se clicar nele no mount vende o acerto.
 * O que aquele inventário nunca conseguiu descobrir é onde DEVERIA existir,
 * porque isso não está na tela: está na intenção da ficha.
 *
 * `dominio.exige.evidencia` não servia, e a medição provou: nas 88 fichas que o
 * declaram, a evidência acompanha TODA resposta certa do nível — é condição do
 * item, não ação a executar.
 *
 * `niveis[n].acaoProbatoria` é a declaração que faltava, e este portão é o que a
 * torna vinculante. A direção da prova inverte: a ficha promete a porta, e a
 * medição vai cobrar que a porta exista.
 *
 * ## Por que a recíproca NÃO é cobrada, dito sem eufemismo
 *
 * Seria tentador exigir também o contrário — todo portão medido tem de estar
 * declarado —, e a medição mostra por que isso mentiria. Os pares do inventário
 * são de três espécies e o clique sozinho não as separa:
 *
 * | espécie | exemplo medido | como se apresenta |
 * |---|---|---|
 * | a barra recusa até a ação | `GE.09`, `GM.11`, `GE.07`, `N2.06`, `N4.02` | botão da resposta **desabilitado** no mount |
 * | o clique existe, mas significa outra coisa | `GE.04` | botão **habilitado**: o toque é a previsão, o experimento vem depois |
 * | o rótulo caiu fora do caminho de resposta | `AL.03\|3`, `N3.09\|4` | uma marca de reta, um dígito de teclado — coincidência de texto, não portão |
 *
 * Uma regra por "desabilitado no mount" acusaria a `AL.03` (marca de reta
 * desabilitada) e perderia a `GE.04` (portão real, botão habilitado). Erraria
 * nas duas direções. Forçar declaração na terceira espécie escreveria no cânone
 * uma prova que a criança não precisa fazer — pior que não declarar nada.
 *
 * Então a recíproca fica com o inventário de `portaDeFora`, que é catraca nos
 * dois sentidos sobre o que É medido, e este portão cobra o que é DECLARADO.
 * Juntos: nenhum portão some sem aviso, e nenhuma promessa de ficha fica sem
 * porta.
 */

const casca = {
  status: null, idx: 0, timeLeft: 0, promptDone: true,
  guidedIdx: null, mockTutorialN: null, tutShow: null, journeyDone: false, flashHidden: false,
  sel: null, totalQFor: () => 5, track: { id: "x" }, aulaSuggest: false, guidedNarr: null,
  playAulinha: vi.fn(), setShowClockTutorial: vi.fn(), sound: false, peekAgain: vi.fn(),
  setJourneyDone: vi.fn(), orderTaps: [], handleOrderTap: vi.fn(), orderShake: null,
  hiddenOpts: [], armedOpt: null, setArmedOpt: vi.fn(),
} as unknown as React.ComponentProps<typeof GameLoopExerciseRenderer>;

const SEMENTES = [0x2f6e2b1, 0x5bd1e99, 0x1a2b3c4];
const originalRandom = Math.random;
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}

const rotuloDaResposta = (q: Question): string => {
  const opcoes = q.options ?? [];
  const certa = opcoes.find(option => q.evaluate?.(option.value)) ?? opcoes.find(option => option.value === q.answer);
  return String(certa?.label ?? certa?.value ?? q.answer);
};

/** Algum clique no rótulo, sozinho e num render limpo, entrega o acerto? */
function vendeNoMount(q: Question): { naTela: number; vende: boolean } {
  const rotulo = rotuloDaResposta(q);
  const primeiro = render(<GameLoopExerciseRenderer {...casca} q={q} handlePick={vi.fn()} />);
  const indices = [...primeiro.container.querySelectorAll("button")]
    .map((botao, indice) => ({ botao, indice }))
    .filter(({ botao }) => (botao.textContent ?? "").trim() === rotulo)
    .map(({ indice }) => indice);
  primeiro.unmount();

  let vende = false;
  for (const indice of indices) {
    const handlePick = vi.fn();
    const { container, unmount } = render(<GameLoopExerciseRenderer {...casca} q={q} handlePick={handlePick} />);
    const botao = container.querySelectorAll("button")[indice] as HTMLButtonElement | undefined;
    if (botao && !botao.disabled) {
      fireEvent.click(botao);
      if (handlePick.mock.calls.some(chamada => (q.evaluate ? q.evaluate(chamada[0]) : chamada[0] === q.answer))) vende = true;
    }
    unmount();
  }
  return { naTela: indices.length, vende };
}

interface Declarada { chave: string; acao: string; porque: string }

function declaradas(): Declarada[] {
  const saida: Declarada[] = [];
  for (const ficha of JOURNEY_FICHAS.filter(item => hasComposerFicha(item.id))) {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const declarada = ficha.niveis?.[nivel]?.acaoProbatoria;
      if (!declarada) continue;
      saida.push({ chave: `${ficha.id}|${nivel}`, acao: declarada.id, porque: declarada.porque });
    }
  }
  return saida;
}

describe("D068 — ação probatória declarada na ficha tem portão na tela", () => {
  it("onde a ficha declara a prova, nenhum clique no mount compra o acerto", { timeout: 600000 }, () => {
    const semPorta: string[] = [];
    const semRotulo: string[] = [];
    let conferidos = 0;

    for (const { chave, acao } of declaradas()) {
      const [id, nivel] = chave.split("|");
      for (const semente of SEMENTES) {
        semear(semente);
        const q = generateRegisteredFichaQuestion(id, Number(nivel)) as Question;
        Math.random = originalRandom;
        const { naTela, vende } = vendeNoMount(q);
        conferidos += 1;
        // Sem rótulo na tela não há o que comprar — mas também não há o que
        // medir, e um nível que declara prova e nunca mostra a resposta é
        // suspeito o bastante para ser nomeado.
        if (!naTela) { semRotulo.push(`${chave} (semente ${semente.toString(16)})`); continue; }
        if (vende) semPorta.push(`${chave}: a ficha exige "${acao}" e um clique no mount já entrega o acerto`);
      }
    }

    expect(
      semPorta,
      ["Ficha promete prova e a tela não tem porta:", ...semPorta.map(linha => `  ${linha}`)].join("\n"),
    ).toEqual([]);
    expect(
      semRotulo,
      ["Nível declara ação probatória e a resposta nunca aparece na tela:", ...semRotulo.map(linha => `  ${linha}`)].join("\n"),
    ).toEqual([]);

    // Prova de vida: com nenhuma ficha declarando, "nenhuma porta aberta" e "não
    // olhei" seriam a mesma tela verde.
    expect(conferidos, "a varredura parou de conferir nível declarado").toBeGreaterThan(30);
  });

  it("cada declaração diz qual é a ação e por que responder sem ela não prova nada", () => {
    const todas = declaradas();
    expect(todas.length, "nenhuma ficha declara ação probatória: o campo virou letra morta").toBeGreaterThan(10);

    for (const { chave, acao, porque } of todas) {
      expect(acao.trim().length, `${chave}: ação sem nome`).toBeGreaterThan(2);
      expect(acao, `${chave}: a ação é um verbo em uma palavra, não uma frase`).toMatch(/^[a-zà-ú-]+$/);
      expect(porque.trim().length, `${chave}: sem justificativa — "porque sim" não é cânone`).toBeGreaterThan(40);
    }
  });
});
