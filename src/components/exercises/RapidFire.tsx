import React, { useState, useEffect } from "react";
import { Question } from "../../types";
import { C } from "../Mascot";
import { motion } from "motion/react";

interface Props {
  timeLeft?: number | null;
  q: Question;
  onAnswer: (val: any) => void;
  disabled: boolean;
}

export function RapidFire({ q, onAnswer, disabled, timeLeft }: Props) {
  // O Dojo de Velocidade {timeLeft != null ? ` - ${timeLeft}s` : ""} (Nível 4)
  // Conta no centro, botões gigantes. Sem frufru.
  
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-6xl font-black mb-12 text-slate-800"
        style={{ fontFamily: "'Fredoka', sans-serif" }}
      >
        {q.expr || q.big || q.prompt}
      </motion.div>

      <div className="flex gap-6 w-full justify-center px-4 max-w-lg">
        {q.options.map((opt, i) => (
          <button
            key={i}
            disabled={disabled}
            onClick={() => onAnswer(opt.value)}
            className="flex-1 aspect-square rounded-2xl font-bold text-4xl text-white shadow-[0_8px_0_#0F6FD0] active:shadow-[0_0px_0_#0F6FD0] active:translate-y-2 transition-all cursor-pointer"
            style={{ backgroundColor: C.ocean, fontFamily: "'Fredoka', sans-serif" }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      
      <div className="mt-12 text-slate-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
        <span className="animate-pulse">⏱️</span> 
        Dojo de Velocidade
      </div>
    </div>
  );
}
