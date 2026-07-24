import React, { useState } from "react";
import { UIState } from "../styles/tokens";

import { EmojiRow } from "./primitives/EmojiRow";
import { TenFrame } from "./primitives/TenFrame";
import { InteractiveVertical } from "./primitives/InteractiveVertical";
import { NumberLine } from "./primitives/NumberLine";
import { InteractiveNumberLine } from "./primitives/InteractiveNumberLine";
import { ArrayGrid } from "./primitives/ArrayGrid";
import { DragGroup } from "./primitives/DragGroup";
import { SingaporeBars } from "./primitives/SingaporeBars";

const STATES: UIState[] = ['ocioso', 'ativo', 'erro-suave', 'acerto', 'desabilitado', 'demo'];

export function GalleryScreen({ onExit }: { onExit: () => void }) {
  // In a real scenario, toggling theme would change the root CSS variables 
  // that `tokens.ts` uses (like --cor-acao-primaria).
  // Here we just toggle a wrapper class.
  const [themeName, setThemeName] = useState("classico");

  const themes = ['classico', 'pixel', 'neon'];

  const renderStateVariants = (PrimitiveComp: any, props: any) => {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {STATES.map(s => (
            <div key={s} className="flex flex-col items-center gap-2">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{s}</span>
              <div className="w-full flex justify-center bg-slate-100 p-4 rounded-xl border border-slate-200">
                 <PrimitiveComp {...props} state={s} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center py-10 px-4 theme-${themeName}`}>
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg border-4 border-slate-200 p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-black text-slate-800">🎨 Galeria de Primitivas & Estados (Camada Visual)</h1>
          <button onClick={onExit} className="px-6 py-2 rounded-full font-bold text-white bg-blue-600 shadow-sm">
            Voltar
          </button>
        </div>
        
        <div className="flex gap-2 items-center text-sm font-bold text-slate-500 mb-8 pb-4 border-b-2 border-slate-100">
          <span>Temas CSS (Modificam as var() globais):</span>
          {themes.map(k => (
            <button 
              key={k} 
              onClick={() => setThemeName(k)} 
              className={`px-3 py-1 rounded-full border-2 border-slate-300 ${themeName === k ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'}`} 
            >
              {k}
            </button>
          ))}
        </div>

        {/* --- PRIMITIVA: EMOJI ROW --- */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 border-b-2 pb-2 text-blue-800">
            <span className="text-2xl">🍎</span> Primitiva 1: EmojiRow
          </h2>
          {renderStateVariants(EmojiRow, { emoji: "🍎", n: 5, highlightIndex: 2 })}
        </section>

        {/* --- PRIMITIVA: TEN FRAME --- */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 border-b-2 pb-2 text-blue-800">
            <span className="text-2xl">🔟</span> Primitiva 2: TenFrame
          </h2>
          {renderStateVariants(TenFrame, { filled: 6, filled2: 3 })}
        </section>

        {/* --- PRIMITIVA: DRAG GROUP --- */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 border-b-2 pb-2 text-blue-800">
            <span className="text-2xl">📦</span> Primitiva 3: DragGroup
          </h2>
          {renderStateVariants(DragGroup, { q: { dividend: 6, divisor: 2, emoji: "🍪" }, disabled: false, onAnswer: () => {} })}
        </section>

        {/* --- PRIMITIVA: INTERACTIVE VERTICAL --- */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 border-b-2 pb-2 text-blue-800">
            <span className="text-2xl">🏗️</span> Primitiva 4: InteractiveVertical
          </h2>
          {renderStateVariants(InteractiveVertical, { q: { vTop: 45, vBot: 27, vOp: "+" }, disabled: false, onAnswer: () => {} })}
        </section>

        {/* --- PRIMITIVA: ARRAY GRID --- */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 border-b-2 pb-2 text-blue-800">
            <span className="text-2xl">⬛</span> Primitiva 5: ArrayGrid
          </h2>
          {renderStateVariants(ArrayGrid, { q: { a: 2, b: 3, emoji: "🍩" } })}
        </section>

        {/* --- PRIMITIVA: SINGAPORE BARS --- */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 border-b-2 pb-2 text-blue-800">
            <span className="text-2xl">📊</span> Primitiva 6: SingaporeBars
          </h2>
          {renderStateVariants(SingaporeBars, { q: { a: 4, b: 2 }, disabled: false, onAnswer: () => {} })}
        </section>

        {/* --- PRIMITIVA: NUMBER LINE --- */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 border-b-2 pb-2 text-blue-800">
            <span className="text-2xl">📏</span> Primitiva 7: NumberLine
          </h2>
          {renderStateVariants(NumberLine, { min: 0, max: 10, step: 1, currentValue: 4, targetValue: 7, highlightedRanges: [{ start: 2, end: 5 }] })}
        </section>

        {/* --- PRIMITIVA: INTERACTIVE NUMBER LINE --- */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 border-b-2 pb-2 text-blue-800">
            <span className="text-2xl">🐸</span> Primitiva 8: InteractiveNumberLine
          </h2>
          {renderStateVariants(InteractiveNumberLine, { q: { nlStart: 0, nlEnd: 10, nlStartPos: 2 }, disabled: false, onAnswer: () => {} })}
        </section>
      </div>
    </div>
  );
}
