const fs = require("node:fs");

const file = "sonda/cenas.tsx";
let source = fs.readFileSync(file, "utf8");

function once(before, after, label) {
  if (!source.includes(before)) throw new Error(`P22.4 sonda: âncora ausente — ${label}`);
  source = source.replace(before, after);
}

if (!source.includes("P22.4 N1.09 produção (nível 1)")) {
  const anchor = '  { nome: "N1.09 (o nó antigo) segue com o legado de contagem (nível 2)", render: (s) => <Exercicio id="N1.09" lvl={2} semente={s} /> },';
  const scenes = `  ...[1, 2, 3, 4, 5].map(lvl => ({\n    nome: \`P22.4 N1.09 produção (nível \${lvl})\`,\n    render: (s: number) => <Exercicio id="N1.09" lvl={lvl} semente={s} />,\n  })),\n${anchor}`;
  once(anchor, scenes, "cenas N1.09 pela rota track.gen");
}

fs.writeFileSync(file, source);
console.log("[P22.4] cinco cenas N1.09 de produção injetadas na sonda do workspace");