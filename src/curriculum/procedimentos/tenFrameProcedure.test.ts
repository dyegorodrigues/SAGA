import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MisconceptionTag } from "../../constants/misconceptions";
import { Evidencia } from "../../constants/evidencias";
import {
  AcaoDaMoldura,
  F02,
  FALAS,
  JD3,
  JD5,
  degrauDoNivel,
  diagnosticar,
  evidenciasDe,
  perguntaOQueFalta,
} from "./tenFrameProcedure";
import {
  TEMAS_DA_MOLDURA,
  TETO_DE_ALTERNATIVAS,
  alternativasSaoValidas,
  casasOcupadas,
  construirMolduraSpec,
  preenchimentoRespeitaAFicha,
  vazioContiguo,
} from "./tenFrameContract";
import { faixasDaTampa } from "../../components/primitives/TenFrame";
import { N1_08 } from "../fichas/jornada/N1.08";
import { N1_10 } from "../fichas/jornada/N1.10";
import { N1_11 } from "../fichas/jornada/N1.11";

function semente(s: number): () => number {
  let x = s >>> 0;
  return () => { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return x / 4294967296; };
}
const SEMENTES = [1, 7, 42, 99, 123, 777, 2024, 31415];
const NIVEIS = [1, 2, 3, 4, 5];

const CANONE = readFileSync(
  join(__dirname, "..", "..", "..", "AI_Studio_Lab", "pedagogia", "fichas", "FICHAS_F0_COMPLETAS.md"),
  "utf8",
).replace(/\*\*/g, "");

/* ------------------------------------------------------------------ *
 *  §5 — as três tabelas, transcritas (§6.11)
 * ------------------------------------------------------------------ */

describe("F02 §5 — a moldura de dez, os cinco degraus", () => {
  it.each([
    [1, 5, 1, 5, null],
    [2, 5, 1, 5, null],
    [3, 10, 6, 10, null],
    [4, 10, 1, 10, 2000],
    [5, 10, 1, 10, null],
  ])("nível %i: %i casas, de %i a %i, flash %s", (n, casas, min, max, flash) => {
    expect(F02[n]).toMatchObject({ casas, min, max, flashMs: flash });
  });

  it("⚠️ os níveis 1-2 têm CINCO casas — o primeiro degrau da ficha", () => {
    // "5 numa fileira (níveis 1-2) ou 10 em duas fileiras de 5 (níveis 3+)".
    // O `TenFrame` legado desenhava dez sempre: aquele degrau não existia.
    expect([F02[1].casas, F02[2].casas]).toEqual([5, 5]);
  });

  it("⚠️ só o nível 5 INVERTE a pergunta", () => {
    // "O nível 5 é a semente direta dos amigos do 10 (N1.11)."
    expect(NIVEIS.map(n => perguntaOQueFalta("contar", n)))
      .toEqual([false, false, false, false, true]);
  });

  it("o nível 3 nunca sorteia menos que seis — é ele que obriga a segunda fileira", () => {
    expect(F02[3].min).toBe(6);
  });

  it("o preenchimento é contínuo nos cinco níveis", () => {
    expect(NIVEIS.every(n => F02[n].arrumacao === "continuo")).toBe(true);
  });
});

describe("JD3 §5 — a moldura relâmpago, os cinco degraus", () => {
  it.each([
    [1, 8, 9, 1500],
    [2, 6, 9, 1200],
    [3, 5, 9, 1200],
    [4, 1, 9, 1000],
    [5, 1, 9, 700],
  ])("nível %i: de %i a %i, exposição %ims", (n, min, max, flash) => {
    expect(JD3[n]).toMatchObject({ casas: 10, min, max, flashMs: flash });
  });

  it("a exposição só encurta — nunca volta atrás", () => {
    const tempos = NIVEIS.map(n => JD3[n].flashMs as number);
    expect(tempos).toEqual([...tempos].sort((a, b) => b - a));
  });

  it("⚠️ o disperso é do nível 5 e SÓ dele", () => {
    // "Com casas vazias espalhadas, o vazio perde a forma e a criança precisa
    // integrar — é o degrau mais difícil e o último."
    expect(NIVEIS.map(n => JD3[n].arrumacao))
      .toEqual(["continuo", "continuo", "continuo", "continuo", "disperso"]);
  });

  it("a âncora do 5 fica explícita no nível 3, e só nele", () => {
    expect(NIVEIS.map(n => JD3[n].ancoraExplicita === true))
      .toEqual([false, false, true, false, false]);
  });

  it("⚠️ a moldura nunca enche: 'quantos faltam' com a moldura cheia é zero", () => {
    expect(NIVEIS.every(n => JD3[n].max < JD3[n].casas)).toBe(true);
  });

  it("a JD3 pergunta o que falta em TODOS os níveis", () => {
    expect(NIVEIS.every(n => perguntaOQueFalta("faltam", n))).toBe(true);
  });
});

