import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { tokens, UIState } from '../../styles/tokens';

interface TraceCanvasProps {
  targetNumeral: number | string;
  onComplete?: () => void;
  state?: UIState;
}

export function TraceCanvas({ targetNumeral, onComplete, state = 'ocioso' }: TraceCanvasProps) {
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handlePointerDown = () => {
    isDragging.current = true;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    // If they let go before finishing, reset. Simple mechanic.
    if (progress > 0 && progress < 100) {
      setProgress(0);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    // Simplistic fake tracing mechanic for demonstration
    // In a real app this would use an SVG path length and distance calculation
    setProgress(p => {
      const np = Math.min(100, p + 2);
      if (np === 100 && p < 100 && onComplete) {
        onComplete();
      }
      return np;
    });
  };

  return (
    <div 
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerMove={handlePointerMove}
      className={`relative w-full max-w-[200px] aspect-square mx-auto bg-slate-50 border-4 border-dashed border-slate-300 rounded-2xl flex items-center justify-center select-none touch-none cursor-crosshair overflow-hidden ${tokens.estado[state]}`}
    >
      {/* Background faint text */}
      <span className="absolute text-[120px] font-black text-slate-200 pointer-events-none">
        {targetNumeral}
      </span>
      
      {/* Fake progress fill (clip path reveal) */}
      <div 
        className="absolute inset-0 flex items-center justify-center text-[120px] font-black pointer-events-none"
        style={{ 
          color: tokens.cor.acao.primaria,
          clipPath: `inset(${100 - progress}% 0 0 0)`
        }}
      >
        {targetNumeral}
      </div>

      {progress < 100 && (
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute top-4 left-8 text-2xl pointer-events-none"
        >
          👆
        </motion.div>
      )}

      {progress === 100 && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 bg-green-400/20 flex items-center justify-center pointer-events-none"
        >
          <span className="text-4xl">✨</span>
        </motion.div>
      )}
    </div>
  );
}
