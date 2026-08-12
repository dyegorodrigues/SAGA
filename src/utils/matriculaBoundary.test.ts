import { describe, expect, it } from "vitest";
import type { Progress, Track } from "../types";
import { misconceptionForAnswer } from "../components/gameloop/answerPolicy";
import { applyJourneyAnswer } from "../curriculum/motores/progressEngine";
import { buildMatriculaTrack } from "./matricula";

const trk = (id: string): Track => ({
  id,
  name: id,
  icon: "🔹",
  color: "#000",
  dark: "#000",
  gen: (lvl: number) => ({
    kind: "plain",
    prompt: `${id}@${lvl}`,
    options: [{ value: 1 }, { value: 2 }],
    answer: 1,
  }),
} as Track);

const progress = (): Progress => ({
  lvl: 1,
  maxLvl: 1,
  streak: 0,
  bad: 0,
  stars: 0,
  ok: 0,
  tot: 0,
  bank: [],
  mast: 0,
});

const attempt = () => ({
  durationMs: 800,
  helpUsed: false,
  isReview: false,
  practiceDay: "2026-08-09",
});

describe("Matrícula — boundary real answerPolicy → progressEngine → próxima sonda", () => {
  it("só o terminal conta: retry intermediário não avança a sessão", () => {
    const { track } = buildMatriculaTrack([trk("N1.04"), trk("N1.10")]);
    const q1 = track.gen(1);
    expect(q1.prompt).toBe("N1.04@2");

    // Tentativa intermediária: prepara contexto, mas não atravessa progressEngine.
    misconceptionForAnswer(q1, 2);
    misconceptionForAnswer(q1, 1);
    const first = applyJourneyAnswer(progress(), true, false, attempt());

    const q2 = track.gen(1);
    expect(q2.prompt).toBe("N1.04@3");

    misconceptionForAnswer(q2, 1);
    applyJourneyAnswer(first.progress, true, false, attempt());

    const q3 = track.gen(1);
    expect(q3.prompt).toBe("N1.10@2");
  });
});
