import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Catraca de densidade documental do runtime.
 *
 * Estes arquivos carregam rationale arquitetural e pedagógico que não pode ser
 * comprimido por refactor mecânico. Cada caminho tem um piso explícito de linhas
 * de comentário: perda reprova, e ganho também exige atualizar a baseline, para
 * que a melhora passe a ser protegida. O piso só sobe.
 *
 * Por que descoberta automática e não lista fixa. A primeira versão desta catraca
 * nomeava seis arquivos à mão. Uma varredura mostrou 64 arquivos de runtime com
 * 40 ou mais linhas de comentário, dos quais 60 ficavam de fora — inclusive os
 * dois mais documentados do projeto, `emojiRowProcedure.ts` com 300 linhas e
 * `emojiRowContract.ts` com 264, ambos com o dobro da documentação do Composer.
 * Lista escrita à mão protege o que alguém lembrou de escrever; a regra abaixo
 * protege o que existe.
 *
 * A contagem considera linhas cuja parte não-indentada começa por `//`, `/*` ou
 * `*`. Assim medimos documentação deliberada e não `//` dentro de string.
 */
const RAIZ = resolve(__dirname, "..", "..");
const CAMINHO_BASELINE = resolve(__dirname, "documentacao-runtime.baseline.json");
const BASELINE: Record<string, number> = JSON.parse(readFileSync(CAMINHO_BASELINE, "utf8"));

/** Abaixo disto o arquivo não carrega rationale suficiente para justificar o custo do portão. */
const LIMIAR = 20;

/** Raízes varridas. Runtime e ferramentas de cânone; teste e build ficam de fora. */
const RAIZES = ["src", join("AI_Studio_Lab", "tools")];

/**
 * Cânone nominal: protegido sempre, mesmo que a documentação caia abaixo do
 * limiar. Sem isto, esvaziar um arquivo até 19 linhas o removeria do portão —
 * exatamente o movimento que a catraca existe para impedir.
 */
const CANONE_NOMINAL = [
  "src/curriculum/Composer.ts",
  "src/components/GameLoop.tsx",
  "src/curriculum/motores/composerCanaryIds.ts",
  "src/constants/misconceptions.ts",
  "src/constants/evidencias.ts",
  "AI_Studio_Lab/tools/ficha_runtime_map.cjs",
  "AI_Studio_Lab/tools/coverage_matrix_core.ts",
];

const EXTENSOES = [".ts", ".tsx", ".cjs", ".mjs"];

function ehTeste(nome: string): boolean {
  return nome.includes(".test.") || nome.includes(".spec.");
}

function listar(dir: string, saida: string[] = []): string[] {
  for (const entrada of readdirSync(dir)) {
    const caminho = join(dir, entrada);
    if (statSync(caminho).isDirectory()) {
      if (entrada === "node_modules") continue;
      listar(caminho, saida);
      continue;
    }
    if (!EXTENSOES.some(ext => entrada.endsWith(ext))) continue;
    if (ehTeste(entrada)) continue;
    saida.push(relative(RAIZ, caminho).split(sep).join("/"));
  }
  return saida;
}

function contarLinhasDeComentario(caminho: string): number {
  const texto = readFileSync(resolve(RAIZ, caminho), "utf8");
  return texto.split(/\r?\n/).filter(linha => {
    const limpa = linha.trimStart();
    return limpa.startsWith("//") || limpa.startsWith("/*") || limpa.startsWith("*");
  }).length;
}

const TODOS = RAIZES.flatMap(raiz => listar(resolve(RAIZ, raiz)));
const ATUAL: Record<string, number> = Object.fromEntries(
  TODOS.map(caminho => [caminho, contarLinhasDeComentario(caminho)]),
);

/** O que o portão deve cobrir agora: tudo acima do limiar, mais o cânone nominal. */
const DEVE_COBRIR = [...new Set([
  ...TODOS.filter(caminho => ATUAL[caminho] >= LIMIAR),
  ...CANONE_NOMINAL,
])].sort();

describe("catraca de densidade documental do runtime", () => {
  it("todo arquivo documentado de runtime está na baseline", () => {
    const fora = DEVE_COBRIR
      .filter(caminho => !(caminho in BASELINE))
      .map(caminho => `  ${caminho}: ${ATUAL[caminho]} linhas de comentário, fora da catraca`);

    expect(
      fora,
      [
        "Arquivo de runtime documentado sem piso registrado:",
        ...fora,
        "",
        `Todo arquivo com ${LIMIAR}+ linhas de comentário entra na catraca.`,
        "Rode a atualização da baseline e registre o piso.",
      ].join("\n"),
    ).toEqual([]);
  });

  it("a baseline não guarda caminho que deixou de existir", () => {
    const orfaos = Object.keys(BASELINE).filter(caminho => !(caminho in ATUAL));

    expect(
      orfaos,
      ["Baseline aponta para arquivo inexistente:", ...orfaos.map(c => `  ${c}`)].join("\n"),
    ).toEqual([]);
  });

  it("nenhum arquivo coberto perde linhas de comentário", () => {
    const quedas = Object.keys(BASELINE)
      .filter(caminho => caminho in ATUAL && ATUAL[caminho] < BASELINE[caminho])
      .map(caminho => `  ${caminho}: ${BASELINE[caminho]} → ${ATUAL[caminho]}`);

    expect(
      quedas,
      [
        "Densidade documental caiu no runtime:",
        ...quedas,
        "",
        "A catraca protege rationale: o piso só sobe.",
      ].join("\n"),
    ).toEqual([]);
  });

  it("o piso sobe junto com toda documentação acrescentada", () => {
    const cresceram = Object.keys(BASELINE)
      .filter(caminho => caminho in ATUAL && ATUAL[caminho] > BASELINE[caminho])
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
