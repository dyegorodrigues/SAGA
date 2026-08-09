const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");

const ROOT = path.resolve(__dirname, "../..");
const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), "utf8");
const parseYaml = (relativePath) => YAML.parse(read(relativePath));
const unique = (items) => [...new Set(items)];
const sorted = (items) => [...items].sort((a, b) => a.localeCompare(b));

const failures = [];
const warnings = [];
// 88 no fechamento da reconciliação original. A P12 criou N1.13 ao separar
// “produzir quantidade” de “contar até 20” (89). A auditoria P15 criou GM.12
// ao separar massa/capacidade de GM.02 (tempo) e GM.05 (unidades) (90).
// Ver Bíblia v3.3 e DECISAO_P15_F50.md.
const EXPECTED_COMPETENCIES = 90;
const EXPECTED_FLUENCY_TRACKS = 13;
const REJECTED_DUPLICATE_IDS = ["N2.08", "N5.06", "N5.07", "N5.08", "N7.03", "N7.04", "PE.05"];
// Progressões legítimas cujos nomes necessariamente contêm o conceito do pré-requisito.
// Toda nova exceção exige decisão pedagógica explícita, não ajuste silencioso do teste.
const SEMANTIC_CONTAINMENT_ALLOWLIST = new Set(["N2.04:N2.02", "GE.09:GM.08"]);

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

check(
  yamlNodes.length === EXPECTED_COMPETENCIES,
  `grafo YAML deveria ter ${EXPECTED_COMPETENCIES} nós; encontrou ${yamlNodes.length}`
);
check(yamlIdSet.size === yamlIds.length, "grafo YAML contém IDs duplicados");
check(
  (graphYaml.fluency || []).length === EXPECTED_FLUENCY_TRACKS,
  `grafo YAML deveria ter ${EXPECTED_FLUENCY_TRACKS} trilhas de fluência; encontrou ${(graphYaml.fluency || []).length}`
);
for (const rejectedId of REJECTED_DUPLICATE_IDS) {
  check(!yamlIdSet.has(rejectedId), `${rejectedId} foi rejeitado por duplicação e reapareceu no grafo`);
}

// P15/GM.12: não basta contar 90. Protegemos a SEMÂNTICA da separação para
// impedir que uma edição futura recicle um ID ocupado e volte a mascarar nós.
const gm01 = yamlNodes.find((node) => node.id === "GM.01");
const gm02 = yamlNodes.find((node) => node.id === "GM.02");
const gm05 = yamlNodes.find((node) => node.id === "GM.05");
const gm12 = yamlNodes.find((node) => node.id === "GM.12");
check(Boolean(gm01), "GM.01 ausente — comparação direta é a base de grandezas");
check(Boolean(gm12), "GM.12 ausente — F50 precisa de nó próprio para massa/capacidade");
check(gm02?.nome === "Tempo cotidiano", "GM.02 foi sequestrado: deve continuar Tempo cotidiano");
check(
  JSON.stringify(gm12?.prereqs || []) === JSON.stringify(["GM.01"]),
  `GM.12 deve depender apenas de GM.01; recebeu ${JSON.stringify(gm12?.prereqs || [])}`
);
check(
  JSON.stringify(gm05?.prereqs || []) === JSON.stringify(["GM.12", "N2.02"]),
  `GM.05 deve depender de GM.12 + N2.02; recebeu ${JSON.stringify(gm05?.prereqs || [])}`
);

for (const node of yamlNodes) {
  for (const prereq of node.prereqs || []) {
    check(yamlIdSet.has(prereq), `${node.id} referencia pré-requisito inexistente ${prereq}`);
    check(prereq !== node.id, `${node.id} referencia a si próprio como pré-requisito`);
  }
}

