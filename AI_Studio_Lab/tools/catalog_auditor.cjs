const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");

const ROOT = path.resolve(__dirname, "../..");
const SRC_ROOT = path.join(ROOT, "src");
const GRAPH_YAML_PATH = path.join(ROOT, "curriculum/grafo_saga.yaml");
const GRAPH_MD_PATH = path.join(ROOT, "AI_Studio_Lab/pedagogia/CURRICULUM_GRAPH.md");
const GRAPH_JSON_PATH = path.join(ROOT, "AI_Studio_Lab/data/curriculum_graph.json");
const GRAPH_TS_PATH = path.join(ROOT, "src/curriculum/graph.ts");
const STRAND_DIR = path.join(ROOT, "curriculum");
const GENERATORS_PATH = path.join(ROOT, "src/utils/generators.ts");
const GENERATORS_VISUAL_PATH = path.join(ROOT, "src/utils/generatorsVisual.ts");
const CURRICULUM_PATH = path.join(ROOT, "src/curriculum/motores/curriculum.ts");
const COMPOSER_CANARY_PATH = path.join(ROOT, "src/curriculum/motores/composerCanary.ts");
const COMPOSER_CANARY_IDS_PATH = path.join(ROOT, "src/curriculum/motores/composerCanaryIds.ts");
const FICHAS_INDEX_PATH = path.join(ROOT, "src/curriculum/fichas/index.ts");
const JOURNEY_FICHAS_DIR = path.join(ROOT, "src/curriculum/fichas/jornada");
const AUTHORED_FICHAS_DIR = path.join(ROOT, "AI_Studio_Lab/pedagogia/fichas");

const failures = [];
const warnings = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const warn = (condition, message) => {
  if (!condition) warnings.push(message);
};
const unique = (values) => [...new Set(values)];
const sorted = (values) => [...values].sort((a, b) => a.localeCompare(b));

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(absolute));
    else out.push(absolute);
  }
  return out;
}

function parseImportedJourneyIds(indexSource) {
  const uncommented = stripComments(indexSource);
  const imports = new Map(
    [...uncommented.matchAll(/import\s*\{\s*([A-Za-z0-9_]+)\s*\}\s*from\s*['"]\.\/jornada\/([^'"]+)['"]/g)]
      .map((match) => [match[1], match[2]])
  );
  const registryMatch = uncommented.match(/export\s+const\s+JOURNEY_FICHAS\s*=\s*\[([\s\S]*?)\];/);
  check(Boolean(registryMatch), "não foi possível localizar JOURNEY_FICHAS em fichas/index.ts");
  if (!registryMatch) return [];
  const symbols = registryMatch[1].match(/\b[A-Za-z][A-Za-z0-9_]*\b/g) || [];
  const unknownSymbols = unique(symbols.filter((symbol) => !imports.has(symbol)));
  check(unknownSymbols.length === 0, `JOURNEY_FICHAS contém símbolos sem import de jornada: ${unknownSymbols.join(", ")}`);
  return symbols.filter((symbol) => imports.has(symbol)).map((symbol) => imports.get(symbol));
}

