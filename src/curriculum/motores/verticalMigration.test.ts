import { afterEach, describe, expect, it } from "vitest";
import { gN3_09 } from "../../utils/generatorsF1";
import { gN3_11 } from "../../utils/generatorsF2";
import {
  rollbackVerticalCanary,
  selectVerticalGenerator,
  VERTICAL_COMPOSER_CANARIES,
} from "./verticalMigration";

const fallback = () => ({ kind: "multiple_choice", prompt: "fallback", answer: 1 });

describe("vertical migration", () => {
  afterEach(() => VERTICAL_COMPOSER_CANARIES.add("N3.09"));

  it("uses only N3.09 as the Composer canary and keeps N3.11 legacy", () => {
    expect([...VERTICAL_COMPOSER_CANARIES]).toEqual(["N3.09"]);
    expect(selectVerticalGenerator("N3.09", gN3_09, fallback).generatorSource).toBe("composer");
    expect(selectVerticalGenerator("N3.11", gN3_11, fallback)).toEqual({
      gen: gN3_11,
      generatorSource: "legacy",
    });
  });

  it("rolls N3.09 back explicitly by removing it from the canary set", () => {
    rollbackVerticalCanary();
    expect(selectVerticalGenerator("N3.09", gN3_09, fallback)).toEqual({
      gen: gN3_09,
      generatorSource: "legacy",
    });
  });

  it("labels an absent implementation as fallback", () => {
    expect(selectVerticalGenerator("unknown", undefined, fallback)).toEqual({
      gen: fallback,
      generatorSource: "fallback",
    });
  });
});
