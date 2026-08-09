import { describe, it, expect } from "vitest";
import {
  buildMixedQuestions,
  buildMixedTrack,
  canBuildMixedChallenge,
  canonicalMixedUniverse,
  mixedEligibleTracks,
  MIXED_MIN_ELIGIBLE_TRACKS,
  MIXED_TOTAL,
} from "../curriculum/motores/mixedChallenge";
import { ALL_MATH_TRACKS, TRACKS_ANO1 } from "../curriculum/motores/curriculum";
import { Progress, Track } from "../types";

const baseProgress = (): Progress => ({
  lvl: 2,
  maxLvl: 2,
  streak: 0,
  bad: 0,
  stars: 0,
  ok: 10,
  tot: 12,
  bank: [],
  mast: 0,
  dom: false,
});

const progFactory = (overrides: Partial<Record<string, Partial<Progress>>> = {}) => {
  return (tid: string): Progress => ({
    ...baseProgress(),
    ...(overrides[tid] || {}),
  });
};

const explicitAno1 = TRACKS_ANO1.filter(t => t.contentStatus !== "fallback");
const eligibleIds = explicitAno1.slice(0, 4).map(t => t.id);
const mastered = (extra: Partial<Record<string, Partial<Progress>>> = {}) => progFactory({
  ...Object.fromEntries(eligibleIds.map(id => [id, { dom: true, tot: 12, ok: 10 }])),
  ...extra,
});

describe("Desafio Misto 👑 — repertório elegível", () => {
  it("expande um recorte antigo de série para o universo matemático canônico", () => {
    const universe = canonicalMixedUniverse(TRACKS_ANO1);
    expect(universe.map(t => t.id)).toEqual(ALL_MATH_TRACKS.map(t => t.id));
  });

  it("inclui somente conteúdo real, praticado e conceitualmente dominado", () => {
    const inside = explicitAno1[0];
    const onlyUnlocked = explicitAno1[1];
    const neverPracticed = explicitAno1[2];
    const oldGradeIds = new Set(TRACKS_ANO1.map(t => t.id));
    const outsideOldGrade = ALL_MATH_TRACKS.find(t => !oldGradeIds.has(t.id) && t.contentStatus !== "fallback");
    expect(outsideOldGrade).toBeTruthy();

    const progOf = progFactory({
      [inside.id]: { dom: true, tot: 12 },
      [onlyUnlocked.id]: { dom: false, maxLvl: 5, lvl: 5, tot: 30 },
      [neverPracticed.id]: { dom: true, tot: 0 },
      [outsideOldGrade!.id]: { dom: true, tot: 20 },
    });

    const ids = mixedEligibleTracks(TRACKS_ANO1, progOf).map(t => t.id);
    expect(ids).toContain(inside.id);
    expect(ids).toContain(outsideOldGrade!.id);
    expect(ids).not.toContain(onlyUnlocked.id);
    expect(ids).not.toContain(neverPracticed.id);
  });

  it("só libera o Misto quando há pelo menos duas competências elegíveis", () => {
    const first = explicitAno1[0];
    expect(MIXED_MIN_ELIGIBLE_TRACKS).toBe(2);
    expect(canBuildMixedChallenge(TRACKS_ANO1, progFactory({
      [first.id]: { dom: true, tot: 12 },
    }))).toBe(false);

    expect(canBuildMixedChallenge(TRACKS_ANO1, progFactory({
      [explicitAno1[0].id]: { dom: true, tot: 12 },
      [explicitAno1[1].id]: { dom: true, tot: 12 },
    }))).toBe(true);
  });

  it("gera 10 questões válidas quando há repertório conquistado", () => {
    const progOf = mastered();
    for (let round = 0; round < 10; round++) {
      const qs = buildMixedQuestions(TRACKS_ANO1, progOf);
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

  it("prioriza a pior precisão apenas dentro do repertório elegível", () => {
    const targetId = eligibleIds[0];
    const ineligibleId = explicitAno1.find(t => !eligibleIds.includes(t.id))!.id;
    const progOf = mastered({
      [targetId]: { dom: true, ok: 2, tot: 10 },
      [ineligibleId]: { dom: false, ok: 0, tot: 20 },
    });
    const marked = TRACKS_ANO1.map((t): Track =>
      t.id === targetId
        ? { ...t, gen: (lvl: number) => ({ ...t.gen(lvl), prompt: "PIOR_ELEGIVEL" }) }
        : t.id === ineligibleId
          ? { ...t, gen: (lvl: number) => ({ ...t.gen(lvl), prompt: "PIOR_INELEGIVEL" }) }
          : t
    );
    const qs = buildMixedQuestions(marked, progOf);
    expect(qs.filter(q => q.prompt === "PIOR_ELEGIVEL").length).toBeGreaterThanOrEqual(3);
    expect(qs.some(q => q.prompt === "PIOR_INELEGIVEL")).toBe(false);
  });

  it("banco de competência não elegível não entra no desafio", () => {
    const reviewEligible = {
      kind: "plain",
      prompt: "REVISAO_ELEGIVEL",
      options: [{ label: "1", value: 1 }, { label: "2", value: 2 }],
      answer: 1,
    };
    const reviewIneligible = { ...reviewEligible, prompt: "REVISAO_INELEGIVEL" };
    const ineligibleId = explicitAno1.find(t => !eligibleIds.includes(t.id))!.id;
    const progOf = mastered({
      [eligibleIds[0]]: { dom: true, bank: [{ sig: "ok", hits: 0, q: reviewEligible }] },
      [ineligibleId]: { dom: false, bank: [{ sig: "nao", hits: 0, q: reviewIneligible }] },
    });

    let eligibleSeen = 0;
    let ineligibleSeen = 0;
    for (let round = 0; round < 10; round++) {
      const qs = buildMixedQuestions(TRACKS_ANO1, progOf);
      eligibleSeen += qs.filter(q => q.prompt === "REVISAO_ELEGIVEL").length;
      ineligibleSeen += qs.filter(q => q.prompt === "REVISAO_INELEGIVEL").length;
    }
    expect(eligibleSeen).toBeGreaterThan(0);
    expect(ineligibleSeen).toBe(0);
  });

  it("pool insuficiente não fabrica conteúdo arbitrário e a rota sintética fica neutra", () => {
    const onlyOne = progFactory({
      [explicitAno1[0].id]: { dom: true, tot: 12 },
    });
    expect(buildMixedQuestions(TRACKS_ANO1, onlyOne)).toEqual([]);

    const track = buildMixedTrack(TRACKS_ANO1, onlyOne);
    expect(track.totalQ).toBe(1);
    const q = track.gen(1);
    expect(q.isFallback).toBe(true);
    expect(q.prompt).toMatch(/abre quando você dominar pelo menos duas habilidades/i);
  });

  it("a trilha especial disponível mantém id mista e 10 questões", () => {
    const track = buildMixedTrack(TRACKS_ANO1, mastered());
    expect(track.id).toBe("mista");
    expect(track.totalQ).toBe(MIXED_TOTAL);
    for (let i = 0; i < MIXED_TOTAL; i++) {
      expect(track.gen(1).isFallback).not.toBe(true);
    }
  });
});
