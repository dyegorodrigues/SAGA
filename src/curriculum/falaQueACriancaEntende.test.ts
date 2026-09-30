import { describe, expect, it } from "vitest";
import { JOURNEY_FICHAS } from "./fichas";

/**
 * A frase que a criança de cinco anos consegue segurar até o fim.
 *
 * ## Por que existe
 *
 * O pai pediu: *"as falas que estão saindo ali, tu verificou as falas (...)
 * tem que tomar cuidado, tu não tá vendo tudo com detalhe (...) até algumas
 * falas aí estranhas. Pra negócio que é educacional para criança, inclusive
 * quem não é alfabetizada."*
 *
 * A dica que a criança ouve quando trava é a única ajuda que ela tem — ela
 * não lê o enunciado. Uma dica que ela não consegue acompanhar até o fim não
 * é ajuda difícil: é ruído em cima de quem já estava perdida.
 *
 * ## O que se mede, e por que não é o tamanho do texto
 *
 * A primeira versão desta medida contava PALAVRAS e ORAÇÕES do texto inteiro,
 * e acusou como defeito coisas assim:
 *
 *     "Aperte o botão azul. Escute bem. Depois toque no número que você ouviu."
 *
 * Três frases, treze palavras — e é exatamente o que uma criança de cinco anos
 * consegue seguir, porque cada frase é um passo curto. Medir o total punia o
 * formato certo.
 *
 * O que pesa é a FRASE MAIS LONGA. Vinte palavras numa tirada só não cabem na
 * memória de trabalho dessa idade, ainda que digam a mesma coisa.
 *
 * ## Onde vale
 *
 * Só na faixa **F0** — as dezesseis competências que a criança encontra entre
 * os quatro e os seis anos. Numa ficha de fração para o quinto ano, "o
 * denominador diz em quantas partes o inteiro foi dividido" é a frase certa, e
 * encurtá-la seria estragar a aula.
 */

/** O teto. Doze palavras numa frase é o que essa idade segura até o fim. */
const PALAVRAS_POR_FRASE = 12;

/** Tudo que o app pode DIZER em voz alta numa ficha. */
function ditosDaFicha(ficha: (typeof JOURNEY_FICHAS)[number]): string[] {
  const ditos: string[] = [];
  const colher = (v: unknown) => { if (typeof v === "string" && v.trim()) ditos.push(v); };

  for (const campo of ["howto", "explain"]) colher((ficha as unknown as Record<string, unknown>)[campo]);
  for (const micro of ficha.micros ?? []) {
    const params = micro.params as Record<string, unknown> | undefined;
    for (const campo of ["audio_prompt", "howto", "explain"]) colher(params?.[campo]);
    const tutorial = params?.tutorial;
    if (Array.isArray(tutorial)) {
      for (const passo of tutorial) {
        const p = passo as { fala?: unknown; say?: unknown };
        colher(p.fala ?? p.say);
      }
    }
  }
  return [...new Set(ditos)];
}

/** O tamanho da maior frase de um dito. */
export function maiorFrase(dito: string): number {
  return Math.max(0, ...dito
    .split(/[.!?;:]+/)
    .map(f => f.trim())
    .filter(f => f.length > 2)
    .map(f => f.split(/\s+/).filter(Boolean).length));
}

describe("a fala que a criança de cinco anos entende", () => {
  it("⚠️ nenhuma frase da faixa F0 passa de doze palavras", () => {
    const compridas: string[] = [];
    const cedo = JOURNEY_FICHAS.filter(f => String(f.faixa) === "F0");
    expect(cedo.length, "a faixa F0 existe e tem fichas").toBeGreaterThan(10);

    for (const ficha of cedo) {
      for (const dito of ditosDaFicha(ficha)) {
        const maior = maiorFrase(dito);
        if (maior > PALAVRAS_POR_FRASE) compridas.push(`${ficha.id} (${maior} palavras): ${dito}`);
      }
    }

    expect(
      compridas,
      [
        `Frases longas demais para quem tem cinco anos (teto: ${PALAVRAS_POR_FRASE} palavras):`,
        ...compridas.map(c => `  ${c}`),
        "",
        "Quebre em frases curtas. Ela não lê o enunciado — a fala é a única ajuda.",
      ].join("\n"),
    ).toEqual([]);
  });

  it("frases curtas em sequência PASSAM — é o formato certo, não o defeito", () => {
    // O contraexemplo que derrubou a primeira versão desta medida.
    expect(maiorFrase("Aperte o botão azul. Escute bem. Depois toque no número que você ouviu."))
      .toBeLessThanOrEqual(PALAVRAS_POR_FRASE);
  });

  it("uma tirada longa NÃO passa", () => {
    expect(maiorFrase(
      "Use a ordem da contagem para descobrir quem vem antes, quem vem depois e como colocar os números em sequência.",
    )).toBeGreaterThan(PALAVRAS_POR_FRASE);
  });
});
