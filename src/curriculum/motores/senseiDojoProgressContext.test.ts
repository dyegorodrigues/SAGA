import { describe, expect, it, vi } from "vitest";
import type { Progress, State } from "../../types";
import { misconceptionForAnswer } from "../../components/gameloop/answerPolicy";
import { carimbar } from "../../lib/reconciliacaoDeSaves";
import { gDojoAdd } from "../fichas/dojo/sensei/dojo_add";
import { applyJourneyAnswer } from "./progressEngine";

const progress = (overrides: Partial<Progress> = {}): Progress => ({
  lvl: 1,
  maxLvl: 1,
  streak: 0,
  bad: 0,
  stars: 0,
  ok: 0,
  tot: 0,
  bank: [],
  mast: 0,
  ...overrides,
});

const state = (progressMap: Record<string, Progress>, dojoTracks: State["dojoTracks"] = {}): State => ({
  kids: [],
  progress: { kid: progressMap },
  dojoTracks,
  coins: {},
  album: {},
  log: {},
  sound: false,
});

const attempt = (q: ReturnType<typeof gDojoAdd>, right = true, durationMs = 500): Progress => {
  misconceptionForAnswer(q, right ? q.answer : "__wrong__");
  return applyJourneyAnswer(progress({ lvl: 5, maxLvl: 5, dom: true }), right, false, {
    durationMs,
    targetRtMs: (q.rt_max_s ?? 6) * 1000,
    helpUsed: false,
    isReview: false,
    practiceDay: "2026-08-08",
  }).progress;
};

function commitAttempt(current: State, q: ReturnType<typeof gDojoAdd>, right = true, durationMs = 500): State {
  const envelope = attempt(q, right, durationMs);
  return carimbar({
    ...current,
    progress: {
      ...current.progress,
      kid: { ...(current.progress.kid ?? {}), dojo_add: envelope },
    },
  }, new Date("2026-08-08T12:00:00Z"));
}

describe("Dojo Sensei — source → evento → dojoTracks", () => {
  it("uma resposta nunca vira mastery conceitual e persiste como round parcial", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.37);
    const initial = state({ "N3.01": progress({ lvl: 3, maxLvl: 3 }) });
    const saved = commitAttempt(initial, gDojoAdd(1));

    expect(saved.progress.kid.dojo_add).toBeUndefined();
    const dojo = saved.dojoTracks?.kid?.dojo_add as any;
    expect(dojo).toBeDefined();
    expect(dojo.dom).toBeUndefined();
    expect(dojo.masteryEvidence).toBeUndefined();
    expect(dojo.__senseiDojoPendingRound?.attempts).toHaveLength(1);
    expect(dojo.rounds).toBe(0);
    vi.restoreAllMocks();
  });

  it("dez respostas fecham um round e populam força de fatos", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.37);
    let saved = state({ "N3.01": progress({ lvl: 3, maxLvl: 3 }) });
    for (let i = 0; i < 10; i += 1) saved = commitAttempt(saved, gDojoAdd(1));

    const dojo = saved.dojoTracks?.kid?.dojo_add as any;
    expect(saved.progress.kid.dojo_add).toBeUndefined();
    expect(dojo.rounds).toBe(1);
    expect(dojo.attempts).toBe(10);
    expect(dojo.correct).toBe(10);
    expect(dojo.goodRounds).toBe(1);
    expect(dojo.__senseiDojoPendingRound).toBeUndefined();
    expect(Object.keys(dojo.facts ?? {}).length).toBeGreaterThan(0);
    vi.restoreAllMocks();
  });

  it("dois rounds bons avançam a prescrição sem tocar no conceito", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.37);
    const mother = progress({ lvl: 3, maxLvl: 3, tot: 7, ok: 6 });
    let saved = state({ "N3.01": mother });
    for (let i = 0; i < 20; i += 1) saved = commitAttempt(saved, gDojoAdd(1));

    const dojo = saved.dojoTracks?.kid?.dojo_add as any;
    expect(dojo.currentStep).toBe(2);
    expect(dojo.highestStep).toBe(2);
    expect(saved.progress.kid["N3.01"]).toEqual(mother);
    expect(saved.progress.kid.dojo_add).toBeUndefined();
    vi.restoreAllMocks();
  });

  it("acertar depois de erro conta recompensa, mas não fluência de primeira tentativa", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.37);
    const q = gDojoAdd(1);
    // primeira tentativa errada é retry suave no GameLoop: registra, mas ainda não fecha.
    misconceptionForAnswer(q, -999);
    // segunda tentativa correta é a terminal desta simulação.
    misconceptionForAnswer(q, q.answer);
    const envelope = applyJourneyAnswer(progress(), true, false, {
      durationMs: 400,
      targetRtMs: (q.rt_max_s ?? 6) * 1000,
      helpUsed: false,
      isReview: false,
      practiceDay: "2026-08-08",
    }).progress;
    const saved = carimbar(state({
      "N3.01": progress({ lvl: 3, maxLvl: 3 }),
      dojo_add: envelope,
    }));
    const dojo = saved.dojoTracks?.kid?.dojo_add as any;
    expect(dojo.__senseiDojoPendingRound.attempts[0].right).toBe(false);
    vi.restoreAllMocks();
  });

  it("save legado do templo migra volume/faixa/RT, mas descarta coroa conceitual", () => {
    const legacy = progress({
      lvl: 2,
      maxLvl: 2,
      tot: 44,
      ok: 39,
      rt: 1800,
      lastDay: "2026-08-01",
      dom: true,
      masteryEvidence: {
        schemaVersion: 1,
        comprehensionStreak: 3,
        independenceStreak: 3,
        fluencyStreak: 3,
        retentionPasses: 1,
        crownedBy: "legacy",
      },
    });
    const saved = carimbar(state({
      "N3.01": progress({ lvl: 3, maxLvl: 3 }),
      dojo_add: legacy,
    }));
    const dojo = saved.dojoTracks?.kid?.dojo_add as any;
    expect(saved.progress.kid.dojo_add).toBeUndefined();
    expect(dojo.currentStep).toBe(2);
    expect(dojo.attempts).toBe(44);
    expect(dojo.correct).toBe(39);
    expect(dojo.avgCorrectRtMs).toBe(1800);
    expect(dojo.mastered).toBe(false);
    expect(dojo.masteryEvidence).toBeUndefined();
  });

  it("nível servido acima do teto conceitual não gera crédito", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.37);
    const initial = state({ "N3.01": progress({ lvl: 3, maxLvl: 3 }) }); // teto da adição = 2
    const saved = commitAttempt(initial, gDojoAdd(3));
    const dojo = saved.dojoTracks?.kid?.dojo_add as any;
    expect(saved.progress.kid.dojo_add).toBeUndefined();
    expect(dojo.attempts).toBe(0);
    expect(dojo.rounds).toBe(0);
    expect(dojo.__senseiDojoPendingRound).toBeUndefined();
    vi.restoreAllMocks();
  });
});
