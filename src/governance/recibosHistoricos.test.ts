import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Catraca de recibos históricos.
 *
 * `AI_Studio_Lab/codex/` guarda dois tipos de documento com regimes opostos.
 *
 * **Portas vivas** — `PROMPT_DE_RETOMADA`, `ROADMAP_90_90_CHILD_READY`,
 * `ESTADO_DO_FECHAMENTO` e afins — devem poder encolher. A doutrina do projeto é
 * que a porta operacional seja curta: em 21/08 ela passou de 444 para 156 linhas,
 * e isso foi correto, porque regra vinculante e recibo permaneceram.
 *
 * **Documentos históricos** — checkpoints, relatórios de lote, auditorias, erratas
 * e decisões — são recibo. Registram SHA, run de CI, Matrix observada e a cadeia
 * causal de cada onda. Não se comprimem: são a prova de que o trabalho aconteceu
 * como está escrito, e nada os regenera.
 *
 * Hoje são 83 arquivos e cerca de 16,7 mil linhas sem portão. A compressão de
 * cânone já ocorreu três vezes neste repositório — `ficha_runtime_map.cjs` na W36,
 * `Composer.ts` e `GameLoop.tsx` no reparo CLASS-005/006 — sempre por regeneração
 * mecânica, sempre com CI verde, porque nada testa prosa.
 *
 * Esta catraca fecha esse caminho: documento histórico só cresce.
 */
const RAIZ = resolve(__dirname, "..", "..");
const CODEX = join("AI_Studio_Lab", "codex");
const CAMINHO_BASELINE = resolve(__dirname, "recibos-historicos.baseline.json");
const BASELINE: Record<string, number> = JSON.parse(readFileSync(CAMINHO_BASELINE, "utf8"));

/** Prefixos que identificam recibo. Documento sem esses prefixos é porta viva. */
const PREFIXOS_HISTORICOS = ["CHECKPOINT_", "GATE_B_", "AUDITORIA_", "ERRATA_", "DECISAO_"];

function ehHistorico(nome: string): boolean {
  return nome.endsWith(".md") && PREFIXOS_HISTORICOS.some(p => nome.startsWith(p));
}

function contarLinhas(caminho: string): number {
  return readFileSync(resolve(RAIZ, caminho), "utf8").split(/\r?\n/).length;
}

const HISTORICOS = readdirSync(resolve(RAIZ, CODEX))
  .filter(ehHistorico)
  .map(nome => `${CODEX.split(/[\\/]/).join("/")}/${nome}`)
  .sort();

const ATUAL: Record<string, number> = Object.fromEntries(
  HISTORICOS.map(caminho => [caminho, contarLinhas(caminho)]),
);

describe("catraca de recibos históricos", () => {
  it("todo documento histórico tem piso registrado", () => {
    const fora = HISTORICOS
      .filter(caminho => !(caminho in BASELINE))
      .map(caminho => `  ${caminho}: ${ATUAL[caminho]} linhas, fora da catraca`);

    expect(
      fora,
      [
        "Documento histórico sem piso registrado:",
        ...fora,
        "",
        "Checkpoint, relatório de lote, auditoria, errata e decisão são recibo.",
        "Registre o piso em recibos-historicos.baseline.json.",
      ].join("\n"),
    ).toEqual([]);
  });

  it("nenhum recibo histórico foi apagado", () => {
    const sumidos = Object.keys(BASELINE).filter(caminho => !(caminho in ATUAL));

    expect(
      sumidos,
      ["Recibo histórico desapareceu:", ...sumidos.map(c => `  ${c}`)].join("\n"),
    ).toEqual([]);
  });

  it("nenhum recibo histórico encolheu", () => {
    const quedas = Object.keys(BASELINE)
      .filter(caminho => caminho in ATUAL && ATUAL[caminho] < BASELINE[caminho])
      .map(caminho => `  ${caminho}: ${BASELINE[caminho]} → ${ATUAL[caminho]} linhas`);

    expect(
      quedas,
      [
        "Recibo histórico foi comprimido:",
        ...quedas,
        "",
        "Histórico registra SHA, run de CI e cadeia causal. Nada o regenera.",
        "Corrija o documento em vez de baixar o piso.",
      ].join("\n"),
    ).toEqual([]);
  });
});
