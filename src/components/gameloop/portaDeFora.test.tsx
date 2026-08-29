// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { GameLoopExerciseRenderer } from "./GameLoopExerciseRenderer";
import { JOURNEY_FICHAS } from "../../curriculum/fichas";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "../../curriculum/motores/composerCanary";
import type { Question } from "../../types";

/**
 * CLASS-007 — o portão do palco não pode ter porta dos fundos.
 *
 * Os reparos desta frente fecharam as alternativas DENTRO do palco: o prisma
 * precisa estar construído, a transformação precisa ter acontecido, o
 * experimento precisa ter rodado. Só que a casca desenhava uma segunda barra de
 * alternativas por fora, e essa barra não conhecia portão nenhum: a criança que
 * ignorasse a ação encontrava o mesmo rótulo logo abaixo, habilitado.
 *
 * ### A dívida do D068, e o que dela foi paga aqui
 *
 * A primeira versão deste arquivo media a coisa certa com o instrumento errado:
 * três listas escritas à mão diziam quais palcos desenham, quais têm portão e
 * quais são de produção. Lista positiva decide participação — é exatamente o
 * que o D068 proíbe —, e um palco novo podia nascer com a porta aberta sem
 * nenhum teste ficar vermelho.
 *
 * A lista de portões foi substituída por medição. E a medição cobrou o preço na
 * hora: a lista escrita à mão já estava TRÊS entradas atrás — `AL.03` L3 e
 * `N2.06` L1 e L2 tinham portão e ninguém sabia.
 *
 * O que ainda não é descoberta está dito no fim do arquivo, sem eufemismo.
 */

const casca = {
  status: null, idx: 0, timeLeft: 0, promptDone: true,
  guidedIdx: null, mockTutorialN: null, tutShow: null, journeyDone: false, flashHidden: false,
  sel: null, totalQFor: () => 5, track: { id: "x" }, aulaSuggest: false, guidedNarr: null,
  playAulinha: vi.fn(), setShowClockTutorial: vi.fn(), sound: false, peekAgain: vi.fn(),
  setJourneyDone: vi.fn(), orderTaps: [], handleOrderTap: vi.fn(), orderShake: null,
  hiddenOpts: [], armedOpt: null, setArmedOpt: vi.fn(),
} as unknown as React.ComponentProps<typeof GameLoopExerciseRenderer>;

/**
 * Os `(ficha, nível)` em que o rótulo da resposta ESTÁ na tela e o clique nele,
 * no mount, não vende nada. É a assinatura de um portão: a alternativa existe,
 * a criança a vê, e ela só passa a valer depois da ação que a ficha prescreve.
 *
 * Isto não é lista de inclusão: é o resultado medido, com catraca nos dois
 * sentidos. Portão que sumir reprova nomeando a ficha — que é o defeito da
 * CLASS-007 voltando — e portão novo também, para que ninguém acrescente um
 * sem que o inventário registre.
 */
const PORTOES_MEDIDOS = [
  "AL.03|3",
  "GE.04|3", "GE.04|4",
  "GE.07|1", "GE.07|2", "GE.07|3", "GE.07|4", "GE.07|5",
  "GE.09|1", "GE.09|3", "GE.09|5",
  "GM.11|1", "GM.11|2", "GM.11|3", "GM.11|5",
  "N2.06|1", "N2.06|2",
  // A conta armada: o teclado tem o dígito da resposta, e tocá-lo sozinho não
  // envia nada — a criança ainda precisa montar a coluna. Só apareceu depois de
  // a varredura ganhar sementes fixas; com uma amostra ao acaso por nível, ele
  // entrava e saía do inventário entre execuções.
  "N3.09|4",
  // N4.02/F98: a partir de L2 o arranjo exige o giro antes de responder — é o
  // reparo da CLASS-007 desta ficha, e ele aparece aqui assim que ela entra na
  // varredura. Um portão que nasce junto com a promoção é o resultado certo.
  "N4.02|3",
];

/**
 * Palcos de PRODUÇÃO: a criança fabrica a resposta, e nenhum botão a carrega.
 *
 * Os `options` destas questões existem para o Radar — são nomes de erro, não
 * alternativas. A barra da casca os desenhava assim mesmo, e o rótulo certo era
 * clicável: em `N4.12` bastava tocar em "quociente ajustado" para vencer os
 * cinco níveis sem estimar nada.
 *
 * A prova aqui é pela ausência, e ausência é fácil de conseguir quebrando o
 * palco — então o teste também cobra que o botão de confirmar exista.
 */
