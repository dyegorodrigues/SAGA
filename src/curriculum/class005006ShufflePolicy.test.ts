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
const CLASS_006_SAMPLES_PER_PAIR = 200;

/**
 * Quantos desvios-padrão acima do uniforme antes de reprovar.
 *
 * Limiar fixo não serve: com `k` alternativas o esperado é `1/k`, então 60% é
 * severo demais para uma questão de duas alternativas — onde o próprio acaso
 * ultrapassa 60% com frequência — e frouxo demais para uma de quatro, em que 55%
 * já é o dobro do esperado e passaria batido.
 *
 * O limiar aqui é `1/k + 4σ`, com `σ = sqrt(p(1-p)/n)`. Quatro desvios deixam a
 * chance de falso positivo por par na casa de 1 em dezenas de milhares, o que
 * mantém a suíte estável nas ~293 medições sem perder viés real: qualquer
 * concentração de origem estrutural fica ordens de grandeza acima disso.
 */
const CLASS_006_SIGMAS = 4;

function limiarDeConcentracao(alternativas: number, amostras: number): number {
  const uniforme = 1 / alternativas;
  const sigma = Math.sqrt((uniforme * (1 - uniforme)) / amostras);
  return Math.min(0.99, uniforme + CLASS_006_SIGMAS * sigma);
}

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

/**
 * Identidade de uma alternativa.
 *
 * A maioria dos palcos serializa `value`; F30 serializa `valor`; `shapecanvas`
 * (GE.02) serializa a figura — `{ cor, figura, giro, tamanho }` — e o gabarito é
 * o nome da figura. Sem reconhecer isso, a medição não encontrava o gabarito e a
 * competência saía silenciosamente da amostra: um ponto cego dentro do portão
 * criado justamente para não ter pontos cegos.
 *
 * Chave desconhecida continua caindo em `perdasDeGabarito`, que reprova. Formato
 * novo não some da medição — aparece como falha.
 */
const CHAVES_DE_IDENTIDADE = ["value", "valor", "figura"] as const;

function valorDaOpcao(option: { value: unknown } | unknown): unknown {
  if (typeof option === "object" && option !== null) {
    for (const chave of CHAVES_DE_IDENTIDADE) {
      if (chave in option) return (option as Record<string, unknown>)[chave];
    }
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
        // Agrupado por número de alternativas: o mesmo par pode gerar listas de
        // tamanhos diferentes quando alternativas duplicadas colapsam. Misturar
        // tamanhos sub-representa as últimas posições e cria falso positivo — a
        // posição 3 só existe nas amostras que tiveram 4 alternativas.
        const porTamanho = new Map<number, Map<number, number>>();
        const totalPorTamanho = new Map<number, number>();
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
            const k = options.length;
            if (!porTamanho.has(k)) porTamanho.set(k, new Map());
            const contagens = porTamanho.get(k) as Map<number, number>;
            contagens.set(correta, (contagens.get(correta) ?? 0) + 1);
            totalPorTamanho.set(k, (totalPorTamanho.get(k) ?? 0) + 1);
          }
        });

        if (totalElegivel === 0) continue;
        paresMedidos += 1;

        for (const [k, contagens] of [...porTamanho].sort(([a], [b]) => a - b)) {
          const total = totalPorTamanho.get(k) as number;
          // Amostra pequena demais não decide nada: o desvio esperado engole o sinal.
          if (total < 30) continue;
          const maior = Math.max(...contagens.values());
          const concentracao = maior / total;
          const limiar = limiarDeConcentracao(k, total);
          if (concentracao >= limiar) {
            violacoes.push(
              `${id}/L${level} com ${k} alternativas: distribuição ` +
              `[${formatarDistribuicao(contagens, total)}] ` +
              `(máx ${(concentracao * 100).toFixed(1)}% >= limiar ${(limiar * 100).toFixed(1)}%)`,
            );
          }
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
      `(${CLASS_006_SAMPLES_PER_PAIR} amostras por par, limiar 1/k + ${CLASS_006_SIGMAS}σ):\n${violacoes.join("\n")}`,
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
