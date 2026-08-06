import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  AcaoDeProducao,
  FALAS,
  bandejaDoNivel,
  contagemAteN,
  contar,
  dependeDeAndaime,
  diagnosticar,
  dominou,
  encerraSozinha,
  escopoDoNivel,
  limitaExcesso,
  pedidoRepetivel,
  temAndaime,
  vagasDoNivel,
} from "./producaoProcedure";
import {
  ALVO_MINIMO,
  LADO_DO_OBJETO,
  TEMAS_DA_PRODUCAO,
  ancoraMaisProxima,
  ancorasSaoValidas,
  bandejaTemExcedente,
  construirProducaoSpec,
} from "./producaoContract";
import { N1_13 } from "../fichas/jornada/N1.13";

function semente(s: number): () => number {
  let x = s >>> 0;
  return () => { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return x / 4294967296; };
}
const SEMENTES = [1, 7, 42, 99, 123, 777, 2024, 31415];

const FICHAS_MD = readFileSync(
  join(__dirname, "..", "..", "..", "AI_Studio_Lab", "pedagogia", "fichas", "FICHAS_F0_COMPLETAS.md"),
  "utf8",
);

describe("F04 §5 — os cinco níveis, transcritos", () => {
  it.each([
    [1, 1, 3, "pulsando", 5],
    [2, 1, 5, "visiveis", 8],
    [3, 1, 5, "contorno", 8],
    [4, 1, 10, "nenhuma", 12],
    [5, 1, 10, "nenhuma", 12],
  ])("nível %i: %i a %i, vagas %s, bandeja %i", (nivel, min, max, vagas, bandeja) => {
    expect(escopoDoNivel(nivel)).toEqual({ min, max });
    expect(vagasDoNivel(nivel)).toBe(vagas);
    expect(bandejaDoNivel(nivel)).toBe(bandeja);
  });

  it("só o nível 5 fala o pedido uma vez", () => {
    expect([1, 2, 3, 4, 5].map(pedidoRepetivel)).toEqual([true, true, true, true, false]);
  });

  it("o nível 4 é o SALTO: é onde a vaga fantasma some", () => {
    expect([1, 2, 3, 4, 5].map(temAndaime)).toEqual([true, true, true, false, false]);
  });

  it("⚠️ a bandeja SEMPRE tem excedente sobre o pedido máximo do nível", () => {
    // §3: "mais objetos que o necessário (5 objetos para uma tarefa de 3)".
    // Bandeja do tamanho do pedido transformaria despejar tudo em acertar, e a
    // tag IGNORA_QUANTIDADE — "colocou tudo que tinha na bandeja" — deixaria de
    // poder existir.
    for (let n = 1; n <= 5; n += 1) {
      expect(bandejaDoNivel(n), `nível ${n}`).toBeGreaterThan(escopoDoNivel(n).max);
    }
  });
});

describe("§4 × §5: quem limita o excesso, e a §9 decidindo o empate", () => {
  it("o limite físico existe exatamente onde existe a vaga", () => {
    // A §4 diz que o excedente "não cola"; a §5 diz que no nível 4 a criança
    // "precisa saber parar sozinha". Não dá para as duas valerem no mesmo
    // nível. Quem desempata é a §9: ela exige um ACERTO sem vaga, e num nível
    // onde a tela trava o excedente todo mundo acerta — a evidência que ela
    // pede seria impossível de não obter.
    for (let n = 1; n <= 5; n += 1) {
      expect(limitaExcesso(n), `nível ${n}`).toBe(temAndaime(n));
      expect(encerraSozinha(n), `nível ${n}`).toBe(temAndaime(n));
    }
  });
});

