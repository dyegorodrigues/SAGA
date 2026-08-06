import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  FALAS,
  PARES_FONOLOGICOS,
  confundiveisCom,
  diagnosticar,
  escopoDoNivel,
  exigeParFonologico,
  opcoesDoNivel,
  porExtenso,
  soaParecido,
  velocidadeDoNivel,
} from "./audioChoiceProcedure";
import {
  construirAudioChoiceSpec,
  nadaEscritoEntregaOAlvo,
  respostaApareceUmaVez,
} from "./audioChoiceContract";
import { N1_06 } from "../fichas/jornada/N1.06";

function semente(s: number): () => number {
  let x = s >>> 0;
  return () => { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return x / 4294967296; };
}
const SEMENTES = [1, 7, 42, 99, 123, 777, 2024, 31415];

const FICHAS_MD = readFileSync(
  join(__dirname, "..", "..", "..", "AI_Studio_Lab", "pedagogia", "fichas", "FICHAS_F0_COMPLETAS.md"),
  "utf8",
);

describe("F05 §5 — os cinco níveis, transcritos", () => {
  it.each([
    [1, 1, 3, 2],
    [2, 1, 5, 3],
    [3, 1, 10, 3],
    [4, 1, 10, 4],
    [5, 1, 20, 4],
  ])("nível %i: escopo %i a %i, %i opções", (nivel, min, max, opcoes) => {
    expect(escopoDoNivel(nivel)).toEqual({ min, max });
    expect(opcoesDoNivel(nivel)).toBe(opcoes);
  });

  it("só o nível 5 acelera a voz", () => {
    expect([1, 2, 3, 4].map(velocidadeDoNivel)).toEqual([1, 1, 1, 1]);
    expect(velocidadeDoNivel(5)).toBeGreaterThan(1);
  });

  it("o par fonológico é exigido do nível 4 em diante", () => {
    expect([1, 2, 3, 4, 5].map(exigeParFonologico)).toEqual([false, false, false, true, true]);
  });
});

describe("os pares que soam parecido", () => {
  it("6 e 7 são o par do nível 4 — o exemplo da §5", () => {
    expect(soaParecido(6, 7)).toBe(true);
  });

  it("⚠️ soar parecido NÃO é ser vizinho numérico", () => {
    // 3 e 13 estão a dez de distância e confundem mais que 3 e 4. Tratar as
    // duas coisas como uma faria o Radar mandar treinar contagem quando o que
    // falhou foi o ouvido.
    expect(soaParecido(3, 13)).toBe(true);
    expect(soaParecido(3, 4)).toBe(false);
  });

  it("nenhum par se repete, e nenhum é consigo mesmo", () => {
    const chaves = PARES_FONOLOGICOS.map(([a, b]) => `${Math.min(a, b)}-${Math.max(a, b)}`);
    expect(new Set(chaves).size).toBe(chaves.length);
    expect(PARES_FONOLOGICOS.every(([a, b]) => a !== b)).toBe(true);
  });

  it("os confundíveis respeitam o teto do escopo", () => {
    expect(confundiveisCom(3, 10)).toEqual([]);
    expect(confundiveisCom(3, 20)).toEqual([13]);
    expect(confundiveisCom(6, 10)).toEqual([7]);
  });
});

describe("a cena", () => {
  it("⚠️ NADA escrito entrega o alvo — a regra que a ficha inteira defende", () => {
    // A §2: "é o único exercício do app onde a pergunta não depende de leitura".
    // O gerador antigo imprimia "🔊 TRÊS" e a criança resolvia LENDO.
    for (const s of SEMENTES) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        expect(nadaEscritoEntregaOAlvo(construirAudioChoiceSpec(nivel, semente(s))), `n${nivel} s${s}`).toBe(true);
      }
    }
  });

  it("a resposta aparece exatamente uma vez, e a quantidade de opções é a do nível", () => {
    for (const s of SEMENTES) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const spec = construirAudioChoiceSpec(nivel, semente(s));
        expect(respostaApareceUmaVez(spec)).toBe(true);
        expect(spec.alternativas).toHaveLength(opcoesDoNivel(nivel));
      }
    }
  });

  it("nenhuma alternativa sai do escopo do nível", () => {
    for (const s of SEMENTES) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const { min, max } = escopoDoNivel(nivel);
        for (const v of construirAudioChoiceSpec(nivel, semente(s)).alternativas) {
          expect(v).toBeGreaterThanOrEqual(min);
          expect(v).toBeLessThanOrEqual(max);
        }
      }
    }
  });

  it("o nível 1 usa números bem DISTINTOS — §5", () => {
    // "1 e 3", não "2 e 3". Vizinho é o degrau seguinte.
    for (const s of SEMENTES) {
      const alt = construirAudioChoiceSpec(1, semente(s)).alternativas;
      expect(Math.abs(alt[0] - alt[1])).toBeGreaterThanOrEqual(2);
    }
  });

  it("o nível 4 SEMPRE traz o par confundível — senão o degrau é sorte", () => {
    for (const s of SEMENTES) {
      const spec = construirAudioChoiceSpec(4, semente(s));
      const temPar = spec.alternativas.some(v => v !== spec.alvo && soaParecido(v, spec.alvo));
      expect(temPar, `semente ${s}`).toBe(true);
    }
  });

  it("⚠️ a resposta NÃO fica sempre na primeira posição", () => {
    // A tag `NAO_ESCUTOU` da §6 é "sempre a primeira opção". Com a certa fixa
    // na frente, chutar a primeira seria a estratégia perfeita e a hipótese
    // nunca poderia existir. Mesma família do `CHUTE_SEGURO` do relance.
    const posicoes = new Set(SEMENTES.map(s => {
      const spec = construirAudioChoiceSpec(3, semente(s));
      return spec.alternativas.indexOf(spec.alvo);
    }));
    expect(posicoes.size).toBeGreaterThan(1);
  });

  it("500 amostras sem exceção nem laço infinito", () => {
    for (let i = 0; i < 500; i += 1) {
      expect(() => construirAudioChoiceSpec((i % 5) + 1, semente(i + 1))).not.toThrow();
    }
  });
});

