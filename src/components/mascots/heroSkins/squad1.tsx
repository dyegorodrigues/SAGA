import React from "react";
import type { SkinCtx, LimbConfig } from "./types";

export function skinHulk(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const leftArmHulk = (stage >= 3) ? (
      <g>
        {/* Massive muscular left arm flexing */}
        <path d={`M ${bx} ${armY - 4} Q ${bx - 14} ${armY - 14} ${bx - 10} ${armY + 8}`} fill="#22C55E" stroke="#1E293B" strokeWidth="3" />
        <circle cx={bx - 10} cy={armY + 8} r="6" fill="#22C55E" stroke="#1E293B" strokeWidth="2" />
        {/* Muscular bicep crease */}
        <path d={`M ${bx - 8} ${armY - 4} Q ${bx - 6} ${armY} ${bx - 4} ${armY + 2}`} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
      </g>
    ) : undefined;

    const rightArmHulk = (stage >= 3) ? (
      <g>
        {/* Massive muscular right arm clenched */}
        <path d={`M ${bx + bw} ${armY - 4} Q ${bx + bw + 14} ${armY - 14} ${bx + bw + 10} ${armY + 8}`} fill="#22C55E" stroke="#1E293B" strokeWidth="3" />
        <circle cx={bx + bw + 10} cy={armY + 8} r="6" fill="#22C55E" stroke="#1E293B" strokeWidth="2" />
        <path d={`M ${bx + bw + 8} ${armY - 4} Q ${bx + bw + 6} ${armY} ${bx + bw + 4} ${armY + 2}`} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
      </g>
    ) : undefined;

    return (
      <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Gladiator / Cosmic Helmet for Stage 5 */}
        {isLegend && (
          <g fill="#94A3B8" stroke="#1E293B" strokeWidth="2.5">
            <path d="M 30 25 Q 50 15 70 25 L 68 14 Q 50 6 32 14 Z" />
            <path d="M 50 6 Q 50 -12 62 -14 Q 58 2 50 6" fill="#EF4444" />
            <path d="M 28 24 L 24 38 L 32 32 Z" fill="#64748B" />
            <path d="M 72 24 L 76 38 L 68 32 Z" fill="#64748B" />
          </g>
        )}

        {/* Muscular Hulk limbs */}
        {renderLimbs({
          armFill: "#22C55E",
          handFill: "#22C55E",
          legFill: "#22C55E",
          bootFill: "#15803D",
          customLeftArm: leftArmHulk,
          customRightArm: rightArmHulk,
        })}

        {/* Muscular Hulk Body */}
        <rect x={bx} y={by} width={bw} height={bh} rx={br} fill="#22C55E" />

        {/* Torn purple shorts at the bottom */}
        <path d={`M ${bx-1} ${by+bh-12} L ${bx+bw+1} ${by+bh-12} L ${bx+bw+1} ${by+bh+1} L ${bx-1} ${by+bh+1} Z`} fill="#A855F7" />
        <path d={`M ${bx-1} ${by+bh-12} L ${bx+6} ${by+bh-6} L ${bx+12} ${by+bh-12} L ${bx+18} ${by+bh-6} L ${bx+24} ${by+bh-12} L ${bx+30} ${by+bh-6} L ${bx+36} ${by+bh-12} L ${bx+42} ${by+bh-6} L ${bx+bw+1} ${by+bh-12}`} stroke="#1E293B" strokeWidth="2.5" fill="none" />

        {/* Messy Black/Dark Green Hair */}
        {!isLegend && (
          <path d="M 26 30 Q 32 18 36 24 Q 44 14 50 24 Q 56 16 64 24 Q 70 18 74 30 Q 50 28 26 30" fill="#111827" />
        )}

        {/* Muscle lines chest */}
        <g stroke="rgba(0,0,0,0.20)" strokeWidth="2">
          <path d="M 40 58 Q 50 64 60 58" fill="none" />
          <path d="M 50 58 L 50 72" />
        </g>

        {/* Angry Eyebrows */}
        <g stroke="#111827" strokeWidth="3.5" strokeLinecap="round">
          <line x1="34" y1="42" x2="44" y2="46" />
          <line x1="66" y1="42" x2="56" y2="46" />
        </g>

        {/* Eyes */}
        <g fill="#1E293B" stroke="none">
          <circle cx="38" cy="49" r="3" fill={isLegend ? "#4ADE80" : "#1E293B"} />
          <circle cx="62" cy="49" r="3" fill={isLegend ? "#4ADE80" : "#1E293B"} />
        </g>

        {/* Angry Mouth */}
        {isHappy ? (
          <path d="M 45 64 Q 50 72 55 64" fill="#EF4444" stroke="#1E293B" strokeWidth="2" />
        ) : (
          <path d="M 44 67 Q 50 60 56 67" fill="none" stroke="#1E293B" strokeWidth="2.5" />
        )}
      </g>
    );
  }
}

