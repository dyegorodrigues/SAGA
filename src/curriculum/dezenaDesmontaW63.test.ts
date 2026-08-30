import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary, generateRegisteredFichaQuestion, hasComposerFicha,
  registeredFichaRuntimeKindOverride, rollbackComposerCanary,
} from "./motores/composerCanary";
import type { DezenaDesmontaF40Spec } from "./procedimentos/dezenaDesmontaContract";

/**
 * W63 regression-first — N3.12/F40 A Dezena Desmonta.
 *
 * O invariante que faz a ficha existir: as unidades do topo NUNCA chegam para
 * tirar as da base. Sem o impasse não há empréstimo, e o nível vira a N3.09
 * outra vez.
 */
describe("W63 regression-first — N3.12/F40 A Dezena Desmonta", () => {
  afterEach(() => rollbackComposerCanary("N3.12"));

  it("parte do fallback com a ficha registrada e o kind próprio", () => {
    rollbackComposerCanary("N3.12");
    expect(getTrackById("N3.12")?.prereqs).toEqual(["N3.11", "N3.08"]);
    expect(hasComposerFicha("N3.12")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("N3.12")).toBe("dezena-desmonta-f40");
  });

  it("sempre há impasse nas unidades — senão não há empréstimo a ensinar", () => {
    enableComposerCanary("N3.12");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 50; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N3.12", nivel);
        const spec = q.uiProps as DezenaDesmontaF40Spec;

        expect(q.kind).toBe("dezena-desmonta-f40");
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(spec.resposta).toBe(spec.topo - spec.base);
        expect(spec.resposta, "o resultado precisa ser positivo").toBeGreaterThan(0);
        expect(
          spec.topo % 10,
          `sem impasse não há o que desmontar: ${spec.topo} − ${spec.base}`,
        ).toBeLessThan(spec.base % 10);

        expect(q.options?.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("a escada vai do material à conta seca, e o zero no meio é do último nível", () => {
    enableComposerCanary("N3.12");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 20; amostra += 1) {
        const spec = generateRegisteredFichaQuestion("N3.12", nivel).uiProps as DezenaDesmontaF40Spec;
        expect(spec.mostrarMaterial, `L${nivel}: o material vai até o L3`).toBe(nivel <= 3);
        expect(spec.zeroNoMeio, `L${nivel}: o zero no meio é só do L5`).toBe(nivel === 5);
        // L1 e L2 são dois dígitos menos um; L3 e L4, dois menos dois.
        if (nivel <= 2) expect(spec.base, `L${nivel} subtrai um algarismo`).toBeLessThan(10);
        if (nivel === 3 || nivel === 4) expect(spec.base, `L${nivel} subtrai dois algarismos`).toBeGreaterThanOrEqual(10);
        if (nivel === 5) {
          expect(Math.floor((spec.topo % 100) / 10), "o L5 tem zero na coluna do meio").toBe(0);
          expect(spec.topo).toBeGreaterThanOrEqual(200);
        }
      }
    }
  });

  it("os três erros da ficha estão na barra, com nome", () => {
    enableComposerCanary("N3.12");
    const vistos = new Set<string>();
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 30; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N3.12", nivel);
        for (const opcao of q.options ?? []) if (opcao.misconception) vistos.add(String(opcao.misconception));
        // Devolver o minuendo é sempre uma alternativa, e nunca a certa.
        const travou = (q.options ?? []).find(o => o.value === (q.uiProps as DezenaDesmontaF40Spec).topo);
        expect(travou?.misconception, "travar no impasse precisa ser diagnosticável").toBe("nao-operou");
      }
    }
    expect(vistos).toEqual(new Set(["subtrai-invertido", "nao-paga-emprestimo", "nao-operou"]));
  });
});
