import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  ESCADA_DE_MODOS,
  FALAS,
  alternativaCentral,
  alternativasDoRelance,
  arranjoDoOlhometro,
  comprimentoDaSequencia,
  configuracaoDaMao,
  degrauAnterior,
  ehCrescente,
  diagnosticarMao,
  diagnosticarOlhometro,
  diagnosticarPadrao,
  exigeRevelacao,
  explainRespeitaOVeto,
  exposicaoDaMao,
  exposicaoDoOlhometro,
  lacunaNoMeio,
  mostraMolduraDaUnidade,
  quantidadeDaMao,
  quantidadeDoOlhometro,
  unidadesDoNivel,
} from "./emojiRowProcedure";
import { N1_03 } from "../fichas/jornada/N1.03";
import { N1_08 } from "../fichas/jornada/N1.08";
import { AL_02 } from "../fichas/jornada/AL.02";
import { FichaCompetencia } from "../schema";

/**
 * A escada de modos do `EmojiRow`, e a P1.
 *
 * As tabelas das §5 estão aqui **transcritas do Markdown**, não parafraseadas —
 * é a armadilha §6.11, que já custou uma competência inteira implementada com
 * uma distribuição de apoios inventada e testada contra si mesma.
 */

const FICHAS_MD = readFileSync(
  join(__dirname, "..", "..", "..", "AI_Studio_Lab", "pedagogia", "fichas", "FICHAS_F0_COMPLETAS.md"),
  "utf8",
);

describe("a escada de modos", () => {
  it("é a do PLANO §3, em ordem", () => {
    expect(ESCADA_DE_MODOS).toEqual(["plain", "flash", "flash-mao", "padrao"]);
  });

  it("cada degrau conhece o anterior, e o primeiro não tem", () => {
    expect(degrauAnterior("plain")).toBeNull();
    expect(degrauAnterior("flash")).toBe("plain");
    expect(degrauAnterior("flash-mao")).toBe("flash");
    expect(degrauAnterior("padrao")).toBe("flash-mao");
  });

  it("só os modos de relance exigem revelação", () => {
    // O `padrao` não some da tela: o degrau *plain* está nele o tempo todo.
    expect(exigeRevelacao("flash")).toBe(true);
    expect(exigeRevelacao("flash-mao")).toBe(true);
    expect(exigeRevelacao("padrao")).toBe(false);
  });
});

/* ------------------------------------------------------------------ *
 *  P1 — o mecanismo, não a boa intenção
 * ------------------------------------------------------------------ */

/** Os beats de coreografia declarados nos params de uma micro. */
function coreografiaDe(ficha: FichaCompetencia, microId: string): Record<string, unknown>[] {
  const micro = ficha.micros.find(m => m.id === microId);
  const t = micro?.params.tutorial;
  return Array.isArray(t) ? (t as Record<string, unknown>[]) : [];
}

describe("P1: o `EmojiRow` nunca estreia piscando", () => {
  /**
   * Este é O teste da pendência. Se ele cair, a escada voltou a não ter primeiro
   * degrau — e o defeito é invisível na tela: ela continua correta, testada,
   * acessível e incompreensível (§6.36).
   */
  it.each([
    ["N1.03", N1_03, 1],
    ["N1.08", N1_08, 1],
  ] as const)(
    "%s: o nível onde o modo de relance estreia mostra a fileira PARADA na micro-aula",
    (_id, ficha, nivel) => {
      const microId = ficha.niveis![nivel].micro!;
      const beats = coreografiaDe(ficha, microId);
      expect(beats.length, "o nível de estreia não declara coreografia").toBeGreaterThan(0);

      const show = beats.map(b => (b.show ?? {}) as Record<string, unknown>);
      // O beat que mostra o desenho em repouso. Sem ele, a criança encontra o
      // desenho sumindo antes de tê-lo visto parado — a P1 inteira.
      expect(
        show.some(s => s.revelar !== undefined),
        "nenhum beat `revelar`: o degrau *plain* sumiu da escada",
      ).toBe(true);
      // E a preparação, que avisa que algo vai aparecer e sumir.
      expect(show.some(s => s.fixarOlhar === true)).toBe(true);
    },
  );

  it("a quantidade da micro-aula não é a da pergunta — é demonstração", () => {
    // Se o `revelar` usasse o total da questão, a aula viraria gabarito. Os
    // números da coreografia vêm da §8 e são fixos; a pergunta é sorteada.
    const beats = coreografiaDe(N1_03, "estreia");
    const flash = beats.map(b => (b.show ?? {}) as any).find(s => s.flash);
    const revelar = beats.map(b => (b.show ?? {}) as any).find(s => s.revelar !== undefined);
    expect(flash.flash.n).toBe(2);
    expect(revelar.revelar).toBe(2);
  });
});

