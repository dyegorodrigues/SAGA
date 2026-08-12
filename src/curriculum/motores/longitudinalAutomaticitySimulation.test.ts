import { describe, expect, it } from "vitest";
import type { AulaPlan } from "./composer";
import type { DojoTrackState, Progress, State } from "../../types";
import { ALL_MATH_TRACKS } from "./curriculum";
import {
  applySenseiDojoRound,
  freshSenseiDojoState,
  SENSEI_DOJO_ROUND_ITENS,
  type SenseiDojoAttempt,
} from "./senseiDojoEngine";
import { prescribeSenseiDojo } from "./senseiDojoPrescription";
import { JARDIM } from "../fichas/dojo/jardim";
import { applyJardimRound, type JardimAttempt } from "./jardimEngine";
import { prescribeCausalJardim } from "./jardimCausalPrescription";
import { chooseSenseiEntry } from "./senseiOrchestrator";
import { defaultState, migrate } from "../../utils/migrator";

const progress = (over: Partial<Progress> = {}): Progress => ({
  lvl: 1,
  maxLvl: 1,
  streak: 0,
  bad: 0,
  stars: 0,
  ok: 0,
  tot: 0,
  bank: [],
  mast: 0,
  ...over,
});

const dojoAttempts = (right = 10, fluent = 10): SenseiDojoAttempt[] =>
  Array.from({ length: SENSEI_DOJO_ROUND_ITENS }, (_, index) => ({
    right: index < right,
    durationMs: index < fluent ? 900 : 4000,
    targetRtMs: 2000,
    itemId: `add:${index % 3}`,
    itemKind: "fact" as const,
  }));

const gardenAttempts = (right: number, fluent: number): JardimAttempt[] =>
  Array.from({ length: 6 }, (_, index) => ({
    right: index < right,
    durationMs: index < fluent ? 700 : 3500,
    targetRtMs: 1500,
    ...(index >= right ? { misconception: "erro-jd" } : {}),
  }));

