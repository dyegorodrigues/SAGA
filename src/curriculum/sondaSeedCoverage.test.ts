import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import YAML from "yaml";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (...parts: string[]) => readFileSync(resolve(ROOT, ...parts), "utf8");

function sementesCanonicas(): number[] {
  const source = read("sonda", "cenas.tsx");
  const match = source.match(/const TODAS_AS_SEMENTES\s*=\s*\[([^\]]+)\]/);
  if (!match) throw new Error("TODAS_AS_SEMENTES não encontrada em sonda/cenas.tsx");
  return match[1]
    .split(",")
    .map(item => Number(item.trim()))
    .filter(Number.isFinite);
}

describe("portão transversal por semente", () => {
  it("a união dos oito jobs coincide exatamente com TODAS_AS_SEMENTES", () => {
    const canonicas = sementesCanonicas();
    const workflow = YAML.parse(read(".github", "workflows", "certificacao-transversal.yml"));
    const include = workflow.jobs["sonda-transversal-portao"].strategy.matrix.include as Array<{
      semente: number;
      prefixo: number;
    }>;

    const sementesDosJobs = include.map(item => Number(item.semente));
    expect(sementesDosJobs).toEqual(canonicas);
    expect(sementesDosJobs).toHaveLength(8);
    expect(new Set(sementesDosJobs).size).toBe(8);

    const prefixos = include.map(item => Number(item.prefixo));
    expect(prefixos).toEqual(canonicas.map((_, index) => index + 1));
    for (const item of include) {
      expect(canonicas.slice(0, item.prefixo).at(-1)).toBe(item.semente);
    }
  });
});
