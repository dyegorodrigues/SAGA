import React from "react";
import type { SkinCtx, LimbConfig } from "./types";

export function skinHomemFerroHd(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const floatY = animation === "happy" ? -3 : animation === "walk" ? -1 : 0;
    return (
      <g stroke="none" transform={`translate(0, ${floatY})`}>
        <defs>
          <linearGradient id="ironHD_Red" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
          <linearGradient id="ironHD_Gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
          <linearGradient id="ironHD_Glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>

        {/* Ambient shadow */}
        <ellipse cx="50" cy="85" rx="20" ry="4" fill="#000000" opacity="0.25" />

        {/* Stage 5 Supreme Wings */}
        {isLegend && (
          <g className="animate-pulse">
            <polygon points="20,40 10,25 5,45 15,55" fill="url(#ironHD_Red)" stroke="#7F1D1D" strokeWidth="1.5" />
            <polygon points="80,40 90,25 95,45 85,55" fill="url(#ironHD_Red)" stroke="#7F1D1D" strokeWidth="1.5" />
            <circle cx="10" cy="25" r="3" fill="#22D3EE" />
            <circle cx="90" cy="25" r="3" fill="#22D3EE" />
          </g>
        )}

        {/* Armored Limbs */}
        <g stroke="#7F1D1D" strokeWidth="1.5">
          {/* Left Arm */}
          <rect x="20" y="46" width="6" height="15" rx="2" fill="url(#ironHD_Red)" />
          <circle cx="23" cy="61" r="3.5" fill="url(#ironHD_Gold)" />
          {/* Right Arm */}
          <rect x="74" y="46" width="6" height="15" rx="2" fill="url(#ironHD_Red)" />
          <circle cx="77" cy="61" r="3.5" fill="url(#ironHD_Gold)" />
          
          {/* Legs */}
          <rect x="36" y="74" width="8" height="10" rx="1.5" fill="url(#ironHD_Red)" />
          <rect x="56" y="74" width="8" height="10" rx="1.5" fill="url(#ironHD_Red)" />
          <rect x="34" y="82" width="10" height="4" rx="1" fill="url(#ironHD_Gold)" />
          <rect x="56" y="82" width="10" height="4" rx="1" fill="url(#ironHD_Gold)" />
        </g>

        {/* Body Chassis */}
        <rect x="26" y="44" width="48" height="32" rx="4" fill="url(#ironHD_Red)" stroke="#7F1D1D" strokeWidth="1.5" />
        <rect x="32" y="44" width="36" height="18" fill="url(#ironHD_Gold)" stroke="#7F1D1D" strokeWidth="1" />

        {/* Arc Reactor */}
        <circle cx="50" cy="65" r="7.5" fill="#1E293B" stroke="#7F1D1D" strokeWidth="1" />
        <circle cx="50" cy="65" r="5" fill="url(#ironHD_Glow)" className="animate-pulse" />

        {/* Golden Mask Head */}
        <rect x="30" y="16" width="40" height="30" rx="6" fill="url(#ironHD_Red)" stroke="#7F1D1D" strokeWidth="1.5" />
        <path d="M 34 22 L 66 22 L 62 42 L 50 46 L 38 42 Z" fill="url(#ironHD_Gold)" stroke="#7F1D1D" strokeWidth="1" />

        {/* Shimmer Eye Slots */}
        <g fill="#FFFFFF" stroke="#0891B2" strokeWidth="1">
          <polygon points="38,28 46,28 44,32 39,32" />
          <polygon points="62,28 54,28 56,32 61,32" />
        </g>
      </g>
    );
  }
}

