import type { Kid, State } from "../types";

export type EconomyRejectReason = "invalid-amount" | "insufficient-funds" | "kid-mismatch" | "already-owned";

export type EconomyResult =
  | { ok: true; state: State }
  | { ok: false; state: State; reason: EconomyRejectReason };

function validCost(cost: number): boolean {
  return Number.isFinite(cost) && cost >= 0 && Number.isInteger(cost);
}

/**
 * Boundary atômico do perfil/companheiro: ou a mutação E o débito acontecem,
 * ou nenhum deles acontece. Nunca aplica a compra e apenas "clampa" saldo a 0.
 */
export function applyKidPurchase(
  state: State,
  kidId: string,
  updatedKid: Kid,
  cost: number,
): EconomyResult {
  if (!validCost(cost)) return { ok: false, state, reason: "invalid-amount" };
  if (updatedKid.id !== kidId) return { ok: false, state, reason: "kid-mismatch" };
  const balance = Math.max(0, state.coins?.[kidId] ?? 0);
  if (balance < cost) return { ok: false, state, reason: "insufficient-funds" };
  return {
    ok: true,
    state: {
      ...state,
      kids: state.kids.map(kid => kid.id === kidId ? updatedKid : kid),
      coins: cost > 0 ? { ...state.coins, [kidId]: balance - cost } : state.coins,
    },
  };
}

/** Colecionável único: duplicata nunca cobra novamente. */
export function purchaseAlbumItem(
  state: State,
  kidId: string,
  itemId: string,
  cost: number,
): EconomyResult {
  if (!validCost(cost)) return { ok: false, state, reason: "invalid-amount" };
  const owned = state.album?.[kidId] ?? [];
  if (owned.includes(itemId)) return { ok: false, state, reason: "already-owned" };
  const balance = Math.max(0, state.coins?.[kidId] ?? 0);
  if (balance < cost) return { ok: false, state, reason: "insufficient-funds" };
  return {
    ok: true,
    state: {
      ...state,
      coins: { ...state.coins, [kidId]: balance - cost },
      album: { ...state.album, [kidId]: [...owned, itemId] },
    },
  };
}

export function spendCoins(state: State, kidId: string, amount: number): EconomyResult {
  if (!validCost(amount)) return { ok: false, state, reason: "invalid-amount" };
  const balance = Math.max(0, state.coins?.[kidId] ?? 0);
  if (balance < amount) return { ok: false, state, reason: "insufficient-funds" };
  return {
    ok: true,
    state: amount === 0 ? state : { ...state, coins: { ...state.coins, [kidId]: balance - amount } },
  };
}
