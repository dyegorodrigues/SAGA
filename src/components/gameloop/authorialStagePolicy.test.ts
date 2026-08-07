// Trigger temporário: o reconciliador sobrescreve este arquivo no mesmo lote.
import { describe, expect, it } from "vitest";
import { Question } from "../../types";
import { ownsAuthorialFeedback, ownsAuthorialRetry } from "./authorialStagePolicy";

const f04: Question = { kind: "touchplace", prompt: "Coloque 3", answer: 3, uiProps: {} };
const meta = { touchplace: { colocados: 2, alvo: 3, bandeja: 5, recusas: 0, comAndaime: false } };

describe("F04 — autoria de feedback/retry", () => {
  it("TouchPlace possui o próprio erro suave e retry", () => {
    expect(ownsAuthorialRetry(f04, meta)).toBe(true);
    expect(ownsAuthorialFeedback(f04, meta)).toBe(true);
  });

  it("sem leitura TouchPlace o GameLoop não presume autoria", () => {
    expect(ownsAuthorialRetry(f04)).toBe(false);
    expect(ownsAuthorialFeedback(f04)).toBe(false);
  });

  it("não sequestra outras primitivas", () => {
    const outra: Question = { kind: "plain", prompt: "?", answer: 3 };
    expect(ownsAuthorialRetry(outra, meta)).toBe(false);
    expect(ownsAuthorialFeedback(outra, meta)).toBe(false);
  });
});