describe("JD5 §5 — ver e imaginar, os cinco degraus", () => {
  it.each([
    [1, 3, 1, 1],
    [2, 5, 1, 2],
    [3, 5, 1, 4],
    [4, 10, 1, 9],
    [5, 10, 1, 9],
  ])("nível %i: total até %i, esconde de %i a %i", (n, max, escondeMin, escondeMax) => {
    expect(JD5[n]).toMatchObject({ max, escondeMin, escondeMax });
  });

  it("⚠️ a contagem em voz alta é dos níveis 1-2, e sair dela é o degrau do 3", () => {
    // §4: "a contagem em voz alta na abertura é obrigatória. Sem ela, a criança
    // não constrói o total na memória e o exercício vira adivinhação."
    expect(NIVEIS.map(n => JD5[n].contaEmVozAlta === true))
      .toEqual([true, true, false, false, false]);
  });

  it("⚠️ a moldura só sai no nível 5 — ela é o andaime de memória", () => {
    expect(NIVEIS.map(n => JD5[n].semMoldura === true))
      .toEqual([false, false, false, false, true]);
  });

  it("os níveis 4-5 abrem a moldura de dez", () => {
    expect(NIVEIS.map(n => JD5[n].casas)).toEqual([5, 5, 5, 10, 10]);
  });

  it("o degrau fora de faixa cai no extremo mais próximo", () => {
    expect(degrauDoNivel("contar", 0)).toBe(F02[1]);
    expect(degrauDoNivel("contar", 9)).toBe(F02[5]);
  });
});

/* ------------------------------------------------------------------ *
 *  A cena
 * ------------------------------------------------------------------ */

