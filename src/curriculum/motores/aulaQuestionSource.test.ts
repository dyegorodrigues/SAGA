import { describe, expect, it } from "vitest";
import { Progress, Question, Track } from "../../types";
import { composeAula } from "./composer";
import { AulaQuestion } from "./aulaProgressContext";

const p = (lvl: number, tot = 10, ok = 9): Progress => ({
  lvl,
  maxLvl: lvl,
  streak: 0,
  bad: 0,
  stars: 0,
  ok,
  tot,
  bank: [],
  mast: 1,
});

const q = (label: string): Question => ({
  kind: "plain",
  prompt: label,
  answer: "ok",
  options: [
    { label: "ok", value: "ok" },
    { label: "não", value: "não" },
  ],
});

const mkTrack = (id: string, graphId?: string): Track => ({
  id,
  graphId,
  name: id,
  icon: "🧪",
  color: "#000",
  dark: "#000",
  gen: (lvl: number) => q(`${id}-L${lvl}-${Math.random()}`),
  totalQ: 10,
});

describe("auditoria longitudinal — identidade das questões da Minha Aula", () => {
  it("carimba todos os blocos com a trilha que realmente gerou a questão", () => {
    const base = mkTrack("N1.01", "N1.01");
    const fechamento = mkTrack("padroes");
    const progress = new Map<string, Progress>([
      ["N1.01", p(3)],
      ["padroes", p(2, 2, 2)],
    ]);

    const { qs } = composeAula(
      [base, fechamento],
      id => progress.get(id) ?? p(1, 0, 0),
      8,
    );

    expect(qs.length).toBeGreaterThan(0);
    const sources = new Set<string>();
    for (const question of qs as AulaQuestion[]) {
      expect(question.sourceTrackId).toBeTruthy();
      expect(question.sourceTrackId).not.toBe("aula");
      expect(["N1.01", "padroes"]).toContain(question.sourceTrackId);
      sources.add(question.sourceTrackId!);
    }

    // O fecho lúdico precisa manter sua própria identidade e não herdar a da
    // fronteira só porque todos aparecem dentro da mesma missão visual.
    expect(sources.has("N1.01")).toBe(true);
    expect(sources.has("padroes")).toBe(true);
  });
});