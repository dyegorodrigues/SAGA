import React from 'react';
import { motion } from 'motion/react';
import { tokens, UIState } from '../../styles/tokens';

interface MaterialDouradoProps {
  unidades: number;
  dezenas: number;
  centenas?: number;
  state?: UIState;
  compact?: boolean;
}

export function MaterialDourado({ unidades, dezenas, centenas = 0, state = 'ocioso', compact = false }: MaterialDouradoProps) {
  
  const BlockCube = () => (
    <div className="w-5 h-5 bg-amber-400 border border-amber-600 shadow-sm rounded-sm" />
  );

  const BlockTen = () => (
    <div className="flex flex-col gap-[1px] p-[1px] bg-amber-600 rounded-sm shadow-md">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="w-5 h-5 bg-amber-400" />
      ))}
    </div>
  );

  const BlockHundred = () => (
    <div className="grid grid-cols-10 gap-[1px] p-[2px] bg-amber-600 rounded-sm shadow-md">
      {Array.from({ length: 100 }).map((_, i) => (
        <div key={i} className="w-[10px] h-[10px] bg-amber-400" />
      ))}
    </div>
  );

  return (
    <div className={`flex flex-wrap justify-center items-end select-none bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200 ${compact ? 'gap-3 p-3' : 'gap-8 p-6'} ${tokens.estado[state]}`}>
      
      {/* Centenas */}
      {centenas > 0 && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap gap-2 justify-center max-w-[250px]">
            {Array.from({ length: centenas }).map((_, i) => (
              <motion.div key={`c-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}>
                <BlockHundred />
              </motion.div>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Centenas</span>
        </div>
      )}

      {/* Dezenas */}
      {dezenas > 0 && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2 items-end justify-center">
            {Array.from({ length: dezenas }).map((_, i) => (
              <motion.div key={`d-${i}`} initial={{ scale: 0, y: -20 }} animate={{ scale: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <BlockTen />
              </motion.div>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dezenas</span>
        </div>
      )}

      {/* Unidades */}
      {unidades > 0 && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap gap-1 max-w-[120px] justify-start content-end">
            {Array.from({ length: unidades }).map((_, i) => (
              <motion.div key={`u-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }}>
                <BlockCube />
              </motion.div>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unidades</span>
        </div>
      )}

      {unidades === 0 && dezenas === 0 && centenas === 0 && (
        <span className="text-slate-400 font-bold">Vazio</span>
      )}
    </div>
  );
}
