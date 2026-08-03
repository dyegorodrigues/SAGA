import { MisconceptionTag, MisconceptionTagType } from "../../constants/misconceptions";
import { Option } from "../../types";

/**
 * Procedimento puro das situações aditivas de N3.10 (ficha canônica F20).
 *
 * As quatro estruturas reduzem à mesma relação parte–parte–todo, que é
 * exatamente o que a barra de Singapura desenha:
 *
 *     [ parte1 ][ parte2 ] = [ todo ]
 *
 * | Estrutura  | parte1        | parte2          | todo        |
 * |------------|---------------|-----------------|-------------|
 * | `join`     | início        | o que chegou    | resultado   |
 * | `separate` | o que saiu    | o que restou    | início      |
 * | `compare`  | o menor       | a diferença     | o maior     |
 * | `complete` | o que já tem  | o que falta     | a meta      |
 *
 * Unificar as quatro numa única tripla é o que torna a incógnita variável do
 * nível 5 um deslocamento de posição, e não quatro procedimentos distintos.
 */

export type AdditiveStructure = "join" | "separate" | "compare" | "complete";

/** Qual dos três termos da relação está oculto na pergunta. */
export type UnknownSlot = "part1" | "part2" | "whole";

export interface AdditiveTriple {
  part1: number;
  part2: number;
  whole: number;
}

export interface AdditiveSituation extends AdditiveTriple {
  structure: AdditiveStructure;
  unknown: UnknownSlot;
}

export const ADDITIVE_STRUCTURES: readonly AdditiveStructure[] = [
  "join",
  "separate",
  "compare",
  "complete",
];

/**
 * Posição em que a pergunta cai quando a situação é apresentada na forma direta.
 *
 * Só `join` pergunta pelo todo; separar, comparar e completar perguntam pela
 * segunda parte — respectivamente o que restou, a diferença e o que falta.
 */
export function canonicalUnknown(structure: AdditiveStructure): UnknownSlot {
  return structure === "join" ? "whole" : "part2";
}

/** Escada da ficha F20: uma estrutura por vez até as quatro conviverem. */
export function structuresForLevel(level: number): readonly AdditiveStructure[] {
  if (level <= 1) return ["join"];
  if (level === 2) return ["join", "separate"];
  return ADDITIVE_STRUCTURES;
}

/**
 * Apenas o nível 5 move a incógnita: antes dele a pergunta permanece na posição
 * direta, para que a criança construa a estrutura antes de raciocinar sobre ela.
 */
export function unknownSlotsForLevel(
  level: number,
  structure: AdditiveStructure,
): readonly UnknownSlot[] {
  if (level < 5) return [canonicalUnknown(structure)];
  return ["part1", "part2", "whole"];
}

/**
 * A ilustração da mudança sai de cena no nível 4: a partir dali a narrativa
 * precisa bastar. É decisão de apresentação, exposta aqui apenas como dado.
 */
export function showsChangeIllustration(level: number): boolean {
  return level <= 3;
}

/** Somar quando o todo é desconhecido; subtrair quando falta uma parte. */
export function operationFor(unknown: UnknownSlot): "+" | "-" {
  return unknown === "whole" ? "+" : "-";
}

export function isValidTriple({ part1, part2, whole }: AdditiveTriple): boolean {
  return [part1, part2, whole].every(v => Number.isInteger(v) && v >= 0)
    && part1 + part2 === whole;
}

export function solveAdditive(situation: AdditiveSituation): number {
  const { part1, part2, whole, unknown } = situation;
  switch (unknown) {
    case "whole":
      return part1 + part2;
    case "part1":
      return whole - part2;
    default:
      return whole - part1;
  }
}

/** Os dois termos que a história revela, na ordem em que aparecem. */
export function knownTerms(situation: AdditiveSituation): [number, number] {
  const { part1, part2, whole, unknown } = situation;
  if (unknown === "whole") return [part1, part2];
  if (unknown === "part1") return [part2, whole];
  return [part1, whole];
}

interface Distractor {
  value: number;
  misconception: MisconceptionTagType;
}

/**
 * Distratores derivados do §6 da ficha: cada alternativa errada corresponde a um
 * raciocínio observável, nunca a um número aleatório.
 */
function distractorsFor(situation: AdditiveSituation): Distractor[] {
  const correct = solveAdditive(situation);
  const [first, second] = knownTerms(situation);
  const candidates: Distractor[] = [];

  if (situation.unknown === "whole") {
    // Perguntou o todo e a criança subtraiu: trocou a operação pela palavra.
    candidates.push({ value: first - second, misconception: MisconceptionTag.PALAVRA_CHAVE });
  } else {
    // Perguntou uma parte e a criança somou os dois números visíveis.
    //
    // Com a incógnita deslocada para o início, somar o que está à vista é
    // justamente aplicar o procedimento canônico sem ler a estrutura — sinal
    // mais específico que a troca de operação por palavra-chave, e o que a
    // ficha pede para observar no nível 5.
    let misconception: MisconceptionTagType = MisconceptionTag.PALAVRA_CHAVE;
    if (situation.unknown === "part1") misconception = MisconceptionTag.SO_RESOLVE_CANONICO;
    else if (situation.structure === "compare") misconception = MisconceptionTag.COMPARA_SOMANDO;
    candidates.push({ value: first + second, misconception });
  }

  // Devolveu um dado da história em vez de operar.
  candidates.push({ value: first, misconception: MisconceptionTag.REPETE_DADO });
  candidates.push({ value: second, misconception: MisconceptionTag.REPETE_DADO });
  candidates.push({ value: correct + 1, misconception: MisconceptionTag.OFF_BY_ONE });

  return candidates.filter(c => c.value >= 0 && c.value !== correct);
}

/**
 * Alternativas com a resposta correta presente exatamente uma vez.
 * A ordem é estável: embaralhar é responsabilidade de quem apresenta.
 */
export function additiveOptions(situation: AdditiveSituation, total = 4): Option[] {
  const correct = solveAdditive(situation);
  const options: Option[] = [{ label: String(correct), value: correct }];
  const seen = new Set<number>([correct]);

  for (const { value, misconception } of distractorsFor(situation)) {
    if (options.length >= total) break;
    if (seen.has(value)) continue;
    seen.add(value);
    options.push({ label: String(value), value, misconception });
  }

  // Completa sem repetir e sem introduzir um segundo valor correto.
  for (let delta = 2; options.length < total; delta += 1) {
    const value = correct + delta;
    if (seen.has(value)) continue;
    seen.add(value);
    options.push({ label: String(value), value });
  }

  return options;
}

/**
 * Domínio da ficha: quatro acertos que cubram estruturas diferentes.
 * Acertar quatro problemas de juntar não prova competência em problemas.
 */
export function coversDistinctStructures(
  structures: readonly AdditiveStructure[],
  required = 4,
): boolean {
  return new Set(structures).size >= required;
}
