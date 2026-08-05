const SPRITECOLLAB_GRAPHQL_URL = "https://spriteserver.pmdcollab.org/graphql";
const CATALOG_CACHE_TTL_MS = 10 * 60 * 1000;
const CHARACTER_CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_ASSET_BYTES = 15 * 1024 * 1024;
const STARTER_IDS = [1, 4, 7, 25, 133, 447] as const;
const ALLOWED_ASSET_HOSTS = new Set([
  "spriteserver.pmdcollab.org",
  "raw.githubusercontent.com",
]);

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

interface GraphQlEnvelope<T> {
  data?: T;
  errors?: Array<{ message?: string }>;
}

interface FormShape {
  path: string;
  fullPath: string;
  fullName: string;
  canon: boolean;
  isShiny: boolean;
  isFemale: boolean;
  portraits: { previewEmotion?: { url: string } | null };
  sprites: {
    phase: string;
    phaseRaw: number;
    animDataXml?: string | null;
    creditPrimary?: { id: string; name?: string; contact?: string } | null;
    creditSecondary?: Array<{ id: string; name?: string; contact?: string }>;
    actions?: Array<{
      __typename: "Sprite" | "CopyOf";
      action: string;
      locked: boolean;
      animUrl?: string;
      offsetsUrl?: string;
      shadowsUrl?: string;
      copyOf?: string;
    }>;
  };
}

interface MonsterShape {
  rawId: string;
  name: string;
  forms: FormShape[];
}

let catalogCache:
  | { expiresAt: number; items: CreatureCatalogEntry[]; sourceCommit?: string; sourceUpdatedAt?: string }
  | undefined;
const characterCache = new Map<string, { expiresAt: number; value: CreatureCharacterData }>();

async function querySpriteCollab<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(SPRITECOLLAB_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "SAGA-Creature-Engine/1.0",
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`SpriteCollab respondeu HTTP ${response.status} ${response.statusText}`);
    }
    const envelope = (await response.json()) as GraphQlEnvelope<T>;
    if (envelope.errors?.length) {
      throw new Error(envelope.errors.map((error) => error.message || "erro GraphQL").join("; "));
    }
    if (!envelope.data) throw new Error("SpriteCollab retornou uma resposta sem dados.");
    return envelope.data;
  } finally {
    clearTimeout(timeout);
  }
}

function pickCanonicalForm(forms: FormShape[]): FormShape | undefined {
  const usable = forms.filter((form) => Boolean(form.sprites.animDataXml));
  return (
    usable.find((form) => form.canon && !form.isShiny && !form.isFemale) ||
    usable.find((form) => !form.isShiny && !form.isFemale) ||
    usable[0]
  );
}

function normalizeCredits(form: FormShape) {
  const byId = new Map<string, { id: string; name?: string; contact?: string }>();
  const credits = [form.sprites.creditPrimary, ...(form.sprites.creditSecondary || [])];
  for (const credit of credits) {
    if (credit?.id) byId.set(credit.id, credit);
  }
  return [...byId.values()];
}

export function normalizeCreatureNumericId(value: string | number): string {
  const digits = String(value).replace(/\D/g, "");
  const parsed = Number(digits);
  if (!digits || !Number.isInteger(parsed) || parsed < 0 || parsed > 9999) {
    throw new Error(`ID de criatura inválido: ${String(value)}`);
  }
  return String(parsed).padStart(4, "0");
}

export async function getCreatureCatalog(forceRefresh = false) {
  if (!forceRefresh && catalogCache && catalogCache.expiresAt > Date.now()) return catalogCache;

  const query = /* GraphQL */ `
    query SagaCreatureCatalog($filter: [Int!]) {
      meta { assetsCommit assetsUpdateDate }
      monster(filter: $filter) {
        rawId
        name
        forms {
          path
          fullPath
          fullName
          canon
          isShiny
          isFemale
          portraits { previewEmotion { url } }
          sprites { phase phaseRaw animDataXml }
        }
      }
    }
  `;
  const data = await querySpriteCollab<{
    meta: { assetsCommit?: string; assetsUpdateDate?: string };
    monster: MonsterShape[];
  }>(query, { filter: [...STARTER_IDS] });

  const items = data.monster.flatMap((monster) => {
    const form = pickCanonicalForm(monster.forms);
    if (!form) return [];
    return [
      {
        numericId: normalizeCreatureNumericId(monster.rawId),
        name: monster.name,
        path: form.fullPath,
        portraitUrl: form.portraits.previewEmotion?.url,
        phase: form.sprites.phase,
        phaseRaw: form.sprites.phaseRaw,
      },
    ];
  });
  items.sort((a, b) => Number(a.numericId) - Number(b.numericId));

  catalogCache = {
    expiresAt: Date.now() + CATALOG_CACHE_TTL_MS,
    items,
    sourceCommit: data.meta.assetsCommit,
    sourceUpdatedAt: data.meta.assetsUpdateDate,
  };
  return catalogCache;
}

