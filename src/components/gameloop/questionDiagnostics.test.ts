import { describe, expect, it } from "vitest";
import { bundleMisconceptions } from "./misconceptionBundle";
import {
  createQuestionDiagnostics,
  recordQuestionAttempt,
  recordQuestionHypothesis,
  summarizeQuestionDiagnostics,
} from "./questionDiagnostics";

describe("question diagnostics", () => {
  it("consolida tentativas e recuperação sem duplicar hipótese", () => {
    const diagnostics = createQuestionDiagnostics();
    recordQuestionAttempt(diagnostics, false, "off-by-one");
    recordQuestionAttempt(diagnostics, false, "off-by-one");
    recordQuestionAttempt(diagnostics, true);
    expect(summarizeQuestionDiagnostics(diagnostics, true)).toEqual({
      attemptCount: 3,
      recoveredAfterError: true,
      misconceptionTags: ["off-by-one"],
    });
  });

  it("preserva hipótese embutida numa ação terminal correta", () => {
    const diagnostics = createQuestionDiagnostics();
    recordQuestionAttempt(diagnostics, true, "nao-monitora-alvo");
    expect(summarizeQuestionDiagnostics(diagnostics, true)).toEqual({
      attemptCount: 1,
      recoveredAfterError: false,
      misconceptionTags: ["nao-monitora-alvo"],
    });
  });

  it("uma tentativa pode sustentar hipótese imediata + longitudinal", () => {
    const diagnostics = createQuestionDiagnostics();
    recordQuestionAttempt(diagnostics, false, bundleMisconceptions([
      "producao-incompleta", "depende-de-andaime",
    ]));
    expect(summarizeQuestionDiagnostics(diagnostics, false)).toEqual({
      attemptCount: 1,
      recoveredAfterError: false,
      misconceptionTags: ["producao-incompleta", "depende-de-andaime"],
    });
  });

  it("a API longitudinal continua sem inventar tentativa", () => {
    const diagnostics = createQuestionDiagnostics();
    recordQuestionAttempt(diagnostics, false, "producao-incompleta");
    recordQuestionHypothesis(diagnostics, "depende-de-andaime");
    expect(summarizeQuestionDiagnostics(diagnostics, false).attemptCount).toBe(1);
    expect(summarizeQuestionDiagnostics(diagnostics, false).misconceptionTags).toEqual([
      "producao-incompleta", "depende-de-andaime",
    ]);
  });

  it("não reporta recuperação quando a resposta terminal é errada", () => {
    const diagnostics = createQuestionDiagnostics();
    recordQuestionAttempt(diagnostics, false);
    expect(summarizeQuestionDiagnostics(diagnostics, false)).toEqual({
      attemptCount: 1,
      recoveredAfterError: false,
      misconceptionTags: [],
    });
  });

  it("mantém hipóteses distintas da mesma questão", () => {
    const diagnostics = createQuestionDiagnostics();
    recordQuestionAttempt(diagnostics, false, "off-by-one");
    recordQuestionAttempt(diagnostics, false, "inverte-coluna");
    expect(summarizeQuestionDiagnostics(diagnostics, false).misconceptionTags).toEqual([
      "off-by-one", "inverte-coluna",
    ]);
  });
});
