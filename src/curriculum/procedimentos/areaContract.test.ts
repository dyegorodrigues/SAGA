import { describe, expect, it } from "vitest";
import { construirAreaSpec, enunciadoNaoRevela } from "./areaContract";
import { contasDoNivel, resolver } from "./areaProcedure";

const NIVEIS = [1, 2, 3, 4, 5];
/** Uma amostra por nível, larga o bastante para as invariantes valerem. */
const AMOSTRA = NIVEIS.flatMap(n => contasDoNivel(n).map(c => ({ c, n })));

describe("a tela nunca entrega a resposta", () => {
  it("nem no enunciado, nem nas regiões, nem no algoritmo — em toda a ficha", () => {
    for (const { c, n } of AMOSTRA) {
      const spec = construirAreaSpec(c, n);
      expect(enunciadoNaoRevela(spec), `${c.a}×${c.b} nível ${n}`).toBe(true);
    }
  });

  it("nenhuma linha do algoritmo vale a resposta", () => {
    // Com multiplicador de um dígito a conta armada teria UMA linha, e ela é
    // exatamente o produto: o andaime escreveria o gabarito. Ver §6.14.
    for (const { c, n } of AMOSTRA) {
      const spec = construirAreaSpec(c, n);
      for (const linha of spec.algoritmo ?? []) {
        expect(linha.parcela, `${c.a}×${c.b} nível ${n}: "${linha.conta}"`).not.toBe(resolver(c));
      }
    }
  });

  it("nenhuma região sozinha vale a resposta", () => {
    for (const { c, n } of AMOSTRA) {
      for (const r of construirAreaSpec(c, n).regioes) {
        expect(r.valor, `${c.a}×${c.b}`).not.toBe(resolver(c));
      }
    }
  });
});

describe("diagnóstico pertence ao erro, nunca ao acerto", () => {
  it("a alternativa correta não carrega tag diagnóstica", () => {
    for (const { c, n } of AMOSTRA) {
      const spec = construirAreaSpec(c, n);
      const correta = spec.alternativas.find(a => a.valor === spec.resposta);
      expect(correta, `${c.a}×${c.b} nível ${n}: gabarito ausente`).toBeDefined();
      expect(correta?.tag, `${c.a}×${c.b} nível ${n}: acerto virou diagnóstico`).toBeUndefined();
    }
  });

  it("distratores continuam carregando hipótese diagnóstica", () => {
    for (const { c, n } of AMOSTRA) {
      const spec = construirAreaSpec(c, n);
      for (const alternativa of spec.alternativas.filter(a => a.valor !== spec.resposta)) {
        expect(alternativa.tag, `${c.a}×${c.b} nível ${n}: distrator sem hipótese`).toBeTruthy();
      }
    }
  });
});

describe("o algoritmo espelha o retângulo", () => {
  it("as parcelas somam o produto, sempre", () => {
    for (const { c, n } of AMOSTRA) {
      const spec = construirAreaSpec(c, n);
      if (!spec.algoritmo) continue;
      const soma = spec.algoritmo.reduce((s, l) => s + l.parcela, 0);
      expect(soma, `${c.a}×${c.b} nível ${n}`).toBe(resolver(c));
    }
  });

  it("com dois dígitos, a segunda linha diz `× 10`, não `× 1`", () => {
    // O zero da segunda linha é o assunto da ficha. Escrever `13 × 1` faria a
    // tela repetir a mágica que o modelo de área existe para desfazer.
    const spec = construirAreaSpec({ a: 13, b: 14 }, 4);
    expect(spec.algoritmo?.map(l => l.conta)).toEqual(["13 × 4", "13 × 10"]);
    expect(spec.algoritmo?.map(l => l.parcela)).toEqual([52, 130]);
  });

  it("com um dígito, as linhas são as duas regiões", () => {
    const spec = construirAreaSpec({ a: 13, b: 4 }, 3);
    expect(spec.algoritmo?.map(l => l.conta)).toEqual(["3 × 4", "10 × 4"]);
    expect(spec.algoritmo?.map(l => l.parcela)).toEqual([12, 40]);
  });

  it("há uma linha por fileira de regiões", () => {
    for (const { c, n } of AMOSTRA) {
      const spec = construirAreaSpec(c, n);
      if (!spec.algoritmo || spec.regioes.length === 0) continue;
      const fileiras = new Set(spec.regioes.map(r => r.linhas)).size;
      const esperado = fileiras > 1 ? fileiras : spec.regioes.length;
      expect(spec.algoritmo.length, `${c.a}×${c.b} nível ${n}`).toBe(esperado);
    }
  });
});

describe("a escada chega até a tela", () => {
  it("o corte vem marcado só no nível 1", () => {
    const c = contasDoNivel(1)[0];
    expect(construirAreaSpec(c, 1).corteMarcado).toBe(true);
    expect(construirAreaSpec(c, 2).corteMarcado).toBe(false);
  });

  it("o nível 5 fica sem área — e sem a dica do corte junto", () => {
    const c = contasDoNivel(5)[0];
    const spec = construirAreaSpec(c, 5);
    expect(spec.regioes).toEqual([]);
    expect(spec.corte).toBeNull();
    expect(spec.algoritmo).not.toBeNull();
  });

  it("cada nível produz uma tela observavelmente diferente", () => {
    const c = { a: 13, b: 4 };
    const assinatura = (n: number) => {
      const s = construirAreaSpec(n >= 4 ? { a: 13, b: 14 } : c, n);
      return `${s.regioes.length}|${s.corteMarcado}|${s.algoritmo !== null}`;
    };
    expect(new Set(NIVEIS.map(assinatura)).size).toBeGreaterThanOrEqual(4);
  });
});
