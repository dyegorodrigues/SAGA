import { describe, it, expect } from "vitest";
import { buildMixedQuestions, buildMixedTrack, MIXED_TOTAL } from "./mixedChallenge";
import { TRACKS_ANO1 } from "./curriculum";
import { Progress } from "../types";

const progFactory = (overrides: Partial<Record<string, Partial<Progress>>> = {}) => {
  return (tid: string): Progress => ({
    lvl: 2,
    streak: 0,
    bad: 0,
    stars: 0,
    ok: 10,
    tot: 12,
    bank: [],
    mast: 0,
    ...(overrides[tid] || {}),
  });
};

describe("Desafio Misto 👑", () => {
  it("gera 10 questões válidas mesmo sem banco de revisão", () => {
    for (let round = 0; round < 20; round++) {
      const qs = buildMixedQuestions(TRACKS_ANO1, progFactory());
      expect(qs.length).toBe(MIXED_TOTAL);
      for (const q of qs) {
        expect(typeof q.kind).toBe("string");
        if (q.options) {
          expect(Array.isArray(q.options)).toBe(true);
          if (q.kind !== "order") {
            const values = q.options.map((o: any) => o.value);
            expect(values.filter((v: any) => v === q.answer).length).toBe(1);
          }
        } else {
          expect(q.answer).toBeDefined();
        }
      }
    }
  });

  it("prioriza a trilha de pior precisão (mín. 8 respondidas)", () => {
    const targetId = TRACKS_ANO1[0].id;
    const progOf = progFactory({ [targetId]: { ok: 2, tot: 10 } });
    const marked = TRACKS_ANO1.map((t) =>
      t.id === targetId
        ? { ...t, gen: (lvl: number) => ({ ...t.gen(lvl), prompt: "PIOR_TRILHA" }) }
        : t
    );
    const qs = buildMixedQuestions(marked, progOf);
    const fromWorst = qs.filter((q) => q.prompt === "PIOR_TRILHA").length;
    expect(fromWorst).toBeGreaterThanOrEqual(3);
  });

  it("inclui questões dos bancos de revisão quando existem", () => {
    const reviewQ = {
      kind: "plain",
      prompt: "REVISAO",
      big: null,
      options: [{ label: "1", value: 1 }, { label: "2", value: 2 }],
      answer: 1,
    };
    const t1 = TRACKS_ANO1[0].id;
    const t2 = TRACKS_ANO1[1].id;
    const progOf = progFactory({
      [t1]: { bank: [{ sig: "x", hits: 0, q: reviewQ }] },
      [t2]: { bank: [{ sig: "y", hits: 0, q: reviewQ }] },
    });
    let found = 0;
    for (let round = 0; round < 10; round++) {
      const qs = buildMixedQuestions(TRACKS_ANO1, progOf);
      found += qs.filter((q) => q.prompt === "REVISAO").length;
    }
    expect(found).toBeGreaterThan(0);
  });

  it("a trilha especial tem id 'mista', 10 questões e contrato válido", () => {
    const track = buildMixedTrack(TRACKS_ANO1, progFactory());
    expect(track.id).toBe("mista");
    expect(track.totalQ).toBe(MIXED_TOTAL);
    for (let i = 0; i < MIXED_TOTAL; i++) {
      const q = track.gen(1);
      expect(q).toBeTruthy();
      if (q.options) {
        expect(Array.isArray(q.options)).toBe(true);
      } else {
        expect(q.answer).toBeDefined();
      }
    }
  });
});
