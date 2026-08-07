import { expect, it } from "vitest";
import { dependeDeAndaime } from "./producaoProcedure";

it("historico vazio nao produz dependencia de andaime", () => {
  expect(dependeDeAndaime([])).toBe(false);
});
