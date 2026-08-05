import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { misconceptionForAnswer } from "../../../components/gameloop/answerPolicy";
import { Composer } from "../../Composer";
import { CurriculumValidator } from "../../schema";
import { AncoraSpec } from "../../procedimentos/ancoraContract";
import { FATOS_NOVOS } from "../../procedimentos/ancoraProcedure";
import { N4_07 } from "./N4.07";

/** N4.07 — ficha F44, implementada e ainda NÃO ativada. */

const gerar = (lvl: number) => Composer.generate(N4_07, lvl);

describe("a ficha em si", () => {
  it("passa no validador do contrato universal", () => {
    expect(CurriculumValidator.validate(N4_07)).toEqual([]);
  });

  it("depende de N4.04: as âncoras ×4 e ×5 precisam existir antes", () => {
    expect(N4_07.prereqs).toContain("N4.04");
  });

  it("declara os cinco níveis, com alvo de tempo só no último", () => {
    for (let n = 1; n <= 5; n += 1) expect(N4_07.niveis?.[n]).toBeTruthy();
    expect(N4_07.niveis?.[5].rt_alvo).toBe(5000);
  });
});

describe("a questão gerada, nos cinco níveis", () => {
  it("traz tudo que o GameLoop exige", () => {
    for (let lvl = 1; lvl <= 5; lvl += 1) {
      const q = gerar(lvl);
      expect(q.kind, `nível ${lvl}`).toBe("ancora");
      expect(q.audioPrompt).toBeTruthy();
      expect(q.answer).toBeGreaterThan(0);
      expect(q.options?.length).toBeGreaterThanOrEqual(3);
      expect(q.uiProps).toBeTruthy();
      expect(q.isFallback).toBeFalsy();
    }
  });

  it("o apoio da estratégia sai no nível 4", () => {
    expect((gerar(1).uiProps as AncoraSpec).escrita).not.toBeNull();
    expect((gerar(3).uiProps as AncoraSpec).visual).not.toBeNull();
    expect((gerar(4).uiProps as AncoraSpec).escrita).toBeNull();
    expect((gerar(4).uiProps as AncoraSpec).visual).toBeNull();
  });

  it("o nível 1 mostra a coluna que sai, porque o ×9 tira um grupo", () => {
    const s = gerar(1).uiProps as AncoraSpec;
    expect(s.visual?.colunas, "a âncora do ×9 é o ×10").toBe(10);
    expect(s.visual?.colunasQueSaem).toBe(1);
  });

  it("o nível 5 abre para a tabuada completa", () => {
    const vistas = new Set<number>();
    for (let i = 0; i < 400; i += 1) {
      vistas.add(Number((gerar(5).uiProps as AncoraSpec).pergunta.split("×")[0].trim()));
    }
    expect([...vistas].sort((a, b) => a - b)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});

describe("500 amostras — o portão de robustez do Padrão Ouro", () => {
  const amostras = Array.from({ length: 500 }, (_, i) => gerar((i % 5) + 1));

  it("nenhuma exceção nem laço infinito", () => {
    expect(amostras).toHaveLength(500);
  });

  it("a resposta aparece uma vez só, positiva, sem repetição", () => {
    for (const q of amostras) {
      const valores = (q.options ?? []).map(o => Number(o.value));
      expect(valores.filter(v => v === q.answer)).toHaveLength(1);
      for (const v of valores) expect(v).toBeGreaterThan(0);
      expect(new Set(valores).size).toBe(valores.length);
    }
  });

  it("o que a tela mostra nunca contém a resposta", () => {
    // A armadilha desta ficha: a decomposição de 7×9 é `7 × 10 = 70` e
    // `70 − 7 = 63`. Escrever as duas linhas daria o gabarito.
    for (const q of amostras) {
      const s = q.uiProps as AncoraSpec;
      const visivel = [s.pergunta, s.falado, s.visual?.descricao,
        s.escrita?.ancora, s.escrita?.emAberto].filter(Boolean).join(" ");
      const numeros = (visivel.match(/\d+/g) ?? []).map(Number);
      expect(numeros, `${s.pergunta} vazou ${q.answer}`).not.toContain(q.answer);
    }
  });

  it("a recapitulação sempre fecha na resposta", () => {
    for (const q of amostras) {
      const s = q.uiProps as AncoraSpec;
      if (!s.recapitulacao.length) continue;
      expect(s.recapitulacao[s.recapitulacao.length - 1]).toContain(String(q.answer));
    }
  });

  it("os 10 fatos genuinamente novos aparecem no nível 4", () => {
    const vistos = new Set<string>();
    for (let i = 0; i < 800; i += 1) {
      vistos.add((gerar(4).uiProps as AncoraSpec).pergunta.replace(/\s/g, ""));
    }
    const faltando = FATOS_NOVOS
      .map(f => `${f.tabuada}×${f.vezes}`)
      .filter(p => !vistos.has(p));
    // Comutatividade: 6×7 pode sair como 7×6. Basta que a combinação apareça.
    const semComutar = faltando.filter(p => {
      const [a, b] = p.split("×");
      return !vistos.has(`${b}×${a}`);
    });
    expect(semComutar, "fatos difíceis que nunca são perguntados").toEqual([]);
  });
});

describe("telemetria: os erros da estratégia por âncora", () => {
  it("a resposta certa não gera diagnóstico", () => {
    const q = gerar(4);
    expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
  });

  it("parar na âncora é distinguido de ajustar para o lado errado", () => {
    for (let i = 0; i < 60; i += 1) {
      const q = gerar((i % 3) + 1);
      const s = q.uiProps as AncoraSpec;
      const parou = s.alternativas.find(a => a.tag === MisconceptionTag.PAROU_NA_ANCORA);
      const errou = s.alternativas.find(a => a.tag === MisconceptionTag.DIRECAO_ERRADA);
      expect(parou, `${s.pergunta} sem "parou na âncora"`).toBeTruthy();
      expect(errou, `${s.pergunta} sem "direção errada"`).toBeTruthy();
      expect(misconceptionForAnswer(q, parou!.valor)).toBe(MisconceptionTag.PAROU_NA_ANCORA);
      expect(misconceptionForAnswer(q, errou!.valor)).toBe(MisconceptionTag.DIRECAO_ERRADA);
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
