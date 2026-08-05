import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { tokens, UIState } from '../../styles/tokens';

/**
 * A geometria vertical do sapinho e da escala.
 *
 * ---
 *
 * **O defeito que estas constantes existem para impedir.** O sapinho é um
 * círculo de 64px centrado na reta e puxado 24px para cima; os números moravam
 * numa coluna que começava na própria reta. Resultado: em `N1.07` — *"o
 * sapinho está no número! Qual vem DEPOIS?"* — o sapinho ficava **por cima do
 * número em que ele está**. A criança não conseguia ler de onde partir, e a
 * única pergunta da competência virava adivinhação.
 *
 * A escala agora desce a partir da BASE do sapinho, calculada, não chutada:
 * `metade do sapinho − a subida + um respiro`. Trocar o tamanho do sapinho
 * empurra os números junto, sem ninguém precisar lembrar. Ver Padrão Ouro §6.29.
 */
const TAMANHO_DO_SAPO = 64;
/** Quanto o sapinho sobe em relação à reta, para parecer pousado sobre ela. */
const SUBIDA_DO_SAPO = 24;
/** Onde termina o sapinho, medido a partir da reta. */
const BASE_DO_SAPO = TAMANHO_DO_SAPO / 2 - SUBIDA_DO_SAPO;
/** Folga entre a barriga do sapinho e o primeiro tracinho. */
const RESPIRO = 6;
/** Onde a escala começa: logo abaixo do sapinho, nunca atrás dele. */
export const DESCIDA_DA_ESCALA = BASE_DO_SAPO + RESPIRO;

export function InteractiveNumberLine({ q, start: _start, end: _end, startPos: _startPos, emoji: _emoji, onAnswer, disabled, state = 'ocioso' }: { q?: any; start?: number; end?: number; startPos?: number; emoji?: string; onAnswer: (val: any) => void; disabled: boolean; state?: UIState }) {
  const start = _start ?? q?.nlStart ?? 0;
  const end = _end ?? q?.nlEnd ?? 10;
  const length = end - start;
  const stepWidth = 100 / (length || 1);
  const sp = _startPos ?? q?.nlStartPos;
  const [pos, setPos] = useState((sp !== undefined ? sp - start : 0));
  const [dragPct, setDragPct] = useState<number | null>(null);
  
  useEffect(() => {
    // Only reset position if NOT disabled, to preserve the user's final answer during the "right/wrong" state
    if (!disabled) {
      setPos(sp !== undefined ? sp - start : 0);
      setDragPct(null);
    }
  }, [q, start, sp, disabled]);
  
  const lineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateFromClientX = (clientX: number, isRelease: boolean = false) => {
    if (disabled || !lineRef.current) return;
    const rect = lineRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let pct = (x / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    
    if (isRelease) {
      const step = Math.round(pct / stepWidth);
      setPos(step);
      setDragPct(null);
    } else {
      setDragPct(pct);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX, false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || disabled) return;
    updateFromClientX(e.clientX, false);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    updateFromClientX(e.clientX, true);
  };

  return (
    <div className={`w-full py-12 px-8 select-none ${tokens.estado[state]}`}>
      {/* Container expanded to make dragging much easier on mobile */}
      <div 
        className="relative w-full h-32 touch-none cursor-pointer flex items-center -mt-8 -mb-8" 
        ref={lineRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Track Line */}
        <div 
           className="absolute left-0 right-0 h-4 rounded-full pointer-events-none" 
           style={{ backgroundColor: disabled ? tokens.cor.elementos.borda : tokens.cor.elementos.base_A, opacity: disabled ? 0.5 : 0.3 }}
        />
        
        {/* Ticks and Labels */}
        {Array.from({ length: length + 1 }).map((_, i) => (
          <div
            key={i}
            className="absolute pointer-events-none flex flex-col items-center justify-start"
            style={{
               left: `${i * stepWidth}%`,
               // A escala pendura a partir da reta, abaixo da barriga do sapinho.
               top: `calc(50% + ${DESCIDA_DA_ESCALA}px)`,
               transform: 'translateX(-50%)',
            }}
          >
            <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: tokens.cor.texto.secundario, opacity: 0.5 }} />
            <span 
              className="mt-2 font-black text-2xl pointer-events-none"
              style={{ color: tokens.cor.texto.principal }}
            >
              {start + i}
            </span>
          </div>
        ))}
        
        {/* Draggable Thumb / Frog */}
        <motion.div
          animate={{ left: `${dragPct !== null ? dragPct : pos * stepWidth}%` }}
          transition={{ type: dragPct !== null ? "tween" : "spring", duration: dragPct !== null ? 0 : undefined, stiffness: 300, damping: 25 }}
          className="absolute rounded-full shadow-lg flex items-center justify-center text-white font-bold pointer-events-none z-10"
          // Tamanho e subida saem das constantes, não de classes utilitárias:
          // é a única forma de a escala saber onde o sapinho termina. O motion
          // anima `left`, então o `transform` daqui sobrevive.
          style={{
            width: TAMANHO_DO_SAPO,
            height: TAMANHO_DO_SAPO,
            top: `calc(50% - ${TAMANHO_DO_SAPO / 2}px)`,
            transform: `translate(-50%, -${SUBIDA_DO_SAPO}px)`,
            backgroundColor: disabled ? '#94A3B8' : tokens.cor.elementos.base_A,
            border: `4px solid ${disabled ? '#CBD5E1' : '#FFFFFF'}`,
            fontSize: '32px'
          }}
        >
          {_emoji ?? q?.emoji ?? "🐸"}
        </motion.div>
      </div>

      <div className="mt-20 flex justify-center h-16">
        {!disabled && (
          <button
            onClick={() => onAnswer(start + pos)}
            // O token é um VALOR de cor (`var(--cor-acao-primaria, #3b82f6)`),
            // não uma classe do Tailwind. Interpolado no `className` ele não
            // pintava nada, e o botão saía branco no branco: a criança via uma
            // pílula vazia e não tinha como saber que ali se confirma a
            // resposta. Ver Padrão Ouro §6.30.
            className="px-10 py-4 rounded-full text-2xl font-black text-white shadow-md transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: tokens.cor.acao.primaria }}
          >
            CONFIRMAR: {start + pos}
          </button>
        )}
      </div>
    </div>
  );
}
