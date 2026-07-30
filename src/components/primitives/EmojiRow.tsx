import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { tokens, UIState } from '../../styles/tokens';
import { speak } from '../Mascot';

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
  disabled?: boolean;
  crossedOut?: boolean;
  promptDone?: boolean;
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
  onItemTouch,
  disabled,
  crossedOut,
  promptDone = true
}: EmojiRowProps) {
  
  const [phase, setPhase] = useState<'waiting' | 'flashing' | 'done'>(
    !promptDone && flashDurationMs ? 'waiting' : (flashDurationMs ? 'flashing' : 'done')
  );
  const [touchedItems, setTouchedItems] = useState<Set<number>>(new Set());
  const touchedCount = touchedItems.size;

  useEffect(() => {
    if (flashDurationMs && flashDurationMs > 0) {
      if (promptDone) {
        setPhase('flashing');
        const timer = setTimeout(() => {
          setPhase('done');
        }, flashDurationMs);
        return () => clearTimeout(timer);
      } else {
        setPhase('waiting');
      }
    } else {
      setPhase('done');
    }
  }, [promptDone, flashDurationMs, n, emoji]);

  // Reset touch count
  useEffect(() => {
    setTouchedItems(new Set());
  }, [n, interactiveCount, emoji]);

  const handleTouch = (idx: number) => {
    if (!interactiveCount || disabled) return;
    if (!touchedItems.has(idx)) {
      const newItems = new Set(touchedItems);
      newItems.add(idx);
      setTouchedItems(newItems);
      const newCount = newItems.size;
      speak(newCount.toString());
      if (onItemTouch && newCount === n) { setTimeout(() => onItemTouch(newCount), 800); }
    } else {
      speak("esse já contamos!");
    }
  };

  return (
    <div 
      className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-16 relative py-6 ${tokens.estado[state]}`} 
      style={{ maxWidth: small ? 150 : "100%", minHeight: '80px' }}
    >
      <AnimatePresence mode="popLayout">
        { (phase === 'flashing' || !flashDurationMs) ? (
          Array.from({ length: n }).map((_, i) => {
            const isHighlighted = highlightIndex === i || (interactiveCount && !touchedItems.has(i));
            
            // In touch mode, items are dimmed until touched
            const isTouched = interactiveCount ? touchedItems.has(i) : true;
            
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
                className={`relative inline-block ${interactiveCount && !touchedItems.has(i) ? 'cursor-pointer' : ''}`}
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
              {crossedOut && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-1 bg-red-500 -rotate-45 shadow-sm" /></div>}
              </motion.span>
            );
          })
        ) : (
          <motion.div
            key="hidden-box"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center p-4 rounded-xl shadow-md gap-2"
            style={{ backgroundColor: tokens.cor.elementos.preenchimento, border: `3px solid ${tokens.cor.elementos.borda}` }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-7xl">{phase === 'waiting' ? '🙈' : '🙈'}</span>
              <span className="text-xl font-bold" style={{ color: tokens.cor.texto.secundario }}>
                {phase === 'waiting' ? 'Olhos fechados... 👀' : 'Quantos eram? 🤔'}
              </span>
            </div>
            {!disabled && phase === 'done' && (
              <button
                onClick={() => {
                  setPhase('waiting');
                  setTimeout(() => {
                    setPhase('flashing');
                    if (flashDurationMs) {
                      setTimeout(() => setPhase('done'), flashDurationMs);
                    }
                  }, 100);
                }}
                className="mt-2 select-none cursor-pointer active:translate-y-0.5 transition-all"
                style={{ fontFamily: 'inherit', fontWeight: 800, fontSize: 13, color: tokens.cor.elementos.marcador, background: "#F1EDFF", border: `2px solid ${tokens.cor.elementos.marcador}`, borderRadius: 12, padding: "6px 14px" }}
              >
                👀 Ver de novo
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
