import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Track } from "../../src/types.ts";
import type { CoverageAuditResult, CoverageMatrixJson, CoverageRow } from "./coverage_matrix_contract.ts";
import { parseRequiredPrimitivesFromFicha } from "./coverage_matrix_ficha_parser.ts";
import { AllFichas } from "../../src/curriculum/fichas/index.ts";
import { FichaCompetencia } from "../../src/curriculum/schema.ts";
import {
  geradorLegadoDe,
  getJourneyCatalog,
  getJourneyCatalogForAudit,
} from "../../src/curriculum/motores/curriculum.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const FICHAS_DIR = path.join(ROOT, "AI_Studio_Lab/pedagogia/fichas");
const RUNTIME_MAP_PATH = path.join(ROOT, "AI_Studio_Lab/tools/ficha_runtime_map.cjs");
const CANARY_IDS_PATH = path.join(ROOT, "src/curriculum/motores/composerCanaryIds.ts");
const COMPOSER_PATH = path.join(ROOT, "src/curriculum/Composer.ts");
const RENDERER_PATH = path.join(ROOT, "src/components/FichaRenderer.tsx");
const GAMELOOP_RENDERER_PATH = path.join(ROOT, "src/components/gameloop/GameLoopExerciseRenderer.tsx");
const JOURNEY_BY_ID = new Map(AllFichas.map(ficha => [ficha.id, ficha]));
const CANARY_IDS = parseCanaryIds();
const COMPOSER_KINDS = parseComposerKinds();
const RENDERER_KINDS = parseRendererKinds();
const RUNTIME_MAP = loadRuntimeMap();

export const COVERAGE_CLOSED_BASELINE = {
  composer: 31,
  legacy: 21,
  fallback: 38,
  served: 52,
  divergence: 16,
} as const;

export interface CoverageMigrationDelta {
  composer?: number;
  legacy?: number;
  fallback?: number;
  served?: number;
  divergences?: number;
}

export interface CoverageMigration {
  id: string;
  label: string;
  /**
   * Auditor-observed delta only. This is not a roadmap target: the migration is
   * added here only after the promoted canary has been observed by Matrix.
   */
  delta: CoverageMigrationDelta;
}

export const COVERAGE_MIGRATIONS: CoverageMigration[] = [
  {
    id: "W7",
    label: "N2.02 / F36 — Quadrado100 canary",
    delta: { composer: 1, legacy: -1 },
  },
  {
    id: "W8",
    label: "N3.01 / F13 — VisualAddition canary",
    delta: { composer: 1, legacy: -1 },
  },
  {
    id: "W9",
    label: "N3.02 / F15 — EmojiRow#riscar canary",
    delta: { composer: 1, legacy: -1, divergences: -1 },
  },
  {
    id: "W10",
    label: "N3.03 / F14 — counting on LinkingCubes + NumberLine canary",
    delta: { composer: 1, legacy: -1, divergences: -1 },
  },
];

export function applyCoverageMigrations(
  baseline = COVERAGE_CLOSED_BASELINE,
  migrations = COVERAGE_MIGRATIONS,
) {
  return migrations.reduce((current, migration) => ({
    composer: current.composer + (migration.delta.composer ?? 0),
    legacy: current.legacy + (migration.delta.legacy ?? 0),
    fallback: current.fallback + (migration.delta.fallback ?? 0),
    served: current.served + (migration.delta.served ?? 0),
    divergence: current.divergence + (migration.delta.divergences ?? 0),
  }), { ...baseline });
}

export const COVERAGE_BASELINE = applyCoverageMigrations();

/**
 * Baseline fechado em P21.1. É um snapshot histórico, não uma meta que anda
 * silenciosamente com o código. Qualquer migração futura deve comparar o delta
 * contra esse estado e, se autorizada, registrar explicitamente o novo baseline.
 */
export function assertCoverageBaseline(
  actual: Pick<CoverageAuditResult, "producerCounts" | "servedCount" | "rows">,
): string[] {
  const failures: string[] = [];
  const { composer, legacy, fallback } = actual.producerCounts;
  const divergences = actual.rows.filter(row => row.divergent).length;
  if (composer !== COVERAGE_BASELINE.composer || legacy !== COVERAGE_BASELINE.legacy || fallback !== COVERAGE_BASELINE.fallback) {
    failures.push(
      `Baseline de proveniência mudou: esperado ${COVERAGE_BASELINE.composer} Composer / ${COVERAGE_BASELINE.legacy} legado / ${COVERAGE_BASELINE.fallback} fallback, recebido ${composer}/${legacy}/${fallback}. Atualize apenas no contexto de uma migração autorizada.`,
    );
  }
  if (actual.servedCount !== COVERAGE_BASELINE.served) {
    failures.push(
      `Baseline de cobertura servida mudou: esperado ${COVERAGE_BASELINE.served}, recebido ${actual.servedCount}. Registre explicitamente a mudança antes de aceitar o novo estado.`,
    );
  }
  if (divergences !== COVERAGE_BASELINE.divergence) {
    failures.push(
      `Baseline de divergências mudou: esperado ${COVERAGE_BASELINE.divergence}, recebido ${divergences}. Corrija ou registre a migração explicitamente.`,
    );
  }
  return failures;
}

