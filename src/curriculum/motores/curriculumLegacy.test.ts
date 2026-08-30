import { afterEach, describe, expect, it } from "vitest";
import { ALL_MATH_TRACKS, geradorLegadoDe, getTrackById } from "./curriculum";
import { COMPOSER_CANARIES, rollbackComposerCanary } from "./composerCanary";

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

/** O que a criança recebe, serializado: sem closures, sem identidade de objeto. */
function digital(questao: unknown): string {
  return JSON.stringify(questao, (_chave, valor) => (typeof valor === "function" ? "[fn]" : valor));
}

function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}

describe("ponte de migração — quem está no legado é servido pelo legado", () => {
  const conjuntoOriginal = [...COMPOSER_CANARIES];
  afterEach(() => {
    Math.random = original;
    // O rollback é global: sem restaurar, esta suíte deixaria a Jornada no
    // legado para todos os testes seguintes.
    COMPOSER_CANARIES.clear();
    for (const id of conjuntoOriginal) COMPOSER_CANARIES.add(id);
  });

  it("todo nó legado delega exatamente ao próprio gerador legado", () => {
    // ### O dia chegou, e o teste mudou de sujeito em vez de passar vazio
    //
    // A versão anterior media os nós que ESTAVAM no legado, e avisava em
    // comentário: "no dia em que a Jornada inteira for Composer, este teste
    // some junto com o legado — não passa vazio". A W65 fechou a Jornada em
    // 90/90 e a prova de vida disparou, exatamente como escrito.
    //
    // Some junto? Não: a propriedade continua valendo e continua importando,
    // porque o ramo `legacy` da ponte continua existindo — é ele que o ROLLBACK
    // usa. O que mudou é como se chega a um nó legado: antes bastava olhar, e
    // agora é preciso tirá-lo do conjunto. O teste passa a fazer isso, que é
    // também o teste de que o rollback funciona.
    const candidatos = ALL_MATH_TRACKS.map(track => track.id).filter(id => geradorLegadoDe(id));
    expect(candidatos.length, "nenhum nó tem gerador legado: esta ponte perdeu o objeto").toBeGreaterThan(0);

    for (const id of candidatos) rollbackComposerCanary(id);
    const legados = candidatos.filter(id => getTrackById(id)?.generatorSource === "legacy");
    expect(legados.length, "o rollback não devolveu nó nenhum ao legado").toBe(candidatos.length);

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
          // A comparação é do CONTEÚDO, não da identidade dos objetos. Vários
          // geradores legados montam `evaluate` como closure nova a cada
          // chamada, e `toEqual` compara função por referência: duas questões
          // idênticas em tudo o que a criança vê reprovavam com a mensagem
          // "compared values have no visual difference", que é o teste dizendo
          // que não achou diferença nenhuma e reprovando assim mesmo.
          expect(digital(daProducao), `${id} L${nivel}: produção não entrega o que o legado entrega`).toBe(digital(legado(nivel)));
        }
      }
    }
  });
});
