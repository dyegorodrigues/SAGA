import { describe, it, expect } from "vitest";
import { TRACKS_SCI_PRE, TRACKS_SCI_ANO1, gSciVivo } from "./sci";

const ALL = [...TRACKS_SCI_PRE, ...TRACKS_SCI_ANO1];

describe("Ciências 🔬 — contrato do gerador", () => {
  for (const track of ALL) {
    for (const lvl of [1, 2, 3, 4, 5]) {
      it(`${track.id} nível ${lvl}: 60 questões válidas`, () => {
        for (let i = 0; i < 60; i++) {
          const q = track.gen(lvl);
          const ctx = `[${track.id} lvl ${lvl}] ${JSON.stringify(q)}`;
          expect(Array.isArray(q.options), ctx).toBe(true);
          expect(q.options.length, ctx).toBeGreaterThanOrEqual(2);
          const values = q.options.map((o) => o.value);
          expect(new Set(values).size, `opções duplicadas ${ctx}`).toBe(values.length);
          if (q.kind === "order") {
            const ans = q.answer as any[];
            expect(Array.isArray(ans), `order answer array ${ctx}`).toBe(true);
            expect(new Set(ans).size, `order sem repetição ${ctx}`).toBe(ans.length);
            expect([...ans].sort().join(","), `order = permutação das opções ${ctx}`).toBe([...values].sort().join(","));
          } else {
            expect(values.filter((v) => v === q.answer).length, `resposta única ${ctx}`).toBe(1);
          }
        }
      });
    }
  }
});

describe("Vivo ou Não-Vivo — a resposta bate com a categoria pedida", () => {
  // seres vivos (bichos + plantas, incluindo as que mais confundem)
  const VIVOS = ["🐶", "🐱", "🌳", "🌻", "🐟", "🦋", "🐘", "🌸", "🐰", "🐦", "🌵", "🌷"];
  // objetos + coisas da natureza que se movem mas não têm vida (nuvem, rio, sol...)
  const NAO_VIVOS = ["🪨", "🚗", "⚽", "🪑", "📱", "🧱", "🥄", "🚲", "🧸", "✏️", "☁️", "🌊", "🏔️", "🌬️", "☀️", "🌙", "💧"];
  // categorias das habilidades reorganizadas (régua anti-exaustão)
  const PRECISA = ["🍎", "💧", "☀️", "💨"];
  const JA_FOI = ["🪵", "🍂", "🪶", "🐚", "🦴"];
  it("cada nível responde na categoria certa da sua habilidade (300 questões)", () => {
    for (let i = 0; i < 300; i++) {
      const q = gSciVivo(1 + (i % 5));
      const p = q.prompt || "";
      if (p.includes("PRECISA")) expect(PRECISA.includes(q.answer as string), JSON.stringify(q)).toBe(true);
      else if (p.includes("JÁ FOI")) expect(JA_FOI.includes(q.answer as string), JSON.stringify(q)).toBe(true);
      else if (p.includes("TEM VIDA")) expect(VIVOS.includes(q.answer as string), JSON.stringify(q)).toBe(true);
      else expect(NAO_VIVOS.includes(q.answer as string), JSON.stringify(q)).toBe(true);
      expect(q.explain, "vivo/morto sempre explica o porquê").toBeTruthy();
    }
  });
});
