import React from "react";

/**
 * DRAGÃO DE FOGO — mascote SVG oficial (motor vetorial no papel TEMPORÁRIO de
 * personagem principal enquanto os PNGs definitivos não chegam — quando os
 * arquivos `dragao-{estagio}-*.png` existirem em src/assets/mascotes/, o
 * MascotRenderer troca automaticamente para eles. Ver docs/plano-diretor-v2.md,
 * Partes A e C).
 *
 * ESCOLA SVG — AS 6 LIÇÕES (regra permanente de TODO desenho vetorial do projeto):
 * 1. Paleta fechada: declarar 6-8 cores nomeadas antes de desenhar e usar SOMENTE elas.
 * 2. Receita de construção: proporção chibi (cabeça ≈ corpo), olhos em posições
 *    simétricas fixas, traço uniforme (3px corpo / 2px detalhe) com
 *    strokeLinejoin/strokeLinecap "round", cantos sempre arredondados.
 * 3. Orçamento de formas: máximo 40 elementos por desenho. Passou = simplificar.
 * 4. Camadas declaradas, desenhadas nesta ordem: sombra → cauda → asas → corpo →
 *    barriga → pés/braços → cabeça → chifres/crista → rosto.
 * 5. Desenho aprovado vira referência de estilo dos próximos.
 * 6. NUNCA anatomia realista, sombreamento volumétrico ou cabelo detalhado em SVG —
 *    personagem realista pertence ao pipeline de imagem (PNG com transparência real).
 */

// 1ª lição: paleta fechada (7 cores)
const INK = "#1E293B";
const RED = "#EF4444";
const DRED = "#B91C1C";
const CREAM = "#FEF3C7";
const AMBER = "#FBBF24";
const ORANGE = "#F97316";
const WHITE = "#FFFFFF";

const thick = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round", strokeLinecap: "round" } as const;
const thin = { stroke: INK, strokeWidth: 2, strokeLinejoin: "round", strokeLinecap: "round" } as const;

/* Rosto fofo reutilizável: olhos grandes simétricos + narinas + sorriso + bochechas */
function Face({ cx, cy, s }: { cx: number; cy: number; s: number }) {
  const ex = 7 * s, er = 4.6 * s, pr = 2.2 * s;
  return (
    <g>
      <circle cx={cx - ex} cy={cy} r={er} fill={WHITE} stroke={INK} strokeWidth={2} />
      <circle cx={cx + ex} cy={cy} r={er} fill={WHITE} stroke={INK} strokeWidth={2} />
      <circle cx={cx - ex + 0.8 * s} cy={cy + 0.6 * s} r={pr} fill={INK} />
      <circle cx={cx + ex - 0.8 * s} cy={cy + 0.6 * s} r={pr} fill={INK} />
      <circle cx={cx - ex + 1.6 * s} cy={cy - 0.4 * s} r={0.9 * s} fill={WHITE} />
      <circle cx={cx + ex} cy={cy - 0.4 * s} r={0.9 * s} fill={WHITE} />
      <path
        d={`M ${cx - 2.2 * s} ${cy + 5.6 * s} q 0.7 -1.2 0 -2.2 M ${cx + 2.2 * s} ${cy + 5.6 * s} q -0.7 -1.2 0 -2.2`}
        fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round"
      />
      <path
        d={`M ${cx - 4.5 * s} ${cy + 7 * s} Q ${cx} ${cy + 11 * s} ${cx + 4.5 * s} ${cy + 7 * s}`}
        fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round"
      />
      <circle cx={cx - 9.5 * s} cy={cy + 4.5 * s} r={2.4 * s} fill={ORANGE} opacity={0.4} />
      <circle cx={cx + 9.5 * s} cy={cy + 4.5 * s} r={2.4 * s} fill={ORANGE} opacity={0.4} />
    </g>
  );
}

