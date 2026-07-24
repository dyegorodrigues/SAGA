import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../../types';
import { tokens, UIState } from '../../styles/tokens';

export function InteractiveVertical({ q, onAnswer, disabled, state = 'ocioso' }: { q: Question; onAnswer: (val: any) => void; disabled: boolean; state?: UIState }) {
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

  const getExpectedCol = (cIdx: number) => {
    let tCarry = 0;
    for (let i = 0; i <= cIdx; i++) {
      const pTop = parseInt(topStr[topStr.length - 1 - i] || '0', 10);
      const pBot = parseInt(botStr[botStr.length - 1 - i] || '0', 10);
      let sum = pTop + tCarry;
      if (op === "+") sum += pBot;
      else sum -= pBot;
      
      if (i === cIdx) return sum;
      
      if (op === "+") {
        tCarry = sum >= 10 ? 1 : 0;
      } else {
        tCarry = sum < 0 ? -1 : 0;
      }
    }
    return 0;
  };

  const expected = getExpectedCol(colIdx);
  const expectCarry = expected >= 10;
  const expectBorrow = expected < 0;

  const handleNum = (n: number) => {
    if (disabled) return;
    setCurrentInput(prev => (prev.length < 2 ? prev + n : prev));
  };

  const handleBackspace = () => {
    if (disabled) return;
    setCurrentInput(prev => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    if (disabled || !currentInput) return;
    
    let expectedVal = expected;
    if (op === "+") {
      expectedVal = expected % 10;
    } else {
      if (expectBorrow) expectedVal = expected + 10;
    }

    if (parseInt(currentInput, 10) === expectedVal) {
      const newAnswers = [...answers];
      newAnswers[totalCols - 1 - colIdx] = currentInput;
      setAnswers(newAnswers);
      
      if (expectCarry && op === "+") {
        const newCarries = [...carries];
        newCarries[totalCols - 1 - colIdx - 1] = '1';
        setCarries(newCarries);
      } else if (expectBorrow && op === "-") {
        const newCarries = [...carries];
        newCarries[totalCols - 1 - colIdx - 1] = '-1';
        setCarries(newCarries);
      }

      setCurrentInput('');
      
      if (colIdx === totalCols - 1) {
        if (expectCarry && op === "+") {
          setColIdx(colIdx + 1);
        } else {
          onAnswer(parseInt(newAnswers.join(''), 10));
        }
      } else if (colIdx === totalCols) {
        onAnswer(parseInt(newAnswers.join(''), 10));
      } else {
        setColIdx(colIdx + 1);
      }
    } else {
      // Wrong
      setCurrentInput('');
    }
  };

  return (
    <div className={`flex flex-col items-center select-none ${tokens.estado[state]}`}>
      <div 
        className="font-mono text-5xl font-black tracking-[0.3em] p-6 rounded-2xl shadow-inner relative"
        style={{ 
          backgroundColor: tokens.cor.superficie.cartao,
          color: tokens.cor.texto.principal,
          borderColor: tokens.cor.elementos.borda,
          borderWidth: 1
        }}
      >
        <div className="flex absolute -top-4 left-0 right-0 justify-end pr-6">
          {carries.map((c, i) => (
            <span key={`c${i}`} className="w-12 text-center text-xl" style={{ color: tokens.cor.elementos.base_B }}>
              {c === '-1' ? '−1' : c === '1' ? '+1' : ''}
            </span>
          ))}
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
          {answers.map((c, i) => {
            const isActiveCol = (totalCols - 1 - colIdx === i) || (colIdx === totalCols && i === 0);
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
      </div>

      {!disabled && (
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button
              key={n}
              onClick={() => handleNum(n)}
              className="w-16 h-16 rounded-2xl text-2xl font-bold shadow-sm active:scale-95 transition-transform"
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
          <button
            onClick={handleBackspace}
            className="w-16 h-16 rounded-2xl text-xl font-bold shadow-sm active:scale-95 transition-transform flex items-center justify-center"
            style={{ 
              backgroundColor: tokens.cor.superficie.fundo,
              color: tokens.cor.elementos.base_B,
              borderColor: tokens.cor.elementos.borda,
              borderWidth: 2
            }}
          >
            ⌫
          </button>
          <button
            onClick={() => handleNum(0)}
            className="w-16 h-16 rounded-2xl text-2xl font-bold shadow-sm active:scale-95 transition-transform"
            style={{ 
              backgroundColor: tokens.cor.superficie.fundo,
              color: tokens.cor.texto.principal,
              borderColor: tokens.cor.elementos.borda,
              borderWidth: 2
            }}
          >
            0
          </button>
          <button
            onClick={handleConfirm}
            className="w-16 h-16 rounded-2xl text-2xl font-bold shadow-sm active:scale-95 transition-transform"
            style={{ 
              backgroundColor: tokens.cor.feedback.acerto.split(' ')[0],
              color: 'white'
            }}
          >
            ✓
          </button>
        </div>
      )}
    </div>
  );
}
