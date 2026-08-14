import React, { useState } from 'react';
import { motion } from 'motion/react';
import { tokens, UIState } from '../../styles/tokens';

interface Quadrado100Props {
  highlightedNumbers?: number[];
  hiddenNumbers?: number[];
  revealedNumbers?: number[];
  incorrectNumber?: number | null;
  interactive?: boolean;
  /** Mantém o comportamento legado do componente isolado; o Stage autoral controla seleção por fora. */
  trackSelection?: boolean;
  onNumberClick?: (n: number) => void;
  targetNumber?: number | null;
  state?: UIState;
  /** F75 reutiliza a malha como UM inteiro; os numerais 1..100 ficam fora da linguagem visual. */
  showNumbers?: boolean;
}

export function Quadrado100({
  highlightedNumbers = [],
  hiddenNumbers = [],
  revealedNumbers = [],
  incorrectNumber = null,
  interactive = false,
  trackSelection = true,
  onNumberClick,
  targetNumber = null,
  state = 'ocioso',
  showNumbers = true,
}: Quadrado100Props) {
  const [selected, setSelected] = useState<number[]>([]);

  const handleToggle = (n: number) => {
    if (!interactive) return;
    if (trackSelection) {
      setSelected((prev) => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]);
    }
    onNumberClick?.(n);
  };

  return (
    <div className={`w-full max-w-lg mx-auto flex justify-center p-2 select-none ${tokens.estado[state]}`}>
      <div
        className="grid grid-cols-10 gap-0.5 p-1 rounded-lg shadow-sm w-full"
        style={{ backgroundColor: tokens.cor.elementos.borda }}
        role="grid"
        aria-label={showNumbers ? "Quadro de números de 1 a 100" : "Inteiro dividido em cem partes iguais"}
        data-quadrado100-grid
        data-show-numbers={showNumbers ? 'true' : 'false'}
      >
        {Array.from({ length: 10 }).map((_, rowIndex) => (
          <div key={`row-${rowIndex + 1}`} role="row" className="contents">
            {Array.from({ length: 10 }).map((__, columnIndex) => {
              const i = rowIndex * 10 + columnIndex;
              const n = i + 1;
              const isHighlighted = highlightedNumbers.includes(n);
              const isSelected = selected.includes(n);
              const isTarget = targetNumber === n;
              const isHidden = hiddenNumbers.includes(n) && !revealedNumbers.includes(n);
              const isIncorrect = incorrectNumber === n;
              const linha = rowIndex + 1;
              const coluna = columnIndex + 1;

              let bgColor = tokens.cor.superficie.cartao;
              let textColor = tokens.cor.texto.principal;
              if (isSelected) {
                bgColor = tokens.cor.acao.primaria;
                textColor = tokens.cor.texto.inverso;
              } else if (isHighlighted) {
                bgColor = tokens.cor.elementos.marcador;
              } else if (isTarget) {
                bgColor = tokens.cor.feedback.acerto;
                textColor = tokens.cor.texto.inverso;
              }

              return (
                <motion.button
                  type="button"
                  key={n}
                  role="gridcell"
                  whileTap={interactive ? { scale: 0.9 } : undefined}
                  animate={isIncorrect ? { x: [0, -3, 3, -3, 0] } : { x: 0 }}
                  onClick={() => handleToggle(n)}
                  disabled={!interactive}
                  aria-label={showNumbers ? (isHidden ? `Casa vazia, linha ${linha}, coluna ${coluna}` : `Número ${n}`) : `Parte do inteiro, linha ${linha}, coluna ${coluna}`}
                  data-quadrado100-cell={n}
                  data-hidden={isHidden ? 'true' : 'false'}
                  className={`flex items-center justify-center font-bold text-[10px] min-[360px]:text-xs sm:text-sm ${interactive ? 'cursor-pointer' : ''} disabled:cursor-default`}
                  style={{
                    width: '100%', aspectRatio: '1/1', minWidth: '0', backgroundColor: bgColor, color: textColor,
                    borderRadius: '4px', transition: tokens.animacao.rapida,
                  }}
                >
                  {showNumbers ? (isHidden ? <span aria-hidden="true">•</span> : n) : <span aria-hidden="true"> </span>}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
