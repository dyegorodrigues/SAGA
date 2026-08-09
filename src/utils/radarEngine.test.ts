import { describe, expect, it } from "vitest";
import { Progress } from "../types";
import { MisconceptionTag } from "../constants/misconceptions";
import { evaluateSpacedRepetition, getDueReviews, getRescueItems, trackMisconception } from "../curriculum/motores/radarEngine";

const TAGS = Object.values(MisconceptionTag);

describe("RadarEngine - Motor de Diagnóstico e Revisão Espaçada (§11.4)", () => {
  it("erro isolado NÃO dispara resgate (Camada 1, §8.1)", () => {
    const pMap: Record<string, Progress> = {
      "N1.01": {
        lvl: 1,
        streak: 0,
        bad: 1,
        stars: 0,
        ok: 0,
        tot: 1,
        bank: [],
        mast: 1,
        misconceptions: [{ tag: MisconceptionTag.OFF_BY_ONE, ts: Date.now() }],
      },
    };

    const rescueItems = getRescueItems("kid1", pMap);
    expect(rescueItems).toEqual([]);
  });

  it("2 tags iguais em até 5 questões E dentro de 10 min DISPARAM resgate", () => {
    const now = Date.now();
    const pMap: Record<string, Progress> = {
      "N1.11": {
        lvl: 2,
        streak: 0,
        bad: 2,
        stars: 5,
        ok: 2,
        tot: 4,
        bank: [],
        mast: 2,
        misconceptions: [
          { tag: MisconceptionTag.CONFUSAO_SINAL, ts: now - 300000 },
          { tag: MisconceptionTag.OFF_BY_ONE, ts: now - 200000 },
          { tag: MisconceptionTag.CONFUSAO_SINAL, ts: now },
        ],
      },
    };

    const rescueItems = getRescueItems("kid1", pMap);
    expect(rescueItems).toEqual(["N1.11"]);
  });

  it("BUG 1 — 2 erros da mesma tag distantes no tempo (20 min de diferença) NÃO disparam resgate", () => {
    const now = Date.now();
    const pMap: Record<string, Progress> = {
      "N1.11": {
        lvl: 3,
        streak: 0,
        bad: 2,
        stars: 10,
        ok: 8,
        tot: 10,
        bank: [],
        mast: 3,
        misconceptions: [
          { tag: MisconceptionTag.CONFUSAO_SINAL, ts: now - 1200000 },
          { tag: MisconceptionTag.CONFUSAO_SINAL, ts: now },
        ],
      },
    };

    const rescueItems = getRescueItems("kid1", pMap);
    expect(rescueItems).toEqual([]);
  });

  it("múltiplas tags conceituais diferentes em até 5 questões NÃO disparam resgate", () => {
    const now = Date.now();
    const pMap: Record<string, Progress> = {
      "N1.05": {
        lvl: 3,
        streak: 0,
        bad: 3,
        stars: 10,
        ok: 5,
        tot: 8,
        bank: [],
        mast: 3,
        misconceptions: TAGS.slice(0, 5).map((tag, i) => ({ tag, ts: now - (4 - i) * 1000 })),
      },
    };

    const rescueItems = getRescueItems("kid1", pMap);
    expect(rescueItems).toEqual([]);
  });

  it("a janela de misconceptions canônicas NUNCA passa de 15 eventos", () => {
    const p: Progress = {
      lvl: 1,
      streak: 0,
      bad: 0,
      stars: 0,
      ok: 0,
      tot: 0,
      bank: [],
      mast: 1,
      misconceptions: [],
    };

    const usadas = TAGS.slice(0, 20);
    expect(usadas.length).toBe(20);
    for (const tag of usadas) trackMisconception(p, tag);

    expect(p.misconceptions?.length).toBe(15);
    expect(p.misconceptions?.[0].tag).toBe(usadas[5]);
    expect(p.misconceptions?.[14].tag).toBe(usadas[19]);
  });

  it("trackMisconception via (kidId, node, tag, pMap) inicializa e limita a 15", () => {
    const pMap: Record<string, Progress> = {};
    const usadas = TAGS.slice(0, 18);
    expect(usadas.length).toBe(18);

    for (const tag of usadas) {
      trackMisconception("kid123", "N2.01", tag, pMap);
    }

    expect(pMap["N2.01"]).toBeDefined();
    expect(pMap["N2.01"].misconceptions?.length).toBe(15);
    expect(pMap["N2.01"].misconceptions?.[0].tag).toBe(usadas[3]);
    expect(pMap["N2.01"].misconceptions?.[14].tag).toBe(usadas[17]);
  });

  it("BUG 2 — evaluateSpacedRepetition altera reviewForce e NÃO mexe em mast ou lvl", () => {
    const pMap: Record<string, Progress> = {
      "N1.01": {
        lvl: 4,
        streak: 0,
        bad: 0,
        stars: 0,
        ok: 0,
        tot: 0,
        bank: [],
        mast: 5,
        reviewForce: 1,
      },
    };

    const res1 = evaluateSpacedRepetition("kid1", "N1.01", true, 3000, pMap, 10000);
    expect(res1.newForce).toBe(2);
    expect(res1.nextReviewDays).toBe(2);
    expect(pMap["N1.01"].reviewForce).toBe(2);
    expect(pMap["N1.01"].mast).toBe(5);
    expect(pMap["N1.01"].lvl).toBe(4);
  });

  it("LACUNA 2 — durationMs: acerto RÁPIDO promove, acerto LENTO mantém a força", () => {
    const pMap: Record<string, Progress> = {
      "N1.01": {
        lvl: 3,
        streak: 0,
        bad: 0,
        stars: 0,
        ok: 0,
        tot: 0,
        bank: [],
        mast: 3,
        reviewForce: 2,
      },
    };

    const resSlow = evaluateSpacedRepetition("kid1", "N1.01", true, 15000, pMap, 10000);
    expect(resSlow.newForce).toBe(2);
    expect(pMap["N1.01"].reviewForce).toBe(2);

    const resFast = evaluateSpacedRepetition("kid1", "N1.01", true, 4000, pMap, 10000);
    expect(resFast.newForce).toBe(3);
    expect(pMap["N1.01"].reviewForce).toBe(3);
  });

  it("LACUNA 1 — getDueReviews identifica nós vencidos com base no intervalo Leitner", () => {
    const now = new Date("2026-07-24T12:00:00Z").getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    const pMap: Record<string, Progress> = {
      "N1.01": {
        lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 1,
        reviewForce: 1,
        lastDay: new Date(now - 2 * oneDay).toISOString().slice(0, 10),
      },
      "N1.02": {
        lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 1,
        reviewForce: 3,
        lastDay: new Date(now - 2 * oneDay).toISOString().slice(0, 10),
      },
    };

    const due = getDueReviews(pMap, now);
    expect(due).toEqual(["N1.01"]);
  });
});
