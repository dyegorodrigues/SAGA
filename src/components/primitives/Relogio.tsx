import React, { useState } from 'react';
import { motion } from 'motion/react';
import { tokens, UIState } from '../../styles/tokens';

interface RelogioProps {
  initialHours?: number;
  initialMinutes?: number;
  interactive?: boolean;
  onTimeChange?: (hours: number, minutes: number) => void;
  state?: UIState;
}

export function Relogio({ initialHours = 12, initialMinutes = 0, interactive = false, onTimeChange, state = 'ocioso' }: RelogioProps) {
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);

  const addMinutes = (amount: number) => {
    if (!interactive) return;
    let newMins = minutes + amount;
    let newHours = hours;
    
    if (newMins >= 60) {
      newMins -= 60;
      newHours = newHours === 12 ? 1 : newHours + 1;
    } else if (newMins < 0) {
      newMins += 60;
      newHours = newHours === 1 ? 12 : newHours - 1;
    }
    
    setMinutes(newMins);
    setHours(newHours);
    if (onTimeChange) onTimeChange(newHours, newMins);
  };

  const addHours = (amount: number) => {
    if (!interactive) return;
    let newHours = hours + amount;
    if (newHours > 12) newHours -= 12;
    if (newHours < 1) newHours += 12;
    setHours(newHours);
    if (onTimeChange) onTimeChange(newHours, minutes);
  };

  // Degrees for hands
  const minuteDegrees = minutes * 6; // 360 / 60
  // Hour hand moves slightly depending on minutes
  const hourDegrees = (hours * 30) + (minutes * 0.5); // 360 / 12 = 30

  const markers = Array.from({ length: 12 });

  return (
    <div className={`flex flex-col items-center gap-6 select-none ${tokens.estado[state]}`}>
      {/* Clock Face */}
      <div 
        className="relative rounded-full flex items-center justify-center shadow-md bg-white"
        style={{
          width: '240px',
          height: '240px',
          border: `8px solid ${tokens.cor.elementos.base_A}`,
          boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        {/* Center dot */}
        <div className="absolute w-4 h-4 rounded-full z-30" style={{ backgroundColor: tokens.cor.texto.principal }} />
        
        {/* Markers */}
        {markers.map((_, i) => {
          const rotation = i * 30;
          return (
            <div 
              key={i}
              className="absolute w-full h-full flex justify-center pb-2 pointer-events-none"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <div 
                className="font-bold text-lg pt-1" 
                style={{ 
                  color: tokens.cor.texto.secundario,
                  transform: `rotate(${-rotation}deg)` // Keep text upright
                }}
              >
                {i === 0 ? 12 : i}
              </div>
            </div>
          );
        })}

        {/* Hour Hand */}
        <motion.div 
          className="absolute w-2 rounded-full origin-bottom z-10"
          style={{ 
            height: '60px',
            bottom: '50%',
            backgroundColor: tokens.cor.elementos.base_B 
          }}
          animate={{ rotate: hourDegrees }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        />

        {/* Minute Hand */}
        <motion.div 
          className="absolute w-1.5 rounded-full origin-bottom z-20"
          style={{ 
            height: '80px',
            bottom: '50%',
            backgroundColor: tokens.cor.texto.principal 
          }}
          animate={{ rotate: minuteDegrees }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        />
      </div>

      {/* Interactive Controls */}
      {interactive && (
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 items-center">
            <span className="text-sm font-bold text-slate-500">Horas</span>
            <div className="flex gap-2">
              <button onClick={() => addHours(-1)} className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 font-bold">-</button>
              <button onClick={() => addHours(1)} className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 font-bold">+</button>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <span className="text-sm font-bold text-slate-500">Minutos</span>
            <div className="flex gap-2">
              <button onClick={() => addMinutes(-15)} className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 font-bold">-15</button>
              <button onClick={() => addMinutes(15)} className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 font-bold">+15</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
