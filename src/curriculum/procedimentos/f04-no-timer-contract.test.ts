import { expect, it } from "vitest";
import { N1_13 } from "../fichas/jornada/N1.13";

it("F04 nao declara debounce como criterio de resposta", () => {
  for (const micro of N1_13.micros) expect(micro.params).not.toHaveProperty("debounce");
});