export function expectedFromBaseline(delta: {
  composer?: number;
  legacy?: number;
  fallback?: number;
  served?: number;
  divergences?: number;
}) {
  return {
    composer: COVERAGE_BASELINE.composer + (delta.composer ?? 0),
    legacy: COVERAGE_BASELINE.legacy + (delta.legacy ?? 0),
    fallback: COVERAGE_BASELINE.fallback + (delta.fallback ?? 0),
    served: COVERAGE_BASELINE.served + (delta.served ?? 0),
    divergences: COVERAGE_BASELINE.divergence + (delta.divergences ?? 0),
  };
}

interface RuntimeMapEntry {
  primitive: string;
  kinds: string[];
  builderKinds: string[];
  specializedBuilderIds?: string[];
  rendererKinds: string[];
}

interface CapturedConsole {
  args: unknown[];
}

function withCapturedConsole<T>(fn: () => T): { value: T; logs: CapturedConsole[] } {
  const logs: CapturedConsole[] = [];
  const original = console.log;
  console.log = (...args: unknown[]) => logs.push({ args });
  try {
    return { value: fn(), logs };
  } finally {
    console.log = original;
  }
}

function parseCanaryIds(): Set<string> {
  const source = fs.readFileSync(CANARY_IDS_PATH, "utf8");
  const match = source.match(/DEFAULT_COMPOSER_CANARY_IDS\s*=\s*\[([\s\S]*?)\]\s*as const/);
  if (!match) throw new Error("coverage_matrix: não foi possível ler DEFAULT_COMPOSER_CANARY_IDS.");
  return new Set(Array.from(match[1].matchAll(/["']([^"']+)["']/g), item => item[1]));
}

function parseComposerKinds(): Set<string> {
  const source = fs.readFileSync(COMPOSER_PATH, "utf8");
  return new Set(Array.from(source.matchAll(/case\s+["']([^"']+)["']/g), item => item[1]));
}

function parseRendererKinds(): Set<string> {
  const source = `${fs.readFileSync(RENDERER_PATH, "utf8")}\n${fs.readFileSync(GAMELOOP_RENDERER_PATH, "utf8")}`;
  const kinds = new Set(Array.from(source.matchAll(/case\s+["']([^"']+)["']/g), item => item[1]));
  for (const match of source.matchAll(/q\.kind\s*===\s*["']([^"']+)["']/g)) kinds.add(match[1]);
  return kinds;
}

function loadRuntimeMap(): RuntimeMapEntry[] {
  const source = fs.readFileSync(RUNTIME_MAP_PATH, "utf8");
  const entries: RuntimeMapEntry[] = [];
  const blockRegex = /\{\s*primitive:\s*["']([^"']+)["']([\s\S]*?)\n\s*\},?/g;
  for (const match of source.matchAll(blockRegex)) {
    const primitive = match[1];
    const block = match[2];
    const readArray = (field: string): string[] => {
      const fieldMatch = block.match(new RegExp(`${field}:\\s*\\[([\\s\\S]*?)\\]`));
      return fieldMatch ? Array.from(fieldMatch[1].matchAll(/["']([^"']+)["']/g), item => item[1]) : [];
    };
    entries.push({
      primitive,
      kinds: readArray("kinds"),
      builderKinds: readArray("builderKinds"),
      specializedBuilderIds: readArray("specializedBuilderIds"),
      rendererKinds: readArray("rendererKinds"),
    });
  }
  return entries;
}

function emptyRuntimeKinds(): CoverageMatrixJson["runtimeKinds"] {
  return { composer: [], renderer: [], registeredNotRendered: [], renderedWithoutBuilder: [] };
}

function readFichaFiles(): string[] {
  return fs.readdirSync(FICHAS_DIR)
    .filter(name => /^FICHAS_F\d+_COMPLETAS\.md$/.test(name))
    .sort();
}

function producerFromTrack(track: Track): CoverageRow["producer"] {
  return track.generatorSource ?? "fallback";
}

