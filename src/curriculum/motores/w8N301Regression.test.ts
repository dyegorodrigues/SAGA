import { describe, expect, it } from "vitest";
import {
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
} from "./composerCanary";
import { DEFAULT_COMPOSER_CANARY_IDS } from "./composerCanaryIds";

describe("W8 — N3.01 / F13 pós-promoção", () => {
  it("a ficha autoral existe e permanece ativa depois do portão de promoção", () => {
    expect(hasComposerFicha("N3.01")).toBe(true);
    expect(DEFAULT_COMPOSER_CANARY_IDS).toContain("N3.01");
  });

  it("usa kind especializado em vez de sequestrar visual-addition legado", () => {
    expect(registeredFichaRuntimeKindOverride("N3.01")).toBe("visual-addition-f13");
    for (let level = 1; level <= 5; level += 1) {
      const q = generateRegisteredFichaQuestion("N3.01", level);
      expect(q.kind).toBe("visual-addition-f13");
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.isFallback).toBeFalsy();
    }
  });
});
