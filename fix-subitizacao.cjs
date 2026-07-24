const fs = require('fs');
let code = fs.readFileSync('src/utils/generators.ts', 'utf-8');

code = code.replace(
  /export function gN1_03\(lvl: number\): Question \{\n  const n = ri\(6, 10\);\n  return \{\n    tutorial: lvl === 1 \? \[\{ say: "Vamos contar até 10!" \}\] : undefined,\n    excecaoCPA: "perceptual",\n    kind: "count",\n    prompt: "Conte com calma, sem pular nenhum!",/,
  `export function gN1_03(lvl: number): Question {
  const n = ri(2, 5); // Subitizing perceptual usually up to 5
  return {
    tutorial: lvl === 1 ? [{ say: "Olhe rápido, a caixa vai fechar!" }] : undefined,
    excecaoCPA: "perceptual",
    kind: "flash",
    prompt: "Quantos tinham ali?",`
);

fs.writeFileSync('src/utils/generators.ts', code);
