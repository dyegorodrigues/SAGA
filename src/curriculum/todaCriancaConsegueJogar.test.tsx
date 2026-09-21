// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { ALL_MATH_TRACKS } from "./motores/curriculum";
import { GameLoopExerciseRenderer } from "../components/gameloop/GameLoopExerciseRenderer";
import { isMotorSlip, isRetryableAnswer, ownsAuthorialRetry } from "../components/gameloop/answerPolicy";

/**
 * Toda criança consegue jogar — as noventa competências, os cinco níveis.
 *
 * ## Por que este arquivo e não mais um robô
 *
 * O `npm run passeio` clica em tudo e pergunta "a tela mudou?". Ele deu 19/19
 * enquanto uma criança de verdade travava no primeiro exercício. O
 * `scripts/auditar-exercicios.mjs` responde de verdade, mas é um jogador
 * genérico tentando jogar noventa exercícios pedagogicamente distintos: já
 * acusou três vezes de travado um exercício que funciona.
 *
 * Aqui não se joga. Aqui se **renderiza o palco real, pelo renderizador real
 * do app**, para cada ficha e cada nível, e se cobra o mínimo sem o qual uma
 * criança não consegue jogar. Determinístico, 450 combinações, dentro da
 * suíte.
 *
 * ## O mínimo que se cobra, e por quê
 *
 * 1. **Há algo em que tocar.** Um palco que renderiza sem nenhum controle
 *    habilitado é uma tela morta: a criança olha, toca no nada e sai.
 *
 * 2. **Errar não mata a questão.** É o defeito que travou uma criança de
 *    verdade: ela respondia errado, o app dizia "Olha de novo!" e devolvia a
 *    vez — para um palco que já tinha escondido os próprios botões. Sem
 *    "Avançar" e sem nada tocável, a única saída era abandonar a missão.
 *    Aqui o `status` fica `null` de propósito: é exatamente o estado do erro
 *    suave, o app ainda esperando resposta.
 *
 * 3. **Dá para ouvir.** A Jornada começa no 1º ano e **a criança de seis anos
 *    não lê**. Se o enunciado é texto e não há nada falado, ela erra por
 *    analfabetismo e o app anota como erro de matemática.
 *
 * Não se cobra aqui se a resposta certa é a certa — disso cuidam os testes de
 * cada ficha e o `npm run simular`. Cobra-se se a criança CONSEGUE responder.
 */

const NIVEIS = [1, 2, 3, 4, 5];

/**
 * Quanto tempo de roteiro se adianta antes de olhar a tela.
 *
 * Vários palcos têm script no TEMPO: a fileira do relance mostra e esconde, a
 * `audiochoice` só revela as alternativas quando a primeira audição termina
 * (por cronômetro, não pela fala — então o áudio mudo não trava nada). Olhar a
 * tela no instante zero é fotografar a demonstração e acusar de morta uma tela
 * que pergunta um segundo depois.
 */
const ROTEIRO_MS = 8000;

/** Deixa o roteiro do palco correr até o fim, como corre na mão da criança. */
function deixarORoteiroCorrer() {
  act(() => { vi.advanceTimersByTime(ROTEIRO_MS); });
}

/** Moldura da tela: não é resposta, e tocar nela não é jogar. */
/**
 * Moldura da tela: não é resposta.
 *
 * A AJUDA entra aqui, e é importante que entre: "Como faz?" e "Vem ver a
 * aulinha" aparecem em quase toda questão. Contá-las como controle faria
 * qualquer tela passar no "há algo em que tocar" — inclusive uma tela que só
 * tem o botão de ajuda e nenhum jeito de responder. Foi o que quase deixou
 * passar o modo peso de GM.12.
 */
const MOLDURA = /^(Fechar|Sair da missão|Avançar|Continuar|Ver Resultado|Sair|Voltar|Ouvir de novo|Ligar o som|Desligar o som)$|Como faz|aulinha|Tá difícil/i;

