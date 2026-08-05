import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { misconceptionForAnswer } from "../../../components/gameloop/answerPolicy";
import { Composer } from "../../Composer";
import { CurriculumValidator } from "../../schema";
import { DecomposicaoSpec } from "../../procedimentos/decomposicaoContract";
import { N4_04 } from "./N4.04";

/** N4.04 — ficha F43, implementada e ainda NÃO ativada. */

const gerar = (lvl: number) => Composer.generate(N4_04, lvl);

describe("a ficha em si", () => {
  it("passa no validador do contrato universal", () => {
    expect(CurriculumValidator.validate(N4_04)).toEqual([]);
  });

  it("depende de N4.03: a âncora do dobro precisa existir antes", () => {
    // ×4 é dobrar o dobro. Sem o ×2 dominado, não há de onde partir.
    expect(N4_04.prereqs).toContain("N4.03");
  });

  it("declara os cinco níveis, com alvo de tempo só no último", () => {
    for (let n = 1; n <= 5; n += 1) expect(N4_04.niveis?.[n]).toBeTruthy();
    expect(N4_04.niveis?.[5].rt_alvo).toBe(5000);
    for (let n = 1; n <= 4; n += 1) expect(N4_04.niveis?.[n].rt_alvo).toBeUndefined();
  });
});

describe("a questão gerada, nos cinco níveis", () => {
  it("traz tudo que o GameLoop exige", () => {
    for (let lvl = 1; lvl <= 5; lvl += 1) {
      const q = gerar(lvl);
      expect(q.kind, `nível ${lvl}`).toBe("decomposicao");
      expect(q.audioPrompt, "criança não leitora precisa OUVIR").toBeTruthy();
      expect(q.answer).toBeGreaterThan(0);
      expect(q.options?.length).toBeGreaterThanOrEqual(3);
      expect(q.uiProps).toBeTruthy();
      expect(q.howto).toBeTruthy();
      expect(q.explain).toBeTruthy();
      expect(q.isFallback).toBeFalsy();
    }
  });

  it("o apoio troca de forma ao longo da escada", () => {
    expect((gerar(1).uiProps as DecomposicaoSpec).ancoraVisual).not.toBeNull();
    expect((gerar(2).uiProps as DecomposicaoSpec).escrita).not.toBeNull();
    expect((gerar(3).uiProps as DecomposicaoSpec).ancoraVisual).not.toBeNull();
    expect((gerar(4).uiProps as DecomposicaoSpec).ancoraVisual).toBeNull();
    expect((gerar(4).uiProps as DecomposicaoSpec).escrita).toBeNull();
  });

  it("o nível 5 mistura as cinco tabuadas, inclusive as de N4.03", () => {
    const vistas = new Set<string>();
    for (let i = 0; i < 300; i += 1) {
      vistas.add((gerar(5).uiProps as DecomposicaoSpec).pergunta.split("×")[0].trim());
    }
    expect([...vistas].map(Number).sort((a, b) => a - b)).toEqual([2, 3, 4, 5, 10]);
  });
});

describe("500 amostras — o portão de robustez do Padrão Ouro", () => {
  const amostras = Array.from({ length: 500 }, (_, i) => gerar((i % 5) + 1));

  it("nenhuma exceção nem laço infinito", () => {
    expect(amostras).toHaveLength(500);
  });

  it("a resposta correta aparece exatamente uma vez", () => {
    for (const q of amostras) {
      expect(q.options?.filter(o => o.value === q.answer)).toHaveLength(1);
    }
  });

  it("nenhuma alternativa é negativa, zero ou repetida", () => {
    for (const q of amostras) {
      const valores = (q.options ?? []).map(o => Number(o.value));
      for (const v of valores) expect(v).toBeGreaterThan(0);
      expect(new Set(valores).size).toBe(valores.length);
    }
  });

  it("o que a tela mostra na hora da pergunta nunca contém a resposta", () => {
    // A armadilha específica desta ficha: a decomposição completa é
    // `7 × 2 = 14` e `14 × 2 = 28`. Escrever as duas linhas seria dar o gabarito
    // com aparência de apoio.
    for (const q of amostras) {
      const s = q.uiProps as DecomposicaoSpec;
      const visivel = [s.pergunta, s.falado, s.ancoraVisual?.descricao,
        s.escrita?.ancora, s.escrita?.emAberto].filter(Boolean).join(" ");
      const numeros = (visivel.match(/\d+/g) ?? []).map(Number);
      expect(numeros, `${s.pergunta} vazou ${q.answer}`).not.toContain(q.answer);
    }
  });

  it("a recapitulação, que vem depois, sempre fecha na resposta", () => {
    for (const q of amostras) {
      const s = q.uiProps as DecomposicaoSpec;
      if (!s.recapitulacao.length) continue;
      expect(s.recapitulacao[s.recapitulacao.length - 1]).toContain(String(q.answer));
    }
  });
});

describe("telemetria: cada erro conta uma história diferente", () => {
  it("a resposta certa não gera diagnóstico", () => {
    const q = gerar(4);
    expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
  });

  it("parar no dobro é distinguido de aplicar a outra estratégia", () => {
    for (let i = 0; i < 60; i += 1) {
      const q = gerar(4);
      const s = q.uiProps as DecomposicaoSpec;
      const parou = s.alternativas.find(a => a.tag === MisconceptionTag.PAROU_NO_DOBRO);
      const trocou = s.alternativas.find(a => a.tag === MisconceptionTag.TROCOU_ESTRATEGIA);
      expect(parou, `${s.pergunta} sem "parou no dobro"`).toBeTruthy();
      expect(trocou, `${s.pergunta} sem "trocou estratégia"`).toBeTruthy();
      expect(misconceptionForAnswer(q, parou!.valor)).toBe(MisconceptionTag.PAROU_NO_DOBRO);
      expect(misconceptionForAnswer(q, trocou!.valor)).toBe(MisconceptionTag.TROCOU_ESTRATEGIA);
    }
  });

  it("nenhuma alternativa errada vem muda", () => {
    for (let i = 0; i < 100; i += 1) {
      const q = gerar((i % 5) + 1);
      for (const o of q.options ?? []) {
        if (o.value === q.answer) continue;
        expect(misconceptionForAnswer(q, o.value),
          `${(q.uiProps as DecomposicaoSpec).pergunta} → ${o.value}`).toBeTruthy();
      }
    }
  });
});
