import { describe, expect, it } from "vitest";
import { generateRegisteredFichaQuestion } from "./motores/composerCanary";
import { rotuloDoCriterio } from "./procedimentos/classificacaoProcedure";
import { tutorialSteps } from "../utils/tutorials";

/**
 * A voz nomeia o laço que está na tela.
 *
 * A coreografia da AL.01 era texto fixo: "Vamos separar os **vermelhos**",
 * "Este é **vermelho**, entra." Só que o laço é sorteado entre cor, forma e
 * tamanho — a criança via AZUIS escrito no cesto e ouvia "vermelhos".
 *
 * Para quem tem quatro anos e não lê, a voz é a ÚNICA instrução. Dizer o
 * critério errado não é um detalhe de texto: é ensinar a classificar errado e
 * depois anotar como erro dela.
 *
 * O portão sorteia muitas vezes porque o laço é sorteado: uma rodada só
 * poderia cair no vermelho e passar calada.
 */

describe("a voz nomeia o laço certo", () => {
  it("nenhuma narração da AL.01 cita um critério que não está na cena", () => {
    const mentiras: string[] = [];
    const vistos = new Set<string>();

    for (let nivel = 1; nivel <= 4; nivel += 1) {
      for (let i = 0; i < 60; i += 1) {
        const q = generateRegisteredFichaQuestion("AL.01", nivel) as never as {
          uiProps?: { lacos?: { criterio: Parameters<typeof rotuloDoCriterio>[0] }[] };
        };
        const criterio = q.uiProps?.lacos?.[0]?.criterio;
        if (!criterio) continue;
        const certo = rotuloDoCriterio(criterio);
        vistos.add(certo);

        for (const passo of tutorialSteps(q as never)) {
          const fala = String(passo.say ?? "");
          // Um passo que nomeia um plural de critério tem de nomear O da cena.
          const citado = ["vermelhos", "azuis", "amarelos", "círculos", "quadrados", "triângulos", "grandes", "pequenos"]
            .find(r => fala.includes(r));
          if (citado && citado !== certo) {
            mentiras.push(`nível ${nivel}: laço é "${certo}" e a voz diz "${citado}" — ${JSON.stringify(fala)}`);
          }
          // E o marcador nunca pode sobrar na fala.
          if (/\{laco\}|\{umLaco\}/.test(fala)) mentiras.push(`nível ${nivel}: marcador não substituído — ${JSON.stringify(fala)}`);
        }
      }
    }

    // Prova de vida: sem variedade de laço, o portão não mediria nada.
    expect(vistos.size, `o sorteio precisa variar o laço; vi ${[...vistos].join(", ")}`).toBeGreaterThan(1);
    expect([...new Set(mentiras)], `a voz cita critério que não está na cena:\n${[...new Set(mentiras)].join("\n")}`).toEqual([]);
  }, 120000);
});
