import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";


describe("nenhum parâmetro de ficha é descartado em silêncio", () => {
  // `parseComposerParams` copia só chaves de uma lista branca. `modo` estava
  // declarado na interface `ComposerParams` e FORA das listas: a ficha F27
  // pedia `modo: "ritmico"`, a chave sumia, e o canhão de balões desenhava
  // peixinhos. Não houve erro em lugar nenhum — a tela só ficou errada.
  //
  // Este teste cruza a interface com as listas. Declarar um parâmetro e
  // esquecer de aceitá-lo passa a falhar aqui, e não numa tela seis meses
  // depois.
  it("toda chave de ComposerParams é aceita pelo parser", () => {
    const fonte = readFileSync(
      join(__dirname, "fichaQuestionContract.ts"), "utf-8");

    const corpo = fonte.split("export interface ComposerParams {")[1].split("\n}")[0];
    const declaradas = [...corpo.matchAll(/^\s{2}(\w+)\??:/gm)].map(m => m[1]);
    expect(declaradas.length, "a interface não foi lida").toBeGreaterThan(20);

    const listas = [...fonte.matchAll(/const [A-Z_]+_KEYS = \[([^\]]*)\]/g)]
      .flatMap(m => [...m[1].matchAll(/"(\w+)"/g)].map(k => k[1]));
    // Chaves com tratamento próprio, fora das listas — cada uma tem seu bloco
    // `if (input.X !== undefined)` no parser.
    const proprias = [...fonte.matchAll(/input\.(\w+) !== undefined/g)].map(m => m[1]);
    const atribuidas = [...fonte.matchAll(/parsed\.(\w+) =/g)].map(m => m[1]);

    const aceitas = new Set([...listas, ...proprias, ...atribuidas]);
    const perdidas = declaradas.filter(k => !aceitas.has(k));

    expect(
      perdidas,
      "estes parâmetros existem na interface e o parser os joga fora sem avisar",
    ).toEqual([]);
  });
});
