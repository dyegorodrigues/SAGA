import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'motion/react';
import { Question } from '../types';
import { C } from './Mascot';

export function DragGroup({ q, onAnswer, disabled }: { q: Question; onAnswer: (val: any) => void; disabled: boolean }) {
  // q.dividend: total items
  // q.divisor: number of boxes
  // q.emoji: item emoji
  
  const [itemsLeft, setItemsLeft] = useState(q.dividend ?? 0);
  const [boxes, setBoxes] = useState<number[]>(Array(q.divisor ?? 2).fill(0));

  const reset = () => {
    setItemsLeft(q.dividend ?? 0);
    setBoxes(Array(q.divisor ?? 2).fill(0));
  };

  useEffect(() => {
    reset();
  }, [q]);

  const handleBoxClick = (i: number) => {
    if (disabled) return;
    if (itemsLeft > 0) {
      setItemsLeft(l => l - 1);
      setBoxes(b => {
        const nb = [...b];
        nb[i]++;
        return nb;
      });
    } else if (boxes[i] > 0) {
      // return item
      setItemsLeft(l => l + 1);
      setBoxes(b => {
        const nb = [...b];
        nb[i]--;
        return nb;
      });
    }
  };

  useEffect(() => {
    if (itemsLeft === 0 && !disabled) {
      // check if all boxes have the same amount
      const allEqual = boxes.every(v => v === boxes[0]);
      if (allEqual) {
        // Correct answer is the quotient
        onAnswer(boxes[0]);
      }
    }
  }, [itemsLeft, boxes, disabled, onAnswer]);

  return (
    <div className="w-full flex flex-col items-center gap-6 mt-4 select-none">
      <div className="flex flex-wrap gap-2 justify-center min-h-[60px] p-4 bg-slate-100 rounded-2xl w-full border-2 border-dashed border-slate-300">
        {Array.from({ length: itemsLeft }).map((_, i) => (
          <motion.div
            key={`left-${i}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-3xl cursor-pointer hover:scale-110 active:scale-95 transition-transform"
          >
            {q.emoji || "🍎"}
          </motion.div>
        ))}
        {itemsLeft === 0 && (
          <div className="text-slate-400 font-bold w-full text-center">Nenhum sobrando!</div>
        )}
      </div>

      <div className="flex justify-center gap-4 w-full flex-wrap">
        {boxes.map((count, i) => (
          <div 
            key={`box-${i}`}
            onClick={() => handleBoxClick(i)}
            className="flex-1 min-w-[80px] min-h-[100px] bg-white border-[3px] border-amber-300 rounded-xl flex flex-wrap content-start p-2 gap-1 cursor-pointer hover:border-amber-400 transition-colors shadow-sm"
          >
            {Array.from({ length: count }).map((_, j) => (
              <motion.div
                key={`box-${i}-${j}`}
                layout
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-2xl"
              >
                {q.emoji || "🍎"}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
      
      {!disabled && (
        <div className="text-slate-400 text-sm font-medium">
          Toque nas caixas para guardar!
        </div>
      )}
    </div>
  );
}
