import React from "react";
import type { SkinCtx, LimbConfig } from "./types";

export function skinGoku(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const sfxKamehameha = isLegend ? (
      <g>
        {/* Kamehameha plasma ball between hands in front of body */}
        <circle cx="50" cy={by+bh-2} r="10" fill="none" stroke="#38BDF8" strokeWidth="2" className="animate-pulse" />
        <circle cx="50" cy={by+bh-2} r="6" fill="#FFFFFF" stroke="#60A5FA" strokeWidth="1.5" />
        <path d={`M 38 ${by+bh-2} L 12 ${by+bh+10} M 62 ${by+bh-2} L 88 ${by+bh+10}`} stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3,3" />
      </g>
    ) : null;

    // Goku's hair color depends on stage
    // Stage 2-3: Black, Stage 4: Gold (Super Saiyajin), Stage 5: Silver/Blue (Ultra Instinct/Blue)
    const hairColor = stage <= 3 ? "#111827" : stage === 4 ? "#FBBF24" : "#60A5FA";

    return (
      <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Monkey tail wrapping around */}
        {stage >= 3 && (
          <path d="M 24 74 Q 10 76 6 60 Q 4 48 10 44" fill="none" stroke="#78350F" strokeWidth="4.5" />
        )}

        {/* Goku limbs - peach skin arms showing muscles, orange pants */}
        {renderLimbs({
          armFill: "#FED7AA",
          handFill: "#FED7AA",
          legFill: "#F97316",
          bootFill: "#1D4ED8",
        })}

        {/* Orange Gi vest with sleeveless shoulder cuts */}
        <rect x={bx} y={by+18} width={bw} height={bh-18} rx={4} fill="#F97316" />
        {/* Sleeveless vest shoulder overlays */}
        <path d={`M ${bx} ${by+18} L ${bx+6} ${by+18} L ${bx} ${by+26} Z`} fill="#F97316" />
        <path d={`M ${bx+bw} ${by+18} L ${bx+bw-6} ${by+18} L ${bx+bw} ${by+26} Z`} fill="#F97316" />

        {/* Blue V-neck undershirt */}
        <polygon points={`${bx+8},${by+18} ${bx+bw-8},${by+18} 50,${by+32}`} fill="#1D4ED8" stroke="#1E293B" strokeWidth="2" />
        {/* Peach neck showing in V-neck */}
        <polygon points={`${bx+12},${by+18} ${bx+bw-12},${by+18} 50,${by+29}`} fill="#FED7AA" />

        {/* Peach-colored head/face */}
        <rect x={bx} y={by} width={bw} height={24} rx={br} fill="#FED7AA" stroke="#1E293B" strokeWidth="2.5" />

        {/* Blue Sash belt */}
        <path d={`M 36 ${by+bh-12} L 64 ${by+bh-12} L 64 ${by+bh-6} L 36 ${by+bh-6} Z`} fill="#1D4ED8" />
        <line x1="36" y1={by+bh-12} x2="64" y2={by+bh-12} stroke="#1E293B" strokeWidth="2" />

        {/* Goku Hair Progression */}
        {stage === 2 && (
          /* Cute baby tuft of hair */
          <path d="M 44 26 Q 50 18 56 26" stroke="#111827" strokeWidth="3" fill="none" />
        )}

        {stage >= 3 && (
          <g fill={hairColor}>
            {/* Massive spike layers */}
            <path d="M 28 32 L 14 18 L 34 24 L 28 6 L 50 16 L 72 6 L 66 24 L 86 18 L 72 32 Z" />
            <path d="M 36 24 L 50 4 L 64 24" />
          </g>
        )}

        {/* Kamehameha effects */}
        {sfxKamehameha}

        {/* Eyes & Anime Eyebrows on the peach face */}
        <g stroke="none">
          {/* Angry martial artist eyebrows */}
          <polygon points="34,40 45,43 45,41 34,37" fill={hairColor} />
          <polygon points="66,40 55,43 55,41 66,37" fill={hairColor} />
          {/* Pupils */}
          <circle cx="41" cy="46" r="3" fill={stage >= 4 ? "#22D3EE" : "#1E293B"} />
          <circle cx="59" cy="46" r="3" fill={stage >= 4 ? "#22D3EE" : "#1E293B"} />
        </g>

        <path d="M 46 52 Q 50 56 54 52" stroke="#1E293B" strokeWidth="2.5" fill="none" />
      </g>
    );
  }
}

