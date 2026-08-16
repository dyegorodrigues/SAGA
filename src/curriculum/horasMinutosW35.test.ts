import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";

describe("W35 regression-first — GM.06/F62 Horas e Minutos", () => {
  afterEach(() => rollbackComposerCanary("GM.06"));

  it("parte do fallback com GM.04 e AL.03 já servidos", () => {
    rollbackComposerCanary("GM.06");
    expect(getTrackById("GM.06")?.prereqs).toEqual(["GM.04", "AL.03"]);
    expect(getTrackById("GM.06")?.generatorSource).toBe("fallback");
    expect(hasComposerFicha("GM.06")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("GM.06")).toBe("horas-minutos-f62");
  });

  it("materializa a escada F62 do relógio à duração sem ativação por efeito colateral", () => {
    enableComposerCanary("GM.06");
    const modos = ["meia-hora-quartos", "cinco-em-cinco-com-apoio", "cinco-em-cinco", "minuto-a-minuto", "duracao"];
    const tags = new Set<string>();

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = generateRegisteredFichaQuestion("GM.06", nivel);
      const spec = q.uiProps as any;
      expect(q.kind).toBe("horas-minutos-f62");
      expect(spec.nivel).toBe(nivel);
      expect(spec.modo).toBe(modos[nivel - 1]);
      expect(spec.primitivas).toEqual(["Relogio", "NumberLine"]);
      expect(q.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.resolucao?.fallback).toBe(0);
      for (const option of q.options ?? []) if (option.misconception) tags.add(option.misconception);
    }

    const l2 = generateRegisteredFichaQuestion("GM.06", 2).uiProps as any;
    expect(l2.intervaloMinutos).toBe(5);
    expect(l2.numeracaoFantasma).toBe(true);

    const l3 = generateRegisteredFichaQuestion("GM.06", 3).uiProps as any;
    expect(l3.intervaloMinutos).toBe(5);
    expect(l3.numeracaoFantasma).toBe(false);

    const l5 = generateRegisteredFichaQuestion("GM.06", 5).uiProps as any;
    expect(l5.duracao).toMatchObject({ inicio: "09:35", fim: "10:50", minutos: 75 });
    expect(l5.saltosHorasAntesDosMinutos).toBe(true);

    expect(tags).toEqual(new Set(["minuto-como-numero", "ignora-hora-na-duracao", "subtrai-decimal"]));
  });
});
