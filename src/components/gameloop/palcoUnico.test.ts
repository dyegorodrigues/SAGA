import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PALCOS_JA_DESENHADOS } from "./GameLoopExerciseRenderer";

/**
 * A tela de uma competência aparece UMA vez.
 *
 * ---
 *
 * O `GameLoopExerciseRenderer` desenha o palco das competências do Padrão Ouro
 * no topo — é lá que chega o `tutShow`, o fio da micro-aula. Logo abaixo, quem
 * tem `uiProps` cai no `FichaRenderer`, que tem um `case` para os MESMOS kinds.
 * Resultado: a conta, o material e a dica saíam duas vezes, uma embaixo da
 * outra, em todas as seis competências construídas até aqui.
 *
 * Nenhum dos 1074 testes viu, e o motivo é estrutural: todos renderizam o palco
 * DIRETO (`<DeslocamentoStage spec={...} />`) e nunca passam pelo caminho que a
 * criança percorre. Só a sonda de layout, medindo a tela inteira num navegador
 * de verdade, contou o texto repetido.
 *
 * Este teste lê os dois arquivos e cobra a interseção. Ele quebra quando alguém
 * adiciona um palco no topo sem excluí-lo embaixo — que é exatamente o
 * esquecimento que produziu o defeito.
 */

const FONTE = (arquivo: string) =>
  readFileSync(join(__dirname, arquivo), "utf8");

/** Os `kind` que o renderer desenha no topo, lidos do próprio código. */
function palcosNoTopo(): string[] {
  const src = FONTE("GameLoopExerciseRenderer.tsx");
  const topo = src.slice(0, src.indexOf("PALCOS_JA_DESENHADOS.has"));
  return [...topo.matchAll(/q\.kind === "([\w-]+)" && q\.uiProps/g)].map(m => m[1]);
}

/** Os `kind` que o FichaRenderer sabe desenhar sozinho. */
function casesDaFicha(): string[] {
  const src = readFileSync(
    join(__dirname, "..", "FichaRenderer.tsx"), "utf8");
  return [...src.matchAll(/case '([\w-]+)':/g)].map(m => m[1]);
}

describe("nenhuma competência desenha a tela duas vezes", () => {
  it("todo palco do topo está na lista de exclusão", () => {
    // Se falhar: um palco novo foi adicionado no topo do renderer e esqueceram
    // de excluí-lo do FichaRenderer. A criança veria a tela repetida.
    for (const kind of palcosNoTopo()) {
      expect(PALCOS_JA_DESENHADOS.has(kind), `"${kind}" desenha no topo e NÃO está excluído`).toBe(true);
    }
  });

  it("a lista de exclusão não guarda kind que ninguém desenha no topo", () => {
    // O outro lado do mesmo erro: excluir do FichaRenderer um kind que o topo
    // não desenha apagaria a tela por completo.
    const topo = new Set(palcosNoTopo());
    for (const kind of PALCOS_JA_DESENHADOS) {
      expect(topo.has(kind), `"${kind}" está excluído mas ninguém o desenha no topo`).toBe(true);
    }
  });

  it("cada palco excluído realmente tinha um `case` na ficha — senão a exclusão é inútil", () => {
    const cases = new Set(casesDaFicha());
    for (const kind of PALCOS_JA_DESENHADOS) {
      expect(cases.has(kind), `"${kind}" não existe no FichaRenderer`).toBe(true);
    }
  });

  it("o topo do renderer encontra pelo menos as seis competências do Padrão Ouro", () => {
    // Guarda contra a leitura por regex silenciosamente parar de casar: uma
    // lista vazia faria os testes acima passarem sem verificar nada.
    expect(palcosNoTopo().length).toBeGreaterThanOrEqual(6);
  });
});
