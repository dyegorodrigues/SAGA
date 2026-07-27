import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { tokens } from '../../styles/tokens';
import { speak } from '../Mascot';

export interface TouchPlaceProps {
  emoji: string;
  targetCount: number;
  trayCount: number;
  onComplete?: () => void;
}

export function TouchPlace({ emoji, targetCount, trayCount, onComplete }: TouchPlaceProps) {
  const [placedCount, setPlacedCount] = useState(0);

  const handleTrayClick = () => {
    if (placedCount < targetCount) {
      const newCount = placedCount + 1;
      setPlacedCount(newCount);
      speak(newCount.toString());
      if (newCount === targetCount && onComplete) {
        setTimeout(onComplete, 1000);
      }
    } else {
      speak("Já colocamos todos!");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Cena com Vagas Fantasmas */}
      <div 
        className="relative w-full min-h-[200px] p-6 rounded-3xl flex flex-wrap justify-center items-center gap-4"
        style={{
          backgroundColor: tokens.cor.superficie.cartao,
          border: `2px dashed ${tokens.cor.elementos.borda}`
        }}
      >
        {Array.from({ length: targetCount }).map((_, i) => (
          <div 
            key={`vaga-${i}`}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              border: i >= placedCount ? `2px dashed ${tokens.cor.texto.secundario}` : 'none',
              backgroundColor: i >= placedCount ? 'transparent' : tokens.cor.elementos.preenchimento,
              opacity: i >= placedCount ? 0.5 : 1
            }}
          >
            <AnimatePresence>
              {i < placedCount && (
                <motion.div
                  initial={{ scale: 0, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  className="text-4xl"
                >
                  {emoji}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Bandeja */}
      <div 
        className="w-full p-4 rounded-2xl flex flex-wrap justify-center gap-2"
        style={{ backgroundColor: tokens.cor.superficie.fundo, border: `2px solid ${tokens.cor.elementos.borda}` }}
      >
        {Array.from({ length: trayCount - placedCount }).map((_, i) => (
          <motion.button
            key={`tray-${i}-${placedCount}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleTrayClick}
            className="text-4xl w-12 h-12 flex items-center justify-center cursor-pointer"
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
