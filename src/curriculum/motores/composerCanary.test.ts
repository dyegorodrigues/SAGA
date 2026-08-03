import { afterEach, describe, expect, it } from "vitest";
import { gN3_09 } from "../../utils/generatorsF1";
import { gN3_11 } from "../../utils/generatorsF2";
import {
  COMPOSER_CANARIES,
  enableComposerCanary,
  rollbackComposerCanary,
  selectGenerator,
} from "./composerCanary";
import { getTrackById } from "./curriculum";

const fallback = () => ({ kind: "multiple_choice", prompt: "fallback", answer: 1 });

describe("ponte de canário do Composer", () => {
  afterEach(() => {
    COMPOSER_CANARIES.clear();
    COMPOSER_CANARIES.add("N3.09");
  });

  it("usa N3.09 como único canário e mantém N3.11 no legado", () => {
    expect([...COMPOSER_CANARIES]).toEqual(["N3.09"]);
    expect(selectGenerator("N3.09", gN3_09, fallback).source()).toBe("composer");
    expect(selectGenerator("N3.11", gN3_11, fallback).source()).toBe("legacy");
  });

  it("classifica implementação ausente como fallback", () => {
    expect(selectGenerator("desconhecido", undefined, fallback).source()).toBe("fallback");
  });

  it("recusa ativar canário de nó sem ficha autoral registrada", () => {
    expect(() => enableComposerCanary("N4.02")).toThrow(/ficha autoral/);
  });

  // Regressão: o rollback precisa valer no caminho de produção, não apenas na
  // função isolada. Antes, CURRICULUM congelava a decisão na carga do módulo e
  // retirar o id do conjunto não surtia efeito algum.
  it("o rollback muda o gerador servido em produção", () => {
    expect(getTrackById("N3.09")?.generatorSource).toBe("composer");

    rollbackComposerCanary("N3.09");

    expect(getTrackById("N3.09")?.generatorSource).toBe("legacy");
    // Os geradores são aleatórios por chamada; a prova é a proveniência somada a
    // uma questão ainda utilizável, não a igualdade entre duas amostras.
    expect(getTrackById("N3.09")?.gen(1).kind).toBe(gN3_09(1).kind);
  });

  // Regressão: promover um novo canário não pode exigir edição do curriculum.
  it("ativar um canário exige apenas ficha registrada, sem lista de ids no curriculum", () => {
    rollbackComposerCanary("N3.09");
    expect(getTrackById("N3.09")?.generatorSource).toBe("legacy");

    enableComposerCanary("N3.09");

    expect(getTrackById("N3.09")?.generatorSource).toBe("composer");
  });

  it("nós fora do conjunto de canários permanecem intactos", () => {
    expect(getTrackById("N3.11")?.generatorSource).toBe("legacy");
    expect(getTrackById("N4.02")?.generatorSource).toBe("legacy");
  });
});
