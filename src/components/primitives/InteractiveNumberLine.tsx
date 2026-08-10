import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { tokens, UIState } from '../../styles/tokens';

/** Geometria compartilhada pelo wrapper legado e pelo palco autoral F19. */
const TAMANHO_DO_SAPO = 64;
const SUBIDA_DO_SAPO = 24;
const BASE_DO_SAPO = TAMANHO_DO_SAPO / 2 - SUBIDA_DO_SAPO;
const RESPIRO = 6;
const LIMIAR_DE_ARRASTO_PX = 6;
export const DESCIDA_DA_ESCALA = BASE_DO_SAPO + RESPIRO;

export interface InteractiveNumberLineSurfaceProps {
  start: number;
  end: number;
  position: number;
  emoji?: string;
  disabled?: boolean;
  /** Bloqueia gesto sem mudar a aparência: usado durante coreografia autoral. */
  interactionDisabled?: boolean;
  state?: UIState;
  numeraisVisiveis?: number[];
  target?: number;
  pulsarTarget?: boolean;
  pathFrom?: number | null;
  pathTo?: number | null;
  /** Andaime F19/L2: arcos unitários já desenhados entre partida e destino. */
  assistPathFrom?: number | null;
  assistPathTo?: number | null;
  errorPulse?: number;
  onTapTick?: (value: number) => void;
  /** Emite cada marca realmente atravessada, inclusive quando o pointer salta pixels. */
  onDragTick?: (value: number) => void;
  onDragRelease?: (clientX: number, rect: DOMRect) => void;
}

/**
 * Superfície controlada da reta.
 *
 * Não decide resposta, diagnóstico nem mastery. Ela só resolve gesto visual e
 * expõe a geometria bruta ao caller. O wrapper legado e F19 compartilham esta
 * mesma superfície, evitando duas retas concorrentes.
 */
