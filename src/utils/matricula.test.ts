import { describe, it, expect } from "vitest";
import { buildMatriculaLadder, buildMatriculaTrack, seedFromResults } from "./matricula";
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

describe("Matrícula 🎒 (E3 — placement disfarçado, GENTIL)", () => {
  it("escada GENTIL: senso numérico sonda [2,3]; operações só [1,2] (nunca nível 4)", () => {
    const ladder = buildMatriculaLadder([trk("N1.10"), trk("N1.01"), trk("padroes")]);
    // padroes não é núcleo; contar (senso) vem ANTES de soma (operação) no currículo
    expect(ladder.map((s) => `${s.trackId}:${s.lvl}`)).toEqual(["N1.01:2", "N1.01:3", "N1.10:1", "N1.10:2"]);
    // GARANTIA: nenhuma sonda passa de 3 (o iniciante nunca leva subtração/soma nível 4)
    for (const s of ladder) expect(s.lvl).toBeLessThanOrEqual(3);
  });

  it("trilha sintética serve as sondas na ordem e com questões válidas", () => {
    const { track, ladder } = buildMatriculaTrack([trk("N1.01"), trk("N1.10")]);
    expect(track.id).toBe("matricula");
    expect(track.totalQ).toBe(ladder.length);
    const seen = Array.from({ length: ladder.length }, () => track.gen(1).prompt);
    expect(seen).toEqual(["N1.01@2", "N1.01@3", "N1.10@1", "N1.10@2"]);
  });

  it("semeadura gentil: 2 acertos → H+1; só a fácil → H; nenhuma → 1; maxLvl honesto", () => {
    const ladder = buildMatriculaLadder([trk("N1.01"), trk("N1.10"), trk("N2.01")]);
    // contar[2,3]: acertou as duas · soma[1,2]: só a fácil · dezenas[1,2]: nenhuma
    const seeds = seedFromResults(ladder, [true, true, true, false, false, false]);
    expect(seeds["N1.01"].lvl).toBe(4); // H(3)+1
    expect(seeds["N1.01"].maxLvl).toBe(3);
    expect(seeds["N1.10"].lvl).toBe(2); // H(2), só a fácil
    expect(seeds["N1.10"].maxLvl).toBe(1);
    expect(seeds["N2.01"].lvl).toBe(1); // nenhuma → acolhe do zero
    expect(seeds["N2.01"].maxLvl).toBe(1);
    expect(seeds["N1.01"].tot).toBe(2);
    expect(seeds["N1.01"].ok).toBe(2);
    expect(seeds["N1.01"].lastDay).toBeTruthy();
  });

  it("nunca explode sem trilhas-núcleo", () => {
    const { track } = buildMatriculaTrack([trk("padroes")]);
    expect(track.totalQ).toBeGreaterThanOrEqual(1);
    expect(() => track.gen(1)).not.toThrow();
    expect(seedFromResults([], [])).toEqual({});
  });
});
