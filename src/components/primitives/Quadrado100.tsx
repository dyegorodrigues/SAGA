import React, { useState } from 'react';
import { motion } from 'motion/react';
import { tokens, UIState } from '../../styles/tokens';

interface Quadrado100Props {
  highlightedNumbers?: number[];
  interactive?: boolean;
  onNumberClick?: (n: number) => void;
  targetNumber?: number | null;
  state?: UIState;
}

export function Quadrado100({ highlightedNumbers = [], interactive = false, onNumberClick, targetNumber = null, state = 'ocioso' }: Quadrado100Props) {
  const [selected, setSelected] = useState<number[]>([]);

  const handleToggle = (n: number) => {
    if (!interactive) return;
    setSelected((prev) => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]);
    if (onNumberClick) onNumberClick(n);
  };

  return (
    <div className={`w-full max-w-lg mx-auto flex justify-center p-2 select-none ${tokens.estado[state]}`}>
      <div 
        className="grid grid-cols-10 gap-0.5 p-1 rounded-lg shadow-sm"
        style={{ backgroundColor: tokens.cor.elementos.borda }}
      >
        {Array.from({ length: 100 }).map((_, i) => {
          const n = i + 1;
          const isHighlighted = highlightedNumbers.includes(n);
          const isSelected = selected.includes(n);
          const isTarget = targetNumber === n;
          
          let bgColor = tokens.cor.superficie.cartao;
          let textColor = tokens.cor.texto.principal;
          
          if (isSelected) {
            bgColor = tokens.cor.acao.primaria;
            textColor = tokens.cor.texto.inverso;
          } else if (isHighlighted) {
            bgColor = tokens.cor.elementos.marcador;
          } else if (isTarget) {
            bgColor = tokens.cor.feedback.acerto;
            textColor = tokens.cor.texto.inverso;
          }

          return (
            <motion.div
              key={n}
              whileTap={interactive ? { scale: 0.9 } : undefined}
              onClick={() => handleToggle(n)}
              className={`flex items-center justify-center font-bold text-sm sm:text-base ${interactive ? 'cursor-pointer' : ''}`}
              style={{
                width: '100%',
                aspectRatio: '1/1',
                minWidth: '24px',
                backgroundColor: bgColor,
                color: textColor,
                borderRadius: '4px',
                transition: tokens.animacao.rapida
              }}
            >
              {n}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
