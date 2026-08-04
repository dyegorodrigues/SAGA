import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../constants/misconceptions";
import { Question } from "../../types";
import { isMotorSlip, isRetryableAnswer, misconceptionForAnswer, shouldRenderQuestionOptions } from "./answerPolicy";

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

  it("deixa alternativas autorais do array dentro da primitiva", () => {
    const array = { ...vertical, kind: "array", options: [{ value: 12 }] };
    expect(shouldRenderQuestionOptions(array)).toBe(false);
    expect(isRetryableAnswer(array, 11, { source: "array-grid" })).toBe(true);
  });
});

describe("filtro motor na porta do Radar (§8.3-bis)", () => {
  const arrastavel: Question = {
    kind: "drag-group",
    prompt: "Leve os blocos para a dezena.",
    answer: 3,
    options: [{ value: 2, misconception: MisconceptionTag.OFF_BY_ONE }],
  };

  it("não deixa escorregão de dedo virar tag, nem vindo de option autoral", () => {
    expect(misconceptionForAnswer(arrastavel, 2, {
      manipulacao: { corrigiuSozinha: true },
    })).toBeUndefined();
  });

  it("não deixa escorregão de dedo virar tag vinda da própria primitiva", () => {
    expect(misconceptionForAnswer(arrastavel, 2, {
      source: "array-grid",
      misconception: MisconceptionTag.ESQUECEU_VAI_UM,
      manipulacao: { foraDeAlvoValido: true },
    })).toBeUndefined();
  });

  it("deixa passar a hipótese quando o gesto foi íntegro e o destino errado", () => {
    expect(misconceptionForAnswer(arrastavel, 2, {
      manipulacao: { precisoEmDestinoErrado: true },
    })).toBe(MisconceptionTag.OFF_BY_ONE);
  });

  it("resposta sem gesto continua produzindo hipótese", () => {
    // Regressão do risco óbvio da fiação: barrar tudo por engano.
    expect(misconceptionForAnswer(arrastavel, 2)).toBe(MisconceptionTag.OFF_BY_ONE);
  });

  it("escorregão nunca é resposta terminal, mesmo sem options nem groups", () => {
    const semAlternativas: Question = { kind: "drag-group", prompt: "Arraste.", answer: 3 };
    expect(isRetryableAnswer(semAlternativas, 2)).toBe(false);
    expect(isRetryableAnswer(semAlternativas, 2, { manipulacao: { duracaoMs: 30 } })).toBe(true);
  });

  it("timeout continua terminal mesmo com gesto registrado", () => {
    expect(isRetryableAnswer(arrastavel, "__timeout__", {
      manipulacao: { foraDeAlvoValido: true },
    })).toBe(false);
  });

  it("isMotorSlip só se pronuncia quando houve gesto", () => {
    expect(isMotorSlip(undefined)).toBe(false);
    expect(isMotorSlip({ source: "array-grid" })).toBe(false);
    expect(isMotorSlip({ manipulacao: {} })).toBe(true);
    expect(isMotorSlip({ manipulacao: { repetiuMesmoDestino: true } })).toBe(false);
  });
});
