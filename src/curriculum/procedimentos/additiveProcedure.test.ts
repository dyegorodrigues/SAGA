import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  ADDITIVE_STRUCTURES,
  AdditiveSituation,
  additiveOptions,
  canonicalUnknown,
  coversDistinctStructures,
  isValidTriple,
  knownTerms,
  operationFor,
  showsChangeIllustration,
  solveAdditive,
  structuresForLevel,
  unknownSlotsForLevel,
} from "./additiveProcedure";

const situacao = (over: Partial<AdditiveSituation> = {}): AdditiveSituation => ({
  structure: "join",
  part1: 3,
  part2: 4,
  whole: 7,
  unknown: "whole",
  ...over,
});

describe("procedimento aditivo (ficha F20 / N3.10)", () => {
  describe("relação parte–parte–todo", () => {
    it("aceita apenas triplas coerentes e não negativas", () => {
      expect(isValidTriple({ part1: 3, part2: 4, whole: 7 })).toBe(true);
      expect(isValidTriple({ part1: 3, part2: 4, whole: 8 })).toBe(false);
      expect(isValidTriple({ part1: -1, part2: 8, whole: 7 })).toBe(false);
      expect(isValidTriple({ part1: 1.5, part2: 5.5, whole: 7 })).toBe(false);
    });

    it("resolve a incógnita em qualquer uma das três posições", () => {
      expect(solveAdditive(situacao({ unknown: "whole" }))).toBe(7);
      expect(solveAdditive(situacao({ unknown: "part1" }))).toBe(3);
      expect(solveAdditive(situacao({ unknown: "part2" }))).toBe(4);
    });

    it("revela apenas os dois termos que a história conta", () => {
      expect(knownTerms(situacao({ unknown: "whole" }))).toEqual([3, 4]);
      expect(knownTerms(situacao({ unknown: "part1" }))).toEqual([4, 7]);
      expect(knownTerms(situacao({ unknown: "part2" }))).toEqual([3, 7]);
    });

    it("soma quando falta o todo e subtrai quando falta uma parte", () => {
      expect(operationFor("whole")).toBe("+");
      expect(operationFor("part1")).toBe("-");
      expect(operationFor("part2")).toBe("-");
    });
  });

  describe("as quatro estruturas", () => {
    it("só juntar pergunta pelo todo; as demais perguntam pela segunda parte", () => {
      expect(canonicalUnknown("join")).toBe("whole");
      expect(canonicalUnknown("separate")).toBe("part2");
      expect(canonicalUnknown("compare")).toBe("part2");
      expect(canonicalUnknown("complete")).toBe("part2");
    });

    it("cada estrutura resolve com a mesma tripla", () => {
      // separar: tinha 7, deu 3, restaram 4
      expect(solveAdditive(situacao({ structure: "separate", part1: 3, part2: 4, whole: 7, unknown: "part2" }))).toBe(4);
      // comparar: 7 e 3, diferença 4
      expect(solveAdditive(situacao({ structure: "compare", part1: 3, part2: 4, whole: 7, unknown: "part2" }))).toBe(4);
      // completar: tem 3, quer 7, faltam 4
      expect(solveAdditive(situacao({ structure: "complete", part1: 3, part2: 4, whole: 7, unknown: "part2" }))).toBe(4);
    });
  });

  describe("escada dos cinco níveis", () => {
    it("abre em juntar, soma separar no 2 e as quatro a partir do 3", () => {
      expect(structuresForLevel(1)).toEqual(["join"]);
      expect(structuresForLevel(2)).toEqual(["join", "separate"]);
      expect(structuresForLevel(3)).toEqual(ADDITIVE_STRUCTURES);
      expect(structuresForLevel(5)).toEqual(ADDITIVE_STRUCTURES);
    });

    it("retira a ilustração da mudança a partir do nível 4", () => {
      expect(showsChangeIllustration(3)).toBe(true);
      expect(showsChangeIllustration(4)).toBe(false);
    });

    it("mantém a incógnita na posição direta até o nível 4", () => {
      for (const level of [1, 2, 3, 4]) {
        for (const structure of structuresForLevel(level)) {
          expect(unknownSlotsForLevel(level, structure)).toEqual([canonicalUnknown(structure)]);
        }
      }
    });

    it("varia a incógnita nas três posições apenas no nível 5", () => {
      for (const structure of ADDITIVE_STRUCTURES) {
        expect(unknownSlotsForLevel(5, structure)).toEqual(["part1", "part2", "whole"]);
      }
    });
  });

  describe("alternativas e diagnóstico", () => {
    it("apresenta a resposta correta exatamente uma vez", () => {
      for (const structure of ADDITIVE_STRUCTURES) {
        for (const unknown of ["part1", "part2", "whole"] as const) {
          const s = situacao({ structure, unknown });
          const correct = solveAdditive(s);
          const options = additiveOptions(s);
          expect(options.filter(o => o.value === correct)).toHaveLength(1);
        }
      }
    });

    it("não repete valores e não devolve alternativa negativa", () => {
      for (let part1 = 0; part1 <= 9; part1 += 1) {
        for (let part2 = 0; part2 <= 9; part2 += 1) {
          const s = situacao({ part1, part2, whole: part1 + part2, unknown: "part2" });
          const options = additiveOptions(s);
          expect(options).toHaveLength(4);
          expect(new Set(options.map(o => o.value)).size).toBe(4);
          expect(options.every(o => Number(o.value) >= 0)).toBe(true);
        }
      }
    });

    it("marca a soma indevida numa comparação como COMPARA_SOMANDO", () => {
      const s = situacao({ structure: "compare", part1: 3, part2: 4, whole: 7, unknown: "part2" });
      const somou = additiveOptions(s).find(o => o.value === 10);
      expect(somou?.misconception).toBe(MisconceptionTag.COMPARA_SOMANDO);
    });

    it("marca a troca de operação por palavra-chave fora da comparação", () => {
      const s = situacao({ structure: "complete", part1: 3, part2: 4, whole: 7, unknown: "part2" });
      const somou = additiveOptions(s).find(o => o.value === 10);
      expect(somou?.misconception).toBe(MisconceptionTag.PALAVRA_CHAVE);
    });

    it("marca o procedimento canônico aplicado com a incógnita deslocada", () => {
      const s = situacao({ part1: 3, part2: 4, whole: 7, unknown: "part1" });
      const canonico = additiveOptions(s).find(o => o.value === 11);
      expect(canonico?.misconception).toBe(MisconceptionTag.SO_RESOLVE_CANONICO);
    });

    it("marca a devolução de um dado da história como REPETE_DADO", () => {
      const s = situacao({ part1: 2, part2: 5, whole: 7, unknown: "whole" });
      const repetiu = additiveOptions(s).find(o => o.value === 2 || o.value === 5);
      expect(repetiu?.misconception).toBe(MisconceptionTag.REPETE_DADO);
    });
  });

  describe("regra de domínio", () => {
    it("exige quatro estruturas distintas, não quatro acertos de juntar", () => {
      expect(coversDistinctStructures(["join", "join", "join", "join"])).toBe(false);
      expect(coversDistinctStructures(["join", "separate", "compare", "complete"])).toBe(true);
    });
  });
});
