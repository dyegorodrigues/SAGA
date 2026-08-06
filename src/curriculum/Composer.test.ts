import { describe, expect, it } from "vitest";
import { Composer } from "./Composer";
import { MisconceptionTag } from "../constants/misconceptions";
import { N1_01 } from "./fichas/jornada/N1.01";
import { N1_03 } from "./fichas/jornada/N1.03";
import { N1_08 } from "./fichas/jornada/N1.08";
import { N1_04 } from "./fichas/jornada/N1.04";
import { JOURNEY_FICHAS } from "./fichas";
import { N3_09 } from "./fichas/jornada/N3.09";
import { N3_11 } from "./fichas/jornada/N3.11";
import { N4_02 } from "./fichas/jornada/N4.02";

describe("Composer de fichas", () => {
  it("uses the level primitive as the effective builder", () => {
    // O mecanismo: o `niveis[lvl].primitiva` vence o `micro.kinds[0]`. Quem
    // demonstra hoje é o N1.08, servido por DUAS fichas: a JD2 (mão relâmpago,
    // `fileira`) nos níveis 1-2 e a F02 (moldura de dez) nos 3-5. Se o Composer
    // olhasse o micro, os cinco níveis viriam iguais.
    //
    // As primitivas vêm DA FICHA, não escritas aqui: o nome delas é inventário
    // e já mudou uma vez (`tenframe` → `moldura`, quando a F02 ganhou as cinco
    // casas dos níveis 1-2). O que é especificação é o nível mandar (§2-bis).
    for (const lvl of [1, 2, 3, 4, 5]) {
      expect(Composer.generate(N1_08, lvl).kind, `nível ${lvl}`).toBe(N1_08.niveis![lvl].primitiva);
    }
    expect(N1_08.niveis![1].primitiva).not.toBe(N1_08.niveis![3].primitiva);
  });

  it("N1.04 é `touchcount` nos CINCO níveis — a ficha F01 não tem outra primitiva", () => {
    // Este teste checava `tenframe` no nível 3 e `plain` no 4, porque era isso
    // que o runtime servia: a criança olhava uma fileira e escolhia um número.
    // A ficha F01 manda `TouchCount` do começo ao fim — contar é TOCAR. O que
    // muda de nível para nível é o arranjo e o andaime, nunca a primitiva.
    for (let lvl = 1; lvl <= 5; lvl += 1) {
      const q = Composer.generate(N1_04, lvl);
      expect(q.kind, `nível ${lvl}`).toBe("touchcount");
      expect((q.uiProps as { modo?: string }).modo, `nível ${lvl}`).toBe("toque");
    }
  });

  it("normalizes legacy tutorial speech into the runtime contract", () => {
    // A coreografia da JD1 §8, transcrita: o `fala` da ficha vira `say` no
    // runtime, e o `show` chega ao palco.
    const question = Composer.generate(N1_03, 1);
    expect(question.tutorial?.[0]?.say).toBe("Prepare o olho!");
    expect(question.tutorial?.[0]?.show).toEqual({ fixarOlhar: true });
  });

  it("converts the level response-time target from milliseconds to seconds", () => {
    expect(Composer.generate(N1_03, 5).rt_max_s).toBe(1.5);
  });

  it("attaches canonical misconception tags only to matching numeric distractors", () => {
    // ⚠️ Derivado, não fixo. Este teste prendia-se ao N1.08 nível 3, e quebrou
    // quando aquele nível passou a desenhar as próprias alternativas no palco:
    // sem `options`, não havia distrator para conferir. Qual ficha põe números
    // na barra é INVENTÁRIO e muda a cada primitiva nova; a especificação é
    // "onde o Composer emite alternativa numérica, o vizinho n±1 leva a tag da
    // ficha, e a certa não leva nenhuma" (§2-bis).
    const comBanco = JOURNEY_FICHAS
      .flatMap(ficha => [1, 2, 3, 4, 5].map(lvl => ({ ficha, q: Composer.generate(ficha, lvl), lvl })))
      .filter(({ ficha, q }) => typeof q.answer === "number"
        && ficha.distratores?.some(d => /^n\s*[+-]\s*\d+$/.test(d.regra))
        && (q.options ?? []).some(o => typeof o.value === "number"));

    expect(comBanco.length).toBeGreaterThan(0);
    let conferidos = 0;
    for (const { ficha, q, lvl } of comBanco) {
      // O que a ficha promete: valor → tag, montado da mesma regra que o
      // Composer lê.
      const prometido = new Map<number, string>();
      for (const d of ficha.distratores ?? []) {
        const m = d.regra.trim().match(/^n\s*([+-])\s*(\d+)$/);
        if (m) prometido.set((q.answer as number) + Number(m[2]) * (m[1] === "+" ? 1 : -1), d.tag);
      }
      for (const o of q.options ?? []) {
        if (typeof o.value !== "number" || o.value === q.answer) continue;
        const tag = prometido.get(o.value);
        if (tag === undefined) continue;
        expect(o.misconception, `${ficha.id} L${lvl} valor ${o.value}`).toBe(tag);
        conferidos += 1;
      }
      expect(q.options?.find(o => o.value === q.answer)?.misconception, `${ficha.id} L${lvl}`)
        .toBeUndefined();
    }
    // E a tag canônica do vizinho continua sendo o `OFF_BY_ONE` em alguma ficha.
    expect(conferidos).toBeGreaterThan(0);
    expect(JOURNEY_FICHAS.some(f => f.distratores?.some(d =>
      /^n\s*[+-]\s*1$/.test(d.regra) && d.tag === MisconceptionTag.OFF_BY_ONE))).toBe(true);
  });

  it("generates valid answers across every registered Journey ficha and level", () => {
    for (const ficha of JOURNEY_FICHAS) {
      for (let level = 1; level <= 5; level += 1) {
        for (let sample = 0; sample < 10; sample += 1) {
          const question = Composer.generate(ficha, level);
          const declaredKind = ficha.niveis?.[level]?.primitiva ?? ficha.micros[0].kinds[0];
          const renderedKind = declaredKind === "intruso_math"
            ? "plain"
            : declaredKind === "arraygrid" ? "array"
            : declaredKind === "storypanel" ? "story-bars"
            : declaredKind;
          expect(question.kind, `${ficha.id} L${level}`).toBe(renderedKind);
          expect(question.uiProps, `${ficha.id} L${level}`).toBeDefined();
          expect(question.evaluate, `${ficha.id} L${level}`).toBeTypeOf("function");
          expect(question.evaluate?.(question.answer), `${ficha.id} L${level}`).toBe(true);

          if (question.options) {
            const matching = question.options.filter(option => option.value === question.answer);
            expect(matching, `${ficha.id} L${level}`).toHaveLength(1);
          }
        }
      }
    }
  });

  it("requires a positive level-five response-time target in every registered ficha", () => {
    for (const ficha of JOURNEY_FICHAS) {
      expect(ficha.niveis?.[5]?.rt_alvo, ficha.id).toBeGreaterThan(0);
      expect(Composer.generate(ficha, 5).rt_max_s, ficha.id).toBeGreaterThan(0);
    }
  });

  it("fails explicitly instead of returning an invalid question for an unknown builder", () => {
    // A regra é "primitiva sem builder QUEBRA"; o nome usado aqui era só o
    // exemplo — e era `shapecanvas`, que passou a ter builder quando a F47
    // chegou. Um nome impossível por construção mantém a regra viva sem
    // reprovar o dia em que a primitiva de exemplo for implementada (§2-bis).
    const invalid = {
      ...N1_01,
      niveis: { 1: { primitiva: "primitiva-que-nao-existe" as never } },
    };
    expect(() => Composer.generate(invalid, 1, "a")).toThrow(
      "Primitiva primitiva-que-nao-existe ainda não possui builder",
    );
  });

  it("rejects malformed ficha parameters at the Composer boundary", () => {
    const malformed = {
      ...N1_03,
      micros: [{
        ...N1_03.micros[0],
        params: { ...N1_03.micros[0].params, n_min: "um" },
      }],
    };

    expect(() => Composer.generate(malformed, 1, "estreia")).toThrow(
      "Parâmetro n_min inválido em N1.03/estreia",
    );
  });

  it("builds a typed vertical question with a single valid answer", () => {
    const vertical = {
      ...N1_01,
      niveis: { 1: { primitiva: "vertical" as const } },
      micros: [{
        ...N1_01.micros[0],
        kinds: ["vertical" as const],
        params: {
          top_min: 27,
          top_max: 27,
          bottom_min: 5,
          bottom_max: 5,
          operation: "+",
          require_regroup: true,
          audio_prompt: "Vinte e sete mais cinco.",
        },
      }],
    };

    const question = Composer.generate(vertical, 1, vertical.micros[0].id);
    expect(question).toMatchObject({
      kind: "vertical",
      vTop: 27,
      vBot: 5,
      vOp: "+",
      answer: 32,
      audioPrompt: "Vinte e sete mais cinco.",
    });
    expect(question.evaluate?.(32)).toBe(true);
    expect(question.evaluate?.(31)).toBe(false);
  });

  it("rejects an invalid vertical operation at the typed boundary", () => {
    const invalid = {
      ...N1_01,
      niveis: { 1: { primitiva: "vertical" as const } },
      micros: [{
        ...N1_01.micros[0],
        kinds: ["vertical" as const],
        params: { operation: "×" },
      }],
    };
    expect(() => Composer.generate(invalid, 1, invalid.micros[0].id)).toThrow(
      "Parâmetro operation inválido",
    );
  });

  it("builds F39 with an explicit regrouping bridge and double regrouping at level 5", () => {
    for (let level = 1; level <= 5; level += 1) {
      for (let sample = 0; sample < 200; sample += 1) {
        const question = Composer.generate(N3_11, level);
        expect(question.kind).toBe("vertical");
        expect(question.vOp).toBe("+");
        expect((question.vTop! % 10) + (question.vBot! % 10)).toBeGreaterThanOrEqual(10);
        expect(question.answer).toBe(question.vTop! + question.vBot!);
        expect(question.answer).toBeLessThanOrEqual(level === 5 ? 999 : 99);
        if (level <= 2) {
          expect(question.uiProps).toMatchObject({ showPlaceValue: true, showRegroup: true });
        } else if (level >= 4) {
          expect(question.uiProps).toMatchObject({ showPlaceValue: undefined, showRegroup: undefined });
        }
        if (level <= 2) expect(question.uiProps.showAlgorithm).toBe(false);
        if (level === 3) expect(question.uiProps).toMatchObject({
          showPlaceValue: true,
          showRegroup: undefined,
          showAlgorithm: undefined,
        });
        if (level === 5) {
          const unitCarry = 1;
          const tens = Math.floor(question.vTop! / 10) % 10;
          const otherTens = Math.floor(question.vBot! / 10) % 10;
          expect(tens + otherTens + unitCarry).toBeGreaterThanOrEqual(10);
        }
      }
    }
    expect(Composer.generate(N3_11, 5).rt_max_s).toBe(12);
  });

  it("follows the five authored N3.09 progressions without regrouping", () => {
    const operations = new Set<string>();

    for (let level = 1; level <= 5; level += 1) {
      for (let sample = 0; sample < 100; sample += 1) {
        const question = Composer.generate(N3_09, level);
        const top = question.vTop!;
        const bottom = question.vBot!;
        const operation = question.vOp!;
        operations.add(operation);

        expect(question.kind).toBe("vertical");
        expect(question.evaluate?.(question.answer)).toBe(true);
        const unitsResult = operation === "+" ? top % 10 + bottom % 10 : top % 10 - bottom % 10;
        if (operation === "+") expect(unitsResult).toBeLessThan(10);
        else expect(unitsResult).toBeGreaterThanOrEqual(0);
        expect(question.answer as number).toBeLessThanOrEqual(100);
        expect(question.answer as number).toBeGreaterThanOrEqual(0);

        if (level === 1) {
          expect(top % 10).toBe(0);
          expect(bottom % 10).toBe(0);
        }
        if (level <= 3) expect(question.uiProps.showPlaceValue).toBe(true);
        if (level === 1) expect(question.uiProps.showAlgorithm).toBe(false);
        if (level === 4) expect(operation).toBe("-");
      }
    }

    expect(operations).toEqual(new Set(["+", "-"]));
    expect(Composer.generate(N3_09, 5).rt_max_s).toBe(8);
  });

  it("normaliza arraygrid para array e respeita os cinco degraus autorais", () => {
    for (let level = 1; level <= 5; level += 1) {
      const question = Composer.generate(N4_02, level);
      expect(question.kind).toBe("array");
      expect(question.uiProps.rows).toBeGreaterThanOrEqual(1);
      expect(question.uiProps.rows).toBeLessThanOrEqual(10);
      expect(question.uiProps.cols).toBeGreaterThanOrEqual(1);
      expect(question.uiProps.cols).toBeLessThanOrEqual(10);
      expect(question.options?.filter(option => option.value === question.answer)).toHaveLength(1);
    }
    expect(Composer.generate(N4_02, 3).uiProps).toMatchObject({ allowRotate: true, requireRotate: true });
    expect(Composer.generate(N4_02, 4).uiProps.answerMode).toBe("equation");
    expect(Composer.generate(N4_02, 5).uiProps.areaMode).toBe(true);
  });

  it("rejeita dimensão fora de 1..10 e giro obrigatório sem permissão", () => {
    const withParams = (params: Record<string, unknown>) => ({
      ...N4_02,
      micros: [{ ...N4_02.micros[0], params }],
      niveis: { 1: { primitiva: "arraygrid" as const, micro: "contagem" } },
    });
    expect(() => Composer.generate(withParams({ rows_min: 0 }), 1)).toThrow("entre 1 e 10");
    expect(() => Composer.generate(withParams({ require_rotate: true, allow_rotate: false }), 1)).toThrow("exigir giro");
  });
});
