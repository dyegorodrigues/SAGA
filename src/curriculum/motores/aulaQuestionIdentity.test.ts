import { describe, expect, it } from "vitest";
import type { Progress, Question, Track } from "../../types";
import { evaluateSpacedRepetition } from "./radarEngine";
import { resolveQuestionCurricularIdentity } from "./aulaQuestionIdentity";
import { stampAulaQuestion } from "./aulaProgressContext";

const progress = (overrides: Partial<Progress> = {}): Progress => ({
  lvl: 3,
  maxLvl: 3,
  streak: 0,
  bad: 0,
  stars: 0,
  ok: 0,
  tot: 0,
  bank: [],
  mast: 0,
  ...overrides,
});

const track = (id: string, graphId = id): Track => ({
  id,
  graphId,
  name: id,
  icon: "🧪",
  color: "#000",
  dark: "#000",
  gen: () => ({ kind: "plain", prompt: id, answer: 1, options: [{ label: "1", value: 1 }] }),
});

const q: Question = {
  kind: "plain",
  prompt: "teste",
  answer: 1,
  options: [{ label: "1", value: 1 }],
};

describe("Aula composta — identidade curricular única", () => {
  it("questão comum continua usando a própria trilha", () => {
    const p = progress({ lvl: 2 });
    expect(resolveQuestionCurricularIdentity(track("N1.02"), q, p)).toEqual({
      trackId: "N1.02",
      graphId: "N1.02",
      level: 2,
    });
  });

  it("questão composta usa source e preserva aula apenas como contexto de sessão", () => {
    const source = track("GM.02", "GM.02");
    const p = progress({ lvl: 4 });
    const stamped = stampAulaQuestion(q, source, 4, p);

    expect(resolveQuestionCurricularIdentity(track("aula"), stamped, p)).toEqual({
      trackId: "GM.02",
      graphId: "GM.02",
      level: 4,
      sessionTrackId: "aula",
    });
  });

  it("Leitner aplicado sob a identidade-fonte atualiza força e data da competência real", () => {
    const source = track("N1.07");
    const p = progress({ reviewForce: 2, lastDay: "2026-08-01" });
    const stamped = stampAulaQuestion(q, source, 3, p);
    const identity = resolveQuestionCurricularIdentity(track("aula"), stamped, p);
    const map = { [identity.trackId]: p };

    const result = evaluateSpacedRepetition("kid", identity.trackId, true, 500, map, 1000);

    expect(result.newForce).toBe(3);
    expect(map["N1.07"].reviewForce).toBe(3);
    expect(map["N1.07"].lastDay).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect((map as Record<string, Progress>).aula).toBeUndefined();
  });
});
