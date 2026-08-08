import { describe, expect, it } from "vitest";
import { generateRegisteredFichaQuestion } from "../../motores/composerCanary";
import { misconceptionForAnswer } from "../../../components/gameloop/answerPolicy";
import { N1_09 } from "./N1.09";

const sample = (level: number, count = 100) =>
  Array.from({ length: count }, () => generateRegisteredFichaQuestion("N1.09", level));

describe("P22.4 — N1.09 contagem flexível até 20", () => {
  it("preserva o cânone e os prerequisitos", () => {
    expect(N1_09.faixa).toBe("F0");
    expect(N1_09.prereqs).toEqual(["N1.04", "N1.02"]);
    expect(N1_09.micros.map(m => m.id)).toEqual(["contar15", "contar20", "partirDeN", "regressiva", "misto"]);
  });

  it("L1-L2 contam conjuntos 10..15 e 10..20", () => {
    for (const [level, max] of [[1, 15], [2, 20]] as const) {
      for (const q of sample(level)) {
        expect(q.kind).toBe("scattered");
        expect(Number(q.answer)).toBeGreaterThanOrEqual(10);
        expect(Number(q.answer)).toBeLessThanOrEqual(max);
        expect(q.n).toBe(q.answer);
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
      }
    }
  });

  it("L3 começa em N interno e exige três passos corretos", () => {
    for (const q of sample(3, 140)) {
      const start = Number(String(q.big).split("→")[0].trim());
      const expected = [start + 1, start + 2, start + 3].join(" · ");
      expect(start).toBeGreaterThanOrEqual(4);
      expect(start).toBeLessThanOrEqual(17);
      expect(q.answer).toBe(expected);
      expect(q.options?.map(option => String(option.value))).toContain(expected);
      expect(q.evaluate?.(q.answer)).toBe(true);
    }
  });

  it("L4 faz regressiva de três passos e alcança zero", () => {
    let viuZero = false;
    for (const q of sample(4, 220)) {
      const start = Number(String(q.big).split("→")[0].trim());
      const expected = [start - 1, start - 2, start - 3].join(" · ");
      expect(q.answer).toBe(expected);
      expect(q.options?.map(option => String(option.value))).toContain(expected);
      expect(q.evaluate?.(q.answer)).toBe(true);
      if (expected.split(" · ").includes("0")) viuZero = true;
    }
    expect(viuZero).toBe(true);
  });

  it("L5 mistura as três famílias sem transformar velocidade em domínio", () => {
    let objetos = 0;
    let frente = 0;
    let tras = 0;
    for (const q of sample(5, 360)) {
      expect(q.evaluate?.(q.answer)).toBe(true);
      expect(q.options?.map(option => String(option.value))).toContain(String(q.answer));
      expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
      if (typeof q.answer === "number") objetos += 1;
      else if (q.prompt.toLowerCase().includes("para trás")) tras += 1;
      else frente += 1;
    }
    expect(objetos).toBeGreaterThan(0);
    expect(frente).toBeGreaterThan(0);
    expect(tras).toBeGreaterThan(0);
    expect(N1_09.niveis[5].rt_alvo).toBeUndefined();
  });
});
