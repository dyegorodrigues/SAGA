import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Evidencia } from "../../constants/evidencias";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  Criterio,
  FALAS,
  Peca,
  classificacaoPerfeita,
  destinoCerto,
  diagnosticar,
  formaDoNivel,
  pecasDoNivel,
  rotuloDoCriterio,
  satisfaz,
  temMaoFantasma,
} from "./classificacaoProcedure";
import {
  construirClassificacaoSpec,
  criteriosDoNivel,
  enunciadoNaoEntregaResposta,
} from "./classificacaoContract";
import { AL_01 } from "../fichas/jornada/AL.01";

/** Um sorteio preso: mesma semente, mesma cena. */
function semente(s: number): () => number {
  let x = s >>> 0;
  return () => {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
    return x / 4294967296;
  };
}

const SEMENTES = [1, 7, 42, 99, 123, 777, 2024, 31415];

const FICHAS_MD = readFileSync(
  join(__dirname, "..", "..", "..", "AI_Studio_Lab", "pedagogia", "fichas", "FICHAS_F0_COMPLETAS.md"),
  "utf8",
);

const peca = (id: number, cor: Peca["cor"], forma: Peca["forma"], tamanho: Peca["tamanho"]): Peca =>
  ({ id, cor, forma, tamanho });

const VERMELHO: Criterio = { atributo: "cor", valor: "vermelho" };
const GRANDE: Criterio = { atributo: "tamanho", valor: "grande" };

describe("F51 §5 — os cinco níveis, transcritos", () => {
  it.each([
    [1, "um-laco"],
    [2, "dois-excludentes"],
    [3, "reclassificar"],
    [4, "intersecao"],
    [5, "descobrir"],
  ])("nível %i é %s", (nivel, forma) => {
    expect(formaDoNivel(nivel)).toBe(forma);
  });

  it("o nível 1 é sempre COR — a §5 escreve isso entre parênteses", () => {
    for (const s of SEMENTES) {
      expect(criteriosDoNivel(1, semente(s))[0].atributo).toBe("cor");
    }
  });

  it("o nível 2 é excludente: nenhuma peça pode caber nos dois laços", () => {
    // Dois valores do MESMO atributo. É isto que separa o nível 2 do 4.
    for (const s of SEMENTES) {
      const [a, b] = criteriosDoNivel(2, semente(s));
      expect(a.atributo).toBe(b.atributo);
      expect(a.valor).not.toBe(b.valor);
    }
  });

  it("o nível 4 cruza: os dois critérios são de atributos DIFERENTES", () => {
    // É a única forma de uma peça pertencer aos dois — e a §5 chama isso de
    // "o degrau mais difícil do raciocínio lógico infantil".
    for (const s of SEMENTES) {
      const [a, b] = criteriosDoNivel(4, semente(s));
      expect(a.atributo).not.toBe(b.atributo);
    }
  });

  it("a Mão Fantasma só age no nível 1", () => {
    expect([1, 2, 3, 4, 5].map(temMaoFantasma)).toEqual([true, false, false, false, false]);
  });
});