const PALCOS_DE_PRODUCAO: Array<[string, number[], string]> = [
  ["N4.12", [1, 2, 3, 4, 5], "Confirmar esta estimativa"],
  ["GE.10", [3], "Conferir reconstrução"],
  ["GE.10", [5], "Conferir três vistas"],
];

/**
 * Sementes fixas para o inventário.
 *
 * Sem elas a varredura media uma amostra ao acaso por nível, e um palco como o
 * `vertical` de `N3.09` ora desenhava o rótulo da resposta num botão, ora não —
 * o inventário aparecia e sumia entre execuções. Inventário que muda sozinho
 * não é catraca, é ruído.
 */
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

/**
 * O rótulo está na tela? Algum clique nele, sozinho e no mount, vende o acerto?
 *
 * Cada candidato é clicado num render limpo: o primeiro clique pode desabilitar
 * a tela inteira, e reaproveitar o render diria que a porta está fechada
 * justamente onde ela acabou de ser usada.
 */
function medirPorta(q: Question): { naTela: number; vende: boolean } {
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

function montar(id: string, nivel: number) {
  const q = generateRegisteredFichaQuestion(id, nivel) as Question;
  const view = render(<GameLoopExerciseRenderer {...casca} q={q} handlePick={vi.fn()} />);
  return { q, view };
}

describe("CLASS-007 na casca — o portão do palco não pode ter porta dos fundos", () => {
  it("o inventário de portões é o medido, e nenhum portão some", { timeout: 600000 }, () => {
    const medidos: string[] = [];
    let comRotuloNaTela = 0;
    for (const ficha of JOURNEY_FICHAS.filter(item => hasComposerFicha(item.id))) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        // Um portão só conta como portão se estiver fechado em TODA semente em
        // que o rótulo apareceu. Vender numa delas já é porta aberta.
        let apareceu = false;
        let vendeuAlguma = false;
        for (const semente of SEMENTES) {
          semear(semente);
          const q = generateRegisteredFichaQuestion(ficha.id, nivel) as Question;
          Math.random = originalRandom;
          const { naTela, vende } = medirPorta(q);
          if (!naTela) continue;
          apareceu = true;
          if (vende) vendeuAlguma = true;
        }
        if (!apareceu) continue;
        comRotuloNaTela += 1;
        if (!vendeuAlguma) medidos.push(`${ficha.id}|${nivel}`);
      }
    }

    const sumiram = PORTOES_MEDIDOS.filter(chave => !medidos.includes(chave)).sort();
    const novos = medidos.filter(chave => !PORTOES_MEDIDOS.includes(chave)).sort();

    expect(sumiram, `portões que desapareceram — a ação voltou a ser contornável:\n${sumiram.join("\n")}`).toEqual([]);
    expect(novos, `portões novos, não inventariados — registre-os:\n${novos.join("\n")}`).toEqual([]);

    // Prova de vida: se a medição parasse de ver rótulo na tela, "nenhum portão
    // sumiu" passaria a significar "não olhei", e o gate ficaria verde calado.
    expect(comRotuloNaTela, "a varredura parou de enxergar o rótulo da resposta na tela").toBeGreaterThan(200);
  });

  it("onde a criança produz a resposta, nenhum botão a entrega — e o caminho existe", () => {
    for (const [id, niveis, confirmar] of PALCOS_DE_PRODUCAO) {
      for (const nivel of niveis) {
        const { q, view } = montar(id, nivel);
        const comORotulo = [...view.container.querySelectorAll("button")]
          .filter(botao => botao.textContent?.trim() === rotuloDaResposta(q));
        expect(comORotulo.length, `${id} L${nivel}: o rótulo da resposta está clicável`).toBe(0);
        const caminho = [...view.container.querySelectorAll("button")]
          .filter(botao => botao.textContent?.trim() === confirmar);
        expect(caminho.length, `${id} L${nivel} ficou sem "${confirmar}"`).toBeGreaterThan(0);
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

/**
 * ### O que ainda NÃO é descoberta, dito sem eufemismo
 *
 * O inventário acima descobre onde EXISTE portão. Ele não descobre onde
 * DEVERIA existir: para isso seria preciso a ficha declarar, de forma legível
 * por máquina, qual interação ela trata como probatória. Hoje o que mais se
 * aproxima é `micro.dominio.exige.evidencia`, e ele significa outra coisa — a
 * medição em `evidenciaExigidaNaoSeCompra.test.tsx` mostra que, nas 88 fichas
 * que o declaram, a evidência acompanha TODA resposta certa do nível: é uma
 * condição do item, não uma ação a executar.
 *
 * Declarar a ação probatória é decisão de cânone e não se toma por conta
 * própria. Até lá, a catraca acima é o que impede um portão de sumir sem que
 * alguém seja avisado.
 */