const normalizedName = (name) => name
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();
for (let leftIndex = 0; leftIndex < yamlNodes.length; leftIndex += 1) {
  const left = yamlNodes[leftIndex];
  for (let rightIndex = leftIndex + 1; rightIndex < yamlNodes.length; rightIndex += 1) {
    const right = yamlNodes[rightIndex];
    const samePrereqs = JSON.stringify(sorted(left.prereqs || [])) === JSON.stringify(sorted(right.prereqs || []));
    const leftName = normalizedName(left.nome);
    const rightName = normalizedName(right.nome);
    const overlappingName = leftName === rightName || leftName.includes(rightName) || rightName.includes(leftName);
    check(!(samePrereqs && overlappingName), `${left.id} e ${right.id} parecem duplicar nome e pré-requisitos`);
  }
}
for (const node of yamlNodes) {
  const nodeName = normalizedName(node.nome);
  for (const prereqId of node.prereqs || []) {
    const prereq = yamlNodes.find((candidate) => candidate.id === prereqId);
    if (!prereq) continue;
    const prereqName = normalizedName(prereq.nome);
    const containment = nodeName === prereqName || nodeName.includes(prereqName) || prereqName.includes(nodeName);
    check(
      !containment || SEMANTIC_CONTAINMENT_ALLOWLIST.has(`${node.id}:${prereq.id}`),
      `${node.id} tem nome semanticamente contido no pré-requisito ${prereq.id}`
    );
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
check(
  markdownIds.length === EXPECTED_COMPETENCIES,
  `grafo Markdown deveria declarar ${EXPECTED_COMPETENCIES} competências; encontrou ${markdownIds.length}`
);
check(markdownMissing.length === 0, `Markdown não declara: ${markdownMissing.join(", ")}`);
check(markdownExtra.length === 0, `Markdown declara IDs fora do YAML: ${markdownExtra.join(", ")}`);

const graphJson = JSON.parse(read("src/data/grafo_saga.json"));
check(sameNodes(yamlNodes, graphJson.nodes || []), "src/data/grafo_saga.json diverge do YAML agregado");

const graphTs = read("src/curriculum/grafo_saga.ts");
const tsNodeBlock = graphTs.match(/export const grafoSaga:[\s\S]*?=\s*\[([\s\S]*?)\n\];/);
const tsIds = tsNodeBlock
  ? [...tsNodeBlock[1].matchAll(/\bid:\s*"((?:N[1-7]|AL|GE|GM|PE)\.\d{2})"/g)].map((match) => match[1])
  : [];
check(
  tsIds.length === EXPECTED_COMPETENCIES,
  `grafo TypeScript deveria declarar ${EXPECTED_COMPETENCIES} nós; encontrou ${tsIds.length}`
);
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
const journeyFichasWithRtTarget = [];
for (const file of fichaFiles) {
  const source = read(file);
  const idMatch = source.match(/\bid:\s*["']((?:N[1-7]|AL|GE|GM|PE)\.\d{2})["']/);
  if (!idMatch || !yamlIdSet.has(idMatch[1])) continue;
  const levelFive = source.match(/\b5:\s*\{([^}]*)\}/);
  const rtTarget = levelFive?.[1].match(/\brt_alvo:\s*(\d+(?:\.\d+)?)/);
  if (rtTarget && Number(rtTarget[1]) > 0) journeyFichasWithRtTarget.push(idMatch[1]);
}
const journeyFichasMissingRt = journeyFichaIds.filter((id) => !journeyFichasWithRtTarget.includes(id));
check(journeyFichasMissingRt.length === 0, `fichas sem rt_alvo positivo no nível 5: ${journeyFichasMissingRt.join(", ")}`);

const fichaIndex = read("src/curriculum/fichas/index.ts");

/**
 * Resolve um especificador de import como o Node e o TypeScript resolvem.
 *
 * ⚠️ Isto lia SEMPRE `<especificador>.ts`. Um import de diretório —
 * `from './dojo/jardim'`, que resolve para `dojo/jardim/index.ts` — fazia o
 * auditor abrir um arquivo inexistente e **derrubar o processo inteiro** com
 * ENOENT, no meio da varredura, sem dizer qual invariante falhou.
 *
 * O import é legal nas duas linguagens; quem estava errado era a ferramenta. E
 * um portão que morre por não saber ler o código que ele existe para auditar
 * não protege nada: ele só transforma trabalho válido em CI vermelho.
 */
function resolverModulo(base, especificador) {
  const semExtensao = path.join(base, especificador);
  const candidatos = [`${semExtensao}.ts`, `${semExtensao}.tsx`,
    path.join(semExtensao, "index.ts"), path.join(semExtensao, "index.tsx")];
  return candidatos.find((c) => fs.existsSync(path.join(ROOT, c))) ?? candidatos[0];
}

const importedFichaFiles = new Map(
  [...fichaIndex.matchAll(/import\s+\{\s*([A-Za-z0-9_]+)\s*\}\s+from\s+["'](.+?)["']/g)]
    .map((match) => [match[1], resolverModulo("src/curriculum/fichas", match[2])])
);

function fichaIdForSymbol(symbol) {
  const file = importedFichaFiles.get(symbol);
  if (!file) return undefined;
  return read(file).match(/\bid:\s*["']((?:N[1-7]|AL|GE|GM|PE)\.\d{2}|dojo_[a-z]+)["']/)?.[1];
}

function symbolsFromArray(block) {
  const codeOnly = (block || "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
  return codeOnly.match(/[A-Za-z_][A-Za-z0-9_]*/g) || [];
}

const journeyRegistryBlock = fichaIndex.match(/export const JOURNEY_FICHAS\s*=\s*\[([\s\S]*?)\];/);
const journeyRegistrySymbols = symbolsFromArray(journeyRegistryBlock?.[1]);
const journeyRegistryIds = journeyRegistrySymbols
  .map(fichaIdForSymbol)
  .filter((id) => id && yamlIdSet.has(id));
const journeyRegistryMissing = journeyFichaIds.filter((id) => !journeyRegistryIds.includes(id));
const journeyRegistryExtra = journeyRegistryIds.filter((id) => !journeyFichaIds.includes(id));
check(
  new Set(journeyRegistryIds).size === journeyRegistryIds.length,
  "JOURNEY_FICHAS contém competências duplicadas"
);
check(
  journeyRegistryMissing.length === 0,
  `fichas de Jornada no disco fora de JOURNEY_FICHAS: ${journeyRegistryMissing.join(", ")}`
);
check(
  journeyRegistryExtra.length === 0,
  `JOURNEY_FICHAS referencia fichas sem correspondente no disco: ${journeyRegistryExtra.join(", ")}`
);

const allFichasBlock = fichaIndex.match(/export const AllFichas\s*=\s*\[([\s\S]*?)\];/);
const registeredSymbols = symbolsFromArray(allFichasBlock?.[1]);
const registeredFichaIds = [];
for (const symbol of registeredSymbols) {
  if (symbol === "JOURNEY_FICHAS") {
    registeredFichaIds.push(...journeyRegistryIds);
    continue;
  }
  const id = fichaIdForSymbol(symbol);
  if (id) registeredFichaIds.push(id);
}
const registeredJourneyFichaIds = registeredFichaIds.filter((id) => yamlIdSet.has(id));
const unregisteredFichaIds = fichaIds.filter((id) => !registeredFichaIds.includes(id));
const journeyMissingFromAllFichas = journeyRegistryIds.filter((id) => !registeredJourneyFichaIds.includes(id));
check(
  new Set(registeredJourneyFichaIds).size === registeredJourneyFichaIds.length,
  "AllFichas expõe fichas de Jornada duplicadas"
);
check(
  journeyMissingFromAllFichas.length === 0,
  `JOURNEY_FICHAS não está integralmente exposta em AllFichas: ${journeyMissingFromAllFichas.join(", ")}`
);

const composerCanarySource = read("src/curriculum/motores/composerCanary.ts");
const composerCanaryIdsSource = read("src/curriculum/motores/composerCanaryIds.ts");
const composerRegistryBlock = composerCanarySource.match(/const COMPOSER_FICHAS[\s\S]*?=\s*\{([\s\S]*?)\n\};/);
const composerRegisteredRaw = composerRegistryBlock
  ? [...composerRegistryBlock[1].matchAll(/"((?:N[1-7]|AL|GE|GM|PE)\.\d{2})"\s*:/g)].map((match) => match[1])
  : [];
const composerActiveBlock = composerCanaryIdsSource.match(/export const DEFAULT_COMPOSER_CANARY_IDS\s*=\s*\[([\s\S]*?)\]\s+as const/);
const composerActiveRaw = composerActiveBlock
  ? [...composerActiveBlock[1].matchAll(/"((?:N[1-7]|AL|GE|GM|PE)\.\d{2})"/g)].map((match) => match[1])
  : [];
const composerRegisteredIds = unique(composerRegisteredRaw);
const composerActiveIds = unique(composerActiveRaw);
const composerRegisteredSet = new Set(composerRegisteredIds);
const composerActiveSet = new Set(composerActiveIds);
const composerRegisteredInactiveIds = composerRegisteredIds.filter((id) => !composerActiveSet.has(id));
const activeWithoutRegistry = composerActiveIds.filter((id) => !composerRegisteredSet.has(id));
const composerRegisteredOutsideGraph = composerRegisteredIds.filter((id) => !yamlIdSet.has(id));
const composerActiveOutsideGraph = composerActiveIds.filter((id) => !yamlIdSet.has(id));
check(
  composerRegisteredRaw.length === composerRegisteredIds.length,
  "COMPOSER_FICHAS contém IDs duplicados"
);
check(
  composerActiveRaw.length === composerActiveIds.length,
  "DEFAULT_COMPOSER_CANARY_IDS contém IDs duplicados"
);
check(
  activeWithoutRegistry.length === 0,
  `canários Composer ativos sem ficha registrada: ${activeWithoutRegistry.join(", ")}`
);
check(
  composerRegisteredOutsideGraph.length === 0,
  `COMPOSER_FICHAS contém IDs fora do grafo: ${composerRegisteredOutsideGraph.join(", ")}`
);
check(
  composerActiveOutsideGraph.length === 0,
  `canários Composer ativos fora do grafo: ${composerActiveOutsideGraph.join(", ")}`
);

const declaredCountSources = [
  ["Bíblia", "AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md", /as 90 competências:/],
  ["Grafo humano", "AI_Studio_Lab/pedagogia/GRAFO_DE_CONHECIMENTO_SAGA.md", /\*\*Total: 90 competências\.\*\*/],
  ["Manual", "AI_Studio_Lab/pedagogia/MANUAL_DIDATICO_SAGA.md", /89 de 89/],
  ["Método", "AI_Studio_Lab/pedagogia/METODO_SAGA.md", /grafo de 89 competências/],
];
for (const [label, file, pattern] of declaredCountSources) {
  check(pattern.test(read(file)), `${label} não declara o invariante canônico de ${EXPECTED_COMPETENCIES} competências`);
}

const authoredFichaFiles = listFiles("AI_Studio_Lab/pedagogia/fichas", ".md");
const authoredFichaSources = authoredFichaFiles.map(read);
const authoredFichaCount = authoredFichaSources.reduce(
  (total, source) => total + (source.match(/^# FICHA\s+/gm) || []).length,
  0
);
// P21: a contagem de fichas é métrica derivada, não uma segunda fonte de verdade.
// Cobertura, IDs desconhecidos e exceções explícitas são validados no auditor específico.
check(authoredFichaCount >= 1, "catálogo autoral não contém nenhuma ficha");
const authoredCompetenceIds = unique(
  authoredFichaSources.flatMap((source) =>
    [...source.matchAll(/^\*\*Competência:\*\*\s+((?:N[1-7]|AL|GE|GM|PE)\.\d{2})\b/gm)].map((match) => match[1])
  )
);
const authoredUnknownIds = authoredCompetenceIds.filter((id) => !yamlIdSet.has(id));
check(authoredUnknownIds.length === 0, `fichas autorais referenciam IDs fora do grafo: ${authoredUnknownIds.join(", ")}`);

const legacyExplicitIds = yamlIds.filter((id) => generatorMap.has(id));
const realFallbackIds = yamlIds.filter((id) => !generatorMap.has(id) && !composerActiveSet.has(id));
const servedWithoutFallbackIds = yamlIds.filter((id) => generatorMap.has(id) || composerActiveSet.has(id));
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
console.log(`- Trilhas de fluência: ${(graphYaml.fluency || []).length}`);
console.log(`- Fichas autorais documentadas: ${authoredFichaCount} (${authoredFichaFiles.length} blocos)\n`);
console.log("[PROVENIÊNCIA EXECUTÁVEL]");
console.log(`- Gerador legado explícito: ${legacyExplicitIds.length}/${yamlNodes.length}`);
console.log(`- Composer registrado: ${composerRegisteredIds.length}/${yamlNodes.length}`);
console.log(`- Composer ativo: ${composerActiveIds.length}/${yamlNodes.length}`);
console.log(`- Composer registrado e inativo: ${composerRegisteredInactiveIds.length}/${yamlNodes.length}`);
console.log(`- Servido sem placeholder (legado ∪ Composer ativo): ${servedWithoutFallbackIds.length}/${yamlNodes.length}`);
console.log(`- Fallback real sem conteúdo servido: ${realFallbackIds.length}/${yamlNodes.length}\n`);
console.log("[CATÁLOGOS DE FICHA]");
console.log(`- Fichas de Jornada no disco: ${journeyFichaIds.length}/${yamlNodes.length}`);
console.log(`- Fichas de Jornada em JOURNEY_FICHAS: ${journeyRegistryIds.length}/${yamlNodes.length}`);
console.log(`- Fichas de Jornada expostas em AllFichas: ${registeredJourneyFichaIds.length}/${yamlNodes.length}`);
console.log(`- Fichas de Jornada com rt_alvo no nível 5: ${journeyFichasWithRtTarget.length}/${journeyFichaIds.length}`);
console.log(`- Fichas de Dojo no disco/registradas: ${fichaIds.length - journeyFichaIds.length}/${registeredFichaIds.length - registeredJourneyFichaIds.length}`);
console.log(`- Fichas no disco fora de AllFichas: ${unregisteredFichaIds.length}`);
console.log(`- Geradores exportados sem uso no mapa: ${orphanGenerators.length}`);
console.log(`- Mapeamentos com deriva de nome: ${nomenclatureDrift.length}\n`);
console.log(`[LEGADO EXPLÍCITO]\n${sorted(legacyExplicitIds).join(", ") || "Nenhum"}\n`);
console.log(`[COMPOSER REGISTRADO]\n${sorted(composerRegisteredIds).join(", ") || "Nenhum"}\n`);
console.log(`[COMPOSER ATIVO]\n${sorted(composerActiveIds).join(", ") || "Nenhum"}\n`);
console.log(`[COMPOSER REGISTRADO E INATIVO]\n${sorted(composerRegisteredInactiveIds).join(", ") || "Nenhum"}\n`);
console.log(`[FALLBACK REAL]\n${sorted(realFallbackIds).join(", ") || "Nenhum"}\n`);
console.log(`[FICHAS DE JORNADA]\n${sorted(journeyFichaIds).join(", ") || "Nenhuma"}\n`);
console.log(`[FICHAS DE JORNADA FORA DE JOURNEY_FICHAS]\n${sorted(journeyRegistryMissing).join(", ") || "Nenhuma"}\n`);
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
  console.log("[RESULTADO] Invariantes canônicos aprovados; proveniência e lacunas de cobertura estão explicitadas acima.");
}
