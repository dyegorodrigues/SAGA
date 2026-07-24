import { describe, it, expect } from "vitest";
import { TRACKS_MAT_ELITE_PRE, TRACKS_MAT_ELITE_ANO1, gMatBond, gMatTenFrame, gMatOlho } from "./matElite";

const ALL = [...TRACKS_MAT_ELITE_PRE, ...TRACKS_MAT_ELITE_ANO1];

describe("Matemática de elite — contrato do gerador", () => {
  for (const track of ALL) {
    for (const lvl of [1, 2, 3, 4, 5]) {
      it(`${track.id} nível ${lvl}: 60 questões válidas`, () => {
        for (let i = 0; i < 60; i++) {
          const q = track.gen(lvl);
          const ctx = `[${track.id} lvl ${lvl}] ${JSON.stringify(q)}`;
          expect(Array.isArray(q.options), ctx).toBe(true);
          const values = q.options.map((o) => o.value);
          expect(new Set(values).size, `opções duplicadas ${ctx}`).toBe(values.length);
          expect(values.filter((v) => v === q.answer).length, `resposta única ${ctx}`).toBe(1);
          if (typeof q.answer === "number") expect(q.answer, ctx).toBeGreaterThanOrEqual(0);
        }
      });
    }
  }
});

describe("Amigos dos Números 🤝 — CONCRETO na moldura + explica o porquê", () => {
  it("N1-N4: cheias + resposta = 10 (os amigos do 10) e traz explicação (200 questões)", () => {
    for (let i = 0; i < 200; i++) {
      const lvl = 1 + (i % 4);
      const q = gMatBond(lvl);
      expect(q.kind, "concreto na moldura").toBe("tenframe");
      expect((q.n as number) + (q.answer as number), JSON.stringify(q)).toBe(10);
      expect(q.explain, "todo Amigo ensina o porquê").toBeTruthy();
      expect(q.howto, "todo Amigo diz como fazer").toBeTruthy();
    }
  });
  it("N5: a estratégia de fazer 10 dá a soma e atravessa a dezena (100 questões)", () => {
    for (let i = 0; i < 100; i++) {
      const q = gMatBond(5);
      expect((q.n as number) + (q.u as number)).toBe(q.answer);
      expect(q.answer as number, "soma atravessa a dezena").toBeGreaterThan(10);
      expect(q.explain).toBeTruthy();
    }
  });
});

describe("Olhômetro 👀 — subitização por flash", () => {
  // faixas subitizáveis de propósito (subitização real é pequena)
  const FAIXA: Record<number, [number, number]> = { 1: [1, 3], 2: [2, 4], 3: [3, 5], 4: [4, 6], 5: [5, 8] };
  it("kind flash, resposta = n, dentro da faixa do nível, com como/porquê (250 questões)", () => {
    for (let i = 0; i < 250; i++) {
      const lvl = 1 + (i % 5);
      const q = gMatOlho(lvl);
      const ctx = JSON.stringify(q);
      expect(q.kind, ctx).toBe("flash");
      expect(q.answer, ctx).toBe(q.n);
      expect(q.emoji, ctx).toBeTruthy();
      const [lo, hi] = FAIXA[lvl];
      expect(q.n as number, `dentro da faixa ${ctx}`).toBeGreaterThanOrEqual(lo);
      expect(q.n as number, `dentro da faixa ${ctx}`).toBeLessThanOrEqual(hi);
      expect(q.howto, ctx).toBeTruthy();
      expect(q.explain, ctx).toBeTruthy();
    }
  });
});

describe("Moldura de 10 🔟 — foco em ENXERGAR a quantidade", () => {
  it("a resposta é sempre o que se vê, com explicação (250 questões)", () => {
    for (let i = 0; i < 250; i++) {
      const lvl = 1 + (i % 5);
      const q = gMatTenFrame(lvl);
      expect(q.answer).toBe(q.n);
      expect(q.explain).toBeTruthy();
    }
  });
});
