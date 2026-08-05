import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  OUTRO_FATOR_MAX,
  PADRAO_DA_TABUADA,
  TABUADAS_COM_PADRAO,
  alternativas,
  distratores,
  ehPergunavelComDiagnostico,
  mostraArranjo,
  mostraQuadroDeCem,
  mostraSaltos,
  multiplosAteCem,
  resolver,
  saltosDe,
  tabuadasDoNivel,
} from "./tabuadaProcedure";

/** Todas as multiplicações que a ficha F42 pode produzir. */
const TODAS = TABUADAS_COM_PADRAO.flatMap(tabuada =>
  Array.from({ length: OUTRO_FATOR_MAX }, (_, i) => ({ tabuada, vezes: i + 1 })));

describe("as três tabuadas de padrão visível", () => {
  it("são 10, 5 e 2 — a ordem é por padrão, não numérica", () => {
    expect([...TABUADAS_COM_PADRAO]).toEqual([10, 5, 2]);
  });

  it("cobrem 30 dos 100 fatos, que é a razão de virem primeiro", () => {
    const fatos = new Set(TODAS.map(m => `${m.tabuada}x${m.vezes}`));
    expect(fatos.size).toBe(30);
  });

  it("cada uma declara o padrão que a criança descobre", () => {
    for (const t of TABUADAS_COM_PADRAO) {
      expect(PADRAO_DA_TABUADA[t], `tabuada do ${t} sem padrão declarado`).toBeTruthy();
    }
  });
});

describe("a escada dos cinco níveis", () => {
  it("isola uma tabuada por vez até o nível 3, e mistura depois", () => {
    expect(tabuadasDoNivel(1)).toEqual([10]);
    expect(tabuadasDoNivel(2)).toEqual([5]);
    expect(tabuadasDoNivel(3)).toEqual([2]);
    expect(tabuadasDoNivel(4)).toEqual([10, 5, 2]);
    expect(tabuadasDoNivel(5)).toEqual([10, 5, 2]);
  });

  it("os apoios seguem a tabela da ficha F42, e não uma paráfrase dela", () => {
    // A ficha manda: 1 = arranjo + saltos; 2 e 3 = arranjo + quadro; 4 e 5 = só
    // símbolo. Eu havia parafraseado a tabela e trocado a distribuição.
    expect([1, 2, 3, 4, 5].map(mostraArranjo)).toEqual([true, true, true, false, false]);
    expect([1, 2, 3, 4, 5].map(mostraSaltos)).toEqual([true, false, false, false, false]);
    expect([1, 2, 3, 4, 5].map(mostraQuadroDeCem)).toEqual([false, true, true, false, false]);
  });

  it("cada nível difere observavelmente do anterior", () => {
    // Se dois níveis mostrarem o mesmo, o de cima não é mais difícil — só
    // parece. É a armadilha 6.3 do Padrão Ouro, encontrada em N3.10.
    const assinatura = (n: number) =>
      `${tabuadasDoNivel(n).join(",")}|${mostraQuadroDeCem(n)}|${mostraArranjo(n)}|${mostraSaltos(n)}`;
    expect(new Set([1, 2, 3, 4].map(assinatura)).size, "dois níveis idênticos na prática").toBe(4);
  });

  it("os saltos partem do zero e chegam à resposta, de passo em passo", () => {
    expect(saltosDe({ tabuada: 10, vezes: 3 })).toEqual([
      { de: 0, para: 10 }, { de: 10, para: 20 }, { de: 20, para: 30 },
    ]);
    for (const m of TODAS) {
      const ss = saltosDe(m);
      expect(ss).toHaveLength(m.vezes);
      expect(ss[0].de).toBe(0);
      expect(ss[ss.length - 1].para, "a contagem saltada precisa chegar ao total")
        .toBe(resolver(m));
    }
  });
});

describe("o padrão que se descobre no quadro de 100", () => {
  it("os múltiplos de 10 terminam todos em zero", () => {
    expect(multiplosAteCem(10)).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    expect(multiplosAteCem(10).every(n => n % 10 === 0)).toBe(true);
  });

  it("os múltiplos de 5 terminam em zero ou cinco", () => {
    expect(multiplosAteCem(5)).toHaveLength(20);
    expect(multiplosAteCem(5).every(n => n % 10 === 0 || n % 10 === 5)).toBe(true);
  });

  it("os múltiplos de 2 são exatamente os pares", () => {
    expect(multiplosAteCem(2)).toHaveLength(50);
    expect(multiplosAteCem(2).every(n => n % 2 === 0)).toBe(true);
  });

  it("nenhum múltiplo passa de 100 — o quadro não comportaria", () => {
    for (const t of TABUADAS_COM_PADRAO) {
      expect(Math.max(...multiplosAteCem(t))).toBeLessThanOrEqual(100);
    }
  });
});

