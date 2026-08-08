import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();
const self = path.join(ROOT, "src/p22_3a_apply.test.ts");
const composerPath = path.join(ROOT, "src/curriculum/Composer.ts");
const fichaPath = path.join(ROOT, "src/curriculum/fichas/jornada/N1.07.ts");
const testPath = path.join(ROOT, "src/curriculum/fichas/jornada/N1.07.test.ts");
const canonPath = path.join(ROOT, "AI_Studio_Lab/pedagogia/fichas/FICHAS_F0_COMPLETAS.md");

const original = {
  composer: fs.readFileSync(composerPath, "utf8"),
  ficha: fs.readFileSync(fichaPath, "utf8"),
  canon: fs.readFileSync(canonPath, "utf8"),
  testExisted: fs.existsSync(testPath),
  test: fs.existsSync(testPath) ? fs.readFileSync(testPath, "utf8") : "",
};

function atomicWrite(file: string, content: string) {
  const tmp = `${file}.p22tmp`;
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, file);
}

function run(command: string, args: string[], env?: NodeJS.ProcessEnv) {
  execFileSync(command, args, {
    cwd: ROOT,
    env: { ...process.env, ...env },
    stdio: "inherit",
  });
}

function restore() {
  atomicWrite(composerPath, original.composer);
  atomicWrite(fichaPath, original.ficha);
  atomicWrite(canonPath, original.canon);
  if (original.testExisted) atomicWrite(testPath, original.test);
  else fs.rmSync(testPath, { force: true });
  fs.rmSync(self, { force: true });
}

