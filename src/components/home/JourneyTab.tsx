import React from "react";
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
  return (
    <div className="animate-[mkPop_0.25s_ease-out_1]">
      <div className="mb-10">
         <div className="text-center mb-6 mt-8">
           <h2 className="text-2xl font-black text-indigo-900" style={{ fontFamily: FONT }}>Mundo SAGA</h2>
           <p className="text-sm font-bold text-slate-500 mt-1">Siga a trilha de aventuras!</p>
         </div>

         <LearningPath  
            tracks={(() => {
              const grade = kid.grade || "pre";
              // Coleta todas as tracks de todas as matérias para a série da criança
              const allTracks = SUBJECTS.flatMap(s => {
                const tracks = s.tracks[grade as "pre"|"ano1"|"ano2"] || [];
                // Se a track não tiver island, usamos o ID da matéria como island
                return tracks.map(t => ({ ...t, island: t.island || s.id }));
              });
              
              // Remove duplicatas (pode acontecer entre módulos compartilhados)
              return Array.from(new Map(allTracks.map(t => [t.id, t])).values());
            })()}
            progOf={(id) => prog[id] || FRESH()}
            onSelectTrack={onTrack}
         />
      </div>
    </div>
  );
}
