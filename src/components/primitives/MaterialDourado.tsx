import React from 'react';
import { motion } from 'motion/react';
import { tokens, UIState } from '../../styles/tokens';

export interface MaterialDouradoProps {
  unidades: number;
  dezenas: number;
  centenas?: number;
  state?: UIState;
  compact?: boolean;
  /** Sensor F21: inspecionar a barra para recontar subdivisões é um gesto observável. */
  onTenInspect?: (tenIndex: number) => void;
}

export function MaterialUnitCube() {
  return <span aria-hidden className="block h-5 w-5 rounded-sm border border-amber-600 bg-amber-400 shadow-sm" />;
}

function TenCells() {
  return (
    <span className="flex flex-col gap-[1px] rounded-sm bg-amber-600 p-[1px] shadow-md" aria-hidden>
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} className="h-5 w-5 bg-amber-400" />
      ))}
    </span>
  );
}

export function MaterialTenBar({ tenIndex = 0, onInspect }: {
  tenIndex?: number;
  onInspect?: (tenIndex: number) => void;
}) {
  if (!onInspect) return <span data-material-ten><TenCells /></span>;
  return (
    <button
      type="button"
      data-material-ten
      data-material-inspect-ten
      aria-label={`inspecionar os dez quadradinhos da dezena ${tenIndex + 1}`}
      className="rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
      onClick={() => onInspect(tenIndex)}
    >
      <TenCells />
    </button>
  );
}

export function MaterialHundredBlock() {
  return (
    <span className="grid grid-cols-10 gap-[1px] rounded-sm bg-amber-600 p-[2px] shadow-md">
      {Array.from({ length: 100 }).map((_, i) => (
        <span key={i} aria-hidden className="h-[10px] w-[10px] bg-amber-400" />
      ))}
    </span>
  );
}

export function MaterialDourado({
  unidades,
  dezenas,
  centenas = 0,
  state = 'ocioso',
  compact = false,
  onTenInspect,
}: MaterialDouradoProps) {
  return (
    <div className={`flex flex-wrap justify-center items-end select-none bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200 ${compact ? 'gap-3 p-3' : 'gap-8 p-6'} ${tokens.estado[state]}`}>
      {centenas > 0 && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap gap-2 justify-center max-w-[250px]">
            {Array.from({ length: centenas }).map((_, i) => (
              <motion.div key={`c-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}>
                <MaterialHundredBlock />
              </motion.div>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Centenas</span>
        </div>
      )}

      {dezenas > 0 && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex max-w-[150px] flex-wrap items-end justify-center gap-2">
            {Array.from({ length: dezenas }).map((_, i) => (
              <motion.div key={`d-${i}`} initial={{ scale: 0, y: -20 }} animate={{ scale: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <MaterialTenBar tenIndex={i} onInspect={onTenInspect} />
              </motion.div>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dezenas</span>
        </div>
      )}

      {unidades > 0 && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap gap-1 max-w-[120px] justify-start content-end">
            {Array.from({ length: unidades }).map((_, i) => (
              <motion.div key={`u-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }}>
                <MaterialUnitCube />
              </motion.div>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unidades</span>
        </div>
      )}

      {unidades === 0 && dezenas === 0 && centenas === 0 && (
        <span className="text-slate-500 font-bold">Vazio</span>
      )}
    </div>
  );
}
