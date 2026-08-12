export const LEGACY_STATE_KEY = "mk-state-v1";
export const LEGACY_STATE_OWNER_KEY = "mk-state-v1-legacy-owner";

export function stateKeyForUid(uid: string): string {
  if (!uid.trim()) throw new Error("UID vazio não pode identificar save local.");
  return `${LEGACY_STATE_KEY}:${uid}`;
}

function kidIds(raw: unknown): Set<string> {
  let value = raw as any;
  if (typeof raw === "string") {
    try { value = JSON.parse(raw); } catch { return new Set(); }
  }
  const kids = Array.isArray(value?.kids) ? value.kids : [];
  return new Set(kids.map((k: any) => String(k?.id || "")).filter(Boolean));
}

/**
 * A chave histórica não tinha dono. Depois de P20 ela só pode ser oferecida a
 * um UID se ainda não foi reivindicada (ou foi pelo mesmo UID). Quando cloud e
 * legado já têm perfis, exigimos ao menos um kid.id em comum para não misturar
 * famílias diferentes que usaram o mesmo tablet.
 */
export function canUseLegacyState(
  currentUid: string,
  legacyOwnerUid: string | null,
  legacyRaw: unknown,
  cloudRaw: unknown,
): boolean {
  if (!legacyRaw) return false;
  if (legacyOwnerUid && legacyOwnerUid !== currentUid) return false;
  if (!cloudRaw) return true;

  const legacyKids = kidIds(legacyRaw);
  const cloudKids = kidIds(cloudRaw);
  if (!legacyKids.size || !cloudKids.size) return true;
  for (const id of legacyKids) if (cloudKids.has(id)) return true;
  return false;
}
