import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import { enableComposerCanary, generateRegisteredFichaQuestion, hasComposerFicha, rollbackComposerCanary } from "./motores/composerCanary";

describe("W24 — N7.01/F84 reta completa", () => {
  afterEach(() => rollbackComposerCanary("N7.01"));
  it("nasce do fallback com os prereqs do DAG vivo", () => {
    rollbackComposerCanary("N7.01");
    expect(getTrackById("N7.01")?.prereqs).toEqual(["N1.12", "N3.04"]);
    expect(getTrackById("N7.01")?.generatorSource).toBe("fallback");
    expect(getTrackById("N7.01")?.contentStatus).toBe("fallback");
  });
  it("materializa a escada F84 pela porta registrada do Composer", () => {
    expect(hasComposerFicha("N7.01")).toBe(true);
    enableComposerCanary("N7.01");
    const qs = [1,2,3,4,5].map(level => generateRegisteredFichaQuestion("N7.01", level));
    expect(qs.map(q => q.kind)).toEqual(Array(5).fill("reta-completa-f84"));
    expect(qs.map(q => q.uiProps?.modo)).toEqual(["localizar", "comparar-negativos", "ordenar-mistos", "distancia", "modulo"]);
    for (const q of qs) {
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.options?.filter(option => option.value === q.answer)).toHaveLength(1);
      expect(q.resolucao?.fallback).toBe(0);
      expect(q.masteryRule).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
    }
  });
  it("mantém os três diagnósticos centrais da F84 exercitáveis", () => {
    enableComposerCanary("N7.01");
    const tags = new Set<string>();
    for (let nivel=1;nivel<=5;nivel+=1) for (const option of generateRegisteredFichaQuestion("N7.01", nivel).options ?? []) if (option.misconception) tags.add(option.misconception);
    expect(tags).toEqual(new Set(["negativo-como-positivo", "zero-como-passo", "lado-errado"]));
  });
});
