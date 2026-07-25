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
}

interface ShapeCanvasProps {
  shapes: ShapeItem[];
  interactive?: boolean;
  onShapeClick?: (id: string) => void;
  state?: UIState;
}

export function ShapeCanvas({ shapes, interactive = false, onShapeClick, state = 'ocioso' }: ShapeCanvasProps) {
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
