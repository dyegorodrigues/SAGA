import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  FATOR_MAX, FATOR_MIN, VerticeOculto, alternativas, contaEmAberto, contasDeApoio,
  distratores, ehPergunavelComDiagnostico, operacaoDe, produto, produtoMaximoDoNivel,
  quatroContas, resolver, verticesDoNivel,
} from "./familiaProcedure";

const VERTICES: VerticeOculto[] = ["produto", "fatorA", "fatorB"];
const TODAS = Array.from({ length: FATOR_MAX - FATOR_MIN + 1 }, (_, i) => i + FATOR_MIN)
  .flatMap(a => Array.from({ length: FATOR_MAX - FATOR_MIN + 1 }, (_, j) => ({ a, b: j + FATOR_MIN })))
  .flatMap(f => VERTICES.map(v => ({ f, v })));

describe("a família multiplicativa", () => {
  it("três números dizem quatro frases", () => {
    expect(quatroContas({ a: 3, b: 4 })).toEqual([
      "3 × 4 = 12", "4 × 3 = 12", "12 ÷ 3 = 4", "12 ÷ 4 = 3",
    ]);
  });

  it("cobrir o topo pede multiplicação; cobrir a base pede divisão", () => {
    expect(operacaoDe("produto")).toBe("multiplicacao");
    expect(operacaoDe("fatorA")).toBe("divisao");
    expect(operacaoDe("fatorB")).toBe("divisao");
  });

  it("a conta em aberto nunca traz o resultado", () => {
    expect(contaEmAberto({ a: 3, b: 4 }, "produto")).toBe("3 × 4 = ?");
    expect(contaEmAberto({ a: 3, b: 4 }, "fatorA")).toBe("12 ÷ 4 = ?");
    expect(contaEmAberto({ a: 3, b: 4 }, "fatorB")).toBe("12 ÷ 3 = ?");
    // Só entre as perguntáveis: `4 ÷ 2 = ?` na família 2-2-4 tem a resposta no
    // enunciado, e é exatamente por isso que fatores iguais são recusados.
    for (const { f, v } of TODAS.filter(({ f, v }) => ehPergunavelComDiagnostico(f, v))) {
      const numeros = (contaEmAberto(f, v).match(/\d+/g) ?? []).map(Number);
      expect(numeros, `${f.a}×${f.b} ${v}`).not.toContain(resolver(f, v));
    }
  });

  it("resolver devolve o vértice que falta", () => {
    expect(resolver({ a: 3, b: 4 }, "produto")).toBe(12);
    expect(resolver({ a: 3, b: 4 }, "fatorA")).toBe(3);
    expect(resolver({ a: 3, b: 4 }, "fatorB")).toBe(4);
  });
});

describe("a escada dos cinco níveis", () => {
  it("a divisão entra no nível 3, e o 5 é só divisão", () => {
    expect(verticesDoNivel(1)).toEqual(["produto"]);
    expect(verticesDoNivel(2)).toEqual(["produto"]);
    expect(verticesDoNivel(3)).toContain("fatorA");
    expect(verticesDoNivel(5)).not.toContain("produto");
  });

  it("o apoio diminui: quatro contas, duas, nenhuma", () => {
    expect([1, 2, 3, 4, 5].map(contasDeApoio)).toEqual([4, 2, 2, 0, 0]);
  });

  it("o nível 1 fica em produtos até 20, como manda a ficha", () => {
    expect(produtoMaximoDoNivel(1)).toBe(20);
    expect(produtoMaximoDoNivel(2)).toBeGreaterThan(20);
  });

  it("cada nível difere observavelmente do anterior", () => {
    const assinatura = (n: number) => `${verticesDoNivel(n).join(",")}|${contasDeApoio(n)}|${produtoMaximoDoNivel(n)}`;
    expect(new Set([1, 2, 3, 4, 5].map(assinatura)).size).toBe(5);
  });
});

describe("inverter a divisão é o erro assinatura desta ficha", () => {
  it("em 12 ÷ 3, responder 3 é devolver o divisor visível", () => {
    // fatorB oculto: pergunta 12 ÷ 3, resposta 4; responder 3 é ler da tela.
    expect(distratores({ a: 3, b: 4 }, "fatorB").find(d => d.valor === 3)?.tag)
      .toBe(MisconceptionTag.INVERTE_DIVISAO);
  });

  it("tratar a divisão como subtração recebe tag própria", () => {
    expect(distratores({ a: 3, b: 4 }, "fatorB").find(d => d.valor === 9)?.tag)
      .toBe(MisconceptionTag.DIVIDE_SUBTRAINDO);
  });

  it("nenhum distrator é a resposta, nem se repete, e nunca passa de quatro opções", () => {
    for (const { f, v } of TODAS) {
      const valores = distratores(f, v).map(d => d.valor);
      expect(valores).not.toContain(resolver(f, v));
      expect(new Set(valores).size).toBe(valores.length);
      for (const x of valores) expect(x).toBeGreaterThan(0);
      expect(alternativas(f, v).length).toBeLessThanOrEqual(4);
    }
  });
});

describe("rejeitar a pergunta que não diagnostica", () => {
  it("fatores iguais com base oculta são recusados", () => {
    // Família 3-3-9: perguntar 9 ÷ 3 tem o divisor visível IGUAL à resposta, e
    // quem inverte a divisão acertaria por sorte.
    expect(ehPergunavelComDiagnostico({ a: 3, b: 3 }, "fatorA")).toBe(false);
    expect(ehPergunavelComDiagnostico({ a: 3, b: 3 }, "produto")).toBe(true);
  });

  it("toda aceita tem pelo menos dois erros com significado", () => {
    const aceitas = TODAS.filter(({ f, v }) => ehPergunavelComDiagnostico(f, v));
    expect(aceitas.length).toBeGreaterThan(100);
    for (const { f, v } of aceitas) {
      expect(distratores(f, v).length).toBeGreaterThanOrEqual(2);
    }
  });

  it("a resposta aparece uma vez só", () => {
    for (const { f, v } of TODAS.filter(({ f, v }) => ehPergunavelComDiagnostico(f, v))) {
      expect(alternativas(f, v).filter(a => a.valor === resolver(f, v))).toHaveLength(1);
    }
  });
});