/* ------------------------------------------------------------------ *
 *  JD1 §5 — a tabela transcrita
 * ------------------------------------------------------------------ */

describe("JD1 §5 — o olhômetro", () => {
  it.each([
    [1, 1, 2, 1500, "fila"],
    [2, 1, 3, 1200, "fila"],
    [3, 1, 4, 1000, "dado"],
    [4, 1, 5, 800, "dado"],
    [5, 1, 5, 600, "disperso"],
  ])("nível %i: %i a %i, %ims, %s", (nivel, min, max, ms, arranjo) => {
    expect(quantidadeDoOlhometro(nivel)).toEqual({ min, max });
    expect(exposicaoDoOlhometro(nivel)).toBe(ms);
    expect(arranjoDoOlhometro(nivel)).toBe(arranjo);
  });

  it("a exposição cai a cada degrau — é a dificuldade desta ficha", () => {
    // §5: "sobe por automaticidade". Uma escada que só aumenta a quantidade
    // treinaria contar rápido, que é o oposto do que a ficha quer.
    const tempos = [1, 2, 3, 4, 5].map(exposicaoDoOlhometro);
    for (let i = 1; i < tempos.length; i += 1) {
      expect(tempos[i]).toBeLessThan(tempos[i - 1]);
    }
  });
});

/* ------------------------------------------------------------------ *
 *  JD2 §5 — a tabela transcrita
 * ------------------------------------------------------------------ */

describe("JD2 §5 — a mão relâmpago", () => {
  it.each([
    [1, 1, 5, 1500, "canonica"],
    [2, 1, 5, 1200, "livre"],
    [3, 5, 10, 1200, "duas-com-cheia"],
    [4, 6, 10, 1000, "duas-livres"],
    [5, 1, 10, 700, "duas-sem-cheia"],
  ])("nível %i: %i a %i, %ims, %s", (nivel, min, max, ms, config) => {
    expect(quantidadeDaMao(nivel)).toEqual({ min, max });
    expect(exposicaoDaMao(nivel)).toBe(ms);
    expect(configuracaoDaMao(nivel)).toBe(config);
  });
});

/* ------------------------------------------------------------------ *
 *  F52 §5 — a tabela transcrita
 * ------------------------------------------------------------------ */

