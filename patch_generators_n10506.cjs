const fs = require('fs');
let code = fs.readFileSync('src/utils/generators.ts', 'utf8');

code = code.replace(
  /export function gN1_05\(lvl: number\): Question \{[\s\S]*?export function gN1_06/,
  `export function gN1_05(lvl: number): Question {
  const isMais = Math.random() < 0.5;
  const n1 = ri(2, 5);
  let n2 = ri(2, 5);
  while (n1 === n2) n2 = ri(2, 5);

  const groups = [
    { n: n1, emoji: pickEmo() },
    { n: n2, emoji: pickEmo() }
  ];
  const wantsMais = isMais;
  const idxBig = n1 > n2 ? 0 : 1;
  const ansIdx = wantsMais ? idxBig : (1 - idxBig);

  if (lvl <= 2) {
    return {
      tutorial: lvl === 1 ? [{say: "Toque no grupo que tem a quantidade pedida."}] : undefined,
      kind: "groups",
      groups: groups,
      prompt: wantsMais ? "Toque no que tem MAIS." : "Toque no que tem MENOS.",
      options: [
        { label: "1", value: 0 },
        { label: "2", value: 1 }
      ],
      answer: ansIdx,
      howto: "Compare as quantidades.",
      audioPrompt: wantsMais ? "Qual tem mais?" : "Qual tem menos?",
      explain: wantsMais ? "Encontre o grupo com o maior número de coisas." : "Encontre o grupo com o menor número de coisas."
    };
  } else {
    // plain text comparison
    return {
      tutorial: undefined,
      kind: "plain",
      big: wantsMais ? "MAIS" : "MENOS",
      prompt: wantsMais ? \`Escolha o número MAIOR\` : \`Escolha o número MENOR\`,
      options: [
        { label: \`\${n1}\`, value: n1 },
        { label: \`\${n2}\`, value: n2 }
      ],
      answer: wantsMais ? (n1 > n2 ? n1 : n2) : (n1 < n2 ? n1 : n2),
      howto: "Compare os números.",
      audioPrompt: wantsMais ? "Qual é maior?" : "Qual é menor?",
      explain: "Lembre da ordem de contagem para saber qual é maior ou menor."
    };
  }
}

export function gN1_06`
);

const numToWords = ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez"];

code = code.replace(
  /export function gN1_06\(lvl: number\): Question \{[\s\S]*?howto: "Ligue o nome ao símbolo.",\n      audioPrompt: \`Encontre o \$\{ans\}\!`,\n      explain: "Identifique o número"\n    \};\n  \}/,
  `export function gN1_06(lvl: number): Question {
  const ans = ri(1, 9);
  return {
    tutorial: lvl === 1 ? [{say: "Ouça o número e toque nele!"}] : undefined,
    kind: "plain",
    prompt: "Ouça com atenção 👂",
    big: "🔊 " + numToWords[ans].toUpperCase(),
    options: numOpts(ans, 3, 1, 9),
    answer: ans,
    howto: "Ligue o som ao símbolo.",
    audioPrompt: \`Encontre o \${ans}!\`,
    explain: "Identifique o número"
  };
}`
);

fs.writeFileSync('src/utils/generators.ts', code);
