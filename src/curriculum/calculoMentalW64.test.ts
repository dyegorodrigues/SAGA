import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary, generateRegisteredFichaQuestion, hasComposerFicha,
  registeredFichaRuntimeKindOverride, rollbackComposerCanary,
} from "./motores/composerCanary";
import type { CalculoMentalF41Spec } from "./procedimentos/calculoMentalContract";

/**
 * W64 regression-first — N3.13/F41 Cálculo Mental e Estimativa.
 *
 * Estimativa é o mecanismo de autocorreção. O que este teste cobra é que a
 * estimativa e o exato sejam coisas diferentes e distinguíveis, que o nível do
 * absurdo ofereça de fato um valor longe demais, e que a reta só apareça onde
 * ela é ferramenta — porque onde não é, ela vazava a resposta por acidente.
 */
describe("W64 regression-first — N3.13/F41 Cálculo Mental e Estimativa", () => {
  afterEach(() => rollbackComposerCanary("N3.13"));

  it("parte do fallback com a ficha registrada e o kind próprio", () => {
    rollbackComposerCanary("N3.13");
    expect(getTrackById("N3.13")?.prereqs).toEqual(["N3.11", "N3.12"]);
    expect(hasComposerFicha("N3.13")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("N3.13")).toBe("calculo-mental-f41");
  });

  it("a estimativa é feita de dezenas redondas, e o exato não é ela", () => {
    enableComposerCanary("N3.13");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 40; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N3.13", nivel);
        const spec = q.uiProps as CalculoMentalF41Spec;

        expect(q.kind).toBe("calculo-mental-f41");
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(spec.aRedondo % 10, "arredondar dá dezena redonda").toBe(0);
        expect(spec.a % 10, "número já redondo não dá o que arredondar").not.toBe(0);
        if (spec.b !== undefined) {
          expect(spec.b % 10).not.toBe(0);
          expect(spec.exato).toBe(spec.a + spec.b);
          expect(spec.estimativa).toBe(spec.aRedondo + (spec.bRedondo ?? 0));
          expect(spec.estimativa, "estimativa e exato precisam ser distinguíveis").not.toBe(spec.exato);
        }
        expect(q.options?.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("a reta só aparece onde é ferramenta — e onde aparece, a resposta não é uma marca", () => {
    enableComposerCanary("N3.13");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 40; amostra += 1) {
        const spec = generateRegisteredFichaQuestion("N3.13", nivel).uiProps as CalculoMentalF41Spec;
        expect(spec.mostrarReta, `L${nivel}: a reta é do L1 e do L2`).toBe(nivel <= 2);

        if (nivel === 2) {
          // A reta cobre a vizinhança das parcelas; a estimativa precisa ficar
          // fora dela, senão a soma aparece marcada na tela.
          const fim = Math.ceil(Math.max(spec.a, spec.b ?? spec.a) / 10) * 10 + 10;
          expect(spec.estimativa, "a estimativa não pode cair dentro da reta desenhada").toBeGreaterThan(fim);
        }
      }
    }
  });

  it("o absurdo está longe o bastante para ser reconhecido comparando", () => {
    enableComposerCanary("N3.13");
    for (let amostra = 0; amostra < 40; amostra += 1) {
      const q = generateRegisteredFichaQuestion("N3.13", 4);
      const spec = q.uiProps as CalculoMentalF41Spec;
      expect(spec.candidatas).toHaveLength(3);
      expect(spec.candidatas).toContain(spec.exato);
      expect(spec.absurda).toBe(spec.resposta);
      expect(
        Math.abs((spec.absurda ?? 0) - spec.exato),
        "o absurdo precisa estar fora por margem que a estimativa detecte",
      ).toBeGreaterThanOrEqual(30);
      // Apontar o resultado certo como errado é o IGNORA_CONFLITO.
      const errou = (q.options ?? []).find(o => o.value === spec.exato);
      expect(errou?.misconception).toBe("ignora-conflito");
    }
  });
});
