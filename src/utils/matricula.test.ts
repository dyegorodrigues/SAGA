import { describe, it, expect } from "vitest";
import {
  MATRICULA_MAX_QUESTIONS,
  buildMatriculaLadder,
  buildMatriculaTrack,
  consumeMatriculaTerminal,
  prepareMatriculaForAnswer,
  seedFromResults,
} from "./matricula";
import { Track } from "../types";

const trk = (id: string): Track =>
  ({
    id,
    name: id,
    icon: "🔹",
    color: "#000",
    dark: "#000",
    gen: (lvl: number) => ({
      kind: "plain",
      prompt: `${id}@${lvl}`,
      big: id,
      options: [{ value: 1 }, { value: 2 }],
      answer: 1,
    }),
  } as Track);

function answerTerminal(track: Track, right: boolean) {
  const q = track.gen(1);
  prepareMatriculaForAnswer(q);
  consumeMatriculaTerminal(right);
  return q;
}

describe("Matrícula 🎒 — placement adaptativo sem grade rígida", () => {
  it("começa gentil em N1.04 e expande além do recorte recebido, sem passar do nível 3", () => {
    // Simula caller legado passando só um pequeno recorte de série.
    const ladder = buildMatriculaLadder([trk("N1.04")]);
    expect(ladder[0]).toEqual({ trackId: "N1.04", lvl: 2 });
    expect(ladder[1]).toEqual({ trackId: "N1.04", lvl: 3 });
    expect(ladder.some(step => step.trackId === "N1.10")).toBe(true);
    expect(ladder.some(step => step.trackId === "N2.01")).toBe(true);
    expect(ladder.some(step => step.trackId === "N3.09")).toBe(true);
    for (const step of ladder) expect(step.lvl).toBeLessThanOrEqual(3);
  });

  it("dois acertos terminais movem a próxima sonda para a âncora seguinte", () => {
    const { track, ladder } = buildMatriculaTrack([
      trk("N1.04"), trk("N1.10"), trk("N2.01"), trk("N3.09"), trk("N4.01"), trk("N4.05"),
    ]);
    expect(track.id).toBe("matricula");
    expect(track.totalQ).toBe(MATRICULA_MAX_QUESTIONS);
    expect(ladder).toEqual([]);

    const q1 = answerTerminal(track, true);
    const q2 = answerTerminal(track, true);
    const q3 = track.gen(1);

    expect(q1.prompt).toBe("N1.04@2");
    expect(q2.prompt).toBe("N1.04@3");
    expect(q3.prompt).toBe("N1.10@2");
    expect(ladder.slice(0, 3)).toEqual([
      { trackId: "N1.04", lvl: 2 },
      { trackId: "N1.04", lvl: 3 },
      { trackId: "N1.10", lvl: 2 },
    ]);
  });

  it("iniciante com pares fracos encerra cedo em 6 questões, sem ser empurrado para conteúdo impossível", () => {
    const { track, ladder } = buildMatriculaTrack([trk("N1.04"), trk("N1.01"), trk("N1.03")]);
    const prompts = Array.from({ length: 6 }, () => answerTerminal(track, false).prompt);

    expect(prompts.slice(0, 2)).toEqual(["N1.04@2", "N1.04@3"]);
    expect(prompts.slice(2, 4)).toEqual(["N1.01@2", "N1.01@3"]);
    expect(prompts.slice(4, 6)).toEqual(["N1.03@2", "N1.03@3"]);
    expect(track.totalQ).toBe(6);
    expect(ladder).toHaveLength(6);
  });

  it("criança que acerta continua subindo para conteúdo fora da antiga faixa", () => {
    const { track, ladder } = buildMatriculaTrack([
      trk("N1.04"), trk("N1.10"), trk("N2.01"), trk("N3.09"), trk("N4.01"),
    ]);

    for (let i = 0; i < 10; i += 1) answerTerminal(track, true);
    expect(ladder.some(step => step.trackId === "N3.09")).toBe(true);
    expect(ladder.some(step => step.trackId === "N4.01")).toBe(true);
  });

  it("semeadura usa só pares realmente respondidos e nunca concede domínio", () => {
    const ladder = [
      { trackId: "N1.04", lvl: 2 }, { trackId: "N1.04", lvl: 3 },
      { trackId: "N1.10", lvl: 2 }, { trackId: "N1.10", lvl: 3 },
      { trackId: "N2.01", lvl: 1 }, { trackId: "N2.01", lvl: 3 },
    ];
    const seeds = seedFromResults(ladder, [true, true, true, false, false, false]);

    expect(seeds["N1.04"].lvl).toBe(4);
    expect(seeds["N1.04"].maxLvl).toBe(3);
    expect(seeds["N1.10"].lvl).toBe(3);
    expect(seeds["N1.10"].maxLvl).toBe(2);
    expect(seeds["N2.01"].lvl).toBe(1);
    expect(seeds["N2.01"].maxLvl).toBe(1);
    for (const seed of Object.values(seeds)) expect(seed.dom).toBe(false);
    expect(seeds["N1.04"].lastDay).toBeTruthy();
  });

  it("nunca explode quando o recorte recebido não contém uma âncora útil", () => {
    const { track } = buildMatriculaTrack([trk("padroes")]);
    expect(track.totalQ).toBeGreaterThanOrEqual(1);
    expect(() => track.gen(1)).not.toThrow();
    expect(seedFromResults([], [])).toEqual({});
  });
});
