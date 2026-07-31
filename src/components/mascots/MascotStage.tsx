import React from 'react';
import { Mascote } from '../Mascot';

export function MascotStage({ 
  theme = "classico", 
  stage = 3, 
  size = 120, 
  kid = null,
  animation = "idle" 
}: { 
  theme?: string; 
  stage?: number; 
  size?: number | string; 
  kid?: any;
  animation?: "idle" | "walk" | "happy";
}) {
  const numericSize = typeof size === 'number' ? size : parseInt(size.toString()) || 120;
  const height = numericSize * 1.2;

  return (
    <div 
      className="relative rounded-2xl overflow-hidden flex items-end justify-center shadow-inner"
      style={{ 
        width: numericSize, 
        height: height,
        background: "linear-gradient(180deg, #BAE6FD 0%, #38BDF8 100%)" // Fundo retangular arredondado
      }}
    >
      {/* Camada 1: Fundo (Cenário) */}
      <div className="absolute inset-0 z-0">
        <svg width="100%" height="100%" viewBox="0 0 100 120" preserveAspectRatio="none">
          <circle cx="20" cy="20" r="15" fill="#FDE047" opacity="0.8" />
          <ellipse cx="50" cy="120" rx="90" ry="40" fill="#22C55E" opacity="0.9" />
          <ellipse cx="50" cy="130" rx="80" ry="30" fill="#166534" />
        </svg>
      </div>

      {/* Camada 2: Ator (Mascote) */}
      <div className="relative z-10 pointer-events-none mb-2">
        <Mascote 
          theme={theme} 
          stage={stage} 
          size={numericSize * 0.9} 
          kid={kid} 
          animation={animation} 
          transparentBg={true} 
        />
      </div>

      {/* Camada 3: Frente (Efeitos/Iluminação) */}
      <div className="absolute inset-0 z-20 shadow-[inset_0_4px_12px_rgba(255,255,255,0.4)] pointer-events-none"></div>
    </div>
  );
}
