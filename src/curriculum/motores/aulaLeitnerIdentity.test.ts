import { describe, expect, it } from "vitest";
import type { Progress, Question, State, Track } from "../../types";
import { misconceptionForAnswer } from "../../components/gameloop/answerPolicy";
import { carimbar } from "../../lib/reconciliacaoDeSaves";
import { applyJourneyAnswer } from "./progressEngine";
import { evaluateSpacedRepetition } from "./radarEngine";
import { beginAulaProgressSession, stampAulaQuestion } from "./aulaProgressContext";

const progress = (): Progress => ({
  lvl: 3,
  maxLvl: 3,
  streak: 0,
  bad: 0,
  stars: 0,
  ok: 4,
  tot: 4,
  bank: [],
  mast: 0,
  reviewForce: 2,
  lastDay: "2026-08-01",
});

const track: Track = {
  id: "N1.07",
  graphId: "N1.07",
  name: "N1.07",
  icon: "🧪",
  color: "#000",
  dark: "#000",
  gen: () => ({ kind: "plain", prompt: "teste", answer: 1, options: [{ label: "1", value: 1 }] }),
};

const stateWith = (source: Progress, aula: Progress): State => ({
  kids: [],
  progress: { kid: { "N1.07": source, aula } },
  dojoTracks: { kid: {} },
  coins: {},
  album: {},
  log: {},
  sound: false,
});

describe("Aula composta — Leitner materializa no source real", () => {
  it("o uso histórico da chave temporária aula não cria reviewForce sintético persistido", () => {
    beginAulaProgressSession();
    const initial = progress();
    const q = stampAulaQuestion(
      {
        kind: "plain",
        prompt: "teste",
        answer: 1,
        options: [{ label: "1", value: 1 }],
        review: true,
        sig: "sig-source",
      } as Question,
      track,
      3,
      initial,
    );

    // Mesmo boundary do GameLoop: answerPolicy prepara o source antes do engine.
    misconceptionForAnswer(q, q.answer as number);
    const routed = applyJourneyAnswer(
      progress(),
      true,
      false,
      {
        durationMs: 500,
        targetRtMs: 1000,
        helpUsed: false,
        isReview: true,
        practiceDay: "2026-08-09",
        previousPracticeDay: initial.lastDay,
      },
    ).progress;

    // Replica a chamada atual do GameLoop. Apesar da chave transitória `aula`,
    // `routed` é o objeto-fonte marcado e será materializado no source real.
    evaluateSpacedRepetition("kid", "aula", true, 500, { aula: routed }, 1000);
    const state = carimbar(stateWith(initial, routed));

    expect(state.progress.kid.aula).toBeUndefined();
    expect(state.progress.kid["N1.07"].reviewForce).toBe(3);
    expect(state.progress.kid["N1.07"].lastDay).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
