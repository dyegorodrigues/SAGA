import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { Question } from "../types";
import { COMPOSER_CANARIES, generateRegisteredFichaQuestion } from "./motores/composerCanary";

/**
 * CLASS-006 — invariant estrutural por medição, sem allowlist de inclusão.
 *
 * A criança pratica um nível por vez. Portanto variar a posição do gabarito
 * entre níveis NÃO basta: para cada canário ativo e para cada nível que
 * serializa alternativas, a distribuição precisa variar dentro do próprio
 * nível ao longo do corpus gerável.
 *
 * Este gate mede a propriedade observável. Ele não conhece uma lista manual
 * de competências "suspeitas" e, assim, novos canários entram na prova
 * automaticamente.
 */
const CLASS_006_SAMPLES_PER_PAIR = 120;
const CLASS_006_MAX_POSITION_SHARE = 0.60;

function seedFrom(text: string): number {
  let hash = 2166136261;
  for (const char of text) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

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

function valorDaOpcao(option: { value: unknown } | unknown): unknown {
  if (typeof option === "object" && option !== null && "value" in option) {
    return (option as { value: unknown }).value;
  }
  return option;
}

function formatarDistribuicao(contagens: Map<number, number>, total: number): string {
  return [...contagens.entries()]
    .sort(([a], [b]) => a - b)
    .map(([posicao, quantidade]) => `${posicao}:${quantidade}/${total} (${((quantidade / total) * 100).toFixed(1)}%)`)
    .join(", ");
}

describe("CLASS-006 — posição do gabarito em questão fresca", () => {
  it("mede todos os canários ativos, nível a nível, e reprova concentração posicional", () => {
    const violacoes: string[] = [];
    const perdasDeGabarito: string[] = [];
    let paresMedidos = 0;

    for (const id of [...COMPOSER_CANARIES].sort()) {
      for (let level = 1; level <= 5; level += 1) {
        const contagens = new Map<number, number>();
        let totalElegivel = 0;

        comSemente(seedFrom(`${id}/L${level}`), () => {
          for (let amostra = 0; amostra < CLASS_006_SAMPLES_PER_PAIR; amostra += 1) {
            const q = generateRegisteredFichaQuestion(id, level);
            const options = opcoesDoPalco(q);
            if (options.length < 2) continue;

            const correta = options.findIndex(option => String(valorDaOpcao(option)) === String(q.answer));
            if (correta < 0) {
              perdasDeGabarito.push(`${id}/L${level}/A${amostra + 1}: ${options.length} alternativas sem gabarito serializado`);
              continue;
            }

            totalElegivel += 1;
            contagens.set(correta, (contagens.get(correta) ?? 0) + 1);
          }
        });

        if (totalElegivel === 0) continue;
        paresMedidos += 1;

        const maior = Math.max(...contagens.values());
        const concentracao = maior / totalElegivel;
        if (concentracao >= CLASS_006_MAX_POSITION_SHARE) {
          violacoes.push(
            `${id}/L${level}: distribuição [${formatarDistribuicao(contagens, totalElegivel)}] ` +
            `(máx ${(concentracao * 100).toFixed(1)}% >= ${(CLASS_006_MAX_POSITION_SHARE * 100).toFixed(0)}%)`,
          );
        }
      }
    }

    expect(
      perdasDeGabarito,
      `CLASS-006 perdeu o gabarito durante a serialização:\n${perdasDeGabarito.join("\n")}`,
    ).toEqual([]);

    expect(paresMedidos, "CLASS-006 precisa medir ao menos um par competência/nível com alternativas").toBeGreaterThan(0);
    expect(
      violacoes,
      `CLASS-006 detectou concentração posicional em ${violacoes.length}/${paresMedidos} pares medidos ` +
      `(${CLASS_006_SAMPLES_PER_PAIR} amostras por par):\n${violacoes.join("\n")}`,
    ).toEqual([]);
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
