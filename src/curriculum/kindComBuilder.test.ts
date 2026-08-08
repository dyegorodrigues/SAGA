import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Composer } from "./Composer";
import { FichaCompetencia, KindType } from "./schema";
import type { Question } from "../types";

/**
 * P18 — o tipo autoral não pode prometer uma tela que o Composer não sabe montar.
 *
 * Antes deste fechamento, nove nomes legados/futuros estavam em `KindType` sem
 * builder. Isso fazia uma ficha autoral COMPILAR e só quebrar na geração diante
 * da criança. A auditoria AST `AUDITORIA_P18_KINDS.md` provou que nenhum dos nove
 * é usado hoje por uma ficha TypeScript real.
 *
 * `Question.kind` continua `string`: retirar um nome do `KindType` NÃO remove
 * geradores/renderers legados. Apenas fecha a API autoral até que uma futura
 * ficha traga contrato + builder + renderer + teste no mesmo lote.
 */

const LEGADO_OU_FUTURO_FORA_DA_API_AUTORAL = [
  "linking-cubes",
  "missing-addend-frame",
  "multiple_choice",
  "sentencebuilder",
  "sequence",
  "singaporebars",
  "subvis",
  "take-apart",
  "visual-addition",
] as const;

/** Os `case` do `switch` que escolhe o builder, lidos do próprio Composer. */
function kindsComBuilder(): Set<string> {
  const fonte = readFileSync(join(__dirname, "Composer.ts"), "utf8");
  return new Set([...fonte.matchAll(/case ["']([a-z_-]+)["']/g)].map(m => m[1]));
}

/** Todo valor do `KindType`, lido do próprio schema. */
function todosOsKinds(): string[] {
  const fonte = readFileSync(join(__dirname, "schema.ts"), "utf8");
  const linha = /export type KindType = ([^;]+);/.exec(fonte);
  if (!linha) throw new Error("KindType não encontrado em schema.ts");
  return [...linha[1].matchAll(/"([a-z_-]+)"/g)].map(m => m[1]);
}

describe("P18 — todo KindType autoral tem builder real", () => {
  const comBuilder = kindsComBuilder();
  const todos = todosOsKinds();

  it("o inventário foi lido e contém primitivas autorais recentes", () => {
    expect(todos.length).toBeGreaterThan(20);
    expect(todos).toContain("moldura");
    expect(todos).toContain("medidas");
    expect(comBuilder).toContain("touchplace");
  });

  it("⚠️ não existe mais exceção: todo kind que a ficha pode declarar tem builder", () => {
    const orfaos = todos.filter(k => !comBuilder.has(k));
    expect(orfaos, `kind(s) autoral(is) sem builder: ${orfaos.join(", ")}`)
      .toEqual([]);
  });

  it("legado e contratos futuros não vazam de volta para KindType", () => {
    for (const kind of LEGADO_OU_FUTURO_FORA_DA_API_AUTORAL) {
      expect(todos, `"${kind}" voltou a prometer um builder que não existe`).not.toContain(kind);
    }
  });

  it("retirar do KindType não proíbe Question.kind legado", () => {
    // Este objeto compilar é a prova importante: Question.kind continua string.
    // Portanto saves/geradores legados podem atravessar a transição sem que uma
    // ficha AUTORAL possa declarar a mesma API incompleta.
    const legado: Question = {
      kind: "multiple_choice",
      prompt: "fallback legado",
      answer: 1,
    };
    expect(legado.kind).toBe("multiple_choice");
  });

  it("o Composer continua quebrando alto para um kind forjado fora do contrato", () => {
    const kindMorto = "kind-inexistente" as KindType;
    const ficha = {
      id: "TESTE.01",
      nome: "ficha só para este teste",
      strand: "N1",
      faixa: "F0",
      prereqs: [],
      bncc: "—",
      howto: "—",
      explain: "—",
      distratores: [],
      niveis: { 1: { primitiva: kindMorto, micro: "m" } },
      micros: [{
        id: "m", fonte: "—", alvo: "—",
        kinds: [kindMorto], params: {},
        dominio: { acertos: 3, de: 3, sessoes: 1 },
      }],
      erros_tipicos: [],
    } as unknown as FichaCompetencia;

    expect(() => Composer.generate(ficha, 1)).toThrow(/builder/);
  });
});
