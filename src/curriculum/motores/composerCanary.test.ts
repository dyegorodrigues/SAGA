import { afterEach, describe, expect, it } from "vitest";
import { gN3_09 } from "../../utils/generatorsF1";
import { gN3_11 } from "../../utils/generatorsF2";
import {
  COMPOSER_CANARIES,
  enableComposerCanary,
  hasComposerFicha,
  rollbackComposerCanary,
  selectGenerator,
} from "./composerCanary";
import { ALL_MATH_TRACKS, getTrackById } from "./curriculum";

const fallback = () => ({ kind: "multiple_choice", prompt: "fallback", answer: 1 });

describe("ponte de canário do Composer", () => {
  afterEach(() => {
    COMPOSER_CANARIES.clear();
    COMPOSER_CANARIES.add("N3.09");
    COMPOSER_CANARIES.add("N3.10");
  });

  it("serve os canários pelo Composer e mantém os demais no legado", () => {
    // A lista NÃO é fixada aqui: enumerar o conjunto e afirmar sua composição
    // faria este teste quebrar a cada promoção legítima, treinando quem lê a
    // "consertar" o teste sem pensar. Quem trava a composição é o contrato do
    // canário, que exige registro para cada nó promovido.
    expect(COMPOSER_CANARIES.size).toBeGreaterThan(0);
    for (const id of COMPOSER_CANARIES) {
      expect(selectGenerator(id, undefined, fallback).source(), id).toBe("composer");
    }
    expect(COMPOSER_CANARIES.has("N3.11"), "N3.11 não deve estar promovido").toBe(false);
    expect(selectGenerator("N3.11", gN3_11, fallback).source()).toBe("legacy");
  });

  it("classifica implementação ausente como fallback", () => {
    expect(selectGenerator("desconhecido", undefined, fallback).source()).toBe("fallback");
  });

  // O id do nó sem ficha NÃO é escrito à mão. A primeira versão deste teste
  // fixava "N4.02" como exemplo; no dia em que a N4.02 ganhou ficha e foi
  // promovida, o teste passou a reprovar por envelhecimento — não por defeito.
  // O contrato não fala de um nó, fala de qualquer nó sem ficha: então o teste
  // pergunta ao catálogo quem ainda não tem, e acrescenta um id sintético para
  // continuar observando alguma coisa mesmo no dia em que todas as 90 tiverem
  // ficha registrada.
  it("recusa ativar canário de nó sem ficha autoral registrada", () => {
    const semFicha = ALL_MATH_TRACKS.map(t => t.id).filter(id => !hasComposerFicha(id));
    const alvos = [...semFicha, "nó-que-não-existe"];

    for (const id of alvos) {
      expect(() => enableComposerCanary(id), id).toThrow(/ficha autoral/);
      expect(COMPOSER_CANARIES.has(id), `${id} entrou no conjunto mesmo sem ficha`).toBe(false);
    }
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