describe("F52 §5 — os padrões", () => {
  it("nível 1 é AB, e só", () => {
    expect(unidadesDoNivel(1)).toEqual(["AB"]);
  });
  it("nível 2 sorteia entre AAB e ABB — a ficha diz 'ou'", () => {
    expect(unidadesDoNivel(2)).toEqual(["AAB", "ABB"]);
  });
  it("nível 3 é ABC", () => {
    expect(unidadesDoNivel(3)).toEqual(["ABC"]);
  });
  it("a lacuna só vai para o meio no nível 4", () => {
    expect([1, 2, 3, 4, 5].map(lacunaNoMeio)).toEqual([false, false, false, true, false]);
  });
  it("nível 5 traz o crescente NOS DOIS formatos — §6.36", () => {
    // Só `CRESCENTE` faria duas mudanças de uma vez: a alternação do objeto
    // SOME e o crescimento ENTRA. `CRESCENTE_ALTERNADO` mantém a alternação
    // que a criança domina desde o nível 1 e acrescenta só o crescimento.
    expect(unidadesDoNivel(5)).toEqual(["CRESCENTE", "CRESCENTE_ALTERNADO"]);
  });

  it("os dois crescentes têm passo 1: a unidade é o TAMANHO, não o conjunto", () => {
    expect(ehCrescente("CRESCENTE")).toBe(true);
    expect(ehCrescente("CRESCENTE_ALTERNADO")).toBe(true);
    expect(ehCrescente("ABC")).toBe(false);
  });
  it("a moldura da unidade é andaime de nível 1-2, e some depois", () => {
    expect([1, 2, 3, 4, 5].map(mostraMolduraDaUnidade)).toEqual([true, true, false, false, false]);
  });
  it("a sequência mostra a unidade repetida três vezes", () => {
    // Com duas repetições, "ABAB" também se lê como uma unidade "ABAB" que
    // ninguém viu repetir — e a regra deixa de ser inferível.
    expect(comprimentoDaSequencia("AB")).toBe(6);
    expect(comprimentoDaSequencia("ABC")).toBe(9);
  });
});

/* ------------------------------------------------------------------ *
 *  As alternativas
 * ------------------------------------------------------------------ */

describe("as alternativas do relance", () => {
  it("saem ordenadas e contêm a resposta uma vez", () => {
    for (let alvo = 1; alvo <= 5; alvo += 1) {
      const alt = alternativasDoRelance(alvo, 1, 5, () => 0.5);
      expect(alt.filter(v => v === alvo)).toHaveLength(1);
      expect([...alt].sort((a, b) => a - b)).toEqual(alt);
      expect(alt.length).toBeGreaterThanOrEqual(2);
      expect(alt.length).toBeLessThanOrEqual(3);
    }
  });

  it("nenhuma alternativa sai da faixa do nível", () => {
    for (let alvo = 1; alvo <= 5; alvo += 1) {
      for (const s of [0, 0.34, 0.67, 0.99]) {
        for (const v of alternativasDoRelance(alvo, 1, 5, () => s)) {
          expect(v).toBeGreaterThanOrEqual(1);
          expect(v).toBeLessThanOrEqual(5);
        }
      }
    }
  });

  it("a resposta NÃO fica sempre no meio — senão `CHUTE_SEGURO` não existiria", () => {
    // A §6 das duas fichas prevê a tag "sempre o número do meio". Ela só é
    // observável se a certa às vezes NÃO for a central: com a certa sempre no
    // centro, chutar o centro seria a estratégia perfeita.
    const posicoes = new Set<number>();
    for (const s of [0, 0.2, 0.4, 0.6, 0.8, 0.99]) {
      const alt = alternativasDoRelance(3, 1, 5, () => s);
      if (alt.length === 3) posicoes.add(alt.indexOf(3));
    }
    expect(posicoes.size, "a resposta cai sempre na mesma posição").toBeGreaterThan(1);
  });

  it("com duas alternativas não existe centro — e não se inventa um", () => {
    expect(alternativaCentral([2, 3])).toBeNull();
    expect(alternativaCentral([1, 2, 3])).toBe(2);
  });
});

/* ------------------------------------------------------------------ *
 *  Diagnóstico
 * ------------------------------------------------------------------ */

