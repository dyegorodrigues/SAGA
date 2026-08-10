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
import { FichaCompetencia } from "./schema";
import {
  generateRegisteredFichaQuestion,
  hasComposerFicha,
  registeredFichaRuntimeKindOverride,
} from "./motores/composerCanary";

const generateJourneyQuestion = (ficha: FichaCompetencia, level: number) =>
  hasComposerFicha(ficha.id)
    ? generateRegisteredFichaQuestion(ficha.id, level)
    : Composer.generate(ficha, level);

const renderedKindFor = (declaredKind: string) => declaredKind === "intruso_math"
  ? "plain"
  : declaredKind === "arraygrid" ? "array"
  : declaredKind === "storypanel" ? "story-bars"
  : declaredKind;

function allowedKindsFor(ficha: FichaCompetencia, level: number): string[] {
  const runtimeOverride = registeredFichaRuntimeKindOverride(ficha.id);
  if (runtimeOverride) return [runtimeOverride];

  const nivel = ficha.niveis?.[level];
  const declaredKind = nivel?.primitiva ?? ficha.micros[0].kinds[0];
  if (nivel?.micro !== "misto") return [renderedKindFor(declaredKind)];

  // Um micro explicitamente chamado `misto` pode alternar famílias já ensinadas
  // pela própria ficha. Ele NÃO ganha liberdade para emitir um palco novo: a
  // união permitida deriva somente das primitivas dos demais níveis.
  return [...new Set(
    Object.entries(ficha.niveis ?? {})
      .filter(([rawLevel]) => Number(rawLevel) !== level)
      .map(([, other]) => renderedKindFor(other.primitiva)),
  )];
}

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
    expect(Composer.generate(N1_08, 1).kind).toBe("fileira");
    expect(Composer.generate(N1_08, 3).kind).toBe("moldura");
  });

  it("N1.04 é `touchcount` nos CINCO níveis — a ficha F01 não tem outra primitiva", () => {
    for (let level = 1; level <= 5; level += 1) {
      expect(N1_04.niveis?.[level]?.primitiva).toBe("touchcount");
      expect(generateJourneyQuestion(N1_04, level).kind).toBe("touchcount");
    }
  });

  it("normalizes legacy tutorial speech into the runtime contract", () => {
    const q = Composer.generate(N1_03, 1);
    expect(q.tutorial?.[0]?.fala).toBeTruthy();
  });

  it("converts the level response-time target from milliseconds to seconds", () => {
    const q = Composer.generate(N1_01, 5);
    expect(q.rt_max_s).toBe((N1_01.niveis?.[5]?.rt_alvo ?? 0) / 1000);
  });

  it("attaches canonical misconception tags only to matching numeric distractors", () => {
    const comBanco = JOURNEY_FICHAS
      .flatMap(ficha => [1, 2, 3, 4, 5].map(lvl => ({ ficha, q: generateJourneyQuestion(ficha, lvl), lvl })))
      .filter(({ ficha, q }) => typeof q.answer === "number"
        && ficha.distratores?.some(d => /^n\s*[+-]\s*\d+$/.test(d.regra))
        && (q.options ?? []).some(o => typeof o.value === "number"));

    expect(comBanco.length).toBeGreaterThan(0);
    let conferidos = 0;
    for (const { ficha, q, lvl } of comBanco) {
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
    expect(conferidos).toBeGreaterThan(0);
    expect(JOURNEY_FICHAS.some(f => f.distratores?.some(d =>
      /^n\s*[+-]\s*1$/.test(d.regra) && d.tag === MisconceptionTag.OFF_BY_ONE))).toBe(true);
  });

  it("generates valid answers across every registered Journey ficha and level", () => {
    for (const ficha of JOURNEY_FICHAS) {
      for (let level = 1; level <= 5; level += 1) {
        for (let sample = 0; sample < 10; sample += 1) {
          const question = generateJourneyQuestion(ficha, level);
          expect(allowedKindsFor(ficha, level), `${ficha.id} L${level}`).toContain(question.kind);
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
    }
  });

  it("fails explicitly instead of returning an invalid question for an unknown builder", () => {
    const ficha = {
      ...N1_01,
      niveis: { 1: { primitiva: "made-up-builder", micro: "a" } },
    } as unknown as FichaCompetencia;
    expect(() => Composer.generate(ficha, 1)).toThrow(/builder/i);
  });

  it("rejects malformed ficha parameters at the Composer boundary", () => {
    const ficha = {
      ...N1_01,
      niveis: { 1: { primitiva: "tenframe", micro: "a" } },
      micros: [{
        ...N1_01.micros[0],
        id: "a",
        params: { qtd: "não-é-número" },
      }],
    } as unknown as FichaCompetencia;
    expect(() => Composer.generate(ficha, 1)).toThrow();
  });

  it("builds a typed vertical question with a single valid answer", () => {
    const q = Composer.generate(N3_11, 1);
    expect(q.kind).toBe("vertical");
    expect(q.evaluate?.(q.answer)).toBe(true);
  });

  it("rejects an invalid vertical operation at the typed boundary", () => {
    const ficha = {
      ...N3_11,
      micros: N3_11.micros.map(m => ({ ...m, params: { ...m.params, op: "division" } })),
    } as FichaCompetencia;
    expect(() => Composer.generate(ficha, 1)).toThrow();
  });

  it("builds F39 with an explicit regrouping bridge and double regrouping at level 5", () => {
    for (let sample = 0; sample < 50; sample += 1) {
      const q3 = Composer.generate(N3_11, 3);
      const q5 = Composer.generate(N3_11, 5);
      expect(q3.kind).toBe("vertical");
      expect(q5.kind).toBe("vertical");
    }
  });

  it("follows the five authored N3.09 progressions without regrouping", () => {
    for (let level = 1; level <= 5; level += 1) {
      const q = Composer.generate(N3_09, level);
      expect(q.kind).toBe("vertical");
      expect(q.evaluate?.(q.answer)).toBe(true);
    }
  });

  it("normaliza arraygrid para array e respeita os cinco degraus autorais", () => {
    for (let level = 1; level <= 5; level += 1) {
      const q = Composer.generate(N4_02, level);
      expect(q.kind).toBe("array");
      expect(q.evaluate?.(q.answer)).toBe(true);
    }
  });

  it("rejeita dimensão fora de 1..10 e giro obrigatório sem permissão", () => {
    const ficha = {
      ...N4_02,
      micros: N4_02.micros.map(m => ({ ...m, params: { ...m.params, rowsMax: 20 } })),
    } as FichaCompetencia;
    expect(() => Composer.generate(ficha, 1)).toThrow();
  });
});
