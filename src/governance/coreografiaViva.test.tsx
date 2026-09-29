// @vitest-environment jsdom
import React from "react";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { ALL_MATH_TRACKS } from "../curriculum/motores/curriculum";
import { GameLoopExerciseRenderer } from "../components/gameloop/GameLoopExerciseRenderer";

/**
 * Catraca da coreografia viva — a micro-aula que promete e não faz.
 *
 * ## O defeito que este arquivo existe para enxergar
 *
 * O pai reclamou três vezes da mesma coisa, com palavras diferentes:
 *
 * > *"o como faz é bugado, não aparece indo a banana pro macaco"*
 * > *"O do balão ali de estourar também tá bugado como faz"*
 * > *"ele não tem a coreografia correta, ele muda, pisca, muda"*
 *
 * Três exercícios diferentes, e o mesmo defeito nos três: **a aula narrava
 * uma ação que a tela não executava.** A voz dizia "vou estourar um" e o
 * balão ficava inteiro; dizia "este é vermelho, entra" e o laço ficava vazio.
 * Para uma criança que não lê, a aula É a tela — se a tela não muda, não
 * houve aula.
 *
 * Eu não conseguia ver porque toda sonda que eu tinha tirava UMA foto. Foto
 * não pega ausência de movimento entre dois passos de um roteiro.
 *
 * ## Como se mede
 *
 * Renderiza-se o palco REAL, pelo renderizador real do app, uma vez por passo
 * declarado na coreografia da ficha, e compara-se o HTML de passos
 * consecutivos. Passo que renderiza idêntico ao anterior é passo que não
 * aconteceu. Varre as 90 competências × 5 níveis — descoberta, nunca lista.
 *
 * ## O que a catraca cobra
 *
 * Não se cobra zero: a dívida medida é grande e antiga, e inventar coreografia
 * para 200 passos sem a ficha na mão seria pior do que a dívida. Cobra-se que
 * ela **não cresça**, e que nenhum passo hoje vivo volte a morrer. Cada aula
 * consertada baixa o piso — e o piso nunca sobe.
 *
 * ## Onde esta sonda é cega, dito antes que alguém confie demais
 *
 * 1. **Efeito medido em pixel.** Animação que depende de `getBoundingClientRect`
 *    não roda no jsdom, onde todo retângulo é zero. A trajetória da mão
 *    fantasma do pareamento é assim. Ela pode acusar de morto um passo que se
 *    mexe no aparelho.
 * 2. **Efeito só no tempo.** Compara-se um instante por passo; algo que só
 *    existe durante a transição passa batido.
 *
 * As duas cegueiras erram para o mesmo lado — acusar de morto o que vive —,
 * então o número é TETO da dívida, não piso. Ele nunca esconde defeito.
 *
 * 3. **Ela cobra que ALGO mude, não que mude o CERTO.** Testada por mutação:
 *    tirar só o estouro do balão e deixar o numeral aparecendo não a derruba —
 *    a tela mudou, ainda que pela metade. Tirar os dois derruba, e ela aponta
 *    `N1.02 n1 p2`. É piso de vida, não prova de coreografia: quem garante que
 *    o balão estoura é o portão da própria ficha, em `TouchCount.test.tsx`.
 */

const CAMINHO = resolve(__dirname, "coreografia-viva.baseline.json");
const NIVEIS = [1, 2, 3, 4, 5];

/**
 * As sementes, e por que mais de uma.
 *
 * `track.gen` sorteia. Sem semente esta catraca oscilava entre execuções e
 * acusava passos diferentes a cada rodada — catraca que treme não é catraca.
 * E com UMA semente só ela veria uma questão de cada ficha, quando a aula
 * pode morrer só no arranjo que a outra semente produz.
 *
 * Um passo entra na dívida quando morre em TODAS as sementes: morrer numa e
 * viver noutra é defeito de sorteio, não de coreografia, e vai para a mesma
 * conta só depois de alguém olhar.
 */
const SEMENTES = [0x2f6e2b1, 0x5bd1e99, 0x1a2b3c4];
const sorteioOriginal = Math.random;
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}

