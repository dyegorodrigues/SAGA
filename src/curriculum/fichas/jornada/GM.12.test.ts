import { describe, expect, it } from "vitest";
import { Composer } from "../../Composer";
import { GM_12 } from "./GM.12";

describe("GM.12/F50 — contrato de voz e tutorial por linguagem", () => {
  it("L1 ensina a balança antes de exigir a leitura do prato", () => {
    const q = Composer.generate(GM_12, 1);
    expect(q.kind).toBe("medidas");
    expect(q.howto).toContain("balança");
    expect(q.explain).toContain("balança");
    expect(q.tutorial?.length).toBeGreaterThanOrEqual(2);
    expect(q.tutorial?.some(p => (p.show as { destacarCerto?: boolean } | undefined)?.destacarCerto)).toBe(true);
  });

  it("L2 ensina capacidade e dispara a verificação por recipientes iguais", () => {
    const q = Composer.generate(GM_12, 2);
    expect(q.kind).toBe("medidas");
    expect(q.howto).toContain("cheios");
    expect(q.explain).toContain("recipientes iguais");
    expect(q.tutorial?.some(p => (p.show as { verificar?: boolean } | undefined)?.verificar)).toBe(true);
    expect((q.uiProps as { modo?: string }).modo).toBe("capacidade");
  });

  it("L3 não herda fala de balança diante de recipientes", () => {
    const q = Composer.generate(GM_12, 3);
    expect(q.howto).not.toContain("balança");
    expect(q.explain).toContain("formato");
  });
});
