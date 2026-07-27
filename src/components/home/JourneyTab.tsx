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

  return (
    <div className="animate-[mkPop_0.25s_ease-out_1]">
      <div className="mb-10">
         <div className="text-center mb-4 mt-4">
           <h2 className="text-2xl font-black text-indigo-900" style={{ fontFamily: FONT }}>Jornada</h2>
           <p className="text-sm font-bold text-slate-500 mt-1">Siga a trilha de aventuras!</p>
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
