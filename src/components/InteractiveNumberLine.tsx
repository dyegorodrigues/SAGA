import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Question } from '../types';

export function InteractiveNumberLine({ q, onAnswer, disabled }: { q: Question; onAnswer: (val: any) => void; disabled: boolean }) {
  const start = q.nlStart ?? 0;
  const end = q.nlEnd ?? 10;
  const length = end - start;
  const stepWidth = 100 / (length || 1);
  const [pos, setPos] = useState((q.nlStartPos !== undefined ? q.nlStartPos - start : 0));
  
  useEffect(() => {
    setPos(q.nlStartPos !== undefined ? q.nlStartPos - start : 0);
  }, [q, start]);
  
  const lineRef = useRef<HTMLDivElement>(null);
  
  const handleDragEnd = (e: any, info: any) => {
    if (disabled) return;
    if (!lineRef.current) return;
    const rect = lineRef.current.getBoundingClientRect();
    const x = info.point.x - rect.left;
    let pct = (x / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    const step = Math.round(pct / stepWidth);
    setPos(step);
  };
  
  const handleClick = (step: number) => {
    if (disabled) return;
    setPos(step);
  };

  const handleConfirm = () => {
    if (disabled) return;
    onAnswer(start + pos);
  };
  
  return (
    <div className="w-full relative h-40 flex flex-col items-center justify-center mt-6">
      <div ref={lineRef} className="w-full h-3 bg-slate-200 rounded-full relative">
        {/* Jumps */}
        {(q.nlJumps || []).map((j, i) => {
          let prevSum = start;
          for (let k = 0; k < i; k++) {
            prevSum += q.nlJumps![k].val;
          }
          const jumpStartIdx = prevSum - start;
          const jumpEndIdx = jumpStartIdx + j.val;
          const startPct = jumpStartIdx * stepWidth;
          const endPct = jumpEndIdx * stepWidth;
          const isForward = j.val > 0;
          const leftPct = isForward ? startPct : endPct;
          const widthPct = Math.abs(j.val) * stepWidth;
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
        {/* Ticks & Labels */}
        {Array.from({ length: length + 1 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute top-0 flex flex-col items-center cursor-pointer group"
            style={{ left: `${i * stepWidth}%`, transform: 'translateX(-50%)' }}
            onClick={() => handleClick(i)}
          >
            <div className={`w-1.5 h-4 mt-[-2px] rounded-full transition-colors ${i === pos ? 'bg-green-500' : 'bg-slate-300 group-hover:bg-sky-400'}`} />
            <div className={`mt-2 text-base font-bold transition-colors ${i === pos ? 'text-green-600 scale-110' : 'text-slate-500 group-hover:text-sky-500'}`}>
              {start + i}
            </div>
          </div>
        ))}
        {/* Drag Marker */}
        <motion.div
          drag={disabled ? false : "x"}
          dragElastic={0.1}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          animate={{ left: `${pos * stepWidth}%` }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="absolute flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
          style={{
            top: '-36px',
            translateX: '-50%',
            width: 56,
            height: 56,
          }}
        >
          <div className="text-5xl filter drop-shadow-lg hover:scale-110 transition-transform">🐸</div>
        </motion.div>
      </div>
      <div className="mt-14 flex items-center justify-center gap-4">
        <div className="text-slate-400 text-sm font-medium bg-slate-100 px-4 py-1.5 rounded-full">
          Arraste o sapinho ou clique no número!
        </div>
        {!disabled && (
          <button 
            onClick={handleConfirm} 
            className="px-6 py-2 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-md"
          >
            Confirmar
          </button>
        )}
      </div>
    </div>
  );
}
