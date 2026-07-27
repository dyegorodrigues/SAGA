import React from "react";
import type { SkinCtx, LimbConfig } from "./types";

export function skinHomemAranhaPixel(ctx: SkinCtx) {
  const { theme, stage, color, bx, by, bw, bh, br, animation, isHappy, armY, legY, isBaby, isTeen, isHero, isLegend, renderLimbs, drawPixelArt } = ctx;
  {
    const floatY = animation === "happy" ? -4 : animation === "wave" ? -2 : 0;
    
    return (
      <g stroke="none" transform={`translate(0, ${floatY})`}>
        <defs>
          <linearGradient id="spideyRedFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
          <linearGradient id="spideyRedTop" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FCA5A5" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <linearGradient id="spideyRedSide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7F1D1D" />
            <stop offset="100%" stopColor="#450A0A" />
          </linearGradient>
          
          <linearGradient id="spideyBlueFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="spideyBlueSide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>
          <linearGradient id="spideyBlueTop" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <radialGradient id="spideyEyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="75%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#38BDF8" />
          </radialGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="50" cy="92" rx="20" ry="3.5" fill="#0F172A" opacity="0.3" className="animate-pulse" />

        {/* Spider-Sense Sparks (glowing indicators above head) */}
        {stage >= 3 && (
          <g className="animate-pulse" fill="#FBBF24">
            <rect x="34" y="10" width="3" height="3" rx="0.5" />
            <rect x="42" y="6" width="3" height="3" rx="0.5" />
            <rect x="58" y="6" width="3" height="3" rx="0.5" />
            <rect x="66" y="10" width="3" height="3" rx="0.5" />
            <circle cx="50" cy="3" r="2" fill="#F59E0B" />
          </g>
        )}

        {/* Protruding mechanical gold spider claws for Legend (Stage 5) */}
        {isLegend && (
          <g stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinejoin="round">
            {/* Top Left Claw */}
            <path d="M 38 48 L 18 32 L 12 40" />
            <path d="M 38 48 L 18 32 L 12 40" stroke="#EF4444" strokeWidth="1" />
            <circle cx="12" cy="40" r="3" fill="#F59E0B" stroke="none" />
            {/* Top Right Claw */}
            <path d="M 62 48 L 82 32 L 88 40" />
            <path d="M 62 48 L 82 32 L 88 40" stroke="#EF4444" strokeWidth="1" />
            <circle cx="88" cy="40" r="3" fill="#F59E0B" stroke="none" />
            {/* Bottom Left Claw */}
            <path d="M 38 64 L 16 70 L 10 62" />
            <path d="M 38 64 L 16 70 L 10 62" stroke="#EF4444" strokeWidth="1" />
            <circle cx="10" cy="62" r="3" fill="#F59E0B" stroke="none" />
            {/* Bottom Right Claw */}
            <path d="M 62 64 L 84 70 L 90 62" />
            <path d="M 62 64 L 84 70 L 90 62" stroke="#EF4444" strokeWidth="1" />
            <circle cx="90" cy="62" r="3" fill="#F59E0B" stroke="none" />
          </g>
        )}

        {/* Limbs 3D Blocks - Left Arm */}
        <g transform={`rotate(${animation === "happy" ? -45 : animation === "wave" ? -25 : 10}, 28, 48)`}>
          {/* Upper arm */}
          <rect x="23" y="48" width="7" height="16" fill="url(#spideyRedFront)" rx="1.5" />
          <polygon points="23,48 27,44 34,44 30,48" fill="url(#spideyRedTop)" />
          <polygon points="30,48 34,44 34,60 30,64" fill="url(#spideyRedSide)" />
          {/* Glove */}
          <circle cx="26.5" cy="64" r="4.5" fill="#1D4ED8" />
        </g>

        {/* Limbs 3D Blocks - Right Arm */}
        <g transform={`rotate(${animation === "happy" ? 45 : animation === "wave" ? 35 : -10}, 72, 48)`}>
          {/* Upper arm */}
          <rect x="70" y="48" width="7" height="16" fill="url(#spideyRedFront)" rx="1.5" />
          <polygon points="70,48 74,44 81,44 77,48" fill="url(#spideyRedTop)" />
          <polygon points="77,48 81,44 81,60 77,64" fill="url(#spideyRedSide)" />
          {/* Glove */}
          <circle cx="73.5" cy="64" r="4.5" fill="#1D4ED8" />
        </g>

        {/* Limbs 3D Blocks - Left Leg */}
        <g>
          {/* Upper leg */}
          <rect x="41" y="74" width="8" height="10" fill="url(#spideyBlueFront)" rx="1" />
          <polygon points="49,74 53,70 53,80 49,84" fill="url(#spideyBlueSide)" />
          {/* Red Boot */}
          <rect x="41" y="81" width="8" height="7" fill="url(#spideyRedFront)" rx="1" />
          <polygon points="49,81 53,77 53,84 49,88" fill="url(#spideyRedSide)" />
          {/* Extended Foot */}
          <path d="M 41 88 L 36 90 L 44 90 L 49 88 Z" fill="url(#spideyRedTop)" />
        </g>

        {/* Limbs 3D Blocks - Right Leg */}
        <g>
          {/* Upper leg */}
          <rect x="51" y="74" width="8" height="10" fill="url(#spideyBlueFront)" rx="1" />
          <polygon points="59,74 63,70 63,80 59,84" fill="url(#spideyBlueSide)" />
          {/* Red Boot */}
          <rect x="51" y="81" width="8" height="7" fill="url(#spideyRedFront)" rx="1" />
          <polygon points="59,81 63,77 63,84 59,88" fill="url(#spideyRedSide)" />
          {/* Extended Foot */}
          <path d="M 51 88 L 46 90 L 54 90 L 59 88 Z" fill="url(#spideyRedTop)" />
        </g>

        {/* Torso 3D Block */}
        <g>
          {/* Top of shoulders */}
          <polygon points="40,48 44,44 64,44 60,48" fill="url(#spideyBlueTop)" />
          {/* Right side depth */}
          <polygon points="60,48 64,44 64,70 60,74" fill="url(#spideyBlueSide)" />
          {/* Front Face (Red center, blue sides) */}
          <rect x="40" y="48" width="20" height="26" fill="url(#spideyBlueFront)" rx="1" />
          <rect x="44" y="48" width="12" height="26" fill="url(#spideyRedFront)" />
          {/* Spider Chest Emblem */}
          <rect x="49" y="55" width="2" height="6" fill="#111827" rx="0.5" />
          <path d="M 46 57 Q 50 60 54 57 M 45 61 Q 50 63 55 61" stroke="#111827" strokeWidth="1" fill="none" />
        </g>

        {/* Head 3D Block */}
        <g>
          {/* Top face */}
          <polygon points="38,24 42,20 66,20 62,24" fill="url(#spideyRedTop)" />
          {/* Right side */}
          <polygon points="62,24 66,20 66,44 62,48" fill="url(#spideyRedSide)" />
          {/* Front Face */}
          <rect x="38" y="24" width="24" height="24" rx="2" fill="url(#spideyRedFront)" />
          
          {/* Webbing details (subtle and high-fidelity) */}
          <line x1="50" y1="24" x2="50" y2="48" stroke="#090D16" strokeWidth="1" opacity="0.25" />
          <line x1="38" y1="36" x2="62" y2="36" stroke="#090D16" strokeWidth="1" opacity="0.25" />
          <line x1="38" y1="24" x2="62" y2="48" stroke="#090D16" strokeWidth="1" opacity="0.2" />
          <line x1="62" y1="24" x2="38" y2="48" stroke="#090D16" strokeWidth="1" opacity="0.2" />
          <path d="M42 36 Q50 40 58 36 M45 30 Q50 34 55 30" fill="none" stroke="#090D16" strokeWidth="0.75" opacity="0.25" />

          {/* Glowing Eyes */}
          {/* Left Eye */}
          <polygon points="41,33 49,33 47,41 42,39" fill="#090D16" />
          <polygon points="42,34 48,34 46,40 43,38" fill="url(#spideyEyeGlow)" />
          {/* Right Eye */}
          <polygon points="59,33 51,33 53,41 58,39" fill="#090D16" />
          <polygon points="58,34 52,34 54,40 57,38" fill="url(#spideyEyeGlow)" />
        </g>

        {/* Web Shooting Ray */}
        {stage >= 3 && (
          <g className="animate-pulse" stroke="#FFFFFF" fill="none">
            {/* Main web line */}
            <path d="M 26 64 Q 5 55 -20 45" strokeWidth="2" />
            {/* Inner blue energy core */}
            <path d="M 26 64 Q 5 55 -20 45" stroke="#E0F2FE" strokeWidth="1" />
            {/* Web ribs (cross lines to make it look like a web) */}
            <path d="M 22 65 Q 18 58 20 53" strokeWidth="1" />
            <path d="M 12 60 Q 8 53 10 48" strokeWidth="1" />
            <path d="M 2 55 Q -2 48 0 43" strokeWidth="1" />
            <path d="M -8 50 Q -12 43 -10 38" strokeWidth="1" />
            {/* Web impact / splash */}
            <circle cx="26" cy="64" r="3" fill="#FFFFFF" stroke="none" />
          </g>
        )}
      </g>
    );
  }
}
