import React from "react";
import type { SkinCtx } from "./types";

export function skinHomemFerroPixel(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const floatY = animation === "happy" ? -3 : animation === "wave" ? -1 : 0;
    
    return (
      <g stroke="none" transform={`translate(0, ${floatY})`}>
        <defs>
          <linearGradient id="ironRedFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
          <linearGradient id="ironRedTop" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FCA5A5" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <linearGradient id="ironRedSide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7F1D1D" />
            <stop offset="100%" stopColor="#450A0A" />
          </linearGradient>
          
          <linearGradient id="ironGoldFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="ironGoldTop" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
          <linearGradient id="ironGoldSide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>
          
          <radialGradient id="ironEyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#A5F3FC" />
            <stop offset="100%" stopColor="#06B6D4" />
          </radialGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="50" cy="92" rx="20" ry="3.5" fill="#0F172A" opacity="0.3" className="animate-pulse" />

        {/* Boot Thrusters (Plumes of flame) */}
        <g className="animate-pulse">
          {/* Left Flame */}
          <path d="M 41 88 L 45 104 L 49 88 Z" fill="#F97316" />
          <path d="M 43 88 L 45 98 L 47 88 Z" fill="#FBBF24" />
          <circle cx="45" cy="88" r="3" fill="#22D3EE" />
          
          {/* Right Flame */}
          <path d="M 51 88 L 55 104 L 59 88 Z" fill="#F97316" />
          <path d="M 53 88 L 55 98 L 57 88 Z" fill="#FBBF24" />
          <circle cx="55" cy="88" r="3" fill="#22D3EE" />
        </g>

        {/* Limbs 3D Blocks - Left Arm */}
        <g transform={`rotate(${animation === "happy" ? -45 : animation === "wave" ? -25 : 10}, 28, 48)`}>
          {/* Red shoulder */}
          <rect x="23" y="48" width="7" height="10" fill="url(#ironRedFront)" rx="1.5" />
          <polygon points="23,48 27,44 34,44 30,48" fill="url(#ironRedTop)" />
          <polygon points="30,48 34,44 34,58 30,62" fill="url(#ironRedSide)" />
          {/* Gold forearm */}
          <rect x="23" y="58" width="7" height="8" fill="url(#ironGoldFront)" rx="1" />
          {/* Glowing Repulsor Hand */}
          <circle cx="26.5" cy="66" r="4" fill="#E2E8F0" />
          <circle cx="26.5" cy="66" r="2.5" fill="#22D3EE" className="animate-pulse" />
        </g>

        {/* Limbs 3D Blocks - Right Arm */}
        <g transform={`rotate(${animation === "happy" ? 45 : animation === "wave" ? 35 : -10}, 72, 48)`}>
          {/* Red shoulder */}
          <rect x="70" y="48" width="7" height="10" fill="url(#ironRedFront)" rx="1.5" />
          <polygon points="70,48 74,44 81,44 77,48" fill="url(#ironRedTop)" />
          <polygon points="77,48 81,44 81,58 77,62" fill="url(#ironRedSide)" />
          {/* Gold forearm */}
          <rect x="70" y="58" width="7" height="8" fill="url(#ironGoldFront)" rx="1" />
          {/* Glowing Repulsor Hand */}
          <circle cx="73.5" cy="66" r="4" fill="#E2E8F0" />
          <circle cx="73.5" cy="66" r="2.5" fill="#22D3EE" className="animate-pulse" />
        </g>

        {/* Limbs 3D Blocks - Left Leg */}
        <g>
          {/* Red thigh */}
          <rect x="41" y="74" width="8" height="8" fill="url(#ironRedFront)" rx="1" />
          <polygon points="49,74 53,70 53,78 49,82" fill="url(#ironRedSide)" />
          {/* Gold boot */}
          <rect x="41" y="80" width="8" height="8" fill="url(#ironGoldFront)" rx="1" />
          <polygon points="49,80 53,76 53,84 49,88" fill="url(#ironGoldSide)" />
          {/* Toe element */}
          <path d="M 41 88 L 36 90 L 44 90 L 49 88 Z" fill="url(#ironGoldTop)" />
        </g>

        {/* Limbs 3D Blocks - Right Leg */}
        <g>
          {/* Red thigh */}
          <rect x="51" y="74" width="8" height="8" fill="url(#ironRedFront)" rx="1" />
          <polygon points="59,74 63,70 63,78 59,82" fill="url(#ironRedSide)" />
          {/* Gold boot */}
          <rect x="51" y="80" width="8" height="8" fill="url(#ironGoldFront)" rx="1" />
          <polygon points="59,80 63,76 63,84 59,88" fill="url(#ironGoldSide)" />
          {/* Toe element */}
          <path d="M 51 88 L 46 90 L 54 90 L 59 88 Z" fill="url(#ironGoldTop)" />
        </g>

        {/* Torso 3D Block */}
        <g>
          {/* Top face */}
          <polygon points="40,48 44,44 64,44 60,48" fill="url(#ironRedTop)" />
          {/* Right side */}
          <polygon points="60,48 64,44 64,70 60,74" fill="url(#ironRedSide)" />
          {/* Front Face */}
          <rect x="40" y="48" width="20" height="26" fill="url(#ironRedFront)" rx="1" />
          
          {/* Shoulder details */}
          <rect x="39" y="48" width="4" height="6" fill="url(#ironGoldFront)" rx="1" />
          <rect x="57" y="48" width="4" height="6" fill="url(#ironGoldFront)" rx="1" />

          {/* Chest layout lines */}
          <line x1="43" y1="58" x2="57" y2="58" stroke="#7F1D1D" strokeWidth="1" />

          {/* High-Tech Glowing Chest Arc Reactor */}
          <circle cx="50" cy="60" r="5" fill="#0891B2" />
          <circle cx="50" cy="60" r="3.8" fill="#22D3EE" />
          <circle cx="50" cy="60" r="1.8" fill="#FFFFFF" className="animate-pulse" />
        </g>

        {/* Head 3D Block */}
        <g>
          {/* Top face */}
          <polygon points="38,24 42,20 66,20 62,24" fill="url(#ironRedTop)" />
          {/* Right side */}
          <polygon points="62,24 66,20 66,44 62,48" fill="url(#ironRedSide)" />
          {/* Front Face */}
          <rect x="38" y="24" width="24" height="24" rx="2" fill="url(#ironRedFront)" />
          
          {/* Inset Gold Faceplate */}
          <rect x="41" y="28" width="18" height="18" rx="2" fill="url(#ironGoldFront)" />
          <polygon points="41,28 44,25 56,25 59,28" fill="url(#ironGoldTop)" />
          <polygon points="59,28 59,44 56,44 56,30" fill="url(#ironGoldSide)" opacity="0.4" />

          {/* Glowing Eyes */}
          {/* Left Eye */}
          <rect x="43" y="34" width="5" height="2" fill="#22D3EE" rx="0.5" />
          <rect x="44.5" y="34" width="2" height="1" fill="#FFFFFF" />
          {/* Right Eye */}
          <rect x="52" y="34" width="5" height="2" fill="#22D3EE" rx="0.5" />
          <rect x="53.5" y="34" width="2" height="1" fill="#FFFFFF" />
        </g>

        {/* Charging Repulsor Beam Ray */}
        {stage >= 3 && (
          <g className="animate-pulse">
            <circle cx="73.5" cy="66" r="8" fill="rgba(34, 211, 238, 0.2)" />
            <line x1="73.5" y1="66" x2="110" y2="76" stroke="#22D3EE" strokeWidth="2.5" />
            <line x1="73.5" y1="66" x2="110" y2="76" stroke="#FFFFFF" strokeWidth="1" />
          </g>
        )}
      </g>
    );
  }
}
