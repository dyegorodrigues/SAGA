import React from "react";
import { getSceneSvg } from "./sceneAssets";

/**
 * AnimalLifeScene 🐣 — Cena Viva do ciclo de vida do animal (ovo→ovo rachando→pintinho→
 * galinha), fechando a trilogia do ciclo da vida (planta/pessoa/animal). Não emoji —
 * cena que a criança lê e ordena. Stateless (SSR-friendly).
 */
export default function AnimalLifeScene({ stage, size = 220 }: { stage: 1 | 2 | 3 | 4; size?: number }) {
  const uid = React.useId();
  const asset = getSceneSvg("animal", stage);
  if (asset) return <img src={asset} width={size} height={size} alt={`Fase ${stage}`} style={{ maxWidth: "100%" }} />;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={`Fase ${stage}`} style={{ maxWidth: "100%" }}>
      <defs>
        <linearGradient id={`sk${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FEF9C3" /><stop offset="1" stopColor="#FDE68A" />
        </linearGradient>
        <clipPath id={`c${uid}`}><rect x="6" y="6" width="188" height="188" rx="22" /></clipPath>
      </defs>
      <g clipPath={`url(#c${uid})`}>
        <rect x="6" y="6" width="188" height="188" fill={`url(#sk${uid})`} />
        <path d="M6 158 Q100 148 194 158 L194 194 L6 194 Z" fill="#86EFAC" />
        {/* ninho de palha */}
        <ellipse cx="100" cy="160" rx="52" ry="16" fill="#CA8A04" stroke="#92400E" strokeWidth="2.5" />
        <ellipse cx="100" cy="156" rx="42" ry="11" fill="#A16207" />

        {/* ---------- 1: OVO inteiro ---------- */}
        {stage === 1 && (
          <ellipse cx="100" cy="128" rx="26" ry="33" fill="#FFF7ED" stroke="#1E293B" strokeWidth="3" />
        )}

        {/* ---------- 2: OVO rachando (bico aparece) ---------- */}
        {stage === 2 && (
          <g>
            <ellipse cx="100" cy="128" rx="26" ry="33" fill="#FFF7ED" stroke="#1E293B" strokeWidth="3" />
            <path d="M74 122 L84 116 L92 124 L100 116 L108 124 L116 116 L126 122" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
            <circle cx="100" cy="132" r="3.5" fill="#1E293B" />
            <polygon points="97,120 103,120 100,126" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.5" />
          </g>
        )}

        {/* ---------- 3: PINTINHO ---------- */}
        {stage === 3 && (
          <g transform="translate(100 120)">
            <ellipse cx="0" cy="18" rx="24" ry="20" fill="#FDE047" stroke="#1E293B" strokeWidth="2.5" />
            <circle cx="0" cy="-6" r="19" fill="#FDE047" stroke="#1E293B" strokeWidth="2.5" />
            <circle cx="-6" cy="-8" r="2.6" fill="#1E293B" /><circle cx="6" cy="-8" r="2.6" fill="#1E293B" />
            <polygon points="-4,-2 4,-2 0,4" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.5" />
            <path d="M-9 38 l0 6 M9 38 l0 6" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
            <path d="M18 16 q10 2 6 12" fill="#FDE047" stroke="#1E293B" strokeWidth="2" /> {/* asa */}
          </g>
        )}

        {/* ---------- 4: GALINHA ---------- */}
        {stage === 4 && (
          <g transform="translate(100 108)">
            <ellipse cx="0" cy="26" rx="34" ry="26" fill="#F8FAFC" stroke="#1E293B" strokeWidth="3" />
            <circle cx="-18" cy="0" r="17" fill="#F8FAFC" stroke="#1E293B" strokeWidth="3" />
            {/* crista */}
            <path d="M-26 -14 q3 -8 8 -3 q3 -8 8 -1" fill="#EF4444" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="-22" cy="-2" r="2.6" fill="#1E293B" />
            <polygon points="-34,0 -34,6 -42,3" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.5" />
            {/* barbela */}
            <path d="M-30 8 q-2 6 2 8" fill="#EF4444" stroke="#1E293B" strokeWidth="1.5" />
            {/* asa + cauda */}
            <path d="M2 20 q18 -4 24 10 q-14 8 -24 -2 Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" />
            <path d="M30 14 q14 -8 16 4 q-8 4 -16 6 Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" />
            <path d="M-8 50 l0 8 M10 50 l0 8" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        )}
      </g>
    </svg>
  );
}
