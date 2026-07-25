import React from "react";
import { FONT } from "../Mascot";

export interface VisualAdditionProps {
  a: number;
  b: number;
  emojiA?: string;
  emojiB?: string;
  showNumbers?: boolean;
}

export function VisualAddition({ a, b, emojiA = "🍎", emojiB = "🍎", showNumbers = true }: VisualAdditionProps) {
  const renderBox = (count: number, emoji: string, label: number) => (
    <div className="flex flex-col items-center gap-2 md:gap-4">
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-3 md:p-6 shadow-sm flex flex-wrap justify-center gap-2 w-28 md:w-48 min-h-[100px] md:min-h-[140px] items-center">
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className="text-4xl md:text-5xl" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}>
            {emoji}
          </span>
        ))}
      </div>
      {showNumbers && (
        <div className="text-3xl md:text-4xl font-black text-slate-800" style={{ fontFamily: FONT }}>
          {label}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 select-none p-4 w-full">
      <div className="flex items-center gap-2 md:gap-6">
        {renderBox(a, emojiA, a)}
        <div className="text-4xl md:text-6xl font-black text-slate-400 mb-8 md:mb-12" style={{ fontFamily: FONT }}>
          +
        </div>
        {renderBox(b, emojiB, b)}
      </div>
      <div className="flex items-center gap-2 md:gap-6 mt-2 md:mt-0">
        <div className="text-4xl md:text-6xl font-black text-slate-400 md:mb-12" style={{ fontFamily: FONT }}>
          =
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="border-4 border-dashed border-slate-300 rounded-2xl w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-slate-50/50 md:mb-[52px]">
            <span className="text-3xl md:text-4xl text-slate-300 font-black">?</span>
          </div>
        </div>
      </div>
    </div>
  );
}
