import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { tokens, UIState } from '../../styles/tokens';

export interface BalancaItem {
  id: string | number;
  weight: number;
  label: string | React.ReactNode;
  color?: string;
}

interface BalancaProps {
  leftItems: BalancaItem[];
  rightItems: BalancaItem[];
  state?: UIState;
  maxTilt?: number;
  onPanClick?: (side: 'left' | 'right') => void;
}

export function Balanca({ leftItems, rightItems, state = 'ocioso', maxTilt = 15, onPanClick }: BalancaProps) {
  const leftWeight = useMemo(() => leftItems.reduce((acc, item) => acc + item.weight, 0), [leftItems]);
  const rightWeight = useMemo(() => rightItems.reduce((acc, item) => acc + item.weight, 0), [rightItems]);
  
  // Calcula a inclinação. Se peso direito > esquerdo, inclina positivo (direita desce).
  // Se esquerdo > direito, inclina negativo (esquerda desce).
  const weightDiff = rightWeight - leftWeight;
  const rotation = Math.max(-maxTilt, Math.min(maxTilt, weightDiff * 5));
  
  // Feedback visual de igualdade
  const isBalanced = leftWeight > 0 && leftWeight === rightWeight;
  const beamColor = isBalanced ? tokens.cor.feedback.acerto : tokens.cor.elementos.borda;

  const renderPanItems = (items: BalancaItem[]) => (
    <div className="flex flex-wrap-reverse justify-center gap-1 min-h-[40px] items-end pb-1">
      {items.map((item) => (
        <motion.div
          key={item.id}
          layout
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-center font-bold shadow-sm"
          style={{
            minWidth: '40px',
            height: '40px',
            backgroundColor: item.color || tokens.cor.elementos.base_A,
            color: 'white',
            borderRadius: '8px',
            border: '2px solid rgba(0,0,0,0.1)'
          }}
        >
          {item.label}
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className={`relative w-full max-w-md mx-auto pt-10 pb-4 select-none ${tokens.estado[state]}`}>
      {/* Central Base (Pivot) */}
      <div className="absolute left-1/2 bottom-4 -translate-x-1/2 w-8 h-32 z-0 flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-slate-300 shadow-inner z-20 mt-2 absolute top-0" />
        <div 
          className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[120px]"
          style={{ borderBottomColor: tokens.cor.superficie.cartao, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
        />
      </div>

      {/* Beam & Pans (Animated Container) */}
      <motion.div
        className="relative z-10 w-full h-4 mt-4"
        animate={{ rotate: rotation }}
        transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        style={{ originX: 0.5, originY: 0.5 }}
      >
        {/* The Beam */}
        <div 
          className="absolute inset-0 rounded-full transition-colors duration-300"
          style={{ backgroundColor: beamColor, boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1)' }}
        />

        {/* Left Pan Container */}
        <div className="absolute left-0 top-2 -translate-x-1/2 flex flex-col items-center" style={{ width: '120px' }}>
          {/* Strings */}
          <div className="flex justify-between w-full px-2">
            <div className="w-0.5 h-16 bg-slate-300 origin-top" />
            <div className="w-0.5 h-16 bg-slate-300 origin-top" />
          </div>
          {/* Pan */}
          <motion.div 
            className="w-full bg-slate-100 rounded-b-xl border-2 border-t-0 flex flex-col justify-end p-2 cursor-pointer hover:bg-slate-50 transition-colors"
            style={{ borderColor: tokens.cor.elementos.borda, minHeight: '60px' }}
            animate={{ rotate: -rotation }} // Counter-rotate to stay horizontal
            transition={{ type: 'spring', stiffness: 120, damping: 12 }}
            onClick={() => onPanClick && onPanClick('left')}
          >
            {renderPanItems(leftItems)}
          </motion.div>
        </div>

        {/* Right Pan Container */}
        <div className="absolute right-0 top-2 translate-x-1/2 flex flex-col items-center" style={{ width: '120px' }}>
          {/* Strings */}
          <div className="flex justify-between w-full px-2">
            <div className="w-0.5 h-16 bg-slate-300 origin-top" />
            <div className="w-0.5 h-16 bg-slate-300 origin-top" />
          </div>
          {/* Pan */}
          <motion.div 
            className="w-full bg-slate-100 rounded-b-xl border-2 border-t-0 flex flex-col justify-end p-2 cursor-pointer hover:bg-slate-50 transition-colors"
            style={{ borderColor: tokens.cor.elementos.borda, minHeight: '60px' }}
            animate={{ rotate: -rotation }} // Counter-rotate to stay horizontal
            transition={{ type: 'spring', stiffness: 120, damping: 12 }}
            onClick={() => onPanClick && onPanClick('right')}
          >
            {renderPanItems(rightItems)}
          </motion.div>
        </div>
      </motion.div>

      {/* Spacer to push content below the absolute positioned pans */}
      <div className="h-40" />
    </div>
  );
}
