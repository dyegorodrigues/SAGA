// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chaveDaFala, textoFalado } from "./chaveDaFala";

/**
 * O corpus da voz — tudo que o app pode dizer em voz alta.
 *
 * ## Por que existe
 *
 * O SAGA falava só pelo `speechSynthesis` do aparelho. Num celular sem voz
 * pt-BR instalada não sai som nenhum, e o app não tem como saber: a criança de
 * seis anos, que NÃO LÊ, fica diante de um enunciado escrito e erra por
 * analfabetismo. O pai relatou exatamente isso — "o áudio eu não consegui
 * testar ali através do link, não dá nem para saber".
 *
 * A saída é levar a voz junto: áudio gerado antes, versionado no repositório,
 * tocado como arquivo. Para gerar é preciso saber o que o app fala — e é isto
 * que este arquivo mede.
 *
 * ## Como mede
 *
 * Não por lista escrita à mão (D068): varre as noventa competências nos cinco
 * níveis pela porta do app (`track.gen`), colhe os campos falados da questão e
 * RENDERIZA o palco real, interceptando o `speak` para capturar também o que só
 * existe quando a criança toca — o elogio, o erro suave, a contagem em voz alta.
 *
 * ## O que é cobrado
 *
 * Só as falas SEM NÚMERO. São as fixas: instrução, elogio, erro suave, aula.
 * Uma fala nova dessas sem áudio gravado reprova aqui, e é o que se quer: é a
 * fala que toda criança ouve em toda missão.
 *
 * As falas com número variam com o sorteio e não fecham em conjunto finito.
 * O pacote cobre as que a varredura encontrou e o app cai na voz do aparelho
 * para o resto — o relatório abaixo diz quantas são, sem reprovar.
 *
 * Para regravar depois de mudar uma fala:
 *   ATUALIZAR_CORPUS=1 npx vitest run src/audio/corpusDaVoz.test.tsx
 *   npm run vozes
 */

const FALAS: string[] = [];
vi.mock("../components/Mascot", async (original) => {
  const real = await original<Record<string, unknown>>();
  return { ...real, speak: (t: string) => { FALAS.push(String(t)); } };
});

import { ALL_MATH_TRACKS } from "../curriculum/motores/curriculum";
import { GameLoopExerciseRenderer } from "../components/gameloop/GameLoopExerciseRenderer";

const CAMINHO = resolve(__dirname, "corpus-da-voz.json");
const INDICE = resolve(__dirname, "..", "..", "public", "vozes", "indice.json");
const NIVEIS = [1, 2, 3, 4, 5];
/**
 * Sorteios por nível.
 *
 * Três bastam para o portão: as falas FIXAS não dependem do sorteio. Ao
 * regravar o pacote vale subir (`SORTEIOS=40`), porque aí o que se quer é
 * saturar as falas que variam — os objetos sorteados, as posições, os nomes.
 */
const SORTEIOS = Number(process.env.SORTEIOS ?? 60);

function props(q: unknown): any {
  return {
    q, status: null, idx: 0, handlePick: () => {}, timeLeft: 30, promptDone: true, guidedIdx: null,
    mockTutorialN: null, tutShow: null, journeyDone: false, flashHidden: false, sel: null, totalQFor: () => 8,
    track: { id: "t", name: "t", color: "#2563EB", dark: "#1E40AF" }, aulaSuggest: false, guidedNarr: null,
    playAulinha: () => {}, setShowClockTutorial: () => {}, sound: true, peekAgain: () => {}, setJourneyDone: () => {},
    orderTaps: [], handleOrderTap: () => {}, orderShake: null, faseDaCena: "perguntando",
    hiddenOpts: [] as unknown[], armedOpt: null, setArmedOpt: () => {},
  };
}

const SELETOR = "button, [role=button], input, select, [data-draggroup-item], [data-draggroup-box]";
const vivos = (c: HTMLElement) => [...c.querySelectorAll(SELETOR)].filter(e => !(e as HTMLButtonElement).disabled) as HTMLElement[];

/** Tudo que o app pode falar, colhido do programa e não de uma lista. */
function varrer(): string[] {
  const achadas: string[] = [];
  const guardar = (t: unknown) => {
    if (typeof t !== "string") return;
    const limpo = textoFalado(t);
    if (limpo) achadas.push(limpo);
  };
  for (const track of ALL_MATH_TRACKS) {
    if (!track.graphId) continue;
    for (const nivel of NIVEIS) {
      for (let sorteio = 0; sorteio < SORTEIOS; sorteio += 1) {
        let q: Record<string, unknown>;
        try { q = track.gen(nivel) as never; } catch { continue; }
        const ui = q.uiProps as Record<string, unknown> | undefined;
        /*
         * O `qSpeech` do GameLoop monta a narração juntando pedaços com
         * " ... ": enunciado, som-alvo e o "como faz". O `AudioPlayer` fala
         * cada pedaço separado — então é cada PEDAÇO que precisa de áudio, e
         * não a junção (que é combinatória e nunca fecharia).
         */
        [q.prompt, q.audioPrompt, q.speech, q.falado, q.explain, q.howto, q.sayTarget, q.story, ui?.falado, ui?.enunciado].forEach(guardar);
        if (Array.isArray(q.audioSteps)) q.audioSteps.forEach(guardar);
        // Renderizar é caro; um sorteio por nível basta para as falas de palco,
        // que não dependem do sorteio e sim do toque.
        if (sorteio > 0) continue;
        try {
          const { container } = render(<GameLoopExerciseRenderer {...props(q)} />);
          act(() => { vi.advanceTimersByTime(8000); });
          for (let i = 0; i < 3; i += 1) {
            const controles = vivos(container);
            if (!controles[i]) break;
            fireEvent.click(controles[i]);
            act(() => { vi.advanceTimersByTime(4000); });
          }
        } catch { /* palco que quebra é cobrado em todaCriancaConsegueJogar */ }
        cleanup();
      }
    }
  }
  FALAS.forEach(guardar);
  return [...new Set(achadas)].sort();
}

