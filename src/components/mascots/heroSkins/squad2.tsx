import React from "react";
import type { SkinCtx, LimbConfig } from "./types";

export function skinCapitaoAmerica(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    return (
      <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Cap limbs */}
        {renderLimbs({
          armFill: "#1D4ED8",
          handFill: "#DC2626",
          legFill: "#1D4ED8",
          bootFill: "#DC2626",
        })}

        <rect x={bx} y={by} width={bw} height={bh} rx={br} fill="#1D4ED8" />

        {/* Red and White striped torso midsection */}
        <path d={`M 30 65 L 70 65 L 70 ${by+bh} L 30 ${by+bh} Z`} fill="#FFFFFF" />
        <rect x="36" y="65" width="6" height={by+bh-65} fill="#DC2626" stroke="none" />
        <rect x="48" y="65" width="6" height={by+bh-65} fill="#DC2626" stroke="none" />
        <rect x="60" y="65" width="6" height={by+bh-65} fill="#DC2626" stroke="none" />
        <line x1="30" y1="65" x2="70" y2="65" stroke="#1E293B" strokeWidth="2" />

        {/* White Star on Chest */}
        <polygon points="50,50 52,55 57,55 53,58 55,63 50,60 45,63 47,58 43,55 48,55" fill="#FFFFFF" stroke="none" />

        {/* Helmet details */}
        <text x="50" y="38" fontSize="10" fontWeight="900" fill="#FFFFFF" textAnchor="middle" stroke="none" fontFamily="sans-serif">A</text>
        <path d="M 28 32 Q 22 30 25 24 Q 28 28 30 32 Z" fill="#FFFFFF" stroke="none" />
        <path d="M 72 32 Q 78 30 75 24 Q 72 28 70 32 Z" fill="#FFFFFF" stroke="none" />

        {/* Iconic Round Shield */}
        <g transform="translate(18, 58) scale(0.6)">
          <circle cx="50" cy="50" r="24" fill="#DC2626" stroke="#1E293B" strokeWidth="3" />
          <circle cx="50" cy="50" r="18" fill="#F1F5F9" stroke="#1E293B" strokeWidth="3" />
          <circle cx="50" cy="50" r="12" fill="#DC2626" stroke="#1E293B" strokeWidth="3" />
          <circle cx="50" cy="50" r="7" fill="#1D4ED8" stroke="#1E293B" strokeWidth="2" />
          <polygon points="50,45 52,48 56,48 53,50 54,54 50,52 46,54 47,50 44,48 48,48" fill="#FFFFFF" stroke="none" />
        </g>

        {/* Stage 5: Mjolnir Hammer */}
        {isLegend && (
          <g>
            <g transform="translate(68, 52) scale(0.65)" stroke="#1E293B" strokeWidth="3">
              <rect x="47" y="40" width="6" height="28" fill="#78350F" />
              <rect x="34" y="20" width="32" height="20" rx="3" fill="#94A3B8" />
              <path d="M 34 24 L 66 24" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            </g>
            <g stroke="#38BDF8" strokeWidth="2" fill="none" className="animate-pulse">
              <path d="M 80 32 L 85 24 L 78 20 L 88 10" />
              <path d="M 64 26 L 56 16 L 62 10" />
            </g>
          </g>
        )}

        <g fill="#1E293B" stroke="none">
          <circle cx="41" cy="45" r="3" />
          <circle cx="59" cy="45" r="3" />
          <circle cx="42" cy="43.5" r="0.8" fill="#FFFFFF" />
          <circle cx="60" cy="43.5" r="0.8" fill="#FFFFFF" />
        </g>

        <path d="M 46 51 Q 50 55 54 51" stroke="#1E293B" strokeWidth="2" fill="none" />
      </g>
    );
  }
}

