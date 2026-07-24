import React from "react";
import { getSceneSvg } from "./sceneAssets";

/**
 * GrowthScene 🌱 — Cena Viva do ciclo de vida da planta (a "sementinha" que o Zeus pediu:
 * não emoji, uma cena que CRESCE). 4 estágios: semente enterrada → broto com raiz →
 * arvorezinha → árvore com frutos. A raiz aparece embaixo da terra (enraizando).
 * Stateless (SSR-friendly); serve para o kind `order` (ordenar as fases) e para ensino.
 */
export default function GrowthScene({ stage, size = 220 }: { stage: 1 | 2 | 3 | 4; size?: number }) {
  const uid = React.useId();
  const groundY = 132;
  const asset = getSceneSvg("grow", stage);
  if (asset) return <img src={asset} width={size} height={size} alt={`Estágio ${stage}`} style={{ maxWidth: "100%" }} />;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={`Estágio ${stage}`} style={{ maxWidth: "100%" }}>
      <defs>
        <linearGradient id={`sky${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E0F2FE" />
          <stop offset="1" stopColor="#BAE6FD" />
        </linearGradient>
        <clipPath id={`card${uid}`}><rect x="6" y="6" width="188" height="188" rx="22" /></clipPath>
      </defs>
      <g clipPath={`url(#card${uid})`}>
        <rect x="6" y="6" width="188" height="188" fill={`url(#sky${uid})`} />
        {/* sol */}
        <circle className="sc-pulse" cx="160" cy="42" r="16" fill="#FDE047" stroke="#FBBF24" strokeWidth="2.5" />
        {/* terra (com corte pra ver a raiz) */}
        <rect x="6" y={groundY} width="188" height={194 - groundY} fill="#A16207" />
        <rect x="6" y={groundY} width="188" height="8" fill="#65A30D" />

        {/* ------- estágio 1: semente enterrada + gota d'água ------- */}
        {stage === 1 && (
          <g className="sc-rise">
            <ellipse cx="100" cy={groundY + 20} rx="9" ry="12" fill="#78350F" stroke="#451A03" strokeWidth="2" transform="rotate(15 100 152)" />
            <path d="M100 96 q5 8 0 13 q-5 -5 0 -13" fill="#38BDF8" stroke="#0EA5E9" strokeWidth="1.5" />
          </g>
        )}

        {/* ------- estágio 2: broto com raiz ------- */}
        {stage === 2 && (
          <g className="sc-rise">
            {/* raiz */}
            <path d={`M100 ${groundY} q-3 14 -10 22 M100 ${groundY} q3 16 9 24 M100 ${groundY} q0 12 0 26`} fill="none" stroke="#F5F5DC" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
            {/* caule */}
            <path d={`M100 ${groundY} L100 108`} stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />
            {/* 2 folhas */}
            <path d="M100 116 q-16 -6 -22 6 q16 6 22 -6" fill="#4ADE80" stroke="#16A34A" strokeWidth="2" />
            <path d="M100 110 q16 -6 22 6 q-16 6 -22 -6" fill="#4ADE80" stroke="#16A34A" strokeWidth="2" />
          </g>
        )}

        {/* ------- estágio 3: arvorezinha ------- */}
        {stage === 3 && (
          <g className="sc-rise">
            <path d={`M100 ${groundY} q-5 16 -12 24 M100 ${groundY} q6 18 12 26`} fill="none" stroke="#F5F5DC" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
            <rect x="95" y="86" width="10" height={groundY - 86} rx="3" fill="#92400E" stroke="#78350F" strokeWidth="2" />
            <circle cx="100" cy="78" r="30" fill="#4ADE80" stroke="#16A34A" strokeWidth="2.5" />
            <circle cx="82" cy="88" r="18" fill="#4ADE80" stroke="#16A34A" strokeWidth="2.5" />
            <circle cx="118" cy="88" r="18" fill="#4ADE80" stroke="#16A34A" strokeWidth="2.5" />
          </g>
        )}

        {/* ------- estágio 4: árvore com frutos ------- */}
        {stage === 4 && (
          <g className="sc-rise">
            <path d={`M100 ${groundY} q-7 18 -16 26 M100 ${groundY} q8 20 16 28 M100 ${groundY} q0 16 0 30`} fill="none" stroke="#F5F5DC" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
            <rect x="93" y="72" width="14" height={groundY - 72} rx="4" fill="#92400E" stroke="#78350F" strokeWidth="2.5" />
            <circle cx="100" cy="60" r="36" fill="#22C55E" stroke="#15803D" strokeWidth="2.5" />
            <circle cx="76" cy="74" r="22" fill="#22C55E" stroke="#15803D" strokeWidth="2.5" />
            <circle cx="124" cy="74" r="22" fill="#22C55E" stroke="#15803D" strokeWidth="2.5" />
            {/* frutos */}
            {[[86, 56], [112, 52], [100, 78], [74, 82], [126, 84], [104, 40]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="5.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
