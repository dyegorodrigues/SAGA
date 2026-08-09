import { describe, expect, it } from "vitest";
import type { AulaPlan, RescuePlanItem } from "./composer";
import type { DojoTrackState, Progress, Track } from "../../types";
import {
  hasKnownJardimWeakness,
  prerequisiteDistance,
  prescribeCausalJardim,
} from "./jardimCausalPrescription";

const track = (id: string): Track => ({
  id,
  graphId: id,
  name: id,
  icon: "🧪",
  color: "#000",
  dark: "#000",
  gen: () => ({ kind: "plain", prompt: id, answer: 1, options: [{ label: "1", value: 1 }] }),
});

const progress = (lvl = 3, maxLvl = lvl): Progress => ({
  lvl, maxLvl, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0,
});

const rescue = (
  id: string,
  reason: RescuePlanItem["reason"] = "misconception",
  sourceNodeId = id,
): RescuePlanItem => ({
  track: track(id),
  fromBank: false,
  reason,
  sourceNodeId,
  requiredLevel: 3,
  questionBudget: 4,
});

const plan = (resgates: RescuePlanItem[]): AulaPlan => ({
  aquecimento: track("N1.01"),
  fronteira: track("N3.07"),
  resgates,
  fluencia: null,
  fecho: null,
  resumo: "teste",
});

const weakJardim = (overrides: Partial<DojoTrackState> = {}): DojoTrackState => ({
  unlocked: true,
  mastered: false,
  family: "JD",
  currentStep: 2,
  highestStep: 3,
  rounds: 2,
  attempts: 16,
  correct: 10,
  goodRounds: 0,
  weakRounds: 0,
  ...overrides,
});

describe("Sensei — Jardim causal", () => {
  it("mede distância no DAG sem inventar uma segunda árvore curricular", () => {
    expect(prerequisiteDistance("N3.07", "N1.11")).toBe(1);
    expect(prerequisiteDistance("N3.07", "N1.08")).toBe(2);
    expect(prerequisiteDistance("N3.07", "GE.01")).toBeNull();
  });

  it("não chama ausência de treino de fraqueza perceptual", () => {
    expect(hasKnownJardimWeakness({
      unlocked: true,
      mastered: false,
      family: "JD",
      currentStep: 1,
      highestStep: 1,
      rounds: 0,
      attempts: 0,
      correct: 0,
      goodRounds: 0,
      weakRounds: 0,
    })).toBe(false);
  });

  it("reconhece round fraco, recuo ou precisão observada baixa como evidência", () => {
    expect(hasKnownJardimWeakness(weakJardim({ weakRounds: 1, currentStep: 2, highestStep: 2 }))).toBe(true);
    expect(hasKnownJardimWeakness(weakJardim({ currentStep: 2, highestStep: 3, attempts: 0, correct: 0 }))).toBe(true);
    expect(hasKnownJardimWeakness(weakJardim({ currentStep: 1, highestStep: 1, attempts: 8, correct: 5 }))).toBe(true);
    expect(hasKnownJardimWeakness(weakJardim({ mastered: true }))).toBe(false);
  });

  it("não regride para Jardim só porque surgiu uma misconception simbólica", () => {
    const prescription = prescribeCausalJardim(
      plan([rescue("N3.07", "misconception", "N3.07")]),
      { "N1.11": progress(3) },
      {},
    );
    expect(prescription).toBeNull();
  });

  it("prescreve a base JD mais próxima quando ela já mostrou fraqueza real", () => {
    const prescription = prescribeCausalJardim(
      plan([rescue("N3.07", "misconception", "N3.07")]),
      {
        "N1.11": progress(3),
        "N1.10": progress(3),
        "N1.08": progress(3),
      },
      {
        JD3: weakJardim({ currentStep: 2, highestStep: 3 }),
        JD2: weakJardim({ currentStep: 1, highestStep: 2 }),
      },
    );

    expect(prescription?.trailId).toBe("JD3");
    expect(prescription?.motherId).toBe("N1.11");
    expect(prescription?.sourceNodeId).toBe("N3.07");
    expect(prescription?.causalDistance).toBe(1);
    expect(prescription?.step).toBe(2);
    expect(prescription?.track.id).toBe("JD3");
  });

  it("pré-requisito conceitual imaturo ganha de Jardim, mesmo com JD fraco", () => {
    const prescription = prescribeCausalJardim(
      plan([
        rescue("N3.07", "misconception", "N3.07"),
        rescue("N1.11", "prerequisite-gap", "N3.07"),
      ]),
      { "N1.11": progress(3) },
      { JD3: weakJardim() },
    );
    expect(prescription).toBeNull();
  });

  it("Jardim mastered nunca sequestra uma Aula conceitual", () => {
    const prescription = prescribeCausalJardim(
      plan([rescue("N3.07", "misconception", "N3.07")]),
      { "N1.11": progress(3) },
      { JD3: weakJardim({ mastered: true }) },
    );
    expect(prescription).toBeNull();
  });
});