describe("a cena", () => {
  it("as âncoras nunca colidem nem saem do campo — em todo nível e semente", () => {
    for (const s of SEMENTES) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const spec = construirProducaoSpec(nivel, semente(s));
        expect(ancorasSaoValidas(spec), `n${nivel} s${s}`).toBe(true);
      }
    }
  });

  it("⚠️ a vaga fantasma tem área de toque ≥ 80px — o adendo §8.3-bis", () => {
    // "Todo arrasto tem alternativa por toque, snap com tolerância generosa e
    // área ≥ 80px." A F04 é citada pelo nome na lista de exposição motora alta.
    // A primitiva antiga usava 48px.
    expect(ALVO_MINIMO).toBeGreaterThanOrEqual(80);
    expect(LADO_DO_OBJETO).toBeLessThan(ALVO_MINIMO);
  });

  it("com andaime há uma vaga por objeto pedido — nem uma a mais", () => {
    // §2: as vagas "mostram quantas faltam". Uma vaga sobrando mentiria.
    for (const s of SEMENTES) {
      for (const nivel of [1, 2, 3]) {
        const spec = construirProducaoSpec(nivel, semente(s));
        expect(spec.ancoras).toHaveLength(spec.alvo);
      }
    }
  });

  it("sem andaime, cabe a bandeja inteira na cena", () => {
    // Senão despejar tudo seria impedido pela geometria, e IGNORA_QUANTIDADE
    // voltaria a ser inobservável — desta vez por falta de espaço.
    for (const s of SEMENTES) {
      for (const nivel of [4, 5]) {
        const spec = construirProducaoSpec(nivel, semente(s));
        expect(spec.ancoras).toHaveLength(spec.bandeja);
      }
    }
  });

  it("o pedido fica dentro do escopo do nível, e a bandeja tem excedente", () => {
    for (const s of SEMENTES) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const spec = construirProducaoSpec(nivel, semente(s));
        const { min, max } = escopoDoNivel(nivel);
        expect(spec.alvo).toBeGreaterThanOrEqual(min);
        expect(spec.alvo).toBeLessThanOrEqual(max);
        expect(bandejaTemExcedente(spec)).toBe(true);
      }
    }
  });

  it("⚠️ o enunciado concorda em número — 'Coloque 1 estrela', nunca '1 estrelas'", () => {
    // §6.5. E aqui a frase é falada: a voz que erra a concordância do objeto que
    // ela mesma mostrou ensina o erro junto com o número.
    const um = FALAS.pedido(1, "estrela", "estrelas", "no céu");
    expect(um).toBe("Coloque 1 estrela no céu!");
    expect(FALAS.pedido(3, "estrela", "estrelas", "no céu")).toBe("Coloque 3 estrelas no céu!");
  });

  it("a voz conta com o gênero do objeto — 'uma, duas' e 'um, dois'", () => {
    expect(contar(1, "f")).toBe("uma");
    expect(contar(2, "f")).toBe("duas");
    expect(contar(1, "m")).toBe("um");
    expect(contagemAteN(3, "f")).toBe("uma, duas, três");
    expect(FALAS.fecho(3, "f", "estrelas", "estrela")).toBe("uma, duas, três! Três estrelas!");
  });

  it("todo tema declara gênero coerente com o artigo do pedido", () => {
    for (const t of TEMAS_DA_PRODUCAO) {
      expect(FALAS.pedido(1, t.singular, t.plural, t.onde)).toContain(t.singular);
      expect(FALAS.pedido(2, t.singular, t.plural, t.onde)).toContain(t.plural);
    }
  });

  it("o snap pega a âncora livre mais próxima, e ignora as ocupadas", () => {
    const ancoras = [{ x: 10, y: 10 }, { x: 100, y: 10 }, { x: 200, y: 10 }];
    expect(ancoraMaisProxima(ancoras, [], { x: 105, y: 12 })).toBe(1);
    expect(ancoraMaisProxima(ancoras, [1], { x: 105, y: 12 })).toBe(0);
    expect(ancoraMaisProxima(ancoras, [0, 1, 2], { x: 105, y: 12 })).toBe(-1);
  });

  it("500 amostras sem exceção", () => {
    for (let i = 0; i < 500; i += 1) {
      expect(() => construirProducaoSpec((i % 5) + 1, semente(i + 1))).not.toThrow();
    }
  });
});

describe("§6 — o diagnóstico", () => {
  const base: AcaoDeProducao = { colocados: 3, alvo: 3, bandeja: 5, recusas: 0, comAndaime: true };

  it("produção exata e sem tentativa de excesso não gera diagnóstico", () => {
    expect(diagnosticar(base)).toBeUndefined();
  });

  it("parou antes é PRODUCAO_INCOMPLETA", () => {
    expect(diagnosticar({ ...base, colocados: 2 })).toBe(MisconceptionTag.PRODUCAO_INCOMPLETA);
  });

  it("tentou passar do pedido é NAO_MONITORA_ALVO — mesmo com a tela recusando", () => {
    // Nos níveis com vaga o excedente volta para a bandeja, então o estado final
    // está sempre certo. Sem contar a tentativa, a tag nunca existiria.
    expect(diagnosticar({ ...base, recusas: 1 })).toBe(MisconceptionTag.NAO_MONITORA_ALVO);
    // Passou do pedido SEM esvaziar a bandeja: 4 de 12, pedido 3. Com bandeja
    // de 5 este mesmo caso seria `IGNORA_QUANTIDADE`, e é o que se quer.
    expect(diagnosticar({ ...base, colocados: 4, bandeja: 12, comAndaime: false }))
      .toBe(MisconceptionTag.NAO_MONITORA_ALVO);
  });

  it("⚠️ despejar a bandeja é IGNORA_QUANTIDADE, não NAO_MONITORA_ALVO", () => {
    // §6.8: do mais específico ao mais genérico. Quem esvazia a bandeja também
    // passou do pedido — testar o genérico primeiro apagaria este caso para
    // sempre, e as aulas são diferentes: uma criança perdeu a conta, a outra
    // nem chegou a processar o número.
    expect(diagnosticar({ ...base, colocados: 5, bandeja: 5, comAndaime: false }))
      .toBe(MisconceptionTag.IGNORA_QUANTIDADE);
  });

  it("DEPENDE_DE_ANDAIME compara duas questões — nenhuma isolada a produz", () => {
    const comVaga: AcaoDeProducao = { colocados: 3, alvo: 3, bandeja: 5, recusas: 0, comAndaime: true };
    const semVaga: AcaoDeProducao = { colocados: 5, alvo: 7, bandeja: 12, recusas: 0, comAndaime: false };

    expect(dependeDeAndaime([comVaga])).toBe(false);
    expect(dependeDeAndaime([comVaga, semVaga])).toBe(true);
    expect(dependeDeAndaime([comVaga, { ...semVaga, colocados: 7 }])).toBe(false);
  });
});

