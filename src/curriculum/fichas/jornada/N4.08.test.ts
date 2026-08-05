import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { misconceptionForAnswer } from "../../../components/gameloop/answerPolicy";
import { Composer } from "../../Composer";
import { CurriculumValidator } from "../../schema";
import { DeslocamentoSpec, enunciadoNaoRevela } from "../../procedimentos/deslocamentoContract";
import { N4_08 } from "./N4.08";

const gerar = (lvl: number) => Composer.generate(N4_08, lvl);

describe("a ficha em si", () => {
  it("passa no validador do contrato universal", () => {
    expect(CurriculumValidator.validate(N4_08)).toEqual([]);
  });
  it("depende da tabuada completa", () => {
    expect(N4_08.prereqs).toContain("N4.07");
  });
});

describe("500 amostras — o portão de robustez do Padrão Ouro", () => {
  const amostras = Array.from({ length: 500 }, (_, i) => gerar((i % 5) + 1));

  it("traz tudo que o GameLoop exige, sem placeholder", () => {
    for (const q of amostras) {
      expect(q.kind).toBe("deslocamento");
      expect(q.audioPrompt).toBeTruthy();
      expect(q.answer).toBeGreaterThan(0);
      expect(q.options!.length).toBeGreaterThanOrEqual(3);
      expect(q.options!.length).toBeLessThanOrEqual(4);
      expect(q.isFallback).toBeFalsy();
    }
  });

  it("o material mostra o número de PARTIDA, nunca o resultado", () => {
    for (const q of amostras) {
      const s = q.uiProps as DeslocamentoSpec;
      if (!s.material) continue;
      const valor = s.material.centenas * 100 + s.material.dezenas * 10 + s.material.unidades;
      expect(valor, `${s.pergunta}: material valia ${valor}`).not.toBe(q.answer);
      expect(valor).toBe(Number(s.pergunta.split("×")[0].trim()));
    }
  });

  it("nada na tela contém a resposta", () => {
    for (const q of amostras) {
      expect(enunciadoNaoRevela(q.uiProps as DeslocamentoSpec),
        `${(q.uiProps as DeslocamentoSpec).pergunta} vazou ${q.answer}`).toBe(true);
    }
  });

  it("a dica da promoção fala de peças, nunca de números", () => {
    for (const q of amostras) {
      const s = q.uiProps as DeslocamentoSpec;
      if (s.promocao) expect(s.promocao).not.toMatch(/\d/);
    }
  });

  it("o material sai a partir do nível 3", () => {
    expect((gerar(1).uiProps as DeslocamentoSpec).material).not.toBeNull();
    expect((gerar(2).uiProps as DeslocamentoSpec).material).not.toBeNull();
    for (const lvl of [3, 4, 5]) {
      expect((gerar(lvl).uiProps as DeslocamentoSpec).material, `nível ${lvl}`).toBeNull();
    }
  });

  it("a recapitulação fecha a conta", () => {
    for (const q of amostras) {
      expect((q.uiProps as DeslocamentoSpec).recapitulacao).toContain(String(q.answer));
    }
  });
});

describe("telemetria: os erros de valor posicional", () => {
  it("a resposta certa não gera diagnóstico", () => {
    const q = gerar(2);
    expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
  });

  it("no ×100, quem acrescenta um zero só é reconhecido", () => {
    for (let i = 0; i < 40; i += 1) {
      const q = gerar(2);
      const s = q.uiProps as DeslocamentoSpec;
      const zero = s.alternativas.find(a => a.tag === MisconceptionTag.ACRESCENTA_ZERO_SEM_ENTENDER);
      expect(zero, `${s.pergunta} sem o erro do zero`).toBeTruthy();
      expect(misconceptionForAnswer(q, zero!.valor))
        .toBe(MisconceptionTag.ACRESCENTA_ZERO_SEM_ENTENDER);
    }
  });

  it("no nível 4, esquecer o vai-um é reconhecido", () => {
    for (let i = 0; i < 40; i += 1) {
      const q = gerar(4);
      const s = q.uiProps as DeslocamentoSpec;
      const esqueceu = s.alternativas.find(a => a.tag === MisconceptionTag.ESQUECE_REAGRUPAMENTO);
      expect(esqueceu, `${s.pergunta} sem o erro de reagrupamento`).toBeTruthy();
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
