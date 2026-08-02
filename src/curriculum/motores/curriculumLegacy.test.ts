import { describe, expect, it } from "vitest";
import { gN3_11 } from "../../utils/generatorsF2";
import { getTrackById } from "./curriculum";

describe("ponte de migração do vertical", () => {
  it("usa N3.09 como único canário e preserva N3.11 no legado", () => {
    expect(getTrackById("N3.09")?.generatorSource).toBe("composer");
    expect(getTrackById("N3.11")?.gen).toBe(gN3_11);
    expect(getTrackById("N3.11")?.generatorSource).toBe("legacy");
  });
});