/* Chifre gordinho curvado (desenhado DEPOIS da cabeça, visível inteiro) */
function Horn({ x, y, dir, s }: { x: number; y: number; dir: 1 | -1; s: number }) {
  const d = `M ${x - 3.5 * s} ${y}
    C ${x - 3 * s} ${y - 5 * s} ${x + 1 * dir * s - 1 * s} ${y - 8 * s} ${x + 6 * dir * s} ${y - 11.5 * s}
    C ${x + 4.5 * dir * s} ${y - 5.5 * s} ${x + 3.5 * s} ${y - 2 * s} ${x + 3.5 * s} ${y + 1.5 * s} Z`;
  return <path d={d} fill={AMBER} {...thin} />;
}

/* Asa de morcego fofa: borda superior lisa até a ponta, membrana com 2 recortes */
function Wing({ shx, shy, dir, s }: { shx: number; shy: number; dir: 1 | -1; s: number }) {
  const tx = shx + 24 * dir * s, ty = shy - 16 * s;
  return (
    <g>
      <path
        d={`M ${shx} ${shy}
          Q ${shx + 8 * dir * s} ${shy - 14 * s} ${tx} ${ty}
          Q ${tx - 4 * dir * s} ${ty + 7 * s} ${shx + 15 * dir * s} ${shy - 5 * s}
          Q ${shx + 14 * dir * s} ${shy + 2 * s} ${shx + 7 * dir * s} ${shy + 2.5 * s}
          Q ${shx + 4 * dir * s} ${shy + 3 * s} ${shx} ${shy} Z`}
        fill={DRED} {...thick}
      />
      <path
        d={`M ${shx + 3 * dir * s} ${shy - 3 * s} Q ${shx + 12 * dir * s} ${shy - 9 * s} ${tx - 4 * dir * s} ${ty + 3 * s}`}
        fill="none" stroke={INK} strokeWidth={1.4} opacity={0.4}
      />
    </g>
  );
}

/* Pezinhos com dedinhos */
function Feet({ cy, spread, s }: { cy: number; spread: number; s: number }) {
  return (
    <g>
      <ellipse cx={50 - spread} cy={cy} rx={5.5 * s} ry={3.4 * s} fill={RED} {...thin} />
      <ellipse cx={50 + spread} cy={cy} rx={5.5 * s} ry={3.4 * s} fill={RED} {...thin} />
      <path
        d={`M ${50 - spread - 1.5} ${cy - 2 * s} v ${1.8 * s} M ${50 - spread + 1.5} ${cy - 2 * s} v ${1.8 * s}
            M ${50 + spread - 1.5} ${cy - 2 * s} v ${1.8 * s} M ${50 + spread + 1.5} ${cy - 2 * s} v ${1.8 * s}`}
        stroke={INK} strokeWidth={1.2} opacity={0.5} fill="none"
      />
    </g>
  );
}

/* Crista dorsal: uma única barbatana central arredondada */
function Crest({ cx, cy, s }: { cx: number; cy: number; s: number }) {
  const d = `M ${cx - 4 * s} ${cy + 1 * s} Q ${cx - 1 * s} ${cy - 7 * s} ${cx + 1.5 * s} ${cy - 8 * s}
    Q ${cx + 4.5 * s} ${cy - 5 * s} ${cx + 4 * s} ${cy + 1 * s} Z`;
  return <path d={d} fill={DRED} {...thin} />;
}

/* Cauda com chama na ponta (2 tons nos estágios avançados) */
function Tail({ big }: { big: boolean }) {
  return big ? (
    <g>
      <path d="M 64 78 Q 82 80 85 64" fill="none" stroke={RED} strokeWidth={7} strokeLinecap="round" />
      <path d="M 85 67 Q 78 56 85 45 Q 92 56 85 67 Z" fill={ORANGE} {...thin} />
      <path d="M 85 62 Q 82 56 85 51 Q 88 56 85 62 Z" fill={AMBER} />
    </g>
  ) : (
    <g>
      <path d="M 62 76 Q 78 78 80 66" fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" />
      <path d="M 80 68 Q 74 59 80 50 Q 86 59 80 68 Z" fill={ORANGE} {...thin} />
    </g>
  );
}

