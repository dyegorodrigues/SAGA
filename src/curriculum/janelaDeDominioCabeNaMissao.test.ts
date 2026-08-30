import { describe, expect, it } from "vitest";
import { TOTAL_Q } from "../components/gameloop/tamanhoDaMissao";
import { JOURNEY_FICHAS } from "./fichas";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "./motores/composerCanary";

/**
 * Invariante do cânone (§12, "asserções que valem sempre"): a janela de
 * compreensão precisa CABER numa missão.
 *
 * ## O mecanismo, que é o que torna isto uma invariante e não um gosto
 *
 * O motor zera a janela de compreensão toda vez que o `practiceDay` muda, e só
 * empilha tentativas nela quando o progresso já está no último nível. Uma
 * missão da Jornada tem `TOTAL_Q` questões, todas no mesmo dia: **a janela
 * nunca passa de `TOTAL_Q` entradas para quem joga uma missão por dia.**
 *
 * Logo, uma regra que peça `de` maior que isso não é uma regra difícil — é uma
 * regra que **não fecha**. A criança acerta tudo, todos os dias, e a coroa não
 * vem. Só vem se ela jogar duas missões no mesmo dia, o que nenhuma ficha
 * declara e nenhuma tela pede.
 *
 * ## Como isto foi descoberto, e por que virou gate
 *
 * O aprendiz sintético (`npm run simular`) mediu: com uma missão por dia,
 * `N4.03`, `N4.04` e `N4.07` não coroavam **nenhuma vez** em nenhuma rodada;
 * com duas por dia, coroavam em todas. As três pediam `8 de 10` numa missão de
 * oito questões.
 *
 * A causa não foi descuido de quem escreveu: era o critério do DOJO instalado
 * como coroa da JORNADA (ver `DECISAO-002` no checkpoint do Gate B′). O reparo
 * foi na ficha; este gate existe para a próxima não repetir.
 *
 * ## Por descoberta (D068)
 *
 * Quem decide é a regra que a questão carrega, comparada com o tamanho da
 * missão que o `GameLoop` usa — os dois lados lidos do runtime, nenhum escrito
 * à mão aqui. Ficha nova que peça uma janela grande demais reprova sozinha, e
 * mudar o tamanho da missão reavalia as noventa de graça.
 */
describe("a janela de domínio cabe na missão", () => {
  it("nenhuma regra pede mais tentativas do que uma missão oferece", () => {
    const fichas = JOURNEY_FICHAS.filter(ficha => hasComposerFicha(ficha.id));

    // Prova de vida: um gate que não olhou ficha nenhuma passa calado.
    expect(fichas.length, "a varredura precisa cobrir a Jornada inteira").toBeGreaterThanOrEqual(90);

    const naoFecham: string[] = [];
    for (const ficha of fichas) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const regra = generateRegisteredFichaQuestion(ficha.id, nivel).masteryRule;
        if (!regra) continue;
        if (regra.de > TOTAL_Q) {
          naoFecham.push(
            `${ficha.id} L${nivel} pede ${regra.acertos} de ${regra.de} e a missão tem ${TOTAL_Q} questões — a janela zera na virada do dia e nunca chega a ${regra.de}`,
          );
        }
      }
    }

    expect(
      naoFecham,
      `regras de domínio que não fecham em uma missão por dia:\n${naoFecham.join("\n")}`,
    ).toEqual([]);
  });
});
