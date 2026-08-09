import { describe, expect, it } from "vitest";
import type { Progress, Track } from "../../types";
import type { AulaPlan, RescuePlanItem } from "./composer";
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

void p; // fixture mantém o contrato de Progress perto deste teste longitudinal.

describe("Sensei — porta prescritiva", () => {
  it("aula normal continua normal quando só há revisão/banco", () => {
    expect(chooseSenseiEntry(plan([
      rescue("N1.02", "spaced-review"),
      rescue("N1.03", "error-bank"),
    ]))).toEqual({ kind: "lesson" });
  });

  it("misconception causal transforma a missão principal em resgate", () => {
    const r = rescue("N1.04", "misconception");
    expect(chooseSenseiEntry(plan([r]))).toEqual({ kind: "rescue", rescue: r });
  });

  it("lacuna de pré-requisito tem prioridade sobre misconception no próprio alvo", () => {
    const self = rescue("N1.04", "misconception");
    const base = rescue("N1.02", "prerequisite-gap");
    expect(chooseSenseiEntry(plan([self, base]))).toEqual({ kind: "rescue", rescue: base });
  });
});