describe("a cena da moldura", () => {
  const TODAS: [string, "contar" | "faltam" | "escondidos"][] = [
    ["F02", "contar"], ["JD3", "faltam"], ["JD5", "escondidos"],
  ];

  it.each(TODAS)("%s: as alternativas são válidas em todos os níveis", (_f, modo) => {
    for (const s of SEMENTES) {
      for (const n of NIVEIS) {
        const spec = construirMolduraSpec(modo, n, semente(s));
        expect(alternativasSaoValidas(spec), `${modo} n${n} s${s} ${JSON.stringify(spec.alternativas)}`).toBe(true);
      }
    }
  });

  it.each(TODAS)("%s: o preenchimento respeita a regra da ficha", (_f, modo) => {
    for (const s of SEMENTES) {
      for (const n of NIVEIS) {
        const spec = construirMolduraSpec(modo, n, semente(s));
        expect(preenchimentoRespeitaAFicha(spec), `${modo} n${n} s${s}`).toBe(true);
      }
    }
  });

  it("⚠️ a JD3 põe no máximo TRÊS numerais na base", () => {
    // §3: "Opções — 2 a 3 numerais, na base". Com 0,7s de exposição, a resposta
    // é percepção; quatro botões viram leitura.
    expect(TETO_DE_ALTERNATIVAS.faltam).toBe(3);
    for (const s of SEMENTES) {
      for (const n of NIVEIS) {
        expect(construirMolduraSpec("faltam", n, semente(s)).alternativas.length)
          .toBeLessThanOrEqual(3);
      }
    }
  });

  it("⚠️ a resposta nunca é zero, em ficha nenhuma", () => {
    // A F02 §5 manda "1 a 10" no nível 5, que é a pergunta invertida: com a
    // moldura cheia a resposta seria zero, e a tela mostraria uma moldura
    // completa perguntando o que falta (§6.2). Divergência declarada.
    for (const s of SEMENTES) {
      for (const modo of ["contar", "faltam", "escondidos"] as const) {
        for (const n of NIVEIS) {
          expect(construirMolduraSpec(modo, n, semente(s)).resposta, `${modo} n${n} s${s}`)
            .toBeGreaterThan(0);
        }
      }
    }
  });

  it("⚠️ o distrator que carrega a tag da inversão está SEMPRE na tela", () => {
    // Sem o `cheias` no banco, `RESPONDE_O_CHEIO` (JD3) e `INVERTE_PERGUNTA`
    // (F02 nível 5) são diagnósticos que nunca acontecem.
    for (const s of SEMENTES) {
      for (const n of NIVEIS) {
        const jd3 = construirMolduraSpec("faltam", n, semente(s));
        if (jd3.cheias !== jd3.resposta) expect(jd3.alternativas, `JD3 n${n} s${s}`).toContain(jd3.cheias);
      }
      const f02 = construirMolduraSpec("contar", 5, semente(s));
      if (f02.cheias !== f02.resposta) expect(f02.alternativas, `F02 s${s}`).toContain(f02.cheias);
    }
  });

  it("⚠️ os distratores da JD5 são o visível e o todo", () => {
    for (const s of SEMENTES) {
      for (const n of NIVEIS) {
        const spec = construirMolduraSpec("escondidos", n, semente(s));
        for (const v of [spec.visiveis, spec.total]) {
          if (v !== spec.resposta) expect(spec.alternativas, `n${n} s${s}`).toContain(v);
        }
      }
    }
  });

  it("JD5 distingue escala >5 de retirada da moldura", () => {
    const comMoldura = construirMolduraSpec("escondidos", 4, semente(7));
    const semMoldura = construirMolduraSpec("escondidos", 5, semente(7));
    const acao = (spec: typeof comMoldura): AcaoDaMoldura => ({
      modo: "escondidos",
      nivel: spec.nivel,
      resposta: spec.resposta,
      alvo: spec.resposta,
      cheias: spec.cheias,
      casas: spec.casas,
      visiveis: spec.visiveis,
      total: spec.total,
      semMoldura: spec.semMoldura,
    });
    expect(evidenciasDe(acao(comMoldura))).not.toContain(Evidencia.SEM_MOLDURA);
    expect(evidenciasDe(acao(semMoldura))).toContain(Evidencia.SEM_MOLDURA);
  });

  it("a JD5 sempre deixa alguém à mostra e alguém escondido", () => {
    // Tapar tudo é "quantos eram?", e tapar nada é "quantos você vê?": duas
    // outras fichas.
    for (const s of SEMENTES) {
      for (const n of NIVEIS) {
        const spec = construirMolduraSpec("escondidos", n, semente(s));
        expect(spec.escondidas, `n${n} s${s}`).toBeGreaterThanOrEqual(1);
        expect(spec.visiveis, `n${n} s${s}`).toBeGreaterThanOrEqual(1);
        expect((spec.visiveis ?? 0) + (spec.escondidas ?? 0)).toBe(spec.total);
      }
    }
  });

  it("nenhuma ficha ocupa mais casas do que a moldura tem", () => {
    for (const s of SEMENTES) {
      for (const modo of ["contar", "faltam", "escondidos"] as const) {
        for (const n of NIVEIS) {
          const spec = construirMolduraSpec(modo, n, semente(s));
          expect(spec.ocupadas.length, `${modo} n${n} s${s}`).toBeLessThanOrEqual(spec.casas);
          expect(Math.max(...spec.ocupadas)).toBeLessThan(spec.casas);
        }
      }
    }
  });

  it("⚠️ a certa não mora sempre na mesma posição", () => {
    // Com a resposta parada no mesmo botão, `CHUTE_SEGURO` deixa de existir.
    const posicoes = new Set(SEMENTES.map(s => {
      const spec = construirMolduraSpec("faltam", 2, semente(s));
      return spec.alternativas.indexOf(spec.resposta);
    }));
    expect(posicoes.size).toBeGreaterThan(1);
  });

  it("600 amostras sem exceção", () => {
    for (let i = 0; i < 600; i += 1) {
      const modo = (["contar", "faltam", "escondidos"] as const)[i % 3];
      expect(() => construirMolduraSpec(modo, (i % 5) + 1, semente(i + 1))).not.toThrow();
    }
  });
});

