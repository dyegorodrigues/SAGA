const fs = require('fs');

// 1. Read the Graph from Markdown
const md = fs.readFileSync('AI_Studio_Lab/pedagogia/GRAFO_DE_CONHECIMENTO_SAGA.md', 'utf8');
const graphIds = new Set();
const regexId = /([A-Z]{2}|N[0-9])\.[0-9]{2}[a-z]?/g;
let match;
while ((match = regexId.exec(md)) !== null) {
  graphIds.add(match[0]);
}
// Clean up
graphIds.delete('N1.02d');
graphIds.delete('N1.02e');
graphIds.delete('N1.04c');
graphIds.delete('N1.05c');
graphIds.delete('N1.06c');
graphIds.delete('N3.03d');
graphIds.delete('N3.04b');
graphIds.delete('N3.04c');
graphIds.delete('N3.07b');
graphIds.delete('N3.11c');
graphIds.delete('N3.12c');
graphIds.delete('N4.03b');
graphIds.delete('N6.02c');

// 2. Read Curriculum
const curr = fs.readFileSync('src/utils/curriculum.ts', 'utf8');
const curriculumMap = new Map();
const regexMap = /"([A-Z0-9.]+)":\s*([a-zA-Z0-9_]+)/g;
let matchMap;
while ((matchMap = regexMap.exec(curr)) !== null) {
  curriculumMap.set(matchMap[1], matchMap[2]);
}

// 3. Read Generators
const gen1 = fs.readFileSync('src/utils/generators.ts', 'utf8');
let gen2 = '';
try { gen2 = fs.readFileSync('src/utils/generatorsF2.ts', 'utf8'); } catch(e){}
const allGens = gen1 + '\n' + gen2;

const exportedGens = new Set();
const regexExport = /export\s+(?:function|const)\s+([a-zA-Z0-9_]+)/g;
let matchExport;
while ((matchExport = regexExport.exec(allGens)) !== null) {
  if (matchExport[1].startsWith('g') && matchExport[1] !== 'g') {
    exportedGens.add(matchExport[1]);
  }
}

// Analysis
const missing = [];
for (const id of graphIds) {
  if (!curriculumMap.has(id)) {
    missing.push(id);
  }
}

const usedGens = new Set(curriculumMap.values());
const orphans = [];
for (const gen of exportedGens) {
  if (!usedGens.has(gen)) {
    orphans.push(gen);
  }
}

const duplicates = []; 
const currLines = curr.split('\n');
const seenNodes = new Set();
for (const line of currLines) {
  const m = /"([A-Z0-9.]+)":\s*([a-zA-Z0-9_]+)/.exec(line);
  if (m) {
    if (seenNodes.has(m[1])) {
      duplicates.push(m[1]);
    }
    seenNodes.add(m[1]);
  }
}

const nomenclatureDrift = [];
for (const [node, gen] of curriculumMap.entries()) {
  const expectedGen = 'g' + node.replace('.', '_');
  if (gen !== expectedGen && gen !== 'gFallback') {
    nomenclatureDrift.push(`${node} is served by ${gen} (expected ${expectedGen})`);
  }
}

console.log(">> DETECTOR DE ENTULHO (V2) <<\n");
console.log("[BURACOS - Faltam no GENERATOR_MAP]:\n" + missing.join(', ') + "\n");
console.log("[DUPLICATAS - Mais de um gerador para o mesmo nó]:\n" + (duplicates.length ? duplicates.join(', ') : 'Nenhuma') + "\n");
console.log("[ÓRFÃOS - Geradores exportados mas não usados no mapa]:\n" + orphans.join(', ') + "\n");
console.log("[DERIVA DE NOMENCLATURA - Gerador não reflete o ID do nó]:\n" + nomenclatureDrift.join('\n') + "\n");

