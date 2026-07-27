import React from 'react';
import { motion } from 'motion/react';
import { tokens } from '../../styles/tokens';

export interface GrupoProps {
  items: React.ReactNode[];
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export function Grupo({ items, onClick, selected, disabled }: GrupoProps) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative flex flex-wrap items-center justify-center p-6 min-h-[160px] min-w-[160px] rounded-3xl transition-colors ${selected ? 'ring-4 ring-offset-4 ring-blue-500' : ''}`}
      style={{
        backgroundColor: tokens.cor.elementos.preenchimento,
        border: `2px solid ${tokens.cor.elementos.borda}`,
        cursor: disabled ? 'default' : 'pointer'
      }}
    >
      {items.map((item, i) => (
        <div key={i} className="m-2">
          {item}
        </div>
      ))}
    </motion.button>
  );
}
