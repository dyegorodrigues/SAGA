import React, { useState } from "react";
import { Kid, Track } from "../../types";
import { FONT, FRESH } from "../Mascot";
import { LearningPath } from "../LearningPath";
import { SUBJECTS } from "../../subjects";

interface Props {
  kid: Kid;
  prog: Record<string, any>;
  onTrack: (t: Track) => void;
}

export function JourneyTab({ kid, prog, onTrack }: Props) {
  const [activeSubject, setActiveSubject] = useState("mat");
  const grade = kid.grade || "pre";

  // Retorna matérias que tem tracks para a série da criança
  const availableSubjects = SUBJECTS.filter(s => {
    const tracks = s.tracks[grade as "pre"|"ano1"|"ano2"] || [];
    return tracks.length > 0;
  });

  const subject = availableSubjects.find(s => s.id === activeSubject) || availableSubjects[0];
  
  const tracks = (() => {
    if (!subject) return [];
    const t = subject.tracks[grade as "pre"|"ano1"|"ano2"] || [];
    return t.map(track => ({ ...track, island: track.island || subject.id }));
  })();

  // --- DIAGNÓSTICO E CÁLCULO DE TEMPO ---
  // Calcula o progresso real da criança na matéria ativa
  const tracksWithProg = tracks.filter(t => prog[t.id]);
  const completedTracks = tracks.filter(t => (prog[t.id]?.lvl || 0) >= 5);
  const totalTracks = tracks.length;
  
  // Média de questões (tot) feitas por trilha iniciada
  const totalTot = tracksWithProg.reduce((acc, t) => acc + (prog[t.id]?.tot || 0), 0);
  const avgTotPerTrack = tracksWithProg.length ? Math.round(totalTot / tracksWithProg.length) : 0;
  
  // Estimativa de tempo baseado na premissa: 1 questão ~ 25 segundos
  const avgSecondsPerTrack = avgTotPerTrack * 25; 
  const estimatedSecondsRemaining = (totalTracks - completedTracks.length) * (avgSecondsPerTrack || (50 * 25)); // fallback: 50 questões/trilha
  
  const formatTime = (seconds: number) => {
    if (seconds === 0) return "--";
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const progressPct = totalTracks > 0 ? Math.round((completedTracks.length / totalTracks) * 100) : 0;

  return (
    <div className="animate-[mkPop_0.25s_ease-out_1]">
      <div className="mb-10">
         <div className="text-center mb-6 mt-4">
           <h2 className="text-2xl font-black text-indigo-900" style={{ fontFamily: FONT }}>Jornada</h2>
           <p className="text-sm font-bold text-slate-500 mt-1">Siga a trilha de aventuras!</p>
         </div>

         {/* Painel de Diagnóstico do Programa da Jornada */}
         <div className="mb-8 mx-2 bg-white rounded-3xl p-5 border-2 border-indigo-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <h3 className="text-sm font-black text-indigo-900 mb-4" style={{ fontFamily: FONT }}>
               📊 Diagnóstico do Programa
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
               <div className="bg-indigo-50/50 rounded-2xl p-3 border border-indigo-100">
                  <div className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest mb-1">
                     Domínio Atual
                  </div>
                  <div className="text-xl font-black text-indigo-700">
                     {completedTracks.length} <span className="text-sm font-bold text-indigo-400">/ {totalTracks} Trilhas</span>
                  </div>
               </div>
               
               <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100">
                  <div className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest mb-1">
                     Tempo Estimado
                  </div>
                  <div className="text-xl font-black text-emerald-700">
                     {formatTime(estimatedSecondsRemaining)} <span className="text-sm font-bold text-emerald-500">restantes</span>
                  </div>
               </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 mb-1 overflow-hidden">
               <div 
                 className="bg-indigo-500 h-3 rounded-full transition-all duration-1000 ease-out relative"
                 style={{ width: `${progressPct}%` }}
               >
                 <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse" />
               </div>
            </div>
            <div className="text-right text-[10px] font-bold text-slate-400">
               {progressPct}% concluído para o nível {grade === "pre" ? "Pré-escola" : grade === "ano1" ? "1º Ano" : "2º Ano"}
            </div>
         </div>

         {availableSubjects.length > 1 && (
           <div className="flex justify-center gap-2 mb-6 overflow-x-auto pb-2 px-4 no-scrollbar">
             {availableSubjects.map(s => (
               <button
                 key={s.id}
                 onClick={() => setActiveSubject(s.id)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${activeSubject === s.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
               >
                 <span className="text-lg">{s.icon}</span>
                 {s.nome}
               </button>
             ))}
           </div>
         )}

         {tracks.length > 0 ? (
           <LearningPath 
              tracks={tracks}
              progOf={(id) => prog[id] || FRESH()}
              onSelectTrack={onTrack}
           />
         ) : (
           <div className="text-center p-8 text-slate-500 font-bold">
             Nenhuma trilha disponível para esta matéria nesta série ainda.
           </div>
         )}
      </div>
    </div>
  );
}
