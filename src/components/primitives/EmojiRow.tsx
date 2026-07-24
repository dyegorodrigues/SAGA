import React from 'react';
import { tokens, UIState } from '../../styles/tokens';

interface EmojiRowProps {
  emoji: string;
  n: number;
  small?: boolean;
  highlightIndex?: number | null;
  startIndex?: number;
  state?: UIState;
}

export function EmojiRow({ 
  emoji, 
  n, 
  small,
  startIndex = 1, 
  highlightIndex = null,
  state = 'ocioso'
}: EmojiRowProps) {
  return (
    <div 
      className={`flex flex-wrap items-center justify-center gap-2 relative py-2 ${tokens.estado[state]}`} 
      style={{ maxWidth: small ? 150 : "100%" }}
    >
      {Array.from({ length: n }).map((_, i) => {
        const isHighlighted = highlightIndex === i;
        return (
          <span 
            key={i} 
            className="relative inline-block"
            style={{
              transition: tokens.animacao.padrao,
              transform: isHighlighted ? "scale(1.35)" : "scale(1)",
              zIndex: isHighlighted ? 20 : 1,
              fontSize: small ? '24px' : tokens.tamanho.base,
            }}
          >
            {isHighlighted && (
              <span 
                className="absolute inset-0 rounded-full scale-150 blur-[2px] animate-ping pointer-events-none" 
                style={{ backgroundColor: tokens.cor.elementos.marcador, opacity: 0.4 }}
              />
            )}
            {isHighlighted && (
              <span 
                className="absolute -top-9 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none" 
                style={{ zIndex: 30, fontSize: tokens.tamanho.pequeno }}
              >
                👇
              </span>
            )}
            {isHighlighted && (
              <span 
                className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-black px-2 py-0.5 rounded shadow-sm pointer-events-none" 
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
          </span>
        );
      })}
    </div>
  );
}
