import React from 'react';
import { motion } from 'motion/react';
import { Question } from '../types';

export function NumberLine({ q, tutShow }: { q: Question; tutShow: any }) {
  const start = q.nlStart ?? 0;
  const end = q.nlEnd ?? 10;
  const jumps = q.nlJumps ?? [];
  
  const length = end - start;
  const stepWidth = 100 / (length || 1);

  return (
    <div className="w-full relative h-32 flex flex-col items-center justify-center">
      {/* The Line */}
      <div className="w-full h-2 bg-slate-300 rounded-full relative mt-10">
        
        {/* Ticks & Labels */}
        {Array.from({ length: length + 1 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute top-0 flex flex-col items-center"
            style={{ left: `${i * stepWidth}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-1 h-3 bg-slate-400 mt-[-2px]" />
            <div className="mt-2 text-sm font-bold text-slate-500">
              {start + i}
            </div>
          </div>
        ))}

        {/* Jumps */}
        {jumps.map((j, i) => {
          // calculate previous sum to know where this jump starts
          let prevSum = start;
          for (let k = 0; k < i; k++) {
            prevSum += jumps[k].val;
          }
          
          const jumpStartIdx = prevSum - start;
          const jumpEndIdx = jumpStartIdx + j.val;
          
          const startPct = jumpStartIdx * stepWidth;
          const endPct = jumpEndIdx * stepWidth;
          
          const isForward = j.val > 0;
          const leftPct = isForward ? startPct : endPct;
          const widthPct = Math.abs(j.val) * stepWidth;

          // TutShow logic: only show up to tutShow
          const isVisible = tutShow == null || tutShow >= i;
          
          if (!isVisible) return null;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ delay: j.delay ?? (i * 0.5), duration: 0.5 }}
              className="absolute top-0 h-10 pointer-events-none"
              style={{
                left: `${leftPct}%`,
                width: `${widthPct}%`,
                marginTop: '-40px'
              }}
            >
              <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 40">
                <path
                  d={isForward ? "M 0 40 Q 50 0 100 40" : "M 100 40 Q 50 0 0 40"}
                  fill="none"
                  stroke={isForward ? "#4ade80" : "#f87171"}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Arrow head */}
                {isForward ? (
                  <polygon points="95,35 100,40 93,42" fill="#4ade80" />
                ) : (
                  <polygon points="5,35 0,40 7,42" fill="#f87171" />
                )}
              </svg>
              <div 
                className="absolute text-xs font-black text-white px-1.5 py-0.5 rounded shadow-sm"
                style={{
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: isForward ? "#4ade80" : "#f87171"
                }}
              >
                {j.val > 0 ? `+${j.val}` : j.val}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
