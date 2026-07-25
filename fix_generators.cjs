const fs = require('fs');
let code = fs.readFileSync('src/utils/generators.ts', 'utf8');

function extractFunction(name) {
  const startIdx = code.indexOf(`export function ${name}(lvl: number): Question {`);
  if (startIdx === -1) return -1;
  let braces = 0;
  let endIdx = -1;
  let inString = false;
  let stringChar = '';
  for (let i = startIdx; i < code.length; i++) {
    const char = code[i];
    if (inString) {
      if (char === stringChar && code[i-1] !== '\\') {
        inString = false;
      }
    } else {
      if (char === '"' || char === "'" || char === '`') {
        inString = true;
        stringChar = char;
      } else if (char === '{') {
        braces++;
      } else if (char === '}') {
        braces--;
        if (braces === 0) {
          endIdx = i;
          break;
        }
      }
    }
  }
  return { start: startIdx, end: endIdx };
}

function removeArtifactsAndReplace(name, replacement) {
  const startIdx = code.indexOf(`export function ${name}(lvl: number): Question {`);
  if (startIdx === -1) return;
  let nextFuncIdx = code.indexOf('export function', startIdx + 1);
  if (nextFuncIdx === -1) nextFuncIdx = code.length;
  
  // replace from startIdx to nextFuncIdx
  code = code.substring(0, startIdx) + replacement + '\n\n' + code.substring(nextFuncIdx);
}

removeArtifactsAndReplace('gN1_02', `export function gN1_02(lvl: number): Question {
  return Composer.generate(N1_02, lvl <= 2 ? "a" : "b");
}`);

removeArtifactsAndReplace('gN1_03', `export function gN1_03(lvl: number): Question {
  return Composer.generate(N1_03, lvl <= 2 ? "a" : "b");
}`);

removeArtifactsAndReplace('gN1_04', `export function gN1_04(lvl: number): Question {
  return Composer.generate(N1_04, lvl <= 2 ? "a" : "b");
}`);

removeArtifactsAndReplace('gN1_07', `export function gN1_07(lvl: number): Question {
  return Composer.generate(N1_07, "a");
}`);

removeArtifactsAndReplace('gN1_10', `export function gN1_10(lvl: number): Question {
  return Composer.generate(N1_10, lvl <= 2 ? "a" : "b");
}`);


fs.writeFileSync('src/utils/generators.ts', code);
