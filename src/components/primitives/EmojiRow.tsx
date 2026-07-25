import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { tokens, UIState } from '../../styles/tokens';

export interface EmojiRowProps {
  emoji: string;
  n: number;
  small?: boolean;
  highlightIndex?: number | null;
  startIndex?: number;
  state?: UIState;
  
  // Flash Mode (N1.03)
  flashDurationMs?: number;
  
  // Touch Count Mode (N1.04)
  interactiveCount?: boolean;
  onItemTouch?: (count: number) => void;
}

export function EmojiRow({ 
  emoji, 
  n, 
  small,
  startIndex = 1, 
  highlightIndex = null,
  state = 'ocioso',
  flashDurationMs,
  interactiveCount,
  onItemTouch
}: EmojiRowProps) {
  
  const [isFlashed, setIsFlashed] = useState(false);
  const [touchedCount, setTouchedCount] = useState(0);

  // Flash logic
  useEffect(() => {
    if (flashDurationMs && flashDurationMs > 0) {
      setIsFlashed(false); // reset
      const timer = setTimeout(() => {
        setIsFlashed(true); // hide items after flash
      }, flashDurationMs);
      return () => clearTimeout(timer);
    }
  }, [flashDurationMs, n]);

  // Reset touch count when n changes
  useEffect(() => {
    if (interactiveCount) {
      setTouchedCount(0);
    }
  }, [n, interactiveCount]);

  const handleTouch = (idx: number) => {
    if (!interactiveCount) return;
    // Only allow touching the *next* item in sequence
    if (idx === touchedCount) {
      const newCount = touchedCount + 1;
      setTouchedCount(newCount);
      if (onItemTouch) onItemTouch(newCount);
    }
  };

  return (
    <div 
      className={`flex flex-wrap items-center justify-center gap-2 relative py-4 ${tokens.estado[state]}`} 
      style={{ maxWidth: small ? 150 : "100%", minHeight: '80px' }}
    >
      <AnimatePresence mode="popLayout">
        {!isFlashed ? (
          Array.from({ length: n }).map((_, i) => {
            const isHighlighted = highlightIndex === i || (interactiveCount && i === touchedCount);
            
            // In touch mode, items are dimmed until touched
            const isTouched = interactiveCount ? i < touchedCount : true;
            
            return (
              <motion.span 
                key={`emoji-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isHighlighted ? 1.35 : 1, 
                  opacity: isTouched ? 1 : 0.3,
                  filter: isTouched ? 'grayscale(0%)' : 'grayscale(100%)'
                }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => handleTouch(i)}
                className={`relative inline-block ${interactiveCount && i === touchedCount ? 'cursor-pointer' : ''}`}
                style={{
                  zIndex: isHighlighted ? 20 : 1,
                  fontSize: small ? '24px' : tokens.tamanho.base,
                }}
              >
                {/* Ping animation for the next item to touch */}
                {isHighlighted && interactiveCount && (
                  <span 
                    className="absolute inset-0 rounded-full scale-150 blur-[2px] animate-ping pointer-events-none" 
                    style={{ backgroundColor: tokens.cor.elementos.marcador, opacity: 0.5 }}
                  />
                )}
                
                {/* Highlight bouncing arrow (only in non-interactive highlight mode) */}
                {highlightIndex === i && !interactiveCount && (
                  <span 
                    className="absolute -top-9 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none" 
                    style={{ zIndex: 30, fontSize: tokens.tamanho.pequeno }}
                  >
                    👇
                  </span>
                )}
                
                {/* Number tag below the item */}
                {(highlightIndex === i || (interactiveCount && isTouched)) && (
                  <span 
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-black px-2 py-0.5 rounded shadow-sm pointer-events-none" 
                    style={{ 
                      zIndex: 30, 
                      backgroundColor: tokens.cor.texto.principal,
                      color: tokens.cor.texto.inverso,
                      borderColor: tokens.cor.elementos.borda,
                      borderWidth: 1
                    }}
                  >
                    {startIndex + i}
                  </span>
                )}
                {emoji}
              </motion.span>
            );
          })
        ) : (
          <motion.div
            key="hidden-box"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center p-4 rounded-xl shadow-md"
            style={{ backgroundColor: tokens.cor.elementos.preenchimento, border: `3px solid ${tokens.cor.elementos.borda}` }}
          >
            <span className="text-3xl font-bold" style={{ color: tokens.cor.texto.secundario }}>
              📦 Ocultos
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
