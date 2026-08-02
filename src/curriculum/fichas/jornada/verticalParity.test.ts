import { describe, expect, it } from "vitest";
import { gN3_09 } from "../../../utils/generatorsF1";
import { gN3_11 } from "../../../utils/generatorsF2";
import { Composer } from "../../Composer";
import { N3_09 } from "./N3.09";
import { N3_11 } from "./N3.11";

function hasUnitsRegroup(top: number, bottom: number): boolean {
  return (top % 10) + (bottom % 10) >= 10;
}

describe("paridade de alcance antes da migração vertical", () => {
  it("mantém N3.09 autoral dentro do alcance sem reagrupamento do legado", () => {
    for (let level = 1; level <= 5; level += 1) {
      for (let sample = 0; sample < 100; sample += 1) {
        const legacy = gN3_09(level);
        const authored = Composer.generate(N3_09, level);
        expect(legacy.evaluate?.(legacy.answer) ?? legacy.options?.some(option => option.value === legacy.answer)).toBeTruthy();
        expect(authored.evaluate?.(authored.answer)).toBe(true);
        expect(Number(authored.answer)).toBeGreaterThanOrEqual(0);
        expect(Number(authored.answer)).toBeLessThanOrEqual(100);
      }
    }
  });

  it("preserva o alcance legado de N3.11 e expande apenas o nível 5 para três algarismos", () => {
    for (let level = 1; level <= 5; level += 1) {
      for (let sample = 0; sample < 100; sample += 1) {
        const legacy = gN3_11(level);
        const authored = Composer.generate(N3_11, level);
        expect(legacy.options?.filter(option => option.value === legacy.answer)).toHaveLength(1);
        expect(authored.evaluate?.(authored.answer)).toBe(true);
        expect(hasUnitsRegroup(authored.vTop!, authored.vBot!)).toBe(true);
        expect(Number(authored.answer)).toBeLessThanOrEqual(level === 5 ? 999 : 99);
        if (level < 5) expect(authored.vTop!).toBeLessThan(100);
        if (level === 5) expect(authored.vTop!).toBeGreaterThanOrEqual(100);
      }
    }
  });
});