const temNumero = (t: string) => /\d/.test(t);

describe("o corpus da voz", () => {
  beforeEach(() => { vi.useFakeTimers({ shouldAdvanceTime: true }); });
  afterEach(() => { vi.useRealTimers(); });

  it("cobre toda fala fixa que o app pode dizer", () => {
    const encontradas = varrer();

    if (process.env.ATUALIZAR_CORPUS === "1") {
      /*
       * O corpus é o que vai virar áudio, e tem dono: o tamanho do pacote.
       *
       * - **Toda fala sem número entra.** São as fixas — instrução, elogio,
       *   erro suave, aula —, as que toda criança ouve em toda missão. São
       *   poucas centenas e não crescem com o sorteio.
       * - **Fala com número entra só se já estiver gravada.** Elas variam com
       *   o sorteio e não fecham: saturar a varredura levou de 745 para mais
       *   de cinco mil, o que seriam sessenta megabytes de áudio no
       *   repositório. As que já existem ficam (apagar áudio bom é perda), as
       *   novas caem na voz do aparelho.
       *
       * Esta é a fronteira honesta do pacote, e está escrita aqui para não
       * virar folclore: quem aumentar o limite decide conscientemente pagar
       * o tamanho.
       */
      const jaGravadas = new Set<string>(
        existsSync(INDICE) ? (JSON.parse(readFileSync(INDICE, "utf8")) as string[]) : [],
      );
      const anterior: string[] = JSON.parse(readFileSync(CAMINHO, "utf8"));
      const manter = (t: string) => !temNumero(t) || jaGravadas.has(chaveDaFala(t));
      const unido = [...new Set([...anterior, ...encontradas])].filter(manter).sort();
      writeFileSync(CAMINHO, JSON.stringify(unido, null, 1) + "\n");
      return;
    }

    const corpus = new Set<string>(JSON.parse(readFileSync(CAMINHO, "utf8")));
    const fixas = encontradas.filter(t => !temNumero(t));
    const faltando = fixas.filter(t => !corpus.has(t));

    /*
     * Por que uma tolerância, e por que ela é pequena.
     *
     * As falas fixas não são um conjunto fechado pequeno: várias nascem de
     * molde mais banco de palavras ("Coloque {o urso} {embaixo da mesa}!"),
     * e o produto dos bancos tem cauda longa. Vinte varreduras acumuladas
     * cobrem o corpus inteiro; uma varredura nova ainda pode cair numa
     * combinação inédita. Reprovar por isso seria um portão que pisca sozinho.
     *
     * A tolerância é três porque é o que a cauda produz. Uma fala fixa NOVA de
     * verdade — um elogio novo, uma instrução nova — aparece em quase toda
     * combinação da ficha que a diz, e estoura a tolerância na primeira
     * rodada. O que a cauda produz são variantes de molde já gravado.
     *
     * E o preço de uma fala fora do pacote não é silêncio: é a voz do
     * aparelho, que era o único caminho antes. Pior, não quebrado.
     */
    const TOLERANCIA = 3;
    const cobertura = fixas.length ? (fixas.length - faltando.length) / fixas.length : 1;

    expect(
      faltando.length <= TOLERANCIA && cobertura >= 0.99,
      [
        `Falas fixas fora do pacote: ${faltando.length} de ${fixas.length} (cobertura ${(cobertura * 100).toFixed(1)}%).`,
        ...faltando.map(t => `  ${JSON.stringify(t.slice(0, 90))}`),
        "",
        "Rode: ATUALIZAR_CORPUS=1 npx vitest run src/audio/corpusDaVoz.test.tsx && npm run vozes",
      ].join("\n"),
    ).toBe(true);
  }, 600000);

  it("o corpus não está vazio nem encolheu para um punhado", () => {
    // Prova de vida: um corpus vazio faria o teste acima passar calado.
    const corpus: string[] = JSON.parse(readFileSync(CAMINHO, "utf8"));
    expect(corpus.length).toBeGreaterThan(500);
    expect(corpus.filter(t => !temNumero(t)).length).toBeGreaterThan(300);
  });
});
