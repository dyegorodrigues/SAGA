import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  RESPOSTAS,
  arranjoDoNivel,
  cenasDoNivel,
  desfechoDe,
  diagnosticar,
  momentoDaPergunta,
  pareamentoPerfeito,
  perguntaDoNivel,
  temMaoFantasma,
  tetoDoNivel,
} from "./pareamentoProcedure";

const NIVEIS = [1, 2, 3, 4, 5];
const TODAS = NIVEIS.flatMap(n => cenasDoNivel(n).map(c => ({ c, n })));

describe("a regra dura da ficha F07: nenhum numeral, em nenhum nível", () => {
  it("nenhuma pergunta contém dígito", () => {
    // Se aparecer número, virou N1.04 (contar). A competência aqui é
    // pré-numérica, e esta é a única regra que a ficha marca com ⚠️.
    for (const n of NIVEIS) {
      const p = perguntaDoNivel(n);
      if (p) expect(p, `nível ${n}`).not.toMatch(/\d/);
    }
  });

  it("nenhum rótulo de resposta contém dígito", () => {
    for (const r of RESPOSTAS) expect(r.rotulo).not.toMatch(/\d/);
  });

  it("a pergunta nunca é 'quantos'", () => {
    // O coração da ficha: a pergunta é "sobrou?", não "quantos?". Contar é
    // outra competência, e perguntar quantos aqui destruiria a anterior.
    for (const n of NIVEIS) {
      const p = perguntaDoNivel(n);
      if (p) expect(p.toLowerCase(), `nível ${n}`).not.toContain("quantos");
    }
  });
});

describe("a escada dos cinco níveis, transcrita da tabela da F07 §5", () => {
  it("nível 1 é exato e pequeno: três e três", () => {
    expect(cenasDoNivel(1)).toEqual([{ receptores: 3, itens: 3 }]);
    expect(desfechoDe(cenasDoNivel(1)[0])).toBe("exato");
  });

  it("nível 2 é três e quatro — sobra exatamente um", () => {
    expect(cenasDoNivel(2)).toEqual([{ receptores: 3, itens: 4 }]);
    expect(desfechoDe(cenasDoNivel(2)[0])).toBe("sobra");
  });

  it("o teto cresce como a tabela manda: 4, 4, 6, 8, 10", () => {
    expect(NIVEIS.map(tetoDoNivel)).toEqual([4, 4, 6, 8, 10]);
  });

  it("o arranjo endurece: fila, fila, espalhado, cena, cena", () => {
    expect(NIVEIS.map(arranjoDoNivel))
      .toEqual(["fila", "fila", "espalhado", "cena", "cena"]);
  });

  it("a Mão Fantasma só existe no nível 1", () => {
    expect(NIVEIS.map(temMaoFantasma)).toEqual([true, false, false, false, false]);
  });

  it("a pergunta existe em TODOS os níveis, e inverte no 5", () => {
    // O roteiro da §4 traz o Fecho com "sobrou algum?" já no nível 1, e a ficha
    // grifa que a pergunta final é o coração. Tirá-la do primeiro nível
    // apagaria o assunto justamente na tela em que ele é ensinado.
    expect(NIVEIS.map(momentoDaPergunta))
      .toEqual(["depois", "depois", "depois", "depois", "antes"]);
  });

  it("cada nível difere observavelmente do anterior", () => {
    // O nível 1 se distingue pela Mão Fantasma e pelo caso exato; o 2 pelo
    // "sobra um" com a criança sozinha.
    const assinatura = (n: number) =>
      `${tetoDoNivel(n)}|${arranjoDoNivel(n)}|${momentoDaPergunta(n)}|${temMaoFantasma(n)}`;
    expect(new Set(NIVEIS.map(assinatura)).size).toBeGreaterThanOrEqual(4);
  });

  it("nenhuma cena passa do teto do nível, nem fica sem peça", () => {
    for (const { c, n } of TODAS) {
      expect(Math.max(c.receptores, c.itens), `nível ${n}`).toBeLessThanOrEqual(tetoDoNivel(n));
      expect(Math.min(c.receptores, c.itens), `nível ${n}`).toBeGreaterThanOrEqual(1);
    }
  });

  it("do nível 3 em diante há sobra E falta — a comparação vai nos dois sentidos", () => {
    for (const n of [3, 4, 5]) {
      const desfechos = new Set(cenasDoNivel(n).map(desfechoDe));
      expect(desfechos.has("sobra"), `nível ${n} sem sobra`).toBe(true);
      expect(desfechos.has("falta"), `nível ${n} sem falta`).toBe(true);
    }
  });

  it("só o nível 5 sorteia casos exatos — prever 'sim' precisa ser possível", () => {
    expect(cenasDoNivel(4).some(c => desfechoDe(c) === "exato")).toBe(false);
    expect(cenasDoNivel(5).some(c => desfechoDe(c) === "exato")).toBe(true);
  });

  it("todo nível tem material suficiente para não repetir a mesma cena", () => {
    for (const n of [3, 4, 5]) {
      expect(cenasDoNivel(n).length, `nível ${n}`).toBeGreaterThanOrEqual(8);
    }
  });
});