/**
 * O `transform` sai; todo o resto do `style` fica.
 *
 * A primeira versão desta sonda apagava `style="..."` inteiro para fugir do
 * ruído do framer-motion, e com isso ficava cega justamente para o que uma
 * micro-aula faz: acender um laço, apagar um balão, destacar uma peça. Medir
 * removendo o que se quer medir não é medir.
 */
const limpar = (html: string) => html
  .replace(/transform: [^;"]*;?/g, "")
  .replace(/\s+/g, " ");

/** As props do renderizador, no estado "aula correndo, app sem esperar resposta". */
const props = (q: unknown, tutShow: unknown) => ({
  q, status: null, idx: 0, handlePick: () => {}, timeLeft: 30, promptDone: true,
  guidedIdx: null, mockTutorialN: null, tutShow, journeyDone: false, flashHidden: false,
  sel: null, totalQFor: () => 8,
  track: { id: "t", name: "t", color: "#2563EB", dark: "#1E40AF" },
  aulaSuggest: false, guidedNarr: null, playAulinha: () => {}, setShowClockTutorial: () => {},
  sound: true, peekAgain: () => {}, setJourneyDone: () => {}, orderTaps: [],
  handleOrderTap: () => {}, orderShake: null, hiddenOpts: [] as unknown[],
});

/** Os passos que não mudam a tela, hoje, em toda a jornada. */
function passosMortos(): string[] {
  const vezesMorto = new Map<string, number>();
  vi.useFakeTimers();
  for (const semente of SEMENTES) {
    for (const track of ALL_MATH_TRACKS) {
      for (const lvl of NIVEIS) {
        semear(semente);
        let q: { tutorial?: { show?: Record<string, unknown> }[] } | undefined;
        try { q = track.gen(lvl) as never; } catch { Math.random = sorteioOriginal; continue; }
        Math.random = sorteioOriginal;

        const passos = q?.tutorial;
        if (!Array.isArray(passos) || passos.length < 2) continue;

        const telas = passos.map(passo => {
          const { container, unmount } = render(
            <GameLoopExerciseRenderer {...(props(q, passo?.show ?? null) as unknown as React.ComponentProps<typeof GameLoopExerciseRenderer>)} />);
          act(() => { vi.advanceTimersByTime(300); });
          const html = limpar(container.innerHTML);
          unmount();
          return html;
        });

        for (let i = 1; i < telas.length; i += 1) {
          if (telas[i] === telas[i - 1]) {
            const chave = `${track.id} n${lvl} p${i}`;
            vezesMorto.set(chave, (vezesMorto.get(chave) ?? 0) + 1);
          }
        }
      }
    }
  }
  vi.useRealTimers();
  Math.random = sorteioOriginal;
  return [...vezesMorto.entries()]
    .filter(([, vezes]) => vezes === SEMENTES.length)
    .map(([chave]) => chave)
    .sort();
}

afterEach(cleanup);

describe("catraca da coreografia viva", () => {
  it("nenhum passo de micro-aula volta a não mudar a tela", () => {
    const mortos = passosMortos();
    const baseline: string[] = JSON.parse(readFileSync(CAMINHO, "utf8"));

    if (process.env.ATUALIZAR_COREOGRAFIA === "1") {
      writeFileSync(CAMINHO, `${JSON.stringify(mortos, null, 2)}\n`);
      return;
    }

    const novos = mortos.filter(m => !baseline.includes(m));
    expect(
      novos,
      [
        "Passos de micro-aula que DEIXARAM de mudar a tela:",
        ...novos.map(n => `  ${n}`),
        "",
        "A aula é a tela para quem não lê. Passo que não muda nada não é aula.",
      ].join("\n"),
    ).toEqual([]);

    const ressuscitados = baseline.filter(b => !mortos.includes(b));
    expect(
      ressuscitados.length,
      [
        `${ressuscitados.length} passos foram consertados e a baseline não desceu.`,
        "Rode `npm run coreografia:baseline`. A catraca só desce.",
      ].join("\n"),
    ).toBe(0);
  }, 600000);
});
