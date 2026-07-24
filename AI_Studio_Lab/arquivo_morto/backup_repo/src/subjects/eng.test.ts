import { describe, it, expect } from "vitest";
import { TRACKS_ENG_PRE, TRACKS_ENG_ANO1 } from "./eng";

const ALL = [...TRACKS_ENG_PRE, ...TRACKS_ENG_ANO1];

describe("Inglês 🇺🇸 — contrato + fala em inglês", () => {
  for (const track of ALL) {
    for (const lvl of [1, 2, 3, 4, 5]) {
      it(`${track.id} nível ${lvl}: 60 questões válidas e em en-US`, () => {
        for (let i = 0; i < 60; i++) {
          const q = track.gen(lvl);
          const ctx = `[${track.id} lvl ${lvl}] ${JSON.stringify(q)}`;
          // toda questão de inglês precisa falar inglês
          expect(q.lang, ctx).toBe("en-US");
          expect(Array.isArray(q.options), ctx).toBe(true);
          expect(q.options.length, ctx).toBeGreaterThanOrEqual(2);
          const values = q.options.map((o) => o.value);
          expect(new Set(values).size, `opções duplicadas ${ctx}`).toBe(values.length);
          expect(values.filter((v) => v === q.answer).length, `resposta única ${ctx}`).toBe(1);
          // a fala (story) contém a palavra-alvo em inglês, não vazia
          expect((q.story || "").length, ctx).toBeGreaterThan(0);
        }
      });
    }
  }
});
