import { describe, expect, it } from "vitest";
import { Composer } from "../../Composer";
import { N1_10 } from "./N1.10";
import { N1_11 } from "./N1.11";
import { JARDIM } from "../dojo/jardim";
import { grafoSaga } from "../../grafo_saga";
import { MisconceptionTag } from "../../../constants/misconceptions";

describe("P17 — uma competencia, multiplas representacoes", () => {
  it("N1.10 preserva JD5 ate memoria >5 e so entao formaliza em NumberBond", () => {
    expect([1, 2, 3, 4, 5].map(n => N1_10.niveis[n].primitiva))
      .toEqual(["moldura", "moldura", "moldura", "moldura", "bond"]);
    expect([1, 2, 3, 4].map(n => N1_10.micros.find(m => m.id === N1_10.niveis[n].micro)?.fonte))
      .toEqual(["JD5", "JD5", "JD5", "JD5"]);
    expect(N1_10.micros.find(m => m.id === N1_10.niveis[5].micro)?.fonte).toBe("F1-parte-todo");

    const l4 = Composer.generate(N1_10, 4);
    const l5 = Composer.generate(N1_10, 5);
    expect(l4.kind).toBe("moldura");
    expect(l4.exigeEvidencia).toBeTruthy();
    expect(l5.kind).toBe("bond");
    expect((l5.uiProps as any).whole).toBeGreaterThanOrEqual(4);
    expect([(l5.uiProps as any).part1, (l5.uiProps as any).part2]).toContain("?");
    expect(l5.uiProps).not.toHaveProperty("interactivePart");
    expect(l5.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
  });

  it("N1.11 progride de JD3 para F28: moldura -> bond -> simbolo", () => {
    expect([1, 2, 3, 4, 5].map(n => N1_11.niveis[n].primitiva))
      .toEqual(["moldura", "moldura", "bond", "plain", "plain"]);
    expect([1, 2, 3, 4, 5].map(n => N1_11.micros.find(m => m.id === N1_11.niveis[n].micro)?.fonte))
      .toEqual(["JD3", "JD3", "F28", "F28", "F28"]);

    const bond = Composer.generate(N1_11, 3);
    const simbolo = Composer.generate(N1_11, 4);
    expect(bond.kind).toBe("bond");
    expect((bond.uiProps as any).whole).toBe(10);
    expect(bond.uiProps).not.toHaveProperty("interactivePart");
    expect(simbolo.kind).toBe("plain");
    expect((simbolo.uiProps as any).text).toMatch(/\+ □ = 10/);
    expect(simbolo.masteryRule).toEqual({ acertos: 4, de: 4, sessoes: 3 });
  });

  it("distratores simbolicos preservam diagnostico especifico", () => {
    for (let i = 0; i < 40; i += 1) {
      const q = Composer.generate(N1_11, 5);
      const tags = new Set((q.options ?? []).map(o => o.misconception).filter(Boolean));
      expect(tags.has(MisconceptionTag.RESPONDE_O_TODO)).toBe(true);
      expect(tags.has(MisconceptionTag.OFF_BY_ONE)).toBe(true);
    }
  });

  it("JD3 e JD5 completas vivem no Jardim, sem virar nos paralelos do grafo", () => {
    const jd3 = JARDIM.find(t => t.ficha.id === "JD3");
    const jd5 = JARDIM.find(t => t.ficha.id === "JD5");
    expect(jd3).toMatchObject({ mae: "N1.11", destravaNoNivel: 3 });
    expect(jd5).toMatchObject({ mae: "N1.10", destravaNoNivel: 3 });
    expect(Object.keys(jd3!.ficha.niveis)).toHaveLength(5);
    expect(Object.keys(jd5!.ficha.niveis)).toHaveLength(5);
    expect(grafoSaga.some(n => n.id === "JD3" || n.id === "JD5")).toBe(false);
  });

  it("o DAG canonico fica intacto", () => {
    expect(grafoSaga.find(n => n.id === "N1.10")?.prereqs).toEqual(["N1.04", "N1.08"]);
    expect(grafoSaga.find(n => n.id === "N1.11")?.prereqs).toEqual(["N1.08", "N1.10"]);
    expect(grafoSaga.find(n => n.id === "N3.07")?.prereqs).toEqual(["N1.11", "N1.10", "N2.01"]);
  });
});
