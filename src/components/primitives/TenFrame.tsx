import React from 'react';
import { tokens, UIState } from '../../styles/tokens';

interface TenFrameProps {
  filled: number;
  filled2?: number | null;
  highlightRow?: 1 | 2 | null;
  state?: UIState;
}

export function TenFrame({ filled, filled2 = null, highlightRow = null, state = 'ocioso' }: TenFrameProps) {
  const Frame = ({ n }: { n: number }) => (
    <div 
      className={`relative grid grid-cols-5 gap-1 p-2 shadow-md select-none ${tokens.estado[state]}`}
      style={{
        backgroundColor: tokens.cor.superficie.cartao,
        borderRadius: tokens.tamanho.raio,
        borderColor: tokens.cor.elementos.borda,
        borderWidth: 4,
      }}
    >
      {highlightRow === 1 && <div className="absolute top-0 left-0 right-0 h-[48%] border-4 border-amber-400 bg-amber-100/50 rounded-lg animate-pulse pointer-events-none" style={{ borderColor: tokens.cor.elementos.marcador }} />}
      {highlightRow === 2 && <div className="absolute bottom-0 left-0 right-0 h-[48%] border-4 border-amber-400 bg-amber-100/50 rounded-lg animate-pulse pointer-events-none" style={{ borderColor: tokens.cor.elementos.marcador }} />}
      {Array.from({ length: 10 }).map((_, i) => {
        const isHighlighted = (highlightRow === 1 && i < 5) || (highlightRow === 2 && i >= 5);
        return (
          <div 
            key={i} 
            className={`flex items-center justify-center z-10 ${isHighlighted ? 'scale-110 shadow-sm' : ''}`} 
            style={{ 
              width: tokens.tamanho.pequeno, 
              height: tokens.tamanho.pequeno, 
              backgroundColor: i < n ? "transparent" : tokens.cor.elementos.preenchimento, 
              border: `2px solid ${tokens.cor.elementos.borda}`,
              borderRadius: '6px'
            }}
          >
            {i < n && (
              <span 
                className="inline-block rounded-full" 
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: tokens.cor.elementos.base_A, 
                  transition: tokens.animacao.padrao
                }} 
              />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-2">
      <Frame n={Math.min(10, filled)} />
      {filled2 != null && (
        <>
          <span 
            className="text-3xl font-black" 
            style={{ color: tokens.cor.texto.secundario }}
          >
            +
          </span>
          <Frame n={Math.min(10, filled2)} />
        </>
      )}
    </div>
  );
}