function extractIdsFromGraphMarkdown(source) {
  return [...source.matchAll(/^##\s+((?:N[1-7]|AL|GE|GM|PE)\.\d{2})\b/gm)].map((match) => match[1]);
}

function extractIdsFromGraphTs(source) {
  return [...source.matchAll(/id:\s*["']((?:N[1-7]|AL|GE|GM|PE)\.\d{2})["']/g)].map((match) => match[1]);
}

function extractIdsFromStrandYaml(file) {
  const parsed = YAML.parse(read(file));
  return (parsed.nodes || []).map((node) => node.id).filter(Boolean);
}

function extractExportedGenerators(source) {
  return [...source.matchAll(/export\s+function\s+(g[A-Za-z0-9_]+)\s*\(/g)].map((match) => match[1]);
}

function extractGeneratorMap(source) {
  const entries = [];
  for (const match of source.matchAll(/["']((?:N[1-7]|AL|GE|GM|PE)\.\d{2})["']\s*:\s*(g[A-Za-z0-9_]+)/g)) {
    entries.push([match[1], match[2]]);
  }
  return entries;
}

function extractComposerRegistryIds(source) {
  const uncommented = stripComments(source);
  const match = uncommented.match(/const\s+COMPOSER_FICHAS\s*:\s*Record<[^>]+>\s*=\s*\{([\s\S]*?)\n\};/);
  check(Boolean(match), "não foi possível localizar COMPOSER_FICHAS em composerCanary.ts");
  if (!match) return [];
  return [...match[1].matchAll(/["']((?:N[1-7]|AL|GE|GM|PE)\.\d{2})["']\s*:/g)].map((m) => m[1]);
}

function extractComposerCanaryIds(source) {
  const uncommented = stripComments(source);
  const match = uncommented.match(/DEFAULT_COMPOSER_CANARY_IDS\s*=\s*\[([\s\S]*?)\]\s*as\s+const/);
  check(Boolean(match), "não foi possível localizar DEFAULT_COMPOSER_CANARY_IDS em composerCanaryIds.ts");
  if (!match) return [];
  return [...match[1].matchAll(/["']((?:N[1-7]|AL|GE|GM|PE)\.\d{2})["']/g)].map((m) => m[1]);
}

const graphYaml = YAML.parse(read(GRAPH_YAML_PATH));
const yamlNodes = graphYaml.nodes || [];
const yamlIds = yamlNodes.map((node) => node.id);
const yamlIdSet = new Set(yamlIds);

const markdownIds = extractIdsFromGraphMarkdown(read(GRAPH_MD_PATH));
const graphJson = JSON.parse(read(GRAPH_JSON_PATH));
const graphJsonIds = (graphJson.nodes || []).map((node) => node.id);
const tsIds = extractIdsFromGraphTs(read(GRAPH_TS_PATH));

const strandFiles = fs.readdirSync(STRAND_DIR)
  .filter((file) => /^(?:N[1-7]|AL|GE|GM|PE)\.yaml$/.test(file))
  .sort();
const strandIds = strandFiles.flatMap((file) => extractIdsFromStrandYaml(path.join(STRAND_DIR, file)));

check(yamlIds.length === 90, `grafo YAML deveria ter 90 nós; encontrou ${yamlIds.length}`);
check(new Set(yamlIds).size === yamlIds.length, "grafo YAML tem IDs duplicados");
check(sorted(markdownIds).join("|") === sorted(yamlIds).join("|"), "CURRICULUM_GRAPH.md diverge dos IDs do YAML agregado");
check(sorted(graphJsonIds).join("|") === sorted(yamlIds).join("|"), "curriculum_graph.json diverge dos IDs do YAML agregado");
check(sorted(tsIds).join("|") === sorted(yamlIds).join("|"), "graph.ts diverge dos IDs do YAML agregado");
check(sorted(strandIds).join("|") === sorted(yamlIds).join("|"), "YAMLs por strand divergem do YAML agregado");

const generatorSources = [read(GENERATORS_PATH), read(GENERATORS_VISUAL_PATH)].join("\n");
const exportedGenerators = new Set(extractExportedGenerators(generatorSources));
const curriculumSource = read(CURRICULUM_PATH);
const generatorEntries = extractGeneratorMap(curriculumSource);
const generatorMap = new Map(generatorEntries);
const mappedGenerators = new Set(generatorEntries.map(([, generator]) => generator));

const composerRegisteredIds = unique(extractComposerRegistryIds(read(COMPOSER_CANARY_PATH)));
const composerRegisteredSet = new Set(composerRegisteredIds);
const composerActiveIds = unique(extractComposerCanaryIds(read(COMPOSER_CANARY_IDS_PATH)));
const composerActiveSet = new Set(composerActiveIds);
const composerRegisteredInactiveIds = composerRegisteredIds.filter((id) => !composerActiveSet.has(id));
const composerActiveWithoutRegistration = composerActiveIds.filter((id) => !composerRegisteredSet.has(id));
const composerUnknownRegistered = composerRegisteredIds.filter((id) => !yamlIdSet.has(id));
const composerUnknownActive = composerActiveIds.filter((id) => !yamlIdSet.has(id));

check(composerActiveWithoutRegistration.length === 0, `Composer ativo sem ficha registrada: ${composerActiveWithoutRegistration.join(", ")}`);
check(composerUnknownRegistered.length === 0, `Composer registrou IDs fora do grafo: ${composerUnknownRegistered.join(", ")}`);
check(composerUnknownActive.length === 0, `Composer ativou IDs fora do grafo: ${composerUnknownActive.join(", ")}`);

const journeyFiles = fs.readdirSync(JOURNEY_FICHAS_DIR)
  .filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"))
  .sort();
const journeyFichaIds = journeyFiles.map((file) => path.basename(file, ".ts"));
const journeyRegistryIds = parseImportedJourneyIds(read(FICHAS_INDEX_PATH));
const journeyRegistryMissing = journeyFichaIds.filter((id) => !journeyRegistryIds.includes(id));
const journeyRegistryExtra = journeyRegistryIds.filter((id) => !journeyFichaIds.includes(id));
const journeyRegistryDuplicates = journeyRegistryIds.filter((id, index) => journeyRegistryIds.indexOf(id) !== index);
check(journeyRegistryMissing.length === 0, `fichas de Jornada no disco fora de JOURNEY_FICHAS: ${journeyRegistryMissing.join(", ")}`);
check(journeyRegistryExtra.length === 0, `JOURNEY_FICHAS referencia ficha inexistente no disco: ${journeyRegistryExtra.join(", ")}`);
check(journeyRegistryDuplicates.length === 0, `JOURNEY_FICHAS contém duplicatas: ${unique(journeyRegistryDuplicates).join(", ")}`);

const allFichaSources = walk(path.join(ROOT, "src/curriculum/fichas"))
  .filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts") && path.basename(file) !== "index.ts")
  .map((file) => [file, read(file)]);
const fichaIds = unique(allFichaSources.flatMap(([, source]) => [...source.matchAll(/\bid:\s*["']([A-Z0-9.]+)["']/g)].map((match) => match[1])));
const indexSource = read(FICHAS_INDEX_PATH);
const registeredFichaIds = fichaIds.filter((id) => new RegExp(`\\b${id.replace(".", "_")}\\b`).test(indexSource) || indexSource.includes(id));
const registeredJourneyFichaIds = journeyFichaIds.filter((id) => journeyRegistryIds.includes(id));
const unregisteredFichaIds = fichaIds.filter((id) => !registeredFichaIds.includes(id));
const journeyFichasWithRtTarget = allFichaSources
  .filter(([file]) => file.startsWith(JOURNEY_FICHAS_DIR))
  .filter(([, source]) => /5:\s*\{[^}]*rt_alvo:/s.test(source))
  .map(([file]) => path.basename(file, ".ts"));

const authoredFichaFiles = fs.readdirSync(AUTHORED_FICHAS_DIR)
  .filter((file) => file.endsWith(".md"))
  .sort();
const authoredFichaSources = authoredFichaFiles.map((file) => read(path.join(AUTHORED_FICHAS_DIR, file)));
const authoredFichaCount = authoredFichaSources.reduce(
  (total, source) => total + (source.match(/^# FICHA\s+/gm) || []).length,
  0
);
/**
 * Não existe mais uma contagem manual esperada de fichas aqui.
 *
 * P21 estabeleceu o grafo + cobertura autoral como fontes de verdade e o
 * `ficha_catalog_auditor.cjs` valida, de forma específica, cada ficha, suas nove
 * seções, cobertura e exceções explícitas. Repetir "92", "93" etc. neste
 * auditor agregado criava uma segunda fonte de verdade que necessariamente
 * ficava obsoleta quando uma lacuna era fechada.
 *
 * Mantemos a contagem como métrica observável, e travamos apenas invariantes que
 * podem ser derivados do estado real.
 */
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