function applyPatch() {
  let composer = original.composer;
  const plainAnchor = `        case "plain": {\n          const fixedAnswer = params.answer;`;
  if (!composer.includes(plainAnchor)) throw new Error("P22.3A: ancora plain nao encontrada");
  const orderingBlock = `        case "plain": {\n          // P22.3A — ordenação de N1.07 após retirar a reta numérica.\n          // Opt-in por \`mode\`; o comportamento genérico de plain permanece intacto.\n          if (params.mode === "ordering") {\n            const start = Number(params.start ?? 1);\n            const end = Number(params.end ?? 10);\n            const minCount = Number(params.count_min ?? 3);\n            const maxCount = Number(params.count_max ?? 4);\n            const count = randomInt(minCount, maxCount);\n            if (!Number.isFinite(start) || !Number.isFinite(end) || count < 3 || end - start + 1 < count) {\n              throw new Error(\`Parâmetros inválidos para ordenação em \${micro.id}.\`);\n            }\n            const first = randomInt(start, end - count + 1);\n            const ascending = Array.from({ length: count }, (_, index) => first + index);\n            const correct = ascending.join(" → ");\n            const reversed = [...ascending].reverse();\n            const swapped = [...ascending];\n            [swapped[0], swapped[1]] = [swapped[1], swapped[0]];\n            const rotated = [...ascending.slice(1), ascending[0]];\n            const sequences = Array.from(new Set([ascending, reversed, swapped, rotated]\n              .map(sequence => sequence.join(" → "))));\n            const options = sequences.slice(0, 4)\n              .map(sequence => ({\n                label: sequence,\n                value: sequence,\n                ...(sequence === correct ? {} : { misconception: MisconceptionTag.ORDEM_ERRADA }),\n              }))\n              .sort(() => Math.random() - 0.5);\n            const cards = [...ascending].sort(() => Math.random() - 0.5);\n            return {\n              ...base,\n              kind: "plain",\n              prompt: String(params.audio_prompt ?? "Coloque os números do menor para o maior."),\n              big: cards.join("   "),\n              options,\n              answer: correct,\n              uiProps: { ...params, text: cards.join("   "), cards },\n              evaluate: ans => String(ans) === correct,\n              howto: "Comece pelo menor e siga a ordem da contagem.",\n              explain: "Ordenar é colocar os números na mesma ordem em que aparecem quando contamos.",\n            };\n          }\n\n          const fixedAnswer = params.answer;`;
  composer = composer.replace(plainAnchor, orderingBlock);
  const oldPrompt = `          promptOverride = "Qual número vem depois?";`;
  if (!composer.includes(oldPrompt)) throw new Error("P22.3A: ancora de prompt plain nao encontrada");
  composer = composer.replace(oldPrompt, `          promptOverride = jump < 0 ? "Qual número vem antes?" : "Qual número vem depois?";`);
  atomicWrite(composerPath, composer);

  atomicWrite(fichaPath, `import { FichaCompetencia } from "../../schema";

/**
 * N1.07 — ordem, sucessor e antecessor até 10.
 *
 * A Jornada ensina/observa o conceito completo. JD4 automatiza depois;
 * automaticidade nunca substitui esta compreensão.
 */
export const N1_07: FichaCompetencia = {
  id: "N1.07",
  nome: "Ordem, sucessor e antecessor até 10",
  strand: "N1",
  faixa: "F0",
  prereqs: ["N1.02", "N1.06"],
  bncc: "EF01MA01",

  howto: "Use a ordem da contagem para descobrir quem vem antes, quem vem depois e como colocar os números em sequência.",
  explain: "O antecessor vem imediatamente antes; o sucessor vem imediatamente depois.",

  niveis: {
    1: { primitiva: "numberline", micro: "a", andaime: "mao_fantasma" },
    2: { primitiva: "numberline", micro: "b", andaime: "alto" },
    3: { primitiva: "plain", micro: "c", andaime: "medio" },
    4: { primitiva: "plain", micro: "d", andaime: "minimo" },
    5: { primitiva: "plain", micro: "e", rt_alvo: 3000 },
  },

  micros: [
    { id: "a", fonte: "JD4", alvo: "identificar o sucessor até 5 com apoio da reta", kinds: ["numberline"], params: { start: 1, end: 5, jump_size: 1, audio_prompt: "Qual número vem depois?" }, dominio: { acertos: 3, de: 3, sessoes: 2 } },
    { id: "b", fonte: "JD4", alvo: "identificar o sucessor até 10 com apoio reduzido", kinds: ["numberline"], params: { start: 1, end: 10, jump_size: 1, audio_prompt: "Qual número vem depois?" }, dominio: { acertos: 3, de: 3, sessoes: 2 } },
    { id: "c", fonte: "JD4", alvo: "identificar o antecessor até 5", kinds: ["plain"], params: { start: 2, end: 4, jump_size: -1, audio_prompt: "Qual número vem antes?" }, dominio: { acertos: 3, de: 3, sessoes: 2 } },
    { id: "d", fonte: "JD4", alvo: "identificar o antecessor até 10", kinds: ["plain"], params: { start: 2, end: 9, jump_size: -1, audio_prompt: "Qual número vem antes?" }, dominio: { acertos: 3, de: 3, sessoes: 2 } },
    { id: "e", fonte: "GRAFO_N1.07", alvo: "ordenar de 3 a 4 numerais consecutivos em ordem crescente", kinds: ["plain"], params: { mode: "ordering", start: 1, end: 10, count_min: 3, count_max: 4, audio_prompt: "Coloque os números do menor para o maior." }, dominio: { acertos: 4, de: 5, sessoes: 2 } },
  ],

  erros_tipicos: [
    { id: "direcao_invertida", descricao: "Confunde antes e depois e se move para o lado oposto na sequência." },
    { id: "repete_estimulo", descricao: "Repete o número apresentado em vez de escolher seu vizinho." },
    { id: "ordem_errada", descricao: "Reconhece os numerais isolados, mas não os organiza na sequência crescente." },
  ],
};
`);

  atomicWrite(testPath, `import { describe, expect, it } from "vitest";
import { Composer } from "../../Composer";
import { misconceptionForAnswer } from "../../../components/gameloop/answerPolicy";
import { N1_07 } from "./N1.07";

const sample = (level: number, n = 100) => Array.from({ length: n }, () => Composer.generate(N1_07, level));

describe("N1.07 — ordem, sucessor e antecessor", () => {
  it("usa os pré-requisitos canônicos", () => {
    expect(N1_07.prereqs).toEqual(["N1.02", "N1.06"]);
    expect(N1_07.micros.map(m => m.id)).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("L1–L2 observam sucessor", () => {
    for (const level of [1, 2]) for (const q of sample(level)) {
      expect(q.kind).toBe("numberline");
      expect(Number(q.answer)).toBe(Number(q.nlStartPos) + 1);
      expect(q.evaluate?.(q.answer)).toBe(true);
    }
  });

  it("L3–L4 observam antecessor sem número negativo", () => {
    for (const level of [3, 4]) for (const q of sample(level)) {
      expect(q.kind).toBe("plain");
      expect(q.prompt.toLowerCase()).toContain("antes");
      expect(Number(q.answer)).toBe(Number(q.big) - 1);
      expect(Number(q.answer)).toBeGreaterThanOrEqual(1);
      expect(q.evaluate?.(q.answer)).toBe(true);
    }
  });

  it("L5 ordena 3–4 numerais e só diagnostica erros", () => {
    for (const q of sample(5, 160)) {
      const correct = String(q.answer);
      const numbers = correct.split("→").map(v => Number(v.trim()));
      expect([3, 4]).toContain(numbers.length);
      expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
      expect(new Set(numbers).size).toBe(numbers.length);
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
      expect(q.options?.filter(o => String(o.value) === correct)).toHaveLength(1);
      for (const option of q.options ?? []) if (String(option.value) !== correct) expect(option.misconception).toBe("ORDEM_ERRADA");
    }
  });

  it("mantém de 2 a 4 alternativas", () => {
    for (let level = 1; level <= 5; level += 1) for (const q of sample(level)) {
      expect(q.options?.length ?? 0).toBeGreaterThanOrEqual(2);
      expect(q.options?.length ?? 0).toBeLessThanOrEqual(4);
    }
  });
});
`);

  let canon = original.canon;
  const oldIdentity = "**Competência:** N1.07 (sucessor e antecessor) · **Primitiva:** `AudioChoice` + `NumberLine` · **Faixa:** F0 · **Também é trilha do Dojo (JD4)**";
  const newIdentity = "**Competência:** N1.07 (ordem, sucessor e antecessor) · **Primitiva:** `AudioChoice` + `NumberLine` + `plain` · **Faixa:** F0 · **Também é trilha do Dojo (JD4)**";
  if (!canon.includes(oldIdentity)) throw new Error("P22.3A: identidade JD4 nao encontrada");
  canon = canon.replace(oldIdentity, newIdentity);
  const foundation = "**O que a criança aprende:** que cada número tem um **próximo fixo** — e que \"próximo\" significa \"mais um\".\n";
  if (!canon.includes(foundation)) throw new Error("P22.3A: fundamento JD4 nao encontrado");
  canon = canon.replace(foundation, `${foundation}\n**Escopo da Jornada N1.07:** além de sucessor/antecessor, o grafo canônico observa **ordenar 3–4 numerais em ordem crescente**. JD4 continua focada em automaticidade da vizinhança numérica e não substitui essa compreensão.\n`);
  atomicWrite(canonPath, canon);
}

describe("P22.3A — publicador transacional", () => {
  it("só deixa o patch no workspace após todos os gates focais", () => {
    try {
      applyPatch();
      run("npx", ["vitest", "run", "src/curriculum/fichas/jornada/N1.07.test.ts", "src/curriculum/motores/canaryContract.test.ts"]);
      run("npm", ["run", "fichas:auditar"]);
      run("npm", ["run", "fichas:conferir"]);
      run("npm", ["run", "grafo:check"]);
      run("npx", ["tsc", "--noEmit"]);
      run("npm", ["run", "sonda", "--", "N1.07"], { SONDA_CHROME: "/usr/bin/google-chrome" });
      run("git", ["diff", "--check"]);
      expect(fs.existsSync(testPath)).toBe(true);
      fs.rmSync(self, { force: true });
    } catch (error) {
      restore();
      throw error;
    }
  }, 240_000);
});
