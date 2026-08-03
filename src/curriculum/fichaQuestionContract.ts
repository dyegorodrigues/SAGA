import { Option, Question } from "../types";
import { FichaParams } from "./schema";
import { StoryBarsSpec } from "./procedimentos/storyBarsContract";

export type FichaAnswer = string | number;
export type FichaEvaluate = (answer: unknown) => boolean;

type EmojiCollectionProps = {
  emoji: string;
  n: number;
  flashDurationMs?: number;
  interactiveCount?: boolean;
  targetNumber?: number;
  ordered?: boolean;
};

export type FichaUiProps =
  | EmojiCollectionProps
  | { start: number; end: number; interactive: true; startPos: number; showJumps: { from: number; to: number }[] }
  | { n: number; flashDurationMs?: number; moldura: number }
  | { whole: number | "?"; part1: number | "?"; part2: number | "?"; interactivePart: "whole" | "part1" | "part2" }
  | { sourceCount: number; destCount: number; sourceEmoji: string; destEmoji: string }
  | { dezenas: number; unidades: number }
  | { initialHours: number; initialMinutes: number; interactive: false }
  | { leftItems: BalanceItem[]; rightItems: BalanceItem[] }
  | { vTop: number; vBot: number; vOp: "+" | "-"; showPlaceValue?: boolean; showRegroup?: boolean; showAlgorithm?: boolean }
  | { rows: number; cols: number; allowRotate: boolean; requireRotate: boolean; areaMode: boolean; showEquation: boolean; answerMode: "total" | "equation" }
  | StoryBarsSpec
  | { text: string };

interface BalanceItem {
  id: string;
  weight: number;
  label: number;
}

export interface ComposerParams {
  n_min?: number;
  n_max?: number;
  flash_ms?: number;
  interactive_count?: boolean;
  start?: number;
  end?: number;
  jump_size?: number;
  moldura?: number;
  soma_max?: number;
  interactive?: string;
  tem_sobra?: boolean;
  dezenas_max?: number;
  unidades_max?: number;
  apenas_horas_exatas?: boolean;
  interativo?: boolean;
  minutos_step?: number;
  peso_alvo_min?: number;
  peso_alvo_max?: number;
  top_min?: number;
  top_max?: number;
  bottom_min?: number;
  bottom_max?: number;
  operation?: "+" | "-" | "mixed";
  require_regroup?: boolean;
  require_double_regroup?: boolean;
  forbid_regroup?: boolean;
  operand_step?: number;
  result_max?: number;
  show_place_value?: boolean;
  show_regroup?: boolean;
  show_algorithm?: boolean;
  rows_min?: number;
  rows_max?: number;
  cols_min?: number;
  cols_max?: number;
  allow_rotate?: boolean;
  require_rotate?: boolean;
  area_mode?: boolean;
  show_equation?: boolean;
  answer_mode?: "total" | "equation";
  big?: string;
  answer?: FichaAnswer;
  options?: Option[];
  audio_prompt?: string;
  tutorial?: unknown;
}

type Tutorial = Question["tutorial"];

const NUMBER_KEYS = [
  "n_min", "n_max", "flash_ms", "start", "end", "jump_size", "moldura",
  "soma_max", "dezenas_max", "unidades_max", "minutos_step",
  "peso_alvo_min", "peso_alvo_max", "top_min", "top_max", "bottom_min",
  "bottom_max", "operand_step", "result_max", "rows_min", "rows_max", "cols_min", "cols_max",
] as const;
const BOOLEAN_KEYS = [
  "interactive_count", "tem_sobra", "apenas_horas_exatas", "interativo",
  "require_regroup", "require_double_regroup", "forbid_regroup", "show_place_value", "show_regroup", "show_algorithm",
  "allow_rotate", "require_rotate", "area_mode", "show_equation",
] as const;
const STRING_KEYS = ["interactive", "big", "audio_prompt"] as const;

export function parseComposerParams(input: FichaParams, context: string): ComposerParams {
  const parsed: ComposerParams = {};

  for (const key of NUMBER_KEYS) {
    const value = input[key];
    if (value === undefined) continue;
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error(`Parâmetro ${key} inválido em ${context}: esperado número.`);
    }
    parsed[key] = value;
  }
  for (const key of BOOLEAN_KEYS) {
    const value = input[key];
    if (value === undefined) continue;
    if (typeof value !== "boolean") {
      throw new Error(`Parâmetro ${key} inválido em ${context}: esperado booleano.`);
    }
    parsed[key] = value;
  }
  for (const key of STRING_KEYS) {
    const value = input[key];
    if (value === undefined) continue;
    if (typeof value !== "string") {
      throw new Error(`Parâmetro ${key} inválido em ${context}: esperado texto.`);
    }
    parsed[key] = value;
  }
  if (input.operation !== undefined) {
    if (input.operation !== "+" && input.operation !== "-" && input.operation !== "mixed") {
      throw new Error(`Parâmetro operation inválido em ${context}: esperado +, - ou mixed.`);
    }
    parsed.operation = input.operation;
  }
  if (input.answer_mode !== undefined) {
    if (input.answer_mode !== "total" && input.answer_mode !== "equation") {
      throw new Error(`Parâmetro answer_mode inválido em ${context}: esperado total ou equation.`);
    }
    parsed.answer_mode = input.answer_mode;
  }

  const answer = input.answer;
  if (answer !== undefined) {
    if (typeof answer !== "number" && typeof answer !== "string") {
      throw new Error(`Parâmetro answer inválido em ${context}.`);
    }
    parsed.answer = answer;
  }
  if (input.options !== undefined) {
    if (!Array.isArray(input.options)) {
      throw new Error(`Parâmetro options inválido em ${context}: esperado array.`);
    }
    parsed.options = input.options.map((option, index) => {
      if (!option || typeof option !== "object") {
        throw new Error(`Opção ${index} inválida em ${context}.`);
      }
      const candidate = option as Record<string, unknown>;
      if (typeof candidate.value !== "number" && typeof candidate.value !== "string") {
        throw new Error(`Valor da opção ${index} inválido em ${context}.`);
      }
      if (candidate.label !== undefined && typeof candidate.label !== "string") {
        throw new Error(`Rótulo da opção ${index} inválido em ${context}.`);
      }
      return { label: candidate.label, value: candidate.value } as Option;
    });
  }
  parsed.tutorial = input.tutorial;
  return parsed;
}

export function normalizeFichaTutorial(value: unknown): Tutorial {
  if (!Array.isArray(value)) return undefined;

  return value.flatMap(step => {
    if (!step || typeof step !== "object") return [];
    const raw = step as Record<string, unknown>;
    const say = raw.say ?? raw.fala;
    if (typeof say !== "string") return [];
    const show = raw.show;
    const validShow = show === undefined || typeof show === "string" ||
      typeof show === "number" || (typeof show === "object" && show !== null);
    if (!validShow) return [];
    return [{
      say,
      ...(show !== undefined ? { show: show as NonNullable<Tutorial>[number]["show"] } : {}),
      ...(typeof raw.ms === "number" ? { ms: raw.ms } : {}),
    }];
  });
}
