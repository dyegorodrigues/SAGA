import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { chaveDaFala } from "./chaveDaFala";
import { caminhoDaVoz, carregarVozes, esquecerVozes, temVozNativa, vozesCarregadas } from "./vozNativa";

describe("a voz que vai junto com o app", () => {
  beforeEach(() => { esquecerVozes(); });
  afterEach(() => { vi.unstubAllGlobals(); esquecerVozes(); });

  it("o nome do arquivo é o da chave da fala", () => {
    expect(caminhoDaVoz("Muito bem!")).toContain(`${chaveDaFala("Muito bem!")}.m4a`);
    expect(caminhoDaVoz("Muito bem!")).toContain("/vozes/");
  });

  it("reconhece a fala que está no pacote", async () => {
    vi.stubGlobal("fetch", async () => ({ ok: true, json: async () => [chaveDaFala("Muito bem!")] }));
    await carregarVozes();
    expect(vozesCarregadas()).toBe(1);
    expect(temVozNativa("Muito bem!")).toBe(true);
    // Emoji não muda a fala, então não pode mudar o arquivo.
    expect(temVozNativa("Muito bem! 🎉")).toBe(true);
    expect(temVozNativa("Olha de novo!")).toBe(false);
  });

  it("pacote ausente não derruba a fala — cai na voz do aparelho", async () => {
    vi.stubGlobal("fetch", async () => { throw new Error("sem rede"); });
    await expect(carregarVozes()).resolves.toBeInstanceOf(Set);
    expect(vozesCarregadas()).toBe(0);
    expect(temVozNativa("Muito bem!")).toBe(false);
  });

  it("índice quebrado não derruba a fala", async () => {
    vi.stubGlobal("fetch", async () => ({ ok: true, json: async () => ({ nao: "é lista" }) }));
    await carregarVozes();
    expect(vozesCarregadas()).toBe(0);
  });

  it("carrega uma vez só, mesmo com muita gente pedindo junto", async () => {
    let chamadas = 0;
    vi.stubGlobal("fetch", async () => { chamadas += 1; return { ok: true, json: async () => [] }; });
    await Promise.all([carregarVozes(), carregarVozes(), carregarVozes()]);
    expect(chamadas).toBe(1);
  });

  it("antes de carregar, nada é dado por gravado", () => {
    expect(temVozNativa("Muito bem!")).toBe(false);
  });
});
