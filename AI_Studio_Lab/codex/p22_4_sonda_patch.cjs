const fs = require("node:fs");

const file = "sonda/cenas.tsx";
let source = fs.readFileSync(file, "utf8");

function once(before, after, label) {
  if (!source.includes(before)) throw new Error(`P22.4 sonda: âncora ausente — ${label}`);
  source = source.replace(before, after);
}

if (!source.includes('import { N1_09 } from "../src/curriculum/fichas/jornada/N1.09";')) {
  once(
    'import { N1_08 } from "../src/curriculum/fichas/jornada/N1.08";',
    'import { N1_08 } from "../src/curriculum/fichas/jornada/N1.08";\nimport { N1_09 } from "../src/curriculum/fichas/jornada/N1.09";',
    "import N1.09",
  );
}

if (!source.includes("P22.4 N1.09 autoral (nível 1)")) {
  const anchor = '  { nome: "N1.09 (o nó antigo) segue com o legado de contagem (nível 2)", render: (s) => <Exercicio id="N1.09" lvl={2} semente={s} /> },';
  const scenes = `  ...[1, 2, 3, 4, 5].map(lvl => ({\n    nome: \`P22.4 N1.09 autoral (nível \${lvl})\`,\n    render: (s: number) => <ExercicioDaFicha ficha={N1_09} lvl={lvl} semente={s} />,\n  })),\n${anchor}`;
  once(anchor, scenes, "cenas N1.09");
}

fs.writeFileSync(file, source);
console.log("[P22.4] cinco cenas N1.09 injetadas na sonda do workspace");
