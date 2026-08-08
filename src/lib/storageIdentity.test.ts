import { describe, expect, it } from "vitest";
import { canUseLegacyState, stateKeyForUid } from "./storageIdentity";

describe("P20 — identidade do save local", () => {
  it("separa a chave local por Firebase UID", () => {
    expect(stateKeyForUid("uid-a")).toBe("mk-state-v1:uid-a");
    expect(stateKeyForUid("uid-b")).not.toBe(stateKeyForUid("uid-a"));
    expect(() => stateKeyForUid(" ")).toThrow(/UID vazio/);
  });

  it("chave legada já reivindicada não cruza para outra conta", () => {
    const legacy = { kids: [{ id: "k1" }] };
    expect(canUseLegacyState("uid-b", "uid-a", legacy, null)).toBe(false);
    expect(canUseLegacyState("uid-a", "uid-a", legacy, null)).toBe(true);
  });

  it("sem dono, cloud e legado com famílias diferentes não são misturados", () => {
    expect(canUseLegacyState(
      "uid-a", null,
      JSON.stringify({ kids: [{ id: "local-kid" }] }),
      { kids: [{ id: "cloud-kid" }] },
    )).toBe(false);
  });

  it("mesmo kid.id reconhece legado e cloud como a mesma família", () => {
    expect(canUseLegacyState(
      "uid-a", null,
      { kids: [{ id: "same" }] },
      { kids: [{ id: "same" }, { id: "new" }] },
    )).toBe(true);
  });
});
