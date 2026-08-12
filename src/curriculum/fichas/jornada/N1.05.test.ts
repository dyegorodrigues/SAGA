import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../../constants/misconceptions";
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

  it("o specialized builder não perde tutorial, domínio nem o RT silencioso", () => {
    const ficha = fichaN105();
    const track = trackN105();
    const q1 = track.gen(1);
    const q5 = track.gen(5);

    expect(q1.tutorial).toHaveLength(3);
    expect(q1.tutorial?.[1]?.show).toEqual({ parear: 0 });
    expect(q1.tutorial?.[2]?.show).toEqual({ pulsarGrupos: true });
    expect(JSON.stringify(q1.tutorial)).not.toMatch(/destacarSobra|sobrou\s+\d/i);

    expect(q1.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
    expect(q5.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });

    expect(ficha.niveis?.[5]?.rt_alvo).toBe(8000);
    expect(q5.rt_max_s).toBe(8);
    expect(q1.rt_max_s).toBeUndefined();
  });

  it("emite as tags canônicas da F06, nunca strings privadas do builder", () => {
    const track = trackN105();
    const q4 = track.gen(4);
    const q5 = track.gen(5);
    const errada4 = q4.options?.find(option => option.value !== q4.answer);
    const errada5 = q5.options?.find(option => option.value !== q5.answer);

    expect(errada4?.misconception).toBe(MisconceptionTag.CONFUNDE_TAMANHO_QUANTIDADE);
    expect(errada5?.misconception).toBe(MisconceptionTag.CONSERVACAO_ESPACO);
  });
});