import React from "react";
import type { SkinCtx, LimbConfig } from "./types";

export function skinHulkPixel(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const floatY = animation === "happy" ? -2 : 0;
    
    return (
      <g stroke="none" transform={`translate(0, ${floatY})`}>
        <defs>
          <linearGradient id="hulkGreenFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <linearGradient id="hulkGreenTop" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
          <linearGradient id="hulkGreenSide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14532D" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>
          
          <linearGradient id="hulkPantsFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#6B21A8" />
          </linearGradient>
          <linearGradient id="hulkPantsSide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#581C87" />
            <stop offset="100%" stopColor="#3B0764" />
          </linearGradient>
          <linearGradient id="hulkPantsTop" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          
          <linearGradient id="hulkHairFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1F2937" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
          <linearGradient id="hulkHairTop" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1F2937" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="50" cy="92" rx="22" ry="4" fill="#0F172A" opacity="0.35" className="animate-pulse" />

        {/* Ground Slam Particle Shockwave for active stages */}
        {stage >= 4 && (
          <g fill="#94A3B8" opacity="0.8" className="animate-pulse">
            <ellipse cx="50" cy="91" rx="28" ry="5" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="20" cy="89" r="2.5" />
            <circle cx="80" cy="89" r="2.5" />
            <rect x="24" y="91" width="4" height="2" />
            <rect x="72" y="91" width="4" height="2" />
          </g>
        )}

        {/* Limbs 3D Blocks - Left Muscular Arm */}
        <g transform={`rotate(${animation === "happy" ? -35 : 5}, 24, 48)`}>
          <rect x="18" y="46" width="9" height="18" fill="url(#hulkGreenFront)" rx="2" />
          <polygon points="18,46 22,42 31,42 27,46" fill="url(#hulkGreenTop)" />
          <polygon points="27,46 31,42 31,60 27,64" fill="url(#hulkGreenSide)" />
          {/* Fist */}
          <circle cx="22.5" cy="64" r="5.5" fill="#15803D" />
        </g>

        {/* Limbs 3D Blocks - Right Muscular Arm */}
        <g transform={`rotate(${animation === "happy" ? 35 : -5}, 76, 48)`}>
          <rect x="73" y="46" width="9" height="18" fill="url(#hulkGreenFront)" rx="2" />
          <polygon points="73,46 77,42 86,42 82,46" fill="url(#hulkGreenTop)" />
          <polygon points="82,46 86,42 86,60 82,64" fill="url(#hulkGreenSide)" />
          {/* Fist */}
          <circle cx="77.5" cy="64" r="5.5" fill="#15803D" />
        </g>

        {/* Limbs 3D Blocks - Left Leg */}
        <g>
          {/* Purple pants leg */}
          <rect x="39" y="74" width="9" height="10" fill="url(#hulkPantsFront)" rx="1" />
          <polygon points="48,74 52,70 52,80 48,84" fill="url(#hulkPantsSide)" />
          {/* Green Foot */}
          <rect x="39" y="82" width="9" height="6" fill="url(#hulkGreenFront)" rx="1" />
          <polygon points="48,82 52,78 52,84 48,88" fill="url(#hulkGreenSide)" />
          <path d="M 39 88 L 34 90 L 43 90 L 48 88 Z" fill="url(#hulkGreenTop)" />
        </g>

        {/* Limbs 3D Blocks - Right Leg */}
        <g>
          {/* Purple pants leg */}
          <rect x="52" y="74" width="9" height="10" fill="url(#hulkPantsFront)" rx="1" />
          <polygon points="61,74 65,70 65,80 61,84" fill="url(#hulkPantsSide)" />
          {/* Green Foot */}
          <rect x="52" y="82" width="9" height="6" fill="url(#hulkGreenFront)" rx="1" />
          <polygon points="61,82 65,78 65,84 61,88" fill="url(#hulkGreenSide)" />
          <path d="M 52 88 L 47 90 L 56 90 L 61 88 Z" fill="url(#hulkGreenTop)" />
        </g>

        {/* Torso 3D Block (Huge & Wide) */}
        <g>
          {/* Top face */}
          <polygon points="32,44 36,40 68,40 64,44" fill="url(#hulkGreenTop)" />
          {/* Right side */}
          <polygon points="64,44 68,40 68,68 64,72" fill="url(#hulkGreenSide)" />
          {/* Front Face (Green Body) */}
          <rect x="32" y="44" width="32" height="28" fill="url(#hulkGreenFront)" rx="2" />
          
          {/* Purple Shredded Pants Section */}
          <rect x="32" y="64" width="32" height="8" fill="url(#hulkPantsFront)" />
          <polygon points="32,72 35,75 38,72 41,75 44,72 47,75 50,72 53,75 56,72 59,75 62,72 64,72" fill="url(#hulkPantsFront)" />

          {/* Muscle Definitions */}
          {/* Left Pec */}
          <rect x="36" y="48" width="10" height="7" rx="1.5" fill="#15803D" opacity="0.4" />
          {/* Right Pec */}
          <rect x="54" y="48" width="10" height="7" rx="1.5" fill="#15803D" opacity="0.4" />
          {/* Abdominals block */}
          <rect x="45" y="57" width="10" height="6" fill="#15803D" opacity="0.3" rx="0.5" />
        </g>

        {/* Head 3D Block */}
        <g>
          {/* Top face */}
          <polygon points="34,20 38,16 70,16 66,20" fill="url(#hulkGreenTop)" />
          {/* Right side */}
          <polygon points="66,20 70,16 70,40 66,44" fill="url(#hulkGreenSide)" />
          {/* Front Face */}
          <rect x="34" y="20" width="32" height="24" rx="2" fill="url(#hulkGreenFront)" />

          {/* Spiky 3D Voxel Hair */}
          <polygon points="34,20 38,24 42,20 46,24 50,20 54,24 58,20 62,24 66,20" fill="url(#hulkHairFront)" />
          <polygon points="34,20 38,16 70,16 66,20" fill="url(#hulkHairTop)" />
          <polygon points="36,16 41,11 46,16 51,11 56,16 61,11 66,16" fill="url(#hulkHairFront)" />

          {/* Angry Brows & Red Rage Eyes */}
          <rect x="38" y="26" width="24" height="4" fill="#064E3B" rx="1" />
          {/* Left Rage Eye */}
          <polygon points="40,29 46,30 45,34 41,33" fill="#111827" />
          <polygon points="41,30 45,31 44,33 42,32" fill="#FFFFFF" />
          <circle cx="43" cy="31.5" r="1" fill="#EF4444" />
          {/* Right Rage Eye */}
          <polygon points="60,29 54,30 55,34 59,33" fill="#111827" />
          <polygon points="59,30 55,31 56,33 58,32" fill="#FFFFFF" />
          <circle cx="57" cy="31.5" r="1" fill="#EF4444" />

          {/* Snarl teeth */}
          <rect x="44" y="36" width="12" height="5" fill="#111827" rx="0.5" />
          <rect x="45" y="37" width="10" height="3" fill="#F8FAFC" />
          <line x1="50" y1="37" x2="50" y2="40" stroke="#111827" strokeWidth="0.75" />
        </g>

        {/* Dynamic Massive Clenched Fists (Bouncing when active / Legend stage) */}
      </g>
    );
  }
}
