import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { misconceptionForAnswer } from "../../../components/gameloop/answerPolicy";
import { Composer } from "../../Composer";
import { CurriculumValidator } from "../../schema";
import { TabuadaSpec } from "../../procedimentos/tabuadaContract";
import { N4_03 } from "./N4.03";

/**
 * N4.03 — ficha F42, ainda NÃO ativada em produção.
 *
 * Cobre o que o contrato do canário exigirá no PR de ativação, para que aquele
 * PR não descubra problema nenhum: ele deve ser só a entrada no conjunto.
 */

const gerar = (lvl: number) => Composer.generate(N4_03, lvl);

describe("a ficha em si", () => {
  it("passa no validador do contrato universal", () => {
    expect(CurriculumValidator.validate(N4_03)).toEqual([]);
  });

  it("declara os cinco níveis e o alvo de tempo só no último", () => {
    for (let n = 1; n <= 5; n += 1) expect(N4_03.niveis?.[n]).toBeTruthy();
    expect(N4_03.niveis?.[5].rt_alvo).toBe(4000);
    for (let n = 1; n <= 4; n += 1) expect(N4_03.niveis?.[n].rt_alvo).toBeUndefined();
  });

  it("o domínio é de COMPREENSÃO, e cabe numa missão (DECISAO-002)", () => {
    // 4 de 5 é a mesma proporção de 8 de 10 — continua não bastando o acerto
    // único —, mas cabe na missão de oito questões, e é critério conceitual.
    // A §11.9 tira a fluência da decisão da coroa; ela vive no Dojo (`dojo_mul`)
    // e no `rt_alvo` do nível 5, que segue medido sem reprovar domínio.
    for (const micro of N4_03.micros) {
      expect(micro.dominio).toMatchObject({ acertos: 4, de: 5, sessoes: 3 });
    }
    // A retenção continua sendo a mais exigente da Jornada: três sessões
    // espaçadas. Retenção é dimensão conceitual pela §11.9, não fluência.
    for (const micro of N4_03.micros) expect(micro.dominio.sessoes).toBe(3);
  });

  it("o nível que mistura tabuadas exige mais de uma tabuada (CLASS-008)", () => {
    // A fluência que o nível misto cobra é escolher entre tabuadas, não repetir
    // uma. Sem esta exigência, oito acertos seguidos em ×2 coroavam "mistura".
    const misturadas = N4_03.micros.find(micro => micro.id === "misturadas")!;
    expect(misturadas.dominio.evidenciasDistintas).toMatchObject({ prefixo: "familia:N4.03:", minimo: 2 });
    for (const micro of N4_03.micros.filter(item => item.id !== "misturadas")) {
      expect(micro.dominio.evidenciasDistintas, `${micro.id} não mistura tabuadas`).toBeUndefined();
    }
  });
});

describe("a questão gerada, nos cinco níveis", () => {
  it("traz tudo que o GameLoop exige", () => {
    for (let lvl = 1; lvl <= 5; lvl += 1) {
      const q = gerar(lvl);
      expect(q.kind, `nível ${lvl}`).toBe("tabuada");
      expect(q.prompt).toBeTruthy();
      expect(q.audioPrompt, "criança não leitora precisa OUVIR a conta").toBeTruthy();
      expect(q.answer).toBeGreaterThan(0);
      expect(q.options?.length).toBeGreaterThanOrEqual(3);
      expect(q.uiProps).toBeTruthy();
      expect(q.howto).toBeTruthy();
      expect(q.explain).toBeTruthy();
    }
  });

  it("o alvo de tempo chega ao GameLoop apenas no nível 5", () => {
    expect(gerar(4).rt_max_s).toBeUndefined();
    expect(gerar(5).rt_max_s).toBe(4);
  });

  it("o enunciado falado não usa símbolo matemático", () => {
    for (let lvl = 1; lvl <= 5; lvl += 1) {
      expect(gerar(lvl).audioPrompt).not.toContain("×");
    }
  });
});

describe("500 amostras — o portão de robustez do Padrão Ouro", () => {
  const amostras = Array.from({ length: 500 }, (_, i) => gerar((i % 5) + 1));

  it("nenhuma exceção nem laço infinito", () => {
    expect(amostras).toHaveLength(500);
  });

  it("a resposta correta aparece exatamente uma vez entre as alternativas", () => {
    for (const q of amostras) {
      expect(q.options?.filter(o => o.value === q.answer)).toHaveLength(1);
    }
  });

  it("nenhuma alternativa é negativa ou zero", () => {
    for (const q of amostras) {
      for (const o of q.options ?? []) expect(Number(o.value)).toBeGreaterThan(0);
    }
  });

  it("nenhuma alternativa se repete", () => {
    for (const q of amostras) {
      const valores = (q.options ?? []).map(o => o.value);
      expect(new Set(valores).size).toBe(valores.length);
    }
  });

  it("o enunciado nunca contém a resposta", () => {
    // 10×1 = 10 traria a resposta escrita; o procedimento recusa esses casos.
    for (const q of amostras) {
      const spec = q.uiProps as TabuadaSpec;
      const numeros = (`${spec.pergunta} ${spec.falado}`.match(/\d+/g) ?? []).map(Number);
      expect(numeros, spec.pergunta).not.toContain(q.answer);
    }
  });

  it("as três tabuadas realmente aparecem", () => {
    const vistas = new Set(amostras.map(q => (q.uiProps as TabuadaSpec).quadro?.tabuada
      ?? Number((q.uiProps as TabuadaSpec).pergunta.split("×")[0])));
    expect([...vistas].sort((a, b) => a - b)).toEqual([2, 5, 10]);
  });

  it("não repete a mesma questão em sequência mais que o tolerável", () => {
    // O material é finito (24 multiplicações válidas), então alguma repetição é
    // inevitável — mas repetição IMEDIATA é o defeito que a missão diária já
    // pagou uma vez. Aqui só se mede a variedade bruta por nível.
    const porNivel = new Map<number, Set<string>>();
    amostras.forEach((q, i) => {
      const lvl = (i % 5) + 1;
      const set = porNivel.get(lvl) ?? new Set<string>();
      set.add((q.uiProps as TabuadaSpec).pergunta);
      porNivel.set(lvl, set);
    });
    expect(porNivel.get(1)!.size, "nível 1 sem variedade").toBeGreaterThanOrEqual(5);
    expect(porNivel.get(4)!.size, "nível 4 sem variedade").toBeGreaterThanOrEqual(12);
  });
});

describe("telemetria: o erro vira hipótese, o acerto não", () => {
  it("a resposta certa não gera diagnóstico", () => {
    const q = gerar(4);
    expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
  });

  it("somar em vez de multiplicar recebe a tag da operação trocada", () => {
    const q = gerar(4);
    const spec = q.uiProps as TabuadaSpec;
    const somou = spec.alternativas.find(a => a.tag === MisconceptionTag.SOMA_OS_FATORES);
    if (somou) expect(misconceptionForAnswer(q, somou.valor)).toBe(MisconceptionTag.SOMA_OS_FATORES);
  });

  it("toda alternativa errada carrega hipótese; nenhuma vem muda", () => {
    for (let i = 0; i < 100; i += 1) {
      const q = gerar((i % 5) + 1);
      for (const o of q.options ?? []) {
        if (o.value === q.answer) continue;
        expect(misconceptionForAnswer(q, o.value), `${(q.uiProps as TabuadaSpec).pergunta} → ${o.value}`)
          .toBeTruthy();
      }
    }
  });
});
