import { describe, expect, it, vi } from "vitest";
import type { Progress } from "../../types";
import {
  maxEligibleSenseiDojoStep,
  resolveSenseiDojoState,
  SENSEI_DOJO_TEMPLES,
  senseiDojoTempleById,
  senseiDojoTrack,
  tentativaSenseiDojoDoTerminal,
} from "./senseiDojoSession";

const p = (level: number): Progress => ({
  lvl: level,
  maxLvl: level,
  streak: 0,
  bad: 0,
  stars: 0,
  ok: 0,
  tot: 0,
  bank: [],
  mast: 0,
});

describe("Dojo Sensei — elegibilidade por conceito", () => {
  it("adição não abre antes da compreensão de adição concreta", () => {
    const add = senseiDojoTempleById("dojo_add")!;
    expect(maxEligibleSenseiDojoStep(add, {})).toBe(0);
    expect(maxEligibleSenseiDojoStep(add, { "N3.01": p(3) })).toBe(2);
  });

  it("teto cresce pelo DAG demonstrado, não por idade/série", () => {
    const add = senseiDojoTempleById("dojo_add")!;
    const state = {
      "N3.01": p(5),
      "N1.11": p(3),
      "N3.07": p(3),
      "N2.01": p(3),
      "N3.09": p(3),
      "N3.11": p(2),
    };
    expect(maxEligibleSenseiDojoStep(add, state)).toBe(6);
    state["N3.11"] = p(3);
    expect(maxEligibleSenseiDojoStep(add, state)).toBe(10);
  });

  it("multiplicação e divisão não treinam tabuadas antes do conceito correspondente", () => {
    const mul = senseiDojoTempleById("dojo_mul")!;
    const div = senseiDojoTempleById("dojo_div")!;
    expect(maxEligibleSenseiDojoStep(mul, { "N4.03": p(2) })).toBe(0);
    expect(maxEligibleSenseiDojoStep(mul, { "N4.03": p(3) })).toBe(1);
    expect(maxEligibleSenseiDojoStep(div, {
      "N4.05": p(3), "N4.06": p(3), "N4.03": p(3),
    })).toBe(1);
  });

  it("estado salvo nunca abre um treino que o conhecimento ainda não permite", () => {
    const add = senseiDojoTempleById("dojo_add")!;
    const resolved = resolveSenseiDojoState(add, { "N3.01": p(3) }, {
      unlocked: true,
      mastered: true,
      currentStep: 10,
      highestStep: 10,
    });
    expect(resolved.maxEligibleStep).toBe(2);
    expect(resolved.state.currentStep).toBe(2);
    expect(resolved.state.mastered).toBe(false);
  });
});

describe("Dojo Sensei — questões observáveis", () => {
  it("todo templo possui 10 políticas, RT válido e porta crua explicitamente manual", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.37);
    for (const temple of SENSEI_DOJO_TEMPLES) {
      expect(Object.keys(temple.levels)).toHaveLength(10);
      const track = senseiDojoTrack(temple);
      expect(track.totalQ).toBe(10);
      for (let step = 1; step <= 10; step += 1) {
        const q = track.gen(step) as any;
        expect(q.uiProps?.fluency?.templeId).toBe(temple.id);
        expect(q.uiProps?.fluency?.step).toBe(step);
        expect(q.uiProps?.fluency?.itemId).toBeTruthy();
        expect(q.uiProps?.fluency?.source).toBe("manual");
        expect(q.rt_max_s).toBeGreaterThan(0);
      }
    }
  });

  it("missão prescrita sobrescreve somente a autoridade da sessão", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.37);
    const temple = senseiDojoTempleById("dojo_add")!;
    const manual = senseiDojoTrack(temple, "manual").gen(1) as any;
    const prescribed = senseiDojoTrack(temple, "prescribed").gen(1) as any;

    expect(manual.uiProps.fluency.source).toBe("manual");
    expect(prescribed.uiProps.fluency.source).toBe("prescribed");
    expect(prescribed.uiProps.fluency.templeId).toBe("dojo_add");
    expect(prescribed.uiProps.fluency.step).toBe(1);
    expect(prescribed.uiProps.fluency.itemKind).toBe(manual.uiProps.fluency.itemKind);
    expect(prescribed.rt_max_s).toBeGreaterThan(0);
    vi.restoreAllMocks();
  });

  it("adição comutativa usa a mesma identidade de fato", () => {
    const add = senseiDojoTempleById("dojo_add")!;
    const track = senseiDojoTrack(add);
    vi.spyOn(Math, "random").mockReturnValueOnce(0).mockReturnValue(0.37);
    const a = track.gen(1) as any;
    vi.restoreAllMocks();
    vi.spyOn(Math, "random").mockReturnValueOnce(1).mockReturnValue(0.37);
    const b = track.gen(1) as any;
    const av = a.expr.match(/\d+/g)?.map(Number).sort((x: number, y: number) => x - y).join(":");
    const bv = b.expr.match(/\d+/g)?.map(Number).sort((x: number, y: number) => x - y).join(":");
    if (av === bv) expect(a.uiProps.fluency.itemId).toBe(b.uiProps.fluency.itemId);
    vi.restoreAllMocks();
  });

  it("tentativa terminal recuperada após erro não vira fluente", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.37);
    const q = senseiDojoTrack(senseiDojoTempleById("dojo_add")!, "prescribed").gen(1);
    const attempt = tentativaSenseiDojoDoTerminal({
      question: q,
      terminalRight: true,
      attemptCount: 2,
      durationMs: 900,
    });
    expect(attempt.right).toBe(false);
    expect(attempt.itemId).toBeTruthy();
    vi.restoreAllMocks();
  });
});