describe("a regra de preenchimento da F02, e a única exceção", () => {
  it("contínuo é sempre as N primeiras, sem buraco", () => {
    expect(casasOcupadas(3, 10, "continuo", semente(1))).toEqual([0, 1, 2]);
  });

  it("⚠️ disperso sai mesmo disperso — o sorteio contíguo é REJEITADO", () => {
    // Metade das questões do nível 5 seria, na prática, do nível 4 (§6.2).
    for (const s of SEMENTES) {
      for (const quantas of [4, 5, 6, 7, 8]) {
        const casas = casasOcupadas(quantas, 10, "disperso", semente(s));
        expect(casas.length).toBe(quantas);
        expect(vazioContiguo(casas, 10), `q${quantas} s${s}`).toBe(false);
      }
    }
  });

  it("o vazio de um buraco só é contíguo; espalhado, não", () => {
    expect(vazioContiguo([0, 1, 2], 5)).toBe(true);
    expect(vazioContiguo([0, 2, 4], 5)).toBe(false);
  });
});

describe("a tampa da JD5 cobre o bloco inteiro", () => {
  it("uma faixa quando o bloco cabe numa fileira", () => {
    expect(faixasDaTampa([2, 3, 4], 5)).toEqual([{ linha: 0, de: 2, ate: 4 }]);
  });

  it("⚠️ DUAS faixas quando o bloco atravessa as fileiras", () => {
    // Uma tampa só cobria um trecho de uma linha. Escondendo sete de dez,
    // metade dos escondidos continuava à vista — e a criança contava a resposta.
    expect(faixasDaTampa([3, 4, 5, 6, 7, 8, 9], 5)).toEqual([
      { linha: 0, de: 3, ate: 4 },
      { linha: 1, de: 0, ate: 4 },
    ]);
  });

  it("sem escondidos não há tampa", () => {
    expect(faixasDaTampa([], 5)).toEqual([]);
  });

  it("toda casa escondida fica sob alguma faixa, em todos os níveis", () => {
    for (const s of SEMENTES) {
      for (const n of NIVEIS) {
        const spec = construirMolduraSpec("escondidos", n, semente(s));
        const tapadas = spec.ocupadas.slice(-(spec.escondidas ?? 0));
        const cobertas = faixasDaTampa(tapadas, 5).flatMap(f =>
          Array.from({ length: f.ate - f.de + 1 }, (_, k) => f.linha * 5 + f.de + k));
        expect(tapadas.every(i => cobertas.includes(i)), `n${n} s${s}`).toBe(true);
      }
    }
  });
});

/* ------------------------------------------------------------------ *
 *  §6 — o diagnóstico
 * ------------------------------------------------------------------ */

describe("§6 da F02 — contar", () => {
  const base: AcaoDaMoldura = { modo: "contar", nivel: 3, resposta: 7, alvo: 7, cheias: 7, casas: 10 };

  it("acerto não gera diagnóstico", () => {
    expect(diagnosticar(base)).toBeUndefined();
  });

  it("responder o total de casas é CONTA_VAZIOS", () => {
    expect(diagnosticar({ ...base, resposta: 10 })).toBe(MisconceptionTag.CONTA_VAZIOS);
  });

  it("⚠️ errar de 6 a 10 é NAO_USA_ESTRUTURA — o mais importante da ficha", () => {
    // "Acerta até 5, erra de 6 a 10: não vê a fileira cheia como unidade."
    expect(diagnosticar({ ...base, resposta: 4 })).toBe(MisconceptionTag.NAO_USA_ESTRUTURA);
  });

  it("errar por um até cinco é OFF_BY_ONE", () => {
    expect(diagnosticar({ ...base, alvo: 4, cheias: 4, resposta: 5 })).toBe(MisconceptionTag.OFF_BY_ONE);
  });

  it("⚠️ no nível 5, responder o cheio é INVERTE_PERGUNTA", () => {
    // A F02 §6 tem esta linha e ela só existe ali: "respondeu quantos tem em
    // vez de quantos faltam — não processou o complemento".
    expect(diagnosticar({ modo: "contar", nivel: 5, resposta: 7, alvo: 3, cheias: 7, casas: 10 }))
      .toBe(MisconceptionTag.INVERTE_PERGUNTA);
  });

  it("⚠️ no nível 5, o que ela tinha de VER é o vazio, não o cheio", () => {
    // Sete cheias e três faltando: errar por muito ali não é falta de
    // estrutura — o buraco era pequeno, e a §6 não tem linha para isso.
    expect(diagnosticar({ modo: "contar", nivel: 5, resposta: 1, alvo: 3, cheias: 7, casas: 10 }))
      .toBeUndefined();
    // Mas três cheias e SETE faltando é exatamente a linha da fileira que não
    // virou unidade.
    expect(diagnosticar({ modo: "contar", nivel: 5, resposta: 4, alvo: 7, cheias: 3, casas: 10 }))
      .toBe(MisconceptionTag.NAO_USA_ESTRUTURA);
  });

  it("resposta fora das quatro linhas da §6 não inventa tag", () => {
    expect(diagnosticar({ ...base, alvo: 4, cheias: 4, resposta: 1 })).toBeUndefined();
  });
});

