import { afterEach, describe, expect, it } from "vitest";
import {
  COMPOSER_CANARIES,
  enableComposerCanary,
  rollbackComposerCanary,
} from "./composerCanary";
import { getTrackById } from "./curriculum";

/**
 * W7 — N2.02 / F36, regression-first.
 *
 * O legado responde "que número é esse?" com material de dezenas/unidades. A
 * F36 normativa é outra competência em ação: a criança lê a malha 10×10 e
 * PRODUZ o percurso (+1, +10, +5, vizinhos e lacunas) tocando as casas.
 *
 * O canário default deve continuar inativo até contrato, palco, onboarding e
 * Chrome real fecharem. O teste usa a mesma porta temporária de produção para
 * provar a implementação registrada sem criar dispatch paralelo de teste.
 */
const CANARIOS_ORIGINAIS = [...COMPOSER_CANARIES];

function questao(level: number) {
  return getTrackById("N2.02")!.gen(level);
}

describe("W7 N2.02 — Quadrado100 F36", () => {
  afterEach(() => {
    COMPOSER_CANARIES.clear();
    for (const id of CANARIOS_ORIGINAIS) COMPOSER_CANARIES.add(id);
  });

  it("antes da promoção continua servido pelo legado", () => {
    rollbackComposerCanary("N2.02");
    expect(getTrackById("N2.02")?.generatorSource).toBe("legacy");
    expect(questao(2).kind).toBe("tens");
  });

  it("a porta de canário entrega kind especializado sem criar hundred-chart genérico", () => {
    expect(() => enableComposerCanary("N2.02")).not.toThrow();
    expect(getTrackById("N2.02")?.generatorSource).toBe("composer");
    expect(questao(2).kind).toBe("quadrado100-f36");
  });

  it("materializa a escada F36 nos cinco níveis", () => {
    enableComposerCanary("N2.02");
    expect((questao(1).uiProps as { modo: string }).modo).toBe("linha");
    expect((questao(2).uiProps as { modo: string }).modo).toBe("vertical");
    expect((questao(3).uiProps as { modo: string }).modo).toBe("cinco");
    expect((questao(4).uiProps as { modo: string }).modo).toBe("vizinho");
    expect((questao(5).uiProps as { modo: string }).modo).toBe("lacunas");
  });

  it("a progressão usa a geometria do quadro, não opções numéricas", () => {
    enableComposerCanary("N2.02");
    for (let level = 1; level <= 5; level += 1) {
      const q = questao(level);
      const spec = q.uiProps as {
        inicio: number;
        caminho: number[];
        casasOcultas: number[];
      };
      expect(q.options).toBeUndefined();
      expect(spec.inicio).toBeGreaterThanOrEqual(1);
      expect(spec.inicio).toBeLessThanOrEqual(100);
      expect(spec.caminho.length).toBeGreaterThan(0);
      expect(spec.casasOcultas.length).toBeGreaterThan(0);
      expect(spec.caminho.every(n => n >= 1 && n <= 100)).toBe(true);
      expect(q.evaluate?.(q.answer)).toBe(true);
    }
  });

  it("o nível 2 é vertical de verdade: mesma unidade, +10 a cada toque", () => {
    enableComposerCanary("N2.02");
    for (let i = 0; i < 40; i += 1) {
      const spec = questao(2).uiProps as { inicio: number; caminho: number[] };
      const percurso = [spec.inicio, ...spec.caminho];
      for (let j = 1; j < percurso.length; j += 1) {
        expect(percurso[j] - percurso[j - 1]).toBe(10);
        expect(percurso[j] % 10).toBe(percurso[0] % 10);
      }
    }
  });

  it("o onboarding da estreia é runtime explícito e domínio exige percurso vertical", () => {
    enableComposerCanary("N2.02");
    const q1 = questao(1);
    const q2 = questao(2);
    expect(q1.tutorial?.length).toBeGreaterThan(0);
    expect(q1.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
    expect(q2.exigeEvidencia).toBe("percurso-vertical-quadrado100");
  });
});
