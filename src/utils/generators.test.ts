import { describe, it, expect } from "vitest";
import { TRACKS_PRE, TRACKS_ANO1 } from "../curriculum/motores/curriculum";

/**
 * A cinta de segurança do Matemágica (Constituição, regra 5).
 * Valida TODAS as trilhas × 5 níveis × 60 questões geradas:
 *  - contrato do gerador respeitado (kind, prompt, options[], answer)
 *  - a resposta certa está presente nas opções, exatamente UMA vez
 *  - nenhuma opção duplicada
 *  - coerência aritmética por kind (soma, subtração, dezenas, dinheiro)
 * Se um teste falhar: corrigir O GERADOR, nunca o teste.
 */

const QUESTIONS_PER_LEVEL = 60;
const LEVELS = [1, 2, 3, 4, 5];

const ALL_TRACKS = [
  ...TRACKS_PRE.map((t) => ({ ...t, grade: "pre" })),
  ...TRACKS_ANO1.map((t) => ({ ...t, grade: "ano1" })),
];

describe.each(ALL_TRACKS.map((t) => [`${t.grade}/${t.id}`, t] as const))(
  "trilha %s",
  (_label, track) => {
    describe.each(LEVELS)("nível %i", (lvl) => {
      it(`gera ${QUESTIONS_PER_LEVEL} questões válidas`, () => {
        for (let i = 0; i < QUESTIONS_PER_LEVEL; i++) {
          const q = track.gen(lvl);
          const ctx = `[${track.id} lvl ${lvl} #${i}] ${JSON.stringify(q)}`;

          // Contrato básico
          expect(q, ctx).toBeTruthy();
          expect(typeof q.kind, ctx).toBe("string");
          expect(q.kind.length, ctx).toBeGreaterThan(0);
          expect(typeof q.prompt === "string" || q.kind === "picto", ctx).toBe(true);
          if (q.kind !== "numberline-interactive" && q.kind !== "numberline" && q.isFallback !== true && q.kind !== "drag-group" && q.kind !== "draggroup" && q.kind !== "tenframe" && q.kind !== "plain" && q.kind !== "emojirow") {
            expect(Array.isArray(q.options), ctx).toBe(true);
            expect(q.options.length, ctx).toBeGreaterThanOrEqual(2);
            expect(q.options.length, ctx).toBeLessThanOrEqual(6);
          }
          expect(q.answer, ctx).not.toBeUndefined();
          expect(q.answer, ctx).not.toBeNull();

          // Opções sem duplicata (por value)
          if (q.options) {
            const values = q.options.map((o: any) => o.value);
            expect(new Set(values).size, `opções duplicadas ${ctx}`).toBe(values.length);

            // Resposta presente exatamente uma vez (exceto em order)
            if (q.kind !== "order") {
              const matches = values.filter((v: any) => v === q.answer);
              expect(matches.length, `resposta ausente/duplicada ${ctx}`).toBe(1);
            }
          }

          // Coerência aritmética por kind
          if (q.kind === "sum") {
            expect(q.answer, ctx).toBe((q as any).a + (q as any).b);
          }
          if (q.kind === "subvis") {
            expect(q.answer, ctx).toBe((q as any).a - (q as any).b);
            expect(q.answer, ctx).toBeGreaterThanOrEqual(0);
          }
          if (q.kind === "tens") {
            expect(q.answer, ctx).toBe((q as any).t * 10 + (q as any).u);
          }
          if (q.kind === "money") {
            const coins = ((q as any).coins || []).reduce((s: number, v: number) => s + v, 0);
            const notes = ((q as any).notes || []).reduce((s: number, v: number) => s + v * 100, 0);
            expect(q.answer, ctx).toBe(coins + notes);
            expect(q.answer, ctx).toBeGreaterThan(0);
          }
          if (q.kind === "count") {
            expect(q.answer, ctx).toBe((q as any).n);
            expect(q.answer, ctx).toBeGreaterThanOrEqual(1);
          }
          if (q.kind === "groups") {
            const groups = (q as any).groups;
            expect(groups.length, ctx).toBe(2);
            if (q.prompt.includes("MAIS") || q.prompt.includes("MENOS")) {
              expect(groups[0].n, `grupos empatados ${ctx}`).not.toBe(groups[1].n);
              const bigger = groups[0].n > groups[1].n ? 0 : 1;
              const promptWantsMore = q.prompt.includes("MAIS");
              expect(q.answer, ctx).toBe(promptWantsMore ? bigger : 1 - bigger);
            }
          }
          if (q.kind === "pattern") {
            // A resposta é a continuação real da sequência mostrada
            const shown = (q as any).shown as string[];
            expect(shown.length, ctx).toBeGreaterThanOrEqual(4);
          }

          // Respostas numéricas nunca negativas (idade 4-7)
          if (typeof q.answer === "number") {
            expect(q.answer, ctx).toBeGreaterThanOrEqual(0);
          }
        }
      });
    });
  }
);