describe("§6 da JD3 — faltam", () => {
  const base: AcaoDaMoldura = {
    modo: "faltam", nivel: 2, resposta: 3, alvo: 3, cheias: 7, casas: 10, disperso: false,
  };

  it("acerto não gera diagnóstico", () => {
    expect(diagnosticar(base)).toBeUndefined();
  });

  it("⚠️ responder o cheio é RESPONDE_O_CHEIO — a tag-chave da ficha", () => {
    // §6: "não é descuido — é a criança fazendo exatamente o que o olho pede".
    expect(diagnosticar({ ...base, resposta: 7 })).toBe(MisconceptionTag.RESPONDE_O_CHEIO);
  });

  it("⚠️ o cheio vence o OFF_BY_ONE quando os dois cabem", () => {
    // Faltam 6, há 7 na moldura: responder 7 é n+1 E é o cheio. Tratar como
    // descuido mandaria a Oficina treinar contagem, quando o que falhou foi a
    // inversão (§6.8).
    expect(diagnosticar({ ...base, alvo: 6, cheias: 7, resposta: 7 }))
      .toBe(MisconceptionTag.RESPONDE_O_CHEIO);
  });

  it("errar por um é OFF_BY_ONE", () => {
    expect(diagnosticar({ ...base, resposta: 2 })).toBe(MisconceptionTag.OFF_BY_ONE);
  });

  it("errar com mais de cinco faltando é SEM_ANCORA_CINCO", () => {
    expect(diagnosticar({ ...base, alvo: 7, cheias: 3, resposta: 2 }))
      .toBe(MisconceptionTag.SEM_ANCORA_CINCO);
  });

  it("errar no vazio espalhado é DEPENDE_DE_FORMATO", () => {
    expect(diagnosticar({ ...base, resposta: 5, disperso: true }))
      .toBe(MisconceptionTag.DEPENDE_DE_FORMATO);
  });

  it("o resto é CHUTE_SEGURO", () => {
    expect(diagnosticar({ ...base, resposta: 5 })).toBe(MisconceptionTag.CHUTE_SEGURO);
  });
});

describe("§6 da JD5 — escondidos", () => {
  const base: AcaoDaMoldura = {
    modo: "escondidos", nivel: 2, resposta: 2, alvo: 2, cheias: 5, casas: 5,
    total: 5, visiveis: 3, semMoldura: false,
  };

  it("acerto não gera diagnóstico", () => {
    expect(diagnosticar(base)).toBeUndefined();
  });

  it("responder o visível é RESPONDE_O_VISIVEL", () => {
    expect(diagnosticar({ ...base, resposta: 3 })).toBe(MisconceptionTag.RESPONDE_O_VISIVEL);
  });

  it("responder o total é RESPONDE_O_TODO", () => {
    expect(diagnosticar({ ...base, resposta: 5 })).toBe(MisconceptionTag.RESPONDE_O_TODO);
  });

  it("errar por um é OFF_BY_ONE", () => {
    expect(diagnosticar({ ...base, resposta: 1 })).toBe(MisconceptionTag.OFF_BY_ONE);
  });

  it("errar sem a moldura é DEPENDE_DE_ESTRUTURA", () => {
    expect(diagnosticar({
      ...base, nivel: 5, total: 9, visiveis: 2, alvo: 7, resposta: 4, semMoldura: true,
    })).toBe(MisconceptionTag.DEPENDE_DE_ESTRUTURA);
  });

  it("⚠️ resposta fora das quatro linhas da §6 não inventa tag", () => {
    // Erro sem hipótese é melhor que hipótese inventada: a Oficina não é
    // chamada para treinar o que ninguém observou.
    expect(diagnosticar({
      ...base, total: 10, visiveis: 2, cheias: 10, casas: 10, alvo: 8, resposta: 5,
    })).toBeUndefined();
  });
});

