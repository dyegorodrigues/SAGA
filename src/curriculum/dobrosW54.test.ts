import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary,
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
  rollbackComposerCanary,
} from "./motores/composerCanary";
import type { DobrosF32Spec } from "./procedimentos/dobrosContract";

/**
 * W54 regression-first — N3.06/F32 Dobros e Quase-Dobros.
 *
 * O que a F32 promete: o dobro como âncora memorizada, o quase-dobro como
 * dedução a partir dela, e — no §9, com todas as letras — que só dobros não
 * prova a estratégia.
 */
describe("W54 regression-first — N3.06/F32 Dobros e Quase-Dobros", () => {
  afterEach(() => rollbackComposerCanary("N3.06"));

  it("parte do fallback com a ficha registrada e o kind próprio", () => {
    rollbackComposerCanary("N3.06");
    expect(getTrackById("N3.06")?.prereqs).toEqual(["N3.03"]);
    expect(hasComposerFicha("N3.06")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("N3.06")).toBe("dobros-f32");
  });

  it("materializa a escada: dobro pequeno, dobro grande, quase-dobro com e sem apoio, mistura", () => {
    enableComposerCanary("N3.06");
    const modos = ["dobro-pequeno", "dobro-grande", "quase-dobro-com-apoio", "quase-dobro-sem-apoio", "misto"];

    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 40; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N3.06", nivel);
        const spec = q.uiProps as DobrosF32Spec;

        expect(q.kind).toBe("dobros-f32");
        expect(spec.modo).toBe(modos[nivel - 1]);
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(spec.resposta).toBe(spec.ancora + spec.segunda);
        expect(spec.dobroAncora).toBe(spec.ancora * 2);
        expect(spec.segunda).toBe(spec.ancora + spec.extra);

        // O degrau entre L1 e L2 é de tamanho, e as faixas não se sobrepõem —
        // senão o L2 seria o L1 outra vez.
        if (nivel === 1) expect(spec.ancora).toBeLessThanOrEqual(5);
        if (nivel === 2) expect(spec.ancora).toBeGreaterThan(5);

        // L1 e L2 são só dobros; L3 e L4 são só quase-dobros; L5 mistura.
        if (nivel <= 2) expect(spec.extra, `L${nivel} devia ser dobro puro`).toBe(0);
        if (nivel === 3) expect(spec.extra, "o L3 é só o mais-um").toBe(1);
        if (nivel === 4) expect(Math.abs(spec.extra), "o L4 é quase-dobro nos dois sentidos").toBe(1);

        // O apoio escrito é do L3 e só dele: é o degrau que ele oferece.
        expect(spec.mostrarApoio).toBe(nivel === 3);

        // Chutar não pode ser meio a meio.
        expect(q.options?.length, `L${nivel} ficou com poucas alternativas`).toBeGreaterThanOrEqual(3);
        const valores = (q.options ?? []).map(o => o.value);
        expect(new Set(valores).size).toBe(valores.length);
      }
    }
  });

  it("o dobro-âncora nunca é a resposta do quase-dobro — senão o erro-alvo acertaria", () => {
    enableComposerCanary("N3.06");
    for (const nivel of [3, 4]) {
      for (let amostra = 0; amostra < 40; amostra += 1) {
        const q = generateRegisteredFichaQuestion("N3.06", nivel);
        const spec = q.uiProps as DobrosF32Spec;
        expect(spec.dobroAncora, "responder o dobro é o erro ESQUECEU_O_EXTRA").not.toBe(spec.resposta);
        const esqueceu = (q.options ?? []).find(o => o.value === spec.dobroAncora);
        expect(esqueceu?.misconception, "o dobro precisa estar na barra, etiquetado").toBe("esqueceu-o-extra");
      }
    }
  });

  it("o nível que mistura exige as duas famílias, e só ele", () => {
    enableComposerCanary("N3.06");
    const familias = new Set<string>();
    for (let amostra = 0; amostra < 80; amostra += 1) {
      const q = generateRegisteredFichaQuestion("N3.06", 5);
      familias.add(String(q.evidenciaDeFamilia));
      expect(q.masteryRule?.evidenciasDistintas).toMatchObject({ prefixo: "familia:N3.06:", minimo: 2 });
    }
    expect(familias).toEqual(new Set(["familia:N3.06:dobro", "familia:N3.06:quase-dobro"]));

    // Nos níveis 3 e 4 todo caso já é quase-dobro: exigir duas famílias ali
    // seria pedir uma diversidade que o próprio nível não oferece.
    for (const nivel of [1, 2, 3, 4]) {
      const q = generateRegisteredFichaQuestion("N3.06", nivel);
      expect(q.masteryRule?.evidenciasDistintas, `L${nivel} não mistura famílias`).toBeUndefined();
    }
  });
});
