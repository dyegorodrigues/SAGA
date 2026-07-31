import React, { useState } from "react";
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
  onMixed: () => void;
  setActiveShellTab: (tab: any) => void;
}

export function SenseiTab({ kid, prog, aulaPlan, rec, onMatricula, onAula, onTrack, onMixed, setActiveShellTab }: Props) {
  const [expandedLesson, setExpandedLesson] = useState(true);
  const [expandedDojo, setExpandedDojo] = useState(true);
  const [expandedRescue, setExpandedRescue] = useState(true);

  return (
    <div className="animate-[mkPop_0.25s_ease-out_1] pb-6">
      <div className="text-center mb-6 mt-2"> 
         <h2 className="text-2xl font-black text-blue-900" style={{ fontFamily: FONT }}>O Sensei SAGA</h2> 
         <p className="text-xs font-extrabold text-slate-500 mt-0.5">Seu plano de estudos e conquistas diárias 🦊</p>
      </div>
      
      {/* 🎒 MATRÍCULA (E3) */}
      {Object.keys(prog).length === 0 && (
        <div className="mb-5 relative overflow-hidden card-block border-2" style={{ borderColor: "#0EA5E9", boxShadow: "0 6px 0 #0369A1", borderRadius: 24 }}>
          <button
            onClick={() => {
              sfx.level();
              onMatricula();
            }}
            className="w-full text-left p-5 select-none relative cursor-pointer active:translate-y-0.5 transition-all"
            style={{ background: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)" }}
          >
            <span className="pointer-events-none absolute w-1/3 h-full -left-[70%] bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[mkShine_2.4s_ease-in-out_infinite]" />
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 text-sky-900 bg-sky-200 border-2 border-sky-300 rounded-md inline-block">
                ✨ Primeira Aventura
              </span>
              <span className="text-2xl animate-bounce">🎒</span>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 20, color: "#0C4A6E" }}>
              Sessão de Boas-Vindas
            </div>
            <div className="text-xs font-bold mt-1 leading-snug text-sky-900/80">
              {kid.petName || "Seu mascote"} quer te conhecer! Vamos descobrir o seu nível sem pressa. 🌟
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-sky-600 px-4 py-2 rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-transform">
              <span>Começar Sondagem</span>
              <span>🚀</span>
            </div>
          </button>
        </div>
      )}

      {/* 1. 🎓 A LIÇÃO DO DIA (TREINO INTELIGENTE GUIADO PELA JORNADA) */}
      {Object.keys(prog).length > 0 && (
        <div className="mb-6 relative overflow-hidden border-2" style={{ borderColor: "#C7D2FE", boxShadow: "0 6px 0 #A5B4FC", borderRadius: 24 }}>
          <div
            className="w-full text-left p-5 select-none relative"
            style={{ background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)" }}
          >
            <span className="pointer-events-none absolute w-1/3 h-full -left-[70%] bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[mkShine_3s_ease-in-out_infinite]" />
            
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 text-indigo-900 bg-indigo-200 border-2 border-indigo-300 rounded-lg inline-block shadow-sm">
                🎓 Lição do Dia · Treino Ativo
              </span>
              <button 
                onClick={() => setExpandedLesson(!expandedLesson)}
                className="text-xs font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 px-2.5 py-1 rounded-md transition-colors"
              >
                {expandedLesson ? "▲ Compactar" : "▼ Expandir"}
              </button>
            </div>

            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, color: "#312E81", marginBottom: 2 }}>
              A Aventura do Sensei
            </div>
            
            <div className="text-[13px] font-bold leading-snug text-indigo-800/90 mb-3">
              {aulaPlan.resumo}
            </div>

            {expandedLesson && (
              <div className="text-[11px] font-bold mt-2 mb-4 leading-snug text-indigo-950 bg-white/70 p-3.5 rounded-2xl border border-indigo-200/60 shadow-inner">
                <div className="mb-2 uppercase tracking-widest text-[9px] font-black text-indigo-900/70">Roteiro Pedagógico Guiado:</div>
                {aulaPlan.aquecimento && (
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500 text-sm">🔥</span> 
                    <span>Aquecimento: <b className="text-indigo-900">{aulaPlan.aquecimento.name}</b></span>
                  </div>
                )}
                {aulaPlan.fronteira && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-emerald-600 text-sm">🌱</span> 
                    <span>Conceito Novo: <b className="text-emerald-950">{aulaPlan.fronteira.name}</b></span>
                  </div>
                )}
                {aulaPlan.fluencia && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-blue-600 text-sm">⚡</span> 
                    <span>Automação: <b className="text-indigo-900">{aulaPlan.fluencia.name}</b></span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => {
                sfx.level();
                onAula();
              }}
              className="mt-1 inline-flex items-center justify-center w-full gap-2 text-[15px] font-black text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
            >
              <span>Iniciar Treino Inteligente</span>
              <span className="text-lg">▶</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. 🥋 MISSÕES DO DOJÔ (PRÁTICA DE VELOCIDADE E AUTOMATIZAÇÃO) */}
      <div className="mb-6 bg-white p-5 rounded-3xl shadow-sm border-2 border-slate-200">
        <div className="flex items-center justify-between mb-1 pl-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥋</span>
            <span className="font-black text-slate-800" style={{ fontFamily: FONT, fontSize: 18 }}>
              Missões do Dojô
            </span>
          </div>
          <button 
            onClick={() => setExpandedDojo(!expandedDojo)}
            className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
          >
            {expandedDojo ? "▲ Compactar" : "▼ Expandir"}
          </button>
        </div>
        <p className="text-xs font-bold text-slate-500 mb-4 pl-1">Exercícios diretos para ganhar velocidade e fluência.</p>
        
        {expandedDojo && (
          <div className="flex flex-col gap-3">
            {/* Treino Cinza: Mistura Total */}
            <button
              onClick={() => {
                sfx.level();
                onMixed();
              }}
              className="w-full text-left p-4 select-none relative transition-all cursor-pointer active:translate-y-0.5 rounded-2xl border-2 hover:border-slate-400"
              style={{
                background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                borderColor: '#94A3B8',
                boxShadow: '0 4px 0 #64748B',
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md inline-block text-slate-800 bg-slate-200 border border-slate-300">
                  🌪️ Automação Geral
                </span>
                <span className="text-xl">⚙️</span>
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, color: '#1E293B' }}>
                Mistura Total (Dojô Geral)
              </div>
              <div className="text-[11px] font-bold mt-1 leading-snug text-slate-600">
                Questões rápidas de tudo que você já desbloqueou. Ideal para afiar os reflexos!
              </div>
            </button>

            {/* Treino Verde: Foco Específico */}
            {rec && (
              <button
                onClick={() => {
                  sfx.tick();
                  onTrack(rec.track);
                }}
                className="w-full text-left p-4 select-none relative transition-all cursor-pointer active:translate-y-0.5 rounded-2xl border-2 hover:border-emerald-500"
                style={{
                  background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                  borderColor: '#22C55E',
                  boxShadow: '0 4px 0 #16A34A',
                }}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md inline-block text-emerald-900 bg-emerald-200 border border-emerald-300">
                    🎯 Foco Específico
                  </span>
                  <span className="text-xl">🥋</span>
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, color: '#166534' }}>
                  {rec.track.name}
                </div>
                <div className="text-[11px] font-bold mt-1 leading-snug text-emerald-900/80">
                  Acelere o domínio desse nó do seu aprendizado atual!
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. 🚑 OFICINA DE RESGATE (CHECKLIST DINÂMICO DE LACUNAS) */}
      {aulaPlan.resgates.length > 0 && (
         <div className="mb-6 bg-rose-50/90 p-5 rounded-3xl border-2 border-rose-200 shadow-sm">
            <div className="flex items-center justify-between mb-1 pl-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚑</span>
                <span className="font-black text-rose-950" style={{ fontFamily: FONT, fontSize: 18 }}>
                  Oficina de Resgate
                </span>
              </div>
              <button 
                onClick={() => setExpandedRescue(!expandedRescue)}
                className="text-xs font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 px-2.5 py-1 rounded-md transition-colors"
              >
                {expandedRescue ? "▲ Compactar" : "▼ Expandir"}
              </button>
            </div>
            
            <p className="text-[11px] font-bold text-rose-800/80 mb-3 pl-1">
              Checklist de lacunas identificadas pelo Radar de Aprendizado.
            </p>

            {expandedRescue && (
              <div className="bg-white p-4 rounded-2xl border-2 border-rose-200 shadow-sm">
                <div className="text-[12px] text-slate-700 font-bold mb-3 leading-snug">
                  O algoritmo mapeou <b>{aulaPlan.resgates.length} conceitos</b> para você revisar antes de prosseguir:
                </div>
                
                <div className="flex flex-col gap-2.5">
                  {aulaPlan.resgates.map((r: any) => (
                    <div 
                      key={r.track.id} 
                      onClick={() => {
                        sfx.tick();
                        onTrack(r.track);
                      }}
                      className="bg-rose-50/70 hover:bg-rose-100/80 cursor-pointer transition-colors rounded-xl p-3 border border-rose-200 flex items-center justify-between gap-3 active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">🛠️</span>
                        <div>
                          <div className="text-xs font-black text-rose-950">{r.track.name}</div>
                          <div className="text-[10px] text-rose-700 font-semibold">Clique para treinar este nó agora</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-rose-600 text-white px-2.5 py-1 rounded-full font-black uppercase tracking-wider shrink-0 shadow-xs">
                        Atenção
                      </span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => { sfx.tick(); setActiveShellTab("oficina"); }} 
                  className="mt-4 w-full py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-xl font-extrabold text-xs text-center transition-colors cursor-pointer border border-rose-300"
                >
                  Abrir Painel Completo da Oficina 🔧
                </button>
              </div>
            )}
         </div>
      )}
    </div>
  );
}

