import React from "react";
import type { SkinCtx } from "./types";

export function skinHomemAranha(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    return (
      <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Stage 5: Cosmic / Iron Spider Legs */}
        {isLegend && (
          <g fill="none" stroke="#D97706" strokeWidth="3" strokeLinecap="round">
            <path d="M 30 50 Q 10 30 15 10 Q 20 10 26 22" />
            <path d="M 30 50 Q 10 30 15 10 Q 20 10 26 22" stroke="#EF4444" strokeWidth="1" />
            
            <path d="M 70 50 Q 90 30 85 10 Q 80 10 74 22" />
            <path d="M 70 50 Q 90 30 85 10 Q 80 10 74 22" stroke="#EF4444" strokeWidth="1" />
            
            <path d="M 32 60 Q 8 72 12 90" />
            <path d="M 32 60 Q 8 72 12 90" stroke="#EF4444" strokeWidth="1" />
            
            <path d="M 68 60 Q 92 72 88 90" />
            <path d="M 68 60 Q 92 72 88 90" stroke="#EF4444" strokeWidth="1" />
          </g>
        )}

        {/* Custom Articulated Spider-Man Limbs */}
        {/* Left Leg */}
        <g>
          <path d="M 34 76 L 30 88" fill="none" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
          <path d="M 34 76 L 30 88" fill="none" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" />
          <path d="M 30 85 L 30 91 L 24 91 L 24 87 Z" fill="#E11D48" stroke="#1E293B" strokeWidth="1.5" strokeLinejoin="round" />
        </g>
        {/* Right Leg */}
        <g>
          <path d="M 66 76 L 70 88" fill="none" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
          <path d="M 66 76 L 70 88" fill="none" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" />
          <path d="M 70 85 L 70 91 L 76 91 L 76 87 Z" fill="#E11D48" stroke="#1E293B" strokeWidth="1.5" strokeLinejoin="round" />
        </g>

        {/* Left Arm - shooting web or heroic */}
        {stage >= 3 ? (
          <g>
            {/* Left Arm Outline */}
            <path d="M 26 48 C 14 44, 8 36, 10 24" fill="none" stroke="#1E293B" strokeWidth="8.5" strokeLinecap="round" />
            {/* Left Arm Fill */}
            <path d="M 26 48 C 14 44, 8 36, 10 24" fill="none" stroke="#E11D48" strokeWidth="5.5" strokeLinecap="round" />
            {/* Hand Glove Outline */}
            <circle cx="10" cy="24" r="5" fill="#1E293B" />
            <circle cx="10" cy="24" r="3.5" fill="#E11D48" />
            {/* Beautiful wavy coiling web rope */}
            <path d="M 10 24 L -15 -1" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="3,1.5" />
            <path d="M 10 24 L -15 -1" stroke="#E2E8F0" strokeWidth="1" />
            {/* Web impact / spiral */}
            <g stroke="#FFFFFF" strokeWidth="1.5" fill="none" transform="translate(10, 24) scale(0.8)">
              <circle cx="0" cy="0" r="5" />
              <circle cx="0" cy="0" r="10" />
              <line x1="-12" y1="-12" x2="12" y2="12" />
              <line x1="12" y1="-12" x2="-12" y2="12" />
            </g>
          </g>
        ) : (
          <g>
            {/* Left Arm Outline */}
            <path d="M 26 48 C 14 52, 12 60, 20 68" fill="none" stroke="#1E293B" strokeWidth="8.5" strokeLinecap="round" />
            {/* Left Arm Fill */}
            <path d="M 26 48 C 14 52, 12 60, 20 68" fill="none" stroke="#E11D48" strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="20" cy="68" r="5.5" fill="#1E293B" />
            <circle cx="20" cy="68" r="4" fill="#E11D48" />
          </g>
        )}

        {/* Right Arm */}
        <g>
          {/* Right Arm Outline */}
          <path d="M 74 48 C 86 52, 88 64, 76 68" fill="none" stroke="#1E293B" strokeWidth="8.5" strokeLinecap="round" />
          {/* Right Arm Fill */}
          <path d="M 74 48 C 86 52, 88 64, 76 68" fill="none" stroke="#E11D48" strokeWidth="5.5" strokeLinecap="round" />
          {/* Hand Glove Outline */}
          <circle cx="76" cy="68" r="5.5" fill="#1E293B" />
          <circle cx="76" cy="68" r="4" fill="#E11D48" />
        </g>

        {/* Suit base (blue sides and shoulders) */}
        <rect x={bx} y={by} width={bw} height={bh} rx={br} fill="#2563EB" />
        
        {/* Red center vest / chest area */}
        <path d={`M 50 ${by} C ${bx + bw/4} ${by}, 32 50, 32 65 L 32 ${by+bh} L 68 ${by+bh} L 68 65 C 68 50, ${bx + 3*bw/4} ${by}, 50 ${by} Z`} fill="#E11D48" />

        {/* Web details */}
        <g stroke="rgba(0,0,0,0.35)" strokeWidth="1">
          <path d={`M 50 ${by} L 50 ${by+bh}`} />
          <path d={`M 50 ${by} Q 40 45 35 ${by+bh}`} />
          <path d={`M 50 ${by} Q 60 45 65 ${by+bh}`} />
          <path d="M 36 38 Q 50 44 64 38" fill="none" />
          <path d="M 33 48 Q 50 56 67 48" fill="none" />
          <path d="M 32 58 Q 50 68 68 58" fill="none" />
        </g>

        {/* Chest Spider Symbol */}
        <g fill={isLegend ? "#FBBF24" : "#1E293B"} stroke="none">
          <circle cx="50" cy="58" r="2.5" />
          <line x1="50" y1="56" x2="50" y2="61" stroke={isLegend ? "#FBBF24" : "#1E293B"} strokeWidth="1.5" />
          <path d="M 48 57 Q 44 55 42 59" stroke={isLegend ? "#FBBF24" : "#1E293B"} strokeWidth="1" fill="none" />
          <path d="M 52 57 Q 56 55 58 59" stroke={isLegend ? "#FBBF24" : "#1E293B"} strokeWidth="1" fill="none" />
          <path d="M 48 59 Q 43 60 41 64" stroke={isLegend ? "#FBBF24" : "#1E293B"} strokeWidth="1" fill="none" />
          <path d="M 52 59 Q 57 60 59 64" stroke={isLegend ? "#FBBF24" : "#1E293B"} strokeWidth="1" fill="none" />
        </g>

        {/* Big Spider-Man eyes */}
        <g stroke="#1E293B" strokeWidth="3" fill="#FFFFFF">
          <path d="M 34 44 Q 42 43 45 48 Q 42 54 34 50 Z" />
          <path d="M 66 44 Q 58 43 55 48 Q 58 54 66 50 Z" />
        </g>
      </g>
    );
  }
}

