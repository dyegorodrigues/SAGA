const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");
const { FICHA_RUNTIME_MAP } = require("./ficha_runtime_map.cjs");

const ROOT = path.resolve(__dirname, "../..");
const FICHAS_DIR = path.join(ROOT, "AI_Studio_Lab/pedagogia/fichas");
const GRAPH_PATH = path.join(ROOT, "curriculum/grafo_saga.yaml");
const COMPONENTS_DIR = path.join(ROOT, "src/components");
const COMPOSER_PATH = path.join(ROOT, "src/curriculum/Composer.ts");
const RENDERER_PATHS = [
  path.join(ROOT, "src/components/FichaRenderer.tsx"),
  path.join(ROOT, "src/components/gameloop/GameLoopExerciseRenderer.tsx"),
];
const EXPECTED_FICHAS = 93;
const EXPLICIT_MISSING_FICHA_EXCEPTIONS = new Map([
  ["GM.02", "P21/P22: Tempo cotidiano ainda sem ficha Markdown; decisão pedagógica deliberada pendente."],
]);
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
const composerSource = fs.readFileSync(COMPOSER_PATH, "utf8");
const rendererSource = RENDERER_PATHS.map((file) => fs.readFileSync(file, "utf8")).join("\n");

const composerTem = (kind) => composerSource.includes(`case "${kind}"`) || composerSource.includes(`case '${kind}'`);
const rendererTem = (kind) => rendererSource.includes(`kind === "${kind}"`)
  || rendererSource.includes(`kind === '${kind}'`)
  || rendererSource.includes(`case "${kind}"`)
  || rendererSource.includes(`case '${kind}'`);

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
const unexpectedMissingCompetences = missingCompetenceFichas
  .filter((id) => !EXPLICIT_MISSING_FICHA_EXCEPTIONS.has(id));
const staleMissingExceptions = [...EXPLICIT_MISSING_FICHA_EXCEPTIONS.keys()]
  .filter((id) => !missingCompetenceFichas.includes(id));
const unknownMissingExceptions = [...EXPLICIT_MISSING_FICHA_EXCEPTIONS.keys()]
  .filter((id) => !graphIds.has(id));
const unjustifiedMissingExceptions = [...EXPLICIT_MISSING_FICHA_EXCEPTIONS]
  .filter(([, reason]) => typeof reason !== "string" || reason.trim().length < 20)
  .map(([id]) => id);

check(
  unexpectedMissingCompetences.length === 0,
  `grafo possui competências sem ficha e sem exceção explícita: ${unexpectedMissingCompetences.join(", ")}`
);
check(
  staleMissingExceptions.length === 0,
  `remova exceções de ficha que já não são lacunas: ${staleMissingExceptions.join(", ")}`
);
check(
  unknownMissingExceptions.length === 0,
  `exceções de ficha apontam para IDs fora do grafo: ${unknownMissingExceptions.join(", ")}`
);
check(
  unjustifiedMissingExceptions.length === 0,
  `exceções de ficha precisam de justificativa explícita: ${unjustifiedMissingExceptions.join(", ")}`
);

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

const runtimeMapByPrimitive = new Map(FICHA_RUNTIME_MAP.map((entry) => [entry.primitive, entry]));
check(runtimeMapByPrimitive.size === FICHA_RUNTIME_MAP.length, "o mapa runtime possui primitivas duplicadas");
for (const primitive of primitiveUsage.keys()) {
  check(runtimeMapByPrimitive.has(primitive), `primitiva autoral ${primitive} não está no mapa runtime`);
}