export function skinElsa(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    return (
      <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Elsa gown limbs */}
        {renderLimbs({
          armFill: "#E0F2FE",
          handFill: "#FDBA74",
          legFill: "#E0F2FE",
          bootFill: "#93C5FD",
        })}

        <rect x={bx} y={by} width={bw} height={bh} rx={br} fill="#93C5FD" />

        {/* Ice dress */}
        <path d={`M 30 55 Q 50 60 70 55 L 74 ${by+bh} L 26 ${by+bh} Z`} fill="#E0F2FE" />
        <path d={`M 36 55 L 44 ${by+bh} L 56 ${by+bh} L 64 55`} fill="#bae6fd" stroke="none" />

        {/* Side braid */}
        <path d="M 30 36 C 24 40, 22 52, 26 64 C 28 68, 32 72, 30 78 C 28 82, 24 84, 26 88" fill="#FEF08A" />
        <path d="M 28 42 Q 24 48 26 56 Q 28 62 26 68" fill="none" stroke="#F59E0B" strokeWidth="1.5" />

        {/* Golden Queen Tiara */}
        <polygon points="40,28 44,22 50,16 56,22 60,28" fill="#FBBF24" />
        <circle cx="50" cy="20" r="1.5" fill="#38BDF8" stroke="none" />

        {/* Starry snowflakes (Stage 5) */}
        {isLegend && (
          <g fill="none" stroke="#38BDF8" strokeWidth="1.5">
            <path d="M 50 6 L 50 16 M 45 11 L 55 11" />
            <path d="M 20 50 L 10 50 M 15 45 L 15 55" />
            <path d="M 80 50 L 90 50 M 85 45 L 85 55" />
          </g>
        )}

        <g stroke="#1E293B" fill="#1E293B">
          <circle cx="41" cy="46" r="3" stroke="none" />
          <circle cx="59" cy="46" r="3" stroke="none" />
          <circle cx="42" cy="44.5" r="0.8" fill="#FFFFFF" stroke="none" />
          <circle cx="60" cy="44.5" r="0.8" fill="#FFFFFF" stroke="none" />
          <path d="M 37 44 Q 41 41 43 44" fill="none" strokeWidth="2" />
          <path d="M 63 44 Q 59 41 57 44" fill="none" strokeWidth="2" />
        </g>

        <circle cx="35" cy="50" r="3" fill="#FDA4AF" opacity="0.6" stroke="none" />
        <circle cx="65" cy="50" r="3" fill="#FDA4AF" opacity="0.6" stroke="none" />

        <path d="M 46 52 Q 50 56 54 52" stroke="#1E293B" strokeWidth="2" fill="none" />
      </g>
    );
  }
}

export function skinPikachu(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    return (
      <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Pikachu yellow paws & feet */}
        {renderLimbs({
          armFill: "#FDE047",
          handFill: "#FDE047",
          legFill: "#FDE047",
          bootFill: "#CA8A04",
        })}

        <rect x={bx} y={by} width={bw} height={bh} rx={br} fill="#FDE047" />

        {/* Pointy ears */}
        <g>
          <path d="M 32 30 L 16 8 C 12 3 20 0 24 8 L 38 28 Z" fill="#FDE047" />
          <path d="M 16 8 C 14 5 18 2 21 6 L 24 8 Z" fill="#1E293B" />
          
          <path d="M 68 30 L 84 8 C 88 3 80 0 76 8 L 62 28 Z" fill="#FDE047" />
          <path d="M 84 8 C 86 5 82 2 79 6 L 76 8 Z" fill="#1E293B" />
        </g>

        {/* Red cheeks */}
        <circle cx="34" cy="52" r="5" fill="#EF4444" opacity="0.9" stroke="none" />
        <circle cx="66" cy="52" r="5" fill="#EF4444" opacity="0.9" stroke="none" />

        {/* Pikachu tail */}
        <path d="M 24 74 L 8 72 L 14 58 L 2 54 L 10 38 Z" fill="#FDE047" />

        <g fill="#1E293B" stroke="none">
          <circle cx="41" cy="46" r="3" />
          <circle cx="59" cy="46" r="3" />
          <circle cx="42" cy="44.5" r="1" fill="#FFFFFF" />
          <circle cx="60" cy="44.5" r="1" fill="#FFFFFF" />
        </g>

        <path d="M 47 50 Q 50 52 53 50" stroke="#1E293B" strokeWidth="2" fill="none" />
        <path d="M 47 50 C 47 53, 53 53, 53 50" fill="#EF4444" stroke="#1E293B" strokeWidth="1.5" />

        {/* Stage 5 Electric Sparks */}
        {isLegend && (
          <g stroke="#38BDF8" strokeWidth="2" fill="none" className="animate-pulse">
            <path d="M 10 40 L 2 30 L 8 24 L -2 14" />
            <path d="M 90 40 L 98 30 L 92 24 L 102 14" />
          </g>
        )}
      </g>
    );
  }
}

