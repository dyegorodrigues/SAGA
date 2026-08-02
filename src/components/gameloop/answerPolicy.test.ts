import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../constants/misconceptions";
import { Question } from "../../types";
import { isRetryableAnswer, misconceptionForAnswer, shouldRenderQuestionOptions } from "./answerPolicy";

const vertical: Question = {
  kind: "vertical",
  prompt: "Vinte e sete mais trinta e cinco.",
  answer: 62,
};

describe("política de resposta de interações produtivas", () => {
  it("mantém o erro de coluna vertical no fluxo gentil de tentativas", () => {
    expect(isRetryableAnswer(vertical, 3, { source: "vertical-column" })).toBe(true);
  });

  it("não transforma timeout em tentativa leve", () => {
    expect(isRetryableAnswer(vertical, "__timeout__", { source: "vertical-column" })).toBe(false);
  });

  it("transporta a hipótese diagnóstica da interação sem options", () => {
    expect(misconceptionForAnswer(vertical, 5, {
      source: "vertical-column",
      misconception: MisconceptionTag.ESQUECEU_VAI_UM,
    })).toBe(MisconceptionTag.ESQUECEU_VAI_UM);
  });

  it("não mistura alternativas inteiras com a decisão por coluna", () => {
    expect(shouldRenderQuestionOptions({ ...vertical, options: [{ value: 62 }] })).toBe(false);
    expect(shouldRenderQuestionOptions({ ...vertical, kind: "plain", options: [{ value: 62 }] })).toBe(true);
  });
});