function EggStage() {
  return (
    <g>
      <ellipse cx={50} cy={86} rx={18} ry={4.5} fill="rgba(30,41,59,0.12)" />
      <path d="M 50 24 C 34 24 30 50 30 66 C 30 80 39 88 50 88 C 61 88 70 80 70 66 C 70 50 66 24 50 24 Z" fill={CREAM} {...thick} />
      <path d="M 50 24 Q 49 18 52 14 Q 55 19 53 24" fill={ORANGE} {...thin} />
      <circle cx={41} cy={48} r={3.6} fill={RED} />
      <circle cx={59} cy={60} r={4.4} fill={ORANGE} />
      <circle cx={52} cy={73} r={3} fill={AMBER} />
      <circle cx={41} cy={66} r={2.2} fill={ORANGE} />
      <circle cx={58} cy={42} r={2.4} fill={RED} opacity={0.75} />
      <path d="M 50 26 L 46 31 L 50 36 L 46 41" fill="none" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
    </g>
  );
}

function BabyStage() {
  return (
    <g>
      <ellipse cx={50} cy={87} rx={20} ry={4.5} fill="rgba(30,41,59,0.12)" />
      <path d="M 31 60 Q 21 64 16 56 Q 23 50 32 54 Z" fill={DRED} {...thin} />
      <path d="M 69 60 Q 79 64 84 56 Q 77 50 68 54 Z" fill={DRED} {...thin} />
      <circle cx={50} cy={50} r={20} fill={RED} {...thick} />
      <Horn x={40} y={33} dir={-1} s={0.8} />
      <Horn x={60} y={33} dir={1} s={0.8} />
      <path d="M 40 32 L 46 26 L 50 31 L 55 25 L 60 32 Q 55 36 50 36 Q 44 36 40 32 Z" fill={CREAM} {...thin} />
      <Face cx={50} cy={48} s={1} />
      <path d="M 33 72 L 39 66 L 45 72 L 50 66 L 55 72 L 61 66 L 67 72 C 67 83 60 88 50 88 C 40 88 33 83 33 72 Z" fill={CREAM} {...thick} />
      <circle cx={43} cy={78} r={2.2} fill={AMBER} />
      <circle cx={57} cy={80} r={2.6} fill={ORANGE} />
      <circle cx={50} cy={75} r={1.8} fill={RED} opacity={0.7} />
    </g>
  );
}

function YoungStage() {
  return (
    <g>
      <ellipse cx={50} cy={87} rx={21} ry={4.5} fill="rgba(30,41,59,0.12)" />
      <Tail big={false} />
      <Wing shx={38} shy={62} dir={-1} s={0.75} />
      <Wing shx={62} shy={62} dir={1} s={0.75} />
      <rect x={36} y={48} width={28} height={36} rx={13} fill={RED} {...thick} />
      <ellipse cx={50} cy={69} rx={9} ry={10.5} fill={CREAM} stroke={INK} strokeWidth={2} />
      <path d="M 44 64 H 56 M 43.5 70 H 56.5 M 45 76 H 55" fill="none" stroke={INK} strokeWidth={1.3} opacity={0.3} />
      <Feet cy={84.5} spread={9} s={0.9} />
      <circle cx={50} cy={36} r={17} fill={RED} {...thick} />
      <Crest cx={50} cy={21} s={0.9} />
      <Horn x={41} y={24} dir={-1} s={0.9} />
      <Horn x={59} y={24} dir={1} s={0.9} />
      <Face cx={50} cy={34} s={1} />
    </g>
  );
}

