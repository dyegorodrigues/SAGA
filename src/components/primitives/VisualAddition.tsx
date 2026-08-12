import React from "react";
import { FONT } from "../Mascot";

export interface VisualAdditionProps {
  a: number;
  b: number;
  emojiA?: string;
  emojiB?: string;
  showNumbers?: boolean;
  mode?: "objects" | "numerals";
  merged?: boolean;
  highlightGroup?: "A" | "B";
}

export function VisualAddition({
  a,
  b,
  emojiA = "🍎",
  emojiB = "🍎",
  showNumbers = true,
  mode = "objects",
  merged = false,
  highlightGroup,
}: VisualAdditionProps) {
  const renderBox = (count: number, emoji: string, label: number, group: "A" | "B" | "TOTAL") => {
    const highlighted = highlightGroup === group;
    return (
      <div className="flex flex-col items-center gap-2 md:gap-4" data-visual-addition-group={group}>
        <div
          className={`bg-white border-2 rounded-2xl p-3 md:p-6 shadow-sm flex flex-wrap justify-center gap-2 w-28 md:w-48 min-h-[100px] md:min-h-[140px] items-center transition-all ${highlighted ? "border-blue-600 ring-4 ring-blue-100" : "border-slate-200"}`}
        >
          {mode === "objects"
            ? Array.from({ length: count }).map((_, i) => (
                <span key={i} className="text-4xl md:text-5xl" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }} aria-hidden>
                  {emoji}
                </span>
              ))
            : (
                <span className="text-5xl md:text-6xl font-black text-slate-800" style={{ fontFamily: FONT }}>
                  {label}
                </span>
              )}
        </div>
        {showNumbers && mode === "objects" && (
          <div className="text-3xl md:text-4xl font-black text-slate-800" style={{ fontFamily: FONT }}>
            {label}
          </div>
        )}
      </div>
    );
  };

  if (merged) {
    return (
      <div className="flex items-center justify-center p-4 w-full select-none" data-visual-addition-merged>
        {renderBox(a + b, emojiA, a + b, "TOTAL")}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 select-none p-4 w-full" data-visual-addition>
      <div className="flex items-center gap-2 md:gap-6">
        {renderBox(a, emojiA, a, "A")}
        <div className="text-4xl md:text-6xl font-black text-slate-500 mb-8 md:mb-12" style={{ fontFamily: FONT }} aria-hidden>
          +
        </div>
        {renderBox(b, emojiB, b, "B")}
      </div>
      <div className="flex items-center gap-2 md:gap-6 mt-2 md:mt-0">
        <div className="text-4xl md:text-6xl font-black text-slate-500 md:mb-12" style={{ fontFamily: FONT }} aria-hidden>
          =
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="border-4 border-dashed border-slate-300 rounded-2xl w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-slate-50/50 md:mb-[52px]" role="img" aria-label="Resposta ainda vazia">
            <span className="text-3xl md:text-4xl text-slate-500 font-black" aria-hidden>?</span>
          </div>
        </div>
      </div>
    </div>
  );
}
