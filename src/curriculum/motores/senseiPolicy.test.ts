import { afterEach, describe, expect, it, vi } from "vitest";
import { Progress, Track } from "../../types";
import { ALL_MATH_TRACKS } from "./curriculum";
import {
  AULA_ADAPTIVE_MAX,
  AULA_ADAPTIVE_MIN,
  AULA_ADAPTIVE_NORMAL,
  AulaPlan,
  buildAulaTrack,
  canonicalSenseiTracks,
  getAdaptiveAulaTotal,
} from "./composer";

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

const fakeTrack = (id = "T"): Track => ({
  id,
  graphId: id,
  name: id,
  icon: "🧪",
  color: "#000",
  dark: "#000",
  gen: () => ({ kind: "plain", prompt: id, answer: 1, options: [{ label: "1", value: 1 }] }),
});

const planFor = (track: Track, resgates: AulaPlan["resgates"] = []): AulaPlan => ({
  aquecimento: track,
  fronteira: track,
  resgates,
  fluencia: null,
  fecho: null,
  resumo: "teste",
});

afterEach(() => vi.restoreAllMocks());

describe("Sensei — domínio é autoridade curricular", () => {
  it("reconstrói o universo matemático completo mesmo se o caller entregar uma faixa", () => {
    const onlyOne = ALL_MATH_TRACKS.slice(0, 1);
    const universe = canonicalSenseiTracks(onlyOne);

    expect(universe.map(track => track.id)).toEqual(ALL_MATH_TRACKS.map(track => track.id));
    expect(new Set(universe.map(track => track.id)).size).toBe(ALL_MATH_TRACKS.length);
    expect(universe.some(track => track.id === "N4.09")).toBe(true);
  });

  it("dose V1 é curta no zero absoluto", () => {
    const track = fakeTrack();
    expect(getAdaptiveAulaTotal([track], () => progress(), planFor(track))).toBe(AULA_ADAPTIVE_MIN);
  });

  it("dose V1 encurta quando há resgate conceitual", () => {
    const track = fakeTrack();
    const p = progress({ tot: 10, ok: 8, lvl: 2, maxLvl: 2 });
    const plan = planFor(track, [{ track, fromBank: false, reason: "prerequisite-gap" }]);

    expect(getAdaptiveAulaTotal([track], () => p, plan)).toBe(AULA_ADAPTIVE_MIN);
  });

  it("dose V1 mantém sessão normal durante desenvolvimento", () => {
    const track = fakeTrack();
    const p = progress({ tot: 6, ok: 4, lvl: 2, maxLvl: 2 });

    expect(getAdaptiveAulaTotal([track], () => p, planFor(track))).toBe(AULA_ADAPTIVE_NORMAL);
  });

  it("dose V1 só expande um pouco quando a fronteira está estável e sem resgate", () => {
    const track = fakeTrack();
    const p = progress({ tot: 12, ok: 11, lvl: 3, maxLvl: 3, bad: 0, bank: [] });

    expect(getAdaptiveAulaTotal([track], () => p, planFor(track))).toBe(AULA_ADAPTIVE_MAX);
  });

  it("build da Aula ignora grade: a mesma criança recebe a mesma política", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.37);
    const map = new Map<string, Progress>();
    const progOf = (id: string) => map.get(id) ?? progress();
    const inputHistoricamenteRecortado = ALL_MATH_TRACKS.slice(0, 2);

    const pre = buildAulaTrack(inputHistoricamenteRecortado, progOf, "pre");
    const ano2 = buildAulaTrack(inputHistoricamenteRecortado, progOf, "ano2");

    expect(pre.track.totalQ).toBe(ano2.track.totalQ);
    expect(pre.plan.fronteira?.id).toBe(ano2.plan.fronteira?.id);
    expect(pre.track.name).toBe("Aula do Dia");
  });
});