export function skinThor(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const hammerLeftArm = (stage >= 3) ? (
      <g>
        {/* Arm raising Mjolnir hammer */}
        <path d={`M ${bx} ${armY} Q ${bx - 10} ${armY - 4} ${bx - 12} ${armY - 14}`} fill="none" stroke="#78716C" strokeWidth="4.5" />
        <circle cx={bx - 12} cy={armY - 14} r="3" fill="#FDBA74" />
        {/* Hammer prop */}
        <g transform={`translate(${bx - 26}, ${armY - 28})`} stroke="#1E293B" strokeWidth="2">
          <rect x="10" y="14" width="4" height="14" fill="#78350F" />
          <rect x="0.5" y="4" width="22" height="11" rx="1.5" fill="#94A3B8" />
        </g>
        {/* Lightning sparks if stage >= 4 */}
        {stage >= 4 && (
          <g stroke="#38BDF8" strokeWidth="1.5" fill="none" className="animate-pulse">
            <path d={`M ${bx - 20} ${armY - 30} L ${bx - 28} ${armY - 36} L ${bx - 24} ${armY - 44}`} />
            <path d={`M ${bx - 12} ${armY - 32} L ${bx - 10} ${armY - 42}`} />
          </g>
        )}
      </g>
    ) : undefined;

    return (
      <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Red cape behind body */}
        {stage >= 3 && (
          <path d="M 22 55 L 12 85 Q 50 92 88 85 L 78 55 Z" fill="#DC2626" />
        )}

        {/* Thor limbs */}
        {renderLimbs({
          armFill: "#78716C",
          handFill: "#FDBA74",
          legFill: "#374151",
          bootFill: "#111827",
          customLeftArm: hammerLeftArm,
        })}

        {/* Body */}
        <rect x={bx} y={by} width={bw} height={bh} rx={br} fill="#78716C" />

        {/* 6 silver discs on chest armor */}
        <g fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.5">
          <circle cx={bx+10} cy={by+bh-18} r="3.5" />
          <circle cx={bx+bw-10} cy={by+bh-18} r="3.5" />
          <circle cx={bx+12} cy={by+bh-10} r="3.5" />
          <circle cx={bx+bw-12} cy={by+bh-10} r="3.5" />
        </g>

        {/* Heroic short spiky blonde hair */}
        {stage >= 3 && (
          <g stroke="#1E293B" strokeWidth="2.5" fill="#FBBF24">
            {/* Top spiky crown (visible especially before helmet) */}
            <path d="M 32 32 L 36 20 L 42 25 L 50 16 L 58 25 L 64 20 L 68 32 Z" />
            {/* Left sharp short warrior hair spikes */}
            <path d="M 32 40 L 22 46 L 28 50 L 24 56 L 31 52 Z" />
            {/* Right sharp short warrior hair spikes */}
            <path d="M 68 40 L 78 46 L 72 50 L 76 56 L 69 52 Z" />
          </g>
        )}

        {/* Silver Winged Helmet */}
        {stage >= 4 && (
          <g transform="translate(0, -5)">
            <ellipse cx="50" cy="30" rx="24" ry="4" fill="#94A3B8" />
            <path d="M 32 28 Q 48 -2 50 -6 Q 52 -2 68 28 Z" fill="#CBD5E1" />
            {/* Wing Left */}
            <path d="M 34 22 C 26 22, 22 14, 26 6 C 28 12, 34 16, 36 20 Z" fill="#F1F5F9" />
            {/* Wing Right */}
            <path d="M 66 22 C 74 22, 78 14, 74 6 C 72 12, 66 16, 64 20 Z" fill="#F1F5F9" />
          </g>
        )}

        {/* Eyes */}
        <g fill="#1E293B" stroke="none">
          <circle cx="41" cy="44" r="3" fill={isLegend ? "#38BDF8" : "#1E293B"} />
          <circle cx="59" cy="44" r="3" fill={isLegend ? "#38BDF8" : "#1E293B"} />
        </g>

        <path d="M 47 51 Q 50 55 53 51" stroke="#1E293B" strokeWidth="2" fill="none" />
      </g>
    );
  }
}