for (const entry of FICHA_RUNTIME_MAP) {
  check(primitiveUsage.has(entry.primitive), `mapa runtime contém primitiva não usada ${entry.primitive}`);
  check(entry.kinds.length > 0, `${entry.primitive} não declara kind semântico`);
  check(entry.builtin || entry.componentFiles.length > 0 || entry.note, `${entry.primitive} não documenta componente nem lacuna`);

  for (const file of entry.componentFiles) {
    const absoluteFile = path.join(ROOT, file);
    check(fs.existsSync(absoluteFile), `${entry.primitive} aponta para componente inexistente ${file}`);
    if (fs.existsSync(absoluteFile)) {
      const source = fs.readFileSync(absoluteFile, "utf8");
      for (const exportedName of entry.componentExports || []) {
        check(source.includes(`function ${exportedName}`), `${entry.primitive} não encontrou export ${exportedName} em ${file}`);
      }
    }
  }

  for (const kind of entry.builderKinds) {
    check(composerTem(kind), `${entry.primitive} declara builder ausente para ${kind}`);
  }
  for (const kind of entry.rendererKinds) {
    check(rendererTem(kind), `${entry.primitive} declara renderer ausente para ${kind}`);
  }

  /**
   * Guarda REVERSA contra documentação atrasada.
   *
   * O auditor antigo só perguntava "o que o mapa declara existe?". Assim
   * AudioChoice, TouchPlace e ShapeCanvas ganharam builder+renderer, mas o mapa
   * continuou dizendo "isolado" e todos os gates ficaram verdes.
   *
   * Para primitivas cujo nome autoral vira naturalmente o dispatch kind
   * (`AudioChoice`→`audiochoice`, `ShapeCanvas`→`shapecanvas`, ...), se código e
   * renderer já provam a cadeia, o mapa É obrigado a reconhecer o mesmo kind.
   * Não aplicamos a heurística quando um dos lados não existe: aliases legítimos
   * como MaterialDourado→tens e NumberBond→bond continuam explícitos pelo mapa.
   */
  const kindConvencional = entry.primitive.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
  if (composerTem(kindConvencional) && rendererTem(kindConvencional)) {
    check(
      entry.builderKinds.includes(kindConvencional),
      `${entry.primitive}: Composer já possui ${kindConvencional}, mas builderKinds do mapa está atrasado`
    );
    check(
      entry.rendererKinds.includes(kindConvencional),
      `${entry.primitive}: renderer já possui ${kindConvencional}, mas rendererKinds do mapa está atrasado`
    );
  }
}

function runtimeStatus(entry) {
  const hasComponent = entry.builtin || entry.componentFiles.length > 0;
  const hasBuilder = entry.builderKinds.length > 0;
  const hasRenderer = entry.rendererKinds.length > 0;
  if (hasBuilder && hasRenderer) return "executável";
  if (hasComponent && hasRenderer) return "renderer-sem-builder";
  if (hasComponent) return "componente-isolado";
  return "ausente";
}

const runtimeStatuses = new Map(FICHA_RUNTIME_MAP.map((entry) => [entry.primitive, runtimeStatus(entry)]));

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

console.log("\n[COMPETÊNCIAS SEM FICHA AUTORAL — EXCEÇÕES EXPLÍCITAS]");
if (missingCompetenceFichas.length) {
  for (const id of missingCompetenceFichas) {
    console.log(`- ${id}: ${EXPLICIT_MISSING_FICHA_EXCEPTIONS.get(id) || "SEM EXCEÇÃO — FALHA"}`);
  }
} else {
  console.log("Nenhuma");
}

console.log("\n[PRIMITIVAS SEM COMPONENTE HOMÔNIMO]");
for (const { primitive, usedBy } of unavailablePrimitives) {
  console.log(`- ${primitive}: ${usedBy.length} ficha(s) — ${usedBy.join(", ")}`);
}
if (!unavailablePrimitives.length) console.log("Nenhuma");

console.log("\n[MAPA FICHA → RUNTIME]");
for (const entry of FICHA_RUNTIME_MAP) {
  const usage = primitiveUsage.get(entry.primitive) || [];
  console.log(
    `- ${entry.primitive}: ${runtimeStatuses.get(entry.primitive)} | ` +
    `kinds=${entry.kinds.join("+")} | builder=${entry.builderKinds.join("+") || "—"} | ` +
    `renderer=${entry.rendererKinds.join("+") || "—"} | fichas=${usage.length}`
  );
}

console.log("\n[COBERTURA DO MAPA RUNTIME]");
for (const status of ["executável", "renderer-sem-builder", "componente-isolado", "ausente"]) {
  console.log(`- ${status}: ${[...runtimeStatuses.values()].filter((value) => value === status).length}`);
}

if (failures.length) {
  console.error("\n[FALHAS DE CONTRATO AUTORAL]");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(
    `\n[RESULTADO] ${fichas.length} fichas válidas, nove seções presentes e ` +
    `${uniqueCompetenceIds.size}/${graphIds.size} competências cobertas; ` +
    `${missingCompetenceFichas.length} lacuna(s) canônica(s) explícita(s).`
  );
}
