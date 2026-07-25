import React from "react";
import { FONT } from "../Mascot";

export interface LinkingCubesProps {
  groups: { n: number; color: string }[];
  showNumbers?: boolean;
  numberAbove?: boolean;
  showPlus?: boolean;
}

const COLOR_MAP: Record<string, string> = {
  "bg-emerald-400": "#34d399",
  "bg-indigo-400": "#818cf8",
  "bg-blue-400": "#60a5fa",
  "bg-rose-400": "#fb7185",
  "bg-amber-400": "#fbbf24",
  "bg-purple-400": "#c084fc",
};

export function LinkingCubes({ groups, showNumbers = false, numberAbove = false, showPlus = false }: LinkingCubesProps) {
  const renderCubes = (n: number, colorClass: string) => {
    const hexColor = COLOR_MAP[colorClass] || colorClass || "#34d399";
    
    return Array.from({ length: n }).map((_, i) => (
      <div
        key={i}
        className="relative"
        style={{
          marginLeft: i === 0 ? 0 : -8, // overlap the peg of the previous cube
          zIndex: 10 - i, // left cubes on top so they cover the right peg
        }}
      >
        <svg width="46" height="40" viewBox="0 0 54 40" className="drop-shadow-sm overflow-visible">
          {/* Main body of the cube */}
          <rect x="2" y="2" width="38" height="36" rx="4" fill={hexColor} stroke="rgba(0,0,0,0.2)" strokeWidth="2.5" />
          {/* Peg on the right side */}
          <path d="M 40 14 L 48 14 L 48 26 L 40 26" fill={hexColor} stroke="rgba(0,0,0,0.2)" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Bright highlight to give a plastic 3D feel */}
          <rect x="6" y="6" width="30" height="12" rx="2" fill="white" opacity="0.35" />
        </svg>
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-row items-end" style={{ paddingRight: 8 }}>
        {groups.map((g, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center gap-2">
              {numberAbove && (
                <div className="text-3xl font-black text-slate-700" style={{ fontFamily: FONT }}>
                  {g.n}
                </div>
              )}
              <div className="flex items-center">
                {renderCubes(g.n, g.color)}
              </div>
            </div>
            
            {/* Space or Plus between groups */}
            {idx < groups.length - 1 && (
              <div className="flex items-center justify-center px-4 mb-2">
                {showPlus ? (
                  <span className="text-4xl font-black text-slate-400" style={{ fontFamily: FONT }}>+</span>
                ) : (
                  <div className="w-4" />
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {showNumbers && !numberAbove && (
        <div className="flex gap-4 items-center mt-2 text-4xl font-black text-slate-700" style={{ fontFamily: FONT }}>
          {groups.map((g, idx) => (
            <React.Fragment key={idx}>
              <span className="px-4 py-2 bg-slate-100 rounded-xl">{g.n}</span>
              {idx < groups.length - 1 && <span className="text-slate-400">+</span>}
            </React.Fragment>
          ))}
          <span className="text-slate-400">=</span>
          <span className="px-4 py-2 bg-slate-100 rounded-xl">
            {groups.reduce((sum, g) => sum + g.n, 0)}
          </span>
        </div>
      )}
    </div>
  );
}
