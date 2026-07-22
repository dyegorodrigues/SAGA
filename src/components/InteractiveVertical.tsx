import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types';
import { C, FONT, sfx } from './Mascot';

export function InteractiveVertical({ q, onAnswer, disabled }: { q: Question; onAnswer: (val: any) => void; disabled: boolean }) {
  const top = q.vTop ?? 0;
  const bot = q.vBot ?? 0;
  const op = q.vOp ?? "+";
  
  const topStr = String(top);
  const botStr = String(bot);
  
  const maxLen = Math.max(topStr.length, botStr.length);
  const totalCols = maxLen;
  
  // States:
  // We process column by column, from right to left (index 0 is rightmost, maxLen - 1 is leftmost)
  const [colIdx, setColIdx] = useState(0); 
  const [answers, setAnswers] = useState<string[]>(Array(totalCols + 1).fill('')); // +1 for possible extra carry col
  const [carries, setCarries] = useState<string[]>(Array(totalCols + 1).fill(''));
  const [currentInput, setCurrentInput] = useState('');
  
  // Calculate expected sums per column
  // (We'll do this dynamically because carry propagates)
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

  const handlePad = (num: number) => {
    if (disabled) return;
    const expected = getExpectedCol(colIdx);
    
    // For subtraction with borrowing, it's more complex, let's just handle addition for now:
    const expectedStr = String(expected);
    const nextInput = currentInput + num;
    
    if (expectedStr === nextInput) {
      // Correct for this column!
      sfx.tick();
      
      if (op === "+") {
        const hasCarry = expected >= 10;
        const digit = expected % 10;
        const carry = Math.floor(expected / 10);
        
        const newAns = [...answers];
        newAns[colIdx] = String(digit);
        
        const newCarries = [...carries];
        if (hasCarry) {
          newCarries[colIdx + 1] = String(carry);
        }
        
        setAnswers(newAns);
        setCarries(newCarries);
        setCurrentInput('');
        
        if (colIdx + 1 >= totalCols && !hasCarry) {
          // Finished!
          const finalStr = [...newAns].reverse().join('').replace(/^0+/, '') || '0';
          onAnswer(parseInt(finalStr, 10));
        } else {
          setColIdx(colIdx + 1);
        }
      }
    } else if (expectedStr.startsWith(nextInput)) {
      // Keep going (e.g. they typed '1' and expected is '12')
      setCurrentInput(nextInput);
      sfx.tick();
    } else {
      // Wrong!
      sfx.wrong();
      setCurrentInput('');
      onAnswer(-1); // Report wrong to game loop
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-end font-mono text-5xl font-black tracking-[0.4em] text-slate-700 bg-white px-8 py-6 rounded-2xl shadow-inner select-none relative mb-6">
        
        {/* Carries */}
        <div className="flex h-8 mb-2 text-2xl text-orange-500">
          {carries.slice().reverse().map((c, i) => (
            <span key={`c${i}`} className="w-12 text-center">{c}</span>
          ))}
        </div>

        <div className="flex">
          {String(top).padStart(totalCols + 1, ' ').split('').map((c, i) => (
            <span key={`t${i}`} className="w-12 text-center">{c}</span>
          ))}
        </div>
        
        <div className="flex relative border-b-4 border-slate-700 pb-2 mb-2">
          <span className="absolute -left-8 text-indigo-500">{op}</span>
          {String(bot).padStart(totalCols + 1, ' ').split('').map((c, i) => (
            <span key={`b${i}`} className="w-12 text-center">{c}</span>
          ))}
        </div>
        
        {/* Answer Area */}
        <div className="flex h-12 text-indigo-600 relative">
          {answers.slice().reverse().map((c, i) => {
            const actualIndex = answers.length - 1 - i;
            const isActive = actualIndex === colIdx;
            return (
              <span key={`a${i}`} className="w-12 text-center relative">
                {isActive ? (currentInput || '?') : c}
                {isActive && (
                  <motion.div 
                    layoutId="col-highlight"
                    className="absolute inset-0 border-b-4 border-indigo-400 rounded bg-indigo-50 opacity-50 -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                  />
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Numpad */}
      <div className="grid grid-cols-5 gap-2 max-w-md w-full">
        {[1,2,3,4,5,6,7,8,9,0].map(n => (
          <button
            key={n}
            disabled={disabled}
            onClick={() => handlePad(n)}
            className="bg-indigo-50 border-b-4 border-indigo-200 text-indigo-700 font-extrabold text-3xl py-4 rounded-xl active:translate-y-1 active:border-b-0 transition-all"
            style={{ fontFamily: FONT }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
