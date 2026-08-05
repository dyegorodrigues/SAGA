import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  ANCORA,
  ESTRATEGIA_DE,
  OUTRO_FATOR_MAX,
  OUTRO_FATOR_MIN,
  TABUADAS_POR_DECOMPOSICAO,
  alternativasPara,
  distratores,
  dobroAncora,
  ehPergunavelComDiagnostico,
  ehPorDecomposicao,
  mostraArranjo,
  mostraDecomposicaoEscrita,
  passos,
  resolver,
  tabuadasDoNivel,
} from "./decomposicaoProcedure";

const TODAS = TABUADAS_POR_DECOMPOSICAO.flatMap(tabuada =>
  Array.from({ length: OUTRO_FATOR_MAX - OUTRO_FATOR_MIN + 1 },
    (_, i) => ({ tabuada, vezes: i + OUTRO_FATOR_MIN })));

describe("a estratégia, não a tabuada", () => {
  it("×4 é dobrar o dobro; ×3 é o dobro mais um grupo", () => {
    expect(ESTRATEGIA_DE[4]).toBe("dobro_do_dobro");
    expect(ESTRATEGIA_DE[3]).toBe("dobro_mais_grupo");
  });

  it("as duas partem da mesma âncora — o dobro que a criança já sabe", () => {
    expect(ANCORA).toBe(2);
    expect(dobroAncora({ tabuada: 4, vezes: 7 })).toBe(14);
    expect(dobroAncora({ tabuada: 3, vezes: 7 })).toBe(14);
  });

  it("7×4: 7×2 = 14, e o dobro de 14 é 28", () => {
    const [um, dois] = passos({ tabuada: 4, vezes: 7 });
    expect(um.conta).toBe("7 × 2 = 14");
    expect(dois.conta).toBe("14 × 2 = 28");
    expect(dois.resultado).toBe(28);
  });

  it("7×3: 7×2 = 14, mais um grupo de 7 dá 21", () => {
    const [um, dois] = passos({ tabuada: 3, vezes: 7 });
    expect(um.conta).toBe("7 × 2 = 14");
    expect(dois.conta).toBe("14 + 7 = 21");
    expect(dois.resultado).toBe(21);
  });

  it("o último passo sempre chega à resposta, em toda a ficha", () => {
    for (const d of TODAS) {
      expect(passos(d)[1].resultado, `${d.tabuada}×${d.vezes}`).toBe(resolver(d));
    }
  });

  it("a fala dos passos nunca usa símbolo — a criança ouve", () => {
    for (const d of TODAS) {
      for (const p of passos(d)) {
        expect(p.fala, `${d.tabuada}×${d.vezes}`).not.toContain("×");
      }
    }
  });
});

describe("a escada dos cinco níveis", () => {
  it("segue a tabela da ficha F43", () => {
    expect(tabuadasDoNivel(1)).toEqual([4]);
    expect(tabuadasDoNivel(2)).toEqual([4]);
    expect(tabuadasDoNivel(3)).toEqual([3]);
    expect(tabuadasDoNivel(4)).toEqual([3, 4]);
    // Nível 5 mistura com as de padrão visível: a fluência não separa por
    // estratégia, e o fato precisa vir de qualquer caminho.
    expect(tabuadasDoNivel(5).sort((a, b) => a - b)).toEqual([2, 3, 4, 5, 10]);
  });

  it("o apoio troca de forma entre os níveis, em vez de só sumir", () => {
    expect([1, 2, 3, 4, 5].map(mostraArranjo)).toEqual([true, false, true, false, false]);
    expect([1, 2, 3, 4, 5].map(mostraDecomposicaoEscrita))
      .toEqual([false, true, false, false, false]);
  });

  it("cada nível difere observavelmente do anterior", () => {
    const assinatura = (n: number) =>
      `${tabuadasDoNivel(n).join(",")}|${mostraArranjo(n)}|${mostraDecomposicaoEscrita(n)}`;
    expect(new Set([1, 2, 3, 4, 5].map(assinatura)).size).toBe(5);
  });
});

