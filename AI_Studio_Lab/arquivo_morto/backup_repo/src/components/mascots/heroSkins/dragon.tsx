import React from "react";
import type { SkinCtx } from "./types";

export function skinDragaoFogo(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const leftWingPath = stage >= 4 
      ? "M 28 45 C 10 32, -15 15, -5 5 C 10 12, 18 28, 28 38 Z" 
      : stage === 3 
        ? "M 32 48 C 18 36, -2 24, 5 18 C 15 22, 22 36, 32 44 Z"
        : "M 34 50 C 24 42, 8 32, 14 28 C 22 30, 26 42, 34 46 Z";

    const rightWingPath = stage >= 4 
      ? "M 72 45 C 90 32, 115 15, 105 5 C 90 12, 82 28, 72 38 Z" 
      : stage === 3 
        ? "M 68 48 C 82 36, 102 24, 95 18 C 85 22, 78 36, 68 44 Z"
        : "M 66 50 C 76 42, 92 32, 86 28 C 78 30, 74 42, 66 46 Z";

    const tailPath = stage >= 4
      ? "M 34 76 Q 14 86, 6 68 Q 12 58, 26 71"
      : "M 34 76 Q 20 82, 14 70 Q 20 64, 28 72";

    return (
      <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Tail underneath */}
        <g>
          <path d={tailPath} fill="#DC2626" />
          {/* Flame at tail tip */}
          <circle cx={stage >= 4 ? 6 : 14} cy={stage >= 4 ? 68 : 70} r={stage >= 4 ? 7 : 5} fill="#F97316" className="animate-pulse" stroke="none" />
          <circle cx={stage >= 4 ? 6 : 14} cy={stage >= 4 ? 68 : 70} r={stage >= 4 ? 4 : 2.5} fill="#FBBF24" className="animate-pulse" stroke="none" />
        </g>

        {/* Majestic Dragon Wings with Shading and Membrane veins */}
        <g>
          {/* Left Wing */}
          <path d={leftWingPath} fill="#991B1B" />
          <path d={leftWingPath} fill="#EF4444" transform="scale(0.85) translate(4, 4)" stroke="none" />
          {/* Left Wing Membrane Veins */}
          <path d="M 12 25 Q 18 36 28 38 M 5 18 Q 15 28 28 38" fill="none" stroke="#7F1D1D" strokeWidth="1.5" />

          {/* Right Wing */}
          <path d={rightWingPath} fill="#991B1B" />
          <path d={rightWingPath} fill="#EF4444" transform="scale(0.85) translate(4, 4)" stroke="none" />
          {/* Right Wing Membrane Veins */}
          <path d="M 88 25 Q 82 36 72 38 M 95 18 Q 85 28 72 38" fill="none" stroke="#7F1D1D" strokeWidth="1.5" />
        </g>

        {/* Custom Dragon Claw Limbs */}
        {/* Left Leg with sharp claws */}
        <g>
          <path d="M 34 76 L 30 88" fill="none" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
          <path d="M 34 76 L 30 88" fill="none" stroke="#DC2626" strokeWidth="5" strokeLinecap="round" />
          <g transform="translate(24, 86)" fill="#FEF08A" stroke="#1E293B" strokeWidth="1.5">
            <polygon points="0,5 -3,1 3,1" />
            <polygon points="4,5 2,0 7,1" />
            <polygon points="8,5 7,1 11,2" />
            <rect x="-1" y="4" width="9" height="3" fill="#DC2626" stroke="#1E293B" strokeWidth="1.5" rx="1" />
          </g>
        </g>
        {/* Right Leg with sharp claws */}
        <g>
          <path d="M 66 76 L 70 88" fill="none" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
          <path d="M 66 76 L 70 88" fill="none" stroke="#DC2626" strokeWidth="5" strokeLinecap="round" />
          <g transform="translate(66, 86)" fill="#FEF08A" stroke="#1E293B" strokeWidth="1.5">
            <polygon points="0,5 -3,1 3,1" />
            <polygon points="4,5 2,0 7,1" />
            <polygon points="8,5 7,1 11,2" />
            <rect x="-1" y="4" width="9" height="3" fill="#DC2626" stroke="#1E293B" strokeWidth="1.5" rx="1" />
          </g>
        </g>

        {/* Left Arm Claw */}
        <g>
          <path d="M 26 52 C 14 54, 12 42, 16 34" fill="none" stroke="#1E293B" strokeWidth="6.5" strokeLinecap="round" />
          <path d="M 26 52 C 14 54, 12 42, 16 34" fill="none" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
          <polygon points="16,34 11,30 16,30" fill="#FEF08A" stroke="#1E293B" strokeWidth="1" />
          <polygon points="17,35 14,38 19,37" fill="#FEF08A" stroke="#1E293B" strokeWidth="1" />
        </g>
        {/* Right Arm Claw */}
        <g>
          <path d="M 74 52 C 86 54, 88 42, 84 34" fill="none" stroke="#1E293B" strokeWidth="6.5" strokeLinecap="round" />
          <path d="M 74 52 C 86 54, 88 42, 84 34" fill="none" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
          <polygon points="84,34 89,30 84,30" fill="#FEF08A" stroke="#1E293B" strokeWidth="1" />
          <polygon points="83,35 86,38 81,37" fill="#FEF08A" stroke="#1E293B" strokeWidth="1" />
        </g>

        {/* Body Base */}
        <rect x={bx} y={by} width={bw} height={bh} rx={br} fill="#DC2626" />

        {/* Ribbed Yellow/Orange Underbelly Plate */}
        <path d={`M 40 ${by+bh/2} Q 50 ${by+bh/2+5} 60 ${by+bh/2} L 56 ${by+bh} Q 50 ${by+bh-2} 44 ${by+bh} Z`} fill="#FDE047" />
        <line x1="43" y1={by+bh/2+4} x2="57" y2={by+bh/2+4} stroke="#B45309" strokeWidth="1.5" />
        <line x1="44" y1={by+bh/2+12} x2="56" y2={by+bh/2+12} stroke="#B45309" strokeWidth="1.5" />
        <line x1="45" y1={by+bh/2+20} x2="55" y2={by+bh/2+20} stroke="#B45309" strokeWidth="1.5" />

        {/* Back dragon scales/spikes */}
        <g fill="#EF4444">
          <polygon points={`${bx+4},${by+12} ${bx-2},${by+8} ${bx+4},${by+4}`} />
          <polygon points={`${bx+bw-4},${by+12} ${bx+bw+2},${by+8} ${bx+bw-4},${by+4}`} />
          <polygon points={`${bx+4},${by+24} ${bx-2},${by+20} ${bx+4},${by+16}`} />
          <polygon points={`${bx+bw-4},${by+24} ${bx+bw+2},${by+20} ${bx+bw-4},${by+16}`} />
        </g>

        {/* Majestic curved dragon horns */}
        <g stroke="#1E293B" strokeWidth="2" fill="#FDE047">
          <path d={`M ${bx+10} ${by+2} Q ${bx-4} ${by-16} ${bx+6} ${by-22} Q ${bx+6} ${by-12} ${bx+16} ${by+2}`} />
          <path d={`M ${bx+bw-10} ${by+2} Q ${bx+bw+4} ${by-16} ${bx+bw-6} ${by-22} Q ${bx+bw-6} ${by-12} ${bx+bw-16} ${by+2}`} />
        </g>

        {/* Glowing Golden Eyes */}
        <g fill="#FBBF24" stroke="#D97706" strokeWidth="1">
          <circle cx="39" cy="48" r="4.5" />
          <circle cx="61" cy="48" r="4.5" />
          <circle cx="40.5" cy="46" r="1.5" fill="#FFFFFF" stroke="none" />
          <circle cx="62.5" cy="46" r="1.5" fill="#FFFFFF" stroke="none" />
        </g>

        {/* Majestic dragon muzzle snout with sharp fangs */}
        <g>
          <path d="M 36 53 Q 50 62 64 53 Z" fill="#DC2626" stroke="#1E293B" strokeWidth="2" />
          <circle cx="45" cy="56" r="1.2" fill="#1E293B" stroke="none" />
          <circle cx="55" cy="56" r="1.2" fill="#1E293B" stroke="none" />
          {/* Tiny cute sharp fangs */}
          <polygon points="40,56 42,60 44,56" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />
          <polygon points="56,56 58,60 60,56" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />
        </g>

        {/* Cute puffing embers/particles */}
        <g className="animate-pulse" fill="#F97316" stroke="none">
          <circle cx="35" cy="62" r="1.5" />
          <circle cx="65" cy="62" r="1.5" />
          <circle cx="50" cy="64" r="2" fill="#EF4444" />
        </g>

        {/* Legendary Corona Aura (Stage 5) */}
        {isLegend && (
          <g stroke="#EF4444" strokeWidth="2.5" fill="none" className="animate-pulse">
            {/* Crown of extra horns */}
            <polygon points="50,14 47,-2 53,-2" fill="#FEF08A" stroke="#1E293B" strokeWidth="2" />
            {/* Sparkling legendary fire rings */}
            <circle cx="50" cy="50" r="41" strokeDasharray="4,8" />
            <circle cx="50" cy="50" r="44" stroke="#FBBF24" strokeDasharray="2,6" />
          </g>
        )}
      </g>
    );
  }
}