describe("§6 — o diagnóstico", () => {
  const base = { alvo: 6, alternativas: [1, 6, 7, 9], repeticoes: 1 };

  it("acerto na primeira audição não gera diagnóstico", () => {
    expect(diagnosticar({ ...base, resposta: 6, repeticoes: 0 })).toBeUndefined();
  });

  it("acertar depois de repetir muito é PRECISA_REPETICAO — §9", () => {
    // "Acertar depois de ouvir cinco vezes não prova reconhecimento."
    expect(diagnosticar({ ...base, resposta: 6, repeticoes: 4 }))
      .toBe(MisconceptionTag.PRECISA_REPETICAO);
  });

  it("a primeira opção sem ter ouvido de novo é NAO_ESCUTOU", () => {
    expect(diagnosticar({ ...base, resposta: 1, repeticoes: 0 }))
      .toBe(MisconceptionTag.NAO_ESCUTOU);
  });

  it("o par que soa parecido é CONFUSAO_FONOLOGICA, não vizinho", () => {
    // 6 e 7 são vizinhos E soam parecido. A aula de quem não distinguiu o som
    // não é a de quem não reconheceu o símbolo — a ordem das tags é o que
    // separa as duas (§6.8).
    expect(diagnosticar({ ...base, resposta: 7 }))
      .toBe(MisconceptionTag.CONFUSAO_FONOLOGICA);
  });

  it("o vizinho que não soa parecido é CONFUNDE_VIZINHO", () => {
    expect(diagnosticar({ alvo: 3, alternativas: [1, 3, 4], resposta: 4, repeticoes: 1 }))
      .toBe(MisconceptionTag.CONFUNDE_VIZINHO);
  });
});

describe("§7 — as falas são as da ficha, letra por letra", () => {
  it.each([
    ["audioPrompt", FALAS.audioPrompt],
    ["howto", FALAS.howto],
    ["explain", FALAS.explain],
  ])("%s está escrita no Markdown do cânone", (_n, frase) => {
    expect(FICHAS_MD).toContain(frase);
  });

  it("o erro NÃO diz 'errou' — ele repete o número pedido", () => {
    // §4, "o detalhe que faz funcionar": o feedback É a informação que faltava.
    const fala = FALAS.erroSuave(3);
    expect(fala).toBe("Eu falei... TRÊS");
    expect(fala.toLowerCase()).not.toContain("errou");
    expect(fala.toLowerCase()).not.toContain("não");
  });

  it("o acerto repete o número, e não elogia sem conteúdo", () => {
    expect(FALAS.acerto(3)).toBe("Isso! três!");
  });

  it("os números por extenso vão até vinte — o escopo do nível 5", () => {
    expect(porExtenso(1)).toBe("um");
    expect(porExtenso(13)).toBe("treze");
    expect(porExtenso(20)).toBe("vinte");
  });
});

describe("§9 — o domínio e a ficha", () => {
  it("3 de 3 em 2 sessões, em toda micro", () => {
    for (const m of N1_06.micros) {
      expect(m.dominio, m.id).toEqual({ acertos: 3, de: 3, sessoes: 2 });
    }
  });

  it("os cinco níveis são `audiochoice` — a F05 não tem outra primitiva", () => {
    // Este teste é o que impede a volta do `plain` com "🔊 TRÊS" escrito.
    for (let n = 1; n <= 5; n += 1) {
      expect(N1_06.niveis![n].primitiva, `nível ${n}`).toBe("audiochoice");
    }
  });

  it("cada nível tem micro própria — os cinco degraus da §5 existem", () => {
    expect(new Set([1, 2, 3, 4, 5].map(n => N1_06.niveis![n].micro)).size).toBe(5);
  });

  it("o nível 1 declara a coreografia da §8", () => {
    const beats = N1_06.micros.find(m => m.id === "distintos")!.params.tutorial as
      { show?: Record<string, unknown> }[];
    expect(beats.some(b => b.show?.pulsar === "botaoSom")).toBe(true);
    expect(beats.some(b => b.show?.ondasSonoras === true)).toBe(true);
    expect(beats.some(b => b.show?.pulsarOpcoes === true)).toBe(true);
  });
});
