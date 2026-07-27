import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { tokens } from '../../styles/tokens';
import { speak } from '../Mascot';

export interface AudioChoiceProps {
  audioPrompt: string; // The number or word to say
  options: (number | string)[];
  onSelect: (option: number | string) => void;
  disabled?: boolean;
}

export function AudioChoice({ audioPrompt, options, onSelect, disabled }: AudioChoiceProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Play automatically on load
    handlePlay();
  }, [audioPrompt]);

  const handlePlay = () => {
    setIsPlaying(true);
    speak(audioPrompt);
    // Rough estimate of speech duration, we could listen to an actual event if using Web Speech API properly
    setTimeout(() => setIsPlaying(false), 1500); 
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-lg mx-auto py-8">
      {/* Big Audio Button */}
      <motion.button
        whileHover={disabled ? {} : { scale: 1.05 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        onClick={handlePlay}
        disabled={disabled}
        className="w-40 h-40 rounded-full flex items-center justify-center shadow-lg relative"
        style={{
          backgroundColor: tokens.cor.elementos.marcador,
          border: `4px solid ${tokens.cor.elementos.borda}`,
          color: tokens.cor.texto.inverso
        }}
      >
        <span className="text-6xl">{isPlaying ? '🔊' : '🔈'}</span>
        {isPlaying && (
          <span 
            className="absolute inset-0 rounded-full animate-ping pointer-events-none" 
            style={{ border: `4px solid ${tokens.cor.elementos.marcador}`, opacity: 0.5 }}
          />
        )}
      </motion.button>

      {/* Options */}
      <div className="flex flex-wrap justify-center gap-6">
        {options.map((opt, i) => (
          <motion.button
            key={i}
            whileHover={disabled ? {} : { scale: 1.1, y: -4 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            onClick={() => onSelect(opt)}
            disabled={disabled}
            className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-md font-black text-3xl"
            style={{
              backgroundColor: tokens.cor.superficie.fundo,
              color: tokens.cor.texto.principal,
              border: `2px solid ${tokens.cor.elementos.borda}`
            }}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
