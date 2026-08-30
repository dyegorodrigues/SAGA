import { describe, expect, it } from "vitest";
import { canUseLegacyState, stateKeyForUid, destinoDoProgresso } from "./storageIdentity";

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

describe("destinoDoProgresso — o que a criança conquistou precisa ter onde ficar", () => {
  it("com conta, o progresso é da conta", () => {
    expect(destinoDoProgresso({ uid: "abc", visitante: false, e2e: false })).toBe("conta");
    // Sessão anônima do Firebase também é conta: tem UID, tem nuvem.
    expect(destinoDoProgresso({ uid: "abc", visitante: true, e2e: false })).toBe("conta");
  });

  it("sem conta, o visitante grava local", () => {
    // Este é o caso que sumia. O pai toca em "Começar sem Conta", cria a
    // criança, ela joga — e sem esta linha nada disso sobrevive ao fechamento.
    expect(destinoDoProgresso({ uid: null, visitante: true, e2e: false })).toBe("local");
  });

  it("sem conta e sem escolha, não se grava nada", () => {
    // A tela de login é a única situação assim. Gravar ali vazaria estado de
    // uma sessão para a seguinte.
    expect(destinoDoProgresso({ uid: null, visitante: false, e2e: false })).toBe("nenhum");
  });

  it("o gancho de teste grava local sem depender de escolha", () => {
    expect(destinoDoProgresso({ uid: null, visitante: false, e2e: true })).toBe("local");
  });
});
