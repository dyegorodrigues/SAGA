import { describe, expect, it } from "vitest";
import { N3_02 } from "../fichas/jornada/N3.02";
import { construirEmojiRowRiscarQuestion } from "./emojiRowRiscarContract";

describe("emojiRowRiscarContract — F15", () => {
  it("gera 60 questões válidas por nível sem ambiguidade entre removido e restante", () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let i = 0; i < 60; i += 1) {
        const q = construirEmojiRowRiscarQuestion(N3_02, nivel);
        expect(q.kind).toBe("emojirow-riscar-f15");
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(q.options?.length).toBeGreaterThanOrEqual(2);
        expect(q.options?.length).toBeLessThanOrEqual(6);
        expect(q.uiProps.remover).not.toBe(q.uiProps.restante);
        expect(q.uiProps.total).toBe(q.uiProps.remover + q.uiProps.restante);
      }
    }
  });

  it("abre o primeiro contato alfabetizando o modo, antes da cobrança", () => {
    const q = construirEmojiRowRiscarQuestion(N3_02, 1);
    expect(q.tutorial?.[0]).toMatchObject({ show: { alfabetizarModo: "riscar", marcarIndice: 0 } });
  });

  it("preserva a escada X → fantasma → pré-riscado → símbolo e rt FD3 de 4s", () => {
    expect(construirEmojiRowRiscarQuestion(N3_02, 1).uiProps.representacao).toBe("x");
    expect(construirEmojiRowRiscarQuestion(N3_02, 3).uiProps.representacao).toBe("fantasma");
    expect(construirEmojiRowRiscarQuestion(N3_02, 4).uiProps.representacao).toBe("pre-riscado");
    const l5 = construirEmojiRowRiscarQuestion(N3_02, 5);
    expect(l5.uiProps.representacao).toBe("simbolo");
    expect(l5.rt_max_s).toBe(4);
  });
});
