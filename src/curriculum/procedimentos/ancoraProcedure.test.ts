import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  ESTRATEGIA_DE,
  FATOS_NOVOS,
  OUTRO_FATOR_MAX,
  OUTRO_FATOR_MIN,
  TABUADAS_DIFICEIS,
  alternativas,
  digitosSomamNove,
  distratores,
  ehPergunavelComDiagnostico,
  ehTabuadaDificil,
  mostraEstrategia,
  passos,
  resolver,
  tabuadasDoNivel,
  valorDaAncora,
} from "./ancoraProcedure";

const TODAS = TABUADAS_DIFICEIS.flatMap(tabuada =>
  Array.from({ length: OUTRO_FATOR_MAX - OUTRO_FATOR_MIN + 1 },
    (_, i) => ({ tabuada, vezes: i + OUTRO_FATOR_MIN })));

describe("as quatro estratégias da ficha F44", () => {
  it("cada tabuada difícil parte de um fato fácil", () => {
    expect(ESTRATEGIA_DE[9].ancora).toBe(10);
    expect(ESTRATEGIA_DE[6].ancora).toBe(5);
    expect(ESTRATEGIA_DE[7].ancora).toBe(5);
    expect(ESTRATEGIA_DE[8].ancora).toBe(4);
  });

  it("7×9 = 7×10 menos um sete", () => {
    const [um, dois] = passos({ tabuada: 9, vezes: 7 });
    expect(um.conta).toBe("7 × 10 = 70");
    expect(dois.conta).toBe("70 − 7 = 63");
    expect(dois.resultado).toBe(63);
  });

  it("7×6 = 7×5 mais um sete", () => {
    const [, dois] = passos({ tabuada: 6, vezes: 7 });
    expect(dois.conta).toBe("35 + 7 = 42");
  });

  it("7×7 = 7×5 mais dois setes", () => {
    const [, dois] = passos({ tabuada: 7, vezes: 7 });
    expect(dois.conta).toBe("35 + 14 = 49");
  });

  it("7×8 = o dobro de 7×4", () => {
    const [um, dois] = passos({ tabuada: 8, vezes: 7 });
    expect(um.conta).toBe("7 × 4 = 28");
    expect(dois.conta).toBe("28 × 2 = 56");
  });

  it("o último passo sempre chega à resposta, em toda a ficha", () => {
    for (const c of TODAS) {
      expect(passos(c)[1].resultado, `${c.tabuada}×${c.vezes}`).toBe(resolver(c));
    }
  });

  it("a âncora é sempre um fato mais fácil que o perguntado", () => {
    for (const c of TODAS) {
      expect(ESTRATEGIA_DE[c.tabuada].ancora, `${c.tabuada}×${c.vezes}`)
        .not.toBe(c.tabuada);
    }
  });

  it("a fala dos passos nunca usa símbolo — a criança ouve", () => {
    for (const c of TODAS) {
      for (const p of passos(c)) expect(p.fala).not.toMatch(/[×−]/);
    }
  });
});

describe("as difíceis são poucas de verdade", () => {
  it("sobram exatamente 10 fatos genuinamente novos", () => {
    expect(FATOS_NOVOS).toHaveLength(10);
  });

  it("todo fato novo tem os dois fatores entre 6 e 9", () => {
    for (const f of FATOS_NOVOS) {
      expect(f.tabuada).toBeGreaterThanOrEqual(6);
      expect(f.vezes).toBeGreaterThanOrEqual(6);
      expect(f.vezes).toBeLessThanOrEqual(9);
    }
  });

  it("nenhum fato novo se repete por comutatividade", () => {
    const canonico = FATOS_NOVOS.map(f =>
      [f.tabuada, f.vezes].sort((a, b) => a - b).join("x"));
    expect(new Set(canonico).size).toBe(10);
  });
});

describe("o truque do ×9", () => {
  it("os dígitos de todo múltiplo de nove somam nove", () => {
    for (let vezes = 2; vezes <= 10; vezes += 1) {
      expect(digitosSomamNove(9 * vezes), `9×${vezes}`).toBe(true);
    }
  });

  it("e isso não vale para as outras tabuadas difíceis", () => {
    expect(digitosSomamNove(6 * 7)).toBe(false);
    expect(digitosSomamNove(8 * 7)).toBe(false);
  });
});

describe("a escada dos cinco níveis", () => {
  it("uma estratégia por nível até o 3, depois tudo junto", () => {
    expect(tabuadasDoNivel(1)).toEqual([9]);
    expect(tabuadasDoNivel(2)).toEqual([6]);
    expect(tabuadasDoNivel(3)).toEqual([8]);
    expect(tabuadasDoNivel(4)).toContain(7);
    expect(tabuadasDoNivel(5)).toHaveLength(9);
  });

  it("o apoio da estratégia sai no nível 4", () => {
    expect([1, 2, 3, 4, 5].map(mostraEstrategia))
      .toEqual([true, true, true, false, false]);
  });

  it("cada nível difere observavelmente do anterior", () => {
    const assinatura = (n: number) => `${tabuadasDoNivel(n).join(",")}|${mostraEstrategia(n)}`;
    expect(new Set([1, 2, 3, 4, 5].map(assinatura)).size).toBe(5);
  });
});