describe("a cena tem sempre o que ensinar", () => {
  it("⚠️ SEMPRE há pelo menos uma peça que fica de FORA — §9 exige", () => {
    // O "não pertence" é a ficha inteira. Uma cena em que tudo cabe ensinaria
    // exatamente o `TUDO_CABE` que ela existe para combater.
    for (const s of SEMENTES) {
      for (let nivel = 1; nivel <= 4; nivel += 1) {
        const spec = construirClassificacaoSpec(nivel, semente(s));
        const criterios = spec.lacos.map(l => l.criterio);
        const fora = spec.pecas.filter(p => destinoCerto(p, criterios).length === 0);
        expect(fora.length, `nível ${nivel}, semente ${s}`).toBeGreaterThan(0);
      }
    }
  });

  it("no nível 4 SEMPRE há peça na interseção — senão o degrau não existe", () => {
    for (const s of SEMENTES) {
      const spec = construirClassificacaoSpec(4, semente(s));
      const criterios = spec.lacos.map(l => l.criterio);
      expect(spec.pecas.some(p => destinoCerto(p, criterios).length >= 2), `semente ${s}`).toBe(true);
    }
  });

  it("nenhum laço fica vazio a rodada inteira", () => {
    // Um laço que nunca recebe peça não ensinou nada, e a criança lê como erro.
    for (const s of SEMENTES) {
      for (let nivel = 1; nivel <= 4; nivel += 1) {
        const spec = construirClassificacaoSpec(nivel, semente(s));
        const criterios = spec.lacos.map(l => l.criterio);
        criterios.forEach((_, i) => {
          expect(
            spec.pecas.some(p => destinoCerto(p, criterios).includes(i)),
            `nível ${nivel} semente ${s} laço ${i}`,
          ).toBe(true);
        });
      }
    }
  });

  it("a quantidade de peças é a do nível", () => {
    for (const s of SEMENTES) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        expect(construirClassificacaoSpec(nivel, semente(s)).pecas).toHaveLength(pecasDoNivel(nivel));
      }
    }
  });

  it("o nível 3 troca de ATRIBUTO, não só de valor", () => {
    // Reclassificar tem de exigir reler o conjunto. Trocar "vermelho" por
    // "azul" seria mudar o valor e manter a pergunta.
    for (const s of SEMENTES) {
      const spec = construirClassificacaoSpec(3, semente(s));
      expect(spec.criterioAnterior).toBeDefined();
      expect(spec.criterioAnterior!.atributo).not.toBe(spec.lacos[0].criterio.atributo);
    }
  });

  it("500 amostras sem exceção nem laço infinito", () => {
    for (let i = 0; i < 500; i += 1) {
      expect(() => construirClassificacaoSpec((i % 5) + 1, semente(i + 1))).not.toThrow();
    }
  });

  it("o enunciado do nível 5 não nomeia o critério", () => {
    for (const s of SEMENTES) {
      expect(enunciadoNaoEntregaResposta(construirClassificacaoSpec(5, semente(s)))).toBe(true);
    }
  });

  it("o nível 5 oferece de 2 a 4 alternativas, e a certa aparece uma vez", () => {
    for (const s of SEMENTES) {
      const spec = construirClassificacaoSpec(5, semente(s));
      expect(spec.alternativas!.length).toBeGreaterThanOrEqual(2);
      expect(spec.alternativas!.length).toBeLessThanOrEqual(4);
      expect(spec.alternativas!.filter(a => a.valor === spec.resposta)).toHaveLength(1);
    }
  });
});

describe("§6 — o diagnóstico vem das TENTATIVAS, não do repouso", () => {
  const criterios = [VERMELHO];
  const azul = peca(0, "azul", "circulo", "grande");
  const vermelha = peca(1, "vermelho", "quadrado", "pequeno");

  it("sem tentativa recusada, não há diagnóstico", () => {
    expect(diagnosticar({
      colocacoes: [
        { peca: azul, onde: [], tentativas: [] },
        { peca: vermelha, onde: [0], tentativas: [] },
      ],
      criterios, forma: "um-laco",
    })).toBeUndefined();
  });

  it("⚠️ tentar enfiar no laço o que devia ficar fora é TUDO_CABE", () => {
    // O alvo da ficha. Repare que a peça TERMINA no lugar certo — o erro é
    // empurrado de volta —, e mesmo assim a hipótese é registrada. Olhar só o
    // repouso deixaria isto passar em toda rodada.
    expect(diagnosticar({
      colocacoes: [
        { peca: azul, onde: [], tentativas: [[0]] },
        { peca: vermelha, onde: [0], tentativas: [] },
      ],
      criterios, forma: "um-laco",
    })).toBe(MisconceptionTag.TUDO_CABE);
  });

  it("na interseção, tentar um laço só é SEM_INTERSECAO", () => {
    const dois = [VERMELHO, GRANDE];
    const ambas = peca(2, "vermelho", "circulo", "grande");
    expect(diagnosticar({
      colocacoes: [{ peca: ambas, onde: [0, 1], tentativas: [[0]] }],
      criterios: dois, forma: "intersecao",
    })).toBe(MisconceptionTag.SEM_INTERSECAO);
  });

  it("seguir o critério ANTERIOR é NAO_RECLASSIFICA, não erro qualquer", () => {
    // Distinguir "errou" de "continuou no critério de antes" importa: as duas
    // coisas pedem aulas diferentes.
    const grandeAzul = peca(3, "azul", "circulo", "grande");
    expect(diagnosticar({
      colocacoes: [{ peca: grandeAzul, onde: [], tentativas: [[0]] }],
      criterios: [VERMELHO],
      forma: "reclassificar",
      criterioAnterior: GRANDE,
    })).toBe(MisconceptionTag.NAO_RECLASSIFICA);
  });

  it("a rodada perfeita não tem tentativa nenhuma", () => {
    // Terminar certo não basta: toda rodada terminada está certa, porque o erro
    // volta. O que separa "entendeu" de "acertou tentando" é não ter tentado.
    const base = { criterios, forma: "um-laco" as const };
    expect(classificacaoPerfeita({
      ...base, colocacoes: [{ peca: azul, onde: [], tentativas: [] }],
    })).toBe(true);
    expect(classificacaoPerfeita({
      ...base, colocacoes: [{ peca: azul, onde: [], tentativas: [[0]] }],
    })).toBe(false);
  });
});

