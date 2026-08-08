import type { State } from "../types";
import { escolherSaveMaisRecente } from "./reconciliacaoDeSaves";
import { canUseLegacyState } from "./storageIdentity";

export type BootstrapSource = "scoped-local" | "legacy-local" | "cloud" | "fresh";

export interface BootstrapResult {
  state: State;
  source: BootstrapSource;
  claimLegacy: boolean;
  shouldUploadCloud: boolean;
}

interface Args {
  uid: string;
  scopedLocalRaw: unknown;
  legacyLocalRaw: unknown;
  legacyOwnerUid: string | null;
  cloudRaw: unknown;
  migrate: (raw: unknown) => State;
  fresh: () => State;
  currentSchemaVersion: number;
}

function parseRaw(raw: unknown): any | null {
  if (!raw) return null;
  if (typeof raw !== "string") return raw;
  try { return JSON.parse(raw); } catch { return null; }
}

function migrateCandidate(raw: unknown, migrate: (raw: unknown) => State, version: number): State | null {
  const parsed = parseRaw(raw);
  // A política atual para schema incompatível é reset. Na RECONCILIAÇÃO ele
  // precisa ser candidato inválido, não um save vazio capaz de vencer empate.
  if (!parsed || parsed.schemaVersion !== version) return null;
  return migrate(parsed);
}

/** Migra cada candidato ANTES de comparar timestamps e nunca mistura objetos. */
export function resolveBootstrapState(args: Args): BootstrapResult {
  const {
    uid, scopedLocalRaw, legacyLocalRaw, legacyOwnerUid, cloudRaw,
    migrate, fresh, currentSchemaVersion,
  } = args;

  let localRaw: unknown = scopedLocalRaw || null;
  let localSource: "scoped-local" | "legacy-local" | null = scopedLocalRaw ? "scoped-local" : null;
  let claimLegacy = false;

  if (!localRaw && canUseLegacyState(uid, legacyOwnerUid, legacyLocalRaw, cloudRaw)) {
    localRaw = legacyLocalRaw;
    localSource = "legacy-local";
    claimLegacy = true;
  }

  const local = migrateCandidate(localRaw, migrate, currentSchemaVersion);
  const cloud = migrateCandidate(cloudRaw, migrate, currentSchemaVersion);

  if (!local && !cloud) {
    return { state: fresh(), source: "fresh", claimLegacy, shouldUploadCloud: false };
  }
  if (local && !cloud) {
    return { state: local, source: localSource || "scoped-local", claimLegacy, shouldUploadCloud: true };
  }
  if (!local && cloud) {
    return { state: cloud, source: "cloud", claimLegacy, shouldUploadCloud: false };
  }

  const escolha = escolherSaveMaisRecente(cloud, local);
  if (escolha.origem === "local") {
    return {
      state: escolha.estado as State,
      source: localSource || "scoped-local",
      claimLegacy,
      shouldUploadCloud: true,
    };
  }
  return {
    state: escolha.estado as State,
    source: "cloud",
    claimLegacy,
    shouldUploadCloud: false,
  };
}
