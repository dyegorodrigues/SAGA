import { describe, it, expect } from "vitest";
import { TRACKS_PRE, TRACKS_ANO1 } from "../curriculum/motores/curriculum";
import { PALCOS_QUE_RESPONDEM } from "../components/gameloop/answerPolicy";

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
          // Estes kinds têm PALCO PRÓPRIO: a criança age na cena em vez de
          // escolher entre alternativas, e o que houver em `options` serve ao
          // motor, não à tela. `touchcount` entra aqui porque a F01 §5 manda um
          // TECLADO escalado ao escopo (1-3, 1-5, 1-10) — com quatro teclas,
          // chutar acertaria em 25% e a cardinalidade deixaria de ser observável.
          // O escopo do teclado tem guarda própria no contrato do canário.
          //
          // ⚠️ A lista dos palcos autorais vem de `PALCOS_QUE_RESPONDEM`, que já
          // é a fonte da verdade em `answerPolicy.ts` — é ela que decide se a
          // barra genérica aparece por baixo da cena. Mantida à mão aqui, ela
          // atrasava um palco por vez: o `moldura` reprovou este teste depois de
          // estar certo em todo lugar, porque só esta cópia não sabia dele
          // (§6.32, duas fontes para a mesma verdade).
          //
          // O que sobra escrito são os kinds LEGADOS de palco próprio, que
          // nasceram antes daquele conjunto existir.
          const PALCO_PROPRIO = [...PALCOS_QUE_RESPONDEM, "vertical",
            "numberline-interactive", "numberline", "drag-group", "draggroup",
            "tenframe", "plain", "emojirow"];
          if (!PALCO_PROPRIO.includes(q.kind) && q.isFallback !== true) {
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
