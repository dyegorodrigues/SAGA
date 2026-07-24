import { describe, it, expect } from "vitest";
import { TRACKS_MUNDO_PRE, TRACKS_MUNDO_ANO1, gMundoLugar } from "./mundo";
const ALL = [...TRACKS_MUNDO_PRE, ...TRACKS_MUNDO_ANO1];
describe("Meu Mundo 🌍 — contrato do gerador", () => {
  for (const track of ALL) {
    for (const lvl of [1, 2, 3, 4, 5]) {
      it(`${track.id} nível ${lvl}: 60 questões válidas`, () => {
        for (let i = 0; i < 60; i++) {
          const q = track.gen(lvl);
          const ctx = `[${track.id} lvl ${lvl}] ${JSON.stringify(q)}`;
          expect(typeof q.kind, ctx).toBe("string");
          // cenas (daypart/emotion/order/nest) usam `big`; groups (Muito ou Pouco) não
          if (q.kind !== "groups") expect(q.big, ctx).toBeTruthy();
          expect(Array.isArray(q.options), ctx).toBe(true);
          expect(q.options.length, ctx).toBeGreaterThanOrEqual(2);
          const vals = q.options.map((o) => o.value);
          expect(new Set(vals).size, `dup ${ctx}`).toBe(vals.length);
          if (q.kind === "order") {
            const ans = q.answer as any[];
            expect(Array.isArray(ans), `order array ${ctx}`).toBe(true);
            expect([...ans].sort().join(","), `order permutação ${ctx}`).toBe([...vals].sort().join(","));
          } else {
            expect(vals.filter((v) => v === q.answer).length, `answer única ${ctx}`).toBe(1);
          }
        }
      });
    }
  }
});

describe("Meu Lugar no Mundo 🌎 — viagem narrada (composição)", () => {
  const SLOTS = ["casa", "bairro", "cidade", "estado", "brasil", "americasul", "mundo", "terra"];
  const tamanhoViagem: Record<number, number> = { 1: 2, 2: 3, 3: 3, 4: 3, 5: 4 };
  it("todo nível é journey; a viagem tem paradas válidas e termina no lugar da resposta", () => {
    for (let i = 0; i < 250; i++) {
      const lvl = 1 + (i % 5);
      const q = gMundoLugar(lvl);
      const ctx = JSON.stringify(q);
      expect(q.kind, ctx).toBe("journey");
      // a viagem existe, tem o tamanho do nível e paradas bem formadas
      const j = q.journey!;
      expect(Array.isArray(j), `journey array ${ctx}`).toBe(true);
      expect(j.length, `tamanho da viagem ${ctx}`).toBe(tamanhoViagem[lvl]);
      for (const stop of j) {
        expect(SLOTS.includes(stop.slot), `slot conhecido ${ctx}`).toBe(true);
        expect(typeof stop.label === "string" && stop.label.length > 0, `label ${ctx}`).toBe(true);
        expect(typeof stop.say === "string" && stop.say.length > 0, `say ${ctx}`).toBe(true);
      }
      // a viagem termina exatamente no lugar que a pergunta cobra
      const target = j[j.length - 1].slot;
      expect(q.answer, `resposta = fim da viagem ${ctx}`).toBe(target);
      expect(q.big, `big = alvo ${ctx}`).toBe(target);
      // a resposta está nas opções, uma única vez, e não há distrator sinônimo (mundo↔terra)
      const vals = q.options.map((o) => o.value);
      expect(vals.filter((v) => v === q.answer).length, `answer única ${ctx}`).toBe(1);
      if (target === "terra") expect(vals.includes("mundo"), `sem sinônimo ${ctx}`).toBe(false);
      if (target === "mundo") expect(vals.includes("terra"), `sem sinônimo ${ctx}`).toBe(false);
      expect(q.prompt, ctx).toBeTruthy();
      expect(q.explain, ctx).toBeTruthy();
    }
  });
});
