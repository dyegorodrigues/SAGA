import React from "react";
import { FONT } from "../Mascot";

export interface LinkingCubesProps {
  groups: { n: number; color: string }[];
  showNumbers?: boolean;
}

export function LinkingCubes({ groups, showNumbers = false }: LinkingCubesProps) {
  const renderCubes = (n: number, colorClass: string) => {
    return Array.from({ length: n }).map((_, i) => (
      <div
        key={i}
        className={`w-12 h-12 ${colorClass} border-2 border-black/10 rounded-sm relative shadow-sm flex items-center justify-center`}
        style={{
          marginLeft: i === 0 ? 0 : -4, // overlap slightly to look linked
          zIndex: 10 - i,
        }}
      >
        {/* The connector knob */}
        <div className="absolute -right-3 w-4 h-6 rounded-r-md border-y-2 border-r-2 border-black/10 z-0 bg-inherit" />
        <div className="absolute inset-1 bg-white/20 rounded-sm" /> {/* highlight */}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white border-2 border-slate-100 rounded-3xl shadow-sm">
      <div className="flex items-center" style={{ paddingRight: 12 }}>
        {groups.map((g, idx) => (
          <div key={idx} className="flex items-center">
            {renderCubes(g.n, g.color)}
            {/* Space between groups if they aren't meant to be connected, 
                but for linking cubes we usually want them in a train if part of the same equation.
                We'll add a small margin if it's a new group just to show it's a distinct part of the train */}
            {idx < groups.length - 1 && <div className="w-1" />}
          </div>
        ))}
      </div>
      
      {showNumbers && (
        <div className="flex gap-4 items-center mt-4 text-3xl font-black text-slate-700" style={{ fontFamily: FONT }}>
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
