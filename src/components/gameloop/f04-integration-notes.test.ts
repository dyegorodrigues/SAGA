import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../constants/misconceptions";

/**
 * Este arquivo existe para deixar explícitas as duas invariantes que atravessam
 * arquivos diferentes e não cabem num snapshot visual isolado.
 */
describe("F04 — invariantes de integração", () => {
  it("usa a tag centralizada para dependência de andaime", () => {
    expect(MisconceptionTag.DEPENDE_DE_ANDAIME).toBe("depende-de-andaime");
  });

  it("a hipótese é distinta de produção incompleta", () => {
    expect(MisconceptionTag.DEPENDE_DE_ANDAIME).not.toBe(MisconceptionTag.PRODUCAO_INCOMPLETA);
  });
});
