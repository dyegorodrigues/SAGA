import { describe, expect, it } from "vitest";
import {
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
} from "./composerCanary";
import { DEFAULT_COMPOSER_CANARY_IDS } from "./composerCanaryIds";

describe("W9 — N3.02 / F15 regression-first", () => {
  it("a ficha autoral precisa existir, mas continuar inativa até o portão de promoção", () => {
    expect(hasComposerFicha("N3.02")).toBe(true);
    expect(DEFAULT_COMPOSER_CANARY_IDS).not.toContain("N3.02");
  });

  it("declara owner especializado para o modo EmojiRow#riscar", () => {
    expect(registeredFichaRuntimeKindOverride("N3.02")).toBe("emojirow-riscar-f15");
  });
});
