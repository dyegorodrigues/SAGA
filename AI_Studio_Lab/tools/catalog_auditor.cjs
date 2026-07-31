const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const YAML = require("yaml");

const ROOT = path.resolve(__dirname, "../..");
const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), "utf8");
const parseYaml = (relativePath) => YAML.parse(read(relativePath));
const unique = (items) => [...new Set(items)];
const sorted = (items) => [...items].sort((a, b) => a.localeCompare(b));
const hash = (content) => crypto.createHash("sha256").update(content).digest("hex");

const failures = [];
const warnings = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function sameNodes(left, right) {
  const normalize = (nodes) => nodes.map(({ id, nome, strand, faixa, prereqs }) => ({
    id,
    nome,
    strand,
    faixa,
    prereqs: [...(prereqs || [])],
  }));
  return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right));
}

function listFiles(directory, suffix) {
  return fs.readdirSync(path.join(ROOT, directory))
    .filter((name) => name.endsWith(suffix))
    .map((name) => path.join(directory, name));
}

const graphYaml = parseYaml("curriculum/grafo_saga.yaml");
const yamlNodes = graphYaml.nodes || [];
const yamlIds = yamlNodes.map((node) => node.id);
const yamlIdSet = new Set(yamlIds);

check(yamlNodes.length === 95, `grafo YAML deveria ter 95 nós; encontrou ${yamlNodes.length}`);
check(yamlIdSet.size === yamlIds.length, "grafo YAML contém IDs duplicados");

for (const node of yamlNodes) {
  for (const prereq of node.prereqs || []) {
    check(yamlIdSet.has(prereq), `${node.id} referencia pré-requisito inexistente ${prereq}`);
    check(prereq !== node.id, `${node.id} referencia a si próprio como pré-requisito`);
  }
}

const prereqsById = new Map(yamlNodes.map((node) => [node.id, node.prereqs || []]));
const visiting = new Set();
const visited = new Set();
function visit(nodeId, trail = []) {
  if (visiting.has(nodeId)) {
    failures.push(`ciclo no DAG: ${[...trail, nodeId].join(" -> ")}`);
    return;
  }
  if (visited.has(nodeId)) return;
  visiting.add(nodeId);
  for (const prereq of prereqsById.get(nodeId) || []) visit(prereq, [...trail, nodeId]);
  visiting.delete(nodeId);
  visited.add(nodeId);
}
for (const nodeId of yamlIds) visit(nodeId);

