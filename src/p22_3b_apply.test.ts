import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const self = path.join(root, "src/p22_3b_apply.test.ts");
const composerPath = path.join(root, "src/curriculum/Composer.ts");
const jardimPath = path.join(root, "src/curriculum/fichas/dojo/jardim/index.ts");
const testPath = path.join(root, "src/curriculum/fichas/dojo/jardim/JD4.test.ts");
const original = {
  composer: fs.readFileSync(composerPath, "utf8"),
  jardim: fs.readFileSync(jardimPath, "utf8"),
  testExisted: fs.existsSync(testPath),
  test: fs.existsSync(testPath) ? fs.readFileSync(testPath, "utf8") : "",
};

function writeAtomic(file: string, content: string) {
  const tmp = `${file}.p22tmp`;
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, file);
}
function run(command: string, args: string[], env?: NodeJS.ProcessEnv) {
  execFileSync(command, args, { cwd: root, env: { ...process.env, ...env }, stdio: "inherit" });
}
function restore() {
  writeAtomic(composerPath, original.composer);
  writeAtomic(jardimPath, original.jardim);
  if (original.testExisted) writeAtomic(testPath, original.test);
  else fs.rmSync(testPath, { force: true });
  fs.rmSync(self, { force: true });
}
function applyPatch() {
  let composer = original.composer;
  const orderingAnchor = `          if (params.mode === "ordering") {`;
  if (!composer.includes(orderingAnchor)) throw new Error("P22.3B: ordering anchor ausente");
  const alternating = `          if (params.mode === "neighbor_alternating") {\n            const start = Number(params.start ?? 1);\n            const end = Number(params.end ?? 20);\n            if (!Number.isFinite(start) || !Number.isFinite(end) || end - start < 2) {\n              throw new Error(\`Parâmetros inválidos para vizinhança em \${micro.id}.\`);\n            }\n            const predecessor = Math.random() < 0.5;\n            const current = predecessor ? randomInt(start + 1, end) : randomInt(start, end - 1);\n            const answer = predecessor ? current - 1 : current + 1;\n            const options = numericOptions(answer, start, end);\n            return {\n              ...base,\n              kind: "plain",\n              prompt: predecessor ? "Qual número vem antes?" : "Qual número vem depois?",\n              big: String(current),\n              options,\n              answer,\n              uiProps: { ...params, text: String(current), direction: predecessor ? "before" : "after" },\n              evaluate: ans => Number(ans) === answer,\n              howto: predecessor\n                ? "Volte um passo na contagem para achar o antecessor."\n                : "Avance um passo na contagem para achar o sucessor.",\n              explain: predecessor\n                ? "O antecessor é um a menos."\n                : "O sucessor é um a mais.",\n            };\n          }\n\n`;
  composer = composer.replace(orderingAnchor, alternating + orderingAnchor);
  writeAtomic(composerPath, composer);

  let jardim = original.jardim;
  if (!jardim.includes("FichaCompetencia")) jardim = `import { FichaCompetencia } from "../../../schema";\n${jardim}`;
  const jd4 = `\n\n/** JD4 — Próximo Passo. Automaticidade de N1.07; não concede domínio da Jornada. */\nexport const JD4: FichaCompetencia = {\n  id: "JD4",\n  nome: "Próximo Passo",\n  strand: "N1",\n  faixa: "F0",\n  prereqs: ["N1.07"],\n  howto: "Responda quem vem antes ou depois usando a sequência que você já compreendeu.",\n  explain: "JD4 treina velocidade e estabilidade da vizinhança numérica; a compreensão pertence à Jornada N1.07.",\n  niveis: {\n    1: { primitiva: "numberline", micro: "a", andaime: "alto" },\n    2: { primitiva: "numberline", micro: "b", andaime: "medio" },\n    3: { primitiva: "plain", micro: "c", andaime: "minimo" },\n    4: { primitiva: "plain", micro: "d", andaime: "minimo" },\n    5: { primitiva: "plain", micro: "e", rt_alvo: 3000 },\n  },\n  micros: [\n    { id: "a", fonte: "JD4", alvo: "sucessor de 1 a 5 com reta", kinds: ["numberline"], params: { start: 1, end: 5, jump_size: 1, audio_prompt: "Qual número vem depois?" }, dominio: { acertos: 5, de: 5, sessoes: 1 } },\n    { id: "b", fonte: "JD4", alvo: "sucessor de 1 a 10 com apoio reduzido", kinds: ["numberline"], params: { start: 1, end: 10, jump_size: 1, audio_prompt: "Qual número vem depois?" }, dominio: { acertos: 5, de: 5, sessoes: 1 } },\n    { id: "c", fonte: "JD4", alvo: "sucessor de 1 a 20 sem depender da reta", kinds: ["plain"], params: { start: 1, end: 20, jump_size: 1, audio_prompt: "Qual número vem depois?" }, dominio: { acertos: 8, de: 10, sessoes: 2 } },\n    { id: "d", fonte: "JD4", alvo: "antecessor de 2 a 10", kinds: ["plain"], params: { start: 2, end: 9, jump_size: -1, audio_prompt: "Qual número vem antes?" }, dominio: { acertos: 8, de: 10, sessoes: 2 } },\n    { id: "e", fonte: "JD4", alvo: "alternar sucessor e antecessor de 1 a 20", kinds: ["plain"], params: { mode: "neighbor_alternating", start: 1, end: 20, audio_prompt: "Escute e diga o vizinho pedido." }, dominio: { acertos: 9, de: 10, sessoes: 2 } },\n  ],\n  erros_tipicos: [\n    { id: "direcao_invertida", descricao: "Responde o sucessor quando foi pedido o antecessor, ou o contrário." },\n    { id: "repete_estimulo", descricao: "Repete o número apresentado em vez do vizinho." },\n  ],\n};\n`;
  const registry = jardim.search(/\nexport const JARDIM\b/);
  if (registry < 0) throw new Error("P22.3B: registro JARDIM ausente");
  jardim = `${jardim.slice(0, registry)}${jd4}${jardim.slice(registry)}`;
  if (/\bJD3\s*,\s*JD5\b/.test(jardim)) jardim = jardim.replace(/\bJD3\s*,\s*JD5\b/, "JD3, JD4, JD5");
  else {
    const start = jardim.indexOf("export const JARDIM");
    const pos = jardim.indexOf("JD5", start);
    if (pos < 0) throw new Error("P22.3B: JD5 ausente do registro");
    jardim = `${jardim.slice(0, pos)}JD4,\n  ${jardim.slice(pos)}`;
  }
  writeAtomic(jardimPath, jardim);

  writeAtomic(testPath, `import { describe, expect, it } from "vitest";\nimport { Composer } from "../../../Composer";\nimport { misconceptionForAnswer } from "../../../../components/gameloop/answerPolicy";\nimport { JD4, JARDIM } from "./index";\n\nconst sample = (level: number, n = 120) => Array.from({ length: n }, () => Composer.generate(JD4, level));\n\ndescribe("JD4 — Próximo Passo", () => {\n  it("é automaticidade de N1.07 e está no catálogo Jardim", () => {\n    expect(JD4.prereqs).toEqual(["N1.07"]);\n    expect(JARDIM.some((f: any) => f.id === "JD4" || f.ficha?.id === "JD4")).toBe(true);\n  });\n  it("L1–L2 treinam sucessor com reta", () => {\n    for (const level of [1, 2]) for (const q of sample(level)) { expect(q.kind).toBe("numberline"); expect(Number(q.answer)).toBe(Number(q.nlStartPos) + 1); }\n  });\n  it("L3 treina sucessor até 20 e L4 antecessor", () => {\n    for (const q of sample(3)) { expect(q.kind).toBe("plain"); expect(Number(q.answer)).toBe(Number(q.big) + 1); expect(Number(q.answer)).toBeLessThanOrEqual(20); }\n    for (const q of sample(4)) { expect(q.kind).toBe("plain"); expect(q.prompt.toLowerCase()).toContain("antes"); expect(Number(q.answer)).toBe(Number(q.big) - 1); expect(Number(q.answer)).toBeGreaterThanOrEqual(1); }\n  });\n  it("L5 alterna as duas direções e mantém tempo como metadado", () => {\n    let before = 0; let after = 0;\n    for (const q of sample(5, 300)) {\n      if (q.prompt.toLowerCase().includes("antes")) { before++; expect(Number(q.answer)).toBe(Number(q.big) - 1); }\n      else { after++; expect(Number(q.answer)).toBe(Number(q.big) + 1); }\n      expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();\n    }\n    expect(before).toBeGreaterThan(0); expect(after).toBeGreaterThan(0); expect(JD4.niveis[5].rt_alvo).toBe(3000);\n  });\n});\n`);
}

describe("P22.3B — publicador transacional", () => {
  it("só deixa JD4 no workspace depois dos gates focais", () => {
    try {
      applyPatch();
      run("npx", ["vitest", "run", "src/curriculum/fichas/dojo/jardim/JD4.test.ts"]);
      run("npm", ["run", "auditar"]);
      run("npm", ["run", "fichas:auditar"]);
      run("npm", ["run", "fichas:conferir"]);
      run("npm", ["run", "grafo:check"]);
      run("npx", ["tsc", "--noEmit"]);
      run("npm", ["run", "sonda", "--", "JD4"], { SONDA_CHROME: "/usr/bin/google-chrome" });
      run("git", ["diff", "--check"]);
      expect(fs.existsSync(testPath)).toBe(true);
      fs.rmSync(self, { force: true });
    } catch (error) {
      restore();
      throw error;
    }
  }, 240_000);
});
