const fs = require('fs');
let code = fs.readFileSync('src/utils/generators.ts', 'utf8');

const target = `export function gN1_01(lvl: number): Question {
  const n = lvl === 1 ? 3 : (lvl === 2 ? 4 : (lvl === 3 ? 5 : (lvl === 4 ? 6 : 7)));
  return {
    tutorial: lvl === 1 ? [{ say: "Olha só, para saber quantos tem, a gente toca em um de cada vez!" }] : undefined,
    excecaoCPA: "perceptual",
    kind: "count",
    prompt: "Quantos temos aqui? Toque em um de cada vez!",
    emoji: pickEmo(),
    n,
    options: numOpts(n, 3, 1, 8),
    answer: n,
    howto: "Toque em cada objeto uma única vez para contar.",
    audioPrompt: "Quantos temos aqui?",
    explain: "Olha os objetos que ainda não foram tocados e conte um por um com o dedinho.",
  };
}`;

const replacement = `import { N1_01 } from "../curriculum/fichas/N1.01";
import { Composer } from "../curriculum/Composer";

export function gN1_01(lvl: number): Question {
  const microId = lvl <= 2 ? "a" : "b";
  return Composer.generate(N1_01, microId);
}`;

code = code.replace(target, replacement);
fs.writeFileSync('src/utils/generators.ts', code);
