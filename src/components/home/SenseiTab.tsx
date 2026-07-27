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
  onMixed: () => void;
  setActiveShellTab: (tab: any) => void;
}

export function SenseiTab({ kid, prog, aulaPlan, rec, onMatricula, onAula, onTrack, onMixed, setActiveShellTab }: Props) {
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

      {/* ▶️ MINHA AULA -> A AULA DO MESTRE */}
      {Object.keys(prog).length > 0 && (
        <div className="mb-8 relative overflow-hidden card-block border-2" style={{ borderColor: "#E2E8F0", boxShadow: "0 6px 0 #CBD5E1", borderRadius: 24 }}>
          <button
            onClick={() => {
              sfx.level();
              onAula();
            }}
            className="w-full text-left p-5 select-none relative cursor-pointer active:translate-y-0.5 transition-all"
            style={{ background: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)" }}
          >
            <span className="pointer-events-none absolute w-1/3 h-full -left-[70%] bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[mkShine_3s_ease-in-out_infinite]" />
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1.5 text-slate-800 bg-slate-200 border-2 border-slate-300 rounded-lg inline-block shadow-sm">
                🎓 O Sensei preparou pra você
              </span>
              <span className="text-3xl animate-bounce">📚</span>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 24, color: "#1E293B", marginBottom: 4 }}>
              A Lição do Dia
            </div>
            <div className="text-sm font-bold mt-1 leading-snug text-slate-600 mb-4">
              {aulaPlan.resumo} · A jornada é contínua, jogue quantas vezes quiser! ✨
            </div>
            <div className="mt-2 inline-flex items-center justify-center w-full gap-2 text-sm font-black text-white bg-slate-800 px-5 py-3 rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-transform">
              <span>Iniciar Sessão de Estudos</span>
              <span className="text-lg">▶</span>
            </div>
          </button>
        </div>
      )}

      {/* 2. TAREFAS DO SENSEI */}
      <div className="mt-8 bg-white p-5 rounded-3xl shadow-sm border-2 border-slate-100">
        <div className="flex items-center gap-2 mb-1 pl-1">
          <span className="text-2xl">📋</span>
          <span className="font-black text-slate-800" style={{ fontFamily: FONT, fontSize: 18 }}>
            Tarefas do Sensei
          </span>
        </div>
        <p className="text-xs font-bold text-slate-500 mb-5 pl-1">Mergulhe no Dojo para dominar estas habilidades.</p>
        
        <div className="flex flex-col gap-4">
          {/* Treino Inteligente */}
          <button
            onClick={() => {
              sfx.level();
              onMixed();
            }}
            className="w-full text-left p-4 select-none relative transition-all cursor-pointer active:translate-y-1 rounded-2xl border-2"
            style={{
              background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
              borderColor: '#94A3B8',
              boxShadow: '0 4px 0 #64748B',
            }}
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md inline-block text-slate-800 bg-slate-200 border-2 border-slate-300">
                🧠 Treino Automático
              </span>
              <span className="text-2xl">🤖</span>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, color: '#1E293B' }}>
              Treino Inteligente
            </div>
            <div className="text-xs font-bold mt-1 leading-snug text-slate-600">
              O algoritmo escolhe a melhor combinação de exercícios baseada no seu progresso!
            </div>
          </button>

          {/* Desafio do Mestre */}
          <button
            onClick={() => {
              sfx.level();
              onMixed();
            }}
            className="w-full text-left p-4 select-none relative transition-all cursor-pointer active:translate-y-1 rounded-2xl border-2"
            style={{
              background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
              borderColor: '#F97316',
              boxShadow: '0 4px 0 #EA580C',
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

          {/* Foco Específico */}
          {rec && (
            <button
              onClick={() => {
                sfx.tick();
                onTrack(rec.track);
              }}
              className="w-full text-left p-4 select-none relative transition-all cursor-pointer active:translate-y-1 rounded-2xl border-2"
              style={{
                background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                borderColor: '#22C55E',
                boxShadow: '0 4px 0 #16A34A',
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md inline-block text-green-900 bg-green-200 border-2 border-green-300">
                  🎯 Foco Específico
                </span>
                <span className="text-2xl">🥋</span>
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, color: '#166534' }}>
                {rec.track.name}
              </div>
              <div className="text-xs font-bold mt-1 leading-snug text-green-900/80">
                {rec.reason || 'Sua missão de foco do dia no Dojo!'}
              </div>
            </button>
          )}
        </div>
      </div>

      {/* 3. SUGESTAO OFICINA */}
      {aulaPlan.resgates.length > 0 && (
         <div className="mt-6 mb-6 bg-slate-50 p-5 rounded-3xl border-2 border-slate-200">
            <div className="flex items-center gap-2 mb-1 pl-1">
              <span className="text-2xl">🚑</span>
              <span className="font-black text-slate-800" style={{ fontFamily: FONT, fontSize: 18 }}>
                Oficina de Resgate
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 mb-4 pl-1">
              Hora de consertar os motores.
            </p>

            <button 
              onClick={() => { sfx.tick(); setActiveShellTab("oficina"); }} 
              className="w-full text-left p-4 select-none relative transition-all cursor-pointer active:translate-y-1 rounded-2xl border-2 bg-white"
              style={{
                borderColor: '#94A3B8',
                boxShadow: '0 4px 0 #64748B',
              }}
            >
               <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md inline-block text-slate-700 bg-slate-200 border-2 border-slate-300">
                    🔧 Reparos Necessários
                  </span>
                  <span className="text-2xl animate-pulse">🛠️</span>
               </div>
               <div>
                 <div className="font-black text-slate-800 text-lg" style={{ fontFamily: FONT }}>Missões de Resgate!</div>
                 <div className="text-xs text-slate-600 font-bold mt-1">O algoritmo identificou {aulaPlan.resgates.length} conceitos importantes para revisar e fixar.</div>
               </div>
            </button>
         </div>
      )}
    </div>
  );
}