describe("o diagnóstico vem da AÇÃO — ficha F07 §6", () => {
  const cena = { receptores: 3, itens: 4 };

  it("dois itens no mesmo receptor é não ter a regra 'um e só um'", () => {
    expect(diagnosticar({ porReceptor: [2, 1, 0], naBandeja: 1 }, cena))
      .toBe(MisconceptionTag.DISTRIBUICAO_DESIGUAL);
  });

  it("receptor vazio COM item sobrando é ter perdido o fio", () => {
    expect(diagnosticar({ porReceptor: [1, 1, 0], naBandeja: 2 }, cena))
      .toBe(MisconceptionTag.PAREAMENTO_INCOMPLETO);
  });

  it("dizer que sobrou quando não sobrou é julgar pela aparência", () => {
    const exata = { receptores: 3, itens: 3 };
    expect(diagnosticar(
      { porReceptor: [1, 1, 1], naBandeja: 0, respostaDaPergunta: "sobra" }, exata,
    )).toBe(MisconceptionTag.COMPARACAO_VISUAL);
  });

  it("a distribuição perfeita não gera diagnóstico nenhum", () => {
    // Resposta certa não pode virar hipótese no Radar.
    expect(diagnosticar({ porReceptor: [1, 1, 1], naBandeja: 1, respostaDaPergunta: "sobra" }, cena))
      .toBeUndefined();
  });

  it("a desigualdade tem prioridade sobre o incompleto", () => {
    // Quem pôs dois num bombeiro quase sempre deixou outro sem. As duas marcas
    // aparecem juntas; a que explica a cabeça da criança é a primeira.
    expect(diagnosticar({ porReceptor: [2, 0, 0], naBandeja: 2 }, cena))
      .toBe(MisconceptionTag.DISTRIBUICAO_DESIGUAL);
  });
});

describe("o que conta como pareamento perfeito", () => {
  it("um e só um para cada, com o que sobra na bandeja", () => {
    expect(pareamentoPerfeito(
      { porReceptor: [1, 1, 1], naBandeja: 1 }, { receptores: 3, itens: 4 },
    )).toBe(true);
  });

  it("com FALTA de itens, o certo é ter distribuído todos os que existiam", () => {
    // Dois capacetes para três bombeiros: acertar é pôr os dois e reconhecer
    // que faltou — não é deixar um bombeiro com dois.
    expect(pareamentoPerfeito(
      { porReceptor: [1, 1, 0], naBandeja: 0 }, { receptores: 3, itens: 2 },
    )).toBe(true);
  });

  it("dobrar num receptor nunca é perfeito", () => {
    expect(pareamentoPerfeito(
      { porReceptor: [2, 1, 0], naBandeja: 1 }, { receptores: 3, itens: 4 },
    )).toBe(false);
  });

  it("sobrar item na bandeja com receptor vazio nunca é perfeito", () => {
    expect(pareamentoPerfeito(
      { porReceptor: [1, 1, 0], naBandeja: 2 }, { receptores: 3, itens: 4 },
    )).toBe(false);
  });
});
