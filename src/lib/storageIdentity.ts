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

/**
 * Onde o progresso da criança é gravado, dado o que se sabe da identidade.
 *
 * ## O defeito que esta função existe para impedir
 *
 * A gravação era condicionada a haver um UID do Firebase. Sem UID — que é
 * exatamente a situação de quem tocou em "Começar sem Conta" — o estado só era
 * escrito sob `?e2e=1`. Na prática: o pai criava o perfil da criança, ela
 * jogava, o app fechava e **o perfil e o progresso inteiro sumiam**, porque
 * viviam só na memória da aba.
 *
 * O boot já sabia ler a chave local no ramo do visitante. Só faltava alguém
 * escrevê-la — e o único que escrevia era o gancho de teste. É o mesmo padrão
 * que travou `modoVisitante`: o caminho sem conta funcionava para o E2E e não
 * para a criança.
 *
 * ## A regra
 *
 * Havendo conta, o progresso é dela (e sobe para a nuvem). Não havendo conta
 * mas havendo escolha de visitante, ele é local e precisa sobreviver ao
 * fechamento do app. Sem conta e sem escolha não há a quem pertencer: aí não se
 * grava, e é isto que impede o estado de vazar de uma sessão para outra na tela
 * de login.
 */
export function destinoDoProgresso(input: { uid: string | null; visitante: boolean; e2e: boolean }): "conta" | "local" | "nenhum" {
  if (input.uid) return "conta";
  if (input.visitante || input.e2e) return "local";
  return "nenhum";
}