export function skinBruxo(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const wizardLeftArm = (stage >= 3) ? (
      <g>
        {/* Arm raising magic wand */}
        <path d={`M ${bx} ${armY} Q ${bx - 8} ${armY - 10} ${bx - 12} ${armY - 14}`} fill="none" stroke="#6D28D9" strokeWidth="4.5" />
        <circle cx={bx - 12} cy={armY - 14} r="3" fill="#FDBA74" />
        {/* Magic Wand prop */}
        <line x1={bx - 12} y1={armY - 14} x2={bx - 22} y2={armY - 24} stroke="#78350F" strokeWidth="2" />
        {/* Wand glowing tip */}
        <circle cx={bx - 22} cy={armY - 24} r="4" fill="#FBBF24" className="animate-pulse" stroke="none" />
        <polygon points={`${bx - 22},${armY - 30} ${bx - 20},${armY - 26} ${bx - 16},${armY - 24} ${bx - 20},${armY - 22} ${bx - 22},${armY - 18} ${bx - 24},${armY - 22} ${bx - 28},${armY - 24} ${bx - 24},${armY - 26}`} fill="#FFFFFF" stroke="none" />
      </g>
    ) : undefined;

    return (
      <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Wizard robe limbs */}
        {renderLimbs({
          armFill: "#6D28D9",
          handFill: "#FDBA74",
          legFill: "#4C1D95",
          bootFill: "#1E1B4B",
          customLeftArm: wizardLeftArm,
        })}

        {/* Wizard/Merlin robe */}
        <rect x={bx} y={by} width={bw} height={bh} rx={br} fill="#6D28D9" />

        {/* Starry decals on robe */}
        <g fill="#FBBF24" stroke="none" opacity="0.8">
          <polygon points="36,64 38,68 42,68 39,70 41,74 37,71 33,74 35,70 32,68 36,68" transform="scale(0.8) translate(8, 8)" />
          <polygon points="64,64 66,68 70,68 67,70 69,74 65,71 61,74 63,70 60,68 64,68" transform="scale(0.8) translate(14, 12)" />
        </g>

        {/* Giant Fluffy White Beard! */}
        <path d="M 31 52 C 24 58, 22 78, 36 84 C 44 88, 56 88, 64 84 C 78 78, 76 58, 69 52 C 64 56, 56 58, 50 56 C 44 58, 36 56, 31 52 Z" fill="#F1F5F9" />
        
        {/* Fluffy Mustache */}
        <path d="M 38 52 Q 50 58 62 52" stroke="#1E293B" strokeWidth="2.5" fill="#F1F5F9" />
        <path d="M 43 51 Q 50 55 57 51" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />

        <circle cx="34" cy="48" r="3" fill="#F87171" opacity="0.5" stroke="none" />
        <circle cx="66" cy="48" r="3" fill="#F87171" opacity="0.5" stroke="none" />

        {/* Wizard Hat */}
        <g transform="translate(0, -5)">
          <ellipse cx="50" cy="30" rx="28" ry="4.5" fill="#4C1D95" />
          <path d="M 30 28 Q 48 -2 50 -8 Q 52 -2 70 28 Z" fill="#5B21B6" />
          <polygon points="50,6 52,11 57,11 53,14 55,19 50,16 45,19 47,14 43,11 48,11" fill="#FBBF24" stroke="none" />
        </g>

        {/* Eyes above beard */}
        <g fill="#1E293B" stroke="none">
          <circle cx="41" cy="44" r="3" />
          <circle cx="59" cy="44" r="3" />
          <circle cx="42" cy="42.5" r="0.8" fill="#FFFFFF" />
          <circle cx="60" cy="42.5" r="0.8" fill="#FFFFFF" />
        </g>

        {/* Smiling Mouth nested inside beard opening */}
        <path d="M 46 49 Q 50 52 54 49" stroke="#1E293B" strokeWidth="2.5" fill="none" />
      </g>
    );
  }
}

