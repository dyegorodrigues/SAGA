import React, { useMemo } from "react";

export interface ScatteredItemsProps {
  n: number;
  emoji: string;
  ordered?: boolean;
}

export function ScatteredItems({ n, emoji, ordered = false }: ScatteredItemsProps) {
  // Use useMemo with deterministic random seed based on n and emoji so it doesn't flicker
  const positions = useMemo(() => {
    if (ordered) {
      // Just normal grid layout
      return Array.from({ length: n }).map((_, i) => ({ x: 0, y: 0, isGrid: true }));
    }
    
    const pos: {x: number, y: number}[] = [];
    // simple pseudo random generator to keep positions stable across renders
    let seed = n * 13 + emoji.charCodeAt(0);
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const SIZE = 20; // percent size of item to avoid overlap
    for (let i = 0; i < n; i++) {
      let attempts = 0;
      let x = 0, y = 0;
      let overlap = true;
      while (overlap && attempts < 50) {
        x = 10 + random() * 80; // 10% to 90%
        y = 10 + random() * 80;
        overlap = pos.some(p => Math.abs(p.x - x) < SIZE && Math.abs(p.y - y) < SIZE);
        attempts++;
      }
      pos.push({ x, y });
    }
    return pos;
  }, [n, emoji, ordered]);

  if (ordered) {
    return (
      <div className="flex flex-wrap justify-center gap-6 max-w-2xl mx-auto p-8 bg-white border-2 border-slate-100 rounded-3xl shadow-sm">
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} className="text-6xl" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}>
            {emoji}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-[16/9] bg-white border-2 border-slate-100 rounded-3xl shadow-sm overflow-hidden">
      {positions.map((p, i) => (
        <div 
          key={i} 
          className="absolute text-5xl md:text-6xl transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110"
          style={{ 
            left: `${p.x}%`, 
            top: `${p.y}%`,
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" 
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}
