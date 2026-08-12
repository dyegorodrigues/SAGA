import React from 'react';
import { motion } from 'motion/react';
import { tokens } from '../../styles/tokens';

interface ReferenciaComparacao {
  linha: number;
  largura: number;
  altura: number;
  destacada?: boolean;
}

export interface GrupoProps {
  items: React.ReactNode[];
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  /** F49 altura: linha horizontal comum. */
  chao?: ReferenciaComparacao;
  /** F49 comprimento: extremidade inicial comum, a mesma regra girada 90°. */
  inicio?: ReferenciaComparacao;
  rotulo?: string;
}

export function Grupo({ items, onClick, selected, disabled, chao, inicio, rotulo }: GrupoProps) {
  const referencia = chao ?? inicio;
  if (referencia) {
    const vertical = Boolean(inicio);
    return (
      <motion.button
        whileTap={disabled ? {} : { scale: 0.98 }}
        onClick={onClick}
        disabled={disabled}
        aria-label={rotulo}
        data-grupo-eixo={vertical ? 'horizontal' : 'vertical'}
        className={`relative flex overflow-hidden rounded-3xl ${
          vertical ? 'items-center justify-start' : 'items-end justify-center'
        } ${selected ? 'ring-4 ring-blue-500' : ''}`}
        style={{
          width: referencia.largura,
          height: referencia.altura,
          backgroundColor: tokens.cor.superficie.fundo,
          border: `3px solid ${tokens.cor.elementos.borda}`,
          ...(vertical
            ? { paddingLeft: referencia.linha }
            : { paddingBottom: referencia.altura - referencia.linha }),
          cursor: disabled ? 'default' : 'pointer',
        }}
      >
        {items}
        {chao && (
          <motion.span
            data-grupo-referencia="chao"
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0"
            style={{
              top: chao.linha,
              backgroundColor: '#E7D3B3',
              borderTop: `${chao.destacada ? 5 : 4}px solid ${chao.destacada ? '#2563EB' : '#B45309'}`,
              transformOrigin: 'left center',
              zIndex: 20,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        )}
        {inicio && (
          <motion.span
            data-grupo-referencia="inicio"
            aria-hidden
            className="pointer-events-none absolute inset-y-3"
            style={{
              left: inicio.linha,
              borderLeft: `${inicio.destacada ? 5 : 4}px solid ${inicio.destacada ? '#2563EB' : '#B45309'}`,
              transformOrigin: 'center top',
              zIndex: 20,
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={rotulo}
      className={`relative flex flex-wrap items-center justify-center p-6 min-h-[160px] min-w-[160px] rounded-3xl transition-colors ${selected ? 'ring-4 ring-offset-4 ring-blue-500' : ''}`}
      style={{
        backgroundColor: tokens.cor.elementos.preenchimento,
        border: `2px solid ${tokens.cor.elementos.borda}`,
        cursor: disabled ? 'default' : 'pointer'
      }}
    >
      {items.map((item, i) => <div key={i} className="m-2">{item}</div>)}
    </motion.button>
  );
}