const markdown = read("AI_Studio_Lab/pedagogia/GRAFO_DE_CONHECIMENTO_SAGA.md");
const markdownIds = unique(
  [...markdown.matchAll(/^###\s+((?:N[1-7]|AL|GE|GM|PE)\.\d{2})\b/gm)].map((match) => match[1])
);
const markdownMissing = yamlIds.filter((id) => !markdownIds.includes(id));
const markdownExtra = markdownIds.filter((id) => !yamlIdSet.has(id));
check(markdownIds.length === 95, `grafo Markdown deveria declarar 95 competências; encontrou ${markdownIds.length}`);
check(markdownMissing.length === 0, `Markdown não declara: ${markdownMissing.join(", ")}`);
check(markdownExtra.length === 0, `Markdown declara IDs fora do YAML: ${markdownExtra.join(", ")}`);

const graphJson = JSON.parse(read("src/data/grafo_saga.json"));
check(sameNodes(yamlNodes, graphJson.nodes || []), "src/data/grafo_saga.json diverge do YAML agregado");

const graphTs = read("src/curriculum/grafo_saga.ts");
const tsNodeBlock = graphTs.match(/export const grafoSaga:[\s\S]*?=\s*\[([\s\S]*?)\n\];/);
const tsIds = tsNodeBlock
  ? [...tsNodeBlock[1].matchAll(/\bid:\s*"((?:N[1-7]|AL|GE|GM|PE)\.\d{2})"/g)].map((match) => match[1])
  : [];
check(tsIds.length === 95, `grafo TypeScript deveria declarar 95 nós; encontrou ${tsIds.length}`);
check(JSON.stringify(tsIds) === JSON.stringify(yamlIds), "ordem/IDs do grafo TypeScript divergem do YAML agregado");

const strandFiles = listFiles("curriculum", ".yaml").filter((file) => !file.endsWith("grafo_saga.yaml"));
const strandIds = [];
const strandNodes = new Map();
for (const file of strandFiles) {
  const strand = parseYaml(file);
  for (const [id, node] of Object.entries(strand.nodes || {})) {
    strandIds.push(id);
    check(!strandNodes.has(id), `${id} aparece em mais de um YAML por strand`);
    strandNodes.set(id, node);
  }
}
const missingFromStrands = yamlIds.filter((id) => !strandIds.includes(id));
const extraInStrands = strandIds.filter((id) => !yamlIdSet.has(id));
check(missingFromStrands.length === 0, `YAMLs por strand não declaram: ${missingFromStrands.join(", ")}`);
check(extraInStrands.length === 0, `YAMLs por strand declaram IDs fora do agregado: ${extraInStrands.join(", ")}`);
for (const node of yamlNodes) {
  const strandNode = strandNodes.get(node.id);
  if (!strandNode) continue;
  const aggregatePrereqs = sorted(node.prereqs || []);
  const strandPrereqs = sorted(strandNode.prereqs || []);
  check(
    JSON.stringify(strandPrereqs) === JSON.stringify(aggregatePrereqs),
    `${node.id} tem pré-requisitos diferentes no YAML agregado e no YAML por strand`
  );
}

const curriculum = read("src/curriculum/motores/curriculum.ts");
const generatorMapBlock = curriculum.match(/const GENERATOR_MAP[\s\S]*?=\s*\{([\s\S]*?)\n\};/);
const generatorEntries = generatorMapBlock
  ? [...generatorMapBlock[1].matchAll(/"((?:N[1-7]|AL|GE|GM|PE)\.\d{2})"\s*:\s*([A-Za-z0-9_]+)/g)]
      .map((match) => [match[1], match[2]])
  : [];
const generatorMap = new Map(generatorEntries);
const duplicateMappings = generatorEntries
  .map(([id]) => id)
  .filter((id, index, ids) => ids.indexOf(id) !== index);
check(duplicateMappings.length === 0, `GENERATOR_MAP contém duplicatas: ${unique(duplicateMappings).join(", ")}`);

const generatorFiles = [
  "src/utils/generators.ts",
  "src/utils/generatorsF1.ts",
  "src/utils/generatorsF2.ts",
];
const exportedGenerators = new Set();
for (const file of generatorFiles) {
  for (const match of read(file).matchAll(/export\s+(?:function|const)\s+(g[A-Za-z0-9_]+)/g)) {
    exportedGenerators.add(match[1]);
  }
}
const mappedGenerators = new Set(generatorMap.values());
const missingGeneratorExports = generatorEntries
  .filter(([, generator]) => !exportedGenerators.has(generator))
  .map(([id, generator]) => `${id}:${generator}`);
check(missingGeneratorExports.length === 0, `mapa usa geradores não exportados: ${missingGeneratorExports.join(", ")}`);

const fichaFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(path.join(ROOT, directory), { withFileTypes: true })) {
    const relative = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(relative);
    else if (entry.name.endsWith(".ts") && entry.name !== "index.ts") fichaFiles.push(relative);
  }
}
walk("src/curriculum/fichas");