function catalogRows(): Array<{ track: Track; ficha: FichaCompetencia | undefined; kind: CoverageRow["catalogKind"] }> {
  const auditCatalog = getJourneyCatalogForAudit();
  const rows = new Map<string, { track: Track; ficha: FichaCompetencia | undefined; kind: CoverageRow["catalogKind"] }>();

  for (const track of auditCatalog.nodes) {
    const ficha = JOURNEY_BY_ID.get(track.id);
    rows.set(track.id, { track, ficha, kind: "node" });
  }
  for (const track of auditCatalog.aliases) {
    const canonical = rows.get(track.id)?.track ?? getJourneyCatalog().find(node => node.id === track.id);
    rows.set(`alias:${track.id}`, { track: canonical ?? track, ficha: JOURNEY_BY_ID.get(track.id), kind: "alias" });
  }
  for (const track of auditCatalog.compatibility) {
    const canonical = rows.get(track.id)?.track ?? getJourneyCatalog().find(node => node.id === track.id);
    rows.set(`compat:${track.id}`, { track: canonical ?? track, ficha: JOURNEY_BY_ID.get(track.id), kind: "compat" });
  }
  return [...rows.values()];
}

function primitiveAliases(required: string): string[] {
  const normalized = required.toLowerCase().replace(/[^a-z0-9]/g, "");
  const aliases = new Set<string>();
  aliases.add(normalized);
  if (normalized === "grupo") aliases.add("groups");
  if (normalized === "scattereditems") aliases.add("scattered");
  if (normalized === "interactivenumberline") aliases.add("numberline");
  if (normalized === "numberline") aliases.add("numberline");
  if (normalized === "tenframe") aliases.add("moldura");
  if (normalized === "materialdourado") aliases.add("materialdourado");
  if (normalized === "quadrado100") aliases.add("hundredchart");
  if (normalized === "shapecanvas") aliases.add("shapecanvas");
  if (normalized === "linkingcubes") aliases.add("linkingcubes");
  if (normalized === "emojrow") aliases.add("emojirow");
  if (normalized === "emojirrow") aliases.add("emojirow");
  return [...aliases];
}

function mapPrimitiveToRuntime(required: string): string[] {
  const requiredAliases = primitiveAliases(required);
  const mapped = new Set<string>();
  for (const entry of RUNTIME_MAP) {
    const primitive = entry.primitive.toLowerCase().replace(/[^a-z0-9]/g, "");
    const entryAliases = new Set([primitive, ...entry.kinds.map(kind => kind.toLowerCase().replace(/[^a-z0-9]/g, ""))]);
    if (requiredAliases.some(alias => entryAliases.has(alias))) mapped.add(entry.primitive);
  }
  if (!mapped.size) mapped.add(required);
  return [...mapped];
}

function deliveredPrimitives(track: Track, ficha: FichaCompetencia | undefined): string[] {
  const delivered = new Set<string>();
  const source = producerFromTrack(track);
  if (source === "composer") {
    const special = RUNTIME_MAP.filter(entry => entry.specializedBuilderIds?.includes(track.id));
    for (const entry of special) {
      for (const kind of entry.rendererKinds) {
        if (RENDERER_KINDS.has(kind) || entry.rendererKinds.length) delivered.add(entry.primitive);
      }
    }
    if (special.length) return [...delivered];
  }

  const legacy = geradorLegadoDe(track.id);
  let q: ReturnType<NonNullable<typeof legacy>> | undefined;
  if (source === "legacy" && legacy) q = legacy(3);
  else if (source === "composer" && ficha) {
    try {
      const kind = ficha.niveis?.[3]?.micro;
      const micro = ficha.micros.find(m => m.id === kind);
      if (micro) {
        for (const name of micro.kinds) {
          for (const primitive of mapPrimitiveToRuntime(name)) delivered.add(primitive);
        }
      }
    } catch { /* boundary below reports absence */ }
  }

  if (q?.kind) {
    for (const entry of RUNTIME_MAP) {
      if (entry.rendererKinds.includes(q.kind) || entry.kinds.includes(q.kind)) delivered.add(entry.primitive);
    }
  }
  return [...delivered];
}