export function InteractiveNumberLineSurface({
  start,
  end,
  position,
  emoji = "🐸",
  disabled = false,
  interactionDisabled = false,
  state = 'ocioso',
  numeraisVisiveis,
  target,
  pulsarTarget = false,
  pathFrom = null,
  pathTo = null,
  assistPathFrom = null,
  assistPathTo = null,
  errorPulse = 0,
  onTapTick,
  onDragTick,
  onDragRelease,
}: InteractiveNumberLineSurfaceProps) {
  const length = Math.max(1, end - start);
  const lineRef = useRef<HTMLDivElement>(null);
  const [dragPct, setDragPct] = useState<number | null>(null);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef<number | null>(null);
  const dragMovedRef = useRef(false);
  const lastDragTickRef = useRef(position);
  const suppressClickUntilRef = useRef(0);
  const labels = new Set(numeraisVisiveis ?? Array.from({ length: length + 1 }, (_, i) => start + i));
  const gestureDisabled = disabled || interactionDisabled;

  function pctFor(value: number) {
    return ((value - start) / length) * 100;
  }

  function geometryAt(clientX: number) {
    const rect = lineRef.current?.getBoundingClientRect();
    if (!rect || !rect.width) return null;
    const raw = (clientX - rect.left) / rect.width;
    const pct = Math.max(0, Math.min(1, raw));
    const value = Math.max(start, Math.min(end, start + Math.round(pct * length)));
    return { rect, pct: pct * 100, value };
  }

  function emitCrossedTicks(nextValue: number) {
    const previous = lastDragTickRef.current;
    if (nextValue === previous) return;
    const direction = nextValue > previous ? 1 : -1;
    for (let value = previous + direction; direction > 0 ? value <= nextValue : value >= nextValue; value += direction) {
      onDragTick?.(value);
    }
    lastDragTickRef.current = nextValue;
  }

  function updateDrag(clientX: number, emitTicks: boolean) {
    const geometry = geometryAt(clientX);
    if (!geometry) return null;
    setDragPct(geometry.pct);
    if (emitTicks) emitCrossedTicks(geometry.value);
    return geometry;
  }

  function pointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (gestureDisabled || !onDragRelease) return;
    draggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragMovedRef.current = false;
    lastDragTickRef.current = position;
    // Não capturamos ainda: um toque curto sobre o hitbox continua sendo click.
  }

  function pointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current || gestureDisabled) return;
    const startX = dragStartXRef.current ?? e.clientX;
    if (!dragMovedRef.current && Math.abs(e.clientX - startX) < LIMIAR_DE_ARRASTO_PX) return;
    if (!dragMovedRef.current) {
      dragMovedRef.current = true;
      try { lineRef.current?.setPointerCapture(e.pointerId); } catch { /* browser sem capture */ }
    }
    updateDrag(e.clientX, true);
  }

  function pointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    const startX = dragStartXRef.current ?? e.clientX;
    const moved = dragMovedRef.current || Math.abs(e.clientX - startX) >= LIMIAR_DE_ARRASTO_PX;
    const geometry = moved ? updateDrag(e.clientX, true) : geometryAt(e.clientX);

    draggingRef.current = false;
    dragStartXRef.current = null;
    dragMovedRef.current = false;
    setDragPct(null);
    try { lineRef.current?.releasePointerCapture(e.pointerId); } catch { /* browser sem capture */ }

    if (moved && geometry) {
      // Alguns browsers ainda disparam click no botão onde o drag começou.
      suppressClickUntilRef.current = Date.now() + 250;
      onDragRelease?.(e.clientX, geometry.rect);
    }
  }

  function pointerCancel(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    dragStartXRef.current = null;
    dragMovedRef.current = false;
    setDragPct(null);
    try { lineRef.current?.releasePointerCapture(e.pointerId); } catch { /* browser sem capture */ }
    // Cancelamento não representa uma decisão matemática; nada é publicado.
  }

  const currentPct = dragPct !== null ? dragPct : pctFor(position);
  const hasPath = pathFrom !== null && pathTo !== null && pathFrom !== pathTo;
  const pathLeft = hasPath ? Math.min(pctFor(pathFrom!), pctFor(pathTo!)) : 0;
  const pathWidth = hasPath ? Math.abs(pctFor(pathTo!) - pctFor(pathFrom!)) : 0;

  const assistSegments: Array<{ from: number; to: number }> = [];
  if (assistPathFrom !== null && assistPathTo !== null && assistPathFrom !== assistPathTo) {
    const direction = assistPathTo > assistPathFrom ? 1 : -1;
    for (
      let from = assistPathFrom;
      direction > 0 ? from < assistPathTo : from > assistPathTo;
      from += direction
    ) {
      assistSegments.push({ from, to: from + direction });
    }
  }

  return (
    <div className={`w-full py-12 px-8 select-none ${tokens.estado[state]}`}>
      <div
        ref={lineRef}
        className="relative w-full h-32 touch-none flex items-center -mt-8 -mb-8"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerCancel}
        data-reta-surface
      >
        <div
          className="absolute left-0 right-0 h-4 rounded-full pointer-events-none"
          style={{ backgroundColor: disabled ? tokens.cor.elementos.borda : tokens.cor.elementos.base_A, opacity: disabled ? 0.5 : 0.3 }}
        />

        {assistSegments.map(({ from, to }) => {
          const left = Math.min(pctFor(from), pctFor(to));
          const width = Math.abs(pctFor(to) - pctFor(from));
          return (
            <div
              key={`assist-${from}-${to}`}
              data-reta-arco-assistido
              aria-hidden
              className="absolute pointer-events-none border-t-4 border-dashed rounded-[50%]"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                height: 26,
                top: 'calc(50% - 34px)',
                borderColor: tokens.cor.elementos.base_A,
                opacity: 0.55,
              }}
            />
          );
        })}

        {hasPath && (
          <motion.div
            data-reta-percurso
            className="absolute h-4 rounded-full pointer-events-none"
            style={{ left: `${pathLeft}%`, width: `${pathWidth}%`, backgroundColor: tokens.cor.elementos.base_A, opacity: 0.75 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.35 }}
          />
        )}

        {Array.from({ length: length + 1 }, (_, i) => start + i).map(value => {
          const pct = pctFor(value);
          const destacado = target === value;
          return (
            <React.Fragment key={value}>
              <button
                type="button"
                data-reta-tick={value}
                aria-label={`posição ${value}`}
                disabled={gestureDisabled || !onTapTick}
                onClick={event => {
                  event.stopPropagation();
                  if (Date.now() < suppressClickUntilRef.current) return;
                  onTapTick?.(value);
                }}
                className="absolute z-20 rounded-full bg-transparent p-0 disabled:cursor-default"
                style={{ left: `${pct}%`, top: '50%', width: 48, height: 64, transform: 'translate(-50%, -50%)' }}
              />
              <div
                aria-hidden
                className="absolute pointer-events-none flex flex-col items-center justify-start"
                style={{ left: `${pct}%`, top: `calc(50% + ${DESCIDA_DA_ESCALA}px)`, transform: 'translateX(-50%)' }}
              >
                <motion.div
                  className="w-1.5 h-6 rounded-full"
                  style={{ backgroundColor: tokens.cor.texto.secundario, opacity: 0.55 }}
                  animate={destacado && pulsarTarget ? { scaleY: [1, 1.45, 1], opacity: [0.55, 1, 0.55] } : { scaleY: 1 }}
                  transition={{ repeat: destacado && pulsarTarget ? Infinity : 0, duration: 0.9 }}
                />
                <span className="mt-2 font-black text-2xl" style={{ color: tokens.cor.texto.principal, visibility: labels.has(value) ? 'visible' : 'hidden' }}>
                  {value}
                </span>
              </div>
            </React.Fragment>
          );
        })}

        <motion.div
          data-reta-personagem
          data-posicao={position}
          animate={{ left: `${currentPct}%`, x: errorPulse ? [0, -7, 7, -4, 0] : 0 }}
          transition={{ left: { type: dragPct !== null ? "tween" : "spring", duration: dragPct !== null ? 0 : undefined, stiffness: 300, damping: 25 }, x: { duration: 0.45 } }}
          className="absolute rounded-full shadow-lg flex items-center justify-center text-white font-bold pointer-events-none z-10"
          style={{
            width: TAMANHO_DO_SAPO,
            height: TAMANHO_DO_SAPO,
            top: `calc(50% - ${TAMANHO_DO_SAPO / 2}px)`,
            transform: `translate(-50%, -${SUBIDA_DO_SAPO}px)`,
            backgroundColor: disabled ? '#94A3B8' : tokens.cor.elementos.base_A,
            border: `4px solid ${disabled ? '#CBD5E1' : '#FFFFFF'}`,
            fontSize: '32px',
          }}
        >
          {emoji}
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Wrapper legado. Mantém o contrato histórico: arrastar/tocar escolhe posição e
 * o botão CONFIRMAR publica a resposta. F19 não usa este botão; usa a superfície.
 */
