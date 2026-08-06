import React, { useState } from 'react';
import { motion } from 'motion/react';
import { tokens, UIState } from '../../styles/tokens';

export type ShapeType = 'circle' | 'square' | 'triangle' | 'rectangle';

export interface ShapeItem {
  id: string;
  type: ShapeType;
  color: string;
  size: number;
  rotation?: number;
  x?: number; // relative 0-100%
  y?: number; // relative 0-100%
  /**
   * O nome da forma para quem não vê a tela.
   *
   * As formas eram `<div>` com `onClick` — sem `role`, sem rótulo, fora do
   * alcance do teclado. Numa ficha cujo enunciado é *"qual é o triângulo?"*
   * (F48), isso é a pergunta inteira invisível para leitor de tela.
   */
  rotulo?: string;
}

/**
 * Uma peça do **modo cena** (ficha F47, `ShapeCanvas (cena)`).
 *
 * Modo próprio, não um `ShapeItem` com campos a mais — do mesmo jeito que o
 * `EmojiRow` ganhou `pontos` para o modo padrão. Aqui as peças são **cenário**
 * (uma mesa, um muro, uma árvore), não formas a identificar: misturar os dois
 * vocabulários faria a F47 ensinar que mesa É retângulo, na mesma linguagem
 * visual que a F48 usa depois para perguntar qual é o retângulo.
 *
 * E as medidas são em **pixels**, não em percentual: nesta ficha a resposta
 * certa É uma relação espacial, e percentual sobre campo não-quadrado distorce
 * o eixo vertical (§6.29).
 */
export interface PecaDaCena {
  forma: 'rectangle' | 'triangle' | 'circle';
  x: number;
  y: number;
  largura: number;
  altura: number;
  cor: string;
  /** Só o contorno: a caixa aberta, que tem "dentro" visível. */
  contorno?: boolean;
}

interface ShapeCanvasProps {
  shapes?: ShapeItem[];
  /** Modo cena: peças de cenário em pixels, num campo de tamanho fixo. */
  cena?: { pecas: PecaDaCena[]; largura: number; altura: number };
  /** Sobreposto à cena, no mesmo sistema de coordenadas: os objetos da F47. */
  children?: React.ReactNode;
  /**
   * Desenhado **antes** das peças, no mesmo sistema de coordenadas.
   *
   * É como "atrás" existe num plano: o objeto sai por baixo do muro. As peças
   * não capturam toque (`pointer-events-none`), então o que está atrás continua
   * clicável — oclusão visual sem oclusão de dedo.
   */
  fundo?: React.ReactNode;
  interactive?: boolean;
  onShapeClick?: (id: string) => void;
  state?: UIState;
}

export function ShapeCanvas({ shapes = [], cena, children, fundo, interactive = false, onShapeClick, state = 'ocioso' }: ShapeCanvasProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleClick = (id: string) => {
    if (!interactive) return;
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    if (onShapeClick) onShapeClick(id);
  };

  const getShapeStyle = (shape: ShapeItem) => {
    const baseStyle: React.CSSProperties = {
      backgroundColor: shape.type !== 'triangle' ? shape.color : 'transparent',
      width: `${shape.size}px`,
      height: shape.type === 'rectangle' ? `${shape.size * 0.6}px` : `${shape.size}px`,
      borderRadius: shape.type === 'circle' ? '50%' : '0',
      transform: `rotate(${shape.rotation || 0}deg)`,
      transition: tokens.animacao.padrao,
      position: (shape.x !== undefined && shape.y !== undefined) ? 'absolute' : 'relative',
      left: shape.x !== undefined ? `${shape.x}%` : 'auto',
      top: shape.y !== undefined ? `${shape.y}%` : 'auto',
      transformOrigin: 'center center'
    };

    if (shape.type === 'triangle') {
      baseStyle.width = '0';
      baseStyle.height = '0';
      baseStyle.borderLeft = `${shape.size / 2}px solid transparent`;
      baseStyle.borderRight = `${shape.size / 2}px solid transparent`;
      baseStyle.borderBottom = `${shape.size}px solid ${shape.color}`;
    }

    return baseStyle;
  };

  // ---- modo cena (F47) -------------------------------------------------
  if (cena) {
    return (
      <div
        className="relative overflow-hidden select-none rounded-2xl"
        style={{
          width: cena.largura,
          height: cena.altura,
          backgroundColor: tokens.cor.superficie.destaque,
          border: `3px solid ${tokens.cor.elementos.borda}`,
        }}
      >
        {fundo}
        {cena.pecas.map((peca, i) => (
          <div
            key={`cena-${i}`}
            aria-hidden
            className="pointer-events-none absolute"
            style={peca.forma === 'triangle'
              ? {
                left: peca.x - peca.largura / 2,
                top: peca.y - peca.altura / 2,
                width: 0,
                height: 0,
                borderLeft: `${peca.largura / 2}px solid transparent`,
                borderRight: `${peca.largura / 2}px solid transparent`,
                borderBottom: `${peca.altura}px solid ${peca.cor}`,
              }
              : {
                left: peca.x - peca.largura / 2,
                top: peca.y - peca.altura / 2,
                width: peca.largura,
                height: peca.altura,
                borderRadius: peca.forma === 'circle' ? '50%' : 6,
                // Contorno em vez de bloco: sem isso a caixa do "dentro/fora"
                // taparia justamente o objeto que está dentro dela.
                backgroundColor: peca.contorno ? 'transparent' : peca.cor,
                border: peca.contorno ? `6px solid ${peca.cor}` : 'none',
              }}
          />
        ))}
        {children}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full min-h-[250px] p-4 flex flex-wrap items-center justify-center gap-6 overflow-hidden select-none rounded-xl ${tokens.estado[state]}`}
      style={{ backgroundColor: tokens.cor.superficie.destaque, border: `2px dashed ${tokens.cor.elementos.borda}` }}
    >
      {shapes.map((shape) => {
        const isSelected = selectedIds.includes(shape.id);
        return (
          <motion.div
            key={shape.id}
            whileHover={interactive ? { scale: 1.05 } : undefined}
            whileTap={interactive ? { scale: 0.95 } : undefined}
            onClick={() => handleClick(shape.id)}
            // Sem isto, a forma é um `div` clicável: nenhum papel, nenhum
            // rótulo, invisível para o teclado e para o leitor de tela.
            {...(interactive
              ? {
                role: 'button',
                tabIndex: 0,
                'aria-label': shape.rotulo ?? shape.type,
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(shape.id); }
                },
              }
              : { 'aria-hidden': true })}
            className={`${interactive ? 'cursor-pointer' : ''} ${isSelected ? 'ring-4 ring-offset-2 ring-blue-500 rounded' : ''}`}
            style={{
              position: (shape.x !== undefined && shape.y !== undefined) ? 'absolute' : 'relative',
              left: shape.x !== undefined ? `${shape.x}%` : 'auto',
              top: shape.y !== undefined ? `${shape.y}%` : 'auto',
              transform: (shape.x !== undefined && shape.y !== undefined) ? 'translate(-50%, -50%)' : 'none'
            }}
          >
            <div style={getShapeStyle(shape)} />
          </motion.div>
        );
      })}
      
      {!shapes.length && (
        <span className="text-slate-400 font-medium">Canvas vazio</span>
      )}
    </div>
  );
}
