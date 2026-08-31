import React, { useState } from "react";
import { Kid, Track } from "../../types";
import { FONT, FRESH } from "../Mascot";
import { LearningPath } from "../LearningPath";
import { SUBJECTS } from "../../subjects";
import { isTrackUnlocked, UnlockStatus } from "../../curriculum/motores/unlockEngine";

interface Props {
  kid: Kid;
  prog: Record<string, any>;
  tracks: Track[];
  unlockStatus: UnlockStatus;
  onTrack: (t: Track) => void;
}

export function JourneyTab({ kid, prog, tracks: allMathTracks, unlockStatus, onTrack }: Props) {
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
    const t = subject.id === "mat"
      ? allMathTracks.filter(track => Boolean(track.graphId))
      : subject.tracks[grade as "pre"|"ano1"|"ano2"] || [];
    return t.map(track => ({ ...track, island: track.island || subject.id }));
  })();

  /**
   * O painel de progresso da criança.
   *
   * Aqui havia uma estimativa de TEMPO RESTANTE — "31h 15m restantes" na
   * primeira vez que a criança abre o mapa. Duas coisas erradas de uma vez:
   *
   * - **Diz o que falta, não o que ela fez.** Para quem está em zero, o painel
   *   inteiro anunciava "zero de noventa" e "trinta e uma horas pela frente".
   *   Isso desanima um adulto; numa criança de seis anos é pior.
   * - **É informação de adulto.** Quanto tempo o programa ainda leva é pergunta
   *   de quem planeja a rotina — e essa pergunta tem resposta no painel dos
   *   pais, que é onde a estimativa continua existindo.
   *
   * O que ficou é o que a criança pode usar: quantas ela já dominou, e quantas
   * estão ABERTAS agora — o número que responde "o que eu posso fazer hoje".
   */
  const completedTracks = tracks.filter(t => (prog[t.id]?.lvl || 0) >= 5);
  const totalTracks = tracks.length;

  // A MESMA função que o mapa usa para decidir se o nó abre. Recontar a regra
  // aqui daria um número que discorda do que a criança vê logo abaixo.
  const abertasAgora = tracks.filter(t => isTrackUnlocked(t.id, t.graphId, unlockStatus)).length;

  const progressPct = totalTracks > 0 ? Math.round((completedTracks.length / totalTracks) * 100) : 0;

  return (
    <div className="animate-[mkPop_0.25s_ease-out_1]">
      <div className="mb-10">
         <div className="text-center mb-6 mt-4">
           <h2 className="text-2xl font-black text-indigo-900" style={{ fontFamily: FONT }}>Jornada</h2>
           <p className="text-sm font-bold text-slate-500 mt-1">Siga a trilha. Uma de cada vez.</p>
         </div>

         {/* Painel de Diagnóstico do Programa da Jornada */}
         <div className="mb-8 mx-2 bg-white rounded-3xl p-5 border-2 border-indigo-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <h3 className="text-sm font-black text-indigo-900 mb-4" style={{ fontFamily: FONT }}>
               Seu progresso
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
               <div className="bg-indigo-50/50 rounded-2xl p-3 border border-indigo-100">
                  <div className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest mb-1">
                     Você já dominou
                  </div>
                  <div className="text-xl font-black text-indigo-700">
                     {completedTracks.length} <span className="text-sm font-bold text-indigo-400">de {totalTracks}</span>
                  </div>
               </div>
               
               <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100">
                  <div className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest mb-1">
                     Abertas agora
                  </div>
                  <div className="text-xl font-black text-emerald-700">
                     {abertasAgora} <span className="text-sm font-bold text-emerald-500">para jogar</span>
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
              {progressPct}% desta Jornada
            </div>
         </div>

         {availableSubjects.length > 1 && (
           <div className="flex flex-nowrap gap-2 mb-6 overflow-x-auto pb-4 px-1 mx-1 no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
             {availableSubjects.map(s => (
               <button
                 key={s.id}
                 onClick={() => setActiveSubject(s.id)}
                 className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all shadow-sm shrink-0 border-2 ${activeSubject === s.id ? 'bg-indigo-600 border-indigo-700 text-white shadow-md scale-105' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
               >
                 <span className="text-xl">{s.icon}</span>
                 {s.nome}
               </button>
             ))}
           </div>
         )}

         {tracks.length > 0 ? (
           <LearningPath 
              tracks={tracks}
              progOf={(id) => prog[id] || FRESH()}
              unlockStatus={unlockStatus}
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
