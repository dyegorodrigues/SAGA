import React, { useState } from "react";
import { Question } from "../../types";
import { tokens, UIState } from "../../styles/tokens";
import { motion, PanInfo } from "motion/react";

interface Props {
  q: Question;
  onAnswer: (val: any) => void;
  disabled: boolean;
  state?: UIState;
}

export function SingaporeBars({ q, onAnswer, disabled, state = 'ocioso' }: Props) {
  // A = base block, B = draggable block
  const [snapped, setSnapped] = useState(false);
  const blockA = q.a || 3;
  const blockB = q.b || 2;
  const total = blockA + blockB;
  
  const unitWidth = parseInt(tokens.tamanho.base) || 40; // width per unit of magnitude

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > unitWidth * blockA * 0.4) {
      setSnapped(true);
      setTimeout(() => onAnswer(total), 1000);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center py-10 ${tokens.estado[state]}`}>
      <div className="relative flex items-center w-full justify-center" style={{ height: tokens.tamanho.grande }}>
        {/* Base Block A */}
        <div 
          className="absolute left-1/2 flex items-center justify-center font-bold text-2xl shadow-sm z-10"
          style={{ 
            width: blockA * unitWidth, 
            height: tokens.tamanho.grande, 
            backgroundColor: tokens.cor.elementos.base_A,
            borderColor: tokens.cor.elementos.borda,
            borderWidth: 2,
            borderRightWidth: 0,
            borderTopLeftRadius: tokens.tamanho.raio,
            borderBottomLeftRadius: tokens.tamanho.raio,
            color: tokens.cor.texto.inverso,
            transform: 'translateX(-100%)' // align right edge to center
          }}
        >
          {blockA}
        </div>
        
        {/* Drop Zone (Ghost Block) */}
        {!snapped && (
           <div 
             className="absolute left-1/2 border-dashed"
            style={{ 
               width: blockB * unitWidth, 
               height: tokens.tamanho.grande,
               backgroundColor: tokens.cor.superficie.fundo,
               borderColor: tokens.cor.elementos.borda,
               borderWidth: 2,
               borderTopRightRadius: tokens.tamanho.raio,
               borderBottomRightRadius: tokens.tamanho.raio,
             }}
          />
        )}

        {/* Draggable Block B */}
        <motion.div 
          drag={!snapped && !disabled ? "x" : false}
          dragConstraints={{ left: 0, right: blockA * unitWidth }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          animate={snapped ? { x: 0 } : {}}
          className={`absolute flex items-center justify-center font-bold text-2xl shadow-md cursor-grab active:cursor-grabbing`}
          style={{ 
             width: blockB * unitWidth, 
             height: tokens.tamanho.grande, 
             backgroundColor: tokens.cor.elementos.base_B,
             borderColor: tokens.cor.elementos.borda,
             borderWidth: 2,
             borderTopRightRadius: tokens.tamanho.raio,
             borderBottomRightRadius: tokens.tamanho.raio,
             borderTopLeftRadius: snapped ? 0 : tokens.tamanho.raio,
             borderBottomLeftRadius: snapped ? 0 : tokens.tamanho.raio,
             color: tokens.cor.texto.inverso,
             left: `calc(50% + ${snapped ? 0 : 80}px)`, 
             zIndex: 20
          }}
        >
          {blockB}
        </motion.div>
        
        {/* Result Block (Appears after snap) */}
        {snapped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-24 font-black text-4xl"
            style={{ color: tokens.cor.texto.principal }}
          >
            {blockA} + {blockB} = {total}
          </motion.div>
        )}
      </div>
    </div>
  );
}
