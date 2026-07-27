import React from "react";
import type { SkinCtx, LimbConfig } from "./types";

export function skinThorHd(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const floatY = animation === "happy" ? -3 : animation === "walk" ? -1 : 0;
    return (
      <g stroke="none" transform={`translate(0, ${floatY})`}>
        <defs>
          <linearGradient id="thorHD_Hair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          <linearGradient id="thorHD_Steel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="thorHD_Red" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
        </defs>

        {/* Ambient shadow */}
        <ellipse cx="50" cy="85" rx="20" ry="4" fill="#000000" opacity="0.25" />

        {/* Red velvet cape behind body */}
        <path d="M 28 46 L 12 80 Q 50 86 88 80 L 72 46 Z" fill="url(#thorHD_Red)" stroke="#7F1D1D" strokeWidth="1" />

        {/* Limbs */}
        <g stroke="#1E293B" strokeWidth="1.5">
          <rect x="20" y="46" width="6" height="15" rx="2" fill="#FED7AA" />
          <rect x="74" y="46" width="6" height="15" rx="2" fill="#FED7AA" />
          <rect x="36" y="74" width="8" height="10" rx="1.5" fill="url(#thorHD_Steel)" />
          <rect x="56" y="74" width="8" height="10" rx="1.5" fill="url(#thorHD_Steel)" />
          <rect x="34" y="82" width="10" height="4" rx="1" fill="url(#thorHD_Red)" />
          <rect x="56" y="82" width="10" height="4" rx="1" fill="url(#thorHD_Red)" />
        </g>

        {/* Thor's Long flowing hair behind back */}
        <path d="M 32 46 C 16 56, 14 68, 22 78 C 26 78, 30 65, 30 46 Z" fill="url(#thorHD_Hair)" stroke="#7F1D1D" strokeWidth="1.5" />
        <path d="M 68 46 C 84 56, 86 68, 78 78 C 74 78, 70 65, 70 46 Z" fill="url(#thorHD_Hair)" stroke="#7F1D1D" strokeWidth="1.5" />

        {/* Body Armor */}
        <rect x="26" y="44" width="48" height="32" rx="4" fill="#1E293B" stroke="#1E293B" strokeWidth="1.5" />
        {/* Silver circular chest plates */}
        <circle cx="36" cy="52" r="4" fill="url(#thorHD_Steel)" />
        <circle cx="64" cy="52" r="4" fill="url(#thorHD_Steel)" />
        <circle cx="36" cy="66" r="4" fill="url(#thorHD_Steel)" />
        <circle cx="64" cy="66" r="4" fill="url(#thorHD_Steel)" />

        {/* Legendary Mjolnir Hammer held in right hand */}
        <g transform="translate(68, 48) scale(0.65)" stroke="#1E293B" strokeWidth="2.5">
          <rect x="47" y="38" width="6" height="28" fill="#78350F" />
          <rect x="34" y="16" width="32" height="22" rx="3" fill="url(#thorHD_Steel)" />
          <rect x="34" y="24" width="32" height="6" fill="#F1F5F9" stroke="none" />
        </g>

        {/* Dynamic lightning sparks (Legendary stage) */}
        {stage >= 4 && (
          <g stroke="#22D3EE" strokeWidth="1.5" fill="none" className="animate-pulse">
            <path d="M 85 45 L 94 30 L 86 24 L 98 12" />
            <path d="M 72 38 L 62 26 L 68 18" />
          </g>
        )}

        {/* Head */}
        <rect x="30" y="16" width="40" height="30" rx="8" fill="#FED7AA" stroke="#1E293B" strokeWidth="1.5" />
        
        {/* Helmet crown */}
        <path d="M 30 16 Q 50 10 70 16" stroke="#1E293B" strokeWidth="2.5" fill="none" />
        <polygon points="30,16 22,6 32,12" fill="url(#thorHD_Steel)" stroke="#1E293B" strokeWidth="1.5" />
        <polygon points="70,16 78,6 68,12" fill="url(#thorHD_Steel)" stroke="#1E293B" strokeWidth="1.5" />

        {/* Glowing Blue Eyes & Mouth */}
        <g fill="#22D3EE" stroke="#0891B2" strokeWidth="1">
          <circle cx="41" cy="32" r="3.5" />
          <circle cx="59" cy="32" r="3.5" />
          <circle cx="42" cy="30.5" r="1" fill="#FFFFFF" stroke="none" />
          <circle cx="60" cy="30.5" r="1" fill="#FFFFFF" stroke="none" />
        </g>
        <path d="M 46 39 Q 50 42 54 39" stroke="#1E293B" strokeWidth="2" fill="none" />
      </g>
    );
  }
}

