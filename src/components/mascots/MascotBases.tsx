import React from "react";
import type { SkinCtx } from "./heroSkins/types";
import { SKIN_RENDERERS } from "./heroSkins";

interface BaseProps {
  color: string;
  stage: number;
}

// Dino Base Features
export function DinoBase({ color, stage }: BaseProps) {
  if (stage < 2) return null;
  return (
    <g>
      {/* Dino Spiky Tail */}
      {stage === 2 && (
        <path d="M 35 70 C 20 72 15 62 20 58 C 25 56 30 62 35 66" fill={color} stroke="#1E293B" strokeWidth="2.5" />
      )}
      {stage === 3 && (
        <path d="M 30 68 C 12 70 8 55 16 50 C 22 48 26 56 30 62" fill={color} stroke="#1E293B" strokeWidth="3" />
      )}
      {stage === 4 && (
        <path d="M 28 66 Q 6 72 10 52 Q 20 48 28 58" fill={color} stroke="#1E293B" strokeWidth="3" />
      )}
      {stage === 5 && (
        <g>
          <path d="M 26 64 C 2 74 0 46 8 40 C 18 36 22 50 26 56" fill={color} stroke="#1E293B" strokeWidth="3" />
          <polygon points="5,43 1,46 4,49" fill="#F97316" stroke="#1E293B" strokeWidth="1.5" />
          <polygon points="10,48 6,52 10,54" fill="#F97316" stroke="#1E293B" strokeWidth="1.5" />
        </g>
      )}
      
      {/* Dino Spikes on Back */}
      <g fill="#F97316" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round">
        {stage >= 3 && (
          <>
            <polygon points="34,26 28,18 40,24" />
            <polygon points="26,44 18,38 30,42" />
          </>
        )}
        {stage >= 4 && (
          <polygon points="24,62 14,56 26,58" />
        )}
      </g>
    </g>
  );
}

// Pikachu Base Features
export function PikachuBase({ color, stage }: BaseProps) {
  if (stage < 2) return null;
  return (
    <g>
      {/* Pikachu Tail */}
      <path d="M 25 75 L 10 70 L 15 55 L 2 50 L 12 35 Z" fill="#FDE047" stroke="#1E293B" strokeWidth="3" strokeLinejoin="round" />
      
      {/* Pikachu Ears (Drawn relative to head) */}
      <g stroke="#1E293B" strokeWidth="3" strokeLinejoin="round">
        {/* Left Ear */}
        <path d="M 32 30 L 16 10 C 12 5 20 2 24 10 L 38 28 Z" fill="#FDE047" />
        <path d="M 16 10 C 14 7 18 4 21 8 L 24 10 Z" fill="#1E293B" />
        
        {/* Right Ear */}
        <path d="M 68 30 L 84 10 C 88 5 80 2 76 10 L 62 28 Z" fill="#FDE047" />
        <path d="M 84 10 C 86 7 82 4 79 8 L 76 10 Z" fill="#1E293B" />
      </g>

      {/* Rosie Red Pikachu Cheeks */}
      <circle cx="34" cy="54" r="5" fill="#EF4444" opacity="0.85" />
      <circle cx="66" cy="54" r="5" fill="#EF4444" opacity="0.85" />
    </g>
  );
}

// Unicorn Base Features
export function UnicornBase({ stage }: { stage: number }) {
  if (stage < 2) return null;
  const hornScale = stage === 2 ? 0.6 : stage === 3 ? 0.8 : stage === 4 ? 1.0 : 1.2;
  return (
    <g transform={`translate(50, 24) scale(${hornScale}) translate(-50, -24)`}>
      {/* Magical Spiral Horn */}
      <polygon points="46,24 50,2 54,24" fill="url(#goldGrad)" stroke="#1E293B" strokeWidth="2.5" />
      <path d="M 47 18 Q 50 20 53 18 M 48 11 Q 50 13 52 11 M 49 5 Q 50 7 51 5" stroke="#FDBA74" strokeWidth="1.5" fill="none" />
      
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="50%" stopColor="#FFB300" />
          <stop offset="100%" stopColor="#FFA000" />
        </linearGradient>
      </defs>
    </g>
  );
}

// Octopus Base Features
export function OctopusBase({ color, stage }: BaseProps) {
  if (stage < 2) return null;
  const tentacleWiggle = stage >= 4 ? "translateY(1px)" : "none";
  return (
    <g style={{ transform: tentacleWiggle }}>
      {/* 4 Cute tentacles at the bottom */}
      <path d="M 32 74 Q 24 88 32 88 Q 38 88 36 76" fill={color} stroke="#1E293B" strokeWidth="3" />
      <path d="M 42 76 Q 44 89 50 89 Q 56 89 54 76" fill={color} stroke="#1E293B" strokeWidth="3" />
      <path d="M 60 76 Q 64 88 68 88 Q 74 88 66 74" fill={color} stroke="#1E293B" strokeWidth="3" />
      {/* Little suction cups */}
      <circle cx="28" cy="84" r="2" fill="#FFE4E6" />
      <circle cx="50" cy="85" r="2" fill="#FFE4E6" />
      <circle cx="70" cy="84" r="2" fill="#FFE4E6" />
    </g>
  );
}

