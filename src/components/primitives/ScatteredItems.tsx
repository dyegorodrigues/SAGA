import React, { useMemo } from "react";

export interface ScatteredItemsProps {
  n: number;
  emoji: string;
  ordered?: boolean;
}

export interface ScatteredPosition {
  x: number;
  y: number;
}

function seedFor(n: number, emoji: string) {
  let seed = (n * 2654435761) >>> 0;
  for (const char of emoji) {
    seed = Math.imul(seed ^ (char.codePointAt(0) ?? 0), 2246822519) >>> 0;
  }
  return seed || 1;
}

function seededRandom(initialSeed: number) {
  let seed = initialSeed >>> 0;
  return () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * P22.4 — uma dispersão precisa parecer irregular sem depender da sorte para
 * caber na tela. A versão anterior sorteava coordenadas e, depois de 50
 * tentativas, aceitava a última posição mesmo quando ela ainda colidia. Com
 * 10–20 itens, isso tornava sobreposição inevitável em algumas sementes.
 *
 * Agora usamos células invisíveis embaralhadas e um jitter pequeno dentro de
 * cada célula. A criança continua vendo um conjunto espalhado, mas cada objeto
 * possui território próprio. O algoritmo é determinístico para que re-render,
 * sonda e aula mostrem a mesma cena.
 */
export function buildScatteredPositions(n: number, emoji: string): ScatteredPosition[] {
  if (n <= 0) return [];

  const cols = n <= 4 ? Math.max(1, n) : n <= 12 ? 4 : 5;
  const rows = Math.ceil(n / cols);
  const cellCount = cols * rows;
  const random = seededRandom(seedFor(n, emoji));
  const cells = Array.from({ length: cellCount }, (_, index) => index);

  // Fisher–Yates determinístico: quando a grade tem vagas, os vazios também
  // ficam dispersos em vez de formar uma última fileira artificial.
  for (let index = cells.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(random() * (index + 1));
    [cells[index], cells[swapWith]] = [cells[swapWith], cells[index]];
  }

  const cellWidth = 100 / cols;
  const cellHeight = 100 / rows;
  const jitterX = cellWidth * 0.08;
  const jitterY = cellHeight * 0.08;

  return cells.slice(0, n).map(cell => {
    const col = cell % cols;
    const row = Math.floor(cell / cols);
    const centerX = (col + 0.5) * cellWidth;
    const centerY = (row + 0.5) * cellHeight;
    return {
      x: centerX + (random() * 2 - 1) * jitterX,
      y: centerY + (random() * 2 - 1) * jitterY,
    };
  });
}

export function ScatteredItems({ n, emoji, ordered = false }: ScatteredItemsProps) {
  const positions = useMemo(
    () => (ordered ? [] : buildScatteredPositions(n, emoji)),
    [n, emoji, ordered],
  );

  if (ordered) {
    return (
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-2xl mx-auto p-5 sm:p-8 bg-white border-2 border-slate-100 rounded-3xl shadow-sm">
        {Array.from({ length: n }).map((_, i) => (
          <div
            key={i}
            className="text-4xl sm:text-5xl md:text-6xl leading-none"
            style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}
          >
            {emoji}
          </div>
        ))}
      </div>
    );
  }

  const compact = n >= 16;
  const itemClass = compact
    ? "w-8 h-8 text-3xl sm:w-10 sm:h-10 sm:text-4xl md:w-14 md:h-14 md:text-5xl"
    : "w-10 h-10 text-4xl sm:w-12 sm:h-12 sm:text-5xl md:w-16 md:h-16 md:text-6xl";

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-[4/3] bg-white border-2 border-slate-100 rounded-3xl shadow-sm overflow-hidden">
      {positions.map((p, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={`absolute ${itemClass} flex items-center justify-center leading-none select-none transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}