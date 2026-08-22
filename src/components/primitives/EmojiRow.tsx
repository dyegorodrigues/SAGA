import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { tokens, UIState } from '../../styles/tokens';
import { speak } from '../Mascot';

export interface EmojiRowProps {
  emoji: string;
  n: number;
  small?: boolean;
  highlightIndex?: number | null;
  startIndex?: number;
  state?: UIState;

  /**
   * Onde cada objeto fica, em percentual da área — quando o arranjo não é fila.
   *
   * A JD1 §5 pede três arranjos: **fila**, **padrão de dado** e **disperso**.
   * Desenhar os dois últimos num componente à parte faria a criança ver dois
   * desenhos diferentes para a mesma coisa, que é o defeito do Padrão Ouro
   * §6.31-bis. Com as posições vindo de fora, é o **mesmo** componente, o mesmo
   * glifo e o mesmo tamanho nos três arranjos: só o lugar muda.
   *
   * As posições nascem no contrato, nunca aqui: sorteio dentro do render muda a
   * cena a cada quadro e a sonda de layout deixa de ser portão (§6.31).
   */
  pontos?: { x: number; y: number }[];

  // Flash Mode (N1.03)
  flashDurationMs?: number;

  // Touch Count Mode (N1.04)
  interactiveCount?: boolean;
  disabled?: boolean;
  crossedOut?: boolean;
  promptDone?: boolean;
  onItemTouch?: (count: number) => void;

  /** W9/F15 — retirada sem deslocar o objeto do slot original. */
  markedIndices?: number[];
  markStyle?: 'x' | 'ghost';
  markInteractive?: boolean;
  onItemMark?: (index: number) => void;
}