// Lion Base Features
export function LionBase({ stage }: { stage: number }) {
  if (stage < 2) return null;
  const maneScale = stage === 2 ? 0.7 : stage === 3 ? 0.85 : stage === 4 ? 1.0 : 1.15;
  return (
    <g transform={`translate(50, 50) scale(${maneScale}) translate(-50, -50)`} opacity="0.95">
      {/* Big beautiful fluffy lion mane behind body */}
      <path d="M 50 15 C 30 12, 10 30, 15 50 C 10 70, 30 88, 50 85 C 70 88, 90 70, 85 50 C 90 30, 70 12, 50 15 Z" fill="#D35400" stroke="#1E293B" strokeWidth="3" />
      <path d="M 50 20 C 35 18, 18 32, 22 48 C 18 64, 35 80, 50 78 C 65 80, 82 64, 78 48 C 82 32, 65 18, 50 20 Z" fill="#E67E22" />
    </g>
  );
}

// Cute Rabbit Ears
export function RabbitBase({ color, stage }: BaseProps) {
  if (stage < 2) return null;
  return (
    <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round">
      {/* Left Ear */}
      <path d="M 36 32 C 30 10, 20 2, 25 15 C 28 22, 34 28, 38 32 Z" fill={color} />
      <path d="M 33 28 C 29 14, 22 8, 25 16 C 27 21, 31 25, 34 28 Z" fill="#FDA4AF" />
      
      {/* Right Ear */}
      <path d="M 64 32 C 70 10, 80 2, 75 15 C 72 22, 66 28, 62 32 Z" fill={color} />
      <path d="M 67 28 C 71 14, 78 8, 75 16 C 73 21, 69 25, 66 28 Z" fill="#FDA4AF" />
    </g>
  );
}

// Cute Panda Ears
export function PandaBase({ stage }: { stage: number }) {
  if (stage < 2) return null;
  return (
    <g stroke="#1E293B" strokeWidth="2.5">
      {/* Fluffy black ears */}
      <circle cx="32" cy="28" r="8" fill="#1E293B" />
      <circle cx="32" cy="28" r="4" fill="#334155" />
      <circle cx="68" cy="28" r="8" fill="#1E293B" />
      <circle cx="68" cy="28" r="4" fill="#334155" />
    </g>
  );
}

// Cute Fox Fluffy Tail
export function FoxBase({ stage }: { stage: number }) {
  if (stage < 2) return null;
  return (
    <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round">
      {/* Fox fluffy orange ears */}
      <polygon points="24,32 15,12 34,26" fill="#F97316" />
      <polygon points="22,28 17,16 29,24" fill="#FFEDD5" />
      
      <polygon points="76,32 85,12 66,26" fill="#F97316" />
      <polygon points="78,28 83,16 71,24" fill="#FFEDD5" />

      {/* Fluffy tail on the side */}
      <path d="M 72 72 Q 95 72 88 48 Q 78 40 70 60 Z" fill="#F97316" />
      <path d="M 88 48 Q 85 44 80 44 Q 78 46 80 50 Z" fill="#FFFFFF" />
    </g>
  );
}

