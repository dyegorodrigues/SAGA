import { describe, expect, it } from "vitest";
import { ADDITIVE_STRUCTURES, AdditiveSituation, canonicalUnknown } from "./additiveProcedure";
import {
  StoryBeat,
  buildBarSpec,
  buildStoryBarsSpec,
  hasSingleUnknown,
  layoutFor,
  revealsAnswer,
} from "./storyBarsContract";

const beats = (inicial: number, mudanca: number): [StoryBeat, StoryBeat] => [
  { role: "initial", text: `Havia ${inicial} dinos no vale.`, count: inicial },
  { role: "change", text: `Então chegaram mais ${mudanca}.`, count: mudanca },
];

const narrativa = (inicial: number, mudanca: number) => ({
  subject: "Lia",
  objectLabel: "dinos",
  emoji: "🦕",
  beats: beats(inicial, mudanca),
  question: "Quantos dinos há ao todo?",
});

const situacao = (over: Partial<AdditiveSituation> = {}): AdditiveSituation => ({
  structure: "join",
  part1: 3,
  part2: 4,
  whole: 7,
  unknown: "whole",
  ...over,
});

describe("contrato StoryPanel + SingaporeBars", () => {
  it("desenha comparação como duas barras alinhadas e o resto como parte-todo", () => {
    expect(layoutFor("compare")).toBe("comparison");
    for (const s of ["join", "separate", "complete"] as const) {
      expect(layoutFor(s)).toBe("part-whole");
    }
  });

  it("esconde exatamente o segmento perguntado, em qualquer posição", () => {
    for (const unknown of ["part1", "part2", "whole"] as const) {
      const bars = buildBarSpec(situacao({ unknown }));
      expect(hasSingleUnknown(bars)).toBe(true);
      expect(bars[unknown].known).toBe(false);
    }
  });

  it("nomeia os segmentos conforme a estrutura, para áudio e leitor de tela", () => {
    expect(buildBarSpec(situacao({ structure: "compare" })).roles.part2).toBe("a diferença");
    expect(buildBarSpec(situacao({ structure: "complete" })).roles.part2).toBe("o que falta");
    expect(buildBarSpec(situacao({ structure: "separate" })).roles.whole).toBe("o que tinha");
  });

  it("retira a ilustração da mudança a partir do nível 4", () => {
    expect(buildStoryBarsSpec(situacao(), narrativa(3, 4), 3).story.showChangeIllustration).toBe(true);
    expect(buildStoryBarsSpec(situacao(), narrativa(3, 4), 4).story.showChangeIllustration).toBe(false);
  });

  it("recusa tripla incoerente", () => {
    expect(() => buildStoryBarsSpec(situacao({ whole: 8 }), narrativa(3, 4), 1)).toThrow(/inválida/);
  });

  it("recusa história sem a batida da mudança", () => {
    const invertida = {
      ...narrativa(3, 4),
      beats: [
        { role: "change", text: "x", count: 4 },
        { role: "initial", text: "y", count: 3 },
      ] as [StoryBeat, StoryBeat],
    };
    expect(() => buildStoryBarsSpec(situacao(), invertida, 1)).toThrow(/batida inicial/);
  });

  it("detecta narrativa que entrega a resposta", () => {
    const honesta = buildStoryBarsSpec(situacao(), narrativa(3, 4), 1);
    expect(revealsAnswer(honesta)).toBe(false);

    // 7 é a resposta; contá-lo na história tornaria a pergunta vazia.
    const entregue = buildStoryBarsSpec(situacao(), narrativa(7, 4), 1);
    expect(revealsAnswer(entregue)).toBe(true);
  });

  it("mantém história e barra desacopladas em todas as estruturas", () => {
    for (const structure of ADDITIVE_STRUCTURES) {
      const spec = buildStoryBarsSpec(
        situacao({ structure, unknown: canonicalUnknown(structure) }),
        narrativa(3, 4),
        2,
      );
      expect(hasSingleUnknown(spec.bars)).toBe(true);
      // A barra não conhece personagem, emoji nem texto.
      expect(JSON.stringify(spec.bars)).not.toContain("Lia");
      expect(JSON.stringify(spec.bars)).not.toContain("🦕");
    }
  });
});
