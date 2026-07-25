const fs = require('fs');
let code = fs.readFileSync('src/utils/generators.ts', 'utf8');

const numToWords = ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez"];

code = code.replace(
  /export function gN1_06[\s\S]*?Pense em como a gente desenha esse número quando escreve.",\n  };\n\}/,
  `export function gN1_06(lvl: number): Question {
  const ans = ri(1, 9);
  const words = ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez"];
  return {
    tutorial: lvl === 1 ? [{say: "Ouça o número e toque nele!"}] : undefined,
    kind: "plain",
    prompt: "Ouça com atenção 👂",
    big: "🔊 " + words[ans].toUpperCase(),
    options: numOpts(ans, 3, 1, 9),
    answer: ans,
    howto: "Ligue o som ao símbolo.",
    audioPrompt: \`Encontre o \${ans}!\`,
    explain: "Ligue o som ao formato do número.",
  };
}`
);
fs.writeFileSync('src/utils/generators.ts', code);
