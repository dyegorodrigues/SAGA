import { describe, expect, it } from "vitest";
import type { DojoTrackState, Progress } from "../../types";
import { prescribeSenseiDojo } from "./senseiDojoPrescription";
import { freshSenseiDojoState } from "./senseiDojoEngine";

const p = (level: number): Progress => ({
  lvl: level,
  maxLvl: level,
  streak: 0,
  bad: 0,
  stars: 0,
  ok: 0,
  tot: 0,
  bank: [],
  mast: 0,
});

const addUnlocked = (): Record<string, Progress> => ({
  "N3.01": p(3),
});

const saved = (over: Partial<DojoTrackState> = {}): DojoTrackState => ({
  ...freshSenseiDojoState(true),
  ...over,
});

describe("Sensei → prescrição do Dojo", () => {
  it("não prescreve operação que o conceito ainda não liberou", () => {
    expect(prescribeSenseiDojo({}, {}, "2026-08-08")).toBeNull();
  });

  it("templo recém-liberado vira round curto, sem sorteio", () => {
    const prescription = prescribeSenseiDojo(addUnlocked(), {}, "2026-08-08");
    expect(prescription).toMatchObject({
      temple: { id: "dojo_add" },
      step: 1,
      maxEligibleStep: 2,
      reason: "fluency-gap",
    });
  });

  it("fato fraco tem prioridade sobre mero atraso de faixa", () => {
    const dojoTracks = {
      dojo_add: saved({
        currentStep: 2,
        highestStep: 2,
        rounds: 3,
        lastDay: "2026-08-01",
        facts: {
          "dojo_add:2:3": {
            fact_id: "dojo_add:2:3",
            forca: 1,
            rt_medio: 4000,
            ultima_vez: "2026-08-01",
            erros_seguidos: 2,
          },
        },
      }),
    };
    const prescription = prescribeSenseiDojo(addUnlocked(), dojoTracks, "2026-08-08");
    expect(prescription?.reason).toBe("weak-items");
    expect(prescription?.weakItems).toBe(1);
  });

  it("não prescreve duas vezes no mesmo dia", () => {
    const dojoTracks = {
      dojo_add: saved({ currentStep: 1, highestStep: 1, lastDay: "2026-08-08" }),
    };
    expect(prescribeSenseiDojo(addUnlocked(), dojoTracks, "2026-08-08")).toBeNull();
  });

  it("refresca fluência estável após quatro dias", () => {
    const dojoTracks = {
      dojo_add: saved({
        currentStep: 2,
        highestStep: 2,
        rounds: 8,
        lastDay: "2026-08-04",
      }),
    };
    const prescription = prescribeSenseiDojo(addUnlocked(), dojoTracks, "2026-08-08");
    expect(prescription?.reason).toBe("refresh");
    expect(prescription?.daysSincePractice).toBe(4);
  });

  it("subtração não vence adição por acaso: prioridade vem do estado", () => {
    const progress = {
      ...addUnlocked(),
      "N3.02": p(3),
    };
    const dojoTracks = {
      dojo_add: saved({ currentStep: 2, highestStep: 2, rounds: 4, lastDay: "2026-08-07" }),
      dojo_sub: saved({ currentStep: 1, highestStep: 1, rounds: 1, lastDay: "2026-08-01" }),
    };
    const prescription = prescribeSenseiDojo(progress, dojoTracks, "2026-08-08");
    expect(prescription?.temple.id).toBe("dojo_sub");
  });
});