describe("distratores com significado diagnóstico", () => {
  it("somar em vez de multiplicar recebe a tag da operação trocada", () => {
    // 5×4 = 20; quem somou responde 9.
    const ds = distratores({ tabuada: 5, vezes: 4 });
    expect(ds.find(d => d.valor === 9)?.tag).toBe(MisconceptionTag.SOMA_OS_FATORES);
  });

  it("o múltiplo vizinho recebe a tag de tabuada memorizada sem padrão", () => {
    const ds = distratores({ tabuada: 5, vezes: 4 });
    expect(ds.find(d => d.valor === 15)?.tag).toBe(MisconceptionTag.TABUADA_TROCADA);
    expect(ds.find(d => d.valor === 25)?.tag).toBe(MisconceptionTag.TABUADA_TROCADA);
  });

  it("nenhum distrator é a própria resposta, em toda a ficha", () => {
    for (const m of TODAS) {
      const certo = resolver(m);
      expect(distratores(m).map(d => d.valor), `${m.tabuada}×${m.vezes}`).not.toContain(certo);
    }
  });

  it("nenhum distrator é zero ou negativo, em toda a ficha", () => {
    for (const m of TODAS) {
      for (const d of distratores(m)) {
        expect(d.valor, `${m.tabuada}×${m.vezes}`).toBeGreaterThan(0);
      }
    }
  });

  it("nenhuma alternativa se repete, em toda a ficha", () => {
    for (const m of TODAS) {
      const valores = alternativas(m).map(a => a.valor);
      expect(new Set(valores).size, `${m.tabuada}×${m.vezes} repetiu alternativa`)
        .toBe(valores.length);
    }
  });

  it("a resposta certa aparece exatamente uma vez", () => {
    for (const m of TODAS) {
      const certo = resolver(m);
      expect(alternativas(m).filter(a => a.valor === certo)).toHaveLength(1);
    }
  });
});

describe("rejeitar a pergunta que não diagnostica", () => {
  it("×1 é recusada: a resposta está escrita no enunciado", () => {
    // 10×1 = 10, e o "10" está no próprio enunciado. Quem não sabe multiplicar
    // repete o número visível e acerta — e o Radar registra domínio que não há.
    for (const t of TABUADAS_COM_PADRAO) {
      expect(ehPergunavelComDiagnostico({ tabuada: t, vezes: 1 }), `${t}×1`).toBe(false);
    }
  });

  it("2×2 é recusada: somar e multiplicar dão o mesmo resultado", () => {
    // Quem somou responderia 4, que é a resposta certa. O distrator perderia o
    // sentido e a criança acertaria por sorte — a armadilha 6.2 do Padrão Ouro.
    expect(resolver({ tabuada: 2, vezes: 2 })).toBe(4);
    expect(ehPergunavelComDiagnostico({ tabuada: 2, vezes: 2 })).toBe(false);
  });

  it("aceita as multiplicações em que cada erro tem significado próprio", () => {
    expect(ehPergunavelComDiagnostico({ tabuada: 5, vezes: 4 })).toBe(true);
    expect(ehPergunavelComDiagnostico({ tabuada: 10, vezes: 3 })).toBe(true);
  });

  it("toda multiplicação aceita rende pelo menos três alternativas distintas", () => {
    const aceitas = TODAS.filter(ehPergunavelComDiagnostico);
    expect(aceitas.length, "a ficha ficaria sem material").toBeGreaterThan(20);
    for (const m of aceitas) {
      expect(new Set(alternativas(m).map(a => a.valor)).size,
        `${m.tabuada}×${m.vezes}`).toBeGreaterThanOrEqual(3);
    }
  });

  it("cada tabuada mantém material suficiente em todos os níveis", () => {
    for (const t of TABUADAS_COM_PADRAO) {
      const aceitas = TODAS.filter(m => m.tabuada === t && ehPergunavelComDiagnostico(m));
      expect(aceitas.length, `tabuada do ${t} ficou sem perguntas`).toBeGreaterThanOrEqual(7);
    }
  });
});