describe("§7 — as falas são as da ficha, letra por letra", () => {
  it.each([
    ["audioPrompt", FALAS.audioPrompt],
    ["howto", FALAS.howto],
    ["explain", FALAS.explain],
  ])("%s está escrita no Markdown do cânone", (_nome, frase) => {
    expect(FICHAS_MD).toContain(frase);
  });

  it("a confirmação do FORA nomeia o critério da cena, não 'vermelha' fixo", () => {
    // §4 dá o exemplo com vermelho; fixar a palavra faria a voz dizer
    // "vermelha" sobre um laço de triângulos — o §6.27.
    expect(FALAS.foraCerto(VERMELHO)).toBe("Isso! Essa não é vermelha.");
    expect(FALAS.foraCerto({ atributo: "forma", valor: "triangulo" }))
      .toBe("Isso! Essa não é um triângulo.");
    expect(FALAS.foraCerto(GRANDE)).toBe("Isso! Essa não é grande.");
  });

  it("o rótulo do laço concorda em número", () => {
    expect(rotuloDoCriterio(VERMELHO)).toBe("vermelhos");
    expect(rotuloDoCriterio({ atributo: "forma", valor: "circulo" })).toBe("círculos");
    expect(rotuloDoCriterio(GRANDE)).toBe("grandes");
  });
});

describe("§9 — o domínio e a ficha", () => {
  it("3 de 3 em 2 sessões, com prova do NÃO PERTENCE em toda micro", () => {
    for (const m of AL_01.micros) {
      expect(m.dominio, m.id).toMatchObject({ acertos: 3, de: 3, sessoes: 2 });
      expect(m.dominio.exige, m.id).toEqual({
        evidencia: Evidencia.NAO_PERTENCE,
        descricao: "Deixar corretamente fora pelo menos uma peça que não pertence ao grupo.",
      });
    }
  });

  it("os cinco níveis são `classificacao` — a ficha F51 não tem outra primitiva", () => {
    // Este teste é o que impede a volta do `intruso_math`: a AL.01 estava ATIVA
    // servindo "qual é o diferente?", que é outra competência com o nome desta.
    for (let n = 1; n <= 5; n += 1) {
      expect(AL_01.niveis![n].primitiva, `nível ${n}`).toBe("classificacao");
    }
  });

  it("cada nível tem micro PRÓPRIA — os cinco degraus da §5 existem", () => {
    const micros = [1, 2, 3, 4, 5].map(n => AL_01.niveis![n].micro);
    expect(new Set(micros).size).toBe(5);
  });

  it("o nível 1 declara a coreografia, e ela deixa uma peça FORA", () => {
    // §8. O segundo gesto é o que a ficha inteira existe para ensinar: uma
    // demonstração que só pusesse peças dentro ensinaria o `TUDO_CABE`.
    const micro = AL_01.micros.find(m => m.id === "um_laco")!;
    const beats = micro.params.tutorial as { show?: Record<string, unknown> }[];
    expect(beats.some(b => b.show?.destacarLaco === true)).toBe(true);
    expect(beats.some(b => b.show?.moverParaDentro !== undefined)).toBe(true);
    expect(beats.some(b => b.show?.deixarFora !== undefined)).toBe(true);
  });
});

describe("satisfaz e destinoCerto", () => {
  it("o destino vazio é FORA, e fora é resposta", () => {
    expect(destinoCerto(peca(0, "azul", "circulo", "grande"), [VERMELHO])).toEqual([]);
  });
  it("uma peça pode pertencer a dois laços", () => {
    expect(destinoCerto(peca(0, "vermelho", "circulo", "grande"), [VERMELHO, GRANDE])).toEqual([0, 1]);
  });
  it("satisfaz olha o atributo certo", () => {
    expect(satisfaz(peca(0, "vermelho", "circulo", "pequeno"), GRANDE)).toBe(false);
  });
});
