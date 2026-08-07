import { describe, expect, it } from "vitest";
import { ownsAuthorialRetry } from "./authorialStagePolicy";

it("TouchPlace continua fora do retry generico", () => {
  expect(ownsAuthorialRetry({ kind: "touchplace", prompt: "", answer: 1 }, { touchplace: {} })).toBe(true);
});
