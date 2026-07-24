import React from "react";
import { getSceneSvg } from "./sceneAssets";

/**
 * PlaceScene 🌎 — a CENA de um lugar, desenhada pra criança RECONHECER na hora
 * (casa, bairro, cidade, estado, Brasil, América do Sul, mundo, Terra). É a arte da
 * trilha "Meu Lugar no Mundo", tocada em sequência pela JourneyScene (viagem narrada
 * casa→…→Terra). Nada de caixa abstrata: cada lugar é uma cena inteira e clara.
 *
 * Arte plugável: se existir src/assets/scenes/place-<slot>.svg, ele entra no lugar do
 * desenho-código (sem tocar em código). Ver docs/mapa-de-cenas-svg.md e brief-arte-svg.md.
 *
 * viewBox 0 0 200 200, fundo próprio (a cena preenche). Todos ≤15KB, SSR-safe.
 */

export type Place =
  | "casa" | "bairro" | "cidade" | "estado"
  | "brasil" | "americasul" | "mundo" | "terra";

const SKY1 = "#BAE6FD", SKY2 = "#E0F2FE", GRASS = "#86EFAC", GRASS2 = "#4ADE80";
const INK = "#1E293B", ROOF = "#DC2626", WALL = "#FCA5A5", LAND = "#34D399", LANDLINE = "#15803D";

/* --- uma casinha reutilizável (o tijolo de casa/bairro) --- */
function Casinha({ x, y, s = 1, wall = WALL, roof = ROOF }: { x: number; y: number; s?: number; wall?: string; roof?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round" stroke={INK} strokeWidth={2.4 / s}>
      <rect x="-20" y="-2" width="40" height="26" fill={wall} />
      <path d="M-26 -2 L0 -22 L26 -2 Z" fill={roof} />
      <rect x="-7" y="8" width="14" height="16" fill="#7C3AED" strokeWidth={1.6 / s} />
      <rect x="-16" y="2" width="9" height="9" fill="#BAE6FD" strokeWidth={1.4 / s} />
      <rect x="7" y="2" width="9" height="9" fill="#BAE6FD" strokeWidth={1.4 / s} />
    </g>
  );
}

function Arvore({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-3" y="4" width="6" height="14" rx="2" fill="#92400E" />
      <circle cx="0" cy="-2" r="12" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
    </g>
  );
}

