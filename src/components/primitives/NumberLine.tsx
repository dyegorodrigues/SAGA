import React from "react";
import { motion } from "motion/react";
import { tokens, UIState } from "../../styles/tokens";

interface NumberLineProps {
  min?: number;
  max?: number;
  step?: number;
  currentValue?: number | null;
  targetValue?: number | null;
  highlightedRanges?: { start: number; end: number; color?: string }[];
  onValueClick?: (val: number) => void;
  state?: UIState;
  /**
   * Largura mínima por ponto, em px.
   *
   * O padrão de 60 é confortável para retas curtas. Retas longas (contar de dez
   * em dez até 90 são 10 pontos = 600px) estouram os 390px do aparelho e a reta
   * passa a ROLAR na horizontal — escondendo justamente o fim da contagem, que é
   * o que a criança precisa ver. Quem sabe quantos pontos vêm passa um valor
   * menor. Ver Padrão Ouro §6.16.
   */
  larguraPorPonto?: number;
}

export function NumberLine({
  min = 0,
  max = 20,
  step = 1,
  currentValue = null,
  targetValue = null,
  highlightedRanges = [],
  onValueClick,
  state = 'ocioso',
  larguraPorPonto = 60
}: NumberLineProps) {
  const points = [];
  for (let i = min; i <= max; i += step) {
    points.push(i);
  }

  const minWidthPerPoint = larguraPorPonto;
  // O rótulo acompanha a densidade da reta. Onze pontos com números de dois
  // dígitos não cabem em 300px no tamanho confortável — e apertar o espaço só
  // faria os números colidirem. Encolher a fonte resolve sem esconder nada.
  const classeDoRotulo = minWidthPerPoint < 40 ? "text-sm" : "text-xl";
  const totalMinWidth = points.length * minWidthPerPoint;

  return (
    <div className={`w-full overflow-x-auto py-12 px-4 hide-scrollbar ${tokens.estado[state]}`}>
      <div className="relative flex items-center justify-between mx-auto" style={{ minWidth: totalMinWidth }}>
        {/* Main Line */}
        <div 
          className="absolute left-0 right-0 h-3 rounded-full" 
          style={{ backgroundColor: tokens.cor.elementos.borda }} 
        />
        
        {/* Highlighted Ranges */}
        {highlightedRanges.map((range, idx) => {
          const startIdx = points.indexOf(range.start);
          const endIdx = points.indexOf(range.end);
          if (startIdx === -1 || endIdx === -1) return null;
          
          const leftPct = (startIdx / (points.length - 1)) * 100;
          const rightPct = (endIdx / (points.length - 1)) * 100;
          
          return (
            <div 
              key={`range-${idx}`}
              className="absolute h-3 rounded-full"
              style={{
                left: `${leftPct}%`,
                width: `${rightPct - leftPct}%`,
                backgroundColor: range.color || tokens.cor.elementos.marcador,
                opacity: 0.6
              }}
            />
          );
        })}

        {/* Target Indicator */}
        {targetValue != null && (
          <div 
            className="absolute -top-10 h-24 border-r-4 border-dashed animate-pulse"
            style={{
              left: `${(points.indexOf(targetValue) / (points.length - 1)) * 100}%`,
              borderColor: tokens.cor.elementos.marcador
            }}
          />
        )}

        {/* Current Value / Jumps */}
        {currentValue != null && (
          <motion.div 
            layout
            className="absolute -top-6 text-3xl z-20 pointer-events-none"
            style={{
              left: `calc(${(points.indexOf(currentValue) / (points.length - 1)) * 100}% - 14px)`
            }}
          >
            🐸
          </motion.div>
        )}

        {/* Points */}
        {points.map((val, idx) => {
          const isTarget = targetValue === val;
          const isCurrent = currentValue === val;
          return (
            <div 
              key={val} 
              className="relative flex flex-col items-center justify-center cursor-pointer group"
              onClick={() => onValueClick?.(val)}
            >
              {/* Tick mark */}
              <div 
                className="w-1 h-6 z-10 transition-colors"
                style={{ backgroundColor: isTarget ? tokens.cor.elementos.base_A : tokens.cor.texto.secundario }}
              />
              {/* Number Label */}
              <div 
                className={`absolute top-8 font-black transition-all ${classeDoRotulo}`}
                style={{ 
                  color: isCurrent || isTarget ? tokens.cor.texto.principal : tokens.cor.texto.secundario,
                  transform: isCurrent || isTarget ? 'scale(1.2)' : 'scale(1)'
                }}
              >
                {val}
              </div>
              {/* Hover area */}
              <div 
                className="absolute w-12 h-12 rounded-full opacity-0 hover:opacity-10 transition-opacity"
                style={{ backgroundColor: tokens.cor.elementos.base_A }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
