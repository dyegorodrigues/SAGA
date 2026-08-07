import { expect, it } from "vitest";
import { ownsAuthorialRetry } from "./authorialStagePolicy";

it("retry autoral da F04 independe da contagem generica", () => {
  const q = { kind: "touchplace", prompt: "", answer: 3 };
  const meta = { touchplace: { colocados: 1 } };
  expect(ownsAuthorialRetry(q, meta)).toBe(true);
});
