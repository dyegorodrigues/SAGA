import React from "react";
import { getSceneSvg } from "./sceneAssets";

/**
 * PersonLifeScene 👶 — Cena Viva das fases da vida da pessoa (o "bebê→criança→adulto→
 * idoso" que o Zeus pediu, o ciclo da vida com naturalidade). Uma figura que cresce e
 * envelhece, no MESMO estilo, em 4 estágios. Não emoji — cena que a criança lê.
 */
export default function PersonLifeScene({ stage, size = 220 }: { stage: 1 | 2 | 3 | 4; size?: number }) {
  const uid = React.useId();
  // altura da figura cresce e depois "encolhe" um tico no idoso (postura)
  const skin = "#FDE7C9";
  const hair = stage === 4 ? "#CBD5E1" : stage === 1 ? "#A16207" : "#78350F";
  const asset = getSceneSvg("lifestage", stage);
  if (asset) return <img src={asset} width={size} height={size} alt={`Fase ${stage}`} style={{ maxWidth: "100%" }} />;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={`Fase ${stage}`} style={{ maxWidth: "100%" }}>
      <defs>
        <linearGradient id={`bg${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F5F3FF" /><stop offset="1" stopColor="#E9D5FF" />
        </linearGradient>
        <clipPath id={`c${uid}`}><rect x="6" y="6" width="188" height="188" rx="22" /></clipPath>
      </defs>
      <g clipPath={`url(#c${uid})`}>
        <rect x="6" y="6" width="188" height="188" fill={`url(#bg${uid})`} />
        <path d="M6 168 Q100 156 194 168 L194 194 L6 194 Z" fill="#DDD6FE" />

        {/* ---------- BEBÊ: engatinhando, cabeção, chupeta ---------- */}
        {stage === 1 && (
          <g transform="translate(100 130)">
            <ellipse cx="0" cy="14" rx="26" ry="15" fill="#93C5FD" stroke="#1E293B" strokeWidth="2.5" />
            <circle cx="0" cy="-8" r="22" fill={skin} stroke="#1E293B" strokeWidth="2.5" />
            <path d="M-20 -14 A22 22 0 0 1 20 -14 Q0 -6 -20 -14" fill={hair} />
            <circle cx="-7" cy="-8" r="2.4" fill="#1E293B" /><circle cx="7" cy="-8" r="2.4" fill="#1E293B" />
            <circle cx="0" cy="0" r="3.5" fill="#F472B6" /> {/* chupeta */}
            <circle cx="-12" cy="-3" r="3" fill="#FBB6CE" opacity="0.7" /><circle cx="12" cy="-3" r="3" fill="#FBB6CE" opacity="0.7" />
          </g>
        )}

        {/* ---------- CRIANÇA: pequena, em pé, sorrindo ---------- */}
        {stage === 2 && (
          <g transform="translate(100 96)">
            <circle cx="0" cy="0" r="18" fill={skin} stroke="#1E293B" strokeWidth="2.5" />
            <path d="M-18 -6 A18 18 0 0 1 18 -6 Q0 -14 -18 -6" fill={hair} />
            <circle cx="-6" cy="0" r="2.3" fill="#1E293B" /><circle cx="6" cy="0" r="2.3" fill="#1E293B" />
            <path d="M-5 7 q5 5 10 0" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            <rect x="-14" y="18" width="28" height="34" rx="8" fill="#34D399" stroke="#1E293B" strokeWidth="2.5" />
            <rect x="-9" y="52" width="7" height="18" rx="3" fill={skin} stroke="#1E293B" strokeWidth="2" />
            <rect x="2" y="52" width="7" height="18" rx="3" fill={skin} stroke="#1E293B" strokeWidth="2" />
          </g>
        )}

        {/* ---------- ADULTO: alto, ombros largos ---------- */}
        {stage === 3 && (
          <g transform="translate(100 78)">
            <circle cx="0" cy="0" r="19" fill={skin} stroke="#1E293B" strokeWidth="2.5" />
            <path d="M-19 -5 A19 19 0 0 1 19 -5 Q0 -14 -19 -5" fill={hair} />
            <circle cx="-6" cy="1" r="2.4" fill="#1E293B" /><circle cx="6" cy="1" r="2.4" fill="#1E293B" />
            <path d="M-5 9 q5 4 10 0" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            <path d="M-20 22 Q0 16 20 22 L16 66 L-16 66 Z" fill="#6366F1" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
            <rect x="-13" y="66" width="9" height="22" rx="3" fill="#1E293B" />
            <rect x="4" y="66" width="9" height="22" rx="3" fill="#1E293B" />
          </g>
        )}

        {/* ---------- IDOSO: bengala, óculos, cabelo grisalho, curvado ---------- */}
        {stage === 4 && (
          <g transform="translate(98 82)">
            <circle cx="0" cy="0" r="18" fill={skin} stroke="#1E293B" strokeWidth="2.5" />
            <path d="M-18 -4 A18 18 0 0 1 18 -4 Q0 -12 -18 -4" fill={hair} />
            {/* óculos */}
            <g fill="none" stroke="#1E293B" strokeWidth="2">
              <circle cx="-6" cy="1" r="4.5" /><circle cx="8" cy="1" r="4.5" /><line x1="-1.5" y1="1" x2="3.5" y2="1" />
            </g>
            <path d="M-4 10 q5 3 9 0" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            {/* corpo levemente curvado */}
            <path d="M-18 20 Q2 14 20 24 L14 62 L-14 60 Z" fill="#A78BFA" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
            <rect x="-12" y="60" width="9" height="22" rx="3" fill="#475569" />
            <rect x="4" y="60" width="9" height="22" rx="3" fill="#475569" />
            {/* bengala */}
            <path d="M26 30 L30 84" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
            <path d="M26 30 q-7 0 -7 6" fill="none" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}
      </g>
    </svg>
  );
}
