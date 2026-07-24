import React from "react";
import { getSceneSvg } from "./sceneAssets";

/**
 * DayPartScene ☀️🌙 — Cena Viva das partes do dia. O MESMO cenário (casa + morro) com
 * o céu mudando: manhã (sol nascendo, rosa) · tarde (sol a pino, azul) · noite (lua e
 * estrelas). A criança lê a passagem do tempo pela MESMA cena mudando — não emoji solto.
 */
export type DayPart = "manha" | "tarde" | "noite";

const SKY: Record<DayPart, { a: string; b: string; label: string }> = {
  manha: { a: "#FED7AA", b: "#FDBA74", label: "Manhã" },
  tarde: { a: "#7DD3FC", b: "#38BDF8", label: "Tarde" },
  noite: { a: "#1E3A8A", b: "#312E81", label: "Noite" },
};

export default function DayPartScene({ type, size = 220 }: { type: DayPart; size?: number }) {
  const s = SKY[type];
  const uid = React.useId();
  const night = type === "noite";
  const asset = getSceneSvg("daypart", type);
  if (asset) return <img src={asset} width={size} height={size} alt={s.label} style={{ maxWidth: "100%" }} />;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={s.label} style={{ maxWidth: "100%" }}>
      <defs>
        <linearGradient id={`sk${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={s.a} />
          <stop offset="1" stopColor={s.b} />
        </linearGradient>
        <clipPath id={`c${uid}`}><rect x="6" y="6" width="188" height="188" rx="22" /></clipPath>
      </defs>
      <g clipPath={`url(#c${uid})`}>
        <rect x="6" y="6" width="188" height="188" fill={`url(#sk${uid})`} />

        {/* estrelas só à noite */}
        {night &&
          [[30, 30], [60, 22], [150, 28], [170, 55], [110, 20], [45, 60]].map(([x, y], i) => (
            <text key={i} x={x} y={y} fontSize="11" fill="#FDE68A">✦</text>
          ))}

        {/* sol (manhã baixo/tarde alto) ou lua (noite) */}
        {night ? (
          <g className="sc-pulse">
            <circle cx="150" cy="46" r="18" fill="#FEF9C3" stroke="#FDE68A" strokeWidth="2" />
            <circle cx="144" cy="42" r="15" fill={s.a} />
          </g>
        ) : (
          <g className="sc-float">
            <circle cx={type === "manha" ? 150 : 100} cy={type === "manha" ? 92 : 40} r="20" fill="#FDE047" stroke="#FBBF24" strokeWidth="2.5" />
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i * Math.PI) / 5, cx = type === "manha" ? 150 : 100, cy = type === "manha" ? 92 : 40;
              return <line key={i} x1={cx + Math.cos(a) * 24} y1={cy + Math.sin(a) * 24} x2={cx + Math.cos(a) * 32} y2={cy + Math.sin(a) * 32} stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />;
            })}
          </g>
        )}

        {/* morro */}
        <path d="M6 150 Q100 120 194 150 L194 194 L6 194 Z" fill={night ? "#166534" : "#4ADE80"} />
        {/* casinha (a mesma sempre) */}
        <g transform="translate(78 108)">
          <rect x="0" y="20" width="44" height="34" fill={night ? "#78350F" : "#FCA5A5"} stroke="#1E293B" strokeWidth="2.5" />
          <path d="M-6 20 L22 -2 L50 20 Z" fill="#B91C1C" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="16" y="34" width="14" height="20" fill={night ? "#1E293B" : "#7C3AED"} stroke="#1E293B" strokeWidth="2" />
          {/* janela acesa à noite */}
          <rect x="5" y="26" width="9" height="9" fill={night ? "#FDE047" : "#DBEAFE"} stroke="#1E293B" strokeWidth="1.5" />
          <rect x="32" y="26" width="9" height="9" fill={night ? "#FDE047" : "#DBEAFE"} stroke="#1E293B" strokeWidth="1.5" />
        </g>
      </g>
    </svg>
  );
}
