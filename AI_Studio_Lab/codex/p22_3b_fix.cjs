const fs = require("node:fs");

const self = "AI_Studio_Lab/codex/p22_3b_fix.cjs";

function once(text, before, after, label) {
  if (!text.includes(before)) throw new Error(`P22.3B/fix: âncora ausente — ${label}`);
  return text.replace(before, after);
}

const jardimPath = "src/curriculum/fichas/dojo/jardim/index.ts";
let jardim = fs.readFileSync(jardimPath, "utf8");
jardim = once(jardim,
  '2: { primitiva: "numberline", micro: "sucessor10", rt_alvo: 3500 },\n    3: { primitiva: "plain", micro: "sucessor20", rt_alvo: 3500 },\n    4: { primitiva: "plain", micro: "antecessor10", rt_alvo: 3500 },',
  '2: { primitiva: "numberline", micro: "sucessor10", rt_alvo: 3750 },\n    3: { primitiva: "plain", micro: "sucessor20", rt_alvo: 3500 },\n    4: { primitiva: "plain", micro: "antecessor10", rt_alvo: 3250 },',
  "rt_alvo estritamente decrescente",
);
fs.writeFileSync(jardimPath, jardim);

const jd4TestPath = "src/curriculum/fichas/dojo/jardim/JD4.test.ts";
let jd4Test = fs.readFileSync(jd4TestPath, "utf8");
jd4Test = once(jd4Test,
  'expect([1, 2, 3, 4, 5].map(level => track.gen(level).rt_max_s)).toEqual([4, 3.5, 3.5, 3.5, 3]);',
  'expect([1, 2, 3, 4, 5].map(level => track.gen(level).rt_max_s)).toEqual([4, 3.75, 3.5, 3.25, 3]);',
  "contrato temporal JD4",
);
fs.writeFileSync(jd4TestPath, jd4Test);

const dojoTabTestPath = "src/components/home/DojoTab.test.tsx";
let dojoTabTest = fs.readFileSync(dojoTabTestPath, "utf8");
dojoTabTest = once(dojoTabTest,
  'it("mostra exatamente as quatro trilhas JD implementadas, não a lista CRA da Jornada", () => {',
  'it("mostra exatamente as cinco trilhas JD implementadas, não a lista CRA da Jornada", () => {',
  "quantidade de trilhas na UI",
);
dojoTabTest = once(dojoTabTest,
  'expect(screen.getByText("Moldura Relâmpago")).toBeTruthy();\n    expect(screen.getByText("Ver e Imaginar")).toBeTruthy();',
  'expect(screen.getByText("Moldura Relâmpago")).toBeTruthy();\n    expect(screen.getByText("O Passo Seguinte")).toBeTruthy();\n    expect(screen.getByText("Ver e Imaginar")).toBeTruthy();',
  "JD4 visível na UI",
);
dojoTabTest = once(dojoTabTest,
  'expect(screen.getByText("4")).toBeTruthy();\n    expect(screen.getByText("75%")).toBeTruthy();\n    expect(screen.getByText("1/4")).toBeTruthy();',
  'expect(screen.getByText("5")).toBeTruthy();\n    expect(screen.getByText("75%")).toBeTruthy();\n    expect(screen.getByText("1/5")).toBeTruthy();',
  "estatísticas com cinco trilhas",
);
fs.writeFileSync(dojoTabTestPath, dojoTabTest);

fs.rmSync(self, { force: true });
console.log("[P22.3B/fix] invariantes ajustados e fix temporário auto-removido");