describe("as duas estratégias são o distrator uma da outra", () => {
  it("em ×4, responder 3n é ter aplicado a estratégia do ×3", () => {
    const ds = distratores({ tabuada: 4, vezes: 7 });
    expect(ds.find(d => d.valor === 21)?.tag).toBe(MisconceptionTag.TROCOU_ESTRATEGIA);
  });

  it("em ×3, responder 4n é ter aplicado a estratégia do ×4", () => {
    const ds = distratores({ tabuada: 3, vezes: 7 });
    expect(ds.find(d => d.valor === 28)?.tag).toBe(MisconceptionTag.TROCOU_ESTRATEGIA);
  });

  it("parar no dobro é o erro de não completar a estratégia", () => {
    expect(distratores({ tabuada: 4, vezes: 7 }).find(d => d.valor === 14)?.tag)
      .toBe(MisconceptionTag.PAROU_NO_DOBRO);
    expect(distratores({ tabuada: 3, vezes: 7 }).find(d => d.valor === 14)?.tag)
      .toBe(MisconceptionTag.PAROU_NO_DOBRO);
  });

  it("nenhum distrator é a resposta, nem se repete, em toda a ficha", () => {
    for (const d of TODAS) {
      const certo = resolver(d);
      const valores = distratores(d).map(x => x.valor);
      expect(valores, `${d.tabuada}×${d.vezes}`).not.toContain(certo);
      expect(new Set(valores).size, `${d.tabuada}×${d.vezes}`).toBe(valores.length);
      for (const v of valores) expect(v).toBeGreaterThan(0);
    }
  });
});

describe("rejeitar a pergunta que não diagnostica", () => {
  it("×1 é recusada: a resposta estaria escrita no enunciado", () => {
    for (const t of TABUADAS_POR_DECOMPOSICAO) {
      expect(ehPergunavelComDiagnostico({ tabuada: t, vezes: 1 })).toBe(false);
    }
  });

  it("toda aceita mantém os dois erros característicos da decomposição", () => {
    const aceitas = TODAS.filter(ehPergunavelComDiagnostico);
    expect(aceitas.length).toBeGreaterThanOrEqual(14);
    for (const d of aceitas) {
      const tags = distratores(d).map(x => x.tag);
      expect(tags, `${d.tabuada}×${d.vezes}`).toContain(MisconceptionTag.PAROU_NO_DOBRO);
      expect(tags, `${d.tabuada}×${d.vezes}`).toContain(MisconceptionTag.TROCOU_ESTRATEGIA);
    }
  });

  it("cada tabuada mantém material suficiente", () => {
    for (const t of TABUADAS_POR_DECOMPOSICAO) {
      const aceitas = TODAS.filter(d => d.tabuada === t && ehPergunavelComDiagnostico(d));
      expect(aceitas.length, `tabuada do ${t}`).toBeGreaterThanOrEqual(7);
    }
  });
});

describe("o nível 5 reusa o procedimento de N4.03 em vez de reinventar", () => {
  it("distingue tabuada por decomposição de tabuada por padrão", () => {
    expect(ehPorDecomposicao(3)).toBe(true);
    expect(ehPorDecomposicao(4)).toBe(true);
    expect(ehPorDecomposicao(5)).toBe(false);
    expect(ehPorDecomposicao(10)).toBe(false);
  });

  it("×5 e ×10 recebem os distratores de padrão, com as tags de lá", () => {
    const alts = alternativasPara(5, 4);
    expect(alts[0].valor).toBe(20);
    expect(alts.map(a => a.tag)).toContain(MisconceptionTag.TABUADA_TROCADA);
  });

  it("×3 e ×4 recebem os distratores de decomposição", () => {
    const alts = alternativasPara(4, 7);
    expect(alts[0].valor).toBe(28);
    expect(alts.map(a => a.tag)).toContain(MisconceptionTag.PAROU_NO_DOBRO);
  });

  it("a resposta aparece uma vez só, em qualquer tabuada do nível 5", () => {
    for (const tabuada of tabuadasDoNivel(5)) {
      for (let vezes = OUTRO_FATOR_MIN; vezes <= OUTRO_FATOR_MAX; vezes += 1) {
        const alts = alternativasPara(tabuada, vezes);
        const certo = alts[0].valor;
        expect(alts.filter(a => a.valor === certo), `${tabuada}×${vezes}`).toHaveLength(1);
        expect(new Set(alts.map(a => a.valor)).size).toBe(alts.length);
      }
    }
  });
});
