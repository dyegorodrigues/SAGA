import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const self = path.join(root, "src/p22_4_apply.test.ts");
const paths = {
  composer: path.join(root, "src/curriculum/Composer.ts"),
  fichaIndex: path.join(root, "src/curriculum/fichas/index.ts"),
  canary: path.join(root, "src/curriculum/motores/composerCanary.ts"),
  canaryIds: path.join(root, "src/curriculum/motores/composerCanaryIds.ts"),
  contract: path.join(root, "src/curriculum/motores/canaryContract.test.ts"),
  canon: path.join(root, "AI_Studio_Lab/pedagogia/fichas/FICHAS_F0_COMPLETAS.md"),
  auditor: path.join(root, "AI_Studio_Lab/tools/ficha_catalog_auditor.cjs"),
  ficha: path.join(root, "src/curriculum/fichas/jornada/N1.09.ts"),
  test: path.join(root, "src/curriculum/fichas/jornada/N1.09.test.ts"),
};
const originals = Object.fromEntries(Object.entries(paths).map(([k, p]) => [k, fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null])) as Record<string, string | null>;

function atomicWrite(file: string, content: string) {
  const tmp = `${file}.p22tmp`;
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, file);
}
function run(command: string, args: string[], env?: NodeJS.ProcessEnv) {
  execFileSync(command, args, { cwd: root, env: { ...process.env, ...env }, stdio: "inherit" });
}
function restore() {
  for (const [key, file] of Object.entries(paths)) {
    const original = originals[key];
    if (original === null) fs.rmSync(file, { force: true });
    else atomicWrite(file, original);
  }
  fs.rmSync(self, { force: true });
}
function replaceOnce(source: string, search: string, replacement: string, label: string) {
  if (!source.includes(search)) throw new Error(`P22.4: âncora ausente: ${label}`);
  return source.replace(search, replacement);
}