/* --- desenho de cada lugar --- */
function Art({ slot, uid }: { slot: Place; uid: string }) {
  const sky = `url(#psSky${uid})`, city = `url(#psCity${uid})`;
  switch (slot) {
    case "casa":
      return (
        <g>
          <rect x="4" y="4" width="192" height="192" rx="20" fill={sky} />
          <rect x="4" y="132" width="192" height="64" rx="0" fill={GRASS} />
          <rect x="4" y="132" width="192" height="10" fill={GRASS2} />
          <circle cx="164" cy="40" r="17" fill="#FDE047" stroke="#FBBF24" strokeWidth="3" className="sc-pulse" />
          <path d="M40 150 Q100 138 160 150" fill="none" stroke="#D9A066" strokeWidth="10" strokeLinecap="round" />
          <Arvore x={44} y={128} s={1.15} />
          <Casinha x={112} y={104} s={1.85} />
          {/* fumacinha */}
          <g fill="#E2E8F0" opacity="0.9">
            <circle cx="132" cy="66" r="4" /><circle cx="137" cy="58" r="5" /><circle cx="144" cy="52" r="6" />
          </g>
        </g>
      );
    case "bairro":
      return (
        <g>
          <rect x="4" y="4" width="192" height="192" rx="20" fill={sky} />
          <rect x="4" y="120" width="192" height="76" fill={GRASS} />
          {/* rua que atravessa */}
          <path d="M4 168 Q100 150 196 172" fill="none" stroke="#64748B" strokeWidth="16" />
          <path d="M4 168 Q100 150 196 172" fill="none" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="8 8" />
          {/* muitas casinhas */}
          <Casinha x={38} y={112} s={0.9} wall="#FCA5A5" roof="#DC2626" />
          <Casinha x={92} y={104} s={0.95} wall="#FDBA74" roof="#EA580C" />
          <Casinha x={150} y={112} s={0.9} wall="#A5B4FC" roof="#4F46E5" />
          <Casinha x={64} y={150} s={0.82} wall="#6EE7B7" roof="#059669" />
          <Casinha x={128} y={152} s={0.82} wall="#F9A8D4" roof="#DB2777" />
          <Arvore x={18} y={140} s={0.9} /><Arvore x={182} y={140} s={0.9} />
        </g>
      );
    case "cidade":
      return (
        <g>
          <rect x="4" y="4" width="192" height="192" rx="20" fill={city} />
          {/* prédios com grade de janelas */}
          {([
            [18, 96, 30, "#60A5FA"], [50, 60, 30, "#F472B6"], [84, 40, 32, "#34D399"],
            [122, 72, 28, "#FBBF24"], [154, 54, 30, "#A78BFA"],
          ] as [number, number, number, string][]).map(([x, y, w, c], i) => {
            const h = 176 - y;
            const rows = Math.max(1, Math.floor((h - 14) / 15));
            const wins: React.ReactNode[] = [];
            for (let r = 0; r < rows; r++)
              for (let col = 0; col < 2; col++)
                wins.push(<rect key={`${i}-${r}-${col}`} x={x + 6 + col * (w - 15)} y={y + 9 + r * 15} width={6} height={9} fill="#FEF9C3" />);
            return (
              <g key={i} stroke={INK} strokeWidth="2.4" strokeLinejoin="round">
                <rect x={x} y={y} width={w} height={h} fill={c} />
                <g stroke="none">{wins}</g>
              </g>
            );
          })}
          {/* rua na frente */}
          <rect x="4" y="176" width="192" height="20" fill="#4B5563" />
          {[14, 58, 102, 146].map((x) => <rect key={x} x={x} y="184" width="20" height="4" rx="2" fill="#FDE047" />)}
        </g>
      );
    case "estado":
      return (
        <g>
          <rect x="4" y="4" width="192" height="192" rx="20" fill="#EAF2FB" />
          {/* uma REGIÃO (mapa) com muitas cidades dentro */}
          <path
            d="M46 60 Q64 40 96 46 Q132 40 150 66 Q168 86 156 118 Q160 146 128 156 Q96 168 68 152 Q40 142 40 112 Q34 82 46 60 Z"
            fill={LAND} stroke={LANDLINE} strokeWidth="3" strokeLinejoin="round"
          />
          {/* cidadezinhas (pontos claros que aparecem no verde) */}
          {([[74, 96], [112, 86], [130, 112], [88, 126], [108, 142]] as [number, number][]).map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="7" fill="#FFFFFF" stroke="#334155" strokeWidth="2" />
              <circle cx={cx} cy={cy} r="2.5" fill="#EF4444" />
            </g>
          ))}
          {/* estrela = a capital */}
          <g transform="translate(100 70)">
            <circle r="11" fill="#FEF3C7" stroke="#334155" strokeWidth="2" />
            <text x="0" y="5" fontSize="14" textAnchor="middle">⭐</text>
          </g>
        </g>
      );
    case "brasil":
      return (
        <g>
          <rect x="4" y="4" width="192" height="192" rx="20" fill="#DCEAFB" />
          {/* silhueta do Brasil — cotovelo do NORDESTE (leste) + ponta SUL (reconhecível) */}
          <path
            d="M66 54 Q64 44 78 42 L100 40 Q118 40 122 50 Q150 60 156 84
               Q152 104 140 122 Q132 138 122 146 Q112 160 102 166
               Q96 158 92 144 Q84 132 74 124 Q60 114 54 102
               Q44 98 48 88 Q54 74 60 66 Q60 58 66 54 Z"
            fill="#22C55E" stroke="#15803D" strokeWidth="3.5" strokeLinejoin="round"
          />
          {/* riscos de estados (bem leves) */}
          <g stroke="#15803D" strokeWidth="1.6" opacity="0.5" fill="none">
            <path d="M70 72 Q104 80 138 78" /><path d="M58 100 Q100 108 146 100" /><path d="M92 130 Q110 118 126 132" />
          </g>
          {/* emblema pequeno (bandeira como PINO no mapa, não como o país) */}
          <g transform="translate(102 98)">
            <path d="M0 -12 L14 0 L0 12 L-14 0 Z" fill="#FACC15" stroke="#A16207" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="5.5" fill="#1D4ED8" />
          </g>
        </g>
      );
    case "americasul":
      return (
        <g>
          <rect x="4" y="4" width="192" height="192" rx="20" fill="#BAE6FD" />
          {/* silhueta da América do Sul — larga no NORTE, BICO no sul */}
          <path
            d="M66 48 Q66 40 80 42 L120 44 Q136 46 142 62 Q158 80 156 96
               Q148 122 134 138 Q124 152 112 164 Q104 178 98 184
               Q94 168 92 150 Q86 124 82 104 Q76 82 72 66 Q68 56 66 48 Z"
            fill="#6EE7B7" stroke="#047857" strokeWidth="3" strokeLinejoin="round"
          />
          {/* Brasil DESTACADO dentro (leste-central) */}
          <path
            d="M112 60 Q134 64 142 84 Q146 104 134 122 Q122 134 110 128
               Q102 112 104 96 Q106 76 112 60 Z"
            fill="#FBBF24" stroke="#B45309" strokeWidth="2.4" strokeLinejoin="round"
          />
          <g transform="translate(124 96)">
            <circle r="9" fill="#FFFFFF" stroke="#B45309" strokeWidth="2" />
            <text x="0" y="4" fontSize="11" textAnchor="middle">📍</text>
          </g>
        </g>
      );
    case "mundo":
      return (
        <g>
          <rect x="4" y="4" width="192" height="192" rx="20" fill="#38BDF8" />
          {/* oceano com continentes-blocos amigáveis, posições de mapa-múndi */}
          <g fill="#4ADE80" stroke="#15803D" strokeWidth="2.5" strokeLinejoin="round">
            {/* América do Norte */}
            <path d="M28 44 Q52 36 64 52 Q70 66 56 76 Q40 82 32 70 Q24 58 28 44 Z" />
            {/* América do Sul */}
            <path d="M56 100 Q74 96 78 114 Q80 134 66 148 Q54 138 52 120 Q50 108 56 100 Z" />
            {/* África */}
            <path d="M104 74 Q124 70 128 90 Q130 112 116 128 Q102 118 100 100 Q98 84 104 74 Z" />
            {/* Europa */}
            <path d="M104 52 Q118 48 122 60 Q118 70 106 68 Q98 62 104 52 Z" />
            {/* Ásia */}
            <path d="M130 46 Q160 40 174 58 Q180 74 164 84 Q142 88 132 72 Q126 58 130 46 Z" />
            {/* Oceania */}
            <path d="M158 120 Q176 116 180 130 Q176 142 162 140 Q152 132 158 120 Z" />
          </g>
          {/* linhas do globo (bem leves) */}
          <g stroke="#0369A1" strokeWidth="1.4" opacity="0.35" fill="none">
            <path d="M4 100 H196" /><path d="M100 4 V196" />
          </g>
        </g>
      );
    case "terra":
      return (
        <g>
          <rect x="4" y="4" width="192" height="192" rx="20" fill="#0B1026" />
          {/* estrelinhas */}
          <g fill="#FDE68A">
            {([[26, 34], [168, 30], [40, 158], [176, 132], [150, 168], [22, 96]] as [number, number][]).map(([x, y], i) => (
              <text key={i} x={x} y={y} fontSize="11">✦</text>
            ))}
          </g>
          {/* halo */}
          <circle cx="100" cy="102" r="66" fill="#1D4ED8" opacity="0.35" />
          {/* o planeta */}
          <circle cx="100" cy="102" r="56" fill="#2563EB" stroke="#93C5FD" strokeWidth="2.5" className="sc-pulse" />
          <g fill="#34D399" stroke="#15803D" strokeWidth="1.5">
            <path d="M74 74 Q94 78 88 98 Q70 104 66 88 Q64 78 74 74 Z" />
            <path d="M108 82 Q128 80 130 100 Q124 120 108 122 Q98 108 100 94 Q102 84 108 82 Z" />
            <path d="M84 118 Q100 116 102 130 Q94 142 82 138 Q76 128 84 118 Z" />
          </g>
          {/* nuvenzinhas */}
          <g fill="#FFFFFF" opacity="0.55">
            <path d="M60 96 q10 -5 20 0 q-4 6 -14 5 q-8 0 -6 -5 Z" />
            <path d="M116 116 q10 -5 20 0 q-5 6 -15 5 q-7 0 -5 -5 Z" />
          </g>
          {/* luazinha */}
          <circle cx="166" cy="58" r="10" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="163" cy="55" r="2" fill="#CBD5E1" /><circle cx="169" cy="61" r="1.6" fill="#CBD5E1" />
        </g>
      );
    default:
      return <text x="100" y="112" textAnchor="middle" fontSize="60">❓</text>;
  }
}

export default function PlaceScene({ slot, size = 220 }: { slot: Place; size?: number }) {
  const uid = React.useId();
  const asset = getSceneSvg("place", slot);
  if (asset) return <img src={asset} width={size} height={size} alt={slot} style={{ maxWidth: "100%" }} />;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={slot} style={{ maxWidth: "100%", display: "block" }}>
      <defs>
        <linearGradient id={`psSky${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SKY1} /><stop offset="1" stopColor={SKY2} />
        </linearGradient>
        <linearGradient id={`psCity${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C7D2FE" /><stop offset="1" stopColor="#E0E7FF" />
        </linearGradient>
        <clipPath id={`pc${uid}`}><rect x="4" y="4" width="192" height="192" rx="20" /></clipPath>
      </defs>
      <g clipPath={`url(#pc${uid})`}>
        <Art slot={slot} uid={uid} />
      </g>
    </svg>
  );
}
