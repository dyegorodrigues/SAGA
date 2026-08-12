import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { Composer } from "./Composer";
import { FichaCompetencia, KindType } from "./schema";
import { generateRegisteredFichaQuestion } from "./motores/composerCanary";
import type { Question } from "../types";

/**
 * P18 — o tipo autoral não pode prometer uma tela que não possua caminho de
 * construção real.
 *
 * Regra vigente: um `KindType` precisa de UM destes caminhos, comprovado por
 * código e não por lista de exceções:
 *
 * 1. builder genérico em `Composer.ts`; ou
 * 2. todas as fichas runtime que usam aquele kind possuem builder especializado
 *    registrado em `composerCanary.ts`.
 *
 * O segundo caso existe para contratos deliberadamente ficha-específicos, como
 * F61/GM.05 e F13/N3.01: criar um case genérico que só aceita uma competência
 * seria uma segunda porta morta para a mesma implementação. A prova
 * especializada continua estrita: kind sem consumidor, consumidor sem builder
 * ou ID divergente falha.
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
] as const;

function kindsComBuilderGenerico(): Set<string> {
  const fonte = readFileSync(join(__dirname, "Composer.ts"), "utf8");
  return new Set([...fonte.matchAll(/case ["']([a-z_-]+)["']/g)].map(m => m[1]));
}

function idsComBuilderEspecializado(): Set<string> {
  const fonte = readFileSync(join(__dirname, "motores/composerCanary.ts"), "utf8");
  const bloco = fonte.match(/const SPECIALIZED_BUILDERS[\s\S]*?=\s*\{([\s\S]*?)\n\};/);
  return new Set(
    bloco
      ? [...bloco[1].matchAll(/["']((?:N[1-7]|AL|GE|GM|PE)\.\d{2})["']\s*:\s*construir[A-Za-z0-9_]+/g)].map(m => m[1])
      : [],
  );
}

function todosOsKinds(): string[] {
  const fonte = readFileSync(join(__dirname, "schema.ts"), "utf8");
  const linha = /export type KindType = ([^;]+);/.exec(fonte);
  if (!linha) throw new Error("KindType não encontrado em schema.ts");
  return [...linha[1].matchAll(/"([a-z_-]+)"/g)].map(m => m[1]);
}

interface UsoDeKind { id: string; kind: string; file: string }
function usosRuntimeDeKind(): UsoDeKind[] {
  const dir = join(__dirname, "fichas/jornada");
  const usos: UsoDeKind[] = [];
  for (const file of readdirSync(dir).filter(name => name.endsWith(".ts") && !name.endsWith(".test.ts"))) {
    const fonte = readFileSync(join(dir, file), "utf8");
    const id = fonte.match(/\bid:\s*["']((?:N[1-7]|AL|GE|GM|PE)\.\d{2})["']/)?.[1];
    if (!id) continue;
    for (const match of fonte.matchAll(/\bprimitiva:\s*["']([a-z_-]+)["']/g)) {
      usos.push({ id, kind: match[1], file });
    }
    for (const match of fonte.matchAll(/\bkinds:\s*\[([^\]]+)\]/g)) {
      for (const kind of match[1].matchAll(/["']([a-z_-]+)["']/g)) {
        usos.push({ id, kind: kind[1], file });
      }
    }
  }
  return usos;
}

describe("P18 — todo KindType autoral tem caminho de builder real", () => {
  const genericos = kindsComBuilderGenerico();
  const especializados = idsComBuilderEspecializado();
  const todos = todosOsKinds();
  const usos = usosRuntimeDeKind();

  it("o inventário foi lido e contém primitivas autorais recentes", () => {
    expect(todos.length).toBeGreaterThan(20);
    expect(todos).toContain("moldura");
    expect(todos).toContain("medidas");
    expect(todos).toContain("regua");
    expect(todos).toContain("visual-addition");
    expect(genericos).toContain("touchplace");
    expect(especializados).toContain("GM.05");
    expect(especializados).toContain("N3.01");
  });

  it("todo kind tem builder genérico ou é usado só por fichas com builder especializado", () => {
    const semCaminho: string[] = [];
    for (const kind of todos) {
      if (genericos.has(kind)) continue;
      const consumidores = [...new Set(usos.filter(uso => uso.kind === kind).map(uso => uso.id))];
      if (!consumidores.length || consumidores.some(id => !especializados.has(id))) {
        semCaminho.push(`${kind}[${consumidores.join(",") || "sem-consumidor"}]`);
      }
    }
    expect(semCaminho, `kind(s) autoral(is) sem caminho de builder: ${semCaminho.join(", ")}`)
      .toEqual([]);
  });

  it("builders especializados recentes são executáveis pela porta registrada", () => {
    const f61 = generateRegisteredFichaQuestion("GM.05", 3);
    expect(f61.kind).toBe("regua-f61");
    expect(f61.uiProps).toEqual(expect.objectContaining({ modo: "alinhar", unidade: "cm" }));

    const f13 = generateRegisteredFichaQuestion("N3.01", 4);
    expect(f13.kind).toBe("visual-addition-f13");
    expect(f13.uiProps).toEqual(expect.objectContaining({ nivel: 4, representacao: "numerais" }));
  });

  it("legado e contratos futuros não vazam de volta para KindType", () => {
    for (const kind of LEGADO_OU_FUTURO_FORA_DA_API_AUTORAL) {
      expect(todos, `"${kind}" voltou a prometer um builder que não existe`).not.toContain(kind);
    }
  });

  it("retirar do KindType não proíbe Question.kind legado", () => {
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
