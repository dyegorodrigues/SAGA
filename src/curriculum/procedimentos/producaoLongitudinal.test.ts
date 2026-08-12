import { describe, expect, it } from "vitest";
import { dependeDeAndaime, AcaoDeProducao } from "./producaoProcedure";

const acao = (comAndaime: boolean, colocados: number, alvo = 3): AcaoDeProducao => ({
  colocados,
  alvo,
  bandeja: alvo + 2,
  recusas: 0,
  comAndaime,
});

describe("F04 — DEPENDE_DE_ANDAIME é longitudinal", () => {
  it("só aparece quando há acerto com vagas e erro sem vagas", () => {
    expect(dependeDeAndaime([acao(true, 3), acao(false, 2)])).toBe(true);
  });

  it("não nasce de erro isolado sem histórico com andaime", () => {
    expect(dependeDeAndaime([acao(false, 2)])).toBe(false);
  });

  it("não acusa quem também produz corretamente sem vagas", () => {
    expect(dependeDeAndaime([acao(true, 3), acao(false, 3)])).toBe(false);
  });
});
