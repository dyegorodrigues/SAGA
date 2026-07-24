import React from 'react';

export function FullscreenScenery({ bg }: { bg: string }) {
  if (!bg || bg === "default" || bg === "none") return null;

  return (
    <div className="fixed inset-0 z-[-10] pointer-events-none w-full h-full overflow-hidden opacity-80">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        {bg === "espaco" && (
          <g>
            <rect x="0" y="0" width="100" height="100" fill="#0B0F19" />
            <circle cx="25" cy="25" r="1.2" fill="#FFFFFF" opacity="0.9" />
            <circle cx="75" cy="30" r="1.5" fill="#FFFFFF" opacity="0.8" className="animate-pulse" />
            <circle cx="35" cy="65" r="1.2" fill="#38BDF8" opacity="0.7" />
            <circle cx="68" cy="72" r="1" fill="#FBBF24" opacity="0.9" />
            <path d="M 22 18 A 6 6 0 0 0 34 26 A 8 8 0 1 1 22 18 Z" fill="#FDE047" opacity="0.85" />
            <g transform="translate(74, 20) rotate(-15) scale(0.6)">
              <ellipse cx="0" cy="0" rx="14" ry="4" fill="none" stroke="#F59E0B" strokeWidth="3" opacity="0.6" />
              <circle cx="0" cy="0" r="8" fill="#F3F4F6" />
              <ellipse cx="0" cy="0" rx="14" ry="4" fill="none" stroke="#FBBF24" strokeWidth="1.5" />
            </g>
          </g>
        )}
        {bg === "castelo" && (
          <g>
            <rect x="0" y="0" width="100" height="100" fill="#2E1065" />
            <circle cx="50" cy="35" r="28" fill="#4C1D95" opacity="0.5" />
            <circle cx="30" cy="20" r="1" fill="#FFF" />
            <circle cx="70" cy="22" r="1" fill="#FFF" />
            <g fill="#1E1B4B" stroke="#4C1D95" strokeWidth="0.5">
              <rect x="20" y="52" width="60" height="48" />
              <rect x="18" y="32" width="14" height="68" />
              <polygon points="15,32 25,14 35,32" fill="#0F172A" />
              <rect x="68" y="32" width="14" height="68" />
              <polygon points="65,32 75,14 85,32" fill="#0F172A" />
              <rect x="36" y="44" width="8" height="8" />
              <rect x="48" y="44" width="8" height="8" />
              <rect x="60" y="44" width="8" height="8" />
            </g>
            <rect x="23" y="42" width="4" height="8" rx="1" fill="#FDE047" />
            <rect x="73" y="42" width="4" height="8" rx="1" fill="#FDE047" />
            <path d="M 46 64 A 4 4 0 0 1 54 64 Z" fill="#FDE047" />
          </g>
        )}
        {bg === "campo" && (
          <g>
            <rect x="0" y="0" width="100" height="100" fill="#38BDF8" />
            <circle cx="25" cy="24" r="10" fill="#FFFFFF" opacity="0.8" />
            <circle cx="35" cy="26" r="8" fill="#FFFFFF" opacity="0.8" />
            <circle cx="75" cy="20" r="12" fill="#FFFFFF" opacity="0.8" />
            <ellipse cx="50" cy="110" rx="90" ry="62" fill="#15803D" />
            <ellipse cx="50" cy="110" rx="80" ry="50" fill="#166534" />
            <ellipse cx="50" cy="110" rx="70" ry="38" fill="#15803D" />
            <path d="M 28 85 L 28 58 L 72 58 L 72 85" fill="none" stroke="#E2E8F0" strokeWidth="2.5" opacity="0.6" />
          </g>
        )}
        {bg === "parque" && (
          <g>
            <rect x="0" y="0" width="100" height="100" fill="#BAE6FD" />
            <circle cx="20" cy="20" r="10" fill="#F59E0B" />
            <circle cx="20" cy="20" r="7" fill="#FDE047" />
            <ellipse cx="20" cy="85" rx="45" ry="20" fill="#22C55E" opacity="0.8" />
            <ellipse cx="80" cy="85" rx="50" ry="22" fill="#16A34A" opacity="0.9" />
            <ellipse cx="48" cy="92" rx="60" ry="20" fill="#15803D" />
            <g transform="translate(74, 48)">
              <rect x="-3" y="10" width="6" height="25" fill="#78350F" />
              <circle cx="0" cy="4" r="12" fill="#166534" />
              <circle cx="-6" cy="-2" r="10" fill="#15803D" />
              <circle cx="6" cy="-2" r="10" fill="#166534" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