describe("diagnóstico — JD1 §6", () => {
  const base = { total: 3, alternativas: [2, 3, 4], arranjo: "fila" as const };

  it("acerto não gera diagnóstico", () => {
    expect(diagnosticarOlhometro({ ...base, resposta: 3 })).toBeUndefined();
  });

  it("n±1 é OFF_BY_ONE", () => {
    // A certa (3) É a central: a escolhida (2) não é, e por isso as hipóteses
    // ficam separadas e sobra só a de valor.
    expect(diagnosticarOlhometro({ resposta: 2, total: 3, alternativas: [2, 3, 4], arranjo: "fila" }))
      .toBe(MisconceptionTag.OFF_BY_ONE);
  });

  it("a alternativa central é CHUTE_SEGURO, mesmo caindo a um do alvo", () => {
    // A ordem importa: com OFF_BY_ONE na frente, esta hipótese nunca chegaria
    // ao Radar. É a armadilha §6.8.
    expect(diagnosticarOlhometro({ resposta: 3, total: 2, alternativas: [2, 3, 4], arranjo: "fila" }))
      .toBe(MisconceptionTag.CHUTE_SEGURO);
  });

  it("errar no disperso depois de acertar com formato é DEPENDE_DE_FORMATO", () => {
    expect(diagnosticarOlhometro({
      resposta: 2, total: 3, alternativas: [2, 3, 4], arranjo: "disperso", acertouComFormato: true,
    })).toBe(MisconceptionTag.DEPENDE_DE_FORMATO);
  });

  it("sem histórico, errar no disperso é só um erro", () => {
    // Dizer "depende de formato" de quem nunca acertou em lugar nenhum seria
    // inventar um diagnóstico.
    expect(diagnosticarOlhometro({
      resposta: 2, total: 3, alternativas: [2, 3, 4], arranjo: "disperso",
    })).toBe(MisconceptionTag.OFF_BY_ONE);
  });
});

describe("diagnóstico — JD2 §6", () => {
  it("responder o de uma mão só é IGNORA_SEGUNDA_MAO", () => {
    expect(diagnosticarMao({
      resposta: 5, total: 7, alternativas: [5, 7, 8], dedosPorMao: [5, 2],
      polegarLevantado: true, config: "duas-com-cheia",
    })).toBe(MisconceptionTag.IGNORA_SEGUNDA_MAO);
  });

  it("responder 5 a uma mão com polegar levantado é ANCORA_CINCO_RIGIDA", () => {
    expect(diagnosticarMao({
      resposta: 5, total: 3, alternativas: [2, 3, 5], dedosPorMao: [3],
      polegarLevantado: true, config: "canonica",
    })).toBe(MisconceptionTag.ANCORA_CINCO_RIGIDA);
  });

  it("acerto não gera diagnóstico", () => {
    expect(diagnosticarMao({
      resposta: 7, total: 7, alternativas: [6, 7, 8], dedosPorMao: [5, 2],
      polegarLevantado: true, config: "duas-com-cheia",
    })).toBeUndefined();
  });
});

describe("diagnóstico — F52 §6", () => {
  it("repetir o último visto é COPIA_ULTIMO — o alvo da ficha", () => {
    expect(diagnosticarPadrao({
      resposta: "🔵", correta: "🔴", anterior: "🔵", unidade: "AB",
    })).toBe(MisconceptionTag.COPIA_ULTIMO);
  });

  it("errar fora do AB depois de acertar o AB é SO_AB", () => {
    expect(diagnosticarPadrao({
      resposta: "🟡", correta: "🔴", anterior: "🔵", unidade: "AAB", acertouEmAB: true,
    })).toBe(MisconceptionTag.SO_AB);
  });

  it("no alternado, continuar UMA das duas regras é SO_UM_ATRIBUTO", () => {
    // Acertou o número e errou o objeto: ela viu o padrão, e viu metade dele.
    expect(diagnosticarPadrao({
      resposta: "🍎x4", correta: "🍌x4", anterior: "🍎x3", unidade: "CRESCENTE_ALTERNADO",
    })).toBe(MisconceptionTag.SO_UM_ATRIBUTO);
    // Acertou o objeto e errou o número.
    expect(diagnosticarPadrao({
      resposta: "🍌x3", correta: "🍌x4", anterior: "🍎x3", unidade: "CRESCENTE_ALTERNADO",
    })).toBe(MisconceptionTag.SO_UM_ATRIBUTO);
  });

  it("copiar o último continua vindo antes — é o alvo da ficha", () => {
    expect(diagnosticarPadrao({
      resposta: "🍎x3", correta: "🍌x4", anterior: "🍎x3", unidade: "CRESCENTE_ALTERNADO",
    })).toBe(MisconceptionTag.COPIA_ULTIMO);
  });

  it("qualquer outro erro é NAO_VE_UNIDADE", () => {
    expect(diagnosticarPadrao({
      resposta: "🟡", correta: "🔴", anterior: "🔵", unidade: "AB",
    })).toBe(MisconceptionTag.NAO_VE_UNIDADE);
  });
});

