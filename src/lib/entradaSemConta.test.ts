import { describe, expect, it, vi } from "vitest";
import { entrarSemConta, recadoDaEntradaLocal } from "./entradaSemConta";

/**
 * O recibo vermelho foi visual: no navegador real, tocar em "Começar sem Conta"
 * não abria nada. O botão chamava a sessão anônima do Firebase e ficava
 * pendurado; o `onContinueAsVisitor` — o caminho local, pronto e funcionando —
 * era prop passada e nunca chamada.
 */
describe("entrar sem conta", () => {
  const jaAgora = (fn: () => void) => fn();

  it("com nuvem respondendo, a sessão anônima vale", async () => {
    const resultado = await entrarSemConta(async () => ({ email: "visitante" }), 6000, () => undefined);
    expect(resultado).toEqual({ via: "nuvem", email: "visitante" });
  });

  it("com a nuvem muda, a criança entra local em vez de esperar para sempre", async () => {
    // Uma promessa que nunca resolve é exatamente o que uma rede ruim produz.
    const nuncaResponde = () => new Promise<{ email: string }>(() => {});
    const resultado = await entrarSemConta(nuncaResponde, 10, jaAgora);
    expect(resultado).toEqual({ via: "local", porque: "sem-resposta" });
  });

  it("com a nuvem falhando, a criança entra local", async () => {
    const falha = async () => { throw new Error("network"); };
    const resultado = await entrarSemConta(falha, 6000, () => undefined);
    expect(resultado).toEqual({ via: "local", porque: "falhou" });
  });

  it("o recado nunca trata jogar offline como erro", () => {
    for (const porque of ["sem-resposta", "falhou"] as const) {
      const recado = recadoDaEntradaLocal(porque);
      expect(recado.toLowerCase()).not.toContain("erro");
      expect(recado.toLowerCase()).not.toContain("ops");
      expect(recado).toContain("jogar");
    }
  });

  it("a sessão anônima é sempre tentada: a nuvem some se ninguém a chamar", async () => {
    const espiao = vi.fn(async () => ({ email: "visitante" }));
    await entrarSemConta(espiao, 6000, () => undefined);
    expect(espiao).toHaveBeenCalledTimes(1);
  });
});
