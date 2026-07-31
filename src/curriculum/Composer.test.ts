import { describe, expect, it } from "vitest";
import { Composer } from "./Composer";
import { AL_01 } from "./fichas/jornada/AL.01";
import { AL_05 } from "./fichas/jornada/AL.05";
import { GM_04 } from "./fichas/jornada/GM.04";
import { N1_01 } from "./fichas/jornada/N1.01";
import { N1_02 } from "./fichas/jornada/N1.02";
import { N1_03 } from "./fichas/jornada/N1.03";
import { N1_04 } from "./fichas/jornada/N1.04";
import { N1_07 } from "./fichas/jornada/N1.07";
import { N1_08 } from "./fichas/jornada/N1.08";
import { N1_09 } from "./fichas/jornada/N1.09";
import { N1_10 } from "./fichas/jornada/N1.10";
import { N2_01 } from "./fichas/jornada/N2.01";

const REGISTERED_JOURNEY_FICHAS = [
  N1_01, N1_02, N1_03, N1_04, N1_07, N1_08, N1_09, N1_10,
  N2_01, GM_04, AL_01, AL_05,
];

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

  it("generates valid answers across every registered Journey ficha and level", () => {
    for (const ficha of REGISTERED_JOURNEY_FICHAS) {
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
});