describe("§9 — o domínio", () => {
  const certoComVaga: AcaoDeProducao = { colocados: 3, alvo: 3, bandeja: 5, recusas: 0, comAndaime: true };
  const certoSemVaga: AcaoDeProducao = { colocados: 7, alvo: 7, bandeja: 12, recusas: 0, comAndaime: false };

  it("⚠️ três acertos com vaga NÃO dão domínio", () => {
    // "Produzir com o alvo visível não prova cardinalidade produtiva." Com as
    // vagas na tela, preencher todas é correspondência um-a-um (F07).
    expect(dominou([certoComVaga, certoComVaga, certoComVaga])).toBe(false);
  });

  it("três acertos com pelo menos um sem vaga dão domínio", () => {
    expect(dominou([certoComVaga, certoComVaga, certoSemVaga])).toBe(true);
  });

  it("acerto com recusa pelo caminho não conta como acerto", () => {
    expect(dominou([certoComVaga, certoComVaga, { ...certoSemVaga, recusas: 1 }])).toBe(false);
  });
});

describe("§7 — as falas são as da ficha, letra por letra", () => {
  it.each([
    ["howto", FALAS.howto],
    ["explain", FALAS.explain],
    ["audioPrompt", FALAS.pedido(3, "estrela", "estrelas", "no céu")],
  ])("%s está escrita no Markdown do cânone", (_n, frase) => {
    expect(FICHAS_MD).toContain(frase);
  });

  it("o excesso NÃO diz 'errou' — repete o número pedido", () => {
    // §4: "já colocamos três!". Mesma regra da F05: o feedback é a informação
    // que faltava, nunca um veredito.
    const fala = FALAS.excesso(3, "f");
    expect(fala).toBe("Já colocamos três!");
    expect(fala.toLowerCase()).not.toContain("errou");
  });
});

describe("a ficha", () => {
  it("os cinco níveis são `touchplace` — a F04 não tem outra primitiva", () => {
    for (let n = 1; n <= 5; n += 1) {
      expect(N1_13.niveis![n].primitiva, `nível ${n}`).toBe("touchplace");
    }
  });

  it("cada nível tem micro própria: os cinco degraus da §5 existem", () => {
    expect(new Set([1, 2, 3, 4, 5].map(n => N1_13.niveis![n].micro)).size).toBe(5);
  });

  it("§9: 3 de 3 em 2 sessões em toda micro", () => {
    // `toMatchObject`, não `toEqual`: ver o comentário gêmeo na F05 (§2-bis).
    for (const m of N1_13.micros) {
      expect(m.dominio, m.id).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
    }
  });

  it("⚠️ a regra EXTRA da §9 está declarada, e é o acerto SEM vaga", () => {
    // "Produzir com o alvo visível não prova cardinalidade produtiva." (P13)
    for (const m of N1_13.micros) {
      expect(m.dominio.exige?.evidencia, m.id).toBe("sem-andaime");
    }
  });

  it("⚠️ a ficha não declara distratores — é ficha de produção", () => {
    // A resposta é o que ela FEZ. Alternativa aqui devolveria a múltipla escolha
    // que o `gVis_Sequence` servia no lugar desta competência.
    expect(N1_13.distratores).toEqual([]);
  });

  it("as quatro tags da §6 estão declaradas", () => {
    expect(N1_13.erros_tipicos!.map(e => e.id).sort()).toEqual([
      MisconceptionTag.DEPENDE_DE_ANDAIME,
      MisconceptionTag.IGNORA_QUANTIDADE,
      MisconceptionTag.NAO_MONITORA_ALVO,
      MisconceptionTag.PRODUCAO_INCOMPLETA,
    ].sort());
  });

  it("o nível 1 declara a coreografia da §8", () => {
    const beats = N1_13.micros.find(m => m.id === "vagas_pulsando")!.params.tutorial as
      { show?: Record<string, unknown> }[];
    expect(beats.some(b => b.show?.pulsarVagas === true)).toBe(true);
    expect(beats.some(b => b.show?.maoFantasma !== undefined)).toBe(true);
  });
});
