import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Question } from '../../types';
import { tokens, UIState } from '../../styles/tokens';

export function ArrayGrid({ q, state = 'ocioso' }: { q: Question; state?: UIState }) {
  const rows = q.a ?? 3;
  const cols = q.b ?? 4;
  const rotate = q.nlEnd === 1;

  const [rotated, setRotated] = useState(false);
  const actualRows = rotated ? cols : rows;
  const actualCols = rotated ? rows : cols;

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${tokens.estado[state]}`}>
      {rotate && (
        <button 
          onClick={() => setRotated(!rotated)}
          className="mb-4 px-4 py-2 rounded-full font-bold shadow-sm active:scale-95"
          style={{ 
            backgroundColor: tokens.cor.superficie.destaque,
            color: tokens.cor.texto.principal,
            borderColor: tokens.cor.elementos.borda,
            borderWidth: 1
          }}
        >
          🔄 Girar
        </button>
      )}
      <motion.div 
        layout
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${actualCols}, minmax(0, 1fr))`
        }}
      >
        {Array.from({ length: actualRows * actualCols }).map((_, i) => (
          <motion.div
            layout
            key={i}
            className="rounded-lg shadow-sm flex items-center justify-center text-2xl"
            style={{ 
              width: tokens.tamanho.base, 
              height: tokens.tamanho.base,
              backgroundColor: q.emoji ? 'transparent' : tokens.cor.elementos.base_A 
            }}
          >
            {q.emoji || ''}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
