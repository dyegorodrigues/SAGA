import { describe, expect, it } from "vitest";
import { Composer } from "../../Composer";
import { misconceptionForAnswer } from "../../../components/gameloop/answerPolicy";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { N1_07 } from "./N1.07";

const sample = (level: number, n = 80) =>
  Array.from({ length: n }, () => Composer.generate(N1_07, level));

describe("N1.07 — ordem, sucessor e antecessor", () => {
  it("segue faixa e prerequisitos canônicos", () => {
    expect(N1_07.faixa).toBe("F0");
    expect(N1_07.prereqs).toEqual(["N1.02", "N1.06"]);
    expect(N1_07.micros.map(m => m.id)).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("L1-L2 observam sucessor", () => {
    for (const level of [1, 2]) {
      for (const q of sample(level)) {
        const spec = q.uiProps as {
          startPos: number;
          showJumps: Array<{ from: number; to: number }>;
        };
        expect(q.kind).toBe("numberline");
        expect(Number(q.answer)).toBe(spec.startPos + 1);
        expect(spec.showJumps).toEqual([{ from: spec.startPos, to: Number(q.answer) }]);
        expect(q.evaluate?.(q.answer)).toBe(true);
      }
    }
  });

  it("L3-L4 observam antecessor sem escapar do intervalo", () => {
    for (const level of [3, 4]) {
      for (const q of sample(level)) {
        expect(q.kind).toBe("plain");
        expect(q.prompt.toLowerCase()).toContain("antes");
        expect(Number(q.answer)).toBe(Number(q.big) - 1);
        expect(Number(q.answer)).toBeGreaterThanOrEqual(1);
        expect(q.evaluate?.(q.answer)).toBe(true);
      }
    }
  });

  it("L5 ordena 3–4 numerais e diagnostica apenas distratores", () => {
    for (const q of sample(5, 140)) {
      const correct = String(q.answer);
      const numbers = correct.split("→").map(value => Number(value.trim()));
      expect([3, 4]).toContain(numbers.length);
      expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
      expect(new Set(numbers).size).toBe(numbers.length);
      expect(q.options).toHaveLength(4);
      expect(q.options?.filter(option => String(option.value) === correct)).toHaveLength(1);
      expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
      for (const option of q.options ?? []) {
        if (String(option.value) !== correct) {
          expect(option.misconception).toBe(MisconceptionTag.ORDEM_ERRADA);
        }
      }
    }
  });

  it("todos os níveis mantêm gabarito selecionável e acerto sem misconception", () => {
    for (let level = 1; level <= 5; level += 1) {
      for (const q of sample(level, 30)) {
        expect(q.options?.map(option => String(option.value))).toContain(String(q.answer));
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
      }
    }
  });
});
