import { afterEach, describe, expect, it } from "vitest";
import { getTrackById } from "./motores/curriculum";
import {
  enableComposerCanary, generateRegisteredFichaQuestion, hasComposerFicha,
  registeredFichaRuntimeKindOverride, rollbackComposerCanary,
} from "./motores/composerCanary";
import { porExtenso } from "./procedimentos/queHorasSaoContract";
import type { QueHorasSaoF55Spec } from "./procedimentos/queHorasSaoContract";

/**
 * W65 regression-first — GM.04/F55 Que Horas São.
 *
 * O que este teste guarda antes de tudo é a **DECISAO-001**: esta competência é
 * a hora cheia e a meia hora, e os minutos são da GM.06. Um nível que sortear
 * qualquer outro valor de minuto está saindo do escopo decidido — e a decisão
 * tem caminho de volta documentado, mas não tem porta dos fundos.
 */
describe("W65 regression-first — GM.04/F55 Que Horas São", () => {
  afterEach(() => rollbackComposerCanary("GM.04"));

  it("parte do fallback com a ficha registrada e o kind próprio", () => {
    rollbackComposerCanary("GM.04");
    expect(getTrackById("GM.04")?.prereqs).toEqual(["N1.06"]);
    expect(hasComposerFicha("GM.04")).toBe(true);
    expect(registeredFichaRuntimeKindOverride("GM.04")).toBe("que-horas-sao-f55");
  });

  it("nenhum nível sai do escopo da DECISAO-001: só hora cheia e meia hora", () => {
    enableComposerCanary("GM.04");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 60; amostra += 1) {
        const q = generateRegisteredFichaQuestion("GM.04", nivel);
        const spec = q.uiProps as QueHorasSaoF55Spec;

        expect(q.kind).toBe("que-horas-sao-f55");
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(
          [0, 30],
          `L${nivel} sorteou ${spec.minutos} minutos: os minutos são da GM.06`,
        ).toContain(spec.minutos);
        expect(spec.horas).toBeGreaterThanOrEqual(1);
        expect(spec.horas).toBeLessThanOrEqual(12);
        expect(q.options?.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("a escada: hora cheia, meia hora, misturado, problema e palavras", () => {
    enableComposerCanary("GM.04");
    const modos = ["hora-cheia", "meia-hora", "misturado", "problema-de-horas", "em-palavras"];
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 30; amostra += 1) {
        const spec = generateRegisteredFichaQuestion("GM.04", nivel).uiProps as QueHorasSaoF55Spec;
        expect(spec.modo).toBe(modos[nivel - 1]);
        if (nivel === 1) expect(spec.minutos, "o L1 é só hora cheia").toBe(0);
        if (nivel === 2) expect(spec.minutos, "o L2 é só meia hora").toBe(30);
        if (nivel === 4) {
          // O problema avança horas INTEIRAS: meia hora sairia do escopo.
          expect(spec.minutos).toBe(0);
          expect(spec.horasFinais).toBe(spec.horas + (spec.avanco ?? 0));
        }
      }
    }
  });

  it("o erro da meia hora está na barra: às três e meia, quatro e meia é oferecido", () => {
    enableComposerCanary("GM.04");
    for (let amostra = 0; amostra < 40; amostra += 1) {
      const q = generateRegisteredFichaQuestion("GM.04", 2);
      const spec = q.uiProps as QueHorasSaoF55Spec;
      const seguinte = `${spec.horas === 12 ? 1 : spec.horas + 1}:30`;
      const arredondou = (q.options ?? []).find(o => o.value === seguinte);
      expect(arredondou?.misconception, "o erro do nível precisa estar etiquetado").toBe("meia-hora-arredonda");
    }
  });

  it("os níveis que misturam exigem as duas leituras", () => {
    enableComposerCanary("GM.04");
    for (const nivel of [3, 5]) {
      const familias = new Set<string>();
      for (let amostra = 0; amostra < 80; amostra += 1) {
        const q = generateRegisteredFichaQuestion("GM.04", nivel);
        familias.add(String(q.evidenciaDeFamilia));
        expect(q.masteryRule?.evidenciasDistintas).toMatchObject({ prefixo: "familia:GM.04:", minimo: 2 });
      }
      expect(familias).toEqual(new Set(["familia:GM.04:hora-cheia", "familia:GM.04:meia-hora"]));
    }
    for (const nivel of [1, 2, 4]) {
      const q = generateRegisteredFichaQuestion("GM.04", nivel);
      expect(q.evidenciaDeFamilia, `L${nivel} tem leitura fixa`).toBeUndefined();
    }
  });

  it("escreve a hora como se fala", () => {
    expect(porExtenso(3, 0)).toBe("3 horas");
    expect(porExtenso(3, 30)).toBe("3 e meia");
    expect(porExtenso(12, 30)).toBe("12 e meia");
  });
});
