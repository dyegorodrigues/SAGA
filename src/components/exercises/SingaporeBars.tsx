import React, { useState } from "react";
import { Question } from "../../types";
import { C } from "../Mascot";
import { motion, PanInfo } from "motion/react";

interface Props {
  q: Question;
  onAnswer: (val: any) => void;
  disabled: boolean;
}

export function SingaporeBars({ q, onAnswer, disabled }: Props) {
  // A = base block, B = draggable block
  const [snapped, setSnapped] = useState(false);

  const blockA = q.a || 3;
  const blockB = q.b || 2;
  const total = blockA + blockB;
  
  const unitWidth = 40; // width per unit of magnitude

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If they drag it close enough (x > 50 roughly to the right)
    if (info.offset.x > unitWidth * blockA * 0.4) {
      setSnapped(true);
      // after snapping, give it a moment then answer correctly
      setTimeout(() => onAnswer(total), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h3 className="text-xl text-slate-600 font-bold mb-10 text-center px-4">
        Junte os blocos para descobrir a soma!
      </h3>
      
      <div className="relative h-24 flex items-center w-full justify-center">
        {/* Base Block A */}
        <div 
          className="absolute left-1/2 rounded-l-lg border-2 border-r-0 flex items-center justify-center font-bold text-white text-2xl shadow-sm z-10"
          style={{ 
            width: blockA * unitWidth, 
            height: 60, 
            backgroundColor: C.ocean, 
            borderColor: C.oceanDark,
            transform: 'translateX(-100%)' // align right edge to center
          }}
        >
          {blockA}
        </div>
        
        {/* Drop Zone (Ghost Block) */}
        {!snapped && (
           <div 
            className="absolute left-1/2 border-2 border-dashed border-slate-300 rounded-r-lg bg-slate-50"
            style={{ 
              width: blockB * unitWidth, 
              height: 60, 
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
          className={`absolute rounded-lg border-2 flex items-center justify-center font-bold text-white text-2xl shadow-md cursor-grab active:cursor-grabbing ${snapped ? 'rounded-l-none' : ''}`}
          style={{ 
            width: blockB * unitWidth, 
            height: 60, 
            backgroundColor: C.melon, 
            borderColor: C.melonDark,
            // initially spaced apart
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
            className="absolute top-24 font-black text-4xl text-slate-800"
          >
            {blockA} + {blockB} = {total}
          </motion.div>
        )}
      </div>
    </div>
  );
}