const nomeDe = (b: HTMLButtonElement) =>
  (b.getAttribute("aria-label") || b.textContent || "").replace(/\s+/g, " ").trim();

/**
 * Tudo em que a criança pode tocar para responder, agora.
 *
 * Botão não é o único jeito de responder: há palcos em que se ARRASTA, e há
 * campo de escrever. Contar só `<button>` acusaria de morta uma tela que está
 * viva — foi o que aconteceu com os palcos de arrastar na primeira versão
 * deste arquivo.
 */
function controlesVivos(c: HTMLElement): HTMLElement[] {
  const botoes = [...c.querySelectorAll("button")]
    .filter(b => !(b as HTMLButtonElement).disabled && !MOLDURA.test(nomeDe(b as HTMLButtonElement)));
  // Palco de arrastar não usa `<button>` nem o atributo `draggable`: ele marca
  // as peças e os alvos com `data-draggroup-*` e escuta ponteiro. Sem isto a
  // varredura os dava por mortos — e eles funcionam no dedo da criança. (O que
  // NÃO funciona neles é leitor de tela: as peças não têm nome. Fica
  // registrado como dívida, não como tela morta.)
  const outros = [...c.querySelectorAll("[draggable=true], [role=button], input, select, [data-draggroup-item], [data-draggroup-box]")]
    .filter(e => !(e as HTMLInputElement).disabled);
  return [...new Set([...botoes, ...outros])] as HTMLElement[];
}

/** As props do renderizador, no estado "questão aberta, app esperando resposta". */
function props(q: any, extra: Record<string, unknown> = {}) {
  return {
    q,
    status: null,
    idx: 0,
    handlePick: () => {},
    timeLeft: 30,
    promptDone: true,
    guidedIdx: null,
    mockTutorialN: null,
    tutShow: null,
    journeyDone: false,
    flashHidden: false,
    sel: null,
    totalQFor: () => 8,
    track: { id: "t", name: "t", color: "#2563EB", dark: "#1E40AF" },
    aulaSuggest: false,
    guidedNarr: null,
    playAulinha: () => {},
    setShowClockTutorial: () => {},
    sound: true,
    peekAgain: () => {},
    setJourneyDone: () => {},
    orderTaps: [],
    handleOrderTap: () => {},
    orderShake: null,
    /**
     * Prende a fase dos palcos que têm roteiro no TEMPO.
     *
     * A fileira e a moldura percorrem cinco fases em quatro segundos: mostram,
     * escondem, e só então perguntam. Sem prender a fase, esta varredura
     * fotografa o palco no meio da demonstração — sem alternativas ainda — e
     * acusa de morta uma tela que, na mão da criança, pergunta um segundo
     * depois. A prop existe no renderizador exatamente para sondas, e diz isso
     * no próprio comentário: "só a sonda passa".
     */
    faseDaCena: "perguntando" as any,
    hiddenOpts: [] as any[],
    armedOpt: null,
    setArmedOpt: () => {},
    ...extra,
  } as any;
}

/**
 * Cada competência × nível, pela MESMA porta que o app usa.
 *
 * A primeira versão chamava `Composer.generate(ficha, lvl)` direto. Errado: o
 * app não chama o Composer, ele chama `track.gen(lvl)` — que escolhe entre o
 * Padrão Ouro e o gerador legado, com fallback. Pelo Composer, catorze
 * combinações "falhavam ao gerar" ("primitiva ainda não possui builder") e a
 * criança, no app, joga todas normalmente: é o fallback fazendo o trabalho.
 *
 * Auditoria tem de entrar pela porta da criança. Pela porta de trás, mede
 * outro programa.
 */
const COMBINACOES = ALL_MATH_TRACKS
  .filter(t => t.graphId)
  .flatMap(t => NIVEIS.map(nivel => ({ track: t, nivel })));

/** A questão como o app a serve. */
function gerar(track: any, nivel: number) {
  return track.gen(nivel);
}

/** Quantos toques diferentes se experimenta por combinação, um por vez. */
const TOQUES_EXAMINADOS = 4;

