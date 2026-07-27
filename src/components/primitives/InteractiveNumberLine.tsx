import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Question } from '../../types';
import { tokens, UIState } from '../../styles/tokens';

export function InteractiveNumberLine({ q, start: _start, end: _end, startPos: _startPos, emoji: _emoji, onAnswer, disabled, state = 'ocioso' }: { q?: any; start?: number; end?: number; startPos?: number; emoji?: string; onAnswer: (val: any) => void; disabled: boolean; state?: UIState }) {
  const start = _start ?? q?.nlStart ?? 0;
  const end = _end ?? q?.nlEnd ?? 10;
  const length = end - start;
  const stepWidth = 100 / (length || 1);
  const sp = _startPos ?? q?.nlStartPos;
  const [pos, setPos] = useState((sp !== undefined ? sp - start : 0));
  
  useEffect(() => {
    setPos(sp !== undefined ? sp - start : 0);
  }, [q, start, sp]);
  
  const lineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateFromClientX = (clientX: number) => {
    if (disabled || !lineRef.current) return;
    const rect = lineRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let pct = (x / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    const step = Math.round(pct / stepWidth);
    setPos(step);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleClick = (step: number) => {
    if (disabled) return;
    setPos(step);
  };

  return (
    <div className={`w-full py-12 px-8 select-none ${tokens.estado[state]}`}>
      <div 
        className="relative w-full h-4 touch-none cursor-pointer" 
        ref={lineRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Track */}
        <div 
           className="absolute inset-0 rounded-full pointer-events-none" 
           style={{ backgroundColor: tokens.cor.elementos.borda }}
        />
        
        {/* Ticks */}
        {Array.from({ length: length + 1 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 w-1 h-8 pointer-events-none"
            style={{ 
               left: `${i * stepWidth}%`, 
               transform: 'translateX(-50%)',
              backgroundColor: tokens.cor.texto.secundario
            }}
          >
            <span 
              className="absolute top-10 left-1/2 -translate-x-1/2 font-bold text-xl pointer-events-none"
              style={{ color: tokens.cor.texto.principal }}
            >
              {start + i}
            </span>
          </div>
        ))}
        
        {/* Draggable Thumb */}
        <motion.div
          animate={{ left: `${pos * stepWidth}%` }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white font-bold pointer-events-none"
          style={{            
            backgroundColor: tokens.cor.elementos.base_A,
            zIndex: 10
          }}
        >
          {_emoji ?? q?.emoji ?? "🐸"}
        </motion.div>
      </div>

      {!disabled && (
        <div className="mt-20 flex justify-center">
          <button
            onClick={() => onAnswer(start + pos)}
            className={`px-8 py-3 rounded-full text-xl font-black shadow-md hover:scale-105 active:scale-95 transition-all ${tokens.cor.acao.primaria}`}
            style={{ 
              color: 'white'
            }}
          >
            CONFIRMAR {start + pos}
          </button>
        </div>
      )}
    </div>
  );
}
