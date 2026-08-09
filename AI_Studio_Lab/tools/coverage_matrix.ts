import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { ALL_MATH_TRACKS } from "../../src/curriculum/motores/curriculum";
import { COMPOSER_CANARIES } from "../../src/curriculum/motores/composerCanary";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (relativePath: string) => readFileSync(join(ROOT, relativePath), "utf8");
const sorted = <T extends string>(items: Iterable<T>) => [...items].sort((a, b) => a.localeCompare(b));
const uniq = <T>(items: Iterable<T>) => [...new Set(items)];

const BASELINE = {
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

interface MatrixRow {
  id: string;
  name: string;
  strand: string;
  faixa: string;
  prereqs: string[];
  canonicalFichas: string[];
  canonicalFichaFiles: string[];
  canonicalPrimitives: string[];
  implementation: string;
  generatorSource: "composer" | "legacy" | "fallback" | string;
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

const graph = YAML.parse(read("curriculum/grafo_saga.yaml")) as { nodes: GraphNode[] };
const nodes = graph.nodes ?? [];
const nodeById = new Map(nodes.map(node => [node.id, node]));
const graphIds = new Set(nodes.map(node => node.id));

function walkFiles(directory: string, predicate: (path: string) => boolean): string[] {
  const absolute = join(ROOT, directory);
  const output: string[] = [];
  for (const entry of readdirSync(absolute, { withFileTypes: true })) {
    const relativePath = join(directory, entry.name);
    if (entry.isDirectory()) output.push(...walkFiles(relativePath, predicate));
    else if (predicate(relativePath)) output.push(relativePath);
  }
  return output;
}

function readCanonicalFichas(): { entries: CanonicalFicha[]; blockCount: number } {
  const entries: CanonicalFicha[] = [];
  let blockCount = 0;
  const files = readdirSync(join(ROOT, "AI_Studio_Lab/pedagogia/fichas"))
    .filter(name => name.endsWith(".md"));

  for (const fileName of files) {
    const relativeFile = join("AI_Studio_Lab/pedagogia/fichas", fileName);
    let currentFicha = "?";
    for (const line of read(relativeFile).split("\n")) {
      const title = line.match(/^#\s*FICHA\s+((?:F|JD)\d+)/i);
      if (title) {
        currentFicha = title[1];
        blockCount += 1;
      }
      const declaration = line.match(/^\*\*Competência:\*\*\s*((?:N[1-7]|AL|GE|GM|PE)\.\d{2})\b/);
      if (!declaration) continue;
      const primitiveSection = line.split(/\*\*Primitiva:\*\*/)[1]?.split(/\*\*[A-ZÀ-Ú]/)[0] ?? "";
      const primitives = [...primitiveSection.matchAll(/`([A-Za-z][A-Za-z0-9]*)`\s*(?:\(modo ([^)]+)\))?/g)]
        .map(match => match[2] ? `${match[1]}#${match[2].trim()}` : match[1]);
      entries.push({
        ficha: currentFicha,
        file: relativeFile,
        competence: declaration[1],
        primitives,
      });
    }
  }
  return { entries, blockCount };
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

const PRIMITIVE_BY_KIND: Record<string, string[]> = {
  count: ["EmojiRow"],
  emojirow: ["EmojiRow"],
  flash: ["EmojiRow"],
  scattered: ["ScatteredItems"],
  draggroup: ["DragGroup"],
  groups: ["DragGroup"],
  tenframe: ["TenFrame"],
  tens: ["Quadrado100"],
  bond: ["NumberBond"],
  numberline: ["NumberLine"],
  "numberline-interactive": ["InteractiveNumberLine"],
  vertical: ["InteractiveVertical", "MaterialDourado"],
  "visual-addition": ["VisualAddition"],
  "linking-cubes": ["LinkingCubes"],
  "take-apart": ["TakeApart"],
  array: ["ArrayGrid"],
  relogio: ["Relogio"],
  balanca: ["Balanca"],
  medidas: ["Balanca", "Recipientes"],
  shape: ["ShapeCanvas"],
  "singapore-bars": ["SingaporeBars"],
  "story-bars": ["StoryPanel", "SingaporeBars"],
  audio: ["AudioChoice"],
  order: ["Grupo"],
  subvis: ["EmojiRow"],
  clock: ["Relogio"],
  picto: ["SingaporeBars"],
  pattern: ["EmojiRow"],
  "drag-group": ["DragGroup"],
  plain: [],
  math: [],
  money: [],
  tabuada: ["ArrayGrid"],
  decomposicao: ["ArrayGrid"],
  ancora: ["ArrayGrid"],
  familia: ["NumberBond"],
  deslocamento: ["MaterialDourado"],
  pareamento: ["DragGroup"],
  touchcount: ["TouchCount"],
  fileira: ["EmojiRow"],
  classificacao: ["DragGroup"],
  audiochoice: ["AudioChoice"],
};

const MODE_BY_RUNTIME: Record<string, string> = {
  ritmico: "rítmico",
  toque: "toque",
  flash: "flash",
  "flash-mao": "flash, skin mão",
  padrao: "padrão",
  parear: "parear",
  "caixas/laços": "caixas/laços",
};

function deliveredPrimitives(question: any): { primitives: string[]; unknownKind?: string } {
  const kind = String(question?.kind ?? "");
  if (!(kind in PRIMITIVE_BY_KIND)) return { primitives: [], unknownKind: kind || "<sem-kind>" };
  const bases = PRIMITIVE_BY_KIND[kind] ?? [];
  const rawMode = kind === "pareamento"
    ? "parear"
    : kind === "classificacao"
      ? "caixas/laços"
      : question?.uiProps?.modo;
  const mode = rawMode ? MODE_BY_RUNTIME[String(rawMode)] : undefined;
  const withMode = mode && bases.length ? [`${bases[0]}#${mode}`, ...bases.slice(1)] : bases;
  return { primitives: [...withMode, ...withMode.map(item => item.split("#")[0])] };
}

const trackById = new Map(ALL_MATH_TRACKS.map(track => [track.id, track]));

function sampleRuntime(id: string): RuntimeSample {
  const track: any = trackById.get(id);
  if (!track) return { kinds: [], delivered: [], unknownKinds: [], error: "track ausente" };
  if (track.contentStatus === "fallback") {
    return { kinds: ["fallback"], delivered: [], unknownKinds: [] };
  }
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
    return {
      kinds,
      delivered: uniq(delivered),
      unknownKinds: uniq(unknownKinds),
    };
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

interface VisualIntroductions { modeSwaps: string[]; tools: string[]; roots: string[] }
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
  const entries = block
    ? [...block[1].matchAll(/"((?:N[1-7]|AL|GE|GM|PE)\.\d{2})"\s*:\s*([A-Za-z0-9_]+)/g)]
      .map(match => [match[1], match[2]] as const)
    : [];
  return new Map(entries);
}
const legacyGeneratorById = generatorMap();

const testFiles = walkFiles("src", path => /\.(?:test|spec)\.(?:ts|tsx|js|jsx)$/.test(path));
const testsById = new Map<string, string[]>();
for (const file of testFiles) {
  const source = read(file);
  for (const id of nodes.map(node => node.id)) {
    if (source.includes(id)) testsById.set(id, [...(testsById.get(id) ?? []), file]);
  }
}

const GLOBAL_AUDITS = [
  "npm run auditar",
  "npm run fichas:auditar",
  "npm run fichas:conferir",
  "npm run grafo:check",
];

function statusFor(id: string): MatrixRow["status"] {
  const track: any = trackById.get(id);
  const source = String(track?.generatorSource ?? "fallback");
  if (source === "composer") return "padrao-ouro";
  if (source === "legacy") return "legado";
  return "fallback";
}

function implementationFor(id: string, status: MatrixRow["status"]): string {
  const legacy = legacyGeneratorById.get(id);
  if (status === "padrao-ouro") {
    return legacy ? `Composer ativo; rollback legado ${legacy}` : "Composer ativo; estreia sem gerador legado";
  }
  if (status === "legado") return `gerador legado ${legacy ?? "<não identificado>"}`;
  return "gFallback / placeholder Em construção";
}

function actionFor(row: Omit<MatrixRow, "action">): string {
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

const rows: MatrixRow[] = nodes.map(node => {
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

  const base: Omit<MatrixRow, "action"> = {
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
      ? "Composer inativo; Sensei não deve prescrever conteúdo inexistente/fallback"
      : status === "padrao-ouro"
        ? "Composer ativo; Sensei pode prescrever quando learner state + DAG tornarem o nó elegível"
        : "Composer inativo; Sensei pode chegar ao gerador legado quando learner state + DAG tornarem o nó elegível",
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

const actionable = [...rows].sort((a, b) =>
  a.causalWave - b.causalWave
  || b.downstream - a.downstream
  || a.id.localeCompare(b.id)
);

function counts() {
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

function assertMatrix(): void {
  const failures: string[] = [];
  const current = counts();
  const check = (condition: boolean, message: string) => { if (!condition) failures.push(message); };

  check(nodes.length === BASELINE.competencies, `grafo: esperado ${BASELINE.competencies}, encontrado ${nodes.length}`);
  check(new Set(nodes.map(node => node.id)).size === nodes.length, "grafo contém IDs duplicados");
  check(rows.length === BASELINE.competencies, `matriz: esperado ${BASELINE.competencies}, encontrado ${rows.length}`);
  check(canonical.blockCount === BASELINE.authoredFichas, `fichas autorais: esperado ${BASELINE.authoredFichas}, encontrado ${canonical.blockCount}`);
  check(fichaByCompetence.size === BASELINE.competencies, `cobertura de ficha: esperado 90/90, encontrado ${fichaByCompetence.size}/90`);
  check(current.composer === BASELINE.composer, `Composer ativo divergiu do baseline: ${current.composer} vs ${BASELINE.composer}`);
  check(current.legacy === BASELINE.legacy, `legado divergiu do baseline: ${current.legacy} vs ${BASELINE.legacy}`);
  check(current.fallback === BASELINE.fallback, `fallback divergiu do baseline: ${current.fallback} vs ${BASELINE.fallback}`);
  check(current.served === BASELINE.served, `servido sem fallback divergiu: ${current.served} vs ${BASELINE.served}`);
  check(current.divergences === BASELINE.divergences, `divergências ficha↔screen divergiram: ${current.divergences} vs ${BASELINE.divergences}`);
  check(current.modeSwaps === BASELINE.modeSwaps, `trocas visuais divergiram: ${current.modeSwaps} vs ${BASELINE.modeSwaps}`);
  check(current.toolIntroductions === BASELINE.toolIntroductions, `estreias de ferramenta divergiram: ${current.toolIntroductions} vs ${BASELINE.toolIntroductions}`);
  check(JSON.stringify(current.missingPrimitives) === JSON.stringify([...BASELINE.missingPrimitives]), `primitivas ausentes divergiram: ${current.missingPrimitives.join(", ")}`);

  const unknownCanonical = canonical.entries
    .map(entry => entry.competence)
    .filter(id => !graphIds.has(id));
  check(unknownCanonical.length === 0, `fichas referenciam IDs fora do grafo: ${uniq(unknownCanonical).join(", ")}`);

  for (const row of rows) {
    check(row.canonicalFichas.length > 0, `${row.id}: sem ficha canônica`);
    check(Boolean(trackById.get(row.id)), `${row.id}: sem Track runtime`);
    check(row.action.trim().length > 0, `${row.id}: sem ação declarada`);
    const sample = sampleRuntime(row.id);
    check(!sample.error, `${row.id}: falha ao amostrar runtime: ${sample.error ?? "?"}`);
    check(sample.unknownKinds.length === 0, `${row.id}: kind sem tradução: ${sample.unknownKinds.join(", ")}`);
    if (row.status === "padrao-ouro") {
      check(COMPOSER_CANARIES.has(row.id), `${row.id}: status padrão-ouro sem canário ativo`);
      check(row.missingPrimitives.length === 0, `${row.id}: padrão-ouro exige primitiva ausente ${row.missingPrimitives.join(", ")}`);
    }
    for (const prereq of row.prereqs) {
      check(graphIds.has(prereq), `${row.id}: prereq inexistente ${prereq}`);
      check(causalDepth(prereq) < row.causalWave, `${row.id}: ordem causal não coloca ${prereq} antes do dependente`);
    }
  }

  const moedasBlockers = rows.filter(row => row.missingPrimitives.includes("Moedas")).map(row => row.id);
  const reguaBlockers = rows.filter(row => row.missingPrimitives.includes("Regua")).map(row => row.id);
  check(moedasBlockers.includes("GM.03"), `Moedas deveria bloquear GM.03; bloqueia ${moedasBlockers.join(", ") || "ninguém"}`);
  check(reguaBlockers.includes("GM.05"), `Regua deveria bloquear GM.05; bloqueia ${reguaBlockers.join(", ") || "ninguém"}`);

  if (failures.length) {
    console.error("SAGA — COVERAGE MATRIX: FALHOU");
    for (const failure of failures) console.error(`- ${failure}`);
    console.error("\nNão ajuste baseline para ficar verde. Investigue a divergência e reconcilie a fonte real.");
    process.exitCode = 1;
    return;
  }

  console.log("SAGA — COVERAGE MATRIX: OK");
  console.log(JSON.stringify(current, null, 2));
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function markdown(): string {
  const current = counts();
  const lines = [
    "# Coverage Matrix — SAGA",
    "",
    "> Matriz derivada das fontes reais do repositório. Não editar contagens para fazê-las bater: divergência é achado de auditoria.",
    "",
    "## Baseline reconciliado",
    "",
    `- ${current.competencies} competências / ${current.authoredFichas} fichas autorais;`,
    `- Composer ativo: ${current.composer}; legado: ${current.legacy}; fallback: ${current.fallback}; servido sem fallback: ${current.served};`,
    `- divergências ficha↔screen: ${current.divergences}; trocas de linguagem visual: ${current.modeSwaps}; estreias de ferramenta: ${current.toolIntroductions};`,
    `- primitivas bloqueadoras ausentes: ${current.missingPrimitives.join(", ") || "nenhuma"}.`,
    "",
    "## Regra de ordem causal",
    "",
    "Execute dívidas em ondas crescentes W0→Wn. Dentro da mesma onda, maior `impacto` (número de descendentes no DAG) vem primeiro. Primitiva ausente é bloqueio anterior à ativação da competência. Não iniciar fábrica em dependente enquanto um ancestral acionável ou primitiva exigida estiver pendente.",
    "",
    "| ID | Grafo | Ficha canônica | Implementação real | Screen/primitiva real | Composer/Sensei | Testes/auditoria | Status | Dívida/bloqueio | Ação necessária | Ordem causal |",
    "|---|---|---|---|---|---|---|---|---|---|---|",
  ];

  for (const row of actionable) {
    const graphCell = `${row.name}; pré: ${row.prereqs.join(", ") || "raiz"}`;
    const fichaCell = `${row.canonicalFichas.join("+")} · ${row.canonicalPrimitives.join(", ") || "sem primitiva declarada"}`;
    const runtimeCell = row.runtimeKinds.length
      ? `${row.runtimeKinds.join(", ")} → ${row.runtimePrimitives.join(", ") || "sem primitiva"}`
      : "não amostrado";
    const testsCell = row.tests.length
      ? `${row.tests.slice(0, 3).join(", ")}${row.tests.length > 3 ? ` +${row.tests.length - 3}` : ""}; gates globais`
      : "gates globais; sem teste nominal por ID";
    lines.push(`| ${row.id} | ${escapeCell(graphCell)} | ${escapeCell(fichaCell)} | ${escapeCell(row.implementation)} | ${escapeCell(runtimeCell)} | ${escapeCell(row.composerSensei)} | ${escapeCell(testsCell)} | ${row.status} | ${escapeCell(row.debt.join("; ") || "nenhuma objetiva")} | ${escapeCell(row.action)} | ${row.causalOrder} |`);
  }
  return `${lines.join("\n")}\n`;
}

const args = new Set(process.argv.slice(2));
if (args.has("--json")) {
  console.log(JSON.stringify({ generatedAt: new Date().toISOString(), counts: counts(), rows: actionable }, null, 2));
} else if (args.has("--markdown")) {
  console.log(markdown());
} else {
  assertMatrix();
}
