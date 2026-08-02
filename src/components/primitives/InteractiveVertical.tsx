import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnswerMeta, Question } from '../../types';
import { tokens, UIState } from '../../styles/tokens';
import { getVerticalColumnStep, inferVerticalMisconception, verticalAnswerFromColumns, verticalDigitChoices } from './verticalProcedure';

interface InteractiveVerticalProps {
  q: Question;
  onAnswer: (val: number) => void;
  onMistake?: (digit: number, meta: AnswerMeta) => void;
  onRegroup?: (remainingUnits: number) => void;
  showAlgorithm?: boolean;
  disabled: boolean;
  state?: UIState;
}

export function InteractiveVertical({ q, onAnswer, onMistake, onRegroup, showAlgorithm = true, disabled, state = 'ocioso' }: InteractiveVerticalProps) {
  const top = q.vTop ?? 0;
  const bot = q.vBot ?? 0;
  const op = q.vOp ?? "+";

  const topStr = String(top);
  const botStr = String(bot);

  const maxLen = Math.max(topStr.length, botStr.length);
  const totalCols = maxLen;

  const [colIdx, setColIdx] = useState(0); 
  const [answers, setAnswers] = useState<string[]>(Array(totalCols + 1).fill('')); 
  const [carries, setCarries] = useState<string[]>(Array(totalCols + 1).fill(''));
  const [currentInput, setCurrentInput] = useState('');

  const step = getVerticalColumnStep(top, bot, op, colIdx);

  const handleConfirm = (input = currentInput) => {
    if (disabled || input === '') return;
    
    if (parseInt(input, 10) === step.expectedDigit) {
      const newAnswers = [...answers];
      newAnswers[colIdx] = input;
      setAnswers(newAnswers);
      
      if (step.carry && op === "+") {
        const newCarries = [...carries];
        newCarries[colIdx + 1] = '1';
        setCarries(newCarries);
        if (colIdx === 0) onRegroup?.(step.expectedDigit);
      } else if (step.borrow && op === "-") {
        const newCarries = [...carries];
        newCarries[colIdx + 1] = '-1';
        setCarries(newCarries);
      }

      setCurrentInput('');
      
      if (colIdx === totalCols - 1) {
        if (step.carry && op === "+") {
          setColIdx(colIdx + 1);
        } else {
          onAnswer(verticalAnswerFromColumns(newAnswers));
        }
      } else if (colIdx === totalCols) {
        onAnswer(verticalAnswerFromColumns(newAnswers));
      } else {
        setColIdx(colIdx + 1);
      }
    } else {
      setCurrentInput('');
      const selectedDigit = parseInt(input, 10);
      onMistake?.(selectedDigit, {
        source: "vertical-column",
        columnIndex: colIdx,
        misconception: inferVerticalMisconception(top, bot, op, colIdx, selectedDigit),
      });
    }
  };

  const digitChoices = verticalDigitChoices(step.expectedDigit, top + bot + colIdx);

  return (
    <div className={`flex flex-col items-center select-none ${tokens.estado[state]}`}>
      {showAlgorithm && <div
        className="font-mono text-4xl sm:text-5xl font-black tracking-[0.2em] p-3 sm:p-5 rounded-2xl shadow-inner relative"
        style={{ 
          backgroundColor: tokens.cor.superficie.cartao,
          color: tokens.cor.texto.principal,
          borderColor: tokens.cor.elementos.borda,
          borderWidth: 1
        }}
      >
        <div className="flex absolute -top-4 left-0 right-0 justify-end pr-6">
          {Array.from({ length: totalCols + 1 }).map((_, i) => {
            const power = totalCols - i;
            const c = carries[power];
            return <span key={`c${i}`} className="w-12 text-center text-xl" style={{ color: tokens.cor.elementos.base_B }}>
              {c === '-1' ? '−1' : c === '1' ? '+1' : ''}
            </span>;
          })}
        </div>

        <div className="flex justify-end pr-6">
          {Array.from({ length: totalCols + 1 }).map((_, i) => {
            const charIdx = i - 1;
            const char = topStr.padStart(totalCols, ' ')[charIdx];
            return <span key={`t${i}`} className="w-12 text-center">{char || ' '}</span>;
          })}
        </div>
        
        <div 
          className="flex relative border-b-4 pb-2 mb-2 justify-end pr-6"
          style={{ borderColor: tokens.cor.texto.principal }}
        >
          <span 
            className="absolute left-4" 
            style={{ color: tokens.cor.elementos.base_A }}
          >
            {op}
          </span>
          {Array.from({ length: totalCols + 1 }).map((_, i) => {
            const charIdx = i - 1;
            const char = botStr.padStart(totalCols, ' ')[charIdx];
            return <span key={`b${i}`} className="w-12 text-center">{char || ' '}</span>;
          })}
        </div>
        
        <div className="flex h-14 justify-end pr-6 relative">
          {Array.from({ length: totalCols + 1 }).map((_, i) => {
            const power = totalCols - i;
            const c = answers[power];
            const isActiveCol = colIdx === power;
            return (
              <span key={`a${i}`} className="w-12 text-center relative">
                {isActiveCol ? (
                  <span style={{ color: tokens.cor.elementos.base_A }}>
                    {currentInput}<span className="animate-pulse">_</span>
                  </span>
                ) : (
                  <span style={{ color: tokens.cor.texto.principal }}>{c}</span>
                )}
              </span>
            );
          })}
        </div>
      </div>}

      {!disabled && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3" aria-label="Escolha o algarismo desta coluna">
          {digitChoices.map(n => (
            <button
              key={n}
              onClick={() => handleConfirm(String(n))}
              className="w-20 h-20 rounded-2xl text-2xl font-bold shadow-sm active:scale-95 transition-transform"
              style={{ 
                backgroundColor: tokens.cor.superficie.fundo,
                color: tokens.cor.texto.principal,
                borderColor: tokens.cor.elementos.borda,
                borderWidth: 2
              }}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
