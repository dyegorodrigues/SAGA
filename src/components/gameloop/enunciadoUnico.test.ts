import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PALCOS_JA_DESENHADOS } from "./GameLoopExerciseRenderer";

/**
 * O enunciado aparece UMA vez.
 *
 * `GameLoop.tsx` é a única casca que desenha `q.prompt`. Os palcos podem
 * sinalizar QUANDO a casca deve revelá-lo — F05 faz isso depois da primeira
 * audição —, mas nunca assumem a autoria do texto.
 */
const PASTA = join(__dirname, "..", "primitives");

function palcos(): string[] {
  return readdirSync(PASTA).filter(a => a.endsWith(".tsx") && !a.includes(".test."));
}

describe("o enunciado da questão sai uma vez só", () => {
  it("nenhum palco do Padrão Ouro imprime o próprio enunciado", () => {
    const culpados: string[] = [];
    for (const arquivo of palcos()) {
      const fonte = readFileSync(join(PASTA, arquivo), "utf8");
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
    const gameLoop = readFileSync(join(__dirname, "..", "GameLoop.tsx"), "utf8");
    expect(gameLoop).toContain("q.prompt");
  });

  it("F05 muda o MOMENTO, não a autoria: Stage sinaliza e GameLoop revela", () => {
    const gameLoop = readFileSync(join(__dirname, "..", "GameLoop.tsx"), "utf8");
    const renderer = readFileSync(join(__dirname, "GameLoopExerciseRenderer.tsx"), "utf8");
    const stage = readFileSync(join(PASTA, "AudioChoiceStage.tsx"), "utf8");

    expect(stage).toContain("onPrimeiraAudicaoConcluida");
    expect(renderer).toContain("onFirstAuditionComplete");
    expect(renderer).toContain("onPrimeiraAudicaoConcluida={onFirstAuditionComplete}");
    expect(gameLoop).toContain("audioChoicePromptVisible");
    expect(gameLoop).toContain("data-audiochoice-prompt");
    expect(gameLoop).toContain("onFirstAuditionComplete={() => setAudioChoicePromptVisible(true)}");
  });

  it("a sonda mede a tela COM a mesma caixa temporal do enunciado", () => {
    const cenas = readFileSync(join(__dirname, "..", "..", "..", "sonda", "cenas.tsx"), "utf8");
    const daFicha = cenas.split("function ExercicioDaFicha")[1] ?? "";
    expect(daFicha, "ExercicioDaFicha não desenha o enunciado").toContain("q.prompt");
    expect(daFicha).toContain("audioPromptVisible");
    expect(daFicha).toContain("onFirstAuditionComplete={() => setAudioPromptVisible(true)}");
  });

  it("todo palco do topo é um arquivo que este teste realmente varre", () => {
    expect(palcos().length).toBeGreaterThan(PALCOS_JA_DESENHADOS.size);
  });
});