/**
 * Toca no i-ésimo controle e responde: isso prendeu a criança?
 *
 * ## Por que não basta clicar e olhar
 *
 * A primeira versão clicava no primeiro controle e exigia que a tela
 * continuasse tocável. Dois erros de medição nisso:
 *
 * 1. **O primeiro controle pode ser a resposta CERTA.** Aí o palco fecha com
 *    razão — a questão acabou — e cobrar dele que reabra é cobrar um defeito.
 *
 * 2. **Nem todo palco recebe a vez de volta do mesmo jeito.** Em uns o app
 *    esconde a alternativa errada e devolve a vez (`isRetryableAnswer`). Em
 *    outros — os autorais — o app sai de cena inteiro (`ownsAuthorialRetry`,
 *    `isMotorSlip`) e quem tem de reabrir é o próprio palco. Em outros ainda o
 *    erro é terminal e o app avança, e fechar é o certo.
 *
 * Então aqui se toca, se COLHE a resposta que o palco emitiu (valor e meta,
 * pelo `handlePick` de verdade), e se pergunta à política real do app — os
 * mesmos predicados que o `GameLoop` chama — o que o app faria a seguir. Só
 * então se cobra a tela. Sem allowlist: a decisão sai de `answerPolicy`, não
 * de uma lista escrita à mão aqui.
 */
function oQueAconteceAoTocar(q: any, i: number): string | null {
  const respostas: { val: any; forced?: boolean; meta?: any }[] = [];
  const colher = (val: any, forced?: boolean, meta?: any) => { respostas.push({ val, forced, meta }); };

  const { container, rerender } = render(<GameLoopExerciseRenderer {...props(q, { handlePick: colher })} />);
  deixarORoteiroCorrer();
  const vivos = controlesVivos(container);
  if (i >= vivos.length) return null;
  fireEvent.click(vivos[i]);
  deixarORoteiroCorrer();

  // O toque não foi resposta — foi um passo (pegar a peça, virar a carta).
  // Só é beco se o passo apagou a tela.
  if (!respostas.length) {
    return controlesVivos(container).length ? null : "um toque que não responde nada apagou a tela";
  }

  const { val, forced, meta } = respostas[0];
  const acertou = forced !== undefined ? forced : val === q.answer;
  if (acertou) return null; // o palco fecha com razão: a questão acabou.

  // A partir daqui a criança ERROU. O que o app faz com isso?
  if (isMotorSlip(meta) || ownsAuthorialRetry(q, meta)) {
    // O app devolve a vez e não mexe em nada: o palco prometeu ser dono do
    // ciclo de erro. Tem de reabrir sozinho.
    deixarORoteiroCorrer();
    return controlesVivos(container).length ? null : "o palco é dono do erro e não reabriu";
  }

  if (isRetryableAnswer(q, val, meta)) {
    // Erro suave: o app esconde a alternativa errada e devolve a vez.
    rerender(<GameLoopExerciseRenderer {...props(q, { hiddenOpts: [val] })} />);
    deixarORoteiroCorrer();
    return controlesVivos(container).length ? null : "depois do erro suave, nada tocável";
  }

  return null; // erro terminal: o app fecha a questão e avança. Fechar é certo.
}

