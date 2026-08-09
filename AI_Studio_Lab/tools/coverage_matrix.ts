import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { ALL_MATH_TRACKS } from "../../src/curriculum/motores/curriculum";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (relativePath: string) => readFileSync(join(ROOT, relativePath), "utf8");
const require = createRequire(import.meta.url);
const { FICHA_RUNTIME_MAP } = require("./ficha_runtime_map.cjs") as {
  FICHA_RUNTIME_MAP: Array<{
    primitive: string;
    kinds: string[];
    builderKinds: string[];
    rendererKinds: string[];
    componentFiles: string[];
    note?: string;
  }>;
};

const sorted = <T extends string>(items: Iterable<T>) => [...items].sort((a, b) => a.localeCompare(b));
const uniq = <T>(items: Iterable<T>) => [...new Set(items)];

export const COVERAGE_BASELINE = {
  competencies: 90,
  authoredFichas: 94,
  composer: 26,
  legacy: 25,
  fallback: 39,
  served: 51,
  divergences: 21,
  modeSwaps: 12,
  toolIntroductions: 44,
  missingPrimitives: ["Moedas", "Regua"],
} as const;

interface GraphNode {
  id: string;
  nome: string;
  strand: string;
  faixa: string;
  prereqs?: string[];
}

interface CanonicalFicha {
  ficha: string;
  file: string;
  competence: string;
  primitives: string[];
}

interface RuntimeSample {
  kinds: string[];
  delivered: string[];
  unknownKinds: string[];
  error?: string;
}

export interface CoverageMatrixRow {
  id: string;
  name: string;
  strand: string;
  faixa: string;
  prereqs: string[];
  canonicalFichas: string[];
  canonicalFichaFiles: string[];
  canonicalPrimitives: string[];
  implementation: string;
  generatorSource: string;
  runtimeKinds: string[];
  runtimePrimitives: string[];
  composerSensei: string;
  tests: string[];
  audits: string[];
  status: "padrao-ouro" | "legado" | "fallback";
  divergence: string[];
  modeSwaps: string[];
  toolIntroductions: string[];
  missingPrimitives: string[];
  debt: string[];
  action: string;
  causalWave: number;
  downstream: number;
  causalOrder: string;
}

export interface CoverageMatrixCounts {
  competencies: number;
  authoredFichas: number;
  composer: number;
  legacy: number;
  fallback: number;
  served: number;
  divergences: number;
  modeSwaps: number;
  toolIntroductions: number;
  missingPrimitives: string[];
}

export interface CoverageMatrixResult {
  rows: CoverageMatrixRow[];
  counts: CoverageMatrixCounts;
  failures: string[];
}

const graph = YAML.parse(read("curriculum/grafo_saga.yaml")) as { nodes: GraphNode[] };
const nodes = graph.nodes ?? [];
const graphIds = new Set(nodes.map(node => node.id));
const ids = nodes.map(node => node.id);

function walkFiles(directory: string, predicate: (path: string) => boolean): string[] {
  const output: string[] = [];
  for (const entry of readdirSync(join(ROOT, directory), { withFileTypes: true })) {
    const relativePath = join(directory, entry.name);
    if (entry.isDirectory()) output.push(...walkFiles(relativePath, predicate));
    else if (predicate(relativePath)) output.push(relativePath);
  }
  return output;
}

/**
 * Usa o mesmo contrato de identidade do ficha_catalog_auditor.cjs.
 * A contagem de 94 é derivada dos blocos reais; não é uma lista mantida à mão.
 */
