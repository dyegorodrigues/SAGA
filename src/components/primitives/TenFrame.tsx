import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { tokens, UIState } from '../../styles/tokens';

interface TenFrameProps {
  flashDurationMs?: number;
  filled: number;
  filled2?: number | null;
  destacarFileira?: 1 | 2 | null;
  destacarCelula?: number | null;
  preencherAte?: number | null;
  state?: UIState;
}

export function TenFrame({ filled, filled2 = null, flashDurationMs, destacarFileira = null, destacarCelula = null, preencherAte = null, state = 'ocioso' }: TenFrameProps) {
  const [isFlashed, setIsFlashed] = useState(false);

  useEffect(() => {
    if (flashDurationMs && flashDurationMs > 0) {
      setIsFlashed(false);
      const timer = setTimeout(() => {
        setIsFlashed(true);
      }, flashDurationMs);
      return () => clearTimeout(timer);
    }
  }, [flashDurationMs, filled, filled2]);
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
      {destacarFileira === 1 && <div className="absolute top-0 left-0 right-0 h-[48%] border-4 border-amber-400 bg-amber-100/50 rounded-lg animate-pulse pointer-events-none" style={{ borderColor: tokens.cor.elementos.marcador }} />}
      {destacarFileira === 2 && <div className="absolute bottom-0 left-0 right-0 h-[48%] border-4 border-amber-400 bg-amber-100/50 rounded-lg animate-pulse pointer-events-none" style={{ borderColor: tokens.cor.elementos.marcador }} />}
      {Array.from({ length: 10 }).map((_, i) => {
        const isHighlighted = (destacarFileira === 1 && i < 5) || (destacarFileira === 2 && i >= 5);
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
    <div className="flex flex-wrap items-center justify-center gap-3 py-2 min-h-[120px]">
      <AnimatePresence mode="popLayout">
        {!isFlashed ? (
          <motion.div key="frame" initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0}} className="flex flex-wrap items-center gap-3">
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
          </motion.div>
        ) : (
          <motion.div
            key="hidden"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-7xl">🙈</span>
            <span className="text-xl font-bold" style={{ color: tokens.cor.texto.secundario }}>Cadê?</span>
            {state !== 'acerto' && state !== 'erro-suave' && (
              <button
                onClick={() => {
                  setIsFlashed(false);
                  setTimeout(() => setIsFlashed(true), 1200);
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
