const fs = require('fs');
let code = fs.readFileSync('src/utils/generators.ts', 'utf-8');

code = code.replace(
  /export function gN1_08\(lvl: number\): Question \{\n  const n = ri\(4, 7\);\n  return \{\n    tutorial: lvl === 1 \? \[\{ say: "Olhe rápido, a caixa vai fechar!" \}\] : undefined,\n    excecaoCPA: "perceptual",\n    kind: "flash",/,
  `export function gN1_08(lvl: number): Question {
  const n = ri(5, 10);
  return {
    tutorial: lvl === 1 ? [{ say: "Esta é a caixa mágica! Se a primeira linha estiver cheia, tem 5!" }] : undefined,
    excecaoCPA: "perceptual",
    kind: "tens",`
);

fs.writeFileSync('src/utils/generators.ts', code);