export function skinHeroi(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const isHappy = animation === "happy";
    const maneScale = stage === 2 ? 0.78 : stage === 3 ? 0.90 : stage === 4 ? 1.02 : 1.15;
    
    return (
      <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Lion Fluffy Mane Behind Body */}
        <g transform={`translate(50, 50) scale(${maneScale}) translate(-50, -50)`} opacity="0.95">
          <path d="M 50 15 C 30 12, 10 30, 15 50 C 10 70, 30 88, 50 85 C 70 88, 90 70, 85 50 C 90 30, 70 12, 50 15 Z" fill="#D35400" stroke="#1E293B" strokeWidth="3" />
          <path d="M 50 20 C 35 18, 18 32, 22 48 C 18 64, 35 80, 50 78 C 65 80, 82 64, 78 48 C 82 32, 65 18, 50 20 Z" fill="#E67E22" />
        </g>

        {/* Lion limbs */}
        {renderLimbs({
          armFill: color,
          handFill: "#D35400",
          legFill: color,
          bootFill: "#D35400",
        })}

        {/* Main Body */}
        <rect x={bx} y={by} width={bw} height={bh} rx={br} fill={color} />

        {/* Lion ears peeking from mane */}
        <circle cx={bx+6} cy={by+4} r="7" fill="#D35400" />
        <circle cx={bx+6} cy={by+4} r="4" fill="#FDA4AF" />
        <circle cx={bx+bw-6} cy={by+4} r="7" fill="#D35400" />
        <circle cx={bx+bw-6} cy={by+4} r="4" fill="#FDA4AF" />

        {/* Light cream chest plate */}
        <ellipse cx="50" cy={by+bh-12} rx={bw*0.28} ry={bh*0.18} fill="#FEF3C7" stroke="#1E293B" strokeWidth="2" />

        {/* Whiskers */}
        <g stroke="#94A3B8" strokeWidth="1.5">
          <line x1={bx+8} y1="52" x2={bx-4} y2="50" />
          <line x1={bx+8} y1="55" x2={bx-6} y2="56" />
          <line x1={bx+bw-8} y1="52" x2={bx+bw+4} y2="50" />
          <line x1={bx+bw-8} y1="55" x2={bx+bw+6} y2="56" />
        </g>

        {/* Cute Lion Muzzle snout */}
        <g>
          <ellipse cx="46" cy="54" rx="4.5" ry="3.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
          <ellipse cx="54" cy="54" rx="4.5" ry="3.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
          {/* Heart shaped nose */}
          <polygon points="50,49 47,46 53,46" fill="#D35400" stroke="#1E293B" strokeWidth="1" />
        </g>

        {/* Eyes */}
        <g fill="#1E293B" stroke="none">
          <circle cx="41" cy="42" r="3.5" />
          <circle cx="59" cy="42" r="3.5" />
          <circle cx="42.5" cy="40.5" r="1.2" fill="#FFFFFF" />
          <circle cx="60.5" cy="40.5" r="1.2" fill="#FFFFFF" />
        </g>

        {/* Mouth */}
        {isHappy ? (
          <path d="M 46 54 Q 50 61 54 54" fill="#EF4444" stroke="#1E293B" strokeWidth="2" />
        ) : (
          <path d="M 48 55 Q 50 58 52 55" fill="none" stroke="#1E293B" strokeWidth="2" />
        )}

        {/* Cheeks */}
        <circle cx="34" cy="47" r="2.5" fill="#F87171" opacity="0.4" stroke="none" />
        <circle cx="66" cy="47" r="2.5" fill="#F87171" opacity="0.4" stroke="none" />

        {/* Divine Crown for stage 5 */}
        {isLegend && (
          <g transform="translate(0, -6)">
            <polygon points="42,24 45,14 50,19 55,14 58,24" fill="#FBBF24" stroke="#1E293B" strokeWidth="1.5" />
            <circle cx="45" cy="13" r="1" fill="#EF4444" stroke="none" />
            <circle cx="50" cy="18" r="1" fill="#3B82F6" stroke="none" />
            <circle cx="55" cy="13" r="1" fill="#EF4444" stroke="none" />
          </g>
        )}
      </g>
    );
  }
}

