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

const dojoTabPath = "src/components/home/DojoTab.tsx";
let dojoTab = fs.readFileSync(dojoTabPath, "utf8");
dojoTab = once(dojoTab,
`  JD3: {
    title: "Moldura Relâmpago",
    description: "Veja o vazio que falta para completar dez.",
    mother: "amigos do 10",
  },
  JD5: {`,
`  JD3: {
    title: "Moldura Relâmpago",
    description: "Veja o vazio que falta para completar dez.",
    mother: "amigos do 10",
  },
  JD4: {
    title: "O Passo Seguinte",
    description: "Responda o vizinho do número sem voltar a contar desde o um.",
    mother: "ordem, antes e depois",
  },
  JD5: {`,
  "copy específico JD4",
);
dojoTab = once(dojoTab,
  'Treinos curtos para o olho e a imagem mental. O tempo é medido em silêncio — você só precisa pensar e brincar.',
  'Treinos curtos para transformar o que você já entendeu em reflexo. O tempo é medido em silêncio — você só precisa pensar e brincar.',
  "copy geral Jardim",
);
fs.writeFileSync(dojoTabPath, dojoTab);

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
  'expect(screen.getByText("4")).toBeTruthy();\n    expect(screen.getByText("75%")).toBeTruthy();\n    expect(screen.getByText("1/5")).toBeTruthy();',
  "estatísticas derivadas dos dojoTracks com cinco trilhas no denominador",
);
fs.writeFileSync(dojoTabTestPath, dojoTabTest);

const sondaPath = "sonda/cenas.tsx";
let sonda = fs.readFileSync(sondaPath, "utf8");
sonda = once(
  sonda,
  'import { JD3, JD5 } from "../src/curriculum/fichas/dojo/jardim";',
  'import { JD3, JD4, JD5 } from "../src/curriculum/fichas/dojo/jardim";',
  "import JD4 na sonda",
);
sonda = once(
  sonda,
`  } : {
    "N1.03": progressoP8(3, 5),
    "N1.08": progressoP8(4, 5),
    "N1.11": progressoP8(3, 3),
    "N1.10": progressoP8(3, 4),
  };`,
`  } : {
    "N1.03": progressoP8(3, 5),
    "N1.08": progressoP8(4, 5),
    "N1.11": progressoP8(3, 3),
    "N1.07": progressoP8(3, 4),
    "N1.10": progressoP8(3, 4),
  };`,
  "N1.07 mãe desbloqueando JD4 na cena avançada",
);
sonda = once(
  sonda,
`    JD3: {
      unlocked: true, mastered: false, family: "JD", currentStep: 2, highestStep: 2,
      goodRounds: 0, weakRounds: 0, rounds: 4, attempts: 32, correct: 26,
    },
    JD5: {`,
`    JD3: {
      unlocked: true, mastered: false, family: "JD", currentStep: 2, highestStep: 2,
      goodRounds: 0, weakRounds: 0, rounds: 4, attempts: 32, correct: 26,
    },
    JD4: {
      unlocked: true, mastered: false, family: "JD", currentStep: 4, highestStep: 4,
      goodRounds: 1, weakRounds: 0, rounds: 6, attempts: 48, correct: 41,
    },
    JD5: {`,
  "dojoTracks JD4 na sonda",
);
sonda = once(
  sonda,
`  {
    nome: "P8 Jardim home — progresso avancado e reflexos",
    render: () => <JardimProbe modo="advanced" />,
  },
  ...[1, 2, 3, 4, 5].map(lvl => ({`,
`  {
    nome: "P22.3B JD4 Jardim home — cinco trilhas e progresso avançado",
    render: () => <JardimProbe modo="advanced" />,
  },
  ...[1, 2, 3, 4, 5].map(lvl => ({
    nome: \`P22.3B JD4 exercício (nível \${lvl})\`,
    render: (s: number) => <ExercicioDaFicha ficha={JD4} lvl={lvl} semente={s} />,
  })),
  ...[1, 2, 3, 4, 5].map(lvl => ({`,
  "cenas visuais JD4",
);
fs.writeFileSync(sondaPath, sonda);

fs.rmSync(self, { force: true });
console.log("[P22.3B/fix] invariantes, UI e sonda JD4 ajustados; fix temporário auto-removido");
