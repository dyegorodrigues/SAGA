const fs = require("node:fs");

const file = "sonda/cenas.tsx";
let source = fs.readFileSync(file, "utf8");
const anchor = "export const CENAS: Cena[] = [";

if (!source.includes(anchor)) throw new Error("P22.5 sonda: catálogo CENAS não encontrado");

if (!source.includes("P22.5 GM.02 produção (nível 1)")) {
  const scenes = `\n  // P22.5 — rota real: Exercicio resolve ALL_MATH_TRACKS → track.gen.\n  ...[1, 2, 3, 4, 5].map(lvl => ({\n    nome: \`P22.5 GM.02 produção (nível \${lvl})\`,\n    render: (s: number) => <Exercicio id="GM.02" lvl={lvl} semente={s} />,\n  })),`;
  source = source.replace(anchor, `${anchor}${scenes}`);
}

fs.writeFileSync(file, source);
console.log("[P22.5] cinco cenas GM.02 pela rota real de produção injetadas no workspace");