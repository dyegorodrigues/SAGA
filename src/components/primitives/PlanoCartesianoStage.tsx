import React, { useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { AnswerMeta } from "../../types";
import type { PlanoCartesianoF80Spec, PontoCartesianoF80 } from "../../curriculum/procedimentos/planoCartesianoContract";
import { tokens } from "../../styles/tokens";
import { ShapeCanvas } from "./ShapeCanvas";

interface Props {
  spec: PlanoCartesianoF80Spec;
  disabled?: boolean;
  onAnswer: (answer: string, meta?: AnswerMeta) => void;
}

const BOARD = 304;
const MARGIN = 42;
const SPAN = BOARD - MARGIN * 2;
const encode = (p: PontoCartesianoF80) => `${p.x},${p.y}`;

function pointPx(point: PontoCartesianoF80, maxCoord: number) {
  const step = SPAN / maxCoord;
  return { left: MARGIN + point.x * step, top: BOARD - MARGIN - point.y * step };
}

function PlanoSvg({ spec, selected }: { spec: PlanoCartesianoF80Spec; selected?: PontoCartesianoF80 }) {
  const ticks = Array.from({ length: spec.maxCoord + 1 }, (_, value) => value);
  const pathPoints = spec.vertices ?? spec.pontosPadrao ?? [];
  const visibleTarget = spec.modo !== "colocar-ponto" && spec.modo !== "figura-coordenadas";
  const path = pathPoints.length > 1
    ? pathPoints.map((point, index) => `${index ? "L" : "M"} ${pointPx(point, spec.maxCoord).left} ${pointPx(point, spec.maxCoord).top}`).join(" ")
    : undefined;
  const start = spec.inicio ? pointPx(spec.inicio, spec.maxCoord) : undefined;
  const target = pointPx(spec.alvo, spec.maxCoord);
  const chosen = selected ? pointPx(selected, spec.maxCoord) : undefined;

  return (
    <svg width={BOARD} height={BOARD} viewBox={`0 0 ${BOARD} ${BOARD}`} aria-label="Plano cartesiano no primeiro quadrante">
      {ticks.map(value => {
        const x = pointPx({ x: value, y: 0 }, spec.maxCoord).left;
        const y = pointPx({ x: 0, y: value }, spec.maxCoord).top;
        return (
          <React.Fragment key={value}>
            <line x1={x} y1={MARGIN} x2={x} y2={BOARD - MARGIN} stroke={tokens.cor.elementos.borda} strokeWidth="1" />
            <line x1={MARGIN} y1={y} x2={BOARD - MARGIN} y2={y} stroke={tokens.cor.elementos.borda} strokeWidth="1" />
            <text x={x} y={BOARD - 14} textAnchor="middle" fontSize="13" fontWeight="700" fill={tokens.cor.texto.secundario}>{value}</text>
            <text x="18" y={y + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill={tokens.cor.texto.secundario}>{value}</text>
          </React.Fragment>
        );
      })}
      <line x1={MARGIN} y1={BOARD - MARGIN} x2={BOARD - 22} y2={BOARD - MARGIN} stroke={tokens.cor.texto.principal} strokeWidth="3" />
      <line x1={MARGIN} y1={BOARD - MARGIN} x2={MARGIN} y2="22" stroke={tokens.cor.texto.principal} strokeWidth="3" />
      <text x={BOARD - 18} y={BOARD - MARGIN + 5} fontSize="14" fontWeight="800" fill={tokens.cor.texto.principal}>x</text>
      <text x={MARGIN - 4} y="18" fontSize="14" fontWeight="800" fill={tokens.cor.texto.principal}>y</text>

      {path && <path d={path} fill="none" stroke={tokens.cor.acao.secundaria} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />}
      {spec.pontosPadrao?.map(point => {
        const px = pointPx(point, spec.maxCoord);
        return <circle key={`padrao-${encode(point)}`} cx={px.left} cy={px.top} r="7" fill={tokens.cor.acao.secundaria} />;
      })}
      {start && <circle cx={start.left} cy={start.top} r="8" fill={tokens.cor.elementos.base_A} />}
      {visibleTarget && <circle cx={target.left} cy={target.top} r="9" fill={tokens.cor.elementos.marcador} stroke={tokens.cor.texto.principal} strokeWidth="2" />}
      {chosen && <circle cx={chosen.left} cy={chosen.top} r="10" fill={tokens.cor.acao.primaria} stroke={tokens.cor.texto.inverso} strokeWidth="3" />}
    </svg>
  );
}

export function PlanoCartesianoStage({ spec, disabled = false, onAnswer }: Props) {
  const [selected, setSelected] = useState<PontoCartesianoF80 | undefined>();
  const interactive = spec.modo === "colocar-ponto" || spec.modo === "figura-coordenadas";
  const points = useMemo(() => Array.from({ length: (spec.maxCoord + 1) ** 2 }, (_, index) => ({
    x: index % (spec.maxCoord + 1),
    y: Math.floor(index / (spec.maxCoord + 1)),
  })), [spec.maxCoord]);

  const answerConceptual = (value: string, misconception?: string) => {
    if (disabled) return;
    onAnswer(value, misconception ? { misconception } : undefined);
  };

  // Posicionamento por toque/ponteiro é filtrado como evento motor: um ponto
  // errado não cria tag. O snap só transforma a soltura no cruzamento mais perto.
  const snapTo = (point: PontoCartesianoF80) => {
    if (disabled || !interactive) return;
    setSelected(point);
    onAnswer(encode(point));
  };

  const snapPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactive || disabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const localX = Math.max(MARGIN, Math.min(BOARD - MARGIN, (event.clientX - rect.left) * (BOARD / rect.width)));
    const localY = Math.max(MARGIN, Math.min(BOARD - MARGIN, (event.clientY - rect.top) * (BOARD / rect.height)));
    const step = SPAN / spec.maxCoord;
    const x = Math.max(0, Math.min(spec.maxCoord, Math.round((localX - MARGIN) / step)));
    const y = Math.max(0, Math.min(spec.maxCoord, Math.round((BOARD - MARGIN - localY) / step)));
    snapTo({ x, y });
  };

  const board = (
    <div
      className="absolute inset-0 touch-none"
      onPointerUp={snapPointer}
      data-f80-snap-radius={spec.raioSnapPx}
      data-f80-touch-alternative={spec.alternativaPorToque ? "true" : "false"}
    >
      <PlanoSvg spec={spec} selected={selected} />
      {interactive && points.map(point => {
        const px = pointPx(point, spec.maxCoord);
        return (
          <button
            key={`alvo-${encode(point)}`}
            type="button"
            disabled={disabled}
            aria-label={`ponto (${point.x}, ${point.y})`}
            onPointerUp={event => event.stopPropagation()}
            onClick={event => { event.stopPropagation(); snapTo(point); }}
            className="absolute rounded-full focus-visible:outline focus-visible:outline-2 disabled:opacity-50"
            style={{
              width: tokens.tamanho.alvo,
              height: tokens.tamanho.alvo,
              left: px.left,
              top: px.top,
              transform: "translate(-50%, -50%)",
              backgroundColor: "transparent",
              outlineColor: tokens.cor.acao.primaria,
            }}
          />
        );
      })}
    </div>
  );

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 overflow-x-hidden" data-f80-stage data-f80-mode={spec.modo}>
      <header className="w-full rounded-2xl border p-3 text-center" style={{ backgroundColor: tokens.cor.superficie.cartao, borderColor: tokens.cor.elementos.borda }}>
        <p className="text-sm font-bold" style={{ color: tokens.cor.texto.secundario }}>Primeiro ande no eixo x. Depois suba no eixo y.</p>
        <p className="mt-1 font-black" style={{ color: tokens.cor.texto.principal }}>{spec.objetivo}</p>
      </header>

      <div className="max-w-full overflow-hidden rounded-2xl" style={{ backgroundColor: tokens.cor.superficie.destaque }}>
        <ShapeCanvas cena={{ pecas: [], largura: BOARD, altura: BOARD }} fundo={board} />
      </div>

      {interactive && (
        <p className="text-center text-xs font-semibold" style={{ color: tokens.cor.texto.secundario }}>
          Toque numa interseção ou solte o ponteiro perto dela: o ponto encaixa na grade. Erro de dedo não vira diagnóstico.
        </p>
      )}

      {!interactive && (
        <div className="grid w-full grid-cols-2 gap-3" aria-label="Respostas do plano cartesiano">
          {spec.opcoes.map(option => (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => answerConceptual(option.value, option.misconception)}
              className="min-h-14 rounded-2xl border-2 px-3 py-2 font-black disabled:opacity-50"
              style={{ backgroundColor: tokens.cor.superficie.cartao, borderColor: tokens.cor.elementos.borda, color: tokens.cor.texto.principal }}
              data-misconception={option.misconception}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