export function skinDino(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const isHappy = animation === "happy";
    const tailPath = stage === 2 
      ? `M ${bx+10} ${by+bh-10} Q ${bx-16} ${by+bh+4} ${bx-8} ${by+bh-16}`
      : `M ${bx+12} ${by+bh-12} Q ${bx-30} ${by+bh+8} ${bx-12} ${by+bh-20}`;

    return (
      <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Dinosaur Tail with back ridge scales */}
        <path d={tailPath} fill={color} />
        
        {/* Tail Spikes running to the end */}
        {stage >= 2 && (
          <g fill="#F97316" stroke="#1E293B" strokeWidth="1.5">
            <polygon points={`${bx-16},${by+bh-4} ${bx-24},${by+bh-10} ${bx-14},${by+bh-15}`} />
            {stage >= 3 && (
              <polygon points={`${bx-10},${by+bh-14} ${bx-18},${by+bh-22} ${bx-8},${by+bh-20}`} />
            )}
          </g>
        )}

        {/* Dragon wings for stage 5 (Legendary evolution) */}
        {isLegend && (
          <g fill="#F97316" stroke="#1E293B" strokeWidth="2" className="animate-pulse">
            <path d="M 28 45 C 4 35, 2 12, 10 5 C 16 18, 22 30, 28 35 Z" />
            <path d="M 28 35 C 14 36, 10 44, 4 45 Z" fill="#EA580C" stroke="none" />
            <path d="M 72 45 C 96 35, 98 12, 90 5 C 84 18, 78 30, 72 35 Z" />
            <path d="M 72 35 C 86 36, 90 44, 96 45 Z" fill="#EA580C" stroke="none" />
          </g>
        )}

        {/* Custom Articulated Dinosaur Limbs */}
        {/* Left Leg with sharp white claws */}
        <g>
          <path d="M 34 76 L 30 88" fill="none" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
          <path d="M 34 76 L 30 88" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
          {/* Dinosaur three-toed foot with white claws */}
          <g transform="translate(24, 86)" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5">
            <polygon points="0,5 -4,1 4,1" />
            <polygon points="4,5 2,0 8,1" />
            <polygon points="8,5 8,0 12,2" />
            <rect x="-1" y="4" width="10" height="3" fill={color} stroke="#1E293B" strokeWidth="1.5" rx="1" />
          </g>
        </g>
        {/* Right Leg with sharp white claws */}
        <g>
          <path d="M 66 76 L 70 88" fill="none" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
          <path d="M 66 76 L 70 88" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
          {/* Dinosaur three-toed foot with white claws */}
          <g transform="translate(66, 86)" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5">
            <polygon points="0,5 -4,1 4,1" />
            <polygon points="4,5 2,0 8,1" />
            <polygon points="8,5 8,0 12,2" />
            <rect x="-1" y="4" width="10" height="3" fill={color} stroke="#1E293B" strokeWidth="1.5" rx="1" />
          </g>
        </g>

        {/* Articulated dinosaur arms */}
        {/* Left Arm */}
        <g>
          <path d="M 26 52 C 14 54, 12 42, 16 34" fill="none" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
          <path d="M 26 52 C 14 54, 12 42, 16 34" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
          {/* Small sharp claws */}
          <polygon points="16,34 11,30 16,30" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />
          <polygon points="17,35 14,38 19,37" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />
        </g>
        {/* Right Arm */}
        <g>
          <path d="M 74 52 C 86 54, 88 42, 84 34" fill="none" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
          <path d="M 74 52 C 86 54, 88 42, 84 34" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
          {/* Small sharp claws */}
          <polygon points="84,34 89,30 84,30" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />
          <polygon points="83,35 86,38 81,37" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />
        </g>

        {/* Dinosaur Body */}
        <rect x={bx} y={by} width={bw} height={bh} rx={br} fill={color} />

        {/* Textured spots on skin (scales) */}
        <circle cx={bx+6} cy={by+12} r="2.5" fill="#15803D" opacity="0.35" stroke="none" />
        <circle cx={bx+11} cy={by+7} r="1.5" fill="#15803D" opacity="0.35" stroke="none" />
        <circle cx={bx+bw-6} cy={by+15} r="2" fill="#15803D" opacity="0.35" stroke="none" />
        <circle cx={bx+5} cy={by+34} r="2" fill="#15803D" opacity="0.35" stroke="none" />

        {/* Belly plate with scale segments */}
        <ellipse cx="50" cy={by+bh-12} rx={bw*0.32} ry={bh*0.22} fill="#FEF08A" stroke="#1E293B" strokeWidth="2" />
        <path d="M 38 65 Q 50 68 62 65" stroke="#EAB308" strokeWidth="1.5" fill="none" />
        <path d="M 35 73 Q 50 77 65 73" stroke="#EAB308" strokeWidth="1.5" fill="none" />

        {/* Spikes on back and head (very dino-looking!) */}
        <g fill="#F97316" stroke="#1E293B" strokeWidth="2">
          {/* Top of head spikes */}
          <polygon points="50,28 45,14 55,14" />
          <polygon points="38,29 26,18 40,24" />
          <polygon points="62,29 74,18 60,24" />
        </g>

        {/* Dinosaur Muzzle / Pronounced Snout */}
        <g>
          {/* Extended snout */}
          <rect x={bx + bw*0.1} y={by + bh*0.42} width={bw*0.8} height={bh*0.35} rx={br*0.5} fill={color} stroke="#1E293B" strokeWidth="2.5" />
          {/* Nostrils */}
          <circle cx="43" cy={by + bh*0.52} r="1.5" fill="#1E293B" stroke="none" />
          <circle cx="57" cy={by + bh*0.52} r="1.5" fill="#1E293B" stroke="none" />
        </g>

        {/* Sharp white dinosaur teeth peeking out */}
        {stage >= 3 && (
          <g fill="#FFFFFF" stroke="#1E293B" strokeWidth="1">
            <polygon points="37,60 40,65 43,60" />
            <polygon points="43,60 46,65 49,60" />
            <polygon points="51,60 54,65 57,60" />
            <polygon points="57,60 60,65 63,60" />
          </g>
        )}

        {/* Eyes */}
        <g fill="#1E293B" stroke="none">
          <circle cx="41" cy="42" r="3.5" />
          <circle cx="59" cy="42" r="3.5" />
          <circle cx="42.5" cy="40.5" r="1.2" fill="#FFFFFF" />
          <circle cx="60.5" cy="40.5" r="1.2" fill="#FFFFFF" />
        </g>

        {/* Mouth */}
        {isHappy ? (
          <path d="M 43 60 Q 50 70 57 60" fill="#EF4444" stroke="#1E293B" strokeWidth="2" />
        ) : (
          <path d="M 44 60 Q 50 63 56 60" fill="none" stroke="#1E293B" strokeWidth="2" />
        )}

        {/* Cheeks */}
        <circle cx="33" cy="47" r="2.5" fill="#F87171" opacity="0.4" stroke="none" />
        <circle cx="67" cy="47" r="2.5" fill="#F87171" opacity="0.4" stroke="none" />

        {/* Golden crown for stage 5 */}
        {isLegend && (
          <g transform="translate(0, -13)">
            <polygon points="42,24 45,16 50,21 55,16 58,24" fill="#FBBF24" stroke="#1E293B" strokeWidth="1.5" />
            <circle cx="45" cy="15" r="1" fill="#EF4444" stroke="none" />
            <circle cx="50" cy="20" r="1" fill="#3B82F6" stroke="none" />
            <circle cx="55" cy="15" r="1" fill="#EF4444" stroke="none" />
          </g>
        )}
      </g>
    );
  }
}
