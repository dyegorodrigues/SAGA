const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");

const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(ROOT, "curriculum/grafo_saga.yaml");
const JSON_TARGET = path.join(ROOT, "src/data/grafo_saga.json");
const TS_TARGET = path.join(ROOT, "src/curriculum/grafo_saga.ts");
const CHECK_ONLY = process.argv.includes("--check");

const graph = YAML.parse(fs.readFileSync(SOURCE, "utf8"));

function quoted(value) {
  return JSON.stringify(value);
}

function renderNode(node) {
  return `  { id: ${quoted(node.id)}, nome: ${quoted(node.nome)}, strand: ${quoted(node.strand)}, faixa: ${quoted(node.faixa)}, prereqs: ${JSON.stringify(node.prereqs || [])} },`;
}

function renderFluency(node) {
  const fields = [
    `id: ${quoted(node.id)}`,
    `familia: ${quoted(node.familia)}`,
    `nome: ${quoted(node.nome)}`,
    `destrava: ${JSON.stringify(node.destrava || {})}`,
  ];
  if (node.rt_max_s !== undefined) fields.push(`rt_max_s: ${node.rt_max_s}`);
  if (node.degraus) fields.push(`degraus: ${JSON.stringify(node.degraus)}`);
  return `  { ${fields.join(", ")} },`;
}

function renderTypeScript() {
  return `export interface GrafoNode {
  id: string;
  nome: string;
  strand: string;
  faixa: string;
  prereqs: string[];
}

export const grafoSaga: GrafoNode[] = [
${(graph.nodes || []).map(renderNode).join("\n")}
];

export interface FluencyNode {
  id: string;
  familia: string;
  nome: string;
  destrava: Record<string, number>;
  rt_max_s?: number;
  degraus?: string[];
}

export const fluencySaga: FluencyNode[] = [
${(graph.fluency || []).map(renderFluency).join("\n")}
];
`;
}

const outputs = [
  [JSON_TARGET, JSON.stringify(graph, null, 2)],
  [TS_TARGET, renderTypeScript()],
];

if (CHECK_ONLY) {
  const stale = outputs
    .filter(([target, expected]) => !fs.existsSync(target) || fs.readFileSync(target, "utf8") !== expected)
    .map(([target]) => path.relative(ROOT, target));

  if (stale.length) {
    console.error(`Artefatos do grafo desatualizados: ${stale.join(", ")}`);
    console.error("Execute: npm run grafo:gerar");
    process.exitCode = 1;
  } else {
    console.log("Artefatos do grafo sincronizados com curriculum/grafo_saga.yaml.");
  }
} else {
  for (const [target, content] of outputs) fs.writeFileSync(target, content);
  console.log("Gerados: src/data/grafo_saga.json e src/curriculum/grafo_saga.ts");
}

