import { describe, expect, it } from "vitest";
import { JOURNEY_FICHAS } from "../index";
import { ALL_MATH_TRACKS } from "../../motores/curriculum";

function fichaN105() {
  const ficha = JOURNEY_FICHAS.find(item => item.id === "N1.05");
  expect(ficha, "N1.05 precisa existir como ficha autoral antes de sair do legado").toBeDefined();
  return ficha!;
}

function trackN105() {
  const track = ALL_MATH_TRACKS.find(item => item.id === "N1.05");
  expect(track, "N1.05 precisa existir no runtime curricular").toBeDefined();
  return track!;
}

describe("N1.05 / F06 — comparação de quantidades", () => {
  it("é servida pelo Composer e mantém o palco Grupo-backed nos cinco níveis", () => {
    const ficha = fichaN105();
    const track = trackN105();

    expect(track.generatorSource).toBe("composer");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      expect(ficha.niveis?.[nivel]?.primitiva).toBe("grandeza");
      const q = track.gen(nivel);
      expect(q.kind, `nível ${nivel}`).toBe("grandeza");
      expect((q.uiProps as any)?.modo, `nível ${nivel}`).toBe("quantidade");
      expect(q.options, `nível ${nivel} responde tocando um dos dois grupos`).toHaveLength(2);
      expect(q.options?.map(option => option.value)).toEqual([0, 1]);
    }
  });

  it("faz a dificuldade crescer pela conservação da quantidade, não pela retirada do concreto", () => {
    const track = trackN105();
    const specs = [1, 2, 3, 4, 5].map(nivel => track.gen(nivel).uiProps as any);

    const diferenca = (spec: any) => Math.abs(spec.grupos[0].quantidade - spec.grupos[1].quantidade);
    expect(diferenca(specs[0])).toBe(4);
    expect(diferenca(specs[1])).toBe(2);
    expect(diferenca(specs[2])).toBe(1);
    expect(diferenca(specs[3])).toBe(1);
    expect(diferenca(specs[4])).toBe(1);

    expect(specs[0].mesmaIdentidade).toBe(true);
    expect(specs[1].mesmaIdentidade).toBe(true);
    expect(specs[2].mesmaIdentidade).toBe(true);
    expect(specs[3].armadilhaTamanho).toBe(true);
    expect(specs[4].armadilhaEspaco).toBe(true);

    const menor = Math.min(...specs[4].grupos.map((grupo: any) => grupo.quantidade));
    expect(specs[4].grupos.find((grupo: any) => grupo.quantidade === menor)?.distribuicao).toBe("espalhada");
  });

  it("mantém caixas equivalentes e resposta derivada da quantidade em amostras repetidas", () => {
    const track = trackN105();
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let amostra = 0; amostra < 12; amostra += 1) {
        const q = track.gen(nivel);
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

  it("preserva onboarding autoral sem transformar tempo em critério de domínio", () => {
    const ficha = fichaN105();
    const primeiroMicro = ficha.micros.find(micro => micro.id === "diferenca_obvia");
    expect(primeiroMicro?.params?.tutorial).toHaveLength(4);
    expect(JSON.stringify(primeiroMicro?.params?.tutorial)).not.toMatch(/sobrou\s+\d/i);
    expect(Object.values(ficha.niveis ?? {}).every(nivel => nivel.rt_alvo == null)).toBe(true);
  });
});