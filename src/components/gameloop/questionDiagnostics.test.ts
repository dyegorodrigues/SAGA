import { describe, expect, it } from "vitest";
import {
  createQuestionDiagnostics,
  recordQuestionAttempt,
  summarizeQuestionDiagnostics,
} from "./questionDiagnostics";

describe("question diagnostics", () => {
  it("consolidates attempts and recovery without duplicating a misconception", () => {
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

  it("does not report recovery when the terminal answer is wrong", () => {
    const diagnostics = createQuestionDiagnostics();
    recordQuestionAttempt(diagnostics, false);

    expect(summarizeQuestionDiagnostics(diagnostics, false)).toEqual({
      attemptCount: 1,
      recoveredAfterError: false,
      misconceptionTags: [],
    });
  });

  it("keeps distinct misconception hypotheses from the same question", () => {
    const diagnostics = createQuestionDiagnostics();
    recordQuestionAttempt(diagnostics, false, "off-by-one");
    recordQuestionAttempt(diagnostics, false, "inverte-coluna");

    expect(summarizeQuestionDiagnostics(diagnostics, false).misconceptionTags).toEqual([
      "off-by-one",
      "inverte-coluna",
    ]);
  });
});
