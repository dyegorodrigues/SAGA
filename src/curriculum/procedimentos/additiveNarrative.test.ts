import { describe, expect, it } from "vitest";
import {
  ADDITIVE_STRUCTURES,
  AdditiveSituation,
  canonicalUnknown,
  solveAdditive,
} from "./additiveProcedure";
import { buildNarrative, narrativeHidesAnswer } from "./additiveNarrative";

const seed = { subjectIndex: 0, partnerIndex: 1, objectIndex: 0 };

const situacao = (over: Partial<AdditiveSituation> = {}): AdditiveSituation => ({
  structure: "join",
  part1: 3,
  part2: 4,
  whole: 7,
  unknown: "whole",
  ...over,
});

describe("narrativa dos problemas aditivos", () => {
  it("abre com a situação inicial e fecha com a mudança, em toda estrutura", () => {
    for (const structure of ADDITIVE_STRUCTURES) {
      const n = buildNarrative(situacao({ structure, unknown: canonicalUnknown(structure) }), seed);
      expect(n.beats[0].role).toBe("initial");
      expect(n.beats[1].role).toBe("change");
      expect(n.question.length).toBeGreaterThan(0);
    }
  });

  it("usa o verbo que ensina a estrutura, não a palavra-chave", () => {
    expect(buildNarrative(situacao({ structure: "join" }), seed).beats[1].text).toContain("chegaram");
    expect(
      buildNarrative(situacao({ structure: "separate", unknown: "part2" }), seed).beats[1].text,
    ).toContain("foram embora");
  });

  it("só a comparação apresenta um segundo personagem, e ele difere do primeiro", () => {
    const comparar = buildNarrative(situacao({ structure: "compare", unknown: "part2" }), seed);
    expect(comparar.partner).toBeDefined();
    expect(comparar.partner).not.toBe(comparar.subject);
    expect(buildNarrative(situacao({ structure: "join" }), seed).partner).toBeUndefined();
  });

  it("evita repetir o mesmo nome quando o sorteio colide", () => {
    const colidido = buildNarrative(situacao({ structure: "compare", unknown: "part2" }), {
      subjectIndex: 2,
      partnerIndex: 2,
      objectIndex: 1,
    });
    expect(colidido.partner).not.toBe(colidido.subject);
  });

  it("nunca enuncia a resposta, em nenhuma estrutura nem posição de incógnita", () => {
    for (const structure of ADDITIVE_STRUCTURES) {
      for (const unknown of ["part1", "part2", "whole"] as const) {
        for (let part1 = 1; part1 <= 8; part1 += 1) {
          for (let part2 = 1; part2 <= 8; part2 += 1) {
            const s = situacao({ structure, unknown, part1, part2, whole: part1 + part2 });
            const n = buildNarrative(s, seed);
            const resposta = solveAdditive(s);
            const conta = n.beats.map(b => b.count);
            // A resposta só pode coincidir por acaso com um dado conhecido igual.
            expect(narrativeHidesAnswer(n, s)).toBe(true);
            expect(conta).not.toContain(undefined);
            expect(typeof resposta).toBe("number");
          }
        }
      }
    }
  });

  it("muda a pergunta quando a incógnita muda de posição", () => {
    const direta = buildNarrative(situacao({ unknown: "whole" }), seed).question;
    const deslocada = buildNarrative(situacao({ unknown: "part1" }), seed).question;
    expect(direta).not.toBe(deslocada);
  });
});

describe("conectivos da narrativa", () => {
  it("não abre a história com 'Então', que pressupõe cena anterior", () => {
    for (const structure of ADDITIVE_STRUCTURES) {
      for (const unknown of ["part1", "part2", "whole"] as const) {
        const n = buildNarrative(situacao({ structure, unknown }), seed);
        expect(n.beats[0].text.startsWith("Então"), `${structure}/${unknown}`).toBe(false);
        expect(n.beats[0].text[0], `${structure}/${unknown}`).toBe(n.beats[0].text[0].toUpperCase());
      }
    }
  });

  it("concorda em gênero e número com o objeto sorteado", () => {
    // objectIndex 3 é "peixes", masculino; quantidade 1 exige singular.
    const masculino = buildNarrative(
      situacao({ part1: 1, part2: 2, whole: 3, unknown: "whole" }),
      { subjectIndex: 0, partnerIndex: 1, objectIndex: 3 },
    );
    expect(masculino.question.startsWith("Quantos")).toBe(true);
    expect(masculino.beats[0].text).toContain("1 peixe.");

    const feminino = buildNarrative(
      situacao({ part1: 2, part2: 2, whole: 4, unknown: "whole" }),
      { subjectIndex: 0, partnerIndex: 1, objectIndex: 4 },
    );
    expect(feminino.question.startsWith("Quantas")).toBe(true);
  });
});
