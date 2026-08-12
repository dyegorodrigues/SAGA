import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Progress, State } from "../../types";
import { ALL_MATH_TRACKS } from "./curriculum";
import { planAula } from "./composer";
import { applyJourneyAnswer } from "./progressEngine";
import { mixedEligibleTracks } from "./mixedChallenge";
import { RadarEngine } from "./radarEngine";
import { MisconceptionTag } from "../../constants/misconceptions";
import { seedFromResults } from "../../utils/matricula";
import { defaultState, migrate } from "../../utils/migrator";

const P0: Progress = {
  lvl: 1,
  maxLvl: 1,
  streak: 0,
  bad: 0,
  stars: 0,
  ok: 0,
  tot: 0,
  bank: [],
  mast: 0,
};

const progress = (over: Partial<Progress> = {}): Progress => ({ ...P0, ...over });
const progOf = (map: Record<string, Progress>) => (id: string) => map[id] ?? progress();
const mastered = (): Progress => progress({
  lvl: 5,
  maxLvl: 5,
  dom: true,
  ok: 12,
  tot: 12,
  reviewForce: 5,
});

const realTracks = () => ALL_MATH_TRACKS.filter(track => track.contentStatus !== "fallback");
const masteryAttempt = (practiceDay: string, durationMs = 1200) => ({
  durationMs,
  targetRtMs: 1000,
  helpUsed: false,
  isReview: false,
  practiceDay,
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-08-09T12:00:00.000Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("Simulação longitudinal do Sensei", () => {
  it("iniciante absoluto recebe uma fronteira real e ensinável", () => {
    const plan = planAula(ALL_MATH_TRACKS, progOf({}));

    expect(plan.fronteira).not.toBeNull();
    expect(plan.fronteira?.contentStatus).not.toBe("fallback");
    expect(plan.fronteira?.prereqs ?? []).toHaveLength(0);
  });

  it("não entra em beco sem saída quando todo conteúdo servido anterior já foi dominado", () => {
    const map: Record<string, Progress> = {};
    for (const track of realTracks()) map[track.id] = mastered();

    const plan = planAula(ALL_MATH_TRACKS, progOf(map));

    // Fallback não ensina nem produz evidência curricular. Se ele virar a
    // fronteira dominante, o próximo reload escolherá o mesmo placeholder e a
    // criança pode ficar presa indefinidamente sem uma fábrica curricular pronta.
    expect(plan.fronteira).not.toBeNull();
    expect(plan.fronteira?.contentStatus).not.toBe("fallback");
  });

  it("reload por migrate/JSON preserva a decisão do Sensei para o mesmo learner state", () => {
    const map: Record<string, Progress> = {
      "N1.01": mastered(),
      "N1.02": mastered(),
      "N1.03": progress({ lvl: 2, maxLvl: 2, ok: 5, tot: 8, reviewForce: 5 }),
    };
    const before = planAula(ALL_MATH_TRACKS, progOf(map));

    const state = defaultState() as State;
    state.progress = { kid: map };
    const restored = migrate(JSON.parse(JSON.stringify(state)), "2026-08-09");
    const after = planAula(ALL_MATH_TRACKS, progOf(restored.progress.kid));

    expect(after.fronteira?.id).toBe(before.fronteira?.id);
    expect(after.resgates.map(r => [r.track.id, r.reason])).toEqual(
      before.resgates.map(r => [r.track.id, r.reason]),
    );
  });

  it("ritmo típico tolera erro isolado e só avança após nova sequência conceitual", () => {
    let p = progress({ lvl: 1, maxLvl: 1 });
    for (const right of [true, true, false, true, true, true]) {
      p = applyJourneyAnswer(p, right, false, masteryAttempt("2026-08-09")).progress;
    }

    expect(p.lvl).toBe(2);
    expect(p.maxLvl).toBe(2);
    expect(p.dom).toBeFalsy();
    expect(p.bad).toBe(0);
  });

  it("acerto conceitual lento progride a escada exatamente como acerto rápido", () => {
    const run = (durationMs: number): Progress => {
      let p = progress({ lvl: 1, maxLvl: 1 });
      for (let i = 0; i < 3; i += 1) {
        p = applyJourneyAnswer(p, true, false, masteryAttempt("2026-08-09", durationMs)).progress;
      }
      return p;
    };

    const fast = run(300);
    const slow = run(8000);
    expect(fast.lvl).toBe(2);
    expect(slow.lvl).toBe(2);
    expect(slow.dom).toBeFalsy();
  });

  it("alta facilidade chega ao nível 5, mas domínio exige confirmação em sessão espaçada", () => {
    let p = progress({ lvl: 1, maxLvl: 1 });

    // Quatro degraus × três acertos: chega ao nível 5, ainda sem coroa.
    for (let i = 0; i < 12; i += 1) {
      p = applyJourneyAnswer(p, true, false, masteryAttempt("2026-08-09", 300)).progress;
    }
    expect(p.lvl).toBe(5);
    expect(p.dom).toBeFalsy();

    // Primeira sessão madura no nível 5.
    for (let i = 0; i < 3; i += 1) {
      p = applyJourneyAnswer(p, true, false, masteryAttempt("2026-08-09", 300)).progress;
    }
    expect(p.masteryEvidence?.passedSessionDays).toEqual(["2026-08-09"]);
    expect(p.dom).toBeFalsy();

    // No mesmo dia não compra uma segunda sessão.
    for (let i = 0; i < 3; i += 1) {
      p = applyJourneyAnswer(p, true, false, masteryAttempt("2026-08-09", 300)).progress;
    }
    expect(p.masteryEvidence?.passedSessionDays).toEqual(["2026-08-09"]);
    expect(p.dom).toBeFalsy();

    // Dois dias depois, nova evidência independente pode coroar.
    for (let i = 0; i < 3; i += 1) {
      p = applyJourneyAnswer(p, true, false, masteryAttempt("2026-08-11", 300)).progress;
    }
    expect(p.dom).toBe(true);
    expect(p.masteryEvidence?.crownedBy).toBe("multidimensional");
    expect(p.masteryEvidence?.passedSessionDays).toEqual(["2026-08-09", "2026-08-11"]);
  });

  it("esquecimento/retorno agenda revisão por dia civil e volta a espaçar após acerto", () => {
    const pMap: Record<string, Progress> = {
      "N1.01": progress({
        lvl: 3,
        maxLvl: 3,
        ok: 8,
        tot: 10,
        lastDay: "2026-08-08",
        reviewForce: 1,
      }),
    };

    expect(RadarEngine.getDueReviews(pMap, "2026-08-09")).toContain("N1.01");

    const review = RadarEngine.evaluateSpacedRepetition("kid", "N1.01", true, 500, pMap, 1000);
    expect(review.newForce).toBe(2);
    expect(pMap["N1.01"].lastDay).toBe("2026-08-09");
    expect(RadarEngine.getDueReviews(pMap, "2026-08-10")).not.toContain("N1.01");
    expect(RadarEngine.getDueReviews(pMap, "2026-08-11")).toContain("N1.01");
  });

  it("Oficina direta bem-sucedida precisa ter saída na sessão seguinte", () => {
    const root = realTracks().find(track => !(track.prereqs?.length));
    expect(root).toBeDefined();

    const p = progress({ lvl: 1, maxLvl: 1, ok: 1, tot: 4 });
    RadarEngine.trackMisconception(p, MisconceptionTag.OFF_BY_ONE);
    vi.advanceTimersByTime(1000);
    RadarEngine.trackMisconception(p, MisconceptionTag.OFF_BY_ONE);

    const map: Record<string, Progress> = { [root!.id]: p };
    const before = planAula(ALL_MATH_TRACKS, progOf(map));
    const rescue = before.resgates.find(r => r.track.id === root!.id && r.reason === "misconception");
    expect(rescue).toBeDefined();

    let recovered = map[root!.id];
    while ((recovered.maxLvl || recovered.lvl) < rescue!.requiredLevel!) {
      recovered = applyJourneyAnswer(
        recovered,
        true,
        false,
        masteryAttempt("2026-08-09"),
        { kind: "rescue", requiredLevel: rescue!.requiredLevel },
      ).progress;
    }
    recovered.rescueAttempts = 0;
    map[root!.id] = recovered;

    const after = planAula(ALL_MATH_TRACKS, progOf(map));
    expect(after.resgates.some(r => r.track.id === root!.id && r.reason === "misconception")).toBe(false);
  });

  it("Misto só cresce com repertório conceitualmente dominado e realmente praticado", () => {
    const explicit = realTracks().slice(0, 3);
    expect(explicit).toHaveLength(3);
    const map: Record<string, Progress> = {
      [explicit[0].id]: mastered(),
      [explicit[1].id]: progress({ lvl: 5, maxLvl: 5, ok: 20, tot: 20, dom: false }),
      [explicit[2].id]: progress({ lvl: 5, maxLvl: 5, ok: 0, tot: 0, dom: true }),
    };

    expect(mixedEligibleTracks(ALL_MATH_TRACKS, progOf(map)).map(t => t.id)).toEqual([explicit[0].id]);

    map[explicit[1].id] = mastered();
    expect(mixedEligibleTracks(ALL_MATH_TRACKS, progOf(map)).map(t => t.id)).toEqual([
      explicit[0].id,
      explicit[1].id,
    ]);
  });

  it("Matrícula semeia nível inicial, mas nunca transforma placement em domínio", () => {
    const seeds = seedFromResults(
      [
        { trackId: "N1.04", lvl: 2 },
        { trackId: "N1.04", lvl: 3 },
      ],
      [true, true],
    );

    expect(seeds["N1.04"]).toMatchObject({ lvl: 4, maxLvl: 3, ok: 2, tot: 2, dom: false });
  });
});
