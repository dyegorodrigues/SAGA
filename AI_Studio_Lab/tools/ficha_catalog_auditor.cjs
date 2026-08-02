const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");

const ROOT = path.resolve(__dirname, "../..");
const FICHAS_DIR = path.join(ROOT, "AI_Studio_Lab/pedagogia/fichas");
const GRAPH_PATH = path.join(ROOT, "curriculum/grafo_saga.yaml");
const COMPONENTS_DIR = path.join(ROOT, "src/components");
const EXPECTED_FICHAS = 92;
const EXPECTED_COMPETENCIES = 88;
const REJECTED_IDS = new Set(["N2.08", "N5.06", "N5.07", "N5.08", "N7.03", "N7.04", "PE.05"]);

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const graph = YAML.parse(fs.readFileSync(GRAPH_PATH, "utf8"));
const graphIds = new Set((graph.nodes || []).map((node) => node.id));
const componentNames = new Set(
  fs.readdirSync(COMPONENTS_DIR, { recursive: true })
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => path.basename(file, ".tsx"))
);
const builtInPrimitives = new Set(["plain"]);

function parseFichaFile(file) {
  const source = fs.readFileSync(path.join(FICHAS_DIR, file), "utf8");
  const headings = [...source.matchAll(/^# FICHA\s+(\S+)\s+—\s+(.+)$/gm)];
  return headings.map((heading, index) => {
    const end = headings[index + 1]?.index ?? source.length;
    const body = source.slice(heading.index, end);
    const identity = body.match(/^\*\*Competência:\*\*\s+((?:N[1-7]|AL|GE|GM|PE)\.\d{2})\b.*?\*\*Primitiva:\*\*\s+(.+?)(?:\s+·|$)/m);
    return {
      file,
      fichaId: heading[1],
      title: heading[2].trim(),
      competenceId: identity?.[1],
      primitiveExpression: identity?.[2]?.trim(),
      primitives: identity ? [...identity[2].matchAll(/`([^`]+)`/g)].map((match) => match[1]) : [],
      body,
    };
  });
}

const files = fs.readdirSync(FICHAS_DIR).filter((file) => file.endsWith(".md")).sort();
const fichas = files.flatMap(parseFichaFile);
const fichaIds = fichas.map((ficha) => ficha.fichaId);
const competenceIds = fichas.map((ficha) => ficha.competenceId).filter(Boolean);
const uniqueCompetenceIds = new Set(competenceIds);

check(fichas.length === EXPECTED_FICHAS, `esperava ${EXPECTED_FICHAS} fichas; encontrou ${fichas.length}`);
check(new Set(fichaIds).size === fichaIds.length, "há IDs de ficha duplicados");
check(
  uniqueCompetenceIds.size === EXPECTED_COMPETENCIES,
  `esperava cobertura autoral de ${EXPECTED_COMPETENCIES} competências; encontrou ${uniqueCompetenceIds.size}`
);

for (const ficha of fichas) {
  check(Boolean(ficha.competenceId), `${ficha.fichaId} não declara competência e primitiva na identidade`);
  if (ficha.competenceId) {
    check(graphIds.has(ficha.competenceId), `${ficha.fichaId} referencia competência inexistente ${ficha.competenceId}`);
    check(!REJECTED_IDS.has(ficha.competenceId), `${ficha.fichaId} referencia ID rejeitado ${ficha.competenceId}`);
  }
  check(ficha.primitives.length > 0, `${ficha.fichaId} não declara primitiva entre crases`);
  for (let section = 1; section <= 9; section += 1) {
    check(new RegExp(`^## ${section}(?:\\.|\\s)`, "m").test(ficha.body), `${ficha.fichaId} não possui a seção ${section}`);
  }
}

const missingCompetenceFichas = [...graphIds].filter((id) => !uniqueCompetenceIds.has(id));
const primitiveUsage = new Map();
for (const ficha of fichas) {
  for (const primitive of ficha.primitives) {
    if (!primitiveUsage.has(primitive)) primitiveUsage.set(primitive, []);
    primitiveUsage.get(primitive).push(ficha.fichaId);
  }
}
const unavailablePrimitives = [...primitiveUsage]
  .filter(([primitive]) => !componentNames.has(primitive) && !builtInPrimitives.has(primitive))
  .map(([primitive, usedBy]) => ({ primitive, usedBy }));

console.log("SAGA — CATÁLOGO AUTORAL DE FICHAS (READ-ONLY)");
console.log(`Blocos: ${files.length}`);
console.log(`Fichas: ${fichas.length}`);
console.log(`Competências cobertas: ${uniqueCompetenceIds.size}/${graphIds.size}`);
console.log(`Primitivas declaradas: ${primitiveUsage.size}`);
console.log(`Primitivas sem componente homônimo: ${unavailablePrimitives.length}\n`);

console.log("[COBERTURA POR BLOCO]");
for (const file of files) {
  console.log(`- ${file}: ${fichas.filter((ficha) => ficha.file === file).length} fichas`);
}

console.log("\n[COMPETÊNCIAS SEM FICHA AUTORAL]");
console.log(missingCompetenceFichas.join(", ") || "Nenhuma");

console.log("\n[PRIMITIVAS SEM COMPONENTE HOMÔNIMO]");
for (const { primitive, usedBy } of unavailablePrimitives) {
  console.log(`- ${primitive}: ${usedBy.length} ficha(s) — ${usedBy.join(", ")}`);
}
if (!unavailablePrimitives.length) console.log("Nenhuma");

if (failures.length) {
  console.error("\n[FALHAS DE CONTRATO AUTORAL]");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("\n[RESULTADO] 92 fichas válidas, nove seções presentes e 88 competências cobertas.");
}
