import React, { useMemo } from "react";
import { Track, Progress } from "../../types";
import { UnlockStatus } from "../../utils/unlockEngine";
import { C, FONT, sfx } from "../Mascot";
import { SUBJECTS } from "../../subjects";
import { dojo_add } from "../../curriculum/fichas/dojo_add";
import { dojo_sub } from "../../curriculum/fichas/dojo_sub";
import { dojo_mul } from "../../curriculum/fichas/dojo_mul";
import { dojo_div } from "../../curriculum/fichas/dojo_div";

interface Props {
  onOpenPicker: (t: Track) => void;
  onTrack: (t: Track) => void;
  prog: Record<string, any>;
  unlockStatus: UnlockStatus;
  mixedDoneToday: boolean;
  onMixed: () => void;
  renderTrackCard: (t: Track) => React.ReactNode;
}

export function DojoTab({ prog, unlockStatus, mixedDoneToday, onMixed, renderTrackCard, onTrack, onOpenPicker }: Props) {
  const tracks = (() => {
    const mat = SUBJECTS.find(s => s.id === 'mat');
    if (!mat) return [];
    const allMat = ["pre", "ano1", "ano2"].flatMap(g => mat.tracks[g as "pre" | "ano1" | "ano2"] || []);
    return Array.from(new Map(allMat.map(t => [t.id, t])).values());
  })();

  return (
    <div className="animate-[mkPop_0.25s_ease-out_1]">
      <div className="text-center mb-6 mt-2"> 
         <h2 className="text-2xl font-black text-purple-900" style={{ fontFamily: FONT }}>Dojo Matemático</h2> 
         <p className="text-sm font-bold text-slate-500 mt-1">Treine sua fluência e velocidade! ⚡</p>
      </div>

      {/* 1. ACADEMIAS DE OPERAÇÕES */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3 pl-1">
          <span className="text-xl">🏋️</span>
          <span className="font-bold text-slate-600" style={{ fontFamily: FONT, fontSize: 16 }}>
            As Academias
          </span>
        </div>
        <p className="text-xs text-slate-500 font-bold mb-4 pl-1">
          Ginástica pura. O sistema adapta a dificuldade com imagens ou apenas números, de acordo com seu domínio.
        </p>
        <div className="grid grid-cols-2 gap-3.5">
          <button onClick={() => { sfx.tick(); onOpenPicker(dojo_add); }} className="p-4 rounded-2xl border-2 border-rose-200 bg-rose-50 text-left active:translate-y-1 transition-all" style={{boxShadow: '0 4px 0 #FECDD3'}}>
            <div className="text-3xl mb-1">➕</div>
            <div className="font-black text-rose-700">Academia da<br/>Adição</div>
          </button>
          <button onClick={() => { sfx.tick(); onOpenPicker(dojo_sub); }} className="p-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50 text-left active:translate-y-1 transition-all" style={{boxShadow: '0 4px 0 #C7D2FE'}}>
            <div className="text-3xl mb-1">➖</div>
            <div className="font-black text-indigo-700">Academia da<br/>Subtração</div>
          </button>
          <button onClick={() => { sfx.tick(); onOpenPicker(dojo_mul); }} className="p-4 rounded-2xl border-2 border-amber-200 bg-amber-50 text-left active:translate-y-1 transition-all" style={{boxShadow: '0 4px 0 #FDE68A'}}>
            <div className="text-3xl mb-1">✖️</div>
            <div className="font-black text-amber-700">Academia da<br/>Multiplicação</div>
          </button>
          <button onClick={() => { sfx.tick(); onOpenPicker(dojo_div); }} className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-left active:translate-y-1 transition-all" style={{boxShadow: '0 4px 0 #A7F3D0'}}>
            <div className="text-3xl mb-1">➗</div>
            <div className="font-black text-emerald-700">Academia da<br/>Divisão</div>
          </button>
        </div>
      </div>

      {/* 2. TREINOS ESPECÍFICOS */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3 pl-1">
          <span className="text-xl">🎯</span>
          <span className="font-bold text-slate-600" style={{ fontFamily: FONT, fontSize: 16 }}>
            Treinos Específicos
          </span>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {['N1', 'N2', 'N3', 'N4', 'N5', 'N6'].map(strand => {
            const strandTracks = tracks.filter(t => t.id.startsWith(strand) && (prog[t.id]?.stars || 0) > 0);
            if (strandTracks.length === 0) return null;
            const titles: Record<string, string> = {
              'N1': 'Alfabetização e Quantificação',
              'N2': 'Sistema Decimal',
              'N3': 'Adição e Subtração',
              'N4': 'Multiplicação e Divisão',
              'N5': 'Frações',
              'N6': 'Decimais e Porcentagem'
            };
            return (
              <details key={strand} className="bg-white rounded-2xl shadow-sm border-2 border-slate-100 overflow-hidden group">
                <summary className="p-4 font-black text-slate-700 cursor-pointer list-none flex justify-between items-center" style={{ fontFamily: FONT }}>
                  {titles[strand]}
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 grid grid-cols-2 gap-3 bg-slate-50 border-t-2 border-slate-100">
                  {strandTracks.map(renderTrackCard)}
                </div>
              </details>
            );
          })}
        </div>
      </div>

      {/* 3. DESAFIO DO MESTRE */}
      <div className="mt-10 mb-6">
        <div className="flex items-center gap-2 mb-3 pl-1">
          <span className="text-xl">🦊</span>
          <span className="font-bold text-slate-600" style={{ fontFamily: FONT, fontSize: 16 }}>
            O Desafio do Sensei
          </span>
        </div>
        <p className="text-xs text-slate-500 font-bold mb-4 pl-1">
          Tudo misturado! Teste seus reflexos com tudo que você já aprendeu.
        </p>
        
        <div className="mb-5 relative overflow-hidden card-block border-2" style={{ borderColor: mixedDoneToday ? "#CBD5E1" : "#7C3AED", boxShadow: mixedDoneToday ? "0 6px 0 #CBD5E1" : "0 6px 0 #5B21B6" }}>
          <button
            onClick={() => {
              if (mixedDoneToday) {
                sfx.tick();
                return;
              }
              sfx.level();
              onMixed();
            }}
            className={`w-full text-left p-4 select-none relative transition-all ${mixedDoneToday ? "cursor-default" : "cursor-pointer active:translate-y-0.5"}`}
            style={{
              background: mixedDoneToday
                ? "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)"
                : "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
            }}
          >
            {!mixedDoneToday && (
              <span className="pointer-events-none absolute w-1/3 h-full -left-[70%] bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[mkShine_3.2s_ease-in-out_infinite]" />
            )}
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md inline-block border-2 ${mixedDoneToday ? "text-slate-500 bg-slate-100 border-slate-200" : "text-purple-900 bg-purple-200 border-purple-300"}`}>
                {mixedDoneToday ? "✅ Desafio de hoje completo!" : "🦊 Desafio especial do dia"}
              </span>
              <span className={`text-2xl ${mixedDoneToday ? "" : "animate-bounce"}`}>🏆</span>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, color: mixedDoneToday ? "#64748B" : "#4C1D95" }}>
              Desafio Misto 🦊
            </div>
            <div className={`text-xs font-bold mt-1 leading-snug ${mixedDoneToday ? "text-slate-400" : "text-purple-900/80"}`}>
              {mixedDoneToday
                ? "Você venceu o chefão de hoje! Volte amanhã para um novo desafio. ✨"
                : "10 perguntas de TODAS as suas trilhas — e as moedinhas valem EM DOBRO! 🪙🪙"}
            </div>
            {!mixedDoneToday && (
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-purple-600 px-4 py-1.5 rounded-md shadow-sm hover:scale-105 active:scale-95 transition-transform">
                <span>Enfrentar o Desafio</span>
                <span>🦊</span>
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t-2 border-slate-100">
        <h3 className="text-lg font-black text-slate-700 mb-3" style={{ fontFamily: FONT }}>Suas Estatísticas no Dojo</h3>
        <div className="flex gap-3">
          <div className="flex-1 bg-white border-2 border-slate-100 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-3xl mb-1">🎯</div>
            <div className="text-2xl font-black text-slate-800" style={{ fontFamily: FONT }}>{Object.values(prog).reduce((a, p) => a + (p.ok || 0), 0)}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Acertos Totais</div>
          </div>
          <div className="flex-1 bg-white border-2 border-slate-100 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-3xl mb-1">⚔️</div>
            <div className="text-2xl font-black text-slate-800" style={{ fontFamily: FONT }}>{Object.values(prog).reduce((a, p) => a + (p.tot || 0), 0)}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Desafios</div>
          </div>
        </div>
      </div>

    </div>
  );
}