/* ------------------------------------------------------------------ *
 *  As falas — §7, comparadas com o cânone
 * ------------------------------------------------------------------ */

describe("§7 — as falas são as da ficha, letra por letra", () => {
  it.each([
    ["JD1 audioPrompt", FALAS.olhometro.audioPrompt],
    ["JD1 howto", FALAS.olhometro.howto],
    ["JD1 explain", FALAS.olhometro.explain],
    ["JD2 audioPrompt", FALAS.mao.audioPrompt],
    ["JD2 howto", FALAS.mao.howto],
    ["JD2 explain", FALAS.mao.explain],
    ["F52 howto", FALAS.padrao.howto],
    ["F52 explain", FALAS.padrao.explain],
  ])("%s está escrita no Markdown do cânone", (_nome, frase) => {
    // Parafrasear a ficha é a armadilha §6.11. Aqui a comparação é com o
    // arquivo: mudar a fala no código sem mudar o cânone derruba a suíte.
    expect(FICHAS_MD).toContain(frase);
  });

  it("o explain das fichas perceptuais nunca manda contar", () => {
    // §7 da JD1: "ele NUNCA pode dizer 'conte com calma' — isso destrói a
    // competência". §7 da JD2: "nunca pode dizer 'conte os dedos'".
    expect(explainRespeitaOVeto(FALAS.olhometro.explain)).toBe(true);
    expect(explainRespeitaOVeto(FALAS.mao.explain)).toBe(true);
    expect(explainRespeitaOVeto(N1_03.explain!)).toBe(true);
  });

  it("o veto pega uma 'melhoria' que mandasse contar", () => {
    // Sonda de mutação: sem isto, o teste acima passaria com o veto quebrado.
    expect(explainRespeitaOVeto("Conte com calma, sem pressa.")).toBe(false);
    expect(explainRespeitaOVeto("Basta contar os dedos um por um.")).toBe(false);
  });

  it("o howto oficial da JD1 passa, mesmo contendo a palavra proibida", () => {
    // "Não conte — só veja" é o que a ficha MANDA dizer. Um veto que reprovasse
    // a própria fala do cânone seria um veto quebrado.
    expect(explainRespeitaOVeto(FALAS.olhometro.howto)).toBe(true);
  });
});

/* ------------------------------------------------------------------ *
 *  §9 — o domínio
 * ------------------------------------------------------------------ */

describe("§9 — o critério de domínio é o da ficha", () => {
  it("JD1 e JD2: 4 de 5 em 2 sessões — frouxo de propósito", () => {
    for (const ficha of [N1_03, N1_08]) {
      for (const m of ficha.micros) {
        expect(m.dominio, `${ficha.id}/${m.id}`).toEqual({ acertos: 4, de: 5, sessoes: 2 });
      }
    }
  });

  it("F52: 3 de 3 em 2 sessões", () => {
    for (const m of AL_02.micros) {
      expect(m.dominio).toEqual({ acertos: 3, de: 3, sessoes: 2 });
    }
  });
});
