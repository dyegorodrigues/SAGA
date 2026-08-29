import { afterEach, describe, expect, it } from "vitest";
import { ALL_MATH_TRACKS, geradorLegadoDe, getTrackById } from "./curriculum";

/**
 * A ponte não substitui o gerador de quem ficou no legado.
 *
 * ### O que este teste protegia, e por que precisou ser reescrito
 *
 * A primeira versão nomeava dois nós à mão: "usa N3.09 como único canário e
 * preserva N3.11 no legado". Era verdade no dia em que foi escrita e virou
 * mentira na W52, quando a N3.11 foi promovida — o teste reprovou por
 * envelhecimento, não por defeito. Um teste que nomeia o estado atual do
 * catálogo morre em toda promoção legítima, e quem lê aprende a "consertar" o
 * teste sem pensar.
 *
 * A propriedade não envelhece: **enquanto um nó estiver no legado, produção
 * entrega exatamente o que o gerador legado dele entrega.** É isso que impede
 * a ponte de trocar o conteúdo de um nó por baixo, sem promoção e sem ledger.
 *
 * `geradorLegadoDe` existe justamente para descobrir o legado em vez de
 * declará-lo — declarar é uma chance de declarar errado, e comparar a ficha
 * nova com o gerador errado passaria sem verificar nada.
 */
const SEMENTES = [0x2f6e2b1, 0x5bd1e99, 0x1a2b3c4];
const original = Math.random;

function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}

describe("ponte de migração — quem está no legado é servido pelo legado", () => {
  afterEach(() => { Math.random = original; });

  it("todo nó legado delega exatamente ao próprio gerador legado", () => {
    const legados = ALL_MATH_TRACKS
      .filter(track => track.generatorSource === "legacy")
      .map(track => track.id)
      .filter(id => geradorLegadoDe(id));

    // Prova de vida: sem nó legado nenhum, o laço abaixo não observa nada e a
    // tela verde deixa de significar qualquer coisa. No dia em que a Jornada
    // inteira for Composer, este teste some junto com o legado — não passa
    // vazio.
    expect(legados.length, "nenhum nó no legado: esta ponte perdeu o objeto").toBeGreaterThan(0);

    // Os geradores consomem Math.random; semear a fonte torna a delegação uma
    // comparação determinística — prova mais forte que a identidade de função,
    // que o dispatch preguiçoso torna inobservável.
    //
    // A semente é uma SEQUÊNCIA, não uma constante. A versão anterior fixava
    // `mockReturnValue(0.4242)` e funcionava porque olhava um nó só. Varrendo
    // os treze, o `numOpts` do `generatorsF1` trava: ele sorteia distratores
    // num `while` até juntar três distintos, e com a fonte constante o mesmo
    // valor sai para sempre. Com RNG de verdade o laço termina com
    // probabilidade 1 — não é travamento de produção —, mas constante é a
    // ferramenta errada para determinismo, e o LCG é o mesmo idioma que os
    // outros portões deste repositório já usam.
    for (const semente of SEMENTES) {
      for (const id of legados) {
        const legado = geradorLegadoDe(id)!;
        for (const nivel of [1, 2, 3, 4, 5]) {
          semear(semente);
          const daProducao = getTrackById(id)?.gen(nivel);
          semear(semente);
          expect(daProducao, `${id} L${nivel}: produção não entrega o que o legado entrega`).toEqual(legado(nivel));
        }
      }
    }
  });
});
