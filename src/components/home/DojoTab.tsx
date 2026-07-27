import React, { useMemo, useState } from "react";
import { Track, Progress } from "../../types";
import { UnlockStatus } from "../../curriculum/motores/unlockEngine";
import { C, FONT, sfx } from "../Mascot";
import { SUBJECTS } from "../../subjects";
import { dojo_add } from "../../curriculum/fichas/dojo/sensei/dojo_add";
import { dojo_sub } from "../../curriculum/fichas/dojo/sensei/dojo_sub";
import { dojo_mul } from "../../curriculum/fichas/dojo/sensei/dojo_mul";
import { dojo_div } from "../../curriculum/fichas/dojo/sensei/dojo_div";

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
  const [mode, setMode] = useState<'garden' | 'sensei'>('garden');

  const tracks = (() => {
    const mat = SUBJECTS.find(s => s.id === 'mat');
    if (!mat) return [];
    const allMat = ["pre", "ano1", "ano2"].flatMap(g => mat.tracks[g as "pre" | "ano1" | "ano2"] || []);
    return Array.from(new Map(allMat.map(t => [t.id, t])).values());
  })();

  const dojoStats = useMemo(() => {
    let ok = 0;
    let tot = 0;
    let batteries = 0;
    // We can infer batteries from logs or from sum(tot) / 10 if each battery is ~10.
    for (const p of Object.values(prog)) {
      ok += p.ok || 0;
      tot += p.tot || 0;
    }
    batteries = Math.floor(tot / 10);
    const accuracy = tot > 0 ? Math.round((ok / tot) * 100) : 0;
    return { ok, tot, batteries, accuracy };
  }, [prog]);

  return (
    <div className="animate-[mkPop_0.25s_ease-out_1]">
      <div className="text-center mb-6 mt-2">
          <h2 className="text-2xl font-black text-purple-900" style={{ fontFamily: FONT }}>Dojo Matemático</h2>
          <p className="text-sm font-bold text-slate-500 mt-1">Treine sua fluência e velocidade! ⚡</p>
      </div>

      <div className="flex bg-slate-100 rounded-xl p-1 mb-6 border-2 border-slate-200">
        <button 
          onClick={() => { sfx.tick(); setMode('garden'); }}
          className={`flex-1 py-2 rounded-lg font-black text-sm transition-all ${mode === 'garden' ? 'bg-white shadow-sm text-green-700' : 'text-slate-400 hover:text-slate-600'}`}
          style={{ fontFamily: FONT }}
        >
          🪴 Dojo Garden
        </button>
        <button 
          onClick={() => { sfx.tick(); setMode('sensei'); }}
          className={`flex-1 py-2 rounded-lg font-black text-sm transition-all ${mode === 'sensei' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-400 hover:text-slate-600'}`}
          style={{ fontFamily: FONT }}
        >
          🦊 Dojo Sensei
        </button>
      </div>

      {mode === 'garden' && (
        <div className="animate-[mkPop_0.2s_ease-out_1]">
          <div className="flex items-center gap-2 mb-3 pl-1">
            <span className="text-xl">🎯</span>
            <span className="font-bold text-slate-600" style={{ fontFamily: FONT, fontSize: 16 }}>
              Treinos Específicos (CRA)
            </span>
          </div>
          <p className="text-xs text-slate-500 font-bold mb-4 pl-1">
            Revisão guiada do Concreto ao Abstrato. Selecione o tópico para treinar o que você já aprendeu.
          </p>
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
      )}

      {mode === 'sensei' && (
        <div className="animate-[mkPop_0.2s_ease-out_1]">

          {/* 1. TEMPLOS DE OPERAÇÕES */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3 pl-1">
              <span className="text-xl">⛩️</span>
              <span className="font-bold text-slate-600" style={{ fontFamily: FONT, fontSize: 16 }}>
                Os Templos
              </span>
            </div>
            <p className="text-xs text-slate-500 font-bold mb-4 pl-1">
              Ginástica pura. Cálculo mental rápido e direto.
            </p>
            <div className="grid grid-cols-2 gap-3.5">
              <button onClick={() => { sfx.tick(); onOpenPicker(dojo_add); }} className="p-4 rounded-2xl border-2 border-rose-200 bg-rose-50 text-left active:translate-y-1 transition-all" style={{boxShadow: '0 4px 0 #FECDD3'}}>
                <div className="text-3xl mb-1">➕</div>
                <div className="font-black text-rose-700">Templo da<br/>Adição</div>
              </button>
              <button onClick={() => { sfx.tick(); onOpenPicker(dojo_sub); }} className="p-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50 text-left active:translate-y-1 transition-all" style={{boxShadow: '0 4px 0 #C7D2FE'}}>
                <div className="text-3xl mb-1">➖</div>
                <div className="font-black text-indigo-700">Templo da<br/>Subtração</div>
              </button>
              <button onClick={() => { sfx.tick(); onOpenPicker(dojo_mul); }} className="p-4 rounded-2xl border-2 border-amber-200 bg-amber-50 text-left active:translate-y-1 transition-all" style={{boxShadow: '0 4px 0 #FDE68A'}}>
                <div className="text-3xl mb-1">✖️</div>
                <div className="font-black text-amber-700">Templo da<br/>Multiplicação</div>
              </button>
              <button onClick={() => { sfx.tick(); onOpenPicker(dojo_div); }} className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-left active:translate-y-1 transition-all" style={{boxShadow: '0 4px 0 #A7F3D0'}}>
                <div className="text-3xl mb-1">➗</div>
                <div className="font-black text-emerald-700">Templo da<br/>Divisão</div>
              </button>
            </div>
          </div>
          
          {/* DESAFIO DO MESTRE NO FINAL */}
          <div className="mt-8">
            <button
              onClick={() => {
                sfx.level();
                onMixed();
              }}
              className="w-full text-left p-4 select-none relative transition-all cursor-pointer active:translate-y-1 rounded-2xl border-2"
              style={{
                background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
                borderColor: '#EA580C',
                boxShadow: '0 4px 0 #C2410C',
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md inline-block text-orange-900 bg-orange-200 border-2 border-orange-300">
                  🦊 Desafio do Mestre
                </span>
                <span className="text-2xl">🏆</span>
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, color: '#9A3412' }}>
                Treino Mestre (Misto)
              </div>
              <div className="text-xs font-bold mt-1 leading-snug text-orange-900/80">
                Tudo misturado! Teste seus reflexos com todos os tópicos que você já aprendeu. As moedinhas valem EM DOBRO! 🪙🪙
              </div>
            </button>
          </div>

        </div>
      )}

      <div className="mt-8 pt-6 border-t-2 border-slate-100">
        <h3 className="text-lg font-black text-slate-700 mb-3" style={{ fontFamily: FONT }}>Suas Estatísticas no Dojo</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-black text-slate-800" style={{ fontFamily: FONT }}>{dojoStats.batteries}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Baterias</div>
          </div>
          <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-black text-slate-800" style={{ fontFamily: FONT }}>{dojoStats.accuracy}%</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Precisão</div>
          </div>
          <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 text-center shadow-sm col-span-2">
            <div className="text-2xl font-black text-slate-800" style={{ fontFamily: FONT }}>{dojoStats.tot}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Desafios Enfrentados</div>
          </div>
        </div>
      </div>
    </div>
  );
}