export function InteractiveNumberLine({ q, start: _start, end: _end, startPos: _startPos, emoji: _emoji, onAnswer, disabled, state = 'ocioso' }: { q?: any; start?: number; end?: number; startPos?: number; emoji?: string; onAnswer: (val: any) => void; disabled: boolean; state?: UIState }) {
  const start = _start ?? q?.nlStart ?? 0;
  const end = _end ?? q?.nlEnd ?? 10;
  const sp = _startPos ?? q?.nlStartPos;
  const [pos, setPos] = useState(sp !== undefined ? sp : start);

  useEffect(() => {
    if (!disabled) setPos(sp !== undefined ? sp : start);
  }, [q, start, sp, disabled]);

  function chooseFromDrag(clientX: number, rect: DOMRect) {
    if (!rect.width) return;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setPos(start + Math.round(pct * (end - start)));
  }

  return (
    <div className="w-full">
      <InteractiveNumberLineSurface
        start={start}
        end={end}
        position={pos}
        emoji={_emoji ?? q?.emoji ?? "🐸"}
        disabled={disabled}
        state={state}
        onTapTick={value => !disabled && setPos(value)}
        onDragRelease={chooseFromDrag}
      />
      <div className="mt-4 flex justify-center h-16">
        {!disabled && (
          <button
            onClick={() => onAnswer(pos)}
            className="px-10 py-4 rounded-full text-2xl font-black text-white shadow-md transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: tokens.cor.acao.primaria }}
          >
            CONFIRMAR: {pos}
          </button>
        )}
      </div>
    </div>
  );
}