export function skinBatman(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const batmanColor = isLegend ? "#111827" : "#374151";
    const capeColor = isLegend ? "#030712" : "#1F2937";
    return (
      <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Stage 5: Hellbat Wings */}
        {isLegend && (
          <g fill="#111827" stroke="#EF4444" strokeWidth="2">
            <path d="M 28 50 C 5 40, -10 20, -5 5 C 2 20, 15 35, 28 45 Z" />
            <path d="M -5 5 Q 10 20 20 42" fill="none" />
            <path d="M 72 50 C 95 40, 110 20, 105 5 C 98 20, 85 35, 72 45 Z" />
            <path d="M 105 5 Q 90 20 80 42" fill="none" />
          </g>
        )}

        {/* Cape hanging down */}
        <path d="M 22 55 L 12 85 Q 50 92 88 85 L 78 55 Z" fill={capeColor} />

        {/* Custom Articulated Batman Limbs */}
        {/* Left Leg */}
        <g>
          <path d="M 34 76 L 30 88" fill="none" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
          <path d="M 34 76 L 30 88" fill="none" stroke={batmanColor} strokeWidth="5" strokeLinecap="round" />
          <path d="M 30 85 L 30 91 L 24 91 L 24 87 Z" fill="#111827" stroke="#1E293B" strokeWidth="1.5" strokeLinejoin="round" />
        </g>
        {/* Right Leg */}
        <g>
          <path d="M 66 76 L 70 88" fill="none" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
          <path d="M 66 76 L 70 88" fill="none" stroke={batmanColor} strokeWidth="5" strokeLinecap="round" />
          <path d="M 70 85 L 70 91 L 76 91 L 76 87 Z" fill="#111827" stroke="#1E293B" strokeWidth="1.5" strokeLinejoin="round" />
        </g>

        {/* Left Arm with gauntlet spikes */}
        <g>
          <path d="M 26 48 C 14 52, 12 60, 20 68" fill="none" stroke="#1E293B" strokeWidth="8.5" strokeLinecap="round" />
          <path d="M 26 48 C 14 52, 12 60, 20 68" fill="none" stroke={batmanColor} strokeWidth="5.5" strokeLinecap="round" />
          {stage >= 3 && (
            <g fill="#111827" stroke="#1E293B" strokeWidth="1.5">
              <polygon points="13,56 7,54 12,60" />
              <polygon points="15,62 9,60 14,66" />
            </g>
          )}
          <circle cx="20" cy="68" r="5.5" fill="#1E293B" />
          <circle cx="20" cy="68" r="4" fill="#111827" />
        </g>

        {/* Right Arm with gauntlet spikes */}
        <g>
          <path d="M 74 48 C 86 52, 88 60, 80 68" fill="none" stroke="#1E293B" strokeWidth="8.5" strokeLinecap="round" />
          <path d="M 74 48 C 86 52, 88 60, 80 68" fill="none" stroke={batmanColor} strokeWidth="5.5" strokeLinecap="round" />
          {stage >= 3 && (
            <g fill="#111827" stroke="#1E293B" strokeWidth="1.5">
              <polygon points="87,56 93,54 88,60" />
              <polygon points="85,62 91,60 86,66" />
            </g>
          )}
          <circle cx="80" cy="68" r="5.5" fill="#1E293B" />
          <circle cx="80" cy="68" r="4" fill="#111827" />
        </g>

        {/* Batman cowl & body */}
        <rect x={bx} y={by} width={bw} height={bh} rx={br} fill={batmanColor} />
        
        {/* Cowl Face Mask Cutout (fixed yellow snout to a sharp heroic jaw cutout) */}
        <path d="M 35 60 L 46 60 L 50 65 L 54 60 L 65 60 L 63 74 Q 50 77 37 74 Z" fill="#FDBA74" stroke="#1E293B" strokeWidth="2" />

        {/* Pointy Bat Ears */}
        <polygon points={`${bx+4},${by+3} ${bx+4},${by-12} ${bx+14},${by}`} fill={batmanColor} />
        <polygon points={`${bx+bw-4},${by+3} ${bx+bw-4},${by-12} ${bx+bw-14},${by}`} fill={batmanColor} />

        {/* Bat Chest Symbol */}
        <g fill={isLegend ? "#EF4444" : "#FBBF24"}>
          <ellipse cx="50" cy="52" rx="11" ry="5.5" stroke={isLegend ? "#EF4444" : "#1E293B"} strokeWidth="1.5" />
          <path d="M 42 52 Q 46 54 50 49 Q 54 54 58 52 Q 56 48 53 50 L 51 47 L 49 47 L 47 50 Q 44 48 42 52 Z" fill="#111827" stroke="none" />
        </g>

        {/* Utility Belt for stage >= 3 */}
        {stage >= 3 && (
          <g fill="#FBBF24" stroke="#1E293B" strokeWidth="1.5">
            <rect x={bx + 6} y={by + bh - 8} width={bw - 12} height={5} rx={1} />
            <rect x="47" y={by + bh - 10} width={6} height={8} fill="#E2E8F0" />
          </g>
        )}

        {/* Glowing White/Red Slit Eyes */}
        <g fill={isLegend ? "#EF4444" : "#FFFFFF"} stroke="none">
          <polygon points="36,44 46,46 44,48 37,47" />
          <polygon points="64,44 54,46 56,48 63,47" />
        </g>

        {/* Mouth */}
        {isHappy ? (
          <path d="M 46 68 Q 50 73 54 68" stroke="#1E293B" strokeWidth="2" fill="none" />
        ) : (
          <line x1="46" y1="70" x2="54" y2="70" stroke="#1E293B" strokeWidth="2.5" />
        )}
      </g>
    );
  }
}

