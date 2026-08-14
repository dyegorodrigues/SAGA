import { describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "./motores/composerCanary";

const EVIDENCIA_L4 = "partes-iguais-corte-nivel-4";

describe("W15 regression-first — N5.01/F45 partes iguais", () => {
  it("parte do fallback real com o prerequisito servido do DAG", () => {
    const track = getTrackById("N5.01");
    expect(track?.generatorSource).toBe("fallback");
    expect(track?.contentStatus).toBe("fallback");
    expect(track?.prereqs).toEqual(["N4.05"]);
  });

  it("materializa a escada canônica completa antes de permitir promoção", () => {
    expect(hasComposerFicha("N5.01"), "N5.01 ainda não está registrada no Composer").toBe(true);

    const questoes = [1, 2, 3, 4, 5].map(nivel => generateRegisteredFichaQuestion("N5.01", nivel));
    expect(questoes.map(q => q.kind)).toEqual(Array(5).fill("partes-iguais-f45"));
    expect(questoes.map(q => q.uiProps?.modo)).toEqual([
      "reconhecer",
      "sobrepor",
      "nomear",
      "produzir",
      "simbolo",
    ]);
    expect(questoes.map(q => q.uiProps?.suporte)).toEqual([
      "circulo",
      "circulo",
      "barra",
      "barra",
      "barra",
    ]);

    for (const q of questoes) {
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.exigeEvidencia).toBe(EVIDENCIA_L4);
    }

    expect(questoes[0].uiProps?.partesIguais).toBeTypeOf("boolean");
    expect(questoes[1].uiProps?.sobrepor).toBe(true);
    expect([2, 3, 4]).toContain(questoes[2].uiProps?.denominador);
    expect(questoes[3].uiProps?.cortesAlvo).toHaveLength(questoes[3].uiProps?.denominador - 1);
    expect(questoes[3].uiProps?.toqueAlternativo).toBe(true);
    expect(["1/2", "1/3", "1/4"]).toContain(questoes[4].answer);
  });
});
