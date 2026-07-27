import { describe, it, expect } from "vitest";
import { computeUnlockStatus } from "../curriculum/motores/unlockEngine";

describe("unlockEngine", () => {
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
});
