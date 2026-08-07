import { describe, it, expect } from "vitest";
import {
  computeUnlockStatus,
  isTrackUnlocked,
  resolveGraphNodeId,
} from "../curriculum/motores/unlockEngine";
import { ALL_MATH_TRACKS } from "../curriculum/motores/curriculum";
import { GrafoSaga } from "./grafoSaga";

describe("unlockEngine", () => {
  it("exposes every canonical math node exactly once in the Journey", () => {
    // A REGRA é "todo nó canônico aparece exatamente uma vez" — o número 88 era
    // inventário, não especificação (§2-bis do Padrão Ouro). Preso, ele reprova
    // o dia em que uma competência entra no cânone, que é justamente quando o
    // teste deveria continuar verde: ele existe para pegar nó DUPLICADO ou
    // PERDIDO, não para congelar o tamanho do currículo.
    const ids = ALL_MATH_TRACKS.map((track) => track.graphId);
    expect(ids).toHaveLength(GrafoSaga.nodes.length);
    expect(new Set(ids).size).toBe(GrafoSaga.nodes.length);
  });

  it("opens root nodes (no prereqs) when no progress exists", () => {
    const status = computeUnlockStatus({});
    expect(status.opened.length).toBeGreaterThan(0);
    // N1.01 has no prereqs
    expect(status.opened).toContain("N1.01");
    // N1.04 has prereqs, should be locked
    expect(status.locked).toContain("N1.04");
  });

  it("unlocks children when prereqs reach maxLvl >= 3", () => {
    // N1.04 requires N1.01 and N1.02
    const pMap: any = {
      "N1.01": { maxLvl: 3 },
      "N1.02": { dom: true },
    };
    const status = computeUnlockStatus(pMap);
    expect(status.opened).toContain("N1.04");
    expect(status.frontier).toContain("N1.04");
  });

  it("keeps children locked if prereqs are not met", () => {
    const pMap: any = {
      "N1.01": { maxLvl: 2 }, // not 3
      "N1.02": { dom: true },
    };
    const status = computeUnlockStatus(pMap);
    expect(status.locked).toContain("N1.04");
  });

  it("puts dominated nodes into dominated array and not frontier", () => {
    const pMap: any = {
      "N1.01": { dom: true }
    };
    const status = computeUnlockStatus(pMap);
    expect(status.dominated).toContain("N1.01");
    expect(status.frontier).not.toContain("N1.01");
    expect(status.opened).toContain("N1.01");
  });

  it("uses graphId aliases when deciding access", () => {
    const status = computeUnlockStatus({});
    expect(resolveGraphNodeId("legacy-count", "N1.04")).toBe("N1.04");
    expect(isTrackUnlocked("legacy-count", "N1.04", status)).toBe(false);
  });

  it("does not lock tracks from cartridges outside the math graph", () => {
    const status = computeUnlockStatus({});
    expect(resolveGraphNodeId("port-vogais")).toBeNull();
    expect(isTrackUnlocked("port-vogais", undefined, status)).toBe(true);
  });

  it("opens a graph track only after every prerequisite matures", () => {
    const locked = computeUnlockStatus({
      "N1.01": { maxLvl: 3 } as any,
      "N1.02": { maxLvl: 2 } as any,
    });
    const opened = computeUnlockStatus({
      "N1.01": { maxLvl: 3 } as any,
      "N1.02": { maxLvl: 3 } as any,
    });

    expect(isTrackUnlocked("N1.04", "N1.04", locked)).toBe(false);
    expect(isTrackUnlocked("N1.04", "N1.04", opened)).toBe(true);
  });
});