describe("parar na âncora e ajustar para o lado errado são erros distintos", () => {
  it("em 7×9, responder 70 é ter parado no fato fácil", () => {
    expect(valorDaAncora({ tabuada: 9, vezes: 7 })).toBe(70);
    expect(distratores({ tabuada: 9, vezes: 7 }).find(d => d.valor === 70)?.tag)
      .toBe(MisconceptionTag.PAROU_NA_ANCORA);
  });

  it("em 7×9, responder 77 é ter somado onde era tirar", () => {
    expect(distratores({ tabuada: 9, vezes: 7 }).find(d => d.valor === 77)?.tag)
      .toBe(MisconceptionTag.DIRECAO_ERRADA);
  });

  it("em 7×6, responder 28 é ter tirado onde era somar", () => {
    // 7×5 = 35; somar 7 dá 42, tirar 7 dá 28.
    expect(distratores({ tabuada: 6, vezes: 7 }).find(d => d.valor === 28)?.tag)
      .toBe(MisconceptionTag.DIRECAO_ERRADA);
  });

  it("nenhum distrator é a resposta, nem se repete, em toda a ficha", () => {
    for (const c of TODAS) {
      const certo = resolver(c);
      const valores = distratores(c).map(d => d.valor);
      expect(valores, `${c.tabuada}×${c.vezes}`).not.toContain(certo);
      expect(new Set(valores).size).toBe(valores.length);
      for (const v of valores) expect(v).toBeGreaterThan(0);
    }
  });
});

describe("rejeitar a pergunta que não diagnostica", () => {
  it("×1 é recusada em todas as difíceis", () => {
    for (const t of TABUADAS_DIFICEIS) {
      expect(ehPergunavelComDiagnostico({ tabuada: t, vezes: 1 })).toBe(false);
    }
  });

  it("toda aceita mantém os dois erros característicos da âncora", () => {
    const aceitas = TODAS.filter(ehPergunavelComDiagnostico);
    expect(aceitas.length).toBeGreaterThanOrEqual(30);
    for (const c of aceitas) {
      const tags = distratores(c).map(d => d.tag);
      expect(tags).toContain(MisconceptionTag.PAROU_NA_ANCORA);
      expect(tags).toContain(MisconceptionTag.DIRECAO_ERRADA);
    }
  });

  it("os 10 fatos genuinamente novos são todos perguntáveis", () => {
    // Se algum fato novo caísse fora, a ficha não cumpriria o próprio objetivo.
    for (const f of FATOS_NOVOS) {
      expect(ehPergunavelComDiagnostico(f), `${f.tabuada}×${f.vezes}`).toBe(true);
    }
  });

  it("cada tabuada mantém material suficiente", () => {
    for (const t of TABUADAS_DIFICEIS) {
      const aceitas = TODAS.filter(c => c.tabuada === t && ehPergunavelComDiagnostico(c));
      expect(aceitas.length, `tabuada do ${t}`).toBeGreaterThanOrEqual(7);
    }
  });
});

describe("alternativas", () => {
  it("a resposta aparece uma vez só, com pelo menos três opções", () => {
    for (const c of TODAS.filter(ehPergunavelComDiagnostico)) {
      const alts = alternativas(c);
      expect(alts.filter(a => a.valor === resolver(c))).toHaveLength(1);
      expect(alts.length).toBeGreaterThanOrEqual(3);
      expect(new Set(alts.map(a => a.valor)).size).toBe(alts.length);
    }
  });

  it("nunca passa de quatro opções na tela — o teto do cânone §9.1", () => {
    // Cinco opções apareceram de verdade em 8×2, e a captura de tela mostrou:
    // excesso de escolha vira ruído para quem tem 8 anos, não dificuldade.
    for (const c of TODAS) {
      expect(alternativas(c).length, `${c.tabuada}×${c.vezes}`).toBeLessThanOrEqual(4);
      expect(alternativas(c).length, `${c.tabuada}×${c.vezes}`).toBeGreaterThanOrEqual(3);
    }
  });

  it("o teto corta o vizinho, nunca os dois erros específicos", () => {
    for (const c of TODAS.filter(ehPergunavelComDiagnostico)) {
      const tags = distratores(c).map(d => d.tag);
      expect(tags, `${c.tabuada}×${c.vezes}`).toContain(MisconceptionTag.PAROU_NA_ANCORA);
      expect(tags, `${c.tabuada}×${c.vezes}`).toContain(MisconceptionTag.DIRECAO_ERRADA);
    }
  });

  it("distingue tabuada difícil das já dominadas", () => {
    expect(ehTabuadaDificil(9)).toBe(true);
    expect(ehTabuadaDificil(6)).toBe(true);
    expect(ehTabuadaDificil(5)).toBe(false);
    expect(ehTabuadaDificil(10)).toBe(false);
  });
});