/* ------------------------------------------------------------------ *
 *  §9 — o domínio e as evidências
 * ------------------------------------------------------------------ */

describe("§9 — a evidência que cada ficha exige", () => {
  const acerto = (extra: Partial<AcaoDaMoldura>): AcaoDaMoldura => ({
    modo: "contar", nivel: 3, resposta: 7, alvo: 7, cheias: 7, casas: 10, ...extra,
  });

  it("errar não produz evidência nenhuma", () => {
    expect(evidenciasDe(acerto({ resposta: 6 }))).toEqual([]);
  });

  it("⚠️ a F02 exige um acerto com SEIS ou mais", () => {
    // §9: "regra extra: pelo menos um acerto com quantidade entre 6 e 10, que
    // exige usar a estrutura das duas fileiras".
    expect(evidenciasDe(acerto({ cheias: 5, alvo: 5, resposta: 5 }))).toEqual([]);
    expect(evidenciasDe(acerto({ cheias: 6, alvo: 6, resposta: 6 })))
      .toEqual([Evidencia.ESTRUTURA_DAS_DUAS_FILEIRAS]);
  });

  it("⚠️ a JD5 exige um acerto com mais de cinco na cabeça", () => {
    // §9: "pelo menos um acerto no nível 4+ (total até 10), que exige memória
    // de trabalho real". Guardar três é subitização; guardar oito, não.
    const escondidos = (total: number) => evidenciasDe({
      modo: "escondidos", nivel: 4, resposta: 2, alvo: 2, cheias: total, casas: 10,
      total, visiveis: total - 2,
    });
    expect(escondidos(5)).toEqual([]);
    expect(escondidos(8)).toEqual([Evidencia.TOTAL_ALEM_DE_CINCO]);
  });

  it("a JD3 não exige evidência: a §9 dela não pede condição extra", () => {
    expect(evidenciasDe({
      modo: "faltam", nivel: 5, resposta: 3, alvo: 3, cheias: 7, casas: 10,
    })).toEqual([]);
    expect(N1_11.micros.every(m => m.dominio?.exige === undefined)).toBe(true);
  });

  it("as fichas declaram a evidência que o palco emite", () => {
    expect(N1_08.micros.find(m => m.id === "moldura_dez")?.dominio?.exige?.evidencia)
      .toBe(Evidencia.ESTRUTURA_DAS_DUAS_FILEIRAS);
    expect(N1_10.micros[0].dominio?.exige?.evidencia).toBe(Evidencia.TOTAL_ALEM_DE_CINCO);
  });

  it("⚠️ nenhuma ficha da moldura tem critério de tempo no domínio", () => {
    // §5.1-bis: o relógio alimenta a trilha FD do Dojo, não a coroa.
    for (const ficha of [N1_08, N1_10, N1_11]) {
      for (const m of ficha.micros) {
        expect(m.dominio, `${ficha.id}/${m.id}`).not.toHaveProperty("rt_max");
      }
    }
  });
});

/* ------------------------------------------------------------------ *
 *  §7 — as falas
 * ------------------------------------------------------------------ */