function normalizePrimitive(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isRequiredDelivered(required: string, delivered: string[]): boolean {
  const requiredAliases = primitiveAliases(required);
  return delivered.some(item => {
    const deliveredNorm = normalizePrimitive(item);
    return requiredAliases.includes(deliveredNorm)
      || requiredAliases.some(alias => primitiveAliases(item).includes(alias));
  });
}

function runtimeKindAudit(): CoverageMatrixJson["runtimeKinds"] {
  const registeredNotRendered: string[] = [];
  const renderedWithoutBuilder: string[] = [];
  for (const entry of RUNTIME_MAP) {
    const hasBuilder = entry.builderKinds.some(kind => COMPOSER_KINDS.has(kind)) || Boolean(entry.specializedBuilderIds?.length);
    const hasRenderer = entry.rendererKinds.some(kind => RENDERER_KINDS.has(kind));
    if (hasBuilder && !hasRenderer) registeredNotRendered.push(entry.primitive);
    if (hasRenderer && !hasBuilder) renderedWithoutBuilder.push(entry.primitive);
  }
  return {
    composer: [...COMPOSER_KINDS].sort(),
    renderer: [...RENDERER_KINDS].sort(),
    registeredNotRendered: [...new Set(registeredNotRendered)].sort(),
    renderedWithoutBuilder: [...new Set(renderedWithoutBuilder)].sort(),
  };
}

export function buildCoverageMatrix(): CoverageAuditResult {
  const failures: string[] = [];
  const fichaFiles = readFichaFiles();
  const parsed = fichaFiles.map(file => parseRequiredPrimitivesFromFicha(path.join(FICHAS_DIR, file)));
  for (const result of parsed) failures.push(...result.failures);
  const requiredById = new Map<string, string[]>();
  for (const result of parsed) {
    for (const [id, primitives] of result.requiredById.entries()) {
      const current = requiredById.get(id) ?? [];
      requiredById.set(id, [...new Set([...current, ...primitives])]);
    }
  }

  const rows: CoverageRow[] = [];
  const missingCatalog = [...requiredById.keys()].filter(id => !getJourneyCatalogForAudit().allIds.has(id)).sort();
  const missingDoc = getJourneyCatalogForAudit().nodes.map(track => track.id).filter(id => !requiredById.has(id)).sort();

  for (const { track, ficha, kind } of catalogRows()) {
    if (kind !== "node") continue;
    const required = requiredById.get(track.id) ?? [];
    const delivered = deliveredPrimitives(track, ficha);
    const missingRequired = required.filter(primitive => !isRequiredDelivered(primitive, delivered));
    const divergent = missingRequired.length > 0;
    rows.push({
      id: track.id,
      catalogKind: kind,
      producer: producerFromTrack(track),
      requiredPrimitives: required,
      deliveredPrimitives: delivered,
      missingRequired,
      divergent,
      contentStatus: track.contentStatus ?? "fallback",
    });
  }

  const producerCounts = {
    composer: rows.filter(row => row.producer === "composer").length,
    legacy: rows.filter(row => row.producer === "legacy").length,
    fallback: rows.filter(row => row.producer === "fallback").length,
  };
  const servedCount = rows.filter(row => row.producer !== "fallback").length;
  const placeholderCount = rows.length - servedCount;
  const runtimeKinds = runtimeKindAudit();
  const result: CoverageAuditResult = {
    rows,
    producerCounts,
    servedCount,
    placeholderCount,
    divergenceCount: rows.filter(row => row.divergent).length,
    runtimeKinds,
    docCoverage: {
      fichaFiles,
      idsWithRequiredPrimitives: [...requiredById.keys()].sort(),
      missingCatalog,
      missingDoc,
    },
    failures,
  };
  result.failures.push(...assertCoverageBaseline(result));
  if (missingCatalog.length) result.failures.push(`IDs documentados sem nó no catálogo: ${missingCatalog.join(", ")}`);
  if (missingDoc.length) result.failures.push(`Nós do catálogo sem seção nas fichas completas: ${missingDoc.join(", ")}`);
  return result;
}

export function matrixToJson(result: CoverageAuditResult): CoverageMatrixJson {
  return {
    generatedAt: new Date().toISOString(),
    producerCounts: result.producerCounts,
    servedCount: result.servedCount,
    placeholderCount: result.placeholderCount,
    divergenceCount: result.divergenceCount,
    rows: result.rows,
    runtimeKinds: result.runtimeKinds,
    docCoverage: result.docCoverage,
    failures: result.failures,
  };
}

export function renderCoverageMarkdown(result: CoverageAuditResult): string {
  const lines: string[] = [];
  lines.push("# Coverage Matrix — Fichas autorais × runtime");
  lines.push("");
  lines.push(`- Composer: **${result.producerCounts.composer}**`);
  lines.push(`- Legado: **${result.producerCounts.legacy}**`);
  lines.push(`- Fallback: **${result.producerCounts.fallback}**`);
  lines.push(`- Servidas: **${result.servedCount}** / ${result.rows.length}`);
  lines.push(`- Divergências: **${result.divergenceCount}**`);
  lines.push("");
  lines.push("| ID | produtor | primitivas exigidas | primitivas entregues | faltantes | status |");
  lines.push("|---|---|---|---|---|---|");
  for (const row of result.rows) {
    lines.push(`| ${row.id} | ${row.producer} | ${row.requiredPrimitives.join(" + ") || "—"} | ${row.deliveredPrimitives.join(" + ") || "—"} | ${row.missingRequired.join(" + ") || "—"} | ${row.divergent ? "DIVERGENTE" : "OK"} |`);
  }
  return lines.join("\n");
}