function applyPatch() {
  let composer = originals.composer!;
  const anchor = `          if (params.mode === "neighbor_alternating") {`;
  const modes = `          if (params.mode === "count_objects") {\n            const min = Number(params.min ?? 10);\n            const max = Number(params.max ?? 20);\n            const groupSize = Number(params.group_size ?? 5);\n            if (!Number.isFinite(min) || !Number.isFinite(max) || min < 1 || max < min || groupSize < 1) {\n              throw new Error(\`Parâmetros inválidos para contagem em \${micro.id}.\`);\n            }\n            const answer = randomInt(min, max);\n            const groups: string[] = [];\n            for (let i = 0; i < answer; i += groupSize) {\n              groups.push("● ".repeat(Math.min(groupSize, answer - i)).trim());\n            }\n            const objects = groups.join("   ");\n            return {\n              ...base,\n              kind: "plain",\n              prompt: String(params.audio_prompt ?? "Quantos objetos há aqui?"),\n              big: objects,\n              options: numericOptions(answer, min, max),\n              answer,\n              uiProps: { ...params, text: objects, objectCount: answer, groupSize },\n              evaluate: ans => Number(ans) === answer,\n              howto: "Conte cada objeto uma vez. Os espaços a cada cinco ajudam a não se perder.",\n              explain: \`Ao contar todos os objetos, chegamos a \${answer}.\`,\n            };\n          }\n\n          if (params.mode === "sequence_next") {\n            const start = Number(params.start ?? 3);\n            const end = Number(params.end ?? 19);\n            if (!Number.isFinite(start) || !Number.isFinite(end) || end - start < 3) {\n              throw new Error(\`Intervalo inválido para sequência em \${micro.id}.\`);\n            }\n            const first = randomInt(start, end - 3);\n            const shown = [first, first + 1, first + 2];\n            const answer = first + 3;\n            const text = \`${shown.join(" → ")} → ?\`;\n            return {\n              ...base,\n              kind: "plain",\n              prompt: String(params.audio_prompt ?? "Continue a contagem. Qual número vem agora?"),\n              big: text,\n              options: numericOptions(answer, start, end),\n              answer,\n              uiProps: { ...params, text, sequence: shown },\n              evaluate: ans => Number(ans) === answer,\n              howto: "Comece do número mostrado e continue contando, sem voltar ao um.",\n              explain: \`Depois de \${shown.at(-1)} vem \${answer}.\`,\n            };\n          }\n\n          if (params.mode === "countdown_next") {\n            const minCurrent = Number(params.min ?? 1);\n            const maxCurrent = Number(params.max ?? 8);\n            if (!Number.isFinite(minCurrent) || !Number.isFinite(maxCurrent) || minCurrent < 1 || maxCurrent < minCurrent) {\n              throw new Error(\`Intervalo inválido para regressiva em \${micro.id}.\`);\n            }\n            const current = randomInt(minCurrent, maxCurrent);\n            const shown = [current + 2, current + 1, current];\n            const answer = current - 1;\n            const text = \`${shown.join(" → ")} → ?\`;\n            return {\n              ...base,\n              kind: "plain",\n              prompt: String(params.audio_prompt ?? "Continue contando para trás. Qual número vem agora?"),\n              big: text,\n              options: numericOptions(answer, 0, 10),\n              answer,\n              uiProps: { ...params, text, sequence: shown, direction: "backward" },\n              evaluate: ans => Number(ans) === answer,\n              howto: "Na contagem regressiva, cada passo é um a menos.",\n              explain: \`Antes de \${current}, contando para trás, vem \${answer}.\`,\n            };\n          }\n\n`;
  composer = replaceOnce(composer, anchor, modes + anchor, "plain modes N1.09");
  atomicWrite(paths.composer, composer);

  atomicWrite(paths.ficha, `import { FichaCompetencia } from "../../schema";\n\n/** N1.09 — contagem até 20 e a partir de qualquer número. */\nexport const N1_09: FichaCompetencia = {\n  id: "N1.09",\n  nome: "Contagem até 20 e a partir de qualquer número",\n  strand: "N1",\n  faixa: "F0",\n  prereqs: ["N1.04", "N1.02"],\n  bncc: "EF01MA01",\n  howto: "Conte sem reiniciar no um: conjuntos maiores, sequências iniciadas no meio e contagem para trás.",\n  explain: "Saber contar também é continuar de onde você está e percorrer a sequência nos dois sentidos.",\n  niveis: {\n    1: { primitiva: "plain", micro: "a", andaime: "alto" },\n    2: { primitiva: "plain", micro: "b", andaime: "medio" },\n    3: { primitiva: "plain", micro: "c", andaime: "minimo" },\n    4: { primitiva: "plain", micro: "d", andaime: "minimo" },\n    5: { primitiva: "plain", rt_alvo: 5000 },\n  },\n  micros: [\n    { id: "a", fonte: "GRAFO_N1.09", alvo: "contar conjuntos entre 10 e 15", kinds: ["plain"], params: { mode: "count_objects", min: 10, max: 15, group_size: 5, audio_prompt: "Conte os objetos. Quantos há?" }, dominio: { acertos: 4, de: 5, sessoes: 2 } },\n    { id: "b", fonte: "GRAFO_N1.09", alvo: "contar conjuntos entre 10 e 20", kinds: ["plain"], params: { mode: "count_objects", min: 10, max: 20, group_size: 5, audio_prompt: "Conte os objetos. Quantos há?" }, dominio: { acertos: 4, de: 5, sessoes: 2 } },\n    { id: "c", fonte: "GRAFO_N1.09", alvo: "continuar a sequência a partir de um ponto interno", kinds: ["plain"], params: { mode: "sequence_next", start: 3, end: 19, audio_prompt: "Continue a contagem. Qual número vem agora?" }, dominio: { acertos: 4, de: 5, sessoes: 2 } },\n    { id: "d", fonte: "GRAFO_N1.09", alvo: "contar regressivamente até zero", kinds: ["plain"], params: { mode: "countdown_next", min: 1, max: 8, audio_prompt: "Continue contando para trás. Qual número vem agora?" }, dominio: { acertos: 4, de: 5, sessoes: 2 } },\n  ],\n  erros_tipicos: [\n    { id: "reinicia_no_um", descricao: "Recomeça a sequência no 1 em vez de continuar do ponto apresentado." },\n    { id: "salta_item", descricao: "Perde a correspondência um-a-um e pula ou conta um objeto duas vezes." },\n    { id: "direcao_regressiva", descricao: "Na regressiva, continua aumentando em vez de diminuir um a cada passo." },\n  ],\n};\n`);

  atomicWrite(paths.test, `import { describe, expect, it } from "vitest";\nimport { Composer } from "../../Composer";\nimport { misconceptionForAnswer } from "../../../components/gameloop/answerPolicy";\nimport { N1_09 } from "./N1.09";\n\nconst sample = (level: number, n = 120) => Array.from({ length: n }, () => Composer.generate(N1_09, level));\n\ndescribe("N1.09 — contagem até 20 e a partir de qualquer número", () => {\n  it("usa prereqs canônicos e quatro micros", () => { expect(N1_09.prereqs).toEqual(["N1.04", "N1.02"]); expect(N1_09.micros.map(m => m.id)).toEqual(["a", "b", "c", "d"]); });\n  it("L1–L2 contam conjuntos 10–15/20", () => {\n    for (const level of [1, 2]) for (const q of sample(level)) {\n      const max = level === 1 ? 15 : 20; const answer = Number(q.answer);\n      expect(answer).toBeGreaterThanOrEqual(10); expect(answer).toBeLessThanOrEqual(max);\n      expect((String(q.big).match(/●/g) ?? []).length).toBe(answer); expect(q.evaluate?.(q.answer)).toBe(true);\n    }\n  });\n  it("L3 continua de um ponto interno sem voltar ao um", () => {\n    for (const q of sample(3)) { const shown = String(q.big).match(/\\d+/g)?.map(Number) ?? []; expect(shown).toHaveLength(3); expect(shown[1]).toBe(shown[0] + 1); expect(shown[2]).toBe(shown[1] + 1); expect(Number(q.answer)).toBe(shown[2] + 1); expect(shown[0]).toBeGreaterThanOrEqual(3); }\n  });\n  it("L4 faz regressiva e alcança zero", () => {\n    let sawZero = false; for (const q of sample(4, 300)) { const shown = String(q.big).match(/\\d+/g)?.map(Number) ?? []; expect(shown).toHaveLength(3); expect(shown[1]).toBe(shown[0] - 1); expect(shown[2]).toBe(shown[1] - 1); expect(Number(q.answer)).toBe(shown[2] - 1); if (Number(q.answer) === 0) sawZero = true; } expect(sawZero).toBe(true);\n  });\n  it("L5 mistura os quatro micros e acerto não gera diagnóstico", () => {\n    const seen = new Set<string>(); for (const q of sample(5, 320)) { const p = q.prompt.toLowerCase(); if (p.includes("objetos")) seen.add("objects"); else if (p.includes("trás")) seen.add("backward"); else if (p.includes("continue")) seen.add("sequence"); expect(q.evaluate?.(q.answer)).toBe(true); expect(misconceptionForAnswer(q, q.answer)).toBeUndefined(); }\n    expect(seen.size).toBeGreaterThanOrEqual(3);\n  });\n});\n`);

  let index = originals.fichaIndex!;
  index = replaceOnce(index, `import { N1_08 } from "./jornada/N1.08";`, `import { N1_08 } from "./jornada/N1.08";\nimport { N1_09 } from "./jornada/N1.09";`, "import N1.09 ficha index");
  if (index.includes("N1_08, N1_10")) index = index.replace("N1_08, N1_10", "N1_08, N1_09, N1_10");
  else if (index.includes("N1_08,\n")) index = index.replace("N1_08,\n", "N1_08,\n  N1_09,\n");
  else throw new Error("P22.4: ponto de JOURNEY_FICHAS para N1.09 não encontrado");
  atomicWrite(paths.fichaIndex, index);

  let canary = originals.canary!;
  canary = replaceOnce(canary, `import { N1_08 } from "../fichas/jornada/N1.08";`, `import { N1_08 } from "../fichas/jornada/N1.08";\nimport { N1_09 } from "../fichas/jornada/N1.09";`, "import N1.09 composer canary");
  canary = replaceOnce(canary, `  "N1.08": N1_08,`, `  "N1.08": N1_08,\n  "N1.09": N1_09,`, "registry N1.09 composer canary");
  atomicWrite(paths.canary, canary);

  let ids = originals.canaryIds!;
  ids = replaceOnce(ids, `  "N1.08",\n  "AL.02",`, `  "N1.08",\n  "N1.09",\n  "AL.02",`, "active N1.09");
  atomicWrite(paths.canaryIds, ids);

  let contract = originals.contract!;
  contract = replaceOnce(contract, `import { N1_08 } from "../fichas/jornada/N1.08";`, `import { N1_08 } from "../fichas/jornada/N1.08";\nimport { N1_09 } from "../fichas/jornada/N1.09";`, "import N1.09 canary contract");
  contract = replaceOnce(contract, `  "N1.08": N1_08,`, `  "N1.08": N1_08,\n  "N1.09": N1_09,`, "registry N1.09 canary contract");
  atomicWrite(paths.contract, contract);

  let canon = originals.canon!;
  const fichaMd = `# FICHA N1.09 — CONTAGEM ATÉ 20 E A PARTIR DE QUALQUER NÚMERO\n\n**Competência:** N1.09 (contagem até 20 e a partir de qualquer número) · **Primitiva:** \\`plain\\` com objetos e sequências · **Faixa:** F0\n\n**O que a criança aprende:** estender a contagem além do 10, continuar de um ponto interno sem reiniciar no 1 e percorrer a sequência para trás até o zero.\n\n**Escada:** L1 conta conjuntos de 10–15; L2 amplia para 10–20; L3 continua uma sequência iniciada no meio; L4 faz regressiva 10→0; L5 mistura as quatro demandas. Objetos aparecem agrupados visualmente de cinco em cinco para reduzir perda de correspondência, sem transformar agrupamento em atalho de resposta.\n\n**Regra pré-leitora:** o comando é falado. Texto é apoio, nunca requisito para demonstrar contagem. Reiniciar no 1 quando a sequência já começou não demonstra domínio desta competência.\n\n**Proveniência:** o gerador legado de sequência permanece rollback de produção, mas cobre apenas uma parte de N1.09 e não é evidência de domínio completo. N1.13 continua separado como produção de quantidade.\n\n`;
  if (!canon.includes("# FICHA JD4")) throw new Error("P22.4: âncora JD4 ausente no cânone F0");
  canon = canon.replace("# FICHA JD4", `${fichaMd}# FICHA JD4`);
  atomicWrite(paths.canon, canon);

  let auditor = originals.auditor!;
  const beforeAuditor = auditor;
  auditor = auditor
    .replace(/^\s*["']N1\.09["']\s*:\s*[^\n]+\n/m, "")
    .replace(/["']N1\.09["']\s*,\s*/g, "")
    .replace(/\s*,\s*["']N1\.09["']/g, "")
    .replace(/\bN1\.09\b\s*\|\s*/g, "");
  if (auditor === beforeAuditor) throw new Error("P22.4: exceção autoral N1.09 não encontrada no auditor");
  atomicWrite(paths.auditor, auditor);
}

describe("P22.4 — publicador transacional N1.09", () => {
  it("só mantém N1.09 depois de contratos, auditores, TypeScript e sonda", () => {
    try {
      applyPatch();
      run("npx", ["vitest", "run", "src/curriculum/fichas/jornada/N1.09.test.ts", "src/curriculum/fichas/journeyRegistry.test.ts", "src/curriculum/motores/canaryContract.test.ts"]);
      run("npm", ["run", "auditar"]);
      run("npm", ["run", "fichas:auditar"]);
      run("npm", ["run", "fichas:conferir"]);
      run("npm", ["run", "grafo:check"]);
      run("npx", ["tsc", "--noEmit"]);
      run("npm", ["run", "sonda", "--", "N1.09"], { SONDA_CHROME: "/usr/bin/google-chrome" });
      run("git", ["diff", "--check"]);
      expect(fs.existsSync(paths.ficha)).toBe(true);
      fs.rmSync(self, { force: true });
    } catch (error) {
      restore();
      throw error;
    }
  }, 240_000);
});
