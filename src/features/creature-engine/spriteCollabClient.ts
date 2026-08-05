export interface CreatureCatalogEntry {
  numericId: string;
  name: string;
  path: string;
  portraitUrl?: string;
  phase: string;
  phaseRaw: number;
}

export interface CreatureActionAsset {
  kind: "sprite" | "copy";
  action: string;
  locked: boolean;
  copyOf?: string;
  animUrl?: string;
  offsetsUrl?: string;
  shadowsUrl?: string;
}

export interface CreatureCharacterData {
  numericId: string;
  displayName: string;
  path: string;
  animDataXml: string;
  portraitUrl?: string;
  phase: string;
  phaseRaw: number;
  actions: CreatureActionAsset[];
  credits: Array<{ id: string; name?: string; contact?: string }>;
  license: string;
  sourceCommit?: string;
  sourceUpdatedAt?: string;
}

async function readJson<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as T | { error?: string; details?: string } | null;
  if (!response.ok) {
    const errorBody = body as { error?: string; details?: string } | null;
    throw new Error(errorBody?.details || errorBody?.error || `HTTP ${response.status}`);
  }
  return body as T;
}

export async function fetchCreatureCatalog(signal?: AbortSignal): Promise<CreatureCatalogEntry[]> {
  const response = await fetch("/api/creatures/catalog", { signal });
  const payload = await readJson<{ items: CreatureCatalogEntry[] }>(response);
  return payload.items;
}

export async function fetchCreatureCharacter(
  numericId: string,
  signal?: AbortSignal,
): Promise<CreatureCharacterData> {
  const normalized = String(numericId).replace(/\D/g, "").padStart(4, "0");
  const response = await fetch(`/api/creatures/${encodeURIComponent(normalized)}`, { signal });
  return readJson<CreatureCharacterData>(response);
}

export function creatureAssetUrl(remoteUrl: string | undefined): string | undefined {
  if (!remoteUrl) return undefined;
  return `/api/creatures/asset?url=${encodeURIComponent(remoteUrl)}`;
}

function normalizeAction(value: string): string {
  return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

export function findCreatureAction(
  actions: readonly CreatureActionAsset[],
  actionName: string,
): CreatureActionAsset | undefined {
  const target = normalizeAction(actionName);
  return actions.find((action) => normalizeAction(action.action) === target);
}

/** Resolve CopyOf until the concrete sprite asset, rejecting cycles. */
export function resolveCreatureActionAsset(
  actions: readonly CreatureActionAsset[],
  actionName: string,
): CreatureActionAsset | undefined {
  const visited = new Set<string>();
  let current = findCreatureAction(actions, actionName);

  while (current?.kind === "copy") {
    const key = normalizeAction(current.action);
    if (visited.has(key)) return undefined;
    visited.add(key);
    if (!current.copyOf) return undefined;
    current = findCreatureAction(actions, current.copyOf);
  }

  return current?.kind === "sprite" ? current : undefined;
}