export function skinPanteraNegra(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    return (
      <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Sleek black panther limbs with silver claws */}
        {renderLimbs({
          armFill: "#1E293B",
          handFill: "#475569",
          legFill: "#1E293B",
          bootFill: "#0F172A",
          hasClaws: stage >= 3,
        })}

        {/* Body */}
        <rect x={bx} y={by} width={bw} height={bh} rx={br} fill="#1E293B" />

        {/* Small Pointy Cat Ears */}
        <polygon points={`${bx+4},${by+3} ${bx+4},${by-6} ${bx+12},${by}`} fill="#1E293B" />
        <polygon points={`${bx+bw-4},${by+3} ${bx+bw-4},${by-6} ${bx+bw-12},${by}`} fill="#1E293B" />

        {/* Silver Claw Necklace */}
        <path d={`M ${bx+4} 45 Q 50 56 ${bx+bw-4} 45`} fill="none" stroke="#94A3B8" strokeWidth="2" />
        <polygon points="46,52 48,56 47,52" fill="#94A3B8" stroke="none" />
        <polygon points="50,53 52,58 51,53" fill="#94A3B8" stroke="none" />
        <polygon points="54,52 56,56 55,52" fill="#94A3B8" stroke="none" />

        {/* Glowing Purple Kinetic suit accents (Stage 5) */}
        {isLegend && (
          <g stroke="#A855F7" strokeWidth="2" fill="none" className="animate-pulse">
            <path d={`M ${bx+10} 58 Q 50 66 ${bx+bw-10} 58`} />
            <line x1={bx+6} y1="36" x2={bx+14} y2="40" />
            <line x1={bx+bw-6} y1="36" x2={bx+bw-14} y2="40" />
          </g>
        )}

        {/* Slit Glowing Eyes */}
        <g fill={isLegend ? "#A855F7" : "#FFFFFF"} stroke="none">
          <polygon points="36,44 46,45 44,48 37,47" />
          <polygon points="64,44 54,45 55,48 63,47" />
        </g>

        {/* Face nose and cheeks */}
        <polygon points="48,50 52,50 50,52" fill="#94A3B8" stroke="none" />
        <path d="M 47 55 Q 50 58 53 55" stroke="#1E293B" strokeWidth="2" fill="none" />
      </g>
    );
  }
}