describe("Simulação longitudinal — automaticidade separada", () => {
  it("Dojo livre fortalece fatos sem mover o ponteiro; no dia seguinte o Sensei ainda prescreve a lacuna", () => {
    const concepts: Record<string, Progress> = {
      "N3.01": progress({ lvl: 3, maxLvl: 3, ok: 12, tot: 15 }),
    };
    const snapshot = JSON.parse(JSON.stringify(concepts));

    const initial = prescribeSenseiDojo(concepts, {}, "2026-08-09");
    expect(initial?.temple.id).toBe("dojo_add");
    // N3.01 em nível conceitual 3 libera as faixas 1 e 2. Como o ponteiro
    // adaptativo nasce na 1, a prioridade correta é fechar a lacuna de fluência
    // antes da categoria genérica "newly-unlocked".
    expect(initial?.reason).toBe("fluency-gap");
    expect(initial?.maxEligibleStep).toBe(2);

    let state = freshSenseiDojoState(true);
    state = applySenseiDojoRound(state, dojoAttempts(), 1, 2, "2026-08-09", false).state;
    state = applySenseiDojoRound(state, dojoAttempts(), 1, 2, "2026-08-09", false).state;

    expect(state.currentStep).toBe(1);
    expect(state.rounds).toBe(2);
    expect(Object.values(state.facts ?? {}).some(item => item.forca > 0)).toBe(true);
    expect(concepts).toEqual(snapshot);

    const nextDay = prescribeSenseiDojo(concepts, { dojo_add: state }, "2026-08-10");
    expect(nextDay?.temple.id).toBe("dojo_add");
    expect(nextDay?.reason).toBe("fluency-gap");
    expect(nextDay?.step).toBe(1);
  });

  it("Dojo prescrito pode avançar apenas seu próprio currentStep e some da rota quando a lacuna fecha", () => {
    const concepts: Record<string, Progress> = {
      "N3.01": progress({ lvl: 3, maxLvl: 3, ok: 12, tot: 15 }),
    };
    const snapshot = JSON.parse(JSON.stringify(concepts));
    let state = freshSenseiDojoState(true);

    state = applySenseiDojoRound(state, dojoAttempts(), 1, 2, "2026-08-10", true).state;
    const advanced = applySenseiDojoRound(state, dojoAttempts(), 1, 2, "2026-08-10", true);

    expect(advanced.outcome).toBe("advance");
    expect(advanced.state.currentStep).toBe(2);
    expect(advanced.state.highestStep).toBe(2);
    expect(concepts).toEqual(snapshot);
    expect(prescribeSenseiDojo(concepts, { dojo_add: advanced.state }, "2026-08-10")).toBeNull();
    expect(prescribeSenseiDojo(concepts, { dojo_add: advanced.state }, "2026-08-11")).toBeNull();
  });

  it("Jardim só entra com fraqueza observada e sai quando rounds reais recuperam a automaticidade", () => {
    const trail = JARDIM[0];
    expect(trail).toBeDefined();
    const mother = ALL_MATH_TRACKS.find(track => (track.graphId || track.id) === trail.mae);
    expect(mother).toBeDefined();

    const motherProgress = progress({
      lvl: Math.max(3, trail.destravaNoNivel),
      maxLvl: Math.max(3, trail.destravaNoNivel),
      ok: 12,
      tot: 15,
    });
    const progressByTrack: Record<string, Progress> = { [trail.mae]: motherProgress };
    const plan: AulaPlan = {
      aquecimento: mother!,
      fronteira: mother!,
      resgates: [{
        track: mother!,
        fromBank: false,
        reason: "misconception",
        sourceNodeId: trail.mae,
        requiredLevel: Math.min(5, motherProgress.lvl + 1),
        questionBudget: 4,
      }],
      fluencia: null,
      fecho: null,
      resumo: "simulação",
    };

    expect(prescribeCausalJardim(plan, progressByTrack, {})).toBeNull();

    let jd: DojoTrackState = {
      ...freshSenseiDojoState(true),
      family: "JD",
      weakRounds: 1,
      rounds: 1,
      attempts: 6,
      correct: 3,
    };
    const prescribed = prescribeCausalJardim(plan, progressByTrack, { [trail.ficha.id]: jd });
    expect(prescribed?.trailId).toBe(trail.ficha.id);

    const conceptSnapshot = JSON.parse(JSON.stringify(progressByTrack));
    jd = applyJardimRound(jd as any, gardenAttempts(6, 6), "2026-08-10").state;
    jd = applyJardimRound(jd as any, gardenAttempts(6, 6), "2026-08-10").state;

    expect(jd.currentStep).toBe(2);
    expect(jd.highestStep).toBe(2);
    expect(progressByTrack).toEqual(conceptSnapshot);
    expect(prescribeCausalJardim(plan, progressByTrack, { [trail.ficha.id]: jd })).toBeNull();
  });

  it("pré-requisito conceitual bloqueante continua vencendo Jardim já elegível", () => {
    const track = ALL_MATH_TRACKS.find(t => t.contentStatus !== "fallback")!;
    const plan: AulaPlan = {
      aquecimento: track,
      fronteira: track,
      resgates: [{
        track,
        fromBank: false,
        reason: "prerequisite-gap",
        sourceNodeId: "source",
        requiredLevel: 3,
        questionBudget: 4,
      }],
      fluencia: null,
      fecho: null,
      resumo: "simulação",
    };
    const garden = {
      trailId: "JD-X",
      motherId: "mother",
      motherName: "Base",
      sourceNodeId: "source",
      causalDistance: 1,
      step: 1,
      questionBudget: 6,
      track,
      reason: "known-perceptual-weakness" as const,
      reasonText: "fraqueza conhecida",
    };

    const entry = chooseSenseiEntry(plan, garden);
    expect(entry.kind).toBe("rescue");
    if (entry.kind === "rescue") expect(entry.rescue.reason).toBe("prerequisite-gap");
  });

  it("persistir e recarregar preserva a próxima prescrição sem misturar conceito e Dojo", () => {
    const concepts: Record<string, Progress> = {
      "N3.01": progress({ lvl: 3, maxLvl: 3, ok: 12, tot: 15 }),
    };
    let dojo = freshSenseiDojoState(true);
    dojo = applySenseiDojoRound(dojo, dojoAttempts(), 1, 2, "2026-08-09", false).state;
    dojo = applySenseiDojoRound(dojo, dojoAttempts(), 1, 2, "2026-08-09", false).state;

    const before = prescribeSenseiDojo(concepts, { dojo_add: dojo }, "2026-08-10");
    expect(before).not.toBeNull();

    const raw = defaultState() as State;
    raw.kids = [{ id: "kid", name: "Kid", avatar: "🦊", grade: "ano1", theme: "classico" }];
    raw.progress = { kid: concepts };
    raw.dojoTracks = { kid: { dojo_add: dojo } };
    const restored = migrate(JSON.parse(JSON.stringify(raw)), "2026-08-10");

    expect(restored.progress.kid["N3.01"]).toEqual(concepts["N3.01"]);
    expect(restored.dojoTracks?.kid?.dojo_add).toEqual(dojo);
    const after = prescribeSenseiDojo(
      restored.progress.kid,
      restored.dojoTracks?.kid ?? {},
      "2026-08-10",
    );
    expect(after?.temple.id).toBe(before?.temple.id);
    expect(after?.reason).toBe(before?.reason);
    expect(after?.step).toBe(before?.step);
    expect(after?.maxEligibleStep).toBe(before?.maxEligibleStep);
  });
});
