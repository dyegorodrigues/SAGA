import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { Question } from "../types";
import { generateRegisteredFichaQuestion } from "./motores/composerCanary";

/**
 * CLASS-006 confirmada por execução no regression-first.
 *
 * N2.06/F38 é controle negativo: não embaralha, mas serializa semanticamente
 * [Par, Ímpar] e o gabarito alterna de posição entre níveis. Os 25 IDs abaixo
 * ficaram com a resposta correta na posição zero em 5 níveis × 8 seeds antes
 * do reparo e possuem ao menos um modo que apresenta a lista à criança.
 */
const CLASS_006_IDS = [
  "N2.07",
  "N4.10", "N4.11",
  "N5.04", "N5.05",
  "N7.01", "N7.02",
  "AL.06", "AL.07",
  "GE.04", "GE.05", "GE.06", "GE.07", "GE.08", "GE.09", "GE.10",
  "GM.06", "GM.07", "GM.08", "GM.09", "GM.10", "GM.11",
  "PE.02", "PE.03", "PE.04",
] as const;

const SEEDS = [1, 7, 42, 99, 123, 777, 2024, 31415] as const;

function comSemente<T>(semente: number, run: () => T): T {
  const original = Math.random;
  let s = semente >>> 0;
  Math.random = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
  try {
    return run();
  } finally {
    Math.random = original;
  }
}

function opcoesDoPalco(q: Question): Array<{ value: unknown }> {
  const ui = q.uiProps as { opcoes?: Array<{ value: unknown }> } | undefined;
  if (Array.isArray(ui?.opcoes)) return ui.opcoes;
  return (q.options ?? []) as Array<{ value: unknown }>;
}

function assinatura(id: typeof CLASS_006_IDS[number], seed: number): string {
  return Array.from({ length: 5 }, (_, index) => {
    const level = index + 1;
    const q = comSemente(seed, () => generateRegisteredFichaQuestion(id, level));
    return opcoesDoPalco(q).map(option => String(option.value)).join("|");
  }).join(" / ");
}

describe("CLASS-006 — posição do gabarito em questão fresca", () => {
  it.each(CLASS_006_IDS)("%s não fixa a correta numa única posição nos casos canônicos", id => {
    const posicoes = new Set<number>();

    for (let level = 1; level <= 5; level += 1) {
      for (const seed of SEEDS) {
        const q = comSemente(seed, () => generateRegisteredFichaQuestion(id, level));
        const options = opcoesDoPalco(q);
        expect(options.length, `${id}/L${level} precisa manter alternativas serializadas`).toBeGreaterThan(1);
        const correta = options.findIndex(option => String(option.value) === String(q.answer));
        expect(correta, `${id}/L${level} perdeu o gabarito durante a serialização`).toBeGreaterThanOrEqual(0);
        posicoes.add(correta);
      }
    }

    expect(
      posicoes.size,
      `${id}: gabarito ficou sempre na posição ${[...posicoes].join(",") || "ausente"} em 5 níveis × ${SEEDS.length} seeds`,
    ).toBeGreaterThan(1);
  });

  it("N2.06 permanece controle negativo: posição varia sem shuffle artificial", () => {
    const posicoes = new Set<number>();
    for (let level = 1; level <= 5; level += 1) {
      const q = generateRegisteredFichaQuestion("N2.06", level);
      const options = opcoesDoPalco(q);
      posicoes.add(options.findIndex(option => String(option.value) === String(q.answer)));
    }
    expect(posicoes.size).toBeGreaterThan(1);
  });

  it("a mesma seed reproduz a mesma permutação", () => {
    const a = CLASS_006_IDS.map(id => `${id}:${assinatura(id, 42)}`).join("\n");
    const b = CLASS_006_IDS.map(id => `${id}:${assinatura(id, 42)}`).join("\n");
    expect(a).toBe(b);
  });
});

function arquivosTsTsx(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return arquivosTsTsx(full);
    return /\.(?:ts|tsx)$/.test(entry.name) ? [full] : [];
  });
}

describe("CLASS-005 — comparador aleatório em Array.sort", () => {
  it("proíbe o comparador aleatório em todo código produtivo de src/", () => {
    const src = path.resolve(process.cwd(), "src");
    const padrao = /\.sort\s*\(\s*\(\s*\)\s*=>\s*Math\.random\s*\(\s*\)\s*-\s*0\.5\s*\)/g;
    const esteTeste = path.resolve(process.cwd(), "src/curriculum/class005006ShufflePolicy.test.ts");
    const ofensores: string[] = [];

    for (const arquivo of arquivosTsTsx(src)) {
      // O próprio regex acima contém a sequência proibida em texto; ele é a
      // sentinela, não código produtivo. Tudo o mais em src/ deve ficar limpo.
      if (path.resolve(arquivo) === esteTeste) continue;
      const texto = fs.readFileSync(arquivo, "utf8");
      for (const match of texto.matchAll(padrao)) {
        const linha = texto.slice(0, match.index).split("\n").length;
        ofensores.push(`${path.relative(process.cwd(), arquivo)}:${linha}`);
      }
    }

    expect(ofensores, `CLASS-005 ainda possui ${ofensores.length} comparadores aleatórios:\n${ofensores.join("\n")}`).toEqual([]);
  });
});
