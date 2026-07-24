import React from "react";
import { getSceneSvg } from "./sceneAssets";

/**
 * WeatherScene 🌦️ — Biblioteca de Cenas Vivas (o "teste do floquinho": conceito não é
 * emoji, é CENA que a criança LÊ de olho). Um personagem reage ao clima num cenário
 * completo — frio (treme, casaco, neve) × calor (sua, sol forte) × chuva × sol.
 * SVG por código, stateless (renderiza no servidor p/ screenshot), animável por cima.
 */
export type Weather = "frio" | "calor" | "chuva" | "sol";

const PALETTE: Record<Weather, { sky1: string; sky2: string; ground: string; label: string }> = {
  frio: { sky1: "#DBEAFE", sky2: "#93C5FD", ground: "#EFF6FF", label: "Frio" },
  calor: { sky1: "#FEF3C7", sky2: "#FDBA74", ground: "#FEF9C3", label: "Calor" },
  chuva: { sky1: "#E2E8F0", sky2: "#94A3B8", ground: "#DCFCE7", label: "Chuva" },
  sol: { sky1: "#BAE6FD", sky2: "#7DD3FC", ground: "#BBF7D0", label: "Sol" },
};

export default function WeatherScene({ type, size = 220 }: { type: Weather; size?: number }) {
  const p = PALETTE[type];
  const uid = React.useId();
  // arte plugável: se houver src/assets/scenes/weather-<type>.svg, usa o SEU
  const asset = getSceneSvg("weather", type);
  if (asset) return <img src={asset} width={size} height={size} alt={p.label} style={{ maxWidth: "100%" }} />;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={p.label} style={{ maxWidth: "100%" }}>
      <defs>
        <linearGradient id={`sky${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky1} />
          <stop offset="1" stopColor={p.sky2} />
        </linearGradient>
        <clipPath id={`card${uid}`}><rect x="6" y="6" width="188" height="188" rx="22" /></clipPath>
      </defs>

      <g clipPath={`url(#card${uid})`}>
        <rect x="6" y="6" width="188" height="188" fill={`url(#sky${uid})`} />
        {/* chão */}
        <path d="M6 150 Q100 132 194 150 L194 194 L6 194 Z" fill={p.ground} />

        {/* ---------- elementos do céu por clima ---------- */}
        {(type === "sol" || type === "calor") && (
          <g className="sc-pulse">
            <circle cx={type === "calor" ? 150 : 152} cy={type === "calor" ? 46 : 44} r={type === "calor" ? 30 : 22} fill="#FDE047" stroke="#FBBF24" strokeWidth="3" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * Math.PI) / 6, cx = type === "calor" ? 150 : 152, cy = type === "calor" ? 46 : 44;
              const r0 = type === "calor" ? 34 : 26, r1 = type === "calor" ? 46 : 36;
              return <line key={i} x1={cx + Math.cos(a) * r0} y1={cy + Math.sin(a) * r0} x2={cx + Math.cos(a) * r1} y2={cy + Math.sin(a) * r1} stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />;
            })}
          </g>
        )}
        {(type === "chuva" || type === "frio") && (
          <g>
            <g className="sc-float" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2">
              <ellipse cx="70" cy="46" rx="26" ry="16" />
              <ellipse cx="92" cy="40" rx="20" ry="15" />
              <ellipse cx="112" cy="48" rx="22" ry="15" />
            </g>
            {type === "chuva" &&
              [58, 78, 98, 118].map((x, i) => (
                <line key={i} x1={x} y1={64} x2={x - 5} y2={82} stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
              ))}
          </g>
        )}
        {type === "frio" &&
          [ [40, 70], [70, 100], [120, 80], [150, 110], [95, 130], [165, 60] ].map(([x, y], i) => (
            <text key={i} x={x} y={y} fontSize="14" fill="#FFFFFF" stroke="#BFDBFE" strokeWidth="0.5">❄</text>
          ))}

        {/* ---------- o personagem (bean fofo) reagindo ---------- */}
        <g transform="translate(100 128)">
          {/* corpo */}
          <ellipse cx="0" cy="18" rx="26" ry="20" fill={type === "frio" ? "#BFDBFE" : "#FCA5A5"} stroke="#1E293B" strokeWidth="2.5" />
          {/* cabeça */}
          <circle cx="0" cy="-8" r="22" fill={type === "frio" ? "#DBEAFE" : "#FECACA"} stroke="#1E293B" strokeWidth="2.5" />
          {/* bochechas */}
          <circle cx="-11" cy="-4" r="4.5" fill={type === "frio" ? "#93C5FD" : "#F87171"} opacity="0.8" />
          <circle cx="11" cy="-4" r="4.5" fill={type === "frio" ? "#93C5FD" : "#F87171"} opacity="0.8" />
          {/* olhos */}
          <circle cx="-8" cy="-11" r="2.6" fill="#1E293B" />
          <circle cx="8" cy="-11" r="2.6" fill="#1E293B" />
          {/* boca por humor */}
          {type === "frio" ? (
            <path d="M-7 -2 q7 5 14 0" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          ) : type === "calor" ? (
            <ellipse cx="0" cy="0" rx="5" ry="3.5" fill="#7F1D1D" />
          ) : (
            <path d="M-6 -1 q6 4 12 0" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          )}

          {type === "frio" && (
            <g>
              {/* cachecol */}
              <path d="M-20 8 q20 10 40 0 l0 7 q-20 9 -40 0 Z" fill="#EF4444" stroke="#1E293B" strokeWidth="2" />
              <rect x="14" y="12" width="7" height="16" rx="3" fill="#EF4444" stroke="#1E293B" strokeWidth="2" />
              {/* tremor */}
              <text x="-40" y="-8" fontSize="12" fill="#3B82F6" fontWeight="bold">~</text>
              <text x="30" y="-8" fontSize="12" fill="#3B82F6" fontWeight="bold">~</text>
            </g>
          )}
          {type === "calor" && (
            <g>
              {/* gotas de suor */}
              <path d="M20 -18 q4 6 0 9 q-4 -3 0 -9" fill="#38BDF8" stroke="#0EA5E9" strokeWidth="1" />
              <path d="M-22 -10 q3 5 0 8 q-3 -3 0 -8" fill="#38BDF8" stroke="#0EA5E9" strokeWidth="1" />
            </g>
          )}
          {type === "chuva" && (
            /* guarda-chuva */
            <g transform="translate(0 -34)">
              <path d="M-26 4 A26 26 0 0 1 26 4 Z" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.5" />
              <line x1="0" y1="4" x2="0" y2="30" stroke="#1E293B" strokeWidth="2.5" />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
}
