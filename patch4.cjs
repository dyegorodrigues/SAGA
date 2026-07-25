const fs = require('fs');
let code = fs.readFileSync('src/utils/generators.ts', 'utf8');

const importsToAdd = `
import { N1_02 } from "../curriculum/fichas/N1.02";
import { N1_03 } from "../curriculum/fichas/N1.03";
import { N1_04 } from "../curriculum/fichas/N1.04";
import { N1_07 } from "../curriculum/fichas/N1.07";
import { N1_10 } from "../curriculum/fichas/N1.10";
`;

code = code.replace('import { Composer } from "../curriculum/Composer";\n', 'import { Composer } from "../curriculum/Composer";\n' + importsToAdd);

// gN1_02
code = code.replace(/export function gN1_02[^}]+\}/m, `export function gN1_02(lvl: number): Question {
  return Composer.generate(N1_02, lvl <= 2 ? "a" : "b");
}`);

// gN1_03
code = code.replace(/export function gN1_03[^}]+\}/m, `export function gN1_03(lvl: number): Question {
  return Composer.generate(N1_03, lvl <= 2 ? "a" : "b");
}`);

// gN1_04
code = code.replace(/export function gN1_04[^}]+\}/m, `export function gN1_04(lvl: number): Question {
  return Composer.generate(N1_04, lvl <= 2 ? "a" : "b");
}`);

// gN1_07
code = code.replace(/export function gN1_07[^}]+\}/m, `export function gN1_07(lvl: number): Question {
  return Composer.generate(N1_07, "a");
}`);

// gN1_10
code = code.replace(/export function gN1_10[^}]+\}/m, `export function gN1_10(lvl: number): Question {
  return Composer.generate(N1_10, lvl <= 2 ? "a" : "b");
}`);

fs.writeFileSync('src/utils/generators.ts', code);