function WarriorStage() {
  return (
    <g>
      <ellipse cx={50} cy={88} rx={23} ry={4.5} fill="rgba(30,41,59,0.12)" />
      <Tail big />
      <Wing shx={35} shy={60} dir={-1} s={1.05} />
      <Wing shx={65} shy={60} dir={1} s={1.05} />
      <rect x={32} y={44} width={36} height={42} rx={16} fill={RED} {...thick} />
      <ellipse cx={50} cy={67} rx={11} ry={12.5} fill={CREAM} stroke={INK} strokeWidth={2} />
      <path d="M 42 61 H 58 M 41 67.5 H 59 M 43 74 H 57" fill="none" stroke={INK} strokeWidth={1.5} opacity={0.3} />
      <path d="M 33 60 Q 27 64 28 70 Q 33 68 35 64" fill={RED} {...thin} />
      <path d="M 67 60 Q 73 64 72 70 Q 67 68 65 64" fill={RED} {...thin} />
      <Feet cy={86.5} spread={10.5} s={1} />
      <circle cx={50} cy={30} r={18} fill={RED} {...thick} />
      <Crest cx={50} cy={14} s={1} />
      <Horn x={40} y={17} dir={-1} s={1.1} />
      <Horn x={60} y={17} dir={1} s={1.1} />
      <Face cx={50} cy={28} s={1.05} />
    </g>
  );
}

function SupremeStage() {
  return (
    <g>
      <ellipse cx={50} cy={90} rx={25} ry={4.5} fill="rgba(30,41,59,0.12)" />
      <g>
        <path d="M 66 80 Q 86 82 89 64" fill="none" stroke={RED} strokeWidth={7} strokeLinecap="round" />
        <path d="M 89 68 Q 80 55 89 42 Q 98 55 89 68 Z" fill={ORANGE} {...thin} />
        <path d="M 89 62 Q 85 55 89 48 Q 93 55 89 62 Z" fill={AMBER} />
      </g>
      <Wing shx={33} shy={58} dir={-1} s={1.35} />
      <Wing shx={67} shy={58} dir={1} s={1.35} />
      <rect x={30} y={42} width={40} height={46} rx={18} fill={RED} {...thick} />
      <ellipse cx={50} cy={67} rx={12.5} ry={14} fill={CREAM} stroke={INK} strokeWidth={2} />
      <path d="M 40 59.5 H 60 M 39 67 H 61 M 41 74.5 H 59" fill="none" stroke={INK} strokeWidth={1.5} opacity={0.3} />
      <path
        d="M 50 60 L 52.2 64.2 L 56.9 64.7 L 53.5 67.8 L 54.6 72.3 L 50 69.9 L 45.4 72.3 L 46.5 67.8 L 43.1 64.7 L 47.8 64.2 Z"
        fill={AMBER} stroke={INK} strokeWidth={1.6} strokeLinejoin="round"
      />
      <path d="M 31 58 Q 24 62 25 69 Q 31 67 33 62" fill={RED} {...thin} />
      <path d="M 69 58 Q 76 62 75 69 Q 69 67 67 62" fill={RED} {...thin} />
      <Feet cy={88.5} spread={11.5} s={1.05} />
      <circle cx={50} cy={27} r={19} fill={RED} {...thick} />
      <Crest cx={50} cy={10} s={1.15} />
      <Horn x={39} y={14} dir={-1} s={1.25} />
      <Horn x={61} y={14} dir={1} s={1.25} />
      <path d="M 50 9 Q 48.5 4.5 50 1 Q 51.5 4.5 50 9 Z" fill={AMBER} {...thin} />
      <Face cx={50} cy={25} s={1.1} />
    </g>
  );
}

/** Renderiza o estágio pedido (1-5) num viewBox 0 0 100 100. */
export function DragonStage({ stage }: { stage: number }) {
  if (stage <= 1) return <EggStage />;
  if (stage === 2) return <BabyStage />;
  if (stage === 3) return <YoungStage />;
  if (stage === 4) return <WarriorStage />;
  return <SupremeStage />;
}

export default DragonStage;