export function EmojiRow({
  emoji,
  n,
  small,
  startIndex = 1,
  highlightIndex = null,
  state = 'ocioso',
  pontos,
  flashDurationMs,
  interactiveCount,
  onItemTouch,
  disabled,
  crossedOut,
  promptDone = true,
  markedIndices = [],
  markStyle = 'x',
  markInteractive = false,
  onItemMark,
}: EmojiRowProps) {

  const [phase, setPhase] = useState<'waiting' | 'flashing' | 'done'>(
    !promptDone && flashDurationMs ? 'waiting' : (flashDurationMs ? 'flashing' : 'done')
  );
  const [touchedItems, setTouchedItems] = useState<Set<number>>(new Set());
  const touchedCount = touchedItems.size;

  useEffect(() => {
    if (flashDurationMs && flashDurationMs > 0) {
      if (promptDone) {
        setPhase('flashing');
        const timer = setTimeout(() => {
          setPhase('done');
        }, flashDurationMs);
        return () => clearTimeout(timer);
      } else {
        setPhase('waiting');
      }
    } else {
      setPhase('done');
    }
  }, [promptDone, flashDurationMs, n, emoji]);

  // Reset touch count
  useEffect(() => {
    setTouchedItems(new Set());
  }, [n, interactiveCount, emoji]);

  const handleTouch = (idx: number) => {
    if (!interactiveCount || disabled) return;
    if (!touchedItems.has(idx)) {
      const newItems = new Set(touchedItems);
      newItems.add(idx);
      setTouchedItems(newItems);
      const newCount = newItems.size;
      speak(newCount.toString());
      if (onItemTouch && newCount === n) { setTimeout(() => onItemTouch(newCount), 800); }
    } else {
      speak("esse já contamos!");
    }
  };

  const handleMark = (idx: number) => {
    if (!markInteractive || disabled || !promptDone) return;
    onItemMark?.(idx);
  };

  return (
    <div
      className={pontos
        // Com posições, a caixa é o palco: os objetos se colocam nela, e o
        // tamanho dela é decidido por quem a monta.
        ? `relative h-full w-full ${tokens.estado[state]}`
        : `flex flex-wrap items-center justify-center gap-x-4 gap-y-16 relative py-6 ${tokens.estado[state]}`}
      style={pontos ? undefined : { maxWidth: small ? 150 : "100%", minHeight: '80px' }}
    >
      <AnimatePresence mode="popLayout">
        { (phase === 'flashing' || !flashDurationMs) ? (
          Array.from({ length: n }).map((_, i) => {
            const isHighlighted = highlightIndex === i || (interactiveCount && !touchedItems.has(i));
            const isMarked = markedIndices.includes(i);
            
            // In touch mode, items are dimmed until touched
            const isTouched = interactiveCount ? touchedItems.has(i) : true;
            
            return (
              <motion.span 
                key={`emoji-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isHighlighted ? 1.35 : 1, 
                  opacity: isMarked ? 0.42 : (isTouched ? 1 : 0.3),
                  filter: isTouched ? 'grayscale(0%)' : 'grayscale(100%)'
                }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => markInteractive ? handleMark(i) : handleTouch(i)}
                onKeyDown={event => {
                  if (!markInteractive || (event.key !== 'Enter' && event.key !== ' ')) return;
                  event.preventDefault();
                  handleMark(i);
                }}
                {...(markInteractive ? {
                  role: 'button',
                  tabIndex: disabled || !promptDone ? -1 : 0,
                  'aria-label': isMarked ? `Item ${i + 1} já riscado` : `Riscar item ${i + 1}`,
                  'aria-disabled': disabled || !promptDone || isMarked,
                } : {})}
                data-marked={isMarked ? 'true' : 'false'}
                data-mark-style={isMarked ? markStyle : undefined}
                className={`${pontos ? 'absolute' : 'relative'} inline-block ${interactiveCount && !touchedItems.has(i) ? 'cursor-pointer' : ''} ${markInteractive ? 'cursor-pointer' : ''} ${isMarked && markStyle === 'ghost' ? 'rounded-xl outline outline-2 outline-dashed outline-slate-500' : ''}`}
                style={{
                  zIndex: isHighlighted ? 20 : 1,
                  fontSize: small ? '24px' : tokens.tamanho.base,
                  // `translate` e não `transform`: o motion é dono do
                  // `transform` (é por lá que passa o `scale`), e escrever os
                  // dois faz um apagar o outro — o objeto ia parar no canto.
                  ...(pontos?.[i] ? {
                    left: `${pontos[i].x}%`,
                    top: `${pontos[i].y}%`,
                    translate: '-50% -50%',
                  } : {}),
                }}
              >
                {/* Ping animation for the next item to touch */}
                {isHighlighted && interactiveCount && (
                  <span 
                    className="absolute inset-0 rounded-full scale-150 blur-[2px] animate-ping pointer-events-none" 
                    style={{ backgroundColor: tokens.cor.elementos.marcador, opacity: 0.5 }}
                  />
                )}
                
                {/* Highlight bouncing arrow (only in non-interactive highlight mode) */}
                {highlightIndex === i && !interactiveCount && (
                  <span 
                    className="absolute -top-9 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none" 
                    style={{ zIndex: 30, fontSize: tokens.tamanho.pequeno }}
                  >
                    👇
                  </span>
                )}
                
                {/* Number tag below the item */}
                {(highlightIndex === i || (interactiveCount && isTouched)) && (
                  <span 
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-black px-2 py-0.5 rounded shadow-sm pointer-events-none" 
                    style={{ 
                      zIndex: 30, 
                      backgroundColor: tokens.cor.texto.principal,
                      color: tokens.cor.texto.inverso,
                      borderColor: tokens.cor.elementos.borda,
                      borderWidth: 1
                    }}
                  >
                    {startIndex + i}
                  </span>
                )}
                {emoji}
                {isMarked && markStyle === 'x' && (
                  <span className="absolute inset-0 flex items-center justify-center text-5xl font-black text-red-600 pointer-events-none" aria-hidden="true">×</span>
                )}
                {crossedOut && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-1 bg-red-500 -rotate-45 shadow-sm" /></div>}
              </motion.span>
            );
          })
        ) : (
          <motion.div
            key="hidden-box"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center p-4 rounded-xl shadow-md gap-2"
            style={{ backgroundColor: tokens.cor.elementos.preenchimento, border: `3px solid ${tokens.cor.elementos.borda}` }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-7xl">{phase === 'waiting' ? '🙈' : '🙈'}</span>
              <span className="text-xl font-bold" style={{ color: tokens.cor.texto.secundario }}>
                {phase === 'waiting' ? 'Olhos fechados... 👀' : 'Quantos eram? 🤔'}
              </span>
            </div>
            {!disabled && phase === 'done' && (
              <button
                onClick={() => {
                  setPhase('waiting');
                  setTimeout(() => {
                    setPhase('flashing');
                    if (flashDurationMs) {
                      setTimeout(() => setPhase('done'), flashDurationMs);
                    }
                  }, 100);
                }}
                className="mt-2 select-none cursor-pointer active:translate-y-0.5 transition-all"
                // O âmbar do marcador sobre a lavanda dava 1.45:1: o botão que
                // permite REVER a quantidade era o texto menos legível do
                // relance — justamente o socorro de quem não conseguiu contar a
                // tempo. A moldura continua âmbar (a identidade fica), a letra
                // escurece para 6,4:1. Ver Padrão Ouro §6.30.
                style={{ fontFamily: 'inherit', fontWeight: 800, fontSize: 13, color: "#92400E", background: "#F1EDFF", border: `2px solid ${tokens.cor.elementos.marcador}`, borderRadius: 12, padding: "6px 14px" }}
              >
                👀 Ver de novo
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
