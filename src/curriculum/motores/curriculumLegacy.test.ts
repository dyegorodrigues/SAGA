import { describe, expect, it } from "vitest";
import { gN3_09 } from "../../utils/generatorsF1";
import { gN3_11 } from "../../utils/generatorsF2";
import { getTrackById } from "./curriculum";

describe("ponte de migração do vertical", () => {
  it("preserva os geradores legados de N3.09 e N3.11 em produção", () => {
    expect(getTrackById("N3.09")?.gen).toBe(gN3_09);
    expect(getTrackById("N3.11")?.gen).toBe(gN3_11);
  });
});
