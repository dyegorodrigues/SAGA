import React from "react";
import { Kid, Track } from "../../types";
import { FONT, sfx } from "../Mascot";

interface Props {
  kid: Kid;
  prog: Record<string, any>;
  aulaPlan: any;
  rec: { track: Track, reason: string } | null;
  onMatricula: () => void;
  onAula: () => void;
  onTrack: (t: Track) => void;
  setActiveShellTab: (tab: any) => void;
}

export function SenseiTab({ kid, prog, aulaPlan, rec, onMatricula, onAula, onTrack, setActiveShellTab }: Props) {
  return (
    <div className="animate-[mkPop_0.25s_ease-out_1]">
      <div className="text-center mb-6 mt-2"> 
         <h2 className="text-2xl font-black text-blue-900" style={{ fontFamily: FONT }}>O Tutor SAGA</h2> 
         <p className="text-sm font-bold text-slate-500 mt-1">Plano de estudos diário 🦊</p>
      </div>
      
      {/* 🎒 MATRÍCULA (E3) */}
      {Object.keys(prog).length === 0 && (
        <div className="mb-5 relative overflow-hidden card-block border-2" style={{ borderColor: "#0EA5E9", boxShadow: "0 6px 0 #0369A1" }}>
          <button
            onClick={() => {
              sfx.level();
              onMatricula();
            }}
            className="w-full text-left p-4 select-none relative cursor-pointer active:translate-y-0.5 transition-all"
            style={{ background: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)" }}
          >
            <span className="pointer-events-none absolute w-1/3 h-full -left-[70%] bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[mkShine_2.4s_ease-in-out_infinite]" />
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 text-sky-900 bg-sky-200 border-2 border-sky-300 rounded-md inline-block">
                ✨ Sua primeira aventura
              </span>
              <span className="text-2xl animate-bounce">🎒</span>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 20, color: "#0C4A6E" }}>
              Missão de Boas-Vindas
            </div>
            <div className="text-xs font-bold mt-1 leading-snug text-sky-900/80">
              {kid.petName || "Seu mascote"} quer te conhecer! Mostre o que você já sabe — sem pressa, é só diversão. 🌟
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-sky-600 px-4 py-1.5 rounded-md shadow-sm hover:scale-105 active:scale-95 transition-transform">
              <span>Vamos lá!</span>
              <span>🚀</span>
            </div>
          </button>
        </div>
      )}

      {/* ▶️ MINHA AULA (E2) */}
      {Object.keys(prog).length > 0 && (
        <div className="mb-5 relative overflow-hidden card-block border-2" style={{ borderColor: "#4F46E5", boxShadow: "0 6px 0 #3730A3" }}>
        <button
          onClick={() => {
            sfx.level();
            onAula();
          }}
          className="w-full text-left p-4 select-none relative cursor-pointer active:translate-y-0.5 transition-all"
          style={{ background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)" }}
        >
          <span className="pointer-events-none absolute w-1/3 h-full -left-[70%] bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[mkShine_2.6s_ease-in-out_infinite]" />
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 text-indigo-900 bg-indigo-200 border-2 border-indigo-300 rounded-md inline-block">
              🎓 O Sensei preparou pra você
            </span>
            <span className="text-2xl animate-bounce">📚</span>
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 20, color: "#312E81" }}>
            ▶️ MINHA AULA
          </div>
          <div className="text-xs font-bold mt-1 leading-snug text-indigo-900/80">
            {aulaPlan.resumo} · começa fácil e termina na brincadeira! ✨
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-indigo-600 px-4 py-1.5 rounded-md shadow-sm hover:scale-105 active:scale-95 transition-transform">
            <span>Começar a Aula</span>
            <span>▶</span>
          </div>
        </button>
      </div>
      )}

      {/* 1. MISSÕES DIÁRIAS (Cronograma do Dia) */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3 pl-1">
          <span className="text-xl">📅</span>
          <span className="font-bold text-slate-600" style={{ fontFamily: FONT, fontSize: 16 }}>
            Tarefas do Sensei
          </span>
        </div>
        
        {rec && (
          <button
            onClick={() => {
              sfx.tick();
              onTrack(rec.track);
            }}
            className="w-full text-left p-4 select-none relative transition-all cursor-pointer active:translate-y-0.5 rounded-2xl border-2"
            style={{
              background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
              borderColor: '#3B82F6',
              boxShadow: '0 6px 0 #2563EB',
            }}
          >
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md inline-block text-blue-900 bg-blue-200 border-2 border-blue-300">
                💡 Sugestão do Sensei
              </span>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, color: '#1E3A8A' }}>
              {rec.track.name}
            </div>
            <div className="text-xs font-bold mt-1 leading-snug text-blue-900/80">
              {rec.reason || 'Sua missão de revisão!'}
            </div>
          </button>
        )}
      </div>

      {/* SUGESTAO OFICINA */}
      {aulaPlan.resgates.length > 0 && (
         <div className="mt-8 mb-4">
            <div className="flex items-center gap-2 mb-3 pl-1">
              <span className="text-xl">🚑</span>
              <span className="font-bold text-slate-600" style={{ fontFamily: FONT, fontSize: 16 }}>
                Oficina de Resgate
              </span>
            </div>
            <button onClick={() => { sfx.tick(); setActiveShellTab("oficina"); }} className="w-full bg-emerald-50 border-2 border-emerald-400 p-4 rounded-2xl flex items-center justify-between shadow-[0_4px_0_#34D399] active:translate-y-1 active:shadow-none transition-all text-left">
               <div>
                 <div className="font-black text-emerald-900 text-lg" style={{ fontFamily: FONT }}>Missões de Resgate!</div>
                 <div className="text-xs text-emerald-700 font-bold mt-1">O Guardião da Ponte identificou {aulaPlan.resgates.length} conceitos para revisar.</div>
               </div>
               <span className="text-4xl">🔧</span>
            </button>
         </div>
      )}
    </div>
  );
}
