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

describe("W45 regression-first — N6.04/F88 Razão e Proporção", () => {
  afterEach(() => rollbackComposerCanary("N6.04"));

  it("parte do fallback com o DAG vivo satisfeito e exige a F88 inteira antes da promoção", () => {
    rollbackComposerCanary("N6.04");
    expect(getTrackById("N6.04")?.prereqs).toEqual(["N6.03", "N4.06"]);
    expect(getTrackById("N6.04")?.generatorSource).toBe("fallback");

    const ficha = JOURNEY_FICHAS.find(item => item.id === "N6.04");
    expect(ficha).toBeDefined();
    expect(hasComposerFicha("N6.04")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("N6.04")).toBe("razao-proporcao-f88");

    enableComposerCanary("N6.04");
    const modos = ["dobrar", "triplicar", "escala-geral", "razao-fracao", "regra-de-tres"];
    const tags = new Set<string>();
    let viuEscalaNaoInteira = false;

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("N6.04", nivel);
      const spec = q.uiProps as any;
      expect(q.kind).toBe("razao-proporcao-f88");
      expect(spec.nivel).toBe(nivel);
      expect(spec.modo).toBe(modos[nivel - 1]);
      expect(spec.primitivas).toEqual(["SingaporeBars"]);
      expect(spec.barrasVinculadas).toBe(true);
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      viuEscalaNaoInteira ||= Boolean(
        spec.escalaNaoInteira ||
        q.exigeEvidencia === "escala-nao-inteira-f88" ||
        (typeof spec.fatorEscala === "number" && !Number.isInteger(spec.fatorEscala)),
      );
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    expect(viuEscalaNaoInteira, "F88 precisa provar domínio com pelo menos uma escala não-inteira").toBe(true);
    expect(tags).toEqual(new Set(["soma-em-vez-de-escalar", "escala-um-lado", "inverte-razao"]));
    for (const tag of tags) expect(isCanonicalMisconceptionTag(tag), `F88 tag fora do Radar: ${tag}`).toBe(true);

    expect(JSON.stringify(generateRegisteredFichaQuestion("N6.04", 1).resolucao)).toMatch(/dobr|duas|2|escala|crescem juntos/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N6.04", 2).resolucao)).toMatch(/trip|três|tres|3|escala|crescem juntos/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N6.04", 3).resolucao)).toMatch(/escala|fator|propor|crescem juntos/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N6.04", 4).resolucao)).toMatch(/razão|razao|fração|fracao|relação|relacao/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N6.04", 5).resolucao)).toMatch(/regra de três|regra de tres|propor|equival|escala/i);
  });
});