export function skinClassico(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const isHappy = animation === "happy";
    const wandLeftArm = (stage >= 3) ? (
      <g>
        <path d={`M ${bx} ${armY} Q ${bx - 8} ${armY - 10} ${bx - 12} ${armY - 14}`} fill="none" stroke="#7C3AED" strokeWidth="4.5" />
        <circle cx={bx - 12} cy={armY - 14} r="3" fill="#FDBA74" />
        <line x1={bx - 12} y1={armY - 14} x2={bx - 22} y2={armY - 24} stroke="#78350F" strokeWidth="2" />
        <circle cx={bx - 22} cy={armY - 24} r="4" fill="#FBBF24" className="animate-pulse" stroke="none" />
      </g>
    ) : undefined;

    return (
      <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Wizard limbs */}
        {renderLimbs({
          armFill: "#7C3AED",
          handFill: "#FDBA74",
          legFill: "#6D28D9",
          bootFill: "#1E1B4B",
          customLeftArm: wandLeftArm,
        })}

        {/* Main wizard body */}
        <rect x={bx} y={by} width={bw} height={bh} rx={br} fill="#7C3AED" />

        {/* Wizard Robe stars */}
        <g fill="#FBBF24" stroke="none" opacity="0.8">
          <polygon points="46,62 48,64 51,64 49,66 50,69 47,67 44,69 45,66 43,64 45,64" transform="scale(0.85) translate(8, 10)" />
          <polygon points="56,62 58,64 61,64 59,66 60,69 57,67 54,69 55,66 53,64 55,64" transform="scale(0.85) translate(14, 14)" />
        </g>

        {/* Fluffy Beard */}
        <path d="M 31 52 C 24 58, 22 76, 36 82 C 44 86, 56 86, 64 82 C 78 76, 76 58, 69 52 C 64 56, 56 58, 50 56 C 44 58, 36 56, 31 52 Z" fill="#F1F5F9" />

        {/* Fluffy Mustache */}
        <path d="M 38 52 Q 50 58 62 52" stroke="#1E293B" strokeWidth="2.5" fill="#F1F5F9" />
        <path d="M 43 51 Q 50 55 57 51" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />

        {/* Wizard Hat */}
        <g transform="translate(0, -5)">
          <ellipse cx="50" cy="30" rx="28" ry="4.5" fill="#6D28D9" />
          <path d="M 30 28 Q 48 -2 50 -8 Q 52 -2 70 28 Z" fill="#5B21B6" />
          <polygon points="50,6 52,11 57,11 53,14 55,19 50,16 45,19 47,14 43,11 48,11" fill="#FBBF24" stroke="none" />
        </g>

        {/* Eyes above beard */}
        <g fill="#1E293B" stroke="none">
          <circle cx="41" cy="44" r="3" />
          <circle cx="59" cy="44" r="3" />
          <circle cx="42" cy="42.5" r="1" fill="#FFFFFF" />
          <circle cx="60" cy="42.5" r="1" fill="#FFFFFF" />
        </g>

        {/* Smiling Mouth nested inside beard opening */}
        <path d="M 46 55 Q 50 60 54 55" stroke="#1E293B" strokeWidth="2" fill="none" />

        {/* Stage 5 swirling magic circle */}
        {isLegend && (
          <circle cx="50" cy="50" r="32" fill="none" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="4,6" className="animate-spin" style={{ animationDuration: "12s", transformOrigin: "50px 50px" }} />
        )}
      </g>
    );
  }
}
