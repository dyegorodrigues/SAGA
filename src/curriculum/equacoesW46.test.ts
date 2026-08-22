import { afterEach, describe, expect, it } from "vitest";
import { JOURNEY_FICHAS } from "./fichas";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";
import { isCanonicalMisconceptionTag } from "./motores/radarEngine";

describe("W46 regression-first — AL.08/F90 Equações", () => {
  afterEach(() => rollbackComposerCanary("AL.08"));

  it("parte do fallback com o DAG vivo satisfeito e exige a F90 inteira antes da promoção", () => {
    rollbackComposerCanary("AL.08");
    expect(getTrackById("AL.08")?.prereqs).toEqual(["AL.07", "N7.02"]);
    expect(getTrackById("AL.08")?.generatorSource).toBe("fallback");

    // Regression-first deliberado: hoje AL.08/F90 ainda não existe na Journey.
    // A primeira falha deve permanecer exatamente aqui até a materialização inativa.
    const ficha = JOURNEY_FICHAS.find(item => item.id === "AL.08");
    expect(ficha).toBeDefined();

    expect(ficha?.nome).toBe("Equações");
    expect(ficha?.prereqs).toEqual(["AL.07", "N7.02"]);
    expect(hasComposerFicha("AL.08")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("AL.08")).toBe("equacoes-f90");

    enableComposerCanary("AL.08");
    const tags = new Set<string>();
    let viuCoeficienteOuAcima = false;

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("AL.08", nivel);
      const spec = q.uiProps as any;

      expect(q.kind).toBe("equacoes-f90");
      expect(spec.nivel).toBe(nivel);
      expect(spec.primitivas).toEqual(["Balanca"]);
      expect(spec.equilibrioFisico).toBe(true);
      expect(spec.acessibilidade?.alvoMinPx).toBeGreaterThanOrEqual(80);
      expect(spec.acessibilidade?.semArrastoObrigatorio).toBe(true);
      expect(q.masteryRule).toMatchObject({ acertos: 4, de: 4, sessoes: 3 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.rt_max_s).toBeUndefined();

      if (nivel >= 3 && q.exigeEvidencia) viuCoeficienteOuAcima = true;
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    expect(viuCoeficienteOuAcima, "F90 precisa provar domínio com pelo menos um caso de coeficiente (L3) ou acima").toBe(true);
    expect(tags).toEqual(new Set([
      "quebra-equilibrio",
      "operacao-inversa-errada",
      "nao-aplica-aos-dois",
      "responde-o-todo",
    ]));
    for (const tag of tags) expect(isCanonicalMisconceptionTag(tag), `F90 tag fora do Radar: ${tag}`).toBe(true);

    const resolucoes = [1, 2, 3, 4, 5].map(nivel => JSON.stringify(generateRegisteredFichaQuestion("AL.08", nivel).resolucao));
    expect(resolucoes[0]).toMatch(/equil|dois lados|tir|remov|invers/i);
    expect(resolucoes[1]).toMatch(/equil|dois lados|som|adicion|invers/i);
    expect(resolucoes[2]).toMatch(/2x|coeficiente|divid|dois lados|equil/i);
    expect(resolucoes[3]).toMatch(/dois passos|invers|dois lados|equil|isol/i);
    expect(resolucoes[4]).toMatch(/x.*dois lados|incógnita|incognita|equil|isol/i);
  });
});
