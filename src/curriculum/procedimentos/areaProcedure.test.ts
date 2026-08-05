import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  A_MAX,
  A_MIN,
  alternativas,
  contasDoNivel,
  corteErrado,
  corteVemMarcado,
  digitosDoMultiplicador,
  distratores,
  ehPergunavelComDiagnostico,
  falaDoCorte,
  mostraAlgoritmo,
  mostraArea,
  parcelaUnica,
  partir,
  regioes,
  resolver,
  somaDasRegioes,
  zeroEsquecido,
} from "./areaProcedure";

/** Uma amostra ampla, para as invariantes valerem na ficha inteira. */
const TODAS = [1, 2, 3, 4, 5].flatMap(contasDoNivel);

describe("o corte: partir pelo VALOR, não pelo algarismo", () => {
  it("13 vira 10 mais 3", () => {
    expect(partir(13)).toEqual([10, 3]);
  });

  it("o exemplo da ficha: 13 × 4 são duas regiões, 40 e 12", () => {
    const rs = regioes({ a: 13, b: 4 });
    expect(rs.map(r => r.valor)).toEqual([40, 12]);
    expect(rs[0]).toMatchObject({ linhas: 4, colunas: 10 });
    expect(rs[1]).toMatchObject({ linhas: 4, colunas: 3 });
  });

  it("multiplicador de dois dígitos abre QUATRO regiões", () => {
    // É o que dá sentido ao algoritmo: cada região é uma parcela dele.
    expect(regioes({ a: 13, b: 14 })).toHaveLength(4);
    expect(regioes({ a: 13, b: 4 })).toHaveLength(2);
  });

  it("a soma das regiões é o produto — em toda a ficha", () => {
    for (const c of TODAS) {
      expect(somaDasRegioes(c), `${c.a}×${c.b}`).toBe(resolver(c));
    }
  });

  it("nenhuma região tem lado zero — moldura vazia lê como bug (§6.6)", () => {
    for (const c of TODAS) {
      for (const r of regioes(c)) {
        expect(Math.min(r.linhas, r.colunas), `${c.a}×${c.b}`).toBeGreaterThan(0);
      }
    }
  });

  it("a fala das regiões nunca usa símbolo — a criança OUVE", () => {
    for (const c of TODAS) {
      for (const r of regioes(c)) expect(r.fala).not.toMatch(/[×x*+]/);
    }
  });
});

describe("a escada dos cinco níveis, transcrita da tabela da ficha F68 §5", () => {
  it("um dígito até o 3, dois a partir do 4", () => {
    expect([1, 2, 3, 4, 5].map(digitosDoMultiplicador)).toEqual([1, 1, 1, 2, 2]);
  });

  it("o corte vem marcado só no nível 1", () => {
    expect([1, 2, 3, 4, 5].map(corteVemMarcado)).toEqual([true, false, false, false, false]);
  });

  it("o algoritmo entra no nível 3 e a área sai no 5", () => {
    expect([1, 2, 3, 4, 5].map(mostraAlgoritmo)).toEqual([false, false, true, true, true]);
    expect([1, 2, 3, 4, 5].map(mostraArea)).toEqual([true, true, true, true, false]);
  });

  it("cada nível difere observavelmente do anterior", () => {
    const assinatura = (n: number) =>
      `${digitosDoMultiplicador(n)}|${corteVemMarcado(n)}|${mostraAlgoritmo(n)}|${mostraArea(n)}`;
    expect(new Set([1, 2, 3, 4, 5].map(assinatura)).size).toBe(5);
  });

  it("todo nível tem material suficiente para não repetir a mesma conta", () => {
    for (const n of [1, 2, 3, 4, 5]) {
      expect(contasDoNivel(n).length, `nível ${n}`).toBeGreaterThanOrEqual(20);
    }
  });
});

describe("os três erros da ficha F68 §6", () => {
  it("13×4 → 40 é ter multiplicado só a região grande", () => {
    expect(parcelaUnica({ a: 13, b: 4 })).toBe(40);
    expect(distratores({ a: 13, b: 4 }).find(d => d.valor === 40)?.tag)
      .toBe(MisconceptionTag.PARCELA_UNICA);
  });

  it("13×4 → 16 é ter lido o 1 de 13 como um, não como dez", () => {
    expect(corteErrado({ a: 13, b: 4 })).toBe(16);
    expect(distratores({ a: 13, b: 4 }).find(d => d.valor === 16)?.tag)
      .toBe(MisconceptionTag.CORTE_ERRADO);
  });

  it("13×14 → 65 é o zero esquecido da segunda linha", () => {
    // 13×4 = 52, e 13×1 = 13 em vez de 13×10 = 130. Some 52+13 = 65.
    expect(zeroEsquecido({ a: 13, b: 14 })).toBe(65);
    expect(resolver({ a: 13, b: 14 })).toBe(182);
  });

  it("o zero esquecido NÃO existe com multiplicador de um dígito", () => {
    // A ficha diz que é o erro que o modelo de área previne. Ele só pode
    // aparecer onde há segunda linha — inventá-lo antes disso seria diagnóstico
    // de um erro que a criança não tem como cometer.
    expect(zeroEsquecido({ a: 13, b: 4 })).toBeNull();
  });

  it("nenhum distrator é a resposta, nem se repete, em toda a ficha", () => {
    for (const c of TODAS) {
      const certo = resolver(c);
      const valores = distratores(c).map(d => d.valor);
      expect(valores, `${c.a}×${c.b}`).not.toContain(certo);
      expect(new Set(valores).size).toBe(valores.length);
      for (const v of valores) expect(v).toBeGreaterThan(0);
    }
  });
});

describe("rejeitar a pergunta que não diagnostica", () => {
  it("recusa número redondo — 20×4 é deslocamento, não modelo de área", () => {
    expect(ehPergunavelComDiagnostico({ a: 20, b: 4 })).toBe(false);
  });

  it("recusa `a` fora dos dois dígitos da ficha", () => {
    expect(ehPergunavelComDiagnostico({ a: 9, b: 4 })).toBe(false);
    expect(ehPergunavelComDiagnostico({ a: A_MAX + 1, b: 4 })).toBe(false);
    expect(ehPergunavelComDiagnostico({ a: A_MIN, b: 4 })).toBe(true);
  });

  it("toda aceita mantém os dois erros característicos do corte", () => {
    for (const c of TODAS) {
      const tags = distratores(c).map(d => d.tag);
      expect(tags, `${c.a}×${c.b}`).toContain(MisconceptionTag.PARCELA_UNICA);
      expect(tags, `${c.a}×${c.b}`).toContain(MisconceptionTag.CORTE_ERRADO);
    }
  });
});

describe("alternativas", () => {
  it("a resposta aparece uma vez só, com 3 a 4 opções — teto do cânone §9.1", () => {
    for (const c of TODAS) {
      const alts = alternativas(c);
      expect(alts.filter(a => a.valor === resolver(c))).toHaveLength(1);
      expect(alts.length, `${c.a}×${c.b}`).toBeGreaterThanOrEqual(3);
      expect(alts.length, `${c.a}×${c.b}`).toBeLessThanOrEqual(4);
      expect(new Set(alts.map(a => a.valor)).size).toBe(alts.length);
    }
  });
});

describe("a fala do corte não entrega a resposta", () => {
  it("nomeia as partes, nunca o produto", () => {
    for (const c of TODAS) {
      const numeros = (falaDoCorte(c).match(/\d+/g) ?? []).map(Number);
      expect(numeros, `${c.a}×${c.b}`).not.toContain(resolver(c));
    }
  });
});