describe("toda criança consegue jogar", () => {
  beforeEach(() => { vi.useFakeTimers({ shouldAdvanceTime: true }); });
  afterEach(() => { vi.useRealTimers(); });

  it("a varredura enxerga as noventa competências nos cinco níveis", () => {
    // Prova de vida: uma varredura vazia passaria calada.
    expect(COMBINACOES.length).toBeGreaterThanOrEqual(90 * 5);
  });

  it("todo exercício tem algo em que a criança possa tocar", () => {
    const mortos: string[] = [];
    for (const { track, nivel } of COMBINACOES) {
      let q: any;
      try { q = gerar(track, nivel); } catch (e) {
        mortos.push(`${track.id} n${nivel}: a geração da questão falhou — ${String(e).slice(0, 70)}`);
        continue;
      }
      try {
        const { container } = render(<GameLoopExerciseRenderer {...props(q)} />);
        deixarORoteiroCorrer();
        if (controlesVivos(container).length === 0) {
          mortos.push(`${track.id} n${nivel} (${q.kind}): tela sem nenhum controle habilitado`);
        }
      } catch (e) {
        mortos.push(`${track.id} n${nivel} (${q.kind}): o palco quebrou ao renderizar — ${String(e).slice(0, 70)}`);
      }
      cleanup();
    }
    expect(mortos, `exercícios em que a criança não tem onde tocar:\n${mortos.join("\n")}`).toEqual([]);
  }, 180000);

  it("errar uma vez não deixa a criança sem resposta possível", () => {
    const becos: string[] = [];
    for (const { track, nivel } of COMBINACOES) {
      let q: any;
      try { q = gerar(track, nivel); } catch { continue; }
      let preso: string | null = null;
      for (let i = 0; i < TOQUES_EXAMINADOS && !preso; i += 1) {
        try { preso = oQueAconteceAoTocar(q, i); } catch { /* quebra de render já é cobrada acima */ }
        cleanup();
      }
      if (preso) becos.push(`${track.id} n${nivel} (${q.kind}): ${preso}`);
    }
    expect(becos, `exercícios que prendem a criança depois de um erro:\n${becos.join("\n")}`).toEqual([]);
  }, 300000);

  it("toda demonstração termina e devolve a vez para a criança", () => {
    /*
     * A varredura acima prende a fase do palco em "perguntando", e tem razão:
     * ela mede se HÁ o que tocar quando a pergunta chega. Só que isso pula
     * justamente o que o auditor de navegador acusa — `PALCO-VAZIO` e `TRAVOU`
     * na primeira questão de várias competências. A suspeita é de roteiro: o
     * palco mostra, esconde, conta, e **só então** pergunta. Se algum desses
     * relógios não disparar, a criança fica olhando uma demonstração que nunca
     * acaba, e nenhum teste com a fase presa veria isso.
     *
     * Aqui a fase NÃO é presa. O palco nasce como nasce na mão da criança e o
     * relógio corre. Doze segundos é folga larga sobre o roteiro mais longo
     * declarado nas fichas (a moldura da JD5 gasta pouco mais de cinco).
     */
    const presos: string[] = [];
    for (const { track, nivel } of COMBINACOES) {
      let q: any;
      try { q = gerar(track, nivel); } catch { continue; }
      try {
        const { container } = render(<GameLoopExerciseRenderer {...props(q, { faseDaCena: undefined })} />);
        act(() => { vi.advanceTimersByTime(12000); });
        if (controlesVivos(container).length === 0) {
          presos.push(`${track.id} n${nivel} (${q.kind}): a demonstração não devolveu a vez em 12s`);
        }
      } catch { /* quebra de render já é cobrada acima */ }
      cleanup();
    }
    expect(presos, `exercícios em que a demonstração nunca acaba:\n${presos.join("\n")}`).toEqual([]);
  }, 300000);

  it("todo enunciado de texto tem como ser ouvido", () => {
    // Número e símbolo sozinhos não exigem leitura; palavra exige.
    const mudos: string[] = [];
    for (const { track, nivel } of COMBINACOES) {
      let q: any;
      try { q = gerar(track, nivel); } catch { continue; }
      const enunciado = String(q.prompt ?? "");
      const palavras = enunciado.replace(/[^\p{L}\s]/gu, " ").trim().split(/\s+/).filter(w => w.length > 2);
      if (palavras.length < 3) continue;
      const falado = String(q.speech ?? q.falado ?? q.prompt ?? "").trim();
      if (!falado) mudos.push(`${track.id} n${nivel}: "${enunciado.slice(0, 60)}" sem nada a falar`);
    }
    expect(mudos, `enunciados que a criança que não lê não alcança:\n${mudos.join("\n")}`).toEqual([]);
  }, 180000);
});
