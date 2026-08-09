import { describe, expect, it } from "vitest";
import { Composer } from "../../Composer";
import { JOURNEY_FICHAS } from "../index";

function fichaN105() {
  const ficha = JOURNEY_FICHAS.find(item => item.id === "N1.05");
  expect(ficha, "N1.05 precisa existir como ficha autoral antes de sair do legado").toBeDefined();
  return ficha!;
}

describe("N1.05 / F06 — comparação de quantidades", () => {
  it("mantém Grupo nos cinco níveis; não vira comparação abstrata de numerais no meio da escada", () => {
    const ficha = fichaN105();
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      expect(ficha.niveis?.[nivel]?.primitiva).toBe("groups");
      const q = Composer.generate(ficha, nivel);
      expect(q.kind, `nível ${nivel}`).toBe("groups");
      expect(q.uiProps, `nível ${nivel} precisa de palco autoral`).toBeTruthy();
      expect(q.options, `nível ${nivel} responde tocando um dos dois grupos`).toHaveLength(2);
      expect(q.options?.map(option => option.value)).toEqual([0, 1]);
    }
  });

  it("faz a dificuldade crescer pela conservação da quantidade, não pela retirada do concreto", () => {
    const ficha = fichaN105();
    const specs = [1, 2, 3, 4, 5].map(nivel => Composer.generate(ficha, nivel).uiProps as any);

    const diferenca = (spec: any) => Math.abs(spec.grupos[0].quantidade - spec.grupos[1].quantidade);
    expect(diferenca(specs[0])).toBeGreaterThanOrEqual(3);
    expect(diferenca(specs[1])).toBeGreaterThanOrEqual(2);
    expect(diferenca(specs[2])).toBe(1);
    expect(diferenca(specs[3])).toBe(1);
    expect(diferenca(specs[4])).toBe(1);

    expect(specs[0].mesmaIdentidade).toBe(true);
    expect(specs[1].mesmaIdentidade).toBe(true);
    expect(specs[2].mesmaIdentidade).toBe(true);
    expect(specs[3].armadilhaTamanho).toBe(true);
    expect(specs[4].armadilhaEspaco).toBe(true);
    expect(specs[4].grupos.find((g: any) => g.quantidade === Math.min(...specs[4].grupos.map((x: any) => x.quantidade)))?.distribuicao).toBe("espalhada");
  });

  it("mantém contêineres semanticamente equivalentes e resposta derivada da quantidade", () => {
    const ficha = fichaN105();
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 12; amostra += 1) {
        const q = Composer.generate(ficha, nivel);
        const spec = q.uiProps as any;
        expect(spec.grupos).toHaveLength(2);
        expect(spec.grupos[0].caixa).toEqual(spec.grupos[1].caixa);
        const maior = spec.grupos[0].quantidade > spec.grupos[1].quantidade ? 0 : 1;
        expect(spec.resposta).toBe(maior);
        expect(q.answer).toBe(maior);
        expect(q.evaluate?.(maior)).toBe(true);
        expect(q.evaluate?.(1 - maior)).toBe(false);
      }
    }
  });
});