describe("§7 — as falas das três fichas estão no cânone", () => {
  it.each([
    ["F02 audioPrompt", FALAS.contar.audioPrompt],
    ["F02 howto", FALAS.contar.howto],
    ["F02 explain", FALAS.contar.explain],
    ["JD3 audioPrompt", FALAS.faltam.audioPrompt],
    ["JD3 howto", FALAS.faltam.howto],
    ["JD3 explain", FALAS.faltam.explain],
    ["JD5 audioPrompt", FALAS.escondidos.audioPrompt],
    ["JD5 howto", FALAS.escondidos.howto],
    ["JD5 explain", FALAS.escondidos.explain],
  ])("%s", (_n, frase) => {
    expect(CANONE).toContain(frase);
  });

  it("⚠️ o explain da JD3 não devolve a criança à contagem", () => {
    // §7 proíbe as duas frases pelo nome: "conte as casas vazias" devolve à
    // contagem, que é o que a ficha existe para dispensar; "faça dez menos
    // sete" é a subtração da F28/F31, não esta.
    const texto = `${FALAS.faltam.explain} ${FALAS.faltam.howto}`.toLowerCase();
    expect(texto).not.toContain("conte as casas vazias");
    expect(texto).not.toContain("menos");
  });

  it("o acerto da F02 nomeia a ESTRUTURA quando passa de cinco", () => {
    // §4: "a voz diz 'cinco! E mais dois: sete!'" — é a fala que ensina.
    expect(FALAS.contar.acerto(7)).toContain("cinco");
    expect(FALAS.contar.acerto(7)).toContain("2");
    expect(FALAS.contar.acerto(4)).toBe("4!");
  });

  it("o acerto da JD3 diz os dois números fechando dez", () => {
    expect(FALAS.faltam.acerto(7, 3)).toBe("7 e 3: dez!");
  });

  it("o erro suave nunca diz que errou", () => {
    const todos = [
      FALAS.contar.erroSuave,
      FALAS.faltam.erroSuave(3),
      FALAS.escondidos.erroSuave(2),
    ].join(" ").toLowerCase();
    expect(todos).not.toContain("errou");
    expect(todos).not.toContain("errado");
  });
});

/* ------------------------------------------------------------------ *
 *  §1 — os temas da F02
 * ------------------------------------------------------------------ */

describe("§1 da F02 — 'Temas: estrelas, ovos, medalhas'", () => {
  it("⚠️ o enunciado nomeia o que está DESENHADO", () => {
    // A moldura desenhava discos azuis genéricos enquanto a voz perguntava
    // "quantas ESTRELAS você vê?". A criança desta faixa não lê: para ela, a
    // única pergunta é a falada, e voz e tela dizendo coisas diferentes é o
    // §6.34. Foi o print que mostrou — nenhum teste via.
    for (const s of SEMENTES) {
      for (const n of [1, 2, 3, 4]) {
        const spec = construirMolduraSpec("contar", n, semente(s));
        const tema = TEMAS_DA_MOLDURA.find(t => t.emoji === spec.emoji);
        expect(tema, `n${n} s${s}`).toBeDefined();
        expect(spec.enunciado, `n${n} s${s}`).toContain(tema!.plural);
      }
    }
  });

  it("os três temas da §1 saem, e nenhum outro", () => {
    const vistos = new Set(SEMENTES.flatMap(s =>
      [1, 2, 3, 4].map(n => construirMolduraSpec("contar", n, semente(s)).emoji)));
    expect([...vistos].every(e => TEMAS_DA_MOLDURA.some(t => t.emoji === e))).toBe(true);
    expect(vistos.size).toBeGreaterThan(1);
  });

  it("a fala do cânone é a do tema 'estrelas'", () => {
    expect(FALAS.contar.audioPrompt).toContain("estrelas");
    expect(CANONE).toContain(FALAS.contar.audioPrompt);
  });

  it("⚠️ a JD3 e a JD5 NÃO têm tema — ali a ficha é a estrutura", () => {
    // A §3 das duas desenha ficha neutra (`[o]`, `O`). Um objeto do mundo ali
    // daria à criança uma segunda coisa para olhar numa tela de 0,7s.
    for (const s of SEMENTES) {
      for (const n of NIVEIS) {
        expect(construirMolduraSpec("faltam", n, semente(s)).emoji, `JD3 n${n}`).toBeUndefined();
        expect(construirMolduraSpec("escondidos", n, semente(s)).emoji, `JD5 n${n}`).toBeUndefined();
      }
    }
  });

  it("o nível 5 pergunta o que falta, sem nomear objeto nenhum", () => {
    // "Quantos faltam pra encher?" — a pergunta invertida não fala do desenho.
    for (const s of SEMENTES) {
      expect(construirMolduraSpec("contar", 5, semente(s)).enunciado)
        .toBe(FALAS.faltam.audioPrompt);
    }
  });
});
