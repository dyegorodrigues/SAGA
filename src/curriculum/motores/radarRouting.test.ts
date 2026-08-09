import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../constants/misconceptions";
import { Progress } from "../../types";
import { getRescueItems } from "./radarEngine";

const progressWith = (tag: string): Progress => ({
  lvl: 3,
  maxLvl: 3,
  streak: 0,
  bad: 2,
  stars: 0,
  ok: 3,
  tot: 5,
  bank: [],
  mast: 1,
  misconceptions: [
    { tag, ts: 1_000 },
    { tag, ts: 2_000 },
  ],
} as Progress);

describe("auditoria longitudinal — identidade de resgate do Radar", () => {
  it("OFF_BY_ONE permanece no nó em que foi observado", () => {
    const pMap = {
      "N4.08": progressWith(MisconceptionTag.OFF_BY_ONE),
    };

    expect(getRescueItems("kid", pMap)).toEqual(["N4.08"]);
  });

  it("tag histórica LENTO_DEDOS não sequestra qualquer Dojo para N1.03", () => {
    const pMap = {
      "N3.01": progressWith("LENTO_DEDOS"),
    };

    expect(getRescueItems("kid", pMap)).toEqual(["N3.01"]);
  });

  it("cada nó com padrão confirmado permanece uma fonte independente", () => {
    const pMap = {
      "N1.07": progressWith(MisconceptionTag.OFF_BY_ONE),
      "GM.02": progressWith(MisconceptionTag.DIRECAO_ERRADA),
    };

    expect(new Set(getRescueItems("kid", pMap))).toEqual(new Set(["N1.07", "GM.02"]));
  });
});