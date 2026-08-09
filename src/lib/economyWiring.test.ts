import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const appSource = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");

describe("Wiring econômico do App", () => {
  it("perfil/companheiro usa transação atômica em vez de clamp silencioso", () => {
    expect(appSource).toContain("applyKidPurchase(state, kidId, updatedKid, coinsToSpend)");
    expect(appSource).not.toMatch(/Math\.max\(0,\s*currentCoins\s*-\s*coinsToSpend\)/);
  });

  it("álbum compra por boundary único e duplicata não é montada direto no App", () => {
    expect(appSource).toContain("purchaseAlbumItem(state, kidId, id, cost)");
    expect(appSource).not.toContain("[...albumOf(screen.kid!), id]");
  });

  it("gasto genérico usa o mesmo boundary de saldo insuficiente", () => {
    expect(appSource).toContain("spendCoins(state, kidId, amt)");
    expect(appSource).not.toMatch(/Math\.max\(0,\s*currentCoins\s*-\s*amt\)/);
  });
});
