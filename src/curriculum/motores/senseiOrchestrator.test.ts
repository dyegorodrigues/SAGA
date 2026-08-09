import { describe, expect, it } from "vitest";
import type { Progress, Track } from "../../types";
import type { AulaPlan, RescuePlanItem } from "./composer";
import type { CausalJardimPrescription } from "./jardimCausalPrescription";
import { chooseSenseiEntry } from "./senseiOrchestrator";

const p = (): Progress => ({ lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0 });
const track = (id: string): Track => ({
  id, graphId: id, name: id, icon: "🧪", color: "#000", dark: "#000",
  gen: () => ({ kind: "plain", prompt: id, answer: 1, options: [{ label: "1", value: 1 }] }),
});
const rescue = (id: string, reason: RescuePlanItem["reason"]): RescuePlanItem => ({
  track: track(id), fromBank: reason === "error-bank", reason,
  requiredLevel: 3, questionBudget: 4,
});
const plan = (resgates: RescuePlanItem[]): AulaPlan => ({
  aquecimento: track("N1.01"),
  fronteira: track("N1.04"),
  resgates,
  fluencia: null,
  fecho: null,
  resumo: "teste",
});
const garden: CausalJardimPrescription = {
  trailId: "JD1",
  motherId: "N1.03",
  motherName: "Subitização perceptual (Olhômetro)",
  sourceNodeId: "N1.03",
  causalDistance: 0,
  step: 2,
  questionBudget: 8,
  track: track("JD1"),
  reason: "known-perceptual-weakness",
  reasonText: "fraqueza perceptual provada",
};

void p; // fixture mantém o contrato de Progress perto deste teste longitudinal.

describe("Sensei — porta prescritiva", () => {
  it("aula normal continua normal quando só há revisão/banco", () => {
    expect(chooseSenseiEntry(plan([
      rescue("N1.02", "spaced-review"),
      rescue("N1.03", "error-bank"),
    ]))).toEqual({ kind: "lesson" });
  });

  it("misconception causal sem base perceptual provada vira Oficina", () => {
    const r = rescue("N1.04", "misconception");
    expect(chooseSenseiEntry(plan([r]))).toEqual({ kind: "rescue", rescue: r });
  });

  it("Jardim causal provado ganha da Oficina no próprio alvo", () => {
    const r = rescue("N1.03", "misconception");
    expect(chooseSenseiEntry(plan([r]), garden)).toEqual({ kind: "garden", prescription: garden });
  });

  it("lacuna de pré-requisito conceitual tem prioridade até sobre Jardim fraco", () => {
    const self = rescue("N1.04", "misconception");
    const base = rescue("N1.02", "prerequisite-gap");
    expect(chooseSenseiEntry(plan([self, base]), garden)).toEqual({ kind: "rescue", rescue: base });
  });
});
