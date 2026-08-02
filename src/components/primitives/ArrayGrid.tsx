import React, { useState } from "react";
import { motion } from "motion/react";
import { AnswerMeta, Question } from "../../types";

interface Props {
  question: Question;
  onAnswer: (value: unknown, meta?: AnswerMeta) => void;
  disabled?: boolean;
}

export function ArrayGrid({ question, onAnswer, disabled = false }: Props) {
  const { rows, cols, allowRotate, requireRotate, areaMode, showEquation } = question.uiProps;
  const [rotated, setRotated] = useState(false);
  const [unavailable, setUnavailable] = useState<Set<unknown>>(new Set());
  const actualRows = rotated ? cols : rows;
  const actualCols = rotated ? rows : cols;
  const cell = Math.min(44, Math.floor(300 / Math.max(actualRows, actualCols)));

  const choose = (value: unknown) => {
    if (disabled || unavailable.has(value) || (requireRotate && !rotated)) return;
    if (!question.evaluate?.(value)) setUnavailable(current => new Set(current).add(value));
    onAnswer(value, { source: "array-grid" });
  };

  return <div className="flex flex-col items-center gap-3">
    {allowRotate && <button type="button" onClick={() => setRotated(value => !value)} disabled={disabled}
      className="min-h-12 rounded-full border-2 border-indigo-300 bg-indigo-50 px-6 font-black text-indigo-800">
      🔄 Girar o arranjo
    </button>}
    <motion.div layout aria-label={`${actualRows} linhas e ${actualCols} colunas`}
      className={`grid overflow-hidden ${areaMode ? "gap-0 border-2 border-indigo-700" : "gap-1.5"}`}
      style={{ gridTemplateColumns: `repeat(${actualCols}, ${cell}px)` }}>
      {Array.from({ length: actualRows * actualCols }, (_, index) =>
        <motion.div layout key={index} aria-hidden="true" className={areaMode ? "border border-indigo-500 bg-indigo-200" : "rounded-md bg-indigo-400"}
          style={{ width: cell, height: cell }} />)}
    </motion.div>
    {showEquation && <p className="text-2xl font-black text-slate-800">{actualRows} linhas × {actualCols} colunas = ?</p>}
    {requireRotate && !rotated && <p className="font-bold text-indigo-700">Gire primeiro para descobrir outro jeito.</p>}
    <div className="grid grid-cols-2 gap-3" aria-label="Alternativas do arranjo">
      {question.options?.map(option => {
        const blocked = unavailable.has(option.value);
        return <button key={String(option.value)} type="button" onClick={() => choose(option.value)}
          disabled={disabled || blocked || (requireRotate && !rotated)}
          className="min-h-20 min-w-20 rounded-2xl border-2 border-indigo-300 bg-white px-4 text-xl font-black disabled:cursor-not-allowed disabled:opacity-35">
          {option.label ?? String(option.value)}
        </button>;
      })}
    </div>
  </div>;
}
