import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Question } from '../../types';
import { tokens, UIState } from '../../styles/tokens';

export function DragGroup({ q, onAnswer, disabled, state = 'ocioso' }: { q: Question; onAnswer: (val: any) => void; disabled: boolean; state?: UIState }) {
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
      const allEqual = boxes.every(v => v === boxes[0]);
      if (allEqual) {
        onAnswer(boxes[0]);
      }
    }
  }, [itemsLeft, boxes, disabled, onAnswer]);

  return (
    <div className={`w-full flex flex-col items-center gap-6 mt-4 select-none ${tokens.estado[state]}`}>
      <div 
        className="flex flex-wrap gap-2 justify-center min-h-[60px] p-4 w-full border-dashed"
        style={{
          backgroundColor: tokens.cor.elementos.preenchimento,
          borderRadius: '16px',
          borderColor: tokens.cor.elementos.borda,
          borderWidth: 2
        }}
      >
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
          <div className="font-bold w-full text-center" style={{ color: tokens.cor.texto.secundario }}>Nenhum sobrando!</div>
        )}
      </div>

      <div className="flex justify-center gap-4 w-full flex-wrap">
        {boxes.map((count, i) => (
          <div 
            key={`box-${i}`}
            onClick={() => handleBoxClick(i)}
            className="flex-1 flex flex-wrap content-start p-2 gap-1 cursor-pointer transition-colors shadow-sm hover:brightness-95"
            style={{
              minWidth: tokens.tamanho.alvo,
              minHeight: '100px',
              backgroundColor: tokens.cor.superficie.cartao,
              borderColor: tokens.cor.elementos.marcador,
              borderWidth: 3,
              borderRadius: '12px'
            }}
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
        <div className="text-sm font-medium" style={{ color: tokens.cor.texto.secundario }}>
          Toque nas caixas para guardar!
        </div>
      )}
    </div>
  );
}
