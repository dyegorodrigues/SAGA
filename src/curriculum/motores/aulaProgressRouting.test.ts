import { describe, expect, it } from "vitest";
import { misconceptionForAnswer } from "../../components/gameloop/answerPolicy";
import { carimbar } from "../../lib/reconciliacaoDeSaves";
import { Progress, Question, State, Track } from "../../types";
import { applyJourneyAnswer } from "./progressEngine";
import {
  AULA_SOURCE_MARKER,
  AulaQuestion,
  beginAulaProgressSession,
  stampAulaQuestion,
} from "./aulaProgressContext";

const progress = (lvl = 1): Progress => ({
  lvl,
  maxLvl: lvl,
  streak: 0,
  bad: 0,
  stars: 0,
  ok: 0,
  tot: 0,
  bank: [],
  mast: 1,
});

const track = (id: string): Track => ({
  id,
  graphId: id,
  name: id,
  icon: "🧪",
  color: "#000",
  dark: "#000",
  gen: () => ({ kind: "plain", prompt: id, answer: "ok", options: [{ label: "ok", value: "ok" }] }),
  totalQ: 1,
});

const questionFor = (id: string, initial: Progress): Question =>
  stampAulaQuestion(
    { kind: "plain", prompt: id, answer: "ok", options: [{ label: "ok", value: "ok" }] },
    track(id),
    initial.lvl,
    initial,
  );

const stateWith = (progressMap: Record<string, Progress>): State => ({
  kids: [],
  progress: { kid: progressMap },
  dojoTracks: { kid: {} },
  coins: {},
  album: {},
  log: {},
  sound: false,
});

function answer(question: Question, synthetic: Progress): Progress {
  // Mesmo boundary do GameLoop: a policy observa a identidade da questão antes
  // de `applyJourneyAnswer`, que então precisa trabalhar no Progress-fonte.
  misconceptionForAnswer(question, question.answer as string);
  return applyJourneyAnswer(
    synthetic,
    true,
    false,
    {
      durationMs: 500,
      targetRtMs: 1000,
      helpUsed: false,
      isReview: false,
      practiceDay: "2026-08-08",
      previousPracticeDay: synthetic.lastDay,
    },
  ).progress;
}

describe("auditoria longitudinal — roteamento de progresso da Aula do Dia", () => {
  it("questão prescrita pelo Sensei carrega identidade curricular explícita", () => {
    beginAulaProgressSession();
    const q = questionFor("N1.07", progress(3)) as AulaQuestion;
    expect(q.sourceTrackId).toBe("N1.07");
    expect(q.sourceGraphId).toBe("N1.07");
    expect(q.sourceLevel).toBe(3);
  });

  it("duas competências consecutivas não compartilham streak, tot ou nível", () => {
    beginAulaProgressSession();
    const n107Initial = progress(3);
    const gm02Initial = progress(1);
    const syntheticAula = progress(5);

    const n107Commit = answer(questionFor("N1.07", n107Initial), syntheticAula);
    expect((n107Commit as Progress & { [AULA_SOURCE_MARKER]?: string })[AULA_SOURCE_MARKER]).toBe("N1.07");

    let state = carimbar(stateWith({
      "N1.07": n107Initial,
      "GM.02": gm02Initial,
      aula: n107Commit,
    }));

    expect(state.progress.kid.aula).toBeUndefined();
    expect(state.progress.kid["N1.07"]).toMatchObject({ lvl: 3, tot: 1, ok: 1, streak: 1 });
    expect(state.progress.kid["GM.02"]).toMatchObject({ lvl: 1, tot: 0, ok: 0, streak: 0 });

    const gm02Commit = answer(questionFor("GM.02", gm02Initial), syntheticAula);
    state = carimbar({
      ...state,
      progress: { ...state.progress, kid: { ...state.progress.kid, aula: gm02Commit } },
    });

    expect(state.progress.kid.aula).toBeUndefined();
    expect(state.progress.kid["N1.07"]).toMatchObject({ lvl: 3, tot: 1, ok: 1, streak: 1 });
    expect(state.progress.kid["GM.02"]).toMatchObject({ lvl: 1, tot: 1, ok: 1, streak: 1 });
  });

  it("repetir o mesmo source na missão continua do snapshot já materializado", () => {
    beginAulaProgressSession();
    const initial = progress(2);
    const syntheticAula = progress(5);

    const first = answer(questionFor("N1.07", initial), syntheticAula);
    let state = carimbar(stateWith({ "N1.07": initial, aula: first }));
    expect(state.progress.kid["N1.07"].tot).toBe(1);

    // O segundo stamp recebe deliberadamente o snapshot VELHO. O registro da
    // sessão deve preferir o commit anterior e chegar a tot=2, não reiniciar.
    const second = answer(questionFor("N1.07", initial), syntheticAula);
    state = carimbar({
      ...state,
      progress: { ...state.progress, kid: { ...state.progress.kid, aula: second } },
    });

    expect(state.progress.kid["N1.07"]).toMatchObject({ tot: 2, ok: 2, streak: 2 });
    expect(state.progress.kid.aula).toBeUndefined();
  });

  it("save sintético antigo sem marcador é descartado, não vira evidência curricular", () => {
    beginAulaProgressSession();
    const oldSynthetic = { ...progress(5), tot: 99, ok: 99, dom: true };
    const state = carimbar(stateWith({ aula: oldSynthetic }));
    expect(state.progress.kid.aula).toBeUndefined();
    expect(Object.keys(state.progress.kid)).toEqual([]);
  });
});