export function HeroSkin({
  theme,
  stage,
  color,
  bx,
  by,
  bw,
  bh,
  br,
  animation,
}: {
  theme: string;
  stage: number;
  color: string;
  bx: number;
  by: number;
  bw: number;
  bh: number;
  br: number;
  animation: string;
}) {
  const isHappy = animation === "happy";
  const armY = by + bh * 0.6;
  const legY = by + bh - 1;
  const isBaby = stage === 2;
  const isTeen = stage === 3;
  const isHero = stage === 4;
  const isLegend = stage === 5;

  // Global helper for rendering cute character limbs based on theme and specs
  const renderLimbs = (configs: {
    armFill: string;
    handFill: string;
    legFill: string;
    bootFill: string;
    hasClaws?: boolean;
    hasSpikes?: boolean;
    customLeftArm?: React.ReactNode;
    customRightArm?: React.ReactNode;
    customLeftLeg?: React.ReactNode;
    customRightLeg?: React.ReactNode;
  }) => {
    // Left & Right Legs
    const leftLegX = bx + bw * 0.22;
    const rightLegX = bx + bw * 0.78;
    const legWidth = bw * 0.18;
    const legHeight = isBaby ? 4 : isTeen ? 8 : 12;

    const legs = (
      <g>
        {/* Left Leg */}
        {configs.customLeftLeg ? configs.customLeftLeg : (
          <g>
            <rect x={leftLegX - legWidth/2} y={legY} width={legWidth} height={legHeight} rx={2} fill={configs.legFill} />
            <ellipse cx={leftLegX} cy={legY + legHeight} rx={legWidth * 0.8} ry={3} fill={configs.bootFill} />
          </g>
        )}
        {/* Right Leg */}
        {configs.customRightLeg ? configs.customRightLeg : (
          <g>
            <rect x={rightLegX - legWidth/2} y={legY} width={legWidth} height={legHeight} rx={2} fill={configs.legFill} />
            <ellipse cx={rightLegX} cy={legY + legHeight} rx={legWidth * 0.8} ry={3} fill={configs.bootFill} />
          </g>
        )}
      </g>
    );

    // Left & Right Arms
    const armW = bw * 0.16;
    const armH = isBaby ? bh * 0.25 : isTeen ? bh * 0.4 : bh * 0.55;
    const lArmX = bx - armW * 0.6;
    const rArmX = bx + bw - armW * 0.4;

    const arms = (
      <g>
        {/* Left Arm */}
        {configs.customLeftArm ? configs.customLeftArm : (
          <g>
            {/* Upper arm / Sleeve */}
            <rect x={lArmX} y={armY - 4} width={armW} height={armH} rx={4} fill={configs.armFill} transform={`rotate(${isHappy ? -30 : 15}, ${lArmX + armW/2}, ${armY})`} />
            {/* Hand / Glove */}
            <circle cx={isHappy ? lArmX - 2 : lArmX + armW/2} cy={isHappy ? armY - armH * 0.4 : armY + armH - 1} r={armW * 0.6} fill={configs.handFill} />
            {configs.hasSpikes && (
              <path d={`M ${lArmX - 2} ${armY + 4} L ${lArmX - 6} ${armY + 6} L ${lArmX - 2} ${armY + 8}`} fill={configs.handFill} stroke="none" />
            )}
          </g>
        )}

        {/* Right Arm */}
        {configs.customRightArm ? configs.customRightArm : (
          <g>
            {/* Upper arm / Sleeve */}
            <rect x={rArmX} y={armY - 4} width={armW} height={armH} rx={4} fill={configs.armFill} transform={`rotate(${isHappy ? 30 : -15}, ${rArmX + armW/2}, ${armY})`} />
            {/* Hand / Glove */}
            <circle cx={isHappy ? rArmX + armW + 2 : rArmX + armW/2} cy={isHappy ? armY - armH * 0.4 : armY + armH - 1} r={armW * 0.6} fill={configs.handFill} />
            {configs.hasSpikes && (
              <path d={`M ${rArmX + armW + 2} ${armY + 4} L ${rArmX + armW + 6} ${armY + 6} L ${rArmX + armW + 2} ${armY + 8}`} fill={configs.handFill} stroke="none" />
            )}
          </g>
        )}
      </g>
    );

    return (
      <g id="character-limbs">
        {legs}
        {arms}
      </g>
    );
  };

  const drawPixelArt = (
    grid: string[],
    x0: number,
    y0: number,
    pixelSize: number,
    colorMap: Record<string, string>
  ) => {
    return (
      <g shapeRendering="crispEdges">
        {grid.map((row, rY) => {
          return row.split("").map((char, rX) => {
            const fill = colorMap[char];
            if (!fill) return null;
            return (
              <rect
                key={`${rX}-${rY}`}
                x={x0 + rX * pixelSize}
                y={y0 + rY * pixelSize}
                width={pixelSize}
                height={pixelSize}
                fill={fill}
                stroke={fill}
                strokeWidth="0.3"
              />
            );
          });
        })}
      </g>
    );
  };


  const ctx: SkinCtx = {
    theme, stage, color, bx, by, bw, bh, br, animation,
    isHappy, armY, legY, isBaby, isTeen, isHero, isLegend,
    renderLimbs, drawPixelArt,
  };
  const renderer = SKIN_RENDERERS[theme];
  if (renderer) return <>{renderer(ctx)}</>;

  // Fallback generic base
  return (
    <g stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round">
      <rect x={bx} y={by} width={bw} height={bh} rx={br} fill={color} />
      
      <g fill="#1E293B" stroke="none">
        <circle cx="41" cy="48" r="3.5" />
        <circle cx="59" cy="48" r="3.5" />
        <circle cx="42" cy="46.5" r="1" fill="#FFFFFF" />
        <circle cx="60" cy="46.5" r="1" fill="#FFFFFF" />
      </g>
      
      {isHappy ? (
        <path d="M 46 54 Q 50 62 54 54" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="#EF4444" />
      ) : (
        <path d="M 47 55 Q 50 58 53 55" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
      )}
      
      <circle cx="36" cy="51" r="2.5" fill="#F87171" opacity="0.4" stroke="none" />
      <circle cx="64" cy="51" r="2.5" fill="#F87171" opacity="0.4" stroke="none" />
    </g>
  );
}