export function skinMusica(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const isHappy = animation === "happy";
    return (
      <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Octopus Suction Tentacles behind / below body */}
        <g>
          <path d={`M ${bx+4} ${by+bh-2} Q ${bx-8} ${by+bh+14} ${bx+8} ${by+bh+14}`} fill={color} stroke="#1E293B" strokeWidth="3" />
          <path d={`M ${bx+14} ${by+bh-2} Q ${bx+bw/2} ${by+bh+16} ${bx+bw-14} ${by+bh-2}`} fill={color} stroke="#1E293B" strokeWidth="3" />
          <path d={`M ${bx+bw-4} ${by+bh-2} Q ${bx+bw+8} ${by+bh+14} ${bx+bw-8} ${by+bh+14}`} fill={color} stroke="#1E293B" strokeWidth="3" />
        </g>

        {/* Suction cup decals */}
        <circle cx={bx-2} cy={by+bh+6} r="1.5" fill="#FFE4E6" opacity="0.8" stroke="none" />
        <circle cx={bx+bw+2} cy={by+bh+6} r="1.5" fill="#FFE4E6" opacity="0.8" stroke="none" />

        {/* Arms holding Electric Guitar for stage >= 3 */}
        {stage >= 3 ? (
          <g>
            {/* Rocking Guitar Prop */}
            <g transform="translate(18, 52) rotate(-15)" stroke="#1E293B" strokeWidth="2">
              {/* Guitar body */}
              <path d="M 10 30 C 5 20, -5 20, -2 34 C 0 44, 20 44, 18 34 C 16 28, 22 28, 18 30 Z" fill="#EF4444" />
              {/* Guitar neck */}
              <rect x="7" y="0" width="4" height="30" fill="#78350F" />
              {/* Headstock */}
              <rect x="5" y="-6" width="8" height="6" fill="#EF4444" />
            </g>
            
            {/* Left Arm holding neck */}
            <path d={`M ${bx} ${armY} Q ${bx - 12} ${armY - 4} ${bx - 6} ${armY - 14}`} fill={color} stroke="#1E293B" strokeWidth="2.5" />
            {/* Right Arm strumming */}
            <path d={`M ${bx+bw} ${armY} Q ${bx+bw/2} ${armY+12} ${bx+bw/2+2} ${armY+6}`} fill={color} stroke="#1E293B" strokeWidth="2.5" />
          </g>
        ) : (
          renderLimbs({
            armFill: color,
            handFill: color,
            legFill: color,
            bootFill: color,
          })
        )}

        {/* Main Body */}
        <rect x={bx} y={by} width={bw} height={bh} rx={br} fill={color} />

        {/* Cool Rocker Skull on Chest */}
        <g fill="#FFFFFF" stroke="none" opacity="0.8">
          <circle cx="50" cy={by+bh-12} r="3.5" />
          <rect x="48" y={by+bh-10} width="4" height="4.5" />
          <line x1="49" y1={by+bh-7} x2="49" y2={by+bh-10} stroke="#1E293B" strokeWidth="1" />
          <line x1="51" y1={by+bh-7} x2="51" y2={by+bh-10} stroke="#1E293B" strokeWidth="1" />
          <circle cx="48.5" cy={by+bh-12} r="1" fill="#1E293B" />
          <circle cx="51.5" cy={by+bh-12} r="1" fill="#1E293B" />
        </g>

        {/* Rocker Star Sunglasses */}
        <g stroke="#1E293B" strokeWidth="2" strokeLinejoin="round">
          {/* Left star outer gold border */}
          <polygon points="38,32 41,38 47,38 42,42 44,48 38,45 32,48 34,42 29,38 35,38" fill="#FBBF24" />
          {/* Left star inner dark lens */}
          <polygon points="38,34 40,38 45,38 41,41 43,46 38,43 33,46 35,41 31,38 36,38" fill="#581C87" />
          {/* Left star bright cyan eye center */}
          <circle cx="38" cy="39" r="3" fill="#22D3EE" stroke="none" />
          <circle cx="37" cy="38" r="1" fill="#FFFFFF" stroke="none" />

          {/* Right star outer gold border */}
          <polygon points="62,32 65,38 71,38 66,42 68,48 62,45 56,48 58,42 53,38 59,38" fill="#FBBF24" />
          {/* Right star inner dark lens */}
          <polygon points="62,34 64,38 69,38 65,41 67,46 62,43 57,46 59,41 55,38 60,38" fill="#581C87" />
          {/* Right star bright cyan eye center */}
          <circle cx="62" cy="39" r="3" fill="#22D3EE" stroke="none" />
          <circle cx="61" cy="38" r="1" fill="#FFFFFF" stroke="none" />

          {/* Glass Bridge */}
          <rect x="44" y="37" width="12" height="2.5" fill="#FBBF24" rx="0.5" stroke="#1E293B" strokeWidth="1.5" />
        </g>

        {/* Mouth */}
        {isHappy ? (
          <path d="M 45 54 Q 50 62 55 54" fill="#EF4444" stroke="#1E293B" strokeWidth="2" />
        ) : (
          <path d="M 46 55 Q 50 58 54 55" fill="none" stroke="#1E293B" strokeWidth="2" />
        )}

        {/* Rockstar Mohican spike hair for stage >= 3 */}
        {stage >= 3 && (
          <g fill="#EC4899" stroke="#1E293B" strokeWidth="2">
            <path d="M 42 24 L 50 6 L 58 24 Z" />
            <path d="M 36 28 L 44 14 L 48 28 Z" />
            <path d="M 52 28 L 56 14 L 64 28 Z" />
          </g>
        )}

        {/* Stage 5 Neon Laser notes */}
        {isLegend && (
          <g stroke="#22D3EE" strokeWidth="2" fill="none" className="animate-bounce">
            <text x={bx-14} y={by+8} fill="#22D3EE" fontSize="11" fontWeight="bold" stroke="none">♫</text>
            <text x={bx+bw+4} y={by+12} fill="#EC4899" fontSize="11" fontWeight="bold" stroke="none">♪</text>
          </g>
        )}
      </g>
    );
  }
}