function readCanonicalFichas(): { entries: CanonicalFicha[]; blockCount: number } {
  const entries: CanonicalFicha[] = [];
  const files = readdirSync(join(ROOT, "AI_Studio_Lab/pedagogia/fichas"))
    .filter(name => name.endsWith(".md"))
    .sort();

  for (const fileName of files) {
    const relativeFile = join("AI_Studio_Lab/pedagogia/fichas", fileName);
    const source = read(relativeFile);
    const headings = [...source.matchAll(/^# FICHA\s+(\S+)\s+—\s+(.+)$/gm)];

    for (let index = 0; index < headings.length; index += 1) {
      const heading = headings[index];
      const end = headings[index + 1]?.index ?? source.length;
      const body = source.slice(heading.index, end);
      const identity = body.match(
        /^\*\*Competência:\*\*\s+((?:N[1-7]|AL|GE|GM|PE)\.\d{2})\b.*?\*\*Primitiva:\*\*\s+(.+?)(?:\s+·|$)/m,
      );
      if (!identity) continue;
      const primitives = [...identity[2].matchAll(/`([A-Za-z][A-Za-z0-9]*)`\s*(?:\(modo ([^)]+)\))?/g)]
        .map(match => match[2] ? `${match[1]}#${match[2].trim()}` : match[1])
        .filter(primitive => primitive !== "plain");
      entries.push({
        ficha: heading[1],
        file: relativeFile,
        competence: identity[1],
        primitives,
      });
    }
  }

  return { entries, blockCount: entries.length };
}

const canonical = readCanonicalFichas();
const fichaByCompetence = new Map<string, CanonicalFicha[]>();
for (const entry of canonical.entries) {
  if (!graphIds.has(entry.competence)) continue;
  fichaByCompetence.set(entry.competence, [...(fichaByCompetence.get(entry.competence) ?? []), entry]);
}

function canonicalPrimitives(id: string): string[] {
  return uniq((fichaByCompetence.get(id) ?? []).flatMap(entry => entry.primitives));
}

const primitiveFiles = new Set(
  readdirSync(join(ROOT, "src/components/primitives"))
    .filter(name => name.endsWith(".tsx") && !name.includes(".test."))
    .map(name => name.replace(".tsx", "")),
);

/**
 * O auditor de conformidade já mantém a tradução observacional kind→primitiva
 * usada para medir as 21 divergências históricas. A Coverage Matrix a lê em vez
 * de manter uma segunda tabela. Kinds novos do Padrão Ouro que ainda não estão
 * nessa tabela são resolvidos pela ponte explícita ficha_runtime_map.cjs.
 */
function parseObservedKindMap(): Map<string, string[]> {
  const source = read("src/curriculum/conformidadeDeFichas.test.ts");
  const block = source.match(/const PRIMITIVA_DO_KIND:[\s\S]*?=\s*\{([\s\S]*?)\n\};/);
  const map = new Map<string, string[]>();
  if (block) {
    for (const match of block[1].matchAll(/^\s*(?:"([^"]+)"|([A-Za-z0-9_-]+)):\s*\[([^\]]*)\],?/gm)) {
      const key = match[1] ?? match[2];
      const values = [...match[3].matchAll(/"([^"]+)"/g)].map(item => item[1]);
      map.set(key, values);
    }
  }

  const fallbackByKind = new Map<string, string[]>();
  for (const entry of FICHA_RUNTIME_MAP) {
    for (const kind of entry.rendererKinds) {
      fallbackByKind.set(kind, uniq([...(fallbackByKind.get(kind) ?? []), entry.primitive]));
    }
  }
  for (const [kind, primitives] of fallbackByKind) {
    if (!map.has(kind)) map.set(kind, primitives);
  }
  return map;
}

function parseObservedModeMap(): Map<string, string> {
  const source = read("src/curriculum/conformidadeDeFichas.test.ts");
  const block = source.match(/const MODO_DO_RUNTIME:[\s\S]*?=\s*\{([\s\S]*?)\n\};/);
  const map = new Map<string, string>();
  if (block) {
    for (const match of block[1].matchAll(/^\s*(?:"([^"]+)"|([A-Za-z0-9_-]+)):\s*"([^"]+)",?/gm)) {
      map.set(match[1] ?? match[2], match[3]);
    }
  }
  return map;
}

const primitiveByKind = parseObservedKindMap();
const modeByRuntime = parseObservedModeMap();
const IMPLICIT_MODE_BY_KIND = new Map<string, string>([["area", "área"]]);

function deliveredPrimitives(question: any): { primitives: string[]; unknownKind?: string } {
  const kind = String(question?.kind ?? "");
  const bases = primitiveByKind.get(kind);
  if (!bases) return { primitives: [], unknownKind: kind || "<sem-kind>" };

  const rawMode = kind === "pareamento"
    ? "parear"
    : kind === "classificacao"
      ? "caixas/laços"
      : question?.uiProps?.modo;
  const mode = IMPLICIT_MODE_BY_KIND.get(kind)
    ?? (rawMode ? modeByRuntime.get(String(rawMode)) : undefined);
  const withMode = mode && bases.length
    ? [`${bases[0]}#${mode}`, ...bases.slice(1)]
    : bases;
  return { primitives: [...withMode, ...withMode.map(item => item.split("#")[0])] };
}

const trackById = new Map(ALL_MATH_TRACKS.map(track => [track.id, track]));

function sampleRuntime(id: string): RuntimeSample {
  const track: any = trackById.get(id);
  if (!track) return { kinds: [], delivered: [], unknownKinds: [], error: "track ausente" };
  if (track.contentStatus === "fallback") return { kinds: ["fallback"], delivered: [], unknownKinds: [] };

  try {
    const questions = [1, 2, 3, 4, 5].map(level => track.gen(level));
    const kinds = uniq(questions.map(question => String(question.kind)));
    const delivered: string[] = [];
    const unknownKinds: string[] = [];
    for (const question of questions) {
      const mapped = deliveredPrimitives(question);
      delivered.push(...mapped.primitives);
      if (mapped.unknownKind) unknownKinds.push(mapped.unknownKind);
    }
    return { kinds, delivered: uniq(delivered), unknownKinds: uniq(unknownKinds) };
  } catch (error) {
    return {
      kinds: [],
      delivered: [],
      unknownKinds: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function missingPrimitives(id: string): string[] {
  return uniq(canonicalPrimitives(id).map(item => item.split("#")[0]))
    .filter(base => !primitiveFiles.has(base));
}

function runtimeDivergence(id: string, sample: RuntimeSample): string[] {
  const track: any = trackById.get(id);
  if (!track || track.contentStatus === "fallback" || sample.error || sample.unknownKinds.length) return [];
  const delivered = new Set(sample.delivered);
  return canonicalPrimitives(id).filter(item => !delivered.has(item));
}

const prereqsById = new Map(nodes.map(node => [node.id, node.prereqs ?? []]));
function ancestors(id: string): Set<string> {
  const seen = new Set<string>();
  const queue = [...(prereqsById.get(id) ?? [])];
  while (queue.length) {
    const current = queue.shift()!;
    if (seen.has(current)) continue;
    seen.add(current);
    queue.push(...(prereqsById.get(current) ?? []));
  }
  return seen;
}

const childrenById = new Map(nodes.map(node => [node.id, [] as string[]]));
for (const node of nodes) {
  for (const prereq of node.prereqs ?? []) {
    childrenById.set(prereq, [...(childrenById.get(prereq) ?? []), node.id]);
  }
}

function descendants(id: string): Set<string> {
  const seen = new Set<string>();
  const queue = [...(childrenById.get(id) ?? [])];
  while (queue.length) {
    const current = queue.shift()!;
    if (seen.has(current)) continue;
    seen.add(current);
    queue.push(...(childrenById.get(current) ?? []));
  }
  return seen;
}

const depthMemo = new Map<string, number>();
function causalDepth(id: string): number {
  if (depthMemo.has(id)) return depthMemo.get(id)!;
  const prereqs = prereqsById.get(id) ?? [];
  const depth = prereqs.length === 0 ? 0 : Math.max(...prereqs.map(causalDepth)) + 1;
  depthMemo.set(id, depth);
  return depth;
}

interface VisualIntroductions {
  modeSwaps: string[];
  tools: string[];
  roots: string[];
}

function visualIntroductions(id: string): VisualIntroductions {
  const before = ancestors(id);
  const seenExact = new Set([...before].flatMap(canonicalPrimitives));
  const seenBases = new Set([...seenExact].map(item => item.split("#")[0]));
  const introducing = canonicalPrimitives(id).filter(item => !seenExact.has(item));
  const modeSwaps: string[] = [];
  const tools: string[] = [];
  const roots: string[] = [];

  for (const primitive of introducing) {
    const [base, mode] = primitive.split("#");
    if (before.size === 0) {
      roots.push(primitive);
      continue;
    }
    if (mode && seenBases.has(base)) modeSwaps.push(`${base}→${mode}`);
    else tools.push(primitive);
  }
  return { modeSwaps, tools, roots };
}

function generatorMap(): Map<string, string> {
  const source = read("src/curriculum/motores/curriculum.ts");
  const block = source.match(/const GENERATOR_MAP[\s\S]*?=\s*\{([\s\S]*?)\n\};/);
  return new Map(
    block
      ? [...block[1].matchAll(/"((?:N[1-7]|AL|GE|GM|PE)\.\d{2})"\s*:\s*([A-Za-z0-9_]+)/g)]
        .map(match => [match[1], match[2]] as const)
      : [],
  );
}
const legacyGeneratorById = generatorMap();

const testFiles = walkFiles("src", path => /\.(?:test|spec)\.(?:ts|tsx|js|jsx)$/.test(path));
const testsById = new Map<string, string[]>();
for (const file of testFiles) {
  const source = read(file);
  for (const id of ids) {
    if (source.includes(id)) testsById.set(id, [...(testsById.get(id) ?? []), file]);
  }
}

const GLOBAL_AUDITS = [
  "npm run auditar",
  "npm run fichas:auditar",
  "npm run fichas:conferir",
  "npm run grafo:check",
];

function statusFor(id: string): CoverageMatrixRow["status"] {
  const source = String((trackById.get(id) as any)?.generatorSource ?? "fallback");
  if (source === "composer") return "padrao-ouro";
  if (source === "legacy") return "legado";
  return "fallback";
}

function implementationFor(id: string, status: CoverageMatrixRow["status"]): string {
  const legacy = legacyGeneratorById.get(id);
  if (status === "padrao-ouro") {
    return legacy ? `Composer ativo; rollback legado ${legacy}` : "Composer ativo; estreia sem gerador legado";
  }
  if (status === "legado") return `gerador legado ${legacy ?? "<não identificado>"}`;
  return "gFallback / placeholder Em construção";
}

function actionFor(row: Omit<CoverageMatrixRow, "action">): string {
  if (row.missingPrimitives.length) {
    return `construir ${row.missingPrimitives.join(" + ")} com builder/onboarding/teste; só depois alinhar/ativar a ficha`;
  }
  if (row.status === "fallback") {
    return "fábrica curricular: materializar ficha no Composer/builder, validar screen, onboarding e regressões antes de ativar";
  }
  if (row.divergence.length) {
    return `alinhar entrega real à ficha (${row.divergence.join(" + ")}); preservar proveniência e testar os 5 níveis`;
  }
  if (row.status === "legado") {
    return "migrar legado para ficha/Composer por regression-first, com paridade ou divergência pedagógica explicitamente justificada";
  }
  if (row.modeSwaps.length) {
    return "criar ponte/microtutorial para a troca de linguagem visual antes de tratá-la como continuidade";
  }
  if (row.toolIntroductions.length) {
    return "classificar estreia como autoinstrutiva ou criar onboarding/microtutorial; adicionar teste observável";
  }
  if (row.tests.length === 0) {
    return "preservar implementação; ao tocar neste nó, nascer teste nominal além dos gates globais";
  }
  return "preservar; nenhuma dívida objetiva detectada pela Coverage Matrix";
}

function buildRows(): CoverageMatrixRow[] {
  return nodes.map(node => {
    const status = statusFor(node.id);
    const sample = sampleRuntime(node.id);
    const required = canonicalPrimitives(node.id);
    const missing = missingPrimitives(node.id);
    const divergence = runtimeDivergence(node.id, sample);
    const visual = visualIntroductions(node.id);
    const tests = sorted(testsById.get(node.id) ?? []);
    const debt: string[] = [];

    if (status === "fallback") debt.push("sem conteúdo real servido");
    if (status === "legado") debt.push("ficha pronta ainda servida por legado");
    if (sample.error) debt.push(`runtime não amostrado: ${sample.error}`);
    if (sample.unknownKinds.length) debt.push(`kind sem tradução: ${sample.unknownKinds.join(", ")}`);
    if (divergence.length) debt.push(`ficha↔screen diverge: faltam ${divergence.join(" + ")}`);
    if (missing.length) debt.push(`primitiva bloqueadora ausente: ${missing.join(" + ")}`);
    if (visual.modeSwaps.length) debt.push(`troca visual sem aviso: ${visual.modeSwaps.join(", ")}`);
    if (visual.tools.length) debt.push(`ferramenta nova sem precedente: ${visual.tools.join(", ")}`);
    if (tests.length === 0) debt.push("sem teste nominal por ID; apenas cobertura transversal dos gates");

    const base: Omit<CoverageMatrixRow, "action"> = {
      id: node.id,
      name: node.nome,
      strand: node.strand,
      faixa: node.faixa,
      prereqs: node.prereqs ?? [],
      canonicalFichas: uniq((fichaByCompetence.get(node.id) ?? []).map(entry => entry.ficha)),
      canonicalFichaFiles: uniq((fichaByCompetence.get(node.id) ?? []).map(entry => entry.file)),
      canonicalPrimitives: required,
      implementation: implementationFor(node.id, status),
      generatorSource: String((trackById.get(node.id) as any)?.generatorSource ?? "fallback"),
      runtimeKinds: sample.kinds,
      runtimePrimitives: sample.delivered,
      composerSensei: status === "fallback"
        ? "conteúdo real ausente; não pode produzir evidência/recompensa como competência servida"
        : status === "padrao-ouro"
          ? "Composer ativo; elegibilidade curricular continua vindo de learner state + DAG/Sensei"
          : "Composer inativo; gerador legado continua sujeito à elegibilidade de learner state + DAG/Sensei",
      tests,
      audits: GLOBAL_AUDITS,
      status,
      divergence,
      modeSwaps: visual.modeSwaps,
      toolIntroductions: visual.tools,
      missingPrimitives: missing,
      debt,
      causalWave: causalDepth(node.id),
      downstream: descendants(node.id).size,
      causalOrder: `W${causalDepth(node.id)} · impacto ${descendants(node.id).size}`,
    };
    return { ...base, action: actionFor(base) };
  });
}

function countRows(rows: CoverageMatrixRow[]): CoverageMatrixCounts {
  return {
    competencies: rows.length,
    authoredFichas: canonical.blockCount,
    composer: rows.filter(row => row.status === "padrao-ouro").length,
    legacy: rows.filter(row => row.status === "legado").length,
    fallback: rows.filter(row => row.status === "fallback").length,
    served: rows.filter(row => row.status !== "fallback").length,
    divergences: rows.filter(row => row.divergence.length > 0).length,
    modeSwaps: rows.reduce((sum, row) => sum + row.modeSwaps.length, 0),
    toolIntroductions: rows.reduce((sum, row) => sum + row.toolIntroductions.length, 0),
    missingPrimitives: sorted(new Set(rows.flatMap(row => row.missingPrimitives))),
  };
}

function validate(rows: CoverageMatrixRow[], counts: CoverageMatrixCounts): string[] {
  const failures: string[] = [];
  const check = (condition: boolean, message: string) => { if (!condition) failures.push(message); };

  check(nodes.length === COVERAGE_BASELINE.competencies, `grafo: esperado ${COVERAGE_BASELINE.competencies}, encontrado ${nodes.length}`);
  check(new Set(ids).size === nodes.length, "grafo contém IDs duplicados");
  check(rows.length === COVERAGE_BASELINE.competencies, `matriz: esperado ${COVERAGE_BASELINE.competencies}, encontrado ${rows.length}`);
  check(canonical.blockCount === COVERAGE_BASELINE.authoredFichas, `fichas autorais: esperado ${COVERAGE_BASELINE.authoredFichas}, encontrado ${canonical.blockCount}`);
  check(fichaByCompetence.size === COVERAGE_BASELINE.competencies, `cobertura de ficha: esperado 90/90, encontrado ${fichaByCompetence.size}/90`);
  check(counts.composer === COVERAGE_BASELINE.composer, `Composer ativo divergiu: ${counts.composer} vs ${COVERAGE_BASELINE.composer}`);
  check(counts.legacy === COVERAGE_BASELINE.legacy, `legado divergiu: ${counts.legacy} vs ${COVERAGE_BASELINE.legacy}`);
  check(counts.fallback === COVERAGE_BASELINE.fallback, `fallback divergiu: ${counts.fallback} vs ${COVERAGE_BASELINE.fallback}`);
  check(counts.served === COVERAGE_BASELINE.served, `servido sem fallback divergiu: ${counts.served} vs ${COVERAGE_BASELINE.served}`);
  check(counts.divergences === COVERAGE_BASELINE.divergences, `divergências ficha↔screen divergiram: ${counts.divergences} vs ${COVERAGE_BASELINE.divergences}`);
  check(counts.modeSwaps === COVERAGE_BASELINE.modeSwaps, `trocas visuais divergiram: ${counts.modeSwaps} vs ${COVERAGE_BASELINE.modeSwaps}`);
  check(counts.toolIntroductions === COVERAGE_BASELINE.toolIntroductions, `estreias de ferramenta divergiram: ${counts.toolIntroductions} vs ${COVERAGE_BASELINE.toolIntroductions}`);
  check(
    JSON.stringify(counts.missingPrimitives) === JSON.stringify([...COVERAGE_BASELINE.missingPrimitives]),
    `primitivas ausentes divergiram: ${counts.missingPrimitives.join(", ")}`,
  );

  const unknownCanonical = canonical.entries.map(entry => entry.competence).filter(id => !graphIds.has(id));
  check(unknownCanonical.length === 0, `fichas referenciam IDs fora do grafo: ${uniq(unknownCanonical).join(", ")}`);

  for (const row of rows) {
    const sample = sampleRuntime(row.id);
    check(row.canonicalFichas.length > 0, `${row.id}: sem ficha canônica`);
    check(Boolean(trackById.get(row.id)), `${row.id}: sem Track runtime`);
    check(row.action.trim().length > 0, `${row.id}: sem ação`);
    check(!sample.error, `${row.id}: falha runtime: ${sample.error ?? "?"}`);
    check(sample.unknownKinds.length === 0, `${row.id}: kind sem tradução: ${sample.unknownKinds.join(", ")}`);
    if (row.status === "padrao-ouro") {
      check(row.missingPrimitives.length === 0, `${row.id}: padrão-ouro exige primitiva ausente ${row.missingPrimitives.join(", ")}`);
    }
    for (const prereq of row.prereqs) {
      check(graphIds.has(prereq), `${row.id}: prereq inexistente ${prereq}`);
      check(causalDepth(prereq) < row.causalWave, `${row.id}: ${prereq} não vem antes`);
    }
  }

  const moedas = rows.filter(row => row.missingPrimitives.includes("Moedas")).map(row => row.id);
  const regua = rows.filter(row => row.missingPrimitives.includes("Regua")).map(row => row.id);
  check(moedas.includes("GM.03"), `Moedas deveria bloquear GM.03; bloqueia ${moedas.join(", ") || "ninguém"}`);
  check(regua.includes("GM.05"), `Regua deveria bloquear GM.05; bloqueia ${regua.join(", ") || "ninguém"}`);
  return failures;
}

export function buildCoverageMatrix(): CoverageMatrixResult {
  const rows = buildRows().sort((a, b) =>
    a.causalWave - b.causalWave
    || b.downstream - a.downstream
    || a.id.localeCompare(b.id),
  );
  const counts = countRows(rows);
  return { rows, counts, failures: validate(rows, counts) };
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

export function renderCoverageMatrixMarkdown(result = buildCoverageMatrix()): string {
  const { rows, counts } = result;
  const lines = [
    "# Coverage Matrix — SAGA",
    "",
    "> Projeção gerada das fontes reais. O gate executável é a autoridade; divergência exige investigação.",
    "",
    "## Baseline reconciliado",
    "",
    `- ${counts.competencies} competências / ${counts.authoredFichas} fichas autorais;`,
    `- Composer ativo: ${counts.composer}; legado: ${counts.legacy}; fallback: ${counts.fallback}; servido sem fallback: ${counts.served};`,
    `- divergências ficha↔screen: ${counts.divergences}; trocas visuais: ${counts.modeSwaps}; estreias de ferramenta: ${counts.toolIntroductions};`,
    `- primitivas bloqueadoras: ${counts.missingPrimitives.join(", ") || "nenhuma"}.`,
    "",
    "## Ordem causal",
    "",
    "Ondas W0→Wn seguem profundidade no DAG; dentro da onda, maior impacto vem primeiro. Primitiva ausente precede ativação e dependentes.",
    "",
    "| ID | Curriculum Graph | Ficha canônica | Implementação real | Screen/primitiva | Composer/Sensei | Testes/auditoria | Status | Dívida/bloqueio | Ação necessária | Ordem causal |",
    "|---|---|---|---|---|---|---|---|---|---|---|",
  ];

  for (const row of rows) {
    const graphCell = `${row.name}; pré: ${row.prereqs.join(", ") || "raiz"}`;
    const fichaCell = `${row.canonicalFichas.join("+")} · ${row.canonicalPrimitives.join(", ") || "sem primitiva declarada"}`;
    const runtimeCell = row.runtimeKinds.length
      ? `${row.runtimeKinds.join(", ")} → ${row.runtimePrimitives.join(", ") || "sem primitiva"}`
      : "não amostrado";
    const testsCell = row.tests.length
      ? `${row.tests.slice(0, 3).join(", ")}${row.tests.length > 3 ? ` +${row.tests.length - 3}` : ""}; gates globais`
      : "gates globais; sem teste nominal por ID";
    lines.push(
      `| ${row.id} | ${escapeCell(graphCell)} | ${escapeCell(fichaCell)} | ${escapeCell(row.implementation)} | ${escapeCell(runtimeCell)} | ${escapeCell(row.composerSensei)} | ${escapeCell(testsCell)} | ${row.status} | ${escapeCell(row.debt.join("; ") || "nenhuma objetiva")} | ${escapeCell(row.action)} | ${row.causalOrder} |`,
    );
  }
  return `${lines.join("\n")}\n`;
}

export function renderCoverageMatrixJson(result = buildCoverageMatrix()): string {
  return JSON.stringify(result, null, 2);
}
