// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ALL_MATH_TRACKS } from "../../curriculum/motores/curriculum";
import { GameLoopExerciseRenderer } from "./GameLoopExerciseRenderer";

const props = (q: unknown, handlePick: (v: unknown) => void, armedOpt: unknown, setArmedOpt: (v: unknown) => void) => ({
  q, status: null, idx: 0, handlePick, timeLeft: 30, promptDone: true, guidedIdx: null,
  mockTutorialN: null, tutShow: null, journeyDone: false, flashHidden: false, sel: null, totalQFor: () => 8,
  track: { id: "t", name: "t", color: "#2563EB", dark: "#1E40AF" }, aulaSuggest: false, guidedNarr: null,
  playAulinha: () => {}, setShowClockTutorial: () => {}, sound: true, peekAgain: () => {}, setJourneyDone: () => {},
  orderTaps: [], handleOrderTap: () => {}, orderShake: null, hiddenOpts: [] as unknown[], armedOpt, setArmedOpt,
});

const CAMINHO_FORA = resolve(__dirname, "primeiro-toque-fora-do-grupo.baseline.json");
/**
 * Sorteios por combinação.
 *
 * Com 3 a catraca piscava: a `N3.09|2` aparecia num sorteio e não no outro, e
 * catraca que acusa por azar de dado é catraca que a gente desliga. O número
 * foi medido subindo até a lista repetir — ver a nota do teste.
 */
const SORTEIOS = Number(process.env.SORTEIOS_PRIMEIRO_TOQUE ?? 8);

const MOLDURA = /^(Fechar|Sair da missão|Avançar|Continuar|Ver Resultado|Sair|Voltar|Ouvir de novo|Ligar o som|Desligar o som|Ver de novo|Escolher outra)$|Como faz|aulinha|Tá difícil|Confirmar:|Ouvir de novo:/i;

/**
 * Nenhuma alternativa responde no primeiro toque.
 *
 * ## Por que existe
 *
 * A regra de ouvir-antes-de-escolher nasceu no renderizador genérico. Os
 * quinze palcos que desenham as PRÓPRIAS alternativas nunca passaram por ele,
 * então a regra valia em dois lugares e faltava em treze — e ninguém percebia,
 * porque cada palco tem o seu teste e nenhum teste olhava o conjunto.
 *
 * O pai encontrou o buraco no PRIMEIRO exercício da Jornada, depois de eu ter
 * dito que estava resolvido: *"no primeiro exercício nem confirma, o botão ali
 * verdinho para confirmar a resposta, não"*.
 *
 * Medido antes: **53 combinações respondiam no primeiro toque.** Depois de
 * tudo passar por `AlternativasQueFalam`: **zero.**
 *
 * ## O que este portão NÃO cobre
 *
 * Manipulação — estourar balão, arrastar peça, contar objeto. Ali o gesto É a
 * resposta, e pedir confirmação atravessaria o exercício. Por isso a varredura
 * só olha dentro de grupos `aria-label="Alternativas"`, que é onde mora
 * ESCOLHA.
 */