export async function getCreatureCharacter(numericIdInput: string): Promise<CreatureCharacterData> {
  const numericId = normalizeCreatureNumericId(numericIdInput);
  const cached = characterCache.get(numericId);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const query = /* GraphQL */ `
    query SagaCreatureCharacter($filter: [Int!]) {
      meta { assetsCommit assetsUpdateDate }
      monster(filter: $filter) {
        rawId
        name
        forms {
          path
          fullPath
          fullName
          canon
          isShiny
          isFemale
          portraits { previewEmotion { url } }
          sprites {
            phase
            phaseRaw
            animDataXml
            creditPrimary { id name contact }
            creditSecondary { id name contact }
            actions {
              __typename
              ... on Sprite { action locked animUrl offsetsUrl shadowsUrl }
              ... on CopyOf { action locked copyOf }
            }
          }
        }
      }
    }
  `;
  const data = await querySpriteCollab<{
    meta: { assetsCommit?: string; assetsUpdateDate?: string };
    monster: MonsterShape[];
  }>(query, { filter: [Number(numericId)] });

  const monster = data.monster[0];
  if (!monster) throw new Error(`Criatura ${numericId} não encontrada no PMDCollab.`);
  const form = pickCanonicalForm(monster.forms);
  if (!form?.sprites.animDataXml) {
    throw new Error(`A forma canônica de ${monster.name} não possui AnimData.xml.`);
  }

  const xmlResponse = await fetchAllowedCreatureAsset(form.sprites.animDataXml);
  const animDataXml = await xmlResponse.text();
  const suffix = form.fullName?.trim();
  const value: CreatureCharacterData = {
    numericId,
    displayName: suffix ? `${monster.name} — ${suffix}` : monster.name,
    path: form.fullPath,
    animDataXml,
    portraitUrl: form.portraits.previewEmotion?.url,
    phase: form.sprites.phase,
    phaseRaw: form.sprites.phaseRaw,
    actions: (form.sprites.actions || []).map((action) =>
      action.__typename === "CopyOf"
        ? {
            kind: "copy" as const,
            action: action.action,
            locked: action.locked,
            copyOf: action.copyOf,
          }
        : {
            kind: "sprite" as const,
            action: action.action,
            locked: action.locked,
            animUrl: action.animUrl,
            offsetsUrl: action.offsetsUrl,
            shadowsUrl: action.shadowsUrl,
          },
    ),
    credits: normalizeCredits(form),
    license: "Uso prototípico: verifique os créditos e a licença específica do asset no PMDCollab antes de distribuir.",
    sourceCommit: data.meta.assetsCommit,
    sourceUpdatedAt: data.meta.assetsUpdateDate,
  };

  characterCache.set(numericId, {
    expiresAt: Date.now() + CHARACTER_CACHE_TTL_MS,
    value,
  });
  return value;
}

export function assertAllowedCreatureAssetUrl(rawUrl: string): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("URL de asset inválida.");
  }
  if (url.protocol !== "https:" || !ALLOWED_ASSET_HOSTS.has(url.hostname)) {
    throw new Error(`Host de asset não permitido: ${url.hostname || "desconhecido"}.`);
  }
  return url;
}

export async function fetchAllowedCreatureAsset(rawUrl: string): Promise<Response> {
  const url = assertAllowedCreatureAssetUrl(rawUrl);
  const response = await fetch(url, {
    headers: { "User-Agent": "SAGA-Creature-Engine/1.0" },
  });
  if (!response.ok) throw new Error(`Falha ao buscar asset: HTTP ${response.status}.`);
  const length = Number(response.headers.get("content-length") || 0);
  if (length > MAX_ASSET_BYTES) throw new Error("Asset excede o limite de 15 MB.");
  return response;
}
