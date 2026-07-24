import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Question } from '../../types';
import { tokens, UIState } from '../../styles/tokens';

export function InteractiveNumberLine({ q, onAnswer, disabled, state = 'ocioso' }: { q: Question; onAnswer: (val: any) => void; disabled: boolean; state?: UIState }) {
  const start = q.nlStart ?? 0;
  const end = q.nlEnd ?? 10;
  const length = end - start;
  const stepWidth = 100 / (length || 1);

  const [pos, setPos] = useState((q.nlStartPos !== undefined ? q.nlStartPos - start : 0));
  
  useEffect(() => {
    setPos(q.nlStartPos !== undefined ? q.nlStartPos - start : 0);
  }, [q, start]);
  
  const lineRef = useRef<HTMLDivElement>(null);
  
  const handleDragEnd = (e: any, info: any) => {
    if (disabled) return;
    if (!lineRef.current) return;
    const rect = lineRef.current.getBoundingClientRect();
    const x = info.point.x - rect.left;
    let pct = (x / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    const step = Math.round(pct / stepWidth);
    setPos(step);
  };
  
  const handleClick = (step: number) => {
    if (disabled) return;
    setPos(step);
  };

  return (
    <div className={`w-full py-12 px-8 select-none ${tokens.estado[state]}`}>
      <div className="relative w-full h-4" ref={lineRef}>
        {/* Track */}
        <div 
          className="absolute inset-0 rounded-full" 
          style={{ backgroundColor: tokens.cor.elementos.borda }}
        />
        
        {/* Ticks */}
        {Array.from({ length: length + 1 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 w-1 h-8 cursor-pointer"
            style={{ 
              left: `${i * stepWidth}%`, 
              transform: 'translateX(-50%)',
              backgroundColor: tokens.cor.texto.secundario
            }}
            onClick={() => handleClick(i)}
          >
            <span 
              className="absolute top-10 left-1/2 -translate-x-1/2 font-bold text-xl"
              style={{ color: tokens.cor.texto.principal }}
            >
              {start + i}
            </span>
          </div>
        ))}
        
        {/* Draggable Thumb */}
        <motion.div
          drag={disabled ? false : "x"}
          dragConstraints={lineRef}
          dragElastic={0}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          animate={{ x: `${pos * stepWidth}%` }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-bold"
          style={{
            left: 0,
            backgroundColor: tokens.cor.elementos.base_A,
            zIndex: 10
          }}
        >
          {q.emoji || "🐸"}
        </motion.div>
      </div>

      {!disabled && (
        <div className="mt-20 flex justify-center">
          <button
            onClick={() => onAnswer(start + pos)}
            className={`px-8 py-3 rounded-full text-xl font-black shadow-md hover:scale-105 active:scale-95 transition-all ${tokens.cor.acao.primaria}`}
            style={{ 
              backgroundColor: tokens.cor.acao.primaria.split(' ')[0], // fallback handling
              color: 'white'
            }}
            // Note: We use the inline utility classes directly for action buttons, but since we are extracting primitives,
            // we should ideally use the class. Wait, we defined the tokens as Tailwind classes. Let's just use `className={tokens.cor.acao.primaria}`
          >
            CONFIRMAR {start + pos}
          </button>
        </div>
      )}
    </div>
  );
}
