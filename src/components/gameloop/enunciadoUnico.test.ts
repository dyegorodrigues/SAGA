import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PALCOS_JA_DESENHADOS } from "./GameLoopExerciseRenderer";

/**
 * O enunciado aparece UMA vez.
 *
 * ---
 *
 * ### O defeito que isto fecha
 *
 * `GameLoop.tsx` desenha `q.prompt` numa caixa própria **acima** do
 * `GameLoopExerciseRenderer`. Todo palco que também imprimia `spec.enunciado`
 * punha a mesma pergunta duas vezes na tela — e três palcos faziam isso:
 * `TouchCount` (N1.02, N1.04), `PareamentoStage` (N1.01) e a primeira versão de
 * `EmojiRowStage`.
 *
 * Nenhum teste viu, e a sonda também não: as cenas montavam o palco **sem a
 * caixa do enunciado do app**. É o §6.32 na mesma família de sempre — dois
 * lugares sabendo desenhar a mesma coisa — e o print errado da RETOMADA §7.4:
 * fotografar o palco solto em vez da área do exercício dentro do app.
 *
 * ### Por que ler o código e não a tela
 *
 * A tela renderizada não distingue "o palco imprimiu" de "o app imprimiu": o
 * texto está lá nos dois casos. O que se quer proibir é o palco **saber**
 * imprimir, e isso mora na fonte. Mesma escolha do `palcoUnico.test.ts`.
 */

const PASTA = join(__dirname, "..", "primitives");

/** Os arquivos de palco: um por `kind` desenhado no topo do renderer. */
function palcos(): string[] {
  return readdirSync(PASTA).filter(a => a.endsWith(".tsx") && !a.includes(".test."));
}

describe("o enunciado da questão sai uma vez só", () => {
  it("nenhum palco do Padrão Ouro imprime o próprio enunciado", () => {
    const culpados: string[] = [];
    for (const arquivo of palcos()) {
      const fonte = readFileSync(join(PASTA, arquivo), "utf8");
      // `{spec.enunciado}` dentro do JSX. A menção em comentário não conta —
      // é justamente onde a regra está explicada.
      const semComentarios = fonte
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "");
      if (/\{\s*spec\.enunciado\s*\}/.test(semComentarios)) culpados.push(arquivo);
    }
    expect(
      culpados,
      "estes palcos imprimem o enunciado que o app já desenha acima deles",
    ).toEqual([]);
  });

  it("o app continua desenhando o enunciado — senão ninguém o mostra", () => {
    // O outro lado do mesmo erro. Se alguém tirar a caixa do GameLoop achando
    // que os palcos cuidam disso, a pergunta some da tela inteira.
    const gameLoop = readFileSync(join(__dirname, "..", "GameLoop.tsx"), "utf8");
    expect(gameLoop).toContain("q.prompt");
  });

  it("a sonda mede a tela COM a caixa do enunciado", () => {
    // Foi a ausência dela nas cenas que escondeu a duplicação. Sem esta
    // guarda, a próxima limpeza de cenas devolve o ponto cego.
    const cenas = readFileSync(join(__dirname, "..", "..", "..", "sonda", "cenas.tsx"), "utf8");
    const daFicha = cenas.split("function ExercicioDaFicha")[1] ?? "";
    expect(daFicha, "ExercicioDaFicha não desenha o enunciado").toContain("q.prompt");
  });

  it("todo palco do topo é um arquivo que este teste realmente varre", () => {
    // Guarda contra a varredura silenciosamente parar de casar: uma lista de
    // arquivos vazia faria o teste acima passar sem verificar nada.
    expect(palcos().length).toBeGreaterThan(PALCOS_JA_DESENHADOS.size);
  });
});