describe("escolher exige ouvir e confirmar, na jornada inteira", () => {
  it("⚠️ nenhuma alternativa responde no primeiro toque", () => {
    vi.useFakeTimers();
    const semConfirmar: string[] = [];
    const comConfirmar: string[] = [];
    for (const track of ALL_MATH_TRACKS) {
      for (const lvl of [1, 2, 3, 4, 5]) {
        let q: any;
        try { q = track.gen(lvl); } catch { continue; }
        let respondeu = false;
        let armado: unknown = null;
        const { container, unmount } = render(
          <GameLoopExerciseRenderer {...(props(q, () => { respondeu = true; }, armado, (v: unknown) => { armado = v; }) as unknown as React.ComponentProps<typeof GameLoopExerciseRenderer>)} />);
        act(() => { vi.advanceTimersByTime(9000); });

        // Só ESCOLHA entre alternativas. Manipulação (estourar balão, arrastar
        // peça, contar objeto) responde no toque de propósito: o gesto é a
        // resposta, e um confirmar ali seria atravessar o exercício.
        const grupos = [...container.querySelectorAll('[aria-label="Alternativas"], [role="radiogroup"]')];
        const alvos = grupos.flatMap(g => [...g.querySelectorAll("button")])
          .filter(b => !b.disabled)
          .filter(b => {
            const n = (b.getAttribute("aria-label") || b.textContent || "").replace(/\s+/g, " ").trim();
            return n && !MOLDURA.test(n);
          });
        if (alvos.length === 0) { unmount(); continue; }
        fireEvent.click(alvos[0]);
        act(() => { vi.advanceTimersByTime(300); });
        const temBarra = container.querySelector('[aria-label^="Confirmar:"]') !== null;
        if (respondeu && !temBarra) semConfirmar.push(`${track.id}|${lvl}|${q.kind}`);
        else if (temBarra || armado !== null) comConfirmar.push(`${track.id}|${lvl}`);
        unmount();
      }
    }
    vi.useRealTimers();
    expect(
      semConfirmar,
      [
        "Alternativas que respondem no primeiro toque, sem falar nem confirmar:",
        ...semConfirmar.map(s => `  ${s}`),
        "",
        "Use `AlternativasQueFalam`. Quem não lê não escolhe entre símbolos no escuro.",
      ].join("\n"),
    ).toEqual([]);

    // Prova de vida: se a varredura parasse de achar alternativa, "nenhuma
    // responde no primeiro toque" passaria a significar "não olhei".
    expect(comConfirmar.length, "a varredura ainda enxerga alternativas").toBeGreaterThan(40);
  }, 900000);

  /**
   * ⚠️ O QUE O PORTÃO ACIMA NÃO VÊ — medido, porque "zero" era mentira.
   *
   * O portão acima só olha dentro de `aria-label="Alternativas"` ou
   * `role="radiogroup"`. Era de propósito: fora dos grupos ficam os palcos de
   * manipulação, onde o gesto É a resposta e um confirmar atravessaria o
   * exercício.
   *
   * Só que o escopo virou esconderijo. **O palco que desenha alternativas e
   * não marca o grupo não está "fora do alcance": está invisível.** Medindo
   * no navegador eu abri a GE.02 ("Formas planas básicas") no nível 1: a
   * pergunta é *"Qual é o círculo?"*, as alternativas são três botões
   * ESCRITOS — `o círculo`, `o quadrado`, `o retângulo` — e um toque num deles
   * foi direto para a tela de acerto. Sem falar, sem confirmar, sem volta.
   * Exatamente o buraco que o portão acima diz ter fechado, num palco que ele
   * nunca mediu.
   *
   * Medido: **215 combinações respondem no primeiro toque fora de qualquer
   * grupo**, em 46 tipos de palco. O portão relatava zero.
   *
   * ## O que esta catraca mede, e o que ela não decide
   *
   * Mede comportamento, não rótulo: renderiza, toca UMA vez num controle que
   * não é moldura, e pergunta se o app já respondeu. Um toque só, em tela
   * nova, não é resposta em palco de manipulação — balão pipoca, objeto é
   * contado, peça é arrastada, e nada é respondido ainda. Então "respondeu
   * num toque" é sinal de ESCOLHA, não de gesto.
   *
   * Não decide quais dos 212 são defeito: "apontar o 8 na reta" é diferente de
   * "escolher entre três palavras", e essa é chamada pedagógica, não minha.
   * Decide só que a lista **não pode crescer** e que ninguém mais pode dizer
   * "zero" sem olhar aqui.
   *
   * ## Três sorteios, não um
   *
   * `track.gen(lvl)` sorteia, e a mesma competência rende palco diferente de
   * um sorteio para o outro (a N1.07 dá `numberline` no nível 1 e `plain` no
   * 3). Com um sorteio só a catraca acusaria "entrada nova" por azar de dado —
   * e foi o que ela fez: com três sorteios a `N3.09|2` aparecia numa rodada e
   * não na seguinte.
   *
   * O número foi medido subindo até a lista parar de mudar: 3 sorteios dão
   * 214 instáveis, **8 dão 215 e 12 dão os mesmos 215** — conjuntos idênticos,
   * não só contagens iguais. Catraca de dois sentidos sobre gerador aleatório
   * exige saturar: sem isso o lado "a catraca só desce" acusa conserto que
   * não houve, e aí a gente desliga a catraca, que é como a dívida cresce.
   */
  it("⚠️ a lista de quem responde no primeiro toque FORA de grupo não cresce", () => {
    vi.useFakeTimers();
    const fora = new Set<string>();
    let examinadas = 0;
    for (const track of ALL_MATH_TRACKS) {
      for (const lvl of [1, 2, 3, 4, 5]) {
        for (let sorteio = 0; sorteio < SORTEIOS; sorteio += 1) {
          let q: any;
          try { q = track.gen(lvl); } catch { continue; }
          examinadas += 1;
          let respondeu = false;
          const { container, unmount } = render(
            <GameLoopExerciseRenderer {...(props(q, () => { respondeu = true; }, null, () => {}) as unknown as React.ComponentProps<typeof GameLoopExerciseRenderer>)} />);
          act(() => { vi.advanceTimersByTime(9000); });

          // Dentro de grupo é assunto do portão acima.
          if (container.querySelector('[aria-label="Alternativas"], [role="radiogroup"]')) { unmount(); continue; }

          const alvos = [...container.querySelectorAll("button")]
            .filter(b => !b.disabled)
            .filter(b => {
              const n = (b.getAttribute("aria-label") || b.textContent || "").replace(/\s+/g, " ").trim();
              return n && !MOLDURA.test(n);
            });
          if (alvos.length === 0) { unmount(); continue; }
          fireEvent.click(alvos[0]);
          act(() => { vi.advanceTimersByTime(300); });
          if (respondeu && container.querySelector('[aria-label^="Confirmar:"]') === null) {
            fora.add(`${track.id}|${lvl}`);
          }
          unmount();
        }
      }
    }
    vi.useRealTimers();
    const lista = [...fora].sort();

    if (process.env.ATUALIZAR_PRIMEIRO_TOQUE === "1") {
      writeFileSync(CAMINHO_FORA, `${JSON.stringify(lista, null, 2)}\n`);
      return;
    }

    const baseline: string[] = JSON.parse(readFileSync(CAMINHO_FORA, "utf8"));
    const novas = lista.filter(k => !baseline.includes(k));
    expect(
      novas,
      [
        "Passaram a responder no primeiro toque, fora de grupo de alternativas:",
        ...novas.map(k => `  ${k}`),
        "",
        "Se é escolha, use `AlternativasQueFalam` (o grupo entra junto).",
        "Se é manipulação, o gesto não devia responder no primeiro toque.",
      ].join("\n"),
    ).toEqual([]);

    const consertadas = baseline.filter(k => !lista.includes(k));
    expect(
      consertadas.length,
      [
        `${consertadas.length} combinações saíram da lista e a baseline não desceu: ${consertadas.slice(0, 12).join(", ")}`,
        "Rode: ATUALIZAR_PRIMEIRO_TOQUE=1 npx vitest run src/components/gameloop/escolherExigeConfirmar.test.tsx",
        "A catraca só desce.",
      ].join("\n"),
    ).toBe(0);

    // Prova de vida: catraca que não renderiza nada passa dizendo "nada novo".
    expect(examinadas, "a varredura ainda rende questões").toBeGreaterThan(900);
  }, 900000);
});
