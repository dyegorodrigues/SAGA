import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Question } from '../types';
import { C } from './Mascot';

export function ArrayGrid({ q }: { q: Question }) {
  // q.a = rows, q.b = cols
  const rows = q.a ?? 3;
  const cols = q.b ?? 4;
  const rotate = q.nlEnd === 1; // Hack: use nlEnd to signal rotation mode if needed
  
  const [rotated, setRotated] = useState(false);
  
  const actualRows = rotated ? cols : rows;
  const actualCols = rotated ? rows : cols;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {rotate && (
        <button 
          onClick={() => setRotated(!rotated)}
          className="mb-4 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold shadow-sm active:scale-95"
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
            className="w-10 h-10 rounded-lg shadow-sm flex items-center justify-center text-2xl"
            style={{ background: q.emoji ? 'transparent' : C.ocean }}
          >
            {q.emoji || ''}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
