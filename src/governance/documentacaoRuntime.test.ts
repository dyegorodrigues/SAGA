import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Catraca de densidade documental do runtime sensível.
 *
 * Estes arquivos carregam rationale arquitetural/pedagógico que não pode ser
 * comprimido por refactors mecânicos. Cada caminho tem um piso explícito de
 * linhas de comentário. O piso nunca desce: perda reprova; ganho também exige
 * atualizar a baseline para que a melhora passe a ser protegida.
 *
 * A contagem considera linhas cuja parte não-indentada começa por `//`, `/*`
 * ou `*`. Assim medimos documentação deliberada e não `//` dentro de strings.
 */
const RAIZ = resolve(__dirname, "..", "..");
const CAMINHO_BASELINE = resolve(__dirname, "documentacao-runtime.baseline.json");
const BASELINE: Record<string, number> = JSON.parse(readFileSync(CAMINHO_BASELINE, "utf8"));

const ARQUIVOS_SENSIVEIS = [
  "src/curriculum/Composer.ts",
  "src/components/GameLoop.tsx",
  "AI_Studio_Lab/tools/ficha_runtime_map.cjs",
  "AI_Studio_Lab/tools/coverage_matrix_core.ts",
  "src/constants/misconceptions.ts",
  "src/constants/evidencias.ts",
] as const;

function contarLinhasDeComentario(caminho: string): number {
  const texto = readFileSync(resolve(RAIZ, caminho), "utf8");
  return texto.split(/\r?\n/).filter(linha => {
    const limpa = linha.trimStart();
    return limpa.startsWith("//") || limpa.startsWith("/*") || limpa.startsWith("*");
  }).length;
}

const ATUAL = Object.fromEntries(
  ARQUIVOS_SENSIVEIS.map(caminho => [caminho, contarLinhasDeComentario(caminho)]),
) as Record<string, number>;

describe("catraca de densidade documental do runtime sensível", () => {
  it("a baseline cobre exatamente o cânone nominal sensível", () => {
    expect(Object.keys(BASELINE).sort()).toEqual([...ARQUIVOS_SENSIVEIS].sort());
  });

  it("nenhum arquivo sensível perde linhas de comentário", () => {
    const quedas = ARQUIVOS_SENSIVEIS
      .filter(caminho => ATUAL[caminho] < BASELINE[caminho])
      .map(caminho => `  ${caminho}: ${BASELINE[caminho]} → ${ATUAL[caminho]}`);

    expect(
      quedas,
      [
        "Densidade documental caiu em runtime sensível:",
        ...quedas,
        "",
        "A catraca protege rationale: o piso só sobe.",
      ].join("\n"),
    ).toEqual([]);
  });

  it("o piso sobe junto com toda documentação acrescentada", () => {
    const cresceram = ARQUIVOS_SENSIVEIS
      .filter(caminho => ATUAL[caminho] > BASELINE[caminho])
      .map(caminho => `  ${caminho}: ${BASELINE[caminho]} → ${ATUAL[caminho]}`);

    expect(
      cresceram,
      [
        "Documentação aumentou — registre o novo piso:",
        ...cresceram,
        "",
        "Atualize documentacao-runtime.baseline.json. A catraca só sobe.",
      ].join("\n"),
    ).toEqual([]);
  });
});