export function skinHomemAranhaHd(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const floatY = animation === "happy" ? -3 : animation === "walk" ? -1 : 0;
    return (
      <g stroke="none" transform={`translate(0, ${floatY})`}>
        <defs>
          <linearGradient id="spideyHD_Red" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
          <linearGradient id="spideyHD_Blue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>

        {/* Ambient shadow */}
        <ellipse cx="50" cy="85" rx="20" ry="4" fill="#000000" opacity="0.25" />

        {/* Iron Spider Gold Claws */}
        {isLegend && (
          <g stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path d="M 30 50 Q 12 34 16 14" />
            <path d="M 70 50 Q 88 34 84 14" />
            <path d="M 30 65 Q 10 74 18 84" />
            <path d="M 70 65 Q 90 74 82 84" />
            <circle cx="16" cy="14" r="2.5" fill="#FBBF24" stroke="none" />
            <circle cx="84" cy="14" r="2.5" fill="#FBBF24" stroke="none" />
          </g>
        )}

        {/* Limbs */}
        <g stroke="#1E293B" strokeWidth="1.5">
          <rect x="20" y="46" width="6" height="15" rx="2" fill="url(#spideyHD_Red)" />
          <rect x="74" y="46" width="6" height="15" rx="2" fill="url(#spideyHD_Red)" />
          <rect x="36" y="74" width="8" height="10" rx="1.5" fill="url(#spideyHD_Blue)" />
          <rect x="56" y="74" width="8" height="10" rx="1.5" fill="url(#spideyHD_Blue)" />
          <rect x="34" y="82" width="10" height="4" rx="1" fill="url(#spideyHD_Red)" />
          <rect x="56" y="82" width="10" height="4" rx="1" fill="url(#spideyHD_Red)" />
        </g>

        {/* Body Suit */}
        <rect x="26" y="44" width="48" height="32" rx="4" fill="url(#spideyHD_Blue)" stroke="#1E293B" strokeWidth="1.5" />
        <path d="M 40 44 L 60 44 L 56 76 L 44 76 Z" fill="url(#spideyHD_Red)" stroke="#1E293B" strokeWidth="1" />

        {/* Web Texture lines */}
        <g stroke="rgba(0,0,0,0.3)" strokeWidth="1" fill="none">
          <line x1="50" y1="44" x2="50" y2="76" />
          <line x1="44" y1="50" x2="56" y2="50" />
          <line x1="42" y1="62" x2="58" y2="62" />
        </g>

        {/* Spider Emblem */}
        <circle cx="50" cy="56" r="2" fill="#111827" />
        <line x1="50" y1="53" x2="50" y2="59" stroke="#111827" strokeWidth="1.5" />
        <path d="M 46 55 Q 50 58 54 55 M 46 58 Q 50 61 54 58" stroke="#111827" strokeWidth="1" />

        {/* Head */}
        <rect x="30" y="16" width="40" height="30" rx="14" fill="url(#spideyHD_Red)" stroke="#1E293B" strokeWidth="1.5" />
        
        {/* Head web pattern */}
        <g stroke="rgba(0,0,0,0.25)" strokeWidth="0.75" fill="none">
          <circle cx="50" cy="31" r="8" />
          <circle cx="50" cy="31" r="14" />
          <line x1="30" y1="31" x2="70" y2="31" />
          <line x1="50" y1="16" x2="50" y2="46" />
        </g>

        {/* Gorgeous Web Eyes */}
        <g stroke="#1E293B" strokeWidth="2.5" fill="#FFFFFF">
          <path d="M 33 27 Q 41 26 44 32 Q 40 38 33 34 Z" />
          <path d="M 67 27 Q 59 26 56 32 Q 60 38 67 34 Z" />
        </g>
      </g>
    );
  }
}

