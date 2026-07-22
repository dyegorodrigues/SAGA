import React from "react";
import { getSceneSvg } from "./sceneAssets";

/**
 * NestScene 🗺️ — Cena Viva de um LUGAR (motor `nest`/`zoom`, trilha Meu Lugar no Mundo).
 * Mostra UM lugar por vez, como uma cena inteira e clara (casa, rua, cidade, país,
 * mundo, espaço) — NÃO mais caixas concêntricas (que ficaram ilegíveis). O conceito
 * de encaixe ("cada lugar mora dentro de um maior") é ensinado pelo tutorial e pelas
 * opções. Cada lugar é substituível por arte externa: se existir
 * src/assets/scenes/nest-<kind>.svg, ele entra no lugar deste desenho-código.
 * Ver docs/brief-arte-svg.md (PARTE 7) e docs/mapa-de-cenas-svg.md.
 */

const SKY = "#BAE6FD", SKY2 = "#7DD3FC", GRASS = "#4ADE80", INK = "#1E293B";

function House({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
      <rect x="-22" y="-4" width="44" height="30" fill="#FCA5A5" stroke={INK} strokeWidth="2.5" />
      <path d="M-28 -4 L0 -26 L28 -4 Z" fill="#DC2626" stroke={INK} strokeWidth="2.5" />
      <rect x="-8" y="9" width="16" height="17" fill="#7C3AED" stroke={INK} strokeWidth="2" />
      <circle cx="4" cy="18" r="1.6" fill="#FDE047" />
      <rect x="-18" y="2" width="9" height="9" fill="#BAE6FD" stroke={INK} strokeWidth="2" />
      <rect x="9" y="2" width="9" height="9" fill="#BAE6FD" stroke={INK} strokeWidth="2" />
    </g>
  );
}

function PlaceCard({ kind }: { kind: string }) {
  switch (kind) {
    case "casa":
      return (
        <g>
          <circle cx="164" cy="40" r="16" fill="#FDE047" stroke="#FBBF24" strokeWidth="2.5" className="sc-pulse" />
          <rect x="6" y="132" width="188" height="62" fill={GRASS} />
          <path d="M92 194 L100 150 L108 194 Z" fill="#D9A066" opacity="0.7" />
          <House x={100} y={112} s={1.7} />
          <circle cx="40" cy="150" r="8" fill="#EF4444" /><rect x="38" y="150" width="4" height="16" fill="#16A34A" />
        </g>
      );
    case "rua":
      return (
        <g>
          <House x={54} y={72} s={0.9} />
          <House x={140} y={72} s={0.9} />
          {/* calçada */}
          <rect x="6" y="118" width="188" height="16" fill="#E5E7EB" />
          {/* asfalto */}
          <rect x="6" y="134" width="188" height="46" fill="#4B5563" />
          {/* calçada de baixo */}
          <rect x="6" y="180" width="188" height="14" fill="#E5E7EB" />
          {/* faixa amarela tracejada */}
          {[16, 56, 96, 136, 176].map((x) => <rect key={x} x={x} y="155" width="22" height="5" rx="2" fill="#FDE047" />)}
          {/* poste */}
          <rect x="172" y="96" width="4" height="24" fill={INK} /><circle cx="174" cy="94" r="6" fill="#FDE047" stroke={INK} strokeWidth="2" />
        </g>
      );
    case "cidade": {
      // prédios com GRADE de janelas (pra ter cara de prédio de verdade)
      const blds: [number, number, number, string][] = [
        [16, 92, 30, "#60A5FA"], [50, 58, 32, "#F472B6"], [86, 38, 34, "#34D399"],
        [124, 70, 30, "#FBBF24"], [158, 54, 30, "#A78BFA"],
      ];
      return (
        <g stroke={INK} strokeWidth="2.5">
          {blds.map(([x, y, w, c], i) => {
            const h = 180 - y;
            const rows = Math.max(1, Math.floor((h - 12) / 15));
            const wins = [];
            for (let r = 0; r < rows; r++)
              for (let col = 0; col < 2; col++)
                wins.push(<rect key={`${i}-${r}-${col}`} x={x + 6 + col * (w - 15)} y={y + 8 + r * 15} width={6} height={9} fill="#FEF9C3" stroke="none" />);
            return (
              <g key={i}>
                <rect x={x} y={y} width={w} height={h} fill={c} />
                {wins}
              </g>
            );
          })}
          {/* rua na frente com faixa */}
          <rect x="6" y="180" width="188" height="14" fill="#4B5563" stroke="none" />
          {[16, 60, 104, 148].map((x) => <rect key={x} x={x} y="185" width="18" height="4" fill="#FDE047" stroke="none" />)}
        </g>
      );
    }
    case "pais": // bandeira do Brasil
      return (
        <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
          <rect x="24" y="52" width="152" height="100" rx="6" fill="#16A34A" />
          <path d="M100 62 L162 102 L100 142 L38 102 Z" fill="#FACC15" stroke="#A16207" />
          <circle cx="100" cy="102" r="24" fill="#1D4ED8" stroke="#1E3A8A" />
          <path d="M78 98 q22 -8 44 3" fill="none" stroke="#FFFFFF" strokeWidth="3" />
        </g>
      );
    case "mundo": // globo
      return (
        <g>
          <circle cx="100" cy="100" r="64" fill="#38BDF8" stroke="#0C4A6E" strokeWidth="3" className="sc-pulse" />
          <g fill="#22C55E" stroke="#15803D" strokeWidth="2">
            <path d="M64 70 q26 6 14 28 q-24 4 -18 26 q-14 -16 -6 -32 q-6 -14 10 -22" />
            <path d="M118 66 q24 10 10 30 q-18 6 -6 22 q-20 -6 -16 -28 q0 -18 12 -24" />
          </g>
        </g>
      );
    case "espaco":
      return (
        <g>
          <rect x="6" y="6" width="188" height="188" fill="#1E293B" />
          <g fill="#FDE68A">
            {[[30, 40], [160, 34], [50, 150], [175, 120], [110, 30], [24, 100]].map(([x, y], i) => (
              <text key={i} x={x} y={y} fontSize="12">✦</text>
            ))}
          </g>
          <circle cx="105" cy="105" r="34" fill="#A855F7" stroke="#6B21A8" strokeWidth="3" />
          <ellipse cx="105" cy="105" rx="58" ry="16" fill="none" stroke="#FDE68A" strokeWidth="4" transform="rotate(-18 105 105)" />
          <circle cx="42" cy="52" r="12" fill="#38BDF8" stroke="#0C4A6E" strokeWidth="2" />
        </g>
      );
    default:
      return <text x="100" y="112" textAnchor="middle" fontSize="60">❓</text>;
  }
}

export default function NestScene({ kind, size = 220 }: { kind: string; size?: number }) {
  const uid = React.useId();
  const asset = getSceneSvg("nest", kind);
  if (asset) return <img src={asset} width={size} height={size} alt={kind} style={{ maxWidth: "100%" }} />;
  const darkSky = kind === "espaco";
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={kind} style={{ maxWidth: "100%" }}>
      <defs>
        <linearGradient id={`sk${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SKY} /><stop offset="1" stopColor={SKY2} />
        </linearGradient>
        <clipPath id={`c${uid}`}><rect x="6" y="6" width="188" height="188" rx="22" /></clipPath>
      </defs>
      <g clipPath={`url(#c${uid})`}>
        {!darkSky && <rect x="6" y="6" width="188" height="188" fill={`url(#sk${uid})`} />}
        <PlaceCard kind={kind} />
      </g>
    </svg>
  );
}
