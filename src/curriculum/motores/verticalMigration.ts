import { Composer } from "../Composer";
import { N3_09 } from "../fichas/jornada/N3.09";
import { Question, Track } from "../../types";

type Generator = (level: number) => Question;

/** One-node canary. Rollback is deliberately a removal from this set. */
export const VERTICAL_COMPOSER_CANARIES = new Set<string>(["N3.09"]);

const VERTICAL_FICHAS = { "N3.09": N3_09 } as const;

export function selectVerticalGenerator(
  id: string,
  legacy: Generator | undefined,
  fallback: Generator,
): Pick<Track, "gen" | "generatorSource"> {
  const ficha = VERTICAL_FICHAS[id as keyof typeof VERTICAL_FICHAS];
  if (VERTICAL_COMPOSER_CANARIES.has(id) && ficha) {
    return { gen: level => Composer.generate(ficha, level), generatorSource: "composer" };
  }
  if (legacy) return { gen: legacy, generatorSource: "legacy" };
  return { gen: fallback, generatorSource: "fallback" };
}

export function rollbackVerticalCanary(id = "N3.09"): void {
  VERTICAL_COMPOSER_CANARIES.delete(id);
}
