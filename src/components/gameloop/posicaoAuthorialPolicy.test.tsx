// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Composer } from "../../curriculum/Composer";
import { GE_01 } from "../../curriculum/fichas/jornada/GE.01";
import { GE_02 } from "../../curriculum/fichas/jornada/GE.02";
import { Question } from "../../types";
import { authorialFeedbackHoldMs, ownsAuthorialFeedback, ownsAuthorialRetry } from "./answerPolicy";
import { emphasisForQuestion, QuestionPrompt } from "./QuestionPrompt";

const q47 = Composer.generate(GE_01, 1) as Question;
const q48 = Composer.generate(GE_02, 2) as Question;
const meta47 = { posicao: { pedida: "em cima", escolhida: "embaixo", par: "cima-baixo" } } as any;

describe("F47 — política autoral da casca", () => {
  it("F47 possui retry/feedback próprios e preserva os 3,3s de cinema", () => {
    expect(q47.kind).toBe("shapecanvas");
    expect(ownsAuthorialRetry(q47, meta47)).toBe(true);
    expect(ownsAuthorialFeedback(q47, meta47)).toBe(true);
    expect(authorialFeedbackHoldMs(q47, meta47)).toBe(3300);
  });

  it("não sequestra F48 só porque ela também usa shapecanvas", () => {
    expect(q48.kind).toBe("shapecanvas");
    expect(ownsAuthorialRetry(q48, { forma: {} } as any)).toBe(false);
    expect(ownsAuthorialFeedback(q48, { forma: {} } as any)).toBe(false);
  });

  it("enfatiza a preposição sem criar um segundo enunciado", () => {
    const alvo = emphasisForQuestion(q47);
    expect(alvo).toBe((q47.uiProps as any).pedida);
    const { container } = render(<div data-shell-prompt><QuestionPrompt q={q47} /></div>);
    expect(screen.getByText(alvo!).getAttribute("data-prompt-emphasis")).not.toBeNull();
    expect(container.textContent).toBe(q47.prompt);
    expect(container.querySelectorAll("[data-shell-prompt]")).toHaveLength(1);
  });
});