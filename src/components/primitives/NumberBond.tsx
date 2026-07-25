import React from 'react';
import { motion } from 'motion/react';
import { tokens, UIState } from '../../styles/tokens';

export interface NumberBondProps {
  whole: number | '?' | null;
  part1: number | '?' | null;
  part2: number | '?' | null;
  interactivePart?: 'whole' | 'part1' | 'part2' | null;
  onCircleClick?: (part: 'whole' | 'part1' | 'part2') => void;
  state?: UIState;
}

export function NumberBond({
  whole,
  part1,
  part2,
  interactivePart = null,
  onCircleClick,
  state = 'ocioso'
}: NumberBondProps) {
  
  const renderCircle = (value: number | '?' | null, type: 'whole' | 'part1' | 'part2', size: number) => {
    const isInteractive = interactivePart === type;
    
    return (
      <motion.div
        whileHover={isInteractive ? { scale: 1.05 } : undefined}
        whileTap={isInteractive ? { scale: 0.95 } : undefined}
        onClick={() => isInteractive && onCircleClick && onCircleClick(type)}
        className={`flex items-center justify-center rounded-full font-black shadow-sm ${isInteractive ? 'cursor-pointer ring-4 ring-blue-300' : ''}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: value === '?' ? tokens.cor.elementos.preenchimento : tokens.cor.superficie.cartao,
          border: `4px solid ${type === 'whole' ? tokens.cor.elementos.base_A : tokens.cor.elementos.base_B}`,
          fontSize: size > 80 ? '36px' : '28px',
          color: value === '?' ? tokens.cor.texto.secundario : tokens.cor.texto.principal,
          zIndex: 10
        }}
      >
        {value !== null ? value : ''}
      </motion.div>
    );
  };

  return (
    <div className={`relative flex flex-col items-center justify-center w-full max-w-[300px] mx-auto py-4 select-none ${tokens.estado[state]}`}>
      {/* Todo (Whole) */}
      <div className="relative z-10 mb-12">
        {renderCircle(whole, 'whole', 100)}
      </div>

      {/* Connecting Lines */}
      <div className="absolute top-[80px] w-full h-[80px] pointer-events-none z-0">
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <line x1="50%" y1="0" x2="25%" y2="100%" stroke={tokens.cor.elementos.borda} strokeWidth="6" />
          <line x1="50%" y1="0" x2="75%" y2="100%" stroke={tokens.cor.elementos.borda} strokeWidth="6" />
        </svg>
      </div>

      {/* Partes (Parts) */}
      <div className="relative z-10 flex justify-between w-full px-4">
        {renderCircle(part1, 'part1', 80)}
        {renderCircle(part2, 'part2', 80)}
      </div>
    </div>
  );
}
