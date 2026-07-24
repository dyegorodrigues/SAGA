import { describe, it, expect } from "vitest";
import { TRACKS_LOGICA_ANO1, gLogicaDetetive } from "./logica";
import { CATS } from "../utils/generators";

describe("Detetive Lógico 🕵️ — contrato do gerador", () => {
  for (const lvl of [1, 2, 3, 4, 5]) {
    it(`nível ${lvl}: 60 questões válidas`, () => {
      for (let i = 0; i < 60; i++) {
        const q = gLogicaDetetive(lvl);
        const ctx = `[detetive lvl ${lvl}] ${JSON.stringify(q)}`;
        expect(typeof q.kind, ctx).toBe("string");
        expect(Array.isArray(q.options), ctx).toBe(true);
        expect(q.options.length, ctx).toBeGreaterThanOrEqual(2);
        const values = q.options.map((o) => o.value);
        expect(new Set(values).size, `opções duplicadas ${ctx}`).toBe(values.length);
        expect(values.filter((v) => v === q.answer).length, `resposta única ${ctx}`).toBe(1);
      }
    });
  }
});

describe("Detetive Lógico — o intruso é realmente de outra categoria", () => {
  const categoriaDe = (emoji: string) =>
    Object.keys(CATS).filter((k) => CATS[k].includes(emoji));

  it("N1: a resposta pertence a uma categoria diferente das outras 3 (150 questões)", () => {
    for (let i = 0; i < 150; i++) {
      const q = gLogicaDetetive(1);
      const outros = q.options.map((o) => o.value as string).filter((v) => v !== q.answer);
      // todas as outras 3 compartilham uma categoria que o intruso NÃO tem
      const catsComuns = outros
        .map(categoriaDe)
        .reduce((acc, cur) => acc.filter((c) => cur.includes(c)));
      const catsIntruso = categoriaDe(q.answer as string);
      expect(catsComuns.length, JSON.stringify(q)).toBeGreaterThan(0);
      expect(catsComuns.some((c) => catsIntruso.includes(c)), `intruso na mesma categoria ${JSON.stringify(q)}`).toBe(false);
    }
  });
});

describe("Detetive Lógico — a trilha", () => {
  it("está registrada com id e prereqs", () => {
    const t = TRACKS_LOGICA_ANO1[0];
    expect(t.id).toBe("detetive");
    expect(t.prereqs).toContain("padroes");
  });
});
