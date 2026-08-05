import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { misconceptionForAnswer } from "../../../components/gameloop/answerPolicy";
import { Composer } from "../../Composer";
import { CurriculumValidator } from "../../schema";
import { FamiliaSpec, enunciadoNaoRevela } from "../../procedimentos/familiaContract";
import { N4_06 } from "./N4.06";

const gerar = (lvl: number) => Composer.generate(N4_06, lvl);

describe("a ficha em si", () => {
  it("passa no validador do contrato universal", () => {
    expect(CurriculumValidator.validate(N4_06)).toEqual([]);
  });
  it("depende da tabuada: sem multiplicação não há família", () => {
    expect(N4_06.prereqs).toContain("N4.03");
  });
});

describe("500 amostras — o portão de robustez do Padrão Ouro", () => {
  const amostras = Array.from({ length: 500 }, (_, i) => gerar((i % 5) + 1));

  it("traz tudo que o GameLoop exige, sem placeholder", () => {
    for (const q of amostras) {
      expect(q.kind).toBe("familia");
      expect(q.audioPrompt).toBeTruthy();
      expect(q.answer).toBeGreaterThan(0);
      expect(q.options!.length).toBeGreaterThanOrEqual(3);
      expect(q.options!.length).toBeLessThanOrEqual(4);
      expect(q.isFallback).toBeFalsy();
    }
  });

  it("o vértice perguntado chega ao componente como interrogação", () => {
    // A regra do contrato: a incógnita não carrega valor.
    for (const q of amostras) {
      const t = (q.uiProps as FamiliaSpec).triangulo;
      const interrogacoes = [t.topo, t.esquerda, t.direita].filter(v => v === "?");
      expect(interrogacoes).toHaveLength(1);
    }
  });

  it("nada na tela contém a resposta — nem o triângulo, nem as contas de apoio", () => {
    for (const q of amostras) {
      expect(enunciadoNaoRevela(q.uiProps as FamiliaSpec),
        `${(q.uiProps as FamiliaSpec).pergunta} vazou ${q.answer}`).toBe(true);
    }
  });

  it("as contas de apoio vêm todas mascaradas", () => {
    for (const q of amostras) {
      for (const c of (q.uiProps as FamiliaSpec).apoio) expect(c).toMatch(/= \?$/);
    }
  });

  it("a recapitulação, que vem depois, traz as quatro contas resolvidas", () => {
    for (const q of amostras) {
      expect((q.uiProps as FamiliaSpec).recapitulacao).toHaveLength(4);
    }
  });

  it("a divisão aparece a partir do nível 3 e domina o 5", () => {
    const op = (lvl: number) => (gerar(lvl).uiProps as FamiliaSpec).operacao;
    expect(Array.from({ length: 30 }, () => op(1)).every(o => o === "multiplicacao")).toBe(true);
    expect(Array.from({ length: 30 }, () => op(5)).every(o => o === "divisao")).toBe(true);
  });
});

describe("telemetria", () => {
  it("a resposta certa não gera diagnóstico", () => {
    const q = gerar(4);
    expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
  });

  it("inverter a divisão é reconhecido quando a pergunta é de divisão", () => {
    for (let i = 0; i < 60; i += 1) {
      const q = gerar(5);
      const s = q.uiProps as FamiliaSpec;
      const inverteu = s.alternativas.find(a => a.tag === MisconceptionTag.INVERTE_DIVISAO);
      expect(inverteu, `${s.pergunta} sem "inverte divisão"`).toBeTruthy();
      expect(misconceptionForAnswer(q, inverteu!.valor)).toBe(MisconceptionTag.INVERTE_DIVISAO);
    }
  });

  it("nenhuma alternativa errada vem muda", () => {
    for (let i = 0; i < 100; i += 1) {
      const q = gerar((i % 5) + 1);
      for (const o of q.options ?? []) {
        if (o.value === q.answer) continue;
        expect(misconceptionForAnswer(q, o.value)).toBeTruthy();
      }
    }
  });
});