export function skinFutebol(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const soccerRightLeg = (stage >= 3) ? (
      <g>
        {/* Leg kicked forward kicking soccer ball */}
        <rect x={bx + bw * 0.65} y={legY} width={bw * 0.18} height={10} rx={2} fill="#FED7AA" transform={`rotate(25, ${bx + bw * 0.75}, ${legY})`} />
        <ellipse cx={bx + bw * 0.78 + 4} cy={legY + 11} rx={8} ry={4} fill="#111827" />
        {/* Ball shadow & soccer ball */}
        <ellipse cx={bx + bw + 6} cy={legY + 15} rx={6} ry={2} fill="rgba(0,0,0,0.20)" stroke="none" />
        <circle cx={bx + bw + 6} cy={legY + 9} r="7.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
        <path d={`M ${bx+bw+3} ${legY+6} L ${bx+bw+9} ${legY+6} L ${bx+bw+11} ${legY+10} L ${bx+bw+6} ${legY+13} L ${bx+bw+1} ${legY+10} Z`} fill="#111827" stroke="none" />
        <path d={`M ${bx+bw+6} ${legY+1.5} L ${bx+bw+6} ${legY+6}`} stroke="#1E293B" strokeWidth="1.5" />
        <path d={`M ${bx+bw-1.5} ${legY+9} L ${bx+bw+3} ${legY+9}`} stroke="#1E293B" strokeWidth="1.5" />
        <path d={`M ${bx+bw+13.5} ${legY+9} L ${bx+bw+9} ${legY+9}`} stroke="#1E293B" strokeWidth="1.5" />
      </g>
    ) : undefined;

    return (
      <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Soccer player limbs */}
        {renderLimbs({
          armFill: "#FED7AA",
          handFill: "#FED7AA",
          legFill: "#FED7AA",
          bootFill: "#22C55E",
          customRightLeg: soccerRightLeg,
        })}

        <rect x={bx} y={by} width={bw} height={bh} rx={br} fill="#FED7AA" />

        {/* Soccer Jersey (aligned dynamically with body metrics) */}
        <path d={`
          M ${bx} ${by + bh * 0.45} 
          L ${bx + bw} ${by + bh * 0.45} 
          L ${bx + bw} ${by + bh - br} 
          Q ${bx + bw} ${by + bh} ${bx + bw - br} ${by + bh}
          L ${bx + br} ${by + bh} 
          Q ${bx} ${by + bh} ${bx} ${by + bh - br} 
          Z
        `} fill="#FBBF24" />
        <rect x={50 - bw * 0.12} y={by + bh * 0.45} width={bw * 0.24} height={bh * 0.55} fill="#15803D" stroke="none" />
        
        <text x="50" y={by + bh * 0.73} fontSize={Math.round(bw * 0.27)} fontWeight="900" fill="#FFFFFF" textAnchor="middle" stroke="none" fontFamily="sans-serif">7</text>

        {/* Undercut hair (Cristiano Ronaldo style) */}
        <path d="M 28 32 C 32 18, 54 14, 72 26 C 74 32, 68 34, 62 30 C 56 26, 42 28, 36 34 C 34 34, 30 36, 28 32 Z" fill="#292524" />
        <path d="M 32 26 Q 50 16 68 22" stroke="#F59E0B" strokeWidth="1.5" fill="none" />

        {/* Sparkly Aura / Stars for Stage 5 */}
        {isLegend && (
          <g fill="#FBBF24" stroke="none">
            <polygon points="50,-10 52,-4 58,-4 53,-1 55,5 50,2 45,5 47,-1 42,-4 48,-4" />
            <circle cx="50" cy="-6" r="14" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4,4" />
          </g>
        )}

        <g fill="#1E293B" stroke="none">
          <circle cx="41" cy="46" r="3" />
          <circle cx="59" cy="46" r="3" />
          <circle cx="42" cy="44.5" r="0.8" fill="#FFFFFF" />
          <circle cx="60" cy="44.5" r="0.8" fill="#FFFFFF" />
        </g>

        <circle cx="36" cy="49" r="2" fill="#F87171" opacity="0.4" stroke="none" />
        <circle cx="64" cy="49" r="2" fill="#F87171" opacity="0.4" stroke="none" />

        <path d="M 45 53 Q 50 58 55 53" stroke="#1E293B" strokeWidth="2.5" fill="none" />
      </g>
    );
  }
}

