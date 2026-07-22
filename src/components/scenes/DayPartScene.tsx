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

        {/* sol/lua — MANHÃ: sol NASCENDO, metade escondida no horizonte (inconfundível);
            TARDE: sol pequeno LÁ NO ALTO, a pino; NOITE: lua. (Auditoria: sol "igual"
            em posições parecidas não comunica — agora cada parte tem pista de ROTINA.) */}
        {night ? (
          <g className="sc-pulse">
            <circle cx="150" cy="46" r="18" fill="#FEF9C3" stroke="#FDE68A" strokeWidth="2" />
            <circle cx="144" cy="42" r="15" fill={s.a} />
          </g>
        ) : type === "manha" ? (
          <g>
            {/* sol gigante nascendo atrás do morro (o morro cobre a metade de baixo) */}
            <circle cx="52" cy="146" r="26" fill="#FDE047" stroke="#FBBF24" strokeWidth="3" />
            {Array.from({ length: 5 }).map((_, i) => {
              const a = Math.PI + (i + 0.5) * (Math.PI / 6);
              return <line key={i} x1={52 + Math.cos(a) * 32} y1={146 + Math.sin(a) * 32} x2={52 + Math.cos(a) * 44} y2={146 + Math.sin(a) * 44} stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />;
            })}
          </g>
        ) : (
          <g className="sc-float">
            <circle cx="100" cy="34" r="17" fill="#FDE047" stroke="#FBBF24" strokeWidth="2.5" />
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i * Math.PI) / 5;
              return <line key={i} x1={100 + Math.cos(a) * 21} y1={34 + Math.sin(a) * 21} x2={100 + Math.cos(a) * 28} y2={34 + Math.sin(a) * 28} stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />;
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

        {/* PISTAS DE ROTINA (a criança lê o dia pelo que se FAZ, não pela geometria) */}
        {type === "manha" && (
          <g>
            {/* galo cantando no telhado */}
            <g transform="translate(96 96)">
              <ellipse cx="0" cy="0" rx="9" ry="7" fill="#F97316" stroke="#1E293B" strokeWidth="2" />
              <circle cx="8" cy="-5" r="4.5" fill="#FDBA74" stroke="#1E293B" strokeWidth="1.8" />
              <path d="M6 -11 q2 -4 4 0 q2 -4 4 0" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
              <path d="M12 -4 l5 1 l-5 2 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
              <path d="M-8 -2 q-6 -2 -7 3 q5 3 8 0 Z" fill="#16A34A" stroke="#14532D" strokeWidth="1.5" />
            </g>
            <text x="122" y="82" fontSize="12" fill="#B45309" fontWeight="bold">♪</text>
            <text x="132" y="72" fontSize="9" fill="#B45309" fontWeight="bold">♪</text>
          </g>
        )}
        {type === "tarde" && (
          <g className="sc-sway">
            {/* bola no quintal: hora de brincar lá fora */}
            <circle cx="152" cy="172" r="12" fill="#EF4444" stroke="#1E293B" strokeWidth="2.5" />
            <path d="M140 172 q12 -8 24 0" fill="none" stroke="#FFFFFF" strokeWidth="3" />
          </g>
        )}
        {night && (
          <text x="140" y="100" fontSize="15" fill="#E0E7FF" fontWeight="bold" fontStyle="italic">z z Z</text>
        )}
      </g>
    </svg>
  );
}
