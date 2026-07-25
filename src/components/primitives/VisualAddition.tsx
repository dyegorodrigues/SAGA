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
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm flex flex-wrap justify-center gap-3 w-48 min-h-[140px] items-center">
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className="text-5xl" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}>
            {emoji}
          </span>
        ))}
      </div>
      {showNumbers && (
        <div className="text-4xl font-black text-slate-800" style={{ fontFamily: FONT }}>
          {label}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-6 select-none p-4 w-full">
      {renderBox(a, emojiA, a)}
      <div className="text-6xl font-black text-slate-400 mb-12" style={{ fontFamily: FONT }}>
        +
      </div>
      {renderBox(b, emojiB, b)}
      <div className="text-6xl font-black text-slate-400 mb-12" style={{ fontFamily: FONT }}>
        =
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="border-4 border-dashed border-slate-300 rounded-2xl w-32 h-32 flex items-center justify-center bg-slate-50/50 mb-[52px]">
          <span className="text-4xl text-slate-300 font-black">?</span>
        </div>
      </div>
    </div>
  );
}
