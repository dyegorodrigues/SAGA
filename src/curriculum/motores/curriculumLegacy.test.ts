import { afterEach, describe, expect, it, vi } from "vitest";
import { gN3_11 } from "../../utils/generatorsF2";
import { getTrackById } from "./curriculum";

describe("ponte de migração do vertical", () => {
  afterEach(() => vi.restoreAllMocks());

  it("usa N3.09 como único canário e preserva N3.11 no legado", () => {
    expect(getTrackById("N3.09")?.generatorSource).toBe("composer");
    expect(getTrackById("N3.11")?.generatorSource).toBe("legacy");
  });

  it("N3.11 em produção delega exatamente ao gerador legado gN3_11", () => {
    // Os geradores consomem Math.random; fixando a fonte de aleatoriedade, a
    // delegação vira comparação determinística — prova mais forte que a
    // identidade de função, que o dispatch preguiçoso torna inobservável.
    vi.spyOn(Math, "random").mockReturnValue(0.4242);

    for (const nivel of [1, 2, 3, 4, 5]) {
      expect(getTrackById("N3.11")?.gen(nivel)).toEqual(gN3_11(nivel));
    }
  });
});
