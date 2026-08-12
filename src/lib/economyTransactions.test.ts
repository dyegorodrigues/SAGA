import { describe, expect, it } from "vitest";
import type { State } from "../types";
import { applyKidPurchase, purchaseAlbumItem, spendCoins } from "./economyTransactions";

const baseState = (): State => ({
  schemaVersion: 1,
  kids: [{ id: "kid", name: "Ana", avatar: "🦊", grade: "ano1", theme: "classico", petEnergy: 50 }],
  progress: { kid: {} },
  dojoTracks: { kid: {} },
  coins: { kid: 10 },
  album: { kid: [] },
  log: { kid: [] },
  sound: true,
  customTracks: [],
});

describe("Economia — boundary atômico", () => {
  it("saldo insuficiente rejeita compra inteira sem mutar perfil", () => {
    const before = baseState();
    const updatedKid = { ...before.kids[0], petEnergy: 100 };
    const result = applyKidPurchase(before, "kid", updatedKid, 11);

    expect(result.ok).toBe(false);
    expect(result.state).toBe(before);
    expect(result.state.coins.kid).toBe(10);
    expect(result.state.kids[0].petEnergy).toBe(50);
  });

  it("compra válida debita exatamente uma vez e aplica a mutação", () => {
    const before = baseState();
    const updatedKid = { ...before.kids[0], petEnergy: 75 };
    const result = applyKidPurchase(before, "kid", updatedKid, 2);

    expect(result.ok).toBe(true);
    expect(result.state.coins.kid).toBe(8);
    expect(result.state.kids[0].petEnergy).toBe(75);
    expect(before.coins.kid).toBe(10);
  });

  it("colecionável já possuído não cobra outra vez", () => {
    const before = baseState();
    before.album.kid = ["floresta-0"];
    const result = purchaseAlbumItem(before, "kid", "floresta-0", 10);

    expect(result.ok).toBe(false);
    expect(result.state).toBe(before);
    expect(result.state.coins.kid).toBe(10);
    expect(result.state.album.kid).toEqual(["floresta-0"]);
  });

  it("compra de álbum válida é imutável e atômica", () => {
    const before = baseState();
    const result = purchaseAlbumItem(before, "kid", "floresta-0", 10);

    expect(result.ok).toBe(true);
    expect(result.state.coins.kid).toBe(0);
    expect(result.state.album.kid).toEqual(["floresta-0"]);
    expect(before.coins.kid).toBe(10);
    expect(before.album.kid).toEqual([]);
  });

  it("gasto genérico nunca deixa saldo negativo e rejeita valores inválidos", () => {
    const before = baseState();
    expect(spendCoins(before, "kid", 11)).toMatchObject({ ok: false, reason: "insufficient-funds" });
    expect(spendCoins(before, "kid", -1)).toMatchObject({ ok: false, reason: "invalid-amount" });
    expect(spendCoins(before, "kid", 3.5)).toMatchObject({ ok: false, reason: "invalid-amount" });
    expect(spendCoins(before, "kid", 10).state.coins.kid).toBe(0);
  });
});