export function skinCapitaoAmericaHd(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const floatY = animation === "happy" ? -3 : animation === "walk" ? -1 : 0;
    return (
      <g stroke="none" transform={`translate(0, ${floatY})`}>
        <defs>
          <linearGradient id="capHD_Blue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
          <linearGradient id="capHD_Red" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
        </defs>

        {/* Ambient shadow */}
        <ellipse cx="50" cy="85" rx="20" ry="4" fill="#000000" opacity="0.25" />

        {/* Energy aura stars */}
        {isLegend && (
          <g className="animate-pulse" fill="#60A5FA" opacity="0.8">
            <polygon points="12,24 14,26 12,28 10,26" />
            <polygon points="88,24 90,26 88,28 86,26" />
          </g>
        )}

        {/* Limbs */}
        <g stroke="#1E3A8A" strokeWidth="1.5">
          <rect x="20" y="46" width="6" height="15" rx="2" fill="url(#capHD_Blue)" />
          <rect x="74" y="46" width="6" height="15" rx="2" fill="url(#capHD_Blue)" />
          <rect x="36" y="74" width="8" height="10" rx="1.5" fill="url(#capHD_Blue)" />
          <rect x="56" y="74" width="8" height="10" rx="1.5" fill="url(#capHD_Blue)" />
          <rect x="34" y="82" width="10" height="4" rx="1" fill="url(#capHD_Red)" />
          <rect x="56" y="82" width="10" height="4" rx="1" fill="url(#capHD_Red)" />
        </g>

        {/* Body Uniform */}
        <rect x="26" y="44" width="48" height="32" rx="4" fill="url(#capHD_Blue)" stroke="#1E3A8A" strokeWidth="1.5" />
        
        {/* Red and White striped belly plates */}
        <rect x="32" y="60" width="36" height="16" fill="#FFFFFF" stroke="#1E3A8A" strokeWidth="1" />
        <rect x="36" y="60" width="5" height="16" fill="url(#capHD_Red)" stroke="none" />
        <rect x="47" y="60" width="5" height="16" fill="url(#capHD_Red)" stroke="none" />
        <rect x="58" y="60" width="5" height="16" fill="url(#capHD_Red)" stroke="none" />

        {/* Silver Chest Star */}
        <polygon points="50,47 52,52 57,52 53,55 55,60 50,57 45,60 47,55 43,52 48,52" fill="#FFFFFF" stroke="none" />

        {/* Iconic Round Shield held in left arm */}
        <g transform="translate(14, 52) scale(0.48)">
          <circle cx="50" cy="50" r="24" fill="url(#capHD_Red)" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="18" fill="#F1F5F9" stroke="#1E293B" strokeWidth="2" />
          <circle cx="50" cy="50" r="12" fill="url(#capHD_Red)" stroke="#1E293B" strokeWidth="2" />
          <circle cx="50" cy="50" r="7" fill="url(#capHD_Blue)" stroke="none" />
          <polygon points="50,45 52,48 56,48 53,50 54,54 50,52 46,54 47,50 44,48 48,48" fill="#FFFFFF" stroke="none" />
        </g>

        {/* Helmet Head */}
        <rect x="30" y="16" width="40" height="30" rx="8" fill="url(#capHD_Blue)" stroke="#1E3A8A" strokeWidth="1.5" />
        
        {/* Helmet Wing decals */}
        <path d="M 32 24 Q 24 22 28 16 Q 32 20 32 24" fill="#FFFFFF" />
        <path d="M 68 24 Q 76 22 72 16 Q 68 20 68 24" fill="#FFFFFF" />
        <text x="50" y="27" fontSize="10" fontWeight="900" fill="#FFFFFF" textAnchor="middle" stroke="none">A</text>

        {/* Eyes & Smiling Mouth */}
        <g fill="#1E293B" stroke="none">
          <circle cx="41" cy="34" r="3" />
          <circle cx="59" cy="34" r="3" />
          <circle cx="42" cy="32.5" r="0.8" fill="#FFFFFF" />
          <circle cx="60" cy="32.5" r="0.8" fill="#FFFFFF" />
        </g>
        <path d="M 46 40 Q 50 43 54 40" stroke="#1E293B" strokeWidth="2" fill="none" />
      </g>
    );
  }
}