export function skinHomemFerro(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const ironLeftArm = (stage >= 3) ? (
      <g>
        {/* Repulsor hand pointing forward blasting energy */}
        <path d={`M ${bx} ${armY} L ${bx - 14} ${armY - 4}`} stroke="#B91C1C" strokeWidth="4.5" fill="none" />
        <circle cx={bx - 14} cy={armY - 4} r="4" fill="#E2E8F0" />
        <circle cx={bx - 14} cy={armY - 4} r="2" fill="#22D3EE" stroke="none" />
        {/* Cyan Energy Beam blast */}
        <path d={`M ${bx - 16} ${armY - 4} L -15 ${armY - 4}`} fill="none" stroke="#22D3EE" strokeWidth="3.5" className="animate-pulse" />
        <path d={`M ${bx - 16} ${armY - 4} L -15 ${armY - 4}`} fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
      </g>
    ) : undefined;

    return (
      <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Iron Man armored limbs */}
        {renderLimbs({
          armFill: "#B91C1C",
          handFill: "#F59E0B",
          legFill: "#B91C1C",
          bootFill: "#F59E0B",
          customLeftArm: ironLeftArm,
        })}

        {/* Thruster fire at feet for evolved Iron Man */}
        {stage >= 3 && (
          <g className="animate-pulse" stroke="none">
            {/* Left foot thruster */}
            <path d="M 36 93 L 40 108 L 44 93 Z" fill="#F97316" />
            <path d="M 38 93 L 40 101 L 42 93 Z" fill="#FBBF24" />
            <circle cx="40" cy="93" r="2.5" fill="#22D3EE" />
            {/* Right foot thruster */}
            <path d="M 56 93 L 60 108 L 64 93 Z" fill="#F97316" />
            <path d="M 58 93 L 60 101 L 62 93 Z" fill="#FBBF24" />
            <circle cx="60" cy="93" r="2.5" fill="#22D3EE" />
          </g>
        )}

        <rect x={bx} y={by} width={bw} height={bh} rx={br} fill="#B91C1C" />

        {/* Gold Faceplate Mask */}
        <path d="M 33 34 L 67 34 L 64 58 L 50 64 L 36 58 Z" fill="#F59E0B" />
        <path d="M 33 34 L 67 34 L 64 40 L 36 40 Z" fill="#991B1B" />

        {/* Glowing Cyan Eyes */}
        <g fill="#22D3EE" stroke="#FFFFFF" strokeWidth="0.5">
          <polygon points="38,44 46,45 45,48 39,47" />
          <polygon points="62,44 54,45 55,48 61,47" />
        </g>

        {/* Arc Reactor on Chest */}
        <circle cx="50" cy="70" r="5" fill="#22D3EE" stroke="#FFFFFF" strokeWidth="1.5" />

        {/* Stage 5 Flight Wings */}
        {isLegend && (
          <g fill="none" stroke="#22D3EE" strokeWidth="2.5">
            <path d="M 28 66 L 10 56 L 14 74 Z" fill="#B91C1C" stroke="#1E293B" />
            <path d="M 72 66 L 90 56 L 86 74 Z" fill="#B91C1C" stroke="#1E293B" />
            <line x1="12" y1="70" x2="4" y2="80" stroke="#22D3EE" />
            <line x1="88" y1="70" x2="96" y2="80" stroke="#22D3EE" />
          </g>
        )}
      </g>
    );
  }
}
