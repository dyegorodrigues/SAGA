import { describe, expect, it } from "vitest";
import { TEMAS, construirPareamentoSpec, nenhumNumeralNaTela } from "./pareamentoContract";
import { cenasDoNivel, desfechoDe } from "./pareamentoProcedure";

const NIVEIS = [1, 2, 3, 4, 5];
/** Toda cena de todo nível, em todos os temas. */
const TUDO = NIVEIS.flatMap(n =>
  cenasDoNivel(n).flatMap(c => TEMAS.map(t => ({ c, n, t }))));

describe("a regra dura: nenhum numeral chega à tela", () => {
  it("em nenhuma cena, de nenhum nível, em nenhum tema", () => {
    for (const { c, n, t } of TUDO) {
      const spec = construirPareamentoSpec(c, n, t);
      expect(nenhumNumeralNaTela(spec), `nível ${n}, ${t.quem}`).toBe(true);
    }
  });

  it("nem o nome dos lados traz quantidade", () => {
    // "os bombeiros", não "4 bombeiros". A quantidade existe no spec para
    // desenhar as peças; ela nunca vira palavra.
    for (const { c, n, t } of TUDO) {
      const spec = construirPareamentoSpec(c, n, t);
      expect(spec.receptores.nome).not.toMatch(/\d/);
      expect(spec.itens.nome).not.toMatch(/\d/);
    }
  });
});

describe("o enunciado é uma história, não uma instrução", () => {
  it("nomeia o par que faz sentido junto", () => {
    const spec = construirPareamentoSpec({ receptores: 3, itens: 3 }, 1, TEMAS[0]);
    expect(spec.enunciado).toBe("Dê um capacete para cada bombeiro!");
  });

  it("concorda em gênero — 'uma banana', não 'um banana'", () => {
    // A criança de 4 anos OUVE. Erro de concordância soa errado antes de
    // parecer errado.
    const macacos = TEMAS.find(t => t.verbo === "banana")!;
    const spec = construirPareamentoSpec({ receptores: 3, itens: 3 }, 1, macacos);
    expect(spec.enunciado).toContain("uma banana");
  });

  it("o falado é igual ao escrito: quem não lê ouve a mesma coisa", () => {
    for (const { c, n, t } of TUDO) {
      const spec = construirPareamentoSpec(c, n, t);
      expect(spec.falado).toBe(spec.enunciado);
    }
  });
});

describe("a pergunta do 'sobrou?' chega à tela na hora certa", () => {
  it("o nível 1 já pergunta — o que muda é a Mão Fantasma narrando", () => {
    const spec = construirPareamentoSpec(cenasDoNivel(1)[0], 1, TEMAS[0]);
    expect(spec.pergunta).toContain("sobrou");
    expect(spec.respostas).toHaveLength(3);
    expect(spec.maoFantasma).toBe(true);
  });

  it("do 1 ao 4 a pergunta vem DEPOIS de distribuir", () => {
    for (const n of [1, 2, 3, 4]) {
      const spec = construirPareamentoSpec(cenasDoNivel(n)[0], n, TEMAS[0]);
      expect(spec.momentoDaPergunta, `nível ${n}`).toBe("depois");
      expect(spec.pergunta).toContain("sobrou");
    }
  });

  it("no 5 ela INVERTE: prever antes de distribuir", () => {
    const spec = construirPareamentoSpec(cenasDoNivel(5)[0], 5, TEMAS[0]);
    expect(spec.momentoDaPergunta).toBe("antes");
    expect(spec.pergunta).toContain("para todos");
  });

  it("as três respostas aparecem sempre que há pergunta", () => {
    for (const { c, n, t } of TUDO) {
      const spec = construirPareamentoSpec(c, n, t);
      expect(spec.respostas.map(r => r.desfecho)).toEqual(["sobra", "exato", "falta"]);
    }
  });

  it("o desfecho do spec é o da cena — o gabarito não se inventa", () => {
    for (const { c, n, t } of TUDO) {
      expect(construirPareamentoSpec(c, n, t).desfecho).toBe(desfechoDe(c));
    }
  });
});

describe("a escada chega à tela", () => {
  it("cada nível produz uma cena observavelmente diferente", () => {
    const assinatura = (n: number) => {
      const s = construirPareamentoSpec(cenasDoNivel(n)[0], n, TEMAS[0]);
      return `${s.arranjo}|${s.momentoDaPergunta}|${s.maoFantasma}`;
    };
    expect(new Set(NIVEIS.map(assinatura)).size).toBeGreaterThanOrEqual(4);
  });

  it("as quantidades dos dois lados diferem sempre que a cena não é exata", () => {
    for (const { c, n, t } of TUDO) {
      const spec = construirPareamentoSpec(c, n, t);
      const iguais = spec.receptores.quantidade === spec.itens.quantidade;
      expect(iguais, `nível ${n}`).toBe(desfechoDe(c) === "exato");
    }
  });
});
