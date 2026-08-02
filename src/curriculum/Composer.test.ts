import { describe, expect, it } from "vitest";
import { Composer } from "./Composer";
import { N1_01 } from "./fichas/jornada/N1.01";
import { N1_03 } from "./fichas/jornada/N1.03";
import { N1_04 } from "./fichas/jornada/N1.04";
import { JOURNEY_FICHAS } from "./fichas";

describe("Composer de fichas", () => {
  it("uses the level primitive as the effective builder", () => {
    const scattered = Composer.generate(N1_03, 5, "a");
    const tenframe = Composer.generate(N1_04, 3, "b");
    const symbolic = Composer.generate(N1_04, 4, "b");

    expect(scattered.kind).toBe("scattered");
    expect(scattered.n).toBeTypeOf("number");
    expect(scattered.uiProps.ordered).toBe(false);
    expect(tenframe.kind).toBe("tenframe");
    expect(tenframe.n).toBeTypeOf("number");
    expect(symbolic.kind).toBe("plain");
    expect(symbolic.uiProps.text).toContain("?");
  });

  it("normalizes legacy tutorial speech into the runtime contract", () => {
    const question = Composer.generate(N1_03, 1, "a");
    expect(question.tutorial?.[0]?.say).toBe(
      "Preste atenção, eles vão sumir rapidinho!",
    );
  });

  it("converts the level response-time target from milliseconds to seconds", () => {
    expect(Composer.generate(N1_03, 5, "a").rt_max_s).toBe(1.5);
  });

  it("attaches canonical misconception tags only to matching numeric distractors", () => {
    const question = Composer.generate(N1_03, 5, "a");
    const wrongOptions = question.options?.filter(option => option.value !== question.answer) || [];
    const mappedOffByOne = wrongOptions.filter(option =>
      typeof option.value === "number" && Math.abs(option.value - question.answer) === 1
    );

    expect(wrongOptions.length).toBeGreaterThan(0);
    expect(mappedOffByOne.length).toBeGreaterThan(0);
    expect(mappedOffByOne.every(option => option.misconception === "OFF_BY_ONE")).toBe(true);
    expect(question.options?.find(option => option.value === question.answer)?.misconception).toBeUndefined();
  });

  it("generates valid answers across every registered Journey ficha and level", () => {
    for (const ficha of JOURNEY_FICHAS) {
      for (let level = 1; level <= 5; level += 1) {
        for (let sample = 0; sample < 10; sample += 1) {
          const question = Composer.generate(ficha, level);
          const declaredKind = ficha.niveis?.[level]?.primitiva ?? ficha.micros[0].kinds[0];
          const renderedKind = declaredKind === "intruso_math" ? "plain" : declaredKind;
          expect(question.kind, `${ficha.id} L${level}`).toBe(renderedKind);
          expect(question.uiProps, `${ficha.id} L${level}`).toBeDefined();
          expect(question.evaluate, `${ficha.id} L${level}`).toBeTypeOf("function");
          expect(question.evaluate?.(question.answer), `${ficha.id} L${level}`).toBe(true);

          if (question.options) {
            const matching = question.options.filter(option => option.value === question.answer);
            expect(matching, `${ficha.id} L${level}`).toHaveLength(1);
          }
        }
      }
    }
  });

  it("requires a positive level-five response-time target in every registered ficha", () => {
    for (const ficha of JOURNEY_FICHAS) {
      expect(ficha.niveis?.[5]?.rt_alvo, ficha.id).toBeGreaterThan(0);
      expect(Composer.generate(ficha, 5).rt_max_s, ficha.id).toBeGreaterThan(0);
    }
  });

  it("fails explicitly instead of returning an invalid question for an unknown builder", () => {
    const invalid = {
      ...N1_01,
      niveis: { 1: { primitiva: "shapecanvas" as const } },
    };
    expect(() => Composer.generate(invalid, 1, "a")).toThrow(
      "Primitiva shapecanvas ainda não possui builder",
    );
  });

  it("rejects malformed ficha parameters at the Composer boundary", () => {
    const malformed = {
      ...N1_03,
      micros: [{
        ...N1_03.micros[0],
        params: { ...N1_03.micros[0].params, n_min: "um" },
      }],
    };

    expect(() => Composer.generate(malformed, 1, "a")).toThrow(
      "Parâmetro n_min inválido em N1.03/a",
    );
  });

  it("builds a typed vertical question with a single valid answer", () => {
    const vertical = {
      ...N1_01,
      niveis: { 1: { primitiva: "vertical" as const } },
      micros: [{
        ...N1_01.micros[0],
        kinds: ["vertical" as const],
        params: {
          top_min: 27,
          top_max: 27,
          bottom_min: 5,
          bottom_max: 5,
          operation: "+",
          require_regroup: true,
          audio_prompt: "Vinte e sete mais cinco.",
        },
      }],
    };

    const question = Composer.generate(vertical, 1, vertical.micros[0].id);
    expect(question).toMatchObject({
      kind: "vertical",
      vTop: 27,
      vBot: 5,
      vOp: "+",
      answer: 32,
      audioPrompt: "Vinte e sete mais cinco.",
    });
    expect(question.evaluate?.(32)).toBe(true);
    expect(question.evaluate?.(31)).toBe(false);
  });

  it("rejects an invalid vertical operation at the typed boundary", () => {
    const invalid = {
      ...N1_01,
      niveis: { 1: { primitiva: "vertical" as const } },
      micros: [{
        ...N1_01.micros[0],
        kinds: ["vertical" as const],
        params: { operation: "×" },
      }],
    };
    expect(() => Composer.generate(invalid, 1, invalid.micros[0].id)).toThrow(
      "Parâmetro operation inválido",
    );
  });
});
