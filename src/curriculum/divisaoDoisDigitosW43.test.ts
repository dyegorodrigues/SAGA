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

describe("W43 regression-first — N4.12/F71 Dividir por Dois Dígitos", () => {
  afterEach(() => rollbackComposerCanary("N4.12"));

  it("parte do fallback com o DAG vivo satisfeito e exige a F71 inteira antes da promoção", () => {
    rollbackComposerCanary("N4.12");
    expect(getTrackById("N4.12")?.prereqs).toEqual(["N4.10", "N2.04"]);
    expect(getTrackById("N4.12")?.generatorSource).toBe("fallback");

    const ficha = JOURNEY_FICHAS.find(item => item.id === "N4.12");
    expect(ficha).toBeDefined();
    expect(hasComposerFicha("N4.12")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("N4.12")).toBe("divisao-dois-digitos-f71");

    enableComposerCanary("N4.12");
    const modos = ["divisor-redondo", "divisor-quase-redondo", "divisor-geral", "com-resto", "zero-quociente"];
    const tags = new Set<string>();
    let viuAjusteObrigatorio = false;

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("N4.12", nivel);
      const spec = q.uiProps as any;
      expect(q.kind).toBe("divisao-dois-digitos-f71");
      expect(spec.nivel).toBe(nivel);
      expect(spec.modo).toBe(modos[nivel - 1]);
      expect(spec.primitivas).toEqual(["InteractiveVertical"]);
      expect(spec.acessibilidade).toMatchObject({ toqueAlternativo: true, snapGeneroso: true, alvoMinPx: 80, erroMotorNaoTag: true });
      expect(q.masteryRule).toMatchObject({ acertos: 4, de: 4, sessoes: 3 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      expect(JSON.stringify(q.resolucao)).toMatch(/estim|arredond|teste|multiplic|ajust|cabe|passou/i);
      viuAjusteObrigatorio ||= Boolean(spec.ajustePrimeiraEstimativaObrigatorio || q.exigeEvidencia === "ajuste-primeira-estimativa-f71");
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    expect(viuAjusteObrigatorio).toBe(true);
    expect(tags).toEqual(new Set(["nao-estima", "nao-ajusta", "resto-maior-ou-igual-divisor"]));
    for (const tag of tags) expect(isCanonicalMisconceptionTag(tag), `F71 tag fora do Radar: ${tag}`).toBe(true);

    expect(JSON.stringify(generateRegisteredFichaQuestion("N4.12", 1).resolucao)).toMatch(/20|30|redond|estim/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N4.12", 2).resolucao)).toMatch(/19|21|quase|arredond|ajust/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N4.12", 3).resolucao)).toMatch(/estim|teste|ajust/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N4.12", 4).resolucao)).toMatch(/resto|menor.*divisor|divisor.*resto/i);
    expect(JSON.stringify(generateRegisteredFichaQuestion("N4.12", 5).resolucao)).toMatch(/zero|quociente|posição|posicao/i);
  });
});
