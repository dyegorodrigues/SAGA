import { describe, expect, it } from "vitest";
import { Composer } from "../../curriculum/Composer";
import { GE_01 } from "../../curriculum/fichas/jornada/GE.01";
import { GE_02 } from "../../curriculum/fichas/jornada/GE.02";
import { Question } from "../../types";
import { authorialFeedbackHoldMs, ownsAuthorialFeedback, ownsAuthorialRetry } from "./answerPolicy";

const q47 = Composer.generate(GE_01, 1) as Question;
const q48 = Composer.generate(GE_02, 2) as Question;

describe("autoria ShapeCanvas por metadado, não por kind", () => {
  it("F48 é dona do retry/feedback e conserva 2,2s + 1,5s do cinema", () => {
    const meta = { forma: { pedida: "quadrado", escolhida: "retangulo", pedidaGirada: true, escolhidaEmPe: true } } as any;
    expect(ownsAuthorialRetry(q48, meta)).toBe(true);
    expect(ownsAuthorialFeedback(q48, meta)).toBe(true);
    expect(authorialFeedbackHoldMs(q48, meta)).toBe(3700);
  });

  it("F47 mantém sua política própria de 3,3s", () => {
    const meta = { posicao: { pedida: "em cima", escolhida: "embaixo", par: "cima-baixo" } } as any;
    expect(ownsAuthorialRetry(q47, meta)).toBe(true);
    expect(authorialFeedbackHoldMs(q47, meta)).toBe(3300);
  });

  it("metadado errado não sequestra a outra ficha da família shapecanvas", () => {
    expect(ownsAuthorialRetry(q47, { forma: {} } as any)).toBe(false);
    expect(ownsAuthorialFeedback(q47, { forma: {} } as any)).toBe(false);
    expect(ownsAuthorialRetry(q48, { posicao: {} } as any)).toBe(false);
    expect(ownsAuthorialFeedback(q48, { posicao: {} } as any)).toBe(false);
  });
});
