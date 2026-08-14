import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { Evidencia } from "./evidencias";

/**
 * O porquê de cada evidência é cânone, e cânone apagado não quebra teste.
 *
 * Este arquivo já perdeu a documentação inteira uma vez — foi de 156 linhas
 * para 3 num commit de materialização, e os 2.851 testes continuaram verdes,
 * porque comentário não é executável. O que morreu ali não era enfeite: era a
 * frase que explica por que a coroa daquela ficha exige AQUELA condição, e sem
 * ela a próxima pessoa lê `"adicao-sem-objetos"` e não sabe se pode mexer.
 *
 * O mesmo padrão já aconteceu com a regra de integridade do
 * `ficha_runtime_map.cjs`. Duas vezes é padrão, não acidente — e a lição do
 * projeto é a de sempre: regra sem portão é decoração.
 */
const FONTE = readFileSync(resolve(__dirname, "evidencias.ts"), "utf8");

describe("catálogo de evidências — o porquê é cânone, não comentário", () => {
  it("toda evidência declara acima de si o bloco que explica o que ela prova", () => {
    const semDoc: string[] = [];

    for (const chave of Object.keys(Evidencia)) {
      // O bloco tem de fechar imediatamente antes da chave: `*/` seguido só de
      // espaço em branco e então o nome. Assim um `/** ... */` distante, ou o
      // cabeçalho do arquivo, não cobre uma entrada nova por acidente.
      const temDoc = new RegExp(`\\*/\\s*${chave}\\s*:`).test(FONTE);
      if (!temDoc) semDoc.push(chave);
    }

    expect(
      semDoc,
      [
        "Evidência sem o bloco que explica o que ela prova:",
        ...semDoc.map(c => `  ${c}`),
        "",
        "Escreva acima da chave, em uma frase: qual ficha exige, em que nível,",
        "e por que acertar SEM essa condição não provaria a competência.",
        "Não apague o porquê para encurtar o arquivo.",
      ].join("\n"),
    ).toEqual([]);
  });

  it("o arquivo continua legível — uma linha por declaração, não minificado", () => {
    const linhas = FONTE.split("\n").length;
    const chaves = Object.keys(Evidencia).length;

    // Cada evidência ocupa, no mínimo, a própria linha mais o bloco de doc.
    // Um arquivo com menos linhas que chaves foi comprimido, e comprimir aqui
    // significa ter apagado o cânone junto.
    expect(
      linhas,
      `${chaves} evidências em ${linhas} linhas: o arquivo foi comprimido e o porquê de cada condição se perdeu junto.`,
    ).toBeGreaterThan(chaves * 3);
  });
});