const fichaIds = [];
for (const file of fichaFiles) {
  const match = read(file).match(/\bid:\s*["']((?:N[1-7]|AL|GE|GM|PE)\.\d{2}|dojo_[a-z]+)["']/);
  if (match) fichaIds.push(match[1]);
}
const journeyFichaIds = fichaIds.filter((id) => yamlIdSet.has(id));

const fichaIndex = read("src/curriculum/fichas/index.ts");
const importedFichaFiles = new Map(
  [...fichaIndex.matchAll(/import\s+\{\s*([A-Za-z0-9_]+)\s*\}\s+from\s+["'](.+?)["']/g)]
    .map((match) => [match[1], path.join("src/curriculum/fichas", `${match[2]}.ts`)])
);
const allFichasBlock = fichaIndex.match(/export const AllFichas\s*=\s*\[([\s\S]*?)\]/);
const registeredSymbols = allFichasBlock
  ? allFichasBlock[1].match(/[A-Za-z_][A-Za-z0-9_]*/g) || []
  : [];
const registeredFichaIds = [];
for (const symbol of registeredSymbols) {
  const file = importedFichaFiles.get(symbol);
  if (!file) continue;
  const match = read(file).match(/\bid:\s*["']((?:N[1-7]|AL|GE|GM|PE)\.\d{2}|dojo_[a-z]+)["']/);
  if (match) registeredFichaIds.push(match[1]);
}
const registeredJourneyFichaIds = registeredFichaIds.filter((id) => yamlIdSet.has(id));
const unregisteredFichaIds = fichaIds.filter((id) => !registeredFichaIds.includes(id));

const specCanonical = read("AI_Studio_Lab/pedagogia/SPEC_CONSTRUCAO_EXERCICIOS.md");
const specAlias = read("AI_Studio_Lab/pedagogia/SPEC_CONSTRUCAO_SAGA.md");
check(hash(specCanonical) === hash(specAlias), "os dois nomes da SPEC deixaram de ser aliases idênticos");

const fallbackIds = yamlIds.filter((id) => !generatorMap.has(id));
const orphanGenerators = sorted([...exportedGenerators].filter((name) => !mappedGenerators.has(name)));
const nomenclatureDrift = generatorEntries
  .filter(([id, generator]) => generator !== `g${id.replace(".", "_")}`)
  .map(([id, generator]) => `${id}:${generator}`);

console.log("SAGA — AUDITORIA CURRICULAR READ-ONLY");
console.log(`Executado em: ${new Date().toISOString()}`);
console.log("Fonte agregada: curriculum/grafo_saga.yaml\n");
console.log("[FONTES]");
console.log(`- YAML agregado: ${yamlNodes.length} nós`);
console.log(`- Markdown humano: ${markdownIds.length} competências`);
console.log(`- JSON derivado: ${(graphJson.nodes || []).length} nós`);
console.log(`- TypeScript runtime: ${tsIds.length} nós`);
console.log(`- YAMLs por strand: ${strandIds.length} nós (${strandFiles.length} arquivos)\n`);
console.log("[COBERTURA EXECUTÁVEL]");
console.log(`- Nós com gerador explícito: ${generatorMap.size}/${yamlNodes.length}`);
console.log(`- Nós no fallback \"Em construção\": ${fallbackIds.length}/${yamlNodes.length}`);
console.log(`- Fichas de Jornada no disco: ${journeyFichaIds.length}/${yamlNodes.length}`);
console.log(`- Fichas de Jornada registradas em AllFichas: ${registeredJourneyFichaIds.length}/${yamlNodes.length}`);
console.log(`- Fichas de Dojo no disco/registradas: ${fichaIds.length - journeyFichaIds.length}/${registeredFichaIds.length - registeredJourneyFichaIds.length}`);
console.log(`- Fichas no disco fora de AllFichas: ${unregisteredFichaIds.length}`);
console.log(`- Geradores exportados sem uso no mapa: ${orphanGenerators.length}`);
console.log(`- Mapeamentos com deriva de nome: ${nomenclatureDrift.length}\n`);
console.log(`[FALLBACKS]\n${fallbackIds.join(", ") || "Nenhum"}\n`);
console.log(`[FICHAS DE JORNADA]\n${sorted(journeyFichaIds).join(", ") || "Nenhuma"}\n`);
console.log(`[FICHAS FORA DE AllFichas]\n${sorted(unregisteredFichaIds).join(", ") || "Nenhuma"}\n`);
console.log(`[GERADORES ÓRFÃOS]\n${orphanGenerators.join(", ") || "Nenhum"}\n`);
console.log(`[DERIVA DE NOMENCLATURA]\n${nomenclatureDrift.join(", ") || "Nenhuma"}\n`);

if (warnings.length) {
  console.log("[AVISOS NÃO BLOQUEANTES]");
  warnings.forEach((warning) => console.log(`- ${warning}`));
  console.log();
}

if (failures.length) {
  console.error("[FALHAS DE INVARIANTE]");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("[RESULTADO] Invariantes canônicos aprovados; lacunas de cobertura permanecem explicitadas acima.");
}
