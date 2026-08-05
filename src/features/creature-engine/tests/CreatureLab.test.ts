import { describe, expect, it } from "vitest";

import { buildPreferredBehavior, normalizeLabCreatureId } from "../CreatureLab";

describe("Creature Lab", () => {
  it("normaliza IDs nacionais sem aceitar texto ou limites inválidos", () => {
    expect(normalizeLabCreatureId("25")).toBe("0025");
    expect(normalizeLabCreatureId("#0133")).toBe("0133");
    expect(normalizeLabCreatureId(447)).toBe("0447");
    expect(() => normalizeLabCreatureId("Pikachu")).toThrow(/ID numérico/);
    expect(() => normalizeLabCreatureId("10000")).toThrow(/ID numérico/);
  });

  it("monta uma fila automática apenas com ações realmente disponíveis", () => {
    const actions = ["Idle", "Walk", "Attack", "Sleep", "Charge", "Bite"];
    expect(buildPreferredBehavior(actions)).toEqual([
      "Idle",
      "Walk",
      "Attack",
      "Bite",
      "Sleep",
    ]);
  });

  it("usa a primeira ação como fallback honesto", () => {
    expect(buildPreferredBehavior(["CustomPose", "OtherPose"])).toEqual(["CustomPose"]);
    expect(buildPreferredBehavior([])).toEqual([]);
  });
});
