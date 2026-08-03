import { describe, expect, it } from "vitest";
import { Composer } from "./Composer";
import { FichaCompetencia } from "./schema";
import { StoryBarsSpec, hasSingleUnknown } from "./procedimentos/storyBarsContract";
import { canonicalUnknown } from "./procedimentos/additiveProcedure";

const ficha: FichaCompetencia = {
  id: "F20",
  competencia: "N3.10",
  titulo: "História em Painéis",
  howto: "Veja o que aconteceu: chegou mais ou foi embora?",
  explain: "Olhe de novo o que mudou entre as duas cenas.",
  micros: [
    {
      id: "M1",
      titulo: "situações aditivas",
      kinds: ["storypanel"],
      params: { result_max: 10, audio_prompt: "Escute a história." },
    },
  ],
  niveis: {
    1: { micro: "M1", primitiva: "storypanel" },
    2: { micro: "M1", primitiva: "storypanel" },
    3: { micro: "M1", primitiva: "storypanel" },
    4: { micro: "M1", primitiva: "storypanel" },
    5: { micro: "M1", primitiva: "storypanel" },
  },
} as unknown as FichaCompetencia;

const amostra = (lvl: number, n = 100) =>
  Array.from({ length: n }, () => Composer.generate(ficha, lvl));

describe("builder storypanel do Composer (N3.10)", () => {
  it("normaliza o kind autoral para o kind de runtime story-bars", () => {
    expect(Composer.generate(ficha, 1).kind).toBe("story-bars");
  });

  it("gera os cinco níveis sem lançar, em 500 amostras", () => {
    for (const lvl of [1, 2, 3, 4, 5]) {
      expect(() => amostra(lvl)).not.toThrow();
    }
  });

  it("respeita a escada de estruturas da ficha F20", () => {
    const doNivel = (lvl: number) =>
      new Set(amostra(lvl, 150).map(q => (q.uiProps as StoryBarsSpec).structure));

    expect([...doNivel(1)]).toEqual(["join"]);
    expect([...doNivel(2)].sort()).toEqual(["join", "separate"]);
    expect(doNivel(3).size).toBe(4);
  });

  it("mantém a incógnita na posição direta até o nível 4 e a varia no 5", () => {
    for (const lvl of [1, 2, 3, 4]) {
      for (const q of amostra(lvl, 80)) {
        const spec = q.uiProps as StoryBarsSpec;
        expect(spec.unknown).toBe(canonicalUnknown(spec.structure));
      }
    }
    const posicoes = new Set(amostra(5, 200).map(q => (q.uiProps as StoryBarsSpec).unknown));
    expect(posicoes.size).toBeGreaterThan(1);
  });

  it("retira a ilustração da mudança a partir do nível 4", () => {
    expect((Composer.generate(ficha, 3).uiProps as StoryBarsSpec).story.showChangeIllustration).toBe(true);
    expect((Composer.generate(ficha, 4).uiProps as StoryBarsSpec).story.showChangeIllustration).toBe(false);
  });

  it("apresenta a resposta correta exatamente uma vez e nunca a revela na história", () => {
    for (const lvl of [1, 2, 3, 4, 5]) {
      for (const q of amostra(lvl, 80)) {
        const spec = q.uiProps as StoryBarsSpec;
        const corretas = (q.options ?? []).filter(o => o.value === q.answer);
        expect(corretas).toHaveLength(1);
        expect(hasSingleUnknown(spec.bars)).toBe(true);
        // A história narra apenas os dois termos conhecidos.
        expect(spec.story.beats.map(b => b.count)).not.toContain(spec.answer);
        expect(spec.answer).toBe(q.answer);
      }
    }
  });

  it("mantém a tripla coerente e as partes positivas", () => {
    for (const q of amostra(5, 200)) {
      const { part1, part2, whole } = q.uiProps as StoryBarsSpec extends never ? never : any;
      expect(typeof q.answer).toBe("number");
      expect(q.answer as number).toBeGreaterThanOrEqual(0);
      expect(part1 ?? 0).toBeGreaterThanOrEqual(0);
      expect(part2 ?? 0).toBeGreaterThanOrEqual(0);
      expect(whole ?? 0).toBeGreaterThanOrEqual(0);
    }
  });

  it("recusa result_max fora do intervalo permitido", () => {
    const invalida = {
      ...ficha,
      micros: [{ ...ficha.micros[0], params: { result_max: 1 } }],
    } as unknown as FichaCompetencia;
    expect(() => Composer.generate(invalida, 1)).toThrow(/result_max inválido/);
  });
});
