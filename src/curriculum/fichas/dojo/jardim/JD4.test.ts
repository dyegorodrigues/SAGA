import { describe, expect, it } from "vitest";
import { misconceptionForAnswer } from "../../../../components/gameloop/answerPolicy";
import { Composer } from "../../../Composer";
import { JOURNEY_FICHAS } from "../../index";
import { jardimProgressProjection, jardimTrack, resolveJardimState } from "../../../motores/jardimSession";
import { JD4, JARDIM } from ".";

const progress = (lvl: number, maxLvl = lvl) => ({
  lvl, maxLvl, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0,
});
const sample = (level: number, count = 80) =>
  Array.from({ length: count }, () => Composer.generate(JD4, level));

describe("P22.3B — JD4 O Passo Seguinte", () => {
  it("é trilha do Jardim, mãe exclusiva N1.07 e nunca nó da Journey", () => {
    const config = JARDIM.find(item => item.ficha.id === "JD4");
    expect(config).toMatchObject({ mae: "N1.07", destravaNoNivel: 3 });
    expect(JD4.prereqs).toEqual(["N1.07"]);
    expect(JOURNEY_FICHAS.some(ficha => ficha.id === "JD4")).toBe(false);
  });

  it("destrava pela compreensão da mãe e a projeção jamais cria domínio conceitual", () => {
    const config = JARDIM.find(item => item.ficha.id === "JD4")!;
    expect(resolveJardimState(config, progress(2)).unlocked).toBe(false);
    const open = resolveJardimState(config, progress(3), {
      unlocked: false, mastered: true, family: "JD", currentStep: 5, highestStep: 5,
    });
    expect(open.unlocked).toBe(true);
    const projection = jardimProgressProjection(open);
    expect(projection.dom).toBe(false);
    expect(projection.mast).toBe(0);
    expect(projection.bank).toEqual([]);
  });

  it("preserva rt_alvo como fluência nos cinco degraus", () => {
    const config = JARDIM.find(item => item.ficha.id === "JD4")!;
    const track = jardimTrack(config);
    expect(track.totalQ).toBe(8);
    expect([1, 2, 3, 4, 5].map(level => track.gen(level).rt_max_s)).toEqual([4, 3.75, 3.5, 3.25, 3]);
  });

  it("L1-L2 recuperam sucessor com reta dentro do escopo", () => {
    for (const level of [1, 2]) {
      for (const q of sample(level)) {
        const spec = q.uiProps as { startPos: number };
        expect(q.kind).toBe("numberline");
        expect(Number(q.answer)).toBe(spec.startPos + 1);
        expect(Number(q.answer)).toBeLessThanOrEqual(level === 1 ? 5 : 10);
        expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
      }
    }
  });

  it("L3 amplia sucessor até 20 sem reta e L4 treina antecessor", () => {
    for (const q of sample(3, 140)) {
      expect(q.kind).toBe("plain");
      expect(q.prompt.toLowerCase()).toContain("depois");
      expect(Number(q.answer)).toBe(Number(q.big) + 1);
      expect(Number(q.answer)).toBeLessThanOrEqual(20);
    }
    for (const q of sample(4, 140)) {
      expect(q.kind).toBe("plain");
      expect(q.prompt.toLowerCase()).toContain("antes");
      expect(Number(q.answer)).toBe(Number(q.big) - 1);
      expect(Number(q.answer)).toBeGreaterThanOrEqual(1);
    }
  });

  it("L5 alterna as duas direções sem sair de 1..20", () => {
    let antes = 0;
    let depois = 0;
    for (const q of sample(5, 240)) {
      const current = Number(q.big);
      const answer = Number(q.answer);
      expect(q.kind).toBe("plain");
      expect(answer).toBeGreaterThanOrEqual(1);
      expect(answer).toBeLessThanOrEqual(20);
      expect(Math.abs(answer - current)).toBe(1);
      expect(q.options?.map(option => Number(option.value))).toContain(answer);
      expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
      if (q.prompt.toLowerCase().includes("antes")) {
        antes += 1;
        expect(answer).toBe(current - 1);
      } else {
        depois += 1;
        expect(q.prompt.toLowerCase()).toContain("depois");
        expect(answer).toBe(current + 1);
      }
    }
    expect(antes).toBeGreaterThan(0);
    expect(depois).toBeGreaterThan(0);
  });
});
