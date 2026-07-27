import React, { useState } from 'react';
import { motion } from 'motion/react';
import { tokens } from '../../styles/tokens';

export interface SentenceBuilderProps {
  expected: string[]; // e.g. ["5", "-", "2", "=", "3"]
  pieces: string[]; // e.g. ["1", "2", "3", "4", "5", "-", "="]
  onComplete?: (sentence: string[]) => void;
  disabled?: boolean;
}

export function SentenceBuilder({ expected, pieces, onComplete, disabled }: SentenceBuilderProps) {
  const [slots, setSlots] = useState<string[]>(Array(expected.length).fill(null));

  const handlePieceClick = (piece: string) => {
    if (disabled) return;
    const firstEmpty = slots.indexOf(null as unknown as string);
    if (firstEmpty !== -1) {
      const newSlots = [...slots];
      newSlots[firstEmpty] = piece;
      setSlots(newSlots);
      
      if (newSlots.every(s => s !== null) && onComplete) {
        onComplete(newSlots);
      }
    }
  };

  const handleSlotClick = (idx: number) => {
    if (disabled || slots[idx] === null) return;
    const newSlots = [...slots];
    newSlots[idx] = null as unknown as string;
    setSlots(newSlots);
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-2xl mx-auto py-4">
      {/* Slots */}
      <div className="flex flex-wrap justify-center gap-3">
        {slots.map((s, i) => (
          <motion.div
            key={`slot-${i}`}
            onClick={() => handleSlotClick(i)}
            className="w-16 h-20 rounded-xl flex items-center justify-center font-black text-4xl cursor-pointer"
            style={{
              backgroundColor: s ? tokens.cor.superficie.fundo : tokens.cor.superficie.cartao,
              border: `3px ${s ? 'solid' : 'dashed'} ${tokens.cor.elementos.borda}`,
              color: tokens.cor.texto.principal
            }}
          >
            {s || ""}
          </motion.div>
        ))}
      </div>

      {/* Banco de peças */}
      <div 
        className="flex flex-wrap justify-center gap-3 p-6 rounded-3xl w-full"
        style={{ backgroundColor: tokens.cor.elementos.preenchimento, border: `2px solid ${tokens.cor.elementos.borda}` }}
      >
        {pieces.map((p, i) => (
          <motion.button
            key={`piece-${i}`}
            whileHover={disabled ? {} : { scale: 1.1, y: -4 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            onClick={() => handlePieceClick(p)}
            disabled={disabled}
            className="w-16 h-16 rounded-xl flex items-center justify-center font-black text-3xl shadow-sm"
            style={{
              backgroundColor: tokens.cor.superficie.fundo,
              color: tokens.cor.texto.principal,
              border: `2px solid ${tokens.cor.elementos.borda}`
            }}
          >
            {p}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
