import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { chaveDaFala } from "./chaveDaFala";

/**
 * O pacote de vozes bate com o corpus.
 *
 * Três jeitos de o pacote mentir sem ninguém notar, e o portão para cada um:
 *
 * 1. **Índice sem arquivo.** O app olha o índice, acha que tem áudio, pede o
 *    arquivo e recebe 404. Cai para a voz do aparelho — que pode não existir.
 * 2. **Arquivo sem índice.** O áudio está gravado e versionado e o app nunca o
 *    toca. Peso morto no repositório e silêncio na tela.
 * 3. **Corpus fora do pacote.** Alguém acrescentou uma fala e esqueceu de
 *    rodar `npm run vozes`.
 *
 * Nada aqui escuta o áudio — quem ouve é `scripts/conferir-vozes.ts`, por
 * reconhecimento de fala, na hora de regravar.
 */

const RAIZ = resolve(__dirname, "..", "..");
const VOZES = resolve(RAIZ, "public", "vozes");
const CORPUS: string[] = JSON.parse(readFileSync(resolve(__dirname, "corpus-da-voz.json"), "utf8"));
const INDICE: string[] = JSON.parse(readFileSync(resolve(VOZES, "indice.json"), "utf8"));

/** Abaixo disto o arquivo não tem fala nenhuma dentro — é cabeçalho e silêncio. */
const MINIMO_DE_BYTES = 512;

describe("o pacote de vozes", () => {
  it("tem um arquivo para cada fala do corpus", () => {
    const semArquivo = CORPUS
      .map(t => ({ t, chave: chaveDaFala(t) }))
      .filter(({ chave }) => !existsSync(resolve(VOZES, `${chave}.m4a`)))
      .map(({ t }) => `  ${JSON.stringify(t.slice(0, 80))}`);

    expect(
      semArquivo,
      ["Fala do corpus sem áudio gravado:", ...semArquivo, "", "Rode: npm run vozes"].join("\n"),
    ).toEqual([]);
  });

  it("o índice anuncia exatamente o que existe em disco", () => {
    const noIndice = new Set(INDICE);
    const doCorpus = new Set(CORPUS.map(chaveDaFala));

    const anunciadoSemArquivo = [...noIndice].filter(c => !existsSync(resolve(VOZES, `${c}.m4a`)));
    expect(anunciadoSemArquivo, `índice promete áudio que não existe: ${anunciadoSemArquivo.join(", ")}`).toEqual([]);

    const orfaos = [...doCorpus].filter(c => !noIndice.has(c));
    expect(orfaos, `áudio gravado que o app nunca vai tocar: ${orfaos.join(", ")}`).toEqual([]);
  });

  it("nenhum arquivo é silêncio", () => {
    const vazios = INDICE
      .map(c => resolve(VOZES, `${c}.m4a`))
      .filter(f => existsSync(f) && statSync(f).size < MINIMO_DE_BYTES);
    expect(vazios, `áudio pequeno demais para conter fala:\n${vazios.join("\n")}`).toEqual([]);
  });

  it("o pacote não está vazio", () => {
    // Prova de vida: um pacote vazio faria os três testes acima passarem calados.
    expect(INDICE.length).toBeGreaterThan(900);
    expect(CORPUS.length).toBeGreaterThan(900);
  });
});
