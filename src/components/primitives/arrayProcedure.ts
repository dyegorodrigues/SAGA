import { Option } from "../../types";

export type ArrayAnswerMode = "total" | "equation";

export interface ArrayChoice {
  rows: number;
  cols: number;
  answerMode: ArrayAnswerMode;
}

export function arrayAnswer({ rows, cols, answerMode }: ArrayChoice): number | string {
  return answerMode === "equation" ? `${rows} × ${cols}` : rows * cols;
}

export function arrayOptions(choice: ArrayChoice): Option[] {
  const { rows, cols, answerMode } = choice;
  const correct = arrayAnswer(choice);
  const values: Array<number | string> = answerMode === "equation"
    ? [correct, `${cols} × ${rows}`, `${rows} + ${cols}`]
    : [correct, rows * cols + rows, Math.max(1, rows * cols - cols)];
  return [...new Set(values)].map(value => ({ label: String(value), value }));
}

export function fitsArrayDimension(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 10;
}
