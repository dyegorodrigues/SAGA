import { describe, expect, it } from "vitest";

import {
  assertAllowedCreatureAssetUrl,
  normalizeCreatureNumericId,
} from "./creatureSpriteService";

describe("Creature Sprite service security", () => {
  it("normalizes numeric IDs for the PMDCollab API", () => {
    expect(normalizeCreatureNumericId("25")).toBe("0025");
    expect(normalizeCreatureNumericId("#0133")).toBe("0133");
    expect(() => normalizeCreatureNumericId("pikachu")).toThrow(/ID de criatura inválido/);
    expect(() => normalizeCreatureNumericId("10000")).toThrow(/ID de criatura inválido/);
  });

  it("accepts only HTTPS assets from the explicit allowlist", () => {
    expect(assertAllowedCreatureAssetUrl("https://spriteserver.pmdcollab.org/assets/example.png").hostname)
      .toBe("spriteserver.pmdcollab.org");
    expect(assertAllowedCreatureAssetUrl("https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/example.png").hostname)
      .toBe("raw.githubusercontent.com");

    expect(() => assertAllowedCreatureAssetUrl("http://spriteserver.pmdcollab.org/example.png"))
      .toThrow(/Host de asset não permitido/);
    expect(() => assertAllowedCreatureAssetUrl("https://example.com/example.png"))
      .toThrow(/Host de asset não permitido/);
    expect(() => assertAllowedCreatureAssetUrl("not-a-url"))
      .toThrow(/URL de asset inválida/);
  });
